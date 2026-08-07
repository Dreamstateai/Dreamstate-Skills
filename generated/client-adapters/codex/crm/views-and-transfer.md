# Saved views, import, export

Saved views are durable, revisioned record queries. Import and export are bounded, job-tracked movements of records in and out of the CRM. Both are "read a set of records as one thing" operations; treat a view, an import job, and an export job all as durable objects you inspect before you create a new one, not throwaway filters.

## Saved views: two generations coexist

v1 and v2 saved views are separate systems with different addressing. Do not mix their ids or assume a v1 `view_id` works against a v2 capability.

v1, addressed by `scope_kind`/`scope_value`/`view_id`:
- `saved_views.list`: `{scope_kind: 'object_type'|'folder'|'tag', scope_value}`.
- `saved_views.create`: `{scope_kind, scope_value, name, filter_ast?, group_by?, sort?, layout?, position?}`. `layout` is one of `board|table|calendar|graph|feed|tree|note`.
- `saved_views.update`: `{view_id, ...optional fields}`.
- `saved_views.delete`: `{view_id}`. Deletion needs the exact `view_id` and explicit user confirmation; a name match is not enough, list first to confirm the id.
- `saved_views.results`: `{view_id, limit?, offset?}`, executes the saved view and returns a page.

v2, addressed by `object_definition_id`/`view_id`, with a third addressing scheme for unsaved runs:
- `saved_views.v2_list`: `{object_definition_id}`.
- `saved_views.v2_create`: `{name, query, visibility: 'personal'|'shared', position?}`.
- `saved_views.v2_execute`: `{view_id, limit?, cursor?, request_count?}`.
- `saved_views.v2_runtime_upsert`: `{runtime_key, query}`. Keyed by `runtime_key`, not `view_id`: this is for executing a view-shaped query the user has not saved yet. Use `v2_runtime_upsert` + `v2_execute` when the user wants to see results before deciding whether to save the view, and only call `v2_create` once they confirm they want it kept.

Whichever generation the request's view contract requires, never silently translate a filter the runtime does not support into a different one; if a filter is unsupported, say so instead of substituting an approximate filter and calling the results equivalent. Verify a create or update by reading the view back, and report result pagination honestly (say when a page is partial, not the full match set).

## Import

Import is a staged pipeline: upload the source, stage and validate rows, then create the job that actually applies them.

1. `record_imports.source_upload`: `{object_definition_id, file_name, mime_type: 'text/csv'|'application/csv'|'application/vnd.ms-excel', base64}` (roughly 35MB max decoded).
2. `record_imports.create`: `{object_definition_id, source_file, source_checksum, mapping, operation_mode: 'create'|'update'|'upsert', duplicate_mode: 'skip'|'update'|'error', queue?}`. `source_checksum` is the sha256 of the uploaded file; `mapping` ties source columns to attributes. Get the mapping right before creating the job: a wrong mapping either fails every row or silently writes data into the wrong field.
3. `record_imports.rows_stage`: `{job_id, rows[]}` (max 10,000 rows per call), stages the actual row data against the created job.
4. Poll `record_imports.get`: `{job_id}` for job status, `record_imports.errors_list`: `{job_id, limit?}` for per-row failures, and `record_imports.list`: `{object_definition_id, limit?}` to see recent jobs for the object.

Report partial row outcomes explicitly: "412 of 500 rows imported, 88 failed duplicate check" is the correct shape of an answer, never flattened into a bare "import succeeded." `duplicate_mode: 'error'` means a duplicate fails that row, not the whole job; check `errors_list` rather than assuming a nonzero failure count means nothing landed.

`record_imports.control`: `{job_id, action: 'cancel'|'retry'}`. The `action` enum is the only gate on this control call, no separate confirm field; still, get the user's explicit go-ahead before cancelling or retrying a job that is already in flight, since retry can re-apply rows.

## Export

`record_exports.create`: `{saved_view_id, projection}`. An export is always scoped to an exact saved view's current filter/selection, never an ad hoc, undeclared selection; if the user wants to export a set that has no saved view yet, create the view first (see above), confirm its results look right, then export it.

`record_exports.get`: `{job_id}` for status. `record_exports.download`: `{job_id}` returns `{url, expires_in, file_name}`, a signed, time-limited URL. A download URL is not durable completion by itself: the canonical export job (`get`) is the source of truth on whether the export actually finished; do not treat receiving a download link as proof the export is done if the job status has not been checked.

`record_exports.control`: `{job_id, action: 'cancel'|'retry'}`, same pattern as import control.

## Return shape discipline

For every import or export, return the job id, current status, row-level or file-level outcome, and any error detail, and be explicit about whether a control action (retry/cancel) was requested versus actually applied. Never report an import or export as complete from a queued or in-progress status.

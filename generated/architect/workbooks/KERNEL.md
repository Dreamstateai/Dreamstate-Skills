# Workbooks
<!-- architect-operation-contract
{"required_capability_ids":["attachments.create","attachments.delete","attachments.list","rows.delete","rows.get","rows.query","rows.restore","rows.upsert","selection_snapshots.get","tables.archive","tables.create","tables.get","tables.list","tables.update","views.archive","views.create","views.get","views.list","views.update","workbook_audiences.list","workbooks.archive","workbooks.create","workbooks.duplicate","workbooks.get","workbooks.list","workbooks.overview","workbooks.update","workbooks.update_user_state","worksheet.bootstrap","worksheet.viewport","worksheet_exports.create","worksheet_exports.download","worksheet_exports.get","worksheet_exports.list","worksheets.archive","worksheets.create","worksheets.duplicate","worksheets.list","worksheets.reorder","worksheets.update"]}
-->

Own the durable, reviewable data plane: Workbook, worksheet, saved view, exact row identity, selection snapshot, and export. Do not choose lead sources, run enrichment, decide qualification, author workflow logic, or write sequence copy.

## Inspect before act

1. Resolve an existing target with `workbooks.list`/`get`/`overview`; never infer an id from a name.
2. Open a worksheet with `worksheet.bootstrap`. Preserve its `workbook_id`, `worksheet_id`, revision/etag, schema, source bindings, active view, and row identity fields. A completed run's state carries a deterministic `audit` (qualification rate, cost per qualified row, and, below threshold, the single worst-failing Required column) computed by the platform, not by you; relay it, never recompute it. The thresholds and what the audit means belong to `qualification`.
3. Use `worksheet.viewport` only for later windows. A page is evidence about that page, never an estimate of the whole table.
4. Before a write, re-read the exact object and pass its current revision when supported. On conflict, stop and show drift.

For a new review surface, create the smallest end-to-end artifact: one Workbook, one worksheet, one saved view. Then bootstrap it. A successful create receipt is not proof the right surface exists until the read confirms all three identities.

`tables.list`/`get` resolve the canonical table identity inside a Workbook. `tables.create` requires an explicit row kind, workbook id, and position; declare mixed row kinds rather than hiding them behind `mixed`. `tables.update` changes only name/description. `tables.archive` retires the exact inspected table and does not archive its Workbook or enroll any rows. Read back every mutation before reporting success.

## Identity and provenance

Every row handoff keeps the stable row id, canonical person/company identity when present, source id and source-row key, provider record id, fetched-at time, and raw evidence reference. Never merge rows because display names match. Conflicting email, profile URL, or company-domain identities stay separate or route to review.

Rows are snapshots. `rows.upsert` must name the identity key and provenance being written. `rows.delete` is recoverable row retirement; prefer it only when explicitly requested and report `rows.restore` as the recovery path. Credits already spent are never erased from the audit story.

## Views are lenses, not cohorts

A saved view is a revisioned filter/sort definition. Updating a view does not alter underlying rows. Never hand a live view query to enrollment as if it were immutable. Read the view and resolve its complete reviewed row set; `qualification` owns freezing the final qualified cohort. Workbooks may inspect the returned immutable receipt with `selection_snapshots.get`. See selection-and-exports.md.

## Boundary

Workbook writes are local data-plane writes. They do not enrich, qualify, enroll, activate, or send. `worksheet_exports.create` creates an export artifact; download does not enroll it. Report only states confirmed by receipts.

Read surface-lifecycle.md for lifecycle operations, row-identity.md for identity rules, and selection-and-exports.md for exact handoff.

# Enrichment columns

`record_enrichment.create` starts one enrichment for an exact `record_id` and `attribute_definition_id`; it does not accept a fuzzy person name or a whole cohort. Preserve the returned `job_id`, then use `record_enrichment.get` until terminal. Queued or running is not enriched. Report provider evidence, settled value or explicit null, cost, attempts, and failure reason without copying a value from another record.

Read `columns.list` and available upstream outputs first. Search the resolved library by desired outputs plus available inputs. Choose a maintained definition that directly returns the field, with provider, cost class, match reason, and failure behavior visible. Use `executables.save`/`run` only after the library has no fit.

Build in dependency order: current identity verification, person evidence, company evidence, deterministic derived fields, then downstream model judgments owned by qualification. Add one column, review it, then add the next. Declare input field ids, output shape, provider, provenance fields, expected null behavior, and cost.

Set `run_if` with a separate `columns.update` only after the column exists. A condition may reference only existing fields. It must never depend on row position. Do not assert a required input is empty while simultaneously referencing it in the action prompt.

Paid result cells must expose structured output plus concise reasoning, source/provider, fetched-at, and cost. A raw provider blob can be retained for audit, but is not the reviewed answer. `columns.archive` retires one exact duplicate after inspection; do not delete lineage.

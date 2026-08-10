# Enrichment columns

`record_enrichment.create` starts one enrichment for an exact `record_id` and `attribute_definition_id`; it does not accept a fuzzy person name or a whole cohort. Preserve the returned `job_id`, then use `record_enrichment.get` until terminal. Queued or running is not enriched. Report provider evidence, settled value or explicit null, cost, attempts, and failure reason without copying a value from another record.

Read `columns.list` and available upstream outputs first. Search the resolved library by desired outputs plus available inputs. Choose a maintained definition that directly returns the field, with provider, cost class, match reason, and failure behavior visible. Use `executables.save`/`run` only after the library has no fit.

A column's kind is a real, fixed choice, never a default: `source` pulls new rows in and is the only kind that spends on row volume; `action` calls one exact provider for one exact field; `waterfall` tries an ordered list of providers for the same field and keeps the first result that clears its own threshold, which costs more per attempted cell than a single `action` and is worth it only when no single provider clears an acceptable hit rate alone; `formula` derives a value deterministically from fields already on the row and never costs a provider credit; `ai` is for a genuinely semantic judgment that cannot be expressed as a deterministic comparison. Never reach for `ai` to do what a `formula` or an exact-match `action` already does more cheaply and more auditably; an `ai` column producing a fact a `formula` could compute is a defect to fix, not a stylistic choice.

Build in dependency order: current identity verification, person evidence, company evidence, deterministic derived fields, then downstream model judgments owned by qualification. Add one column, review it, then add the next. Declare input field ids, output shape, provider, provenance fields, expected null behavior, and cost.

Set `run_if` with a separate `columns.update` only after the column exists. A condition may reference only existing fields. It must never depend on row position. Do not assert a required input is empty while simultaneously referencing it in the action prompt.

Paid result cells must expose structured output plus concise reasoning, source/provider, fetched-at, and cost. A raw provider blob can be retained for audit, but is not the reviewed answer. `columns.archive` retires one exact duplicate after inspection; do not delete lineage.

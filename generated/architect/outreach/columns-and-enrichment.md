# Columns, enrichment, and run conditions

## Read the Workbook before adding anything

Before proposing a column, read what already exists: `columns.list` for the current schema, and the source/column dependency graph it sits on. Never build a column that duplicates one already there. Preserve the table's current schema, lineage, and identity fields; a new column extends the graph, it doesn't replace it.

## Search the library before building a generic column

Before designing any column, call `executable_definitions.list_resolved` with the fields you want (`desired_outputs`) and the fields the row already carries (`available_inputs`). Read the returned description, provider, produced fields, cost class, and match reasons: don't guess from a definition id. Prefer a ranked definition that already produces the wanted field over reimplementing it as a generic AI or HTTP column. If a chosen provider is unavailable or its run fails, take the next ranked alternative that produces the same field before falling back to a generic column, and say which ones were tried.

`executables.save` persists a custom definition (for example a bespoke HTTP enrichment) so it can be run again later; `executables.run` executes one directly. Both are the escape hatch after the library search comes up short, not the first move.

## Build one column at a time

Add a column with `columns.add`, wait for it to be reviewed, then move to the next. Never propose two columns in the same turn: each one's output may be the next one's input, and building ahead of review risks a dependency on something not yet confirmed. Declare each column's inputs, outputs, dependencies, provider, expected cost, and failure behavior before proposing it.

For an outreach qualification worksheet, the standard column order is: current-profile verification, person enrichment, company enrichment, required deterministic filters, then AI fit score. Verify current title and company before trusting anything downstream; a stale or conflicting identity is `unsure` or disqualified, never treated as confirmed.

Required company size, location, include-keyword, exclude-keyword, and workspace exclusion-list conditions are deterministic, not AI judgment calls. Apply every workspace-level exclusion before scoring, and again on every future batch against the same list.

## Run conditions: set them as a separate step

Set a run condition (`columns.update` with `run_if`) only after the column exists and has been reviewed, never bundled into the same call that creates it. Never reference a field in an AI prompt that the run condition asserts is empty for the rows that will actually run: after setting a condition that requires a field be unset, go back and strip that field out of the AI prompt body, since it will always be blank for every row the column actually processes.

The canonical predicate has one shape, read two ways:

- **Written** (what this skill emits): `{ "column_key": "<column_key>", "operator": "<op>", "value": <scalar or array> }`. This is asserted byte for byte against what gets stored, so never restate an already-stored condition in the other dialect.
- **Read back** (what the executor evaluates and what a stored condition looks like on inspection): `{ "field": "<column_key>", "op": "<op>", "value": <scalar or array> }`. `column_key`/`operator` normalize to `field`/`op` on read only; storage itself is never rewritten.

Ops: `eq, neq, contains, not_contains, gt, gte, lt, lte, is_set, is_empty, in, not_in`. `is_set`/`is_empty` take no value; `in`/`not_in` take an array. Combine with `{ "kind": "and" | "or", "children": [...] }`, negate with `{ "kind": "not", "child": {...} }`. `run_policy`, `max_rows_per_day`, and `condition_mode` are pacing metadata, not a condition, and belong alongside it, not inside it.

An empty or metadata-only condition means the column always runs. A condition that is present but unreadable is fail-closed: the row is skipped, not billed, not guessed at. Author to the two canonical shapes above; a bespoke shape becomes unreadable and silently skips every row.

## Running and inspecting cells

`columns.run` executes a bounded selection (the review sample: 5-10 real rows, capped and reviewed before anything wider). `columns.run_all` executes the full qualified selection and always follows a `table_runs.preview_cost` call, never precedes one. `cells.inspect` and `cells.read_page` show settled results, including reasoning, provenance, fetched-at, and actual cost, not a raw provider dump. `cells.settle` finalizes a cell's outcome for the run. A missing required-field dependency produces a skipped cell with zero AI cost, not a guessed answer: an AI fit column's `run_if` should assert its upstream verification and enrichment fields are actually populated before it fires, so a missing dependency shows as `unsure`/skipped rather than a wasted paid call.

Remove a column with `columns.archive`, never a hard delete; every settled cell in it represents credits already spent and stays available for audit.

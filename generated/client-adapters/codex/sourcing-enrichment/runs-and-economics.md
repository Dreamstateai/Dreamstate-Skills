# Runs, economics, and recovery

Read `usage.action_costs_get` before quoting unit prices and `usage.limits_get`/`status_get` before promising capacity. Then call `table_runs.preview_cost` against the exact column ids, stable row selection, run conditions, and caps. Treat its result as the planned cost, not a vague estimate.

Run a 5-10-row representative sample. Wait for settlement with `cells.settle`, inspect individual evidence with `cells.inspect` and a bounded page with `cells.read_page`. Report coverage, null/unknown rate, conflicting identity rate, total credits, and cost per usable result. Never infer full-table yield from a tiny sample without labeling uncertainty.

Low-yield audit:

- if fewer than 70% of attempted cells produce usable evidence, name the dominant provider/input failure and pause expansion;
- if duplicates or identity conflicts exceed 10%, repair source identity before more enrichment;
- if cost per usable result exceeds the user's ceiling, remove optional premium steps or change the source angle;
- zero usable results means stop, not “run more to see.”

Inspect exact state with `table_runs.get`/`list`. Use `failure_report` before retry; retry only failed stable row ids. Resume only a paused resumable run, cancel only the inspected active run, and reconcile a column only after showing the drift. Completed effects never replay and an unknown outcome is inspected before any retry.

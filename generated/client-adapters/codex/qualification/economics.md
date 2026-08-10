# Qualification economics

Price the exact classification selection with `table_runs.preview_cost`, constrained to 5-10 representative rows and a credit ceiling. Inspect the sample before wider work. `usage.limits_get` confirms remaining capacity; it does not replace the per-run preview.

After every settled batch, use `rows.count` for exact decided, qualified, not-qualified, unsure, and exclusion counts. Report:

- qualification rate = qualified / decided;
- unsure rate = unsure / total reviewed;
- cost per qualified row = qualification credits / qualified;
- highest-failing required criterion and highest-volume exclusion.

If qualification rate is below 30%, pause expansion and propose one targeted rubric or source change. Below 10%, propose a different scarce-signal source angle. Above 30 credits per qualified row, stop and diagnose duplicate spend, premium optional evidence, source mismatch, or over-strict required criteria. Never “fix” yield by converting a requirement to preferred without explicit user agreement.

For a workbook batch run specifically, this computation is not yours to perform: the platform computes it deterministically after the run and attaches it as `audit` on the run state `workbooks` returns. A `null` value on an otherwise-completed cell is always `unsure`, never a fail; only an explicit fail status disqualifies a row, matching the three-valued evidence rule above. Below the 30% floor, the audit already names the single highest-failing Required column; below 10%, it already flags that a different search angle is warranted. Read and relay that verdict, do not recompute it from row data yourself.

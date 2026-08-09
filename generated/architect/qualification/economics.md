# Qualification economics

Price the exact classification selection with `table_runs.preview_cost`, constrained to 5-10 representative rows and a credit ceiling. Inspect the sample before wider work. `usage.limits_get` confirms remaining capacity; it does not replace the per-run preview.

After every settled batch, use `rows.count` for exact decided, qualified, not-qualified, unsure, and exclusion counts. Report:

- qualification rate = qualified / decided;
- unsure rate = unsure / total reviewed;
- cost per qualified row = qualification credits / qualified;
- highest-failing required criterion and highest-volume exclusion.

If qualification rate is below 30%, pause expansion and propose one targeted rubric or source change. Below 10%, propose a different scarce-signal source angle. Above 30 credits per qualified row, stop and diagnose duplicate spend, premium optional evidence, source mismatch, or over-strict required criteria. Never “fix” yield by converting a requirement to preferred without explicit user agreement.

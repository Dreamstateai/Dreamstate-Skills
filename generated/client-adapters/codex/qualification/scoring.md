# Scoring and evidence

Required failures dominate: one observed required fail produces fit 0 and `not_qualified`. If every required criterion passes, compute preferred score from declared weights, normalized to 0-100. If any required criterion is `unsure` and none fail, status is `unsure` regardless of preferred score.

Never treat null as zero. Never let a high preferred score override a required failure or exclusion. Keep criterion status, observed value, evidence reference, provider/source, fetched-at, reason, and rubric revision beside the aggregate.

Semantic judgments need a narrow rubric that returns the three-valued state and cites only supplied row evidence. A generic narrative or web-search guess is insufficient. Sample at least one real pass, fail, and unsure where available before approving a wider run.

`outreach.icp_classification_create` starts classification work; follow `outreach.icp_classification_job_get` to terminal status. Accepted or queued is not classified. Preserve row ids and rubric revision in the receipt.

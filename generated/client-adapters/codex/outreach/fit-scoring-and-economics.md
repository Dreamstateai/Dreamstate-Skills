# Fit scoring, pricing, and the post-batch audit

## Fit scoring (0-100)

Every criterion the user cares about gets a relevance condition in the score, even one already enforced as a hard filter elsewhere; the score is the user-facing proof that every stated criterion is actually being tracked, not just the ones that happened to be deterministic.

- **Required.** A real failure sets fit to 0 and hides the row from the qualified view. A null value (data hasn't arrived, or the check can't run yet) is `unsure`, stays visible, and never disqualifies. Only an actual observed failure disqualifies; absence of data is not a failure.
- **Nice-to-have.** Carries a declared weight toward the 0-100 score. A miss lowers the score; it never disqualifies on its own.

Every settled enrichment cell carries concise reasoning, provider/source provenance, fetched-at time, and its real cost. A raw provider dump is not a reviewed result and should not be presented as the qualification answer.

## Price before you spend

`table_runs.preview_cost` is the only real dry run in the system: call it before `columns.run_all` or any wider paid run, never after. It prices the exact bindings, columns, selection, and caps that would actually run, so treat its number as the number, not an estimate to round from. `table_sources.preview` (the row-limit-10 source test) and `audiences.preview` are similarly zero-cost and non-committing: neither creates a column, spends a credit, or lands a row.

Run the smallest representative selection first (5-10 rows), with an explicit row cap and credit ceiling, inspect the settled cells and evidence, then decide whether a larger exact selection is warranted. Approval of one selection never authorizes another, and approval of a schema change never authorizes a paid run.

## Post-batch audit: run this after every batch, don't wait to be asked

Compute and report, every time:

- **Qualification rate** = qualified / total decided rows. Get both counts from `rows.count` against the settled filter, not from eyeballing a sample page: an exact denominator is what makes the threshold below trustworthy.
  - ≥ 30%: proceed normally.
  - < 30%: name the single Required criterion with the highest fail rate, and propose one specific change: broaden that criterion, or convert it to nice-to-have.
  - < 10%: also propose a different scarce-signal source angle entirely, not just a looser filter.
- **Cost per qualified lead** = total credits spent / qualified row count.
  - ≤ 30 credits: proceed normally.
  - \> 30 credits: stop expansion and diagnose before continuing. Check in order: was this premium data (verified email, deep enrichment) the user explicitly asked for; is the qualification rate itself low (fix the source or the filter, not the columns); is there a column misconfigured to re-run or over-fetch.

Distinguish data credits from action executions in every cost report; never sum them into one number, and never call something free unless a result explicitly confirmed zero cost or it used the user's own connected account.

## Diagnostics and run lifecycle

`table_runs.get` / `table_runs.list` inspect a run's exact state before any control action. `table_runs.resume` and `table_runs.cancel` act on an exact inspected run id, never a guess. `table_runs.retry` re-runs only the exact failed rows identified by `table_runs.failure_report`; completed rows in the same run stay settled and are never replayed. `table_runs.reconcile_column` repairs a column whose stored state has drifted from its actual cell outcomes, read the drift before reconciling, don't reconcile blind.

`runs.pause` / `runs.resume` / `runs.cancel` control workflow-level runs the same way: inspect with `runs.get` first, pause is free and idempotent, resume continues the same frozen checkpoint, cancel is a separate terminal action. None of these four retries anything; retry lives at `workflows.run_retry` for workflow runs and `table_runs.retry` for table runs.

## Ground cost in a real read, never a guess

Before naming a per-action or per-credit cost in prose, read it rather than recalling it: `usage.action_costs_get` returns the workspace's actual priced action table, the source for what any one action costs, distinct from `table_runs.preview_cost`'s per-run estimate for a specific planned run. Before promising a batch will fit inside what's left, read `usage.limits_get` for granted/consumed/remaining credits, daily cap and reset time, and purchased/overage headroom; `usage.status_get` gives the current usage-plus-overage snapshot when only the summary is needed. Never state a remaining-budget number from memory once one of these has been read this turn, and re-read before a second batch in the same job if meaningful time or spend has passed.

## Volume defaults

Default outreach volume to demand-based (constrained later by `outreach.demand_plan_get`, not asked up front). Use a fixed exact-quantity cohort only when the user states an exact number explicitly; then respect that number as a hard cap on the resulting selection, not a target to round up to.

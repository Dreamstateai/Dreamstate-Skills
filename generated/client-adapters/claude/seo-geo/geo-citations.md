# AI visibility: tracked prompts, probes, and citations

## What a probe measures
A probe is an observation at one moment: the workspace's active tracked prompts get put to the covered engines and the answers get scanned for a brand mention or citation. It is not a live ranking and it does not predict the next answer the same prompt would get. Probes cover ChatGPT and Google AI Overview only. `visibility.probe.start`'s input schema still accepts `perplexity` and `anthropic` as enum values and `visibility.ai_traffic` will legitimately show Perplexity as a referral-traffic *source* (someone clicked through from perplexity.ai), but no probe is ever run against Perplexity and no citation is ever attributed to it. If asked to add Perplexity as a probed engine, say this workspace does not support it rather than passing the enum value.

## Tracked prompts: the object a probe measures
1. `visibility.tracked_prompts.status` first: returns `state` (`needs_context`, `needs_prompts`, or `active`), `active_prompt_count`, `cap`, `last_probed_at`. If `needs_context`, the workspace has no brand context to generate prompts from, resolve that with `brain.context.get` before proceeding. If `needs_prompts`, move to generate/create below before probing.
2. `visibility.tracked_prompts.generate` (write, provider-cost, approval-gated, `count` 1-25 default 25) drafts candidate prompts from brand context; it does not persist them. Review the drafts with the person, then `visibility.tracked_prompts.save` (write, provider-cost, approval-gated, up to 25 per batch) to persist the chosen set, or `visibility.tracked_prompts.create` for a single hand-written prompt.
3. `visibility.tracked_prompts.list` (`include_inactive` flag) and `visibility.tracked_prompts.tags` (tag facets with counts) are free reads for seeing what already exists before proposing more.
4. `visibility.tracked_prompts.update` edits one existing prompt. Never regenerate a whole batch to change one prompt's wording.

## Running and reading a probe batch
`visibility.probe.start` (write, provider-cost, approval-gated) launches a new batch against the active tracked prompts; state the prompt count and covered engines in the approval proposal. Track it with `visibility.probe.status` (by `batch_id`) or `visibility.probe.today` (today's runs, inflight count, `total_runs_expected` vs `completed_runs`) while it is running. Once complete, `visibility.probe.latest` returns the most recent finished batch, `visibility.probe.results` returns the raw per-prompt results for a specific `batch_id`, `visibility.probe.runs_list`/`visibility.probe.run_get` are the historical run ledger for trend questions, and `visibility.probe.recommendations` derives suggested next actions from a batch. Do not call `probe.start` again to "check" a result that `probe.latest` or `probe.status` can already answer; a fresh batch is a new cost.

## `visibility.refresh` is not another probe
`visibility.refresh` (write, provider-cost, async, optional `query_ids`) recomputes and aggregates metric snapshots from data already measured, it does not ask the AI engines a new question. Use `probe.start` when the request is "ask the engines something new"; use `refresh` when the request is "bring the numbers up to date" against existing measurement. Conflating the two either burns a probe budget on stale data or reports a refresh as if new citations were discovered.

## Reading the results
- `visibility.overview` (read, free): the workspace-level aggregate score and observation window.
- `visibility.citations` (read, free): where and how the brand was cited, with source and excerpt.
- `visibility.prompt_metrics_list` (read, free, paginated): per-tracked-prompt performance, `run_count`, `citation_count`, `visibility_pct`, `sentiment`, `latest_sentiment`, `brand_mentions`, `cited_domains`, `last_run_at`. This is the source for "name the worst-performing prompts": sort by `visibility_pct` ascending and report the lowest ones by name with their own numbers, never just the aggregate.
- `visibility.geo_queries_list` (read, free, paginated) is a lighter list of tracked query rows (id, text, source, active flag, last run time) with no performance numbers attached; use it to see what exists or is stale, not for the performance report, that is `prompt_metrics_list`.
- `visibility.sentiment_trend` (read, `days` 7/30/90) and `visibility.ai_traffic` (read) round out the picture: sentiment over time, and referral sessions actually attributed to AI-assistant referrers.

When the request is "what's our score and what's driving it," return both the `visibility.overview` score with its window and the best or worst `prompt_metrics_list` entry with its own score, denominator, and timestamp. Never substitute one for the other or merge their windows.

## Traps
- Passing `perplexity` into `visibility.probe.start`'s `engines` array because the schema technically allows it.
- Reporting `visibility.overview` alone when the person asked what's carrying or dragging performance; that always needs the per-prompt breakdown from `prompt_metrics_list`.
- Treating `geo_queries_list` rows as tracked-prompt performance data; it carries no metrics.
- Calling `probe.start` to refresh stale metrics when `visibility.refresh` already does that without spending a new probe.

# Strategy: ICP, positioning, channel roles, objectives

Strategy decides where and why to play. It is durable: ICP, problem, positioning, proof, channel roles, constraints, objectives, tradeoffs, measurement. It is not a campaign and not a task list. Revise it when the evidence changes, not on a schedule.

## Read order

1. `brain.context.browse` to see what the workspace wiki actually has. A fresh workspace is empty; do not assume a document tree exists.
2. Narrow `brain.context.search`, then exact `brain.context.get` on the selected `node_ref` and published `revision_id`, for current strategy, ICP, positioning, and any cited evidence.
3. `command_center.overview.get` and `command_center.goals.get` for the current primary objective and the aggregated performance snapshot behind it.
4. `gtm.goals_list` for the full paginated set of goals if the single primary goal from `command_center.goals.get` is not enough context (same underlying table, `gtm.goals_list` returns all rows, `command_center.goals.get` returns only the one marked primary).
5. `visibility.overview` and `social.analytics_query` for measured channel performance to check any positioning claim against reality.
6. `brain.companies.get` and `brain.companies.answer` for company-level intelligence when the strategy question is account-specific; `brain.outreach.compare` when comparing how outreach has performed across segments.

Separate canonical claim (what the wiki says), observed metric (what analytics measured), inference (what you conclude), and recommendation (what to do). Never blend them into one unlabeled sentence.

## Named-cohort benchmarks

Before recommending a strategy for a named audience or cohort, call `brain.learning.query_benchmarks` for that approved cohort. Cite only what it returns: the resolved cohort or persona, messaging archetype, reply/meeting-booked/conversion interval, sample and contributor bands, evidence tier, confidence level. If the result is unavailable, sparse, suppressed, or irrelevant, state `insufficient_evidence` and say what population or time window would produce a usable answer. Never invent a number. Never expose a raw cross-workspace row, only the released cohort-level aggregate.

## Social strategy surface

`social.strategy_overview` reads the current content strategy. `social.strategy_plan_progress` reads how the current plan is tracking against it. `social.strategy_archetype_get` and `social.strategy_archetype_benchmark` read the messaging archetype and its comparative performance. `social.strategy_format_targets_suggest` looks like a read but is a write: it persists suggested format targets, not just returns them. Treat it as a mutation requiring the same evidence discipline as `social.strategy_update`, which is the one capability in this list that actually revises the durable strategy row.

## Content pillars

`identity.content_pillars_generate` runs a pillar-generation pipeline and, unless the caller explicitly requests preview mode, persists the result into the workspace's planner pillars. Do not call it expecting a disposable suggestion: by default it writes. Read the current pillars first through workspace-wiki context so you are not silently overwriting a considered set with a fresh LLM guess.

## What "done well" looks like

One coherent decision: ICP, positioning, channel roles, objective, and the single biggest tradeoff, each traced to a specific cited claim or measured number with its date. State the alternatives you considered and rejected, and why. Name a review date and the metric that will tell you if this strategy is wrong. Hand the resulting priorities to `weekly-plan.md`, do not try to sequence the week here.

## Traps

Restating the wiki's existing strategy back to the user with no new evidence is not strategy work, it is a summary; say so plainly if that is all the evidence supports. Recommending a channel with no measured baseline (no `visibility.overview` or `social.analytics_query` read backing it) is a guess dressed as a decision. A strategy claim with no `node_ref`, no metric value, and no date attached should not appear in the output at all.

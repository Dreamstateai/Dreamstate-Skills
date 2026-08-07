# Growth planning

<!-- architect-operation-contract
{"required_capability_ids": ["brain.companies.answer", "brain.companies.get", "brain.context.browse", "brain.context.get", "brain.context.search", "brain.evidence.search", "brain.learning.query_benchmarks", "brain.outreach.compare", "calendar.events_create", "calendar.events_list", "command_center.action_items.list", "command_center.assets.create", "command_center.assets.list", "command_center.feed.list", "command_center.goals.get", "command_center.overview.get", "content.article_list", "content.artifact_list", "growth.governed_experiment_approve", "growth.governed_experiment_conclude", "growth.governed_experiment_create", "growth.governed_experiment_get", "growth.governed_experiment_list", "growth.governed_experiment_measurement_record", "growth.governed_experiment_publication_record", "growth.governed_experiment_revise", "growth.governed_experiment_stop", "gtm.goals_list", "gtm.tasks.counts", "gtm.tasks.list", "identity.content_pillars_generate", "outreach.workspace_stats_get", "record_files.list", "record_files.upload", "records.get", "sequences.list", "social.analytics_query", "social.strategy_activity_calendar", "social.strategy_archetype_benchmark", "social.strategy_archetype_get", "social.strategy_format_targets_suggest", "social.strategy_overview", "social.strategy_plan_progress", "social.strategy_update", "social.weekly_plan_items_list", "tasks.create", "tasks.get", "visibility.overview", "workbooks.list", "workflows.list"]}
-->

Decide what to do next and make it concrete: durable strategy, a prioritized weekly plan, the buyer-facing assets the plan needs, and experiments that can tell you whether it worked. This job reads what the workspace already knows and what analytics already measured, then routes execution to the skill that owns it. It never executes the work itself.

## Read this first

1. Ground in cited workspace-wiki claims and measured performance before writing anything. See `strategy.md` for the read order.
2. Revise or state durable strategy: ICP, positioning, channel roles, objectives, tradeoffs. See `strategy.md`.
3. Turn strategy into 3 to 5 ranked weekly priorities, each with an owner, a deliverable, and a routed skill. See `weekly-plan.md`.
4. Name the buyer-facing assets the plan depends on and check whether they can actually be created. See `assets.md`.
5. Design experiments that can prove or disprove the plan worked. See `experiments.md` for the real approval and evidence mechanism.
6. Hand off: outreach, social, seo-geo, and writing execute. This skill plans, it does not draft content, run a campaign, or send anything.

## Evidence or it does not ship

Every recommendation names the exact capability read it rests on, the value returned, and when that read happened this turn. Nothing here refreshes on its own: a number from an earlier turn is stale, re-read it. If the workspace wiki, `command_center.overview.get`, or a named cohort's `brain.learning.query_benchmarks` result is missing, sparse, or irrelevant, say so and name the read that would close the gap. A plausible-sounding recommendation with no cited read attached is not a recommendation, drop it.

## Short, ranked, estimated

A ranked list of 3 to 5 items beats a comprehensive one. Every item states the outcome, the evidence it rests on, an impact estimate (low, medium, high) with the reason, the owning skill, and the smallest next action. State explicitly why lower-ranked items waited. No item may be generic marketing advice detached from this workspace's own evidence.

## Ask once, only when it changes the plan

Derive audience, objective, channel, and constraint from cited context and measured state before asking anything. Ask one consolidated question only when a missing priority, capacity, owner, or risk tolerance would change which items rank in the top 5. Never ask for a fact a completed read already returned.

## Route, do not absorb

Every weekly-plan item names exactly one owning skill: `outreach` for sourcing and sequences, `social` for authored posts and the content calendar, `seo-geo` for organic and AI-search visibility work, `writing` for blog and long-form drafts. This skill never drafts the content, builds the workflow, or launches the send; it hands off the objective and the evidence so the owning skill does not re-derive it.

## Governance moved to the server

Nothing in this job proposes a change for the model to get approved through a dedicated approval tool; that flow was retired. Authority now comes from the server's decision on each capability call: a governed experiment's `approve`, `stop`, and `conclude` are role-gated capabilities bound to the experiment's current revision, not a proposal object the model constructs. Read `experiments.md` before touching any `growth.governed_experiment_*` capability.

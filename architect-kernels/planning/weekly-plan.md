# Weekly plan: turn strategy into 3 to 5 ranked priorities

The weekly plan is a prioritization and delegation layer, not a social calendar and not an execution shortcut. It converts the strategy into the smallest set of things worth doing this week, each routed to the skill that will actually do it.

## Read order

1. `command_center.overview.get`, `command_center.goals.get`, `command_center.feed.list`, and `command_center.action_items.list` for current objective, aggregated performance, and open review items. `feed.list` and `action_items.list` return the same underlying action-item data under different filters and a different key name; do not present them as two independent sources.
2. `brain.context.search` and `brain.context.get` for the published strategy this plan must serve.
3. `social.strategy_overview`, `social.strategy_activity_calendar`, `social.strategy_plan_progress`, and `social.weekly_plan_items_list` for the current content plan and how it is tracking.
4. `workflows.list`, `sequences.list`, and `outreach.workspace_stats_get` for active outreach work and its measured performance.
5. `content.article_list` and `content.artifact_list` for content already drafted or scheduled, so the plan does not duplicate it.
6. `gtm.goals_list` and `gtm.tasks.list` for goals and tasks on the legacy GTM surface that has not been folded into the canonical task system; read them, but create new tasks through `tasks.create`, not this surface.
7. `workbooks.list` for existing audience/lead workbooks the plan might reference.
8. `visibility.overview` and `social.analytics_query` for the measured baseline each priority must beat.

## Building the ranked list

Produce one diagnosis (what changed, what is off-track, what the evidence shows) and 3 to 5 ranked priorities. Each priority states:

- the outcome it targets and the metric that will show it worked
- the specific evidence and its date (a `command_center.overview.get` read from this turn, not a remembered number)
- an impact estimate: low, medium, or high, with the one-line reason
- the owning skill: `outreach`, `social`, `seo-geo`, or `writing`
- the exact deliverable, dependency, and due date
- the smallest useful next action, small enough to start today

State explicitly why anything ranked 6th or lower was deferred. Distinguish an authored-content schedule (owned by `social`) from Reddit community engagement, outbound sourcing (owned by `outreach`), organic/AI-search visibility work (owned by `seo-geo`), and long-form drafts (owned by `writing`). A plan item that tries to specify how the owning skill should execute is doing that skill's job for it; state the objective and evidence, not the implementation.

## Handoff discipline

This skill does not silently run delegated work. When the user accepts a priority and asks to continue, load the smallest owning skill for that priority and hand it the objective plus the cited evidence so it does not re-derive what was already read. Preserve one shared objective across delegates so two owning skills do not independently produce competing artifacts for the same priority.

## Cross-surface coordination (calendar, task, record)

Only when the user explicitly asks to coordinate a follow-up across the calendar, task system, and a customer record does this skill own that transaction directly, rather than handing it off. Create the exact meeting with `calendar.events_create` and the owner task with `tasks.create`, attach the briefing with `record_files.upload` against the resolved `records.get` record, then read all three back: `calendar.events_list`, `tasks.get`, `record_files.list`. Never claim the coordination is done from the create calls alone; the read-back is the only evidence any of it landed. Never create a second record when the customer record already exists; resolve it with `records.get` first.

## What the plan is not

The plan itself never schedules a post, launches a sequence, or approves an experiment. Those consequences belong to `social`, `outreach`, and the `growth.governed_experiment_*` family respectively (see `experiments.md`). State clearly in the output which items are only planned and which already have a separate durable proposal, run, or receipt.

## Traps

A priority with no evidence citation is a guess with a due date attached, not a priority. A plan that lists more than 5 items dilutes attention; cut to what actually moves the metric this week and note the rest as deferred, not dropped. Treating `command_center.action_items.list` and `command_center.feed.list` as separate signal sources double-counts the same open items.

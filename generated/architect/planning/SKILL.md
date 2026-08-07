---
id: planning
name: Growth planning
description: Decide what to do next, turning workspace evidence into a strategy, a weekly growth plan, the assets it needs, and experiments to test it.
triggers: ["what should we do this week","build a growth plan","set a growth strategy","design an experiment","decide which channel to invest in"]
dependencies: ["context","analytics"]
capability_domains: ["brain","calendar","command_center","content","growth","gtm","identity","outreach","record_files","records","sequences","social","tasks","visibility","workbooks","workflows"]
capability_ids: ["brain.companies.answer","brain.companies.get","brain.context.browse","brain.context.get","brain.context.search","brain.evidence.search","brain.learning.query_benchmarks","brain.outreach.compare","calendar.events_create","calendar.events_list","command_center.action_items.list","command_center.assets.create","command_center.assets.list","command_center.feed.list","command_center.goals.get","command_center.overview.get","content.article_list","content.artifact_list","growth.governed_experiment_approve","growth.governed_experiment_conclude","growth.governed_experiment_create","growth.governed_experiment_get","growth.governed_experiment_list","growth.governed_experiment_measurement_record","growth.governed_experiment_publication_record","growth.governed_experiment_revise","growth.governed_experiment_stop","gtm.goals_list","gtm.tasks.counts","gtm.tasks.list","identity.content_pillars_generate","outreach.workspace_stats_get","record_files.list","record_files.upload","records.get","research.urls_fetch","sequences.list","social.analytics_query","social.strategy_activity_calendar","social.strategy_archetype_benchmark","social.strategy_archetype_get","social.strategy_format_targets_suggest","social.strategy_overview","social.strategy_plan_progress","social.strategy_update","social.weekly_plan_items_list","tasks.create","tasks.get","visibility.overview","workbooks.list","workflows.list"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"plan_state","description":"Prioritized technical and content plan state.","allowed_values":["prioritized","partial","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: a577b099209814dd67d7ed4f750ba19636362a70b6881b9616b1753d2f54b241
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: a7fafedeb45d2a7d
  manifest_digest: 128d6ae0b4f5fd6d10d7a6e5e08a42587040dce1aea6c5a8bf7be5a2a30271b7
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.6.0
  source_release_hash: a577b099209814dd67d7ed4f750ba19636362a70b6881b9616b1753d2f54b241
  generator_version: 1.0.0
  kernel_id: planning
  kernel_file: KERNEL.md
  kernel_sha256: 5e24a9c5a27d0df1e4a401eefad87016cc5d0e75536460aa954628bf6ca21c7d
  adapter_sha256: 28e8981e376ecc46f9b28234784b6e2c3d6c70ade441c99c881812f308374360
  evals_file: evals.json
  evals_sha256: a078f155b2bbefa67d7b3dc9c55ef84c8c1cc5091a272c7e6735ba811a17b1ab
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 51 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 14 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| brain.context.browse | ds_read |
| brain.context.get | ds_read |
| brain.context.search | ds_search action=context |
| content.artifact_list | ds_publish action=list |
| records.get | ds_read, or ds_records action=get |
| research.urls_fetch | ds_read, or ds_search action=web |
| social.analytics_query | ds_analytics action=query |
| social.strategy_activity_calendar | ds_plan action=calendar |
| social.strategy_archetype_benchmark | ds_plan action=benchmarks |
| social.strategy_archetype_get | ds_plan action=overview |
| social.strategy_format_targets_suggest | ds_plan action=suggest |
| social.strategy_overview | ds_plan action=overview |
| social.strategy_plan_progress | ds_plan action=overview |
| social.strategy_update | ds_plan action=update_strategy |
| social.weekly_plan_items_list | ds_plan action=calendar |
| tasks.create | ds_records action=task_create |
| tasks.get | ds_records action=task_list |
| workbooks.list | ds_workbook action=list |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- brain.companies.answer
- brain.companies.get
- brain.evidence.search
- brain.learning.query_benchmarks
- brain.outreach.compare
- calendar.events_create
- calendar.events_list
- command_center.action_items.list
- command_center.assets.create
- command_center.assets.list
- command_center.feed.list
- command_center.goals.get
- command_center.overview.get
- content.article_list
- growth.governed_experiment_approve
- growth.governed_experiment_conclude
- growth.governed_experiment_create
- growth.governed_experiment_get
- growth.governed_experiment_list
- growth.governed_experiment_measurement_record
- growth.governed_experiment_publication_record
- growth.governed_experiment_revise
- growth.governed_experiment_stop
- gtm.goals_list
- gtm.tasks.counts
- gtm.tasks.list
- identity.content_pillars_generate
- outreach.workspace_stats_get
- record_files.list
- record_files.upload
- sequences.list
- visibility.overview
- workflows.list

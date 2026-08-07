---
id: analytics
name: Analytics
description: Diagnose current measured performance with explicit time ranges, provenance, limitations, confidence, and evidence-backed recommendations.
triggers: ["analyze growth performance","explain a metric change","diagnose a funnel","compare measured channel results"]
dependencies: []
capability_domains: ["analytics","attribution","command_center","gtm","outreach","page_analytics","sequences","social","visibility","workflows"]
capability_ids: ["analytics.attribution_health_get","analytics.ga4.attribution","analytics.ga4.browsers","analytics.ga4.devices","analytics.ga4.geo","analytics.ga4.hostnames","analytics.ga4.operating_systems","analytics.ga4.overview","analytics.ga4.pages","analytics.ga4.referrers","analytics.ga4.utm","attribution.companies_list","attribution.devices_get","attribution.links_list","attribution.locations_list","attribution.overview_get","attribution.profiles_list","attribution.referers_list","command_center.overview.get","gtm.runs.metrics_get","outreach.analytics_framework_aggregate_get","outreach.analytics_step_aggregate_get","outreach.monthly_rollup_get","outreach.reply_insights_get","outreach.workspace_stats_get","page_analytics.authors_list","page_analytics.post_attribution_get","page_analytics.posts_list","page_analytics.profile_links_get","sequences.analytics_get","social.analytics_query","social.analytics_rollup_get","social.audience_analytics","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analytics","social.strategy_activity_calendar","social.strategy_plan_progress","usage.action_costs_get","usage.history_list","usage.limits_get","usage.status_get","visibility.overview","workflows.analytics_by_workflow","workflows.analytics_overview","workflows.metrics_get"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: f28aaaa46095f6ff48ddc58b66364debc518136453034a77202ac951f82b1615
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: a7fafedeb45d2a7d
  manifest_digest: 128d6ae0b4f5fd6d10d7a6e5e08a42587040dce1aea6c5a8bf7be5a2a30271b7
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.6.0
  source_release_hash: f28aaaa46095f6ff48ddc58b66364debc518136453034a77202ac951f82b1615
  generator_version: 1.0.0
  kernel_id: analytics
  kernel_file: KERNEL.md
  kernel_sha256: cc7ae22911a6435d8a2e6ae480a98a1127317aa6e87c1a97343ee580c92025bd
  adapter_sha256: 81ffaf4fd572d40474ae531ecb09155acdd108ad20cdc09ed2ef923f6fd6359b
  evals_file: evals.json
  evals_sha256: cb6b3282f25da08f1d7d0907811c809ba098279b4e1f5517fda6d8e2d16993a8
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 47 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| outreach.analytics_framework_aggregate_get | ds_analytics action=sequences |
| outreach.analytics_step_aggregate_get | ds_analytics action=sequences |
| outreach.reply_insights_get | ds_analytics action=sequences |
| sequences.analytics_get | ds_analytics action=sequences |
| social.analytics_query | ds_analytics action=query |
| social.analytics_rollup_get | ds_analytics action=query |
| social.audience_analytics | ds_analytics action=audience |
| social.metric_definitions | ds_analytics action=query |
| social.performance_analysis_get | ds_analytics action=post |
| social.performance_snapshot_get | ds_analytics action=post |
| social.post_analytics | ds_analytics action=post |
| social.strategy_activity_calendar | ds_plan action=calendar |
| social.strategy_plan_progress | ds_plan action=overview |
| usage.action_costs_get | ds_analytics action=usage |
| usage.history_list | ds_analytics action=usage |
| usage.limits_get | ds_analytics action=usage |
| usage.status_get | ds_analytics action=usage |
| workflows.analytics_by_workflow | ds_analytics action=workflows |
| workflows.analytics_overview | ds_analytics action=workflows |
| workflows.metrics_get | ds_analytics action=workflows |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- analytics.attribution_health_get
- analytics.ga4.attribution
- analytics.ga4.browsers
- analytics.ga4.devices
- analytics.ga4.geo
- analytics.ga4.hostnames
- analytics.ga4.operating_systems
- analytics.ga4.overview
- analytics.ga4.pages
- analytics.ga4.referrers
- analytics.ga4.utm
- attribution.companies_list
- attribution.devices_get
- attribution.links_list
- attribution.locations_list
- attribution.overview_get
- attribution.profiles_list
- attribution.referers_list
- command_center.overview.get
- gtm.runs.metrics_get
- outreach.monthly_rollup_get
- outreach.workspace_stats_get
- page_analytics.authors_list
- page_analytics.post_attribution_get
- page_analytics.posts_list
- page_analytics.profile_links_get
- visibility.overview

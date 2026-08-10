---
id: analytics
name: Analytics
description: Diagnose current measured performance with explicit time ranges, provenance, limitations, confidence, and evidence-backed recommendations.
triggers: ["analyze growth performance","explain a metric change","diagnose a funnel","compare measured channel results"]
dependencies: []
capability_domains: ["analytics","attribution","command_center","gtm","outreach","page_analytics","sequences","social","visibility","workflows"]
capability_ids: ["analytics.attribution_health_get","analytics.ga4.attribution","analytics.ga4.browsers","analytics.ga4.devices","analytics.ga4.geo","analytics.ga4.hostnames","analytics.ga4.operating_systems","analytics.ga4.overview","analytics.ga4.pages","analytics.ga4.referrers","analytics.ga4.utm","attribution.companies_list","attribution.devices_get","attribution.links_list","attribution.locations_list","attribution.overview_get","attribution.profiles_list","attribution.referers_list","command_center.overview.get","gtm.runs.metrics_get","outreach.activity_list","outreach.analytics_framework_aggregate_get","outreach.analytics_step_aggregate_get","outreach.credit_usage_get","outreach.monthly_rollup_get","outreach.reply_insights_get","outreach.workspace_stats_get","page_analytics.authors_list","page_analytics.post_attribution_get","page_analytics.posts_list","page_analytics.profile_links_get","sequences.analytics_get","social.analytics_query","social.analytics_rollup_get","social.audience_analytics","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analytics","social.strategy_activity_calendar","social.strategy_plan_progress","usage.action_costs_get","usage.history_list","usage.limits_get","usage.status_get","visibility.overview","workflows.analytics_by_workflow","workflows.analytics_overview","workflows.metrics_get"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 95ffa2e1dc791c732fdccb53b69598648d500b23f9c8a73db3a018b97484d73e
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 43bd7ae6fcd1b522
  manifest_digest: 8fe3b3889098ec17a3c5c55a791b88c9e62d0ae90dc087e0451c6ea0bcebfee0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 95ffa2e1dc791c732fdccb53b69598648d500b23f9c8a73db3a018b97484d73e
  generator_version: 1.0.0
  kernel_id: analytics
  kernel_file: KERNEL.md
  kernel_sha256: a82a87447e72d2bac64c43a01f5e924f0058a3c71f662834aef150c5e88c693a
  adapter_sha256: 14f0bf7d0bbc476a2f4b0e4a95a5a37627714918dcc1758b5c774afa35e33be1
  evals_file: evals.json
  evals_sha256: 461f95549b02ea775580e3016851b1efcc0520b2ee39297dba84633df0173d17
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 49 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| analytics.ga4.attribution | ds_analytics action=web_traffic |
| analytics.ga4.browsers | ds_analytics action=web_traffic |
| analytics.ga4.devices | ds_analytics action=web_traffic |
| analytics.ga4.geo | ds_analytics action=web_traffic |
| analytics.ga4.hostnames | ds_analytics action=web_traffic |
| analytics.ga4.operating_systems | ds_analytics action=web_traffic |
| analytics.ga4.overview | ds_analytics action=web_traffic |
| analytics.ga4.pages | ds_analytics action=web_traffic |
| analytics.ga4.referrers | ds_analytics action=web_traffic |
| analytics.ga4.utm | ds_analytics action=web_traffic |
| outreach.activity_list | ds_engage action=conversations |
| outreach.analytics_framework_aggregate_get | ds_analytics action=sequences |
| outreach.analytics_step_aggregate_get | ds_analytics action=sequences |
| outreach.credit_usage_get | ds_analytics action=usage |
| outreach.monthly_rollup_get | ds_analytics action=outreach_overview |
| outreach.reply_insights_get | ds_analytics action=sequences |
| outreach.workspace_stats_get | ds_analytics action=outreach_overview |
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
- attribution.companies_list
- attribution.devices_get
- attribution.links_list
- attribution.locations_list
- attribution.overview_get
- attribution.profiles_list
- attribution.referers_list
- command_center.overview.get
- gtm.runs.metrics_get
- page_analytics.authors_list
- page_analytics.post_attribution_get
- page_analytics.posts_list
- page_analytics.profile_links_get
- visibility.overview

---
id: seo-geo
name: SEO and AI visibility
description: Keyword and page work for search engines, plus measuring and improving whether AI engines cite this business.
triggers: ["research keywords","audit a page for search","add schema markup","find why organic traffic dropped","check whether ChatGPT or Perplexity cites us","improve AI answer visibility"]
dependencies: []
capability_domains: ["brain","integrations","seo","tools","visibility"]
capability_ids: ["brain.context.get","brain.context.search","brain.learning.query_benchmarks","integrations.gsc.properties","integrations.gsc.properties_list","integrations.gsc.property_primary_set","integrations.gsc.property_select","integrations.gsc.search_analytics_get","integrations.gsc.search_analytics_refresh","integrations.gsc.sitemaps_import","integrations.gsc.status","seo.agent_readiness_history","seo.agent_readiness_latest","seo.agent_readiness_scan","seo.llms_txt_generate","seo.llms_txt_get","seo.robots_audit","seo.serp_snapshot_resolve","seo.serp_spend_get","tools.llms_txt_generate","visibility.ai_bot_fetch_get","visibility.ai_traffic","visibility.citations","visibility.geo_queries_list","visibility.html_analysis_get","visibility.keywords_get","visibility.overview","visibility.pagespeed_get","visibility.pagespeed_refresh","visibility.probe.latest","visibility.probe.recommendations","visibility.probe.results","visibility.probe.run_get","visibility.probe.runs_list","visibility.probe.start","visibility.probe.status","visibility.probe.today","visibility.prompt_metrics_list","visibility.refresh","visibility.sentiment_trend","visibility.site_files_get","visibility.site_scan","visibility.sitemap_get","visibility.tracked_prompts.create","visibility.tracked_prompts.generate","visibility.tracked_prompts.list","visibility.tracked_prompts.save","visibility.tracked_prompts.status","visibility.tracked_prompts.tags","visibility.tracked_prompts.update","visibility.workspace_site_ensure","visibility.workspace_site_get","visibility.workspace_site_update"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"benchmark_state","description":"Pooled benchmark evidence availability.","allowed_values":["supported","insufficient_evidence","unavailable","not_applicable"]},{"id":"confidence_state","description":"Evidence confidence disclosure state.","allowed_values":["disclosed","unavailable","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"observation_state","description":"Observation timestamp and source state.","allowed_values":["observed","cached","unavailable"]},{"id":"plan_state","description":"Prioritized technical and content plan state.","allowed_values":["prioritized","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 70af62d89dedded5dfe23cabc905241380d1d7ee0661a95aee36b6b10e584cd1
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 8df1be483274bb8a
  manifest_digest: e945f747d1ec82a2dc4f2f7c4164b7b9122d059d952dfdd8d07c1d0a5c650cf5
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.6.0
  source_release_hash: 70af62d89dedded5dfe23cabc905241380d1d7ee0661a95aee36b6b10e584cd1
  generator_version: 1.0.0
  kernel_id: seo-geo
  kernel_file: KERNEL.md
  kernel_sha256: 3e9fca49e6411ae08d5afdd01710e28b9954c7734f9434a121723d183b387945
  adapter_sha256: faa62234dc3f393d6555dfe972869b8942ab0b4ae8ddfb3101ea8754606d89fe
  evals_file: evals.json
  evals_sha256: 1067363134c1a8411614ae2a8900310462ef829444b65f4e3f1e172c25c32b9e
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 53 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 17 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| brain.context.get | ds_read |
| brain.context.search | ds_search action=context |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- brain.learning.query_benchmarks
- integrations.gsc.properties
- integrations.gsc.properties_list
- integrations.gsc.property_primary_set
- integrations.gsc.property_select
- integrations.gsc.search_analytics_get
- integrations.gsc.search_analytics_refresh
- integrations.gsc.sitemaps_import
- integrations.gsc.status
- seo.agent_readiness_history
- seo.agent_readiness_latest
- seo.agent_readiness_scan
- seo.llms_txt_generate
- seo.llms_txt_get
- seo.robots_audit
- seo.serp_snapshot_resolve
- seo.serp_spend_get
- tools.llms_txt_generate
- visibility.ai_bot_fetch_get
- visibility.ai_traffic
- visibility.citations
- visibility.geo_queries_list
- visibility.html_analysis_get
- visibility.keywords_get
- visibility.overview
- visibility.pagespeed_get
- visibility.pagespeed_refresh
- visibility.probe.latest
- visibility.probe.recommendations
- visibility.probe.results
- visibility.probe.run_get
- visibility.probe.runs_list
- visibility.probe.start
- visibility.probe.status
- visibility.probe.today
- visibility.prompt_metrics_list
- visibility.refresh
- visibility.sentiment_trend
- visibility.site_files_get
- visibility.site_scan
- visibility.sitemap_get
- visibility.tracked_prompts.create
- visibility.tracked_prompts.generate
- visibility.tracked_prompts.list
- visibility.tracked_prompts.save
- visibility.tracked_prompts.status
- visibility.tracked_prompts.tags
- visibility.tracked_prompts.update
- visibility.workspace_site_ensure
- visibility.workspace_site_get
- visibility.workspace_site_update

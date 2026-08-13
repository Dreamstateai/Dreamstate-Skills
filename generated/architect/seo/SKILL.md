---
id: seo
name: SEO
description: Diagnose and improve conventional search discovery through current crawl, index, query, page, technical, schema, content, and measurement evidence without conflating ranking with AI citations.
triggers: ["research organic search demand","audit technical or on-page SEO","diagnose a search traffic drop","improve metadata schema or internal links","refresh an existing search page"]
dependencies: ["research"]
capability_domains: ["brain","integrations","seo","tools","visibility"]
capability_ids: ["brain.context.get","brain.context.search","integrations.gsc.search_analytics_get","integrations.gsc.search_analytics_refresh","integrations.gsc.status","seo.agent_readiness_history","seo.agent_readiness_latest","seo.agent_readiness_scan","seo.llms_txt_get","seo.robots_audit","seo.serp_snapshot_resolve","seo.serp_spend_get","tools.llms_txt_generate","visibility.ai_bot_fetch_get","visibility.ai_traffic","visibility.html_analysis_get","visibility.keywords_get","visibility.pagespeed_get","visibility.pagespeed_refresh","visibility.probe.recommendations","visibility.site_files_get","visibility.site_scan","visibility.sitemap_get","visibility.workspace_site_get"]
max_context_tokens: 2200
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 2f83c9c7cac1d3091e0ff4ecffedecfd66e468bea64cfd5707827e3ec0bb0bc4
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: d6fc2612e52e9806
  manifest_digest: 650e0747782817398b643af2b6a15bf0f3b42af4300a93d428c6db8aa96f659f
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 2f83c9c7cac1d3091e0ff4ecffedecfd66e468bea64cfd5707827e3ec0bb0bc4
  generator_version: 1.0.0
  kernel_id: seo
  kernel_file: KERNEL.md
  kernel_sha256: 377c78ea07f776c5e3ad8d926c9247c1e32dc056e3ad37ba8c61943eff131859
  adapter_sha256: bee6dd595bfe967397c6c0493ea1ddb5afca63e8cba2b93b4b0cefd59a7b5453
  evals_file: evals.json
  evals_sha256: ddf7dc3634abf9b9eaae791f74f8ae95444dbde51dc7e47bc079c50ea2c6c3a7
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 24 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 5 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| brain.context.get | ds_read |
| brain.context.search | ds_search action=context |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- integrations.gsc.search_analytics_get
- integrations.gsc.search_analytics_refresh
- integrations.gsc.status
- seo.agent_readiness_history
- seo.agent_readiness_latest
- seo.agent_readiness_scan
- seo.llms_txt_get
- seo.robots_audit
- seo.serp_snapshot_resolve
- seo.serp_spend_get
- tools.llms_txt_generate
- visibility.ai_bot_fetch_get
- visibility.ai_traffic
- visibility.html_analysis_get
- visibility.keywords_get
- visibility.pagespeed_get
- visibility.pagespeed_refresh
- visibility.probe.recommendations
- visibility.site_files_get
- visibility.site_scan
- visibility.sitemap_get
- visibility.workspace_site_get

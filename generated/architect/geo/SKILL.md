---
id: geo
name: GEO and AI visibility
description: Define and measure answer-engine query sets, mentions, citations, engines, pages, competitors, evidence windows, and bounded probes without presenting GEO as ordinary ranking or an opaque universal score.
triggers: ["measure AI search visibility","check whether answer engines cite us","build a GEO query baseline","diagnose citation gaps","improve answer-engine content"]
dependencies: ["research"]
capability_domains: ["brain","integrations","seo","tools","visibility"]
capability_ids: ["brain.context.get","brain.context.search","visibility.citations","visibility.geo_queries_list","visibility.overview","visibility.probe.latest","visibility.probe.results","visibility.probe.run_get","visibility.probe.runs_list","visibility.probe.start","visibility.probe.status","visibility.probe.today","visibility.prompt_metrics_list","visibility.refresh","visibility.sentiment_trend","visibility.tracked_prompts.create","visibility.tracked_prompts.generate","visibility.tracked_prompts.list","visibility.tracked_prompts.save","visibility.tracked_prompts.status","visibility.tracked_prompts.tags","visibility.tracked_prompts.update","visibility.workspace_site_get"]
max_context_tokens: 2200
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 68c0478f1ad01fb5227d18e52ed6f3733c766ab258ac16fe89b55fea3e8c20e6
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: f897fa5a3240ddff
  manifest_digest: e811f42af747d39d754f5cd6ba78592d178882d8163be6c3773cb7bf70f1aa3e
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 68c0478f1ad01fb5227d18e52ed6f3733c766ab258ac16fe89b55fea3e8c20e6
  generator_version: 1.0.0
  kernel_id: geo
  kernel_file: KERNEL.md
  kernel_sha256: 90fa8444a91d52a408d4c74971c7d624090cbf4744511c2c6b7c0bfe2834cc9b
  adapter_sha256: fd0cbe00eb53eeb6023f4bb26976fca95e66836b755fdde46765637dfe848403
  evals_file: evals.json
  evals_sha256: a739e333b91fb59874bc772dd4476b77b9344de711b48ad9322830aec9a73f3c
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 23 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 6 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| brain.context.get | ds_read |
| brain.context.search | ds_search action=context |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- visibility.citations
- visibility.geo_queries_list
- visibility.overview
- visibility.probe.latest
- visibility.probe.results
- visibility.probe.run_get
- visibility.probe.runs_list
- visibility.probe.start
- visibility.probe.status
- visibility.probe.today
- visibility.prompt_metrics_list
- visibility.refresh
- visibility.sentiment_trend
- visibility.tracked_prompts.create
- visibility.tracked_prompts.generate
- visibility.tracked_prompts.list
- visibility.tracked_prompts.save
- visibility.tracked_prompts.status
- visibility.tracked_prompts.tags
- visibility.tracked_prompts.update
- visibility.workspace_site_get

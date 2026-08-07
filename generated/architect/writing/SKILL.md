---
id: writing
name: Long-form writing
description: Draft, revise and publish articles and landing copy grounded in workspace context and a target query.
triggers: ["write a blog post","draft landing page copy","improve an existing article","publish a drafted article"]
dependencies: ["seo-geo","context"]
capability_domains: ["brain","content","research"]
capability_ids: ["brain.content.get","brain.content.search","brain.context.get","brain.context.search","brain.evidence.search","content.approval.authorize_publish","content.approval.decide","content.approval.submit","content.approve","content.article_archive","content.article_asset_import","content.article_asset_register","content.article_asset_upload","content.article_create_schedule","content.article_deliveries_list","content.article_delivery_create","content.article_delivery_payload_get","content.article_distribution_get","content.article_duplicate","content.article_enabled_get","content.article_get","content.article_list","content.article_selection_edit","content.article_update","content.delete_republish_propose","content.delivery_publish","content.destination_test","content.destinations_list","content.replacement_create","content.schedule","content.submit_review","content.unschedule","content.version_create","content.version_diff_get","content.version_get","content.versions_list","research.urls_fetch"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
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
  kernel_id: writing
  kernel_file: KERNEL.md
  kernel_sha256: c1be4a291e14cb21dd56d405e1d10681fda9f2a11d1e22e6fb42846f9f3af47a
  adapter_sha256: 75dcb3990eb7f2ba411ede3ba661a9633437a03634111b416b9923657b7f490a
  evals_file: evals.json
  evals_sha256: 8b427a939032ab2625e0bbd0153017fc18e6778282e4c2ec8108bd6be2e49ce7
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 37 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 21 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| brain.context.get | ds_read |
| brain.context.search | ds_search action=context |
| content.approval.authorize_publish | ds_publish action=post |
| content.approval.decide | ds_publish action=approve |
| content.approval.submit | ds_publish action=submit_review |
| content.approve | ds_publish action=approve |
| content.article_create_schedule | ds_publish action=schedule |
| content.delete_republish_propose | ds_publish action=republish |
| content.delivery_publish | ds_publish action=post |
| content.replacement_create | ds_publish action=republish |
| content.schedule | ds_publish action=schedule |
| content.submit_review | ds_publish action=submit_review |
| content.unschedule | ds_publish action=unschedule |
| content.version_create | ds_publish action=update |
| content.version_get | ds_publish action=get |
| content.versions_list | ds_publish action=get |
| research.urls_fetch | ds_read, or ds_search action=web |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- brain.content.get
- brain.content.search
- brain.evidence.search
- content.article_archive
- content.article_asset_import
- content.article_asset_register
- content.article_asset_upload
- content.article_deliveries_list
- content.article_delivery_create
- content.article_delivery_payload_get
- content.article_distribution_get
- content.article_duplicate
- content.article_enabled_get
- content.article_get
- content.article_list
- content.article_selection_edit
- content.article_update
- content.destination_test
- content.destinations_list
- content.version_diff_get

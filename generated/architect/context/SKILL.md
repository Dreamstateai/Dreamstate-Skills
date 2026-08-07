---
id: context
name: Context
description: Read targeted revisioned workspace-wiki claims or propose cited conflict-aware updates and new ordinary files without treating prompt text as canonical state.
triggers: ["read the canonical workspace wiki","inspect published workspace knowledge","propose a cited wiki update","revise an existing ordinary wiki document","trace a cited claim or source","propose a new ordinary wiki file","keep a wiki proposal unpublished for human review"]
dependencies: []
capability_domains: ["brain"]
capability_ids: ["brain.context.archive_document","brain.context.backlinks","brain.context.browse","brain.context.create_document","brain.context.create_folder","brain.context.delete_document","brain.context.get","brain.context.graph","brain.context.history","brain.context.list","brain.context.list_proposals","brain.context.move_document","brain.context.preview_agent_view","brain.context.propose","brain.context.propose_document","brain.context.rebuild_links","brain.context.register_source","brain.context.rename_document","brain.context.restore_document","brain.context.save_and_publish","brain.context.save_draft","brain.context.search","brain.context.website_source_register","brain.evidence.search","brain.graph.neighborhood","brain.knowledge.digest","brain.knowledge.doc_map","brain.knowledge.document","brain.knowledge.index"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]}]}
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
  kernel_id: context
  kernel_file: KERNEL.md
  kernel_sha256: 30f768408a9922b628abce43b89e5430d793c1d774f8d0a7d576762e42a40d1c
  adapter_sha256: d8d99a911b308ba7a4dd9efe49cb99d587a0b951dbcaeb1a9647e1f2c18c9823
  evals_file: evals.json
  evals_sha256: eed5faff171255de44e0015ee056d52e8976d8959917e62a77cf165d7aa37b90
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 29 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 14 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| brain.context.archive_document | ds_edit action=archive |
| brain.context.backlinks | ds_search action=context |
| brain.context.browse | ds_read |
| brain.context.create_document | ds_write action=create_document |
| brain.context.create_folder | ds_write action=create_folder |
| brain.context.delete_document | ds_edit action=delete |
| brain.context.get | ds_read |
| brain.context.graph | ds_search action=context |
| brain.context.list | ds_write action=create_document, or ds_search action=context |
| brain.context.move_document | ds_edit action=move |
| brain.context.rebuild_links | ds_edit action=rebuild_links |
| brain.context.register_source | ds_write action=register_source |
| brain.context.rename_document | ds_edit action=rename |
| brain.context.restore_document | ds_edit action=restore |
| brain.context.save_and_publish | ds_write action=create_document, or ds_edit action=replace |
| brain.context.save_draft | ds_edit action=replace |
| brain.context.search | ds_search action=context |
| brain.context.website_source_register | ds_write action=register_source |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- brain.context.history
- brain.context.list_proposals
- brain.context.preview_agent_view
- brain.context.propose
- brain.context.propose_document
- brain.evidence.search
- brain.graph.neighborhood
- brain.knowledge.digest
- brain.knowledge.doc_map
- brain.knowledge.document
- brain.knowledge.index

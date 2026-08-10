---
id: context
name: Context
description: Read targeted revisioned workspace-wiki claims or propose cited conflict-aware updates and new ordinary files without treating prompt text as canonical state.
triggers: ["read the canonical workspace wiki","inspect published workspace knowledge","propose a cited wiki update","revise an existing ordinary wiki document","trace a cited claim or source","propose a new ordinary wiki file","keep a wiki proposal unpublished for human review"]
dependencies: []
capability_domains: ["brain"]
capability_ids: ["brain.context.archive_document","brain.context.backlinks","brain.context.browse","brain.context.create_document","brain.context.create_folder","brain.context.delete_document","brain.context.get","brain.context.graph","brain.context.history","brain.context.list","brain.context.move_document","brain.context.rename_document","brain.context.restore_document","brain.context.save_revision","brain.context.search","brain.evidence.search","brain.graph.neighborhood","brain.knowledge.digest","brain.knowledge.doc_map","brain.knowledge.document","brain.knowledge.index"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 1d955b8afe334b947044c0b345bde38598d1697475ea42a5461bf2c6559a7f47
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 43bd7ae6fcd1b522
  manifest_digest: 8fe3b3889098ec17a3c5c55a791b88c9e62d0ae90dc087e0451c6ea0bcebfee0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 1d955b8afe334b947044c0b345bde38598d1697475ea42a5461bf2c6559a7f47
  generator_version: 1.0.0
  kernel_id: context
  kernel_file: KERNEL.md
  kernel_sha256: 0f9b50bd5f592fb8254263780560fd4313c5d47e9899b123ac7247bdb6524513
  adapter_sha256: 03f6730055c827683305a901b932508545b89200ef07543228a15b5f1f78cda7
  evals_file: evals.json
  evals_sha256: 5f2a458db81b5d9c1f9eec9579a4746b58e0e8c473bebcdb3467dd62c52c93dc
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 21 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 8 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

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
| brain.context.rename_document | ds_edit action=rename |
| brain.context.restore_document | ds_edit action=restore |
| brain.context.search | ds_search action=context |
| brain.evidence.search | ds_analytics action=brain_evidence |
| brain.graph.neighborhood | ds_analytics action=brain_evidence |
| brain.knowledge.digest | ds_analytics action=brain_evidence |
| brain.knowledge.doc_map | ds_analytics action=brain_evidence |
| brain.knowledge.document | ds_analytics action=brain_evidence |
| brain.knowledge.index | ds_analytics action=brain_evidence |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- brain.context.history
- brain.context.save_revision

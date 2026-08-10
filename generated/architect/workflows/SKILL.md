---
id: workflows
name: Workflows
description: Publish, enroll, activate, run, observe, recover, and safely repair durable workflow graphs; own sequence launch closure and the external-send and live-reply lifecycle.
triggers: ["build a workflow or automation","schedule a recurring process","inspect or edit a workflow graph","validate a workflow","resume or repair a failed workflow run","publish enroll or activate a reviewed sequence or workflow","handle or reply to a live outbound conversation"]
dependencies: []
capability_domains: ["brain","executable_definitions","executables","runs","selection_snapshots","sequences","table_runs","tables","workflows"]
capability_ids: ["outreach.demand_plan_get","outreach.dm_conversation_by_contact_get","outreach.dm_conversation_get","outreach.dm_conversation_read","outreach.dm_conversation_status_update","outreach.dm_conversations_list","outreach.dm_message_send","runs.cancel","runs.get","runs.pause","runs.resume","selection_snapshots.get","sequences.enroll_selection","sequences.publish","workflows.activate","workflows.analytics_by_workflow","workflows.analytics_overview","workflows.archive","workflows.call_child","workflows.create","workflows.deactivate","workflows.delete","workflows.delivery_binding_get","workflows.draft_publish","workflows.draft_save","workflows.enroll_selection","workflows.get","workflows.graph_apply","workflows.list","workflows.metrics_get","workflows.node_inspect","workflows.node_options","workflows.node_registry","workflows.run_retry","workflows.run_trace_get","workflows.runs_list","workflows.sequence_event_ingest","workflows.trigger_create","workflows.trigger_delete","workflows.triggers_list","workflows.validate_graph","worksheet_exports.enroll_sequence"]
max_context_tokens: 2400
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"external_send_state","description":"External-send authorization and pacing state.","allowed_values":["not_authorized","authorized_capped_paced","completed","partial","blocked","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
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
  kernel_id: workflows
  kernel_file: KERNEL.md
  kernel_sha256: 63f681bd0e2c12cf22886b8cbf2df29130af440c2c6c7783a4a174edf7c2ab3a
  adapter_sha256: 6d5d17c2ff0881dd950d7a2bd703989a3371882faad710202b93e4f48d861ef8
  evals_file: evals.json
  evals_sha256: 6f99ac9b16ac9b3144bdecbf805ca9a082f53a621196f0fc6fc19b8e03dc34e0
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 42 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 23 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| outreach.dm_conversation_by_contact_get | ds_engage action=conversations |
| outreach.dm_conversation_get | ds_engage action=conversations |
| outreach.dm_conversation_read | ds_engage action=status_set |
| outreach.dm_conversation_status_update | ds_engage action=status_set |
| outreach.dm_conversations_list | ds_engage action=conversations |
| outreach.dm_message_send | ds_engage action=reply |
| sequences.enroll_selection | ds_workbook action=enroll |
| sequences.publish | ds_workbook action=publish_sequence |
| workflows.analytics_by_workflow | ds_analytics action=workflows |
| workflows.analytics_overview | ds_analytics action=workflows |
| workflows.enroll_selection | ds_workbook action=enroll |
| workflows.metrics_get | ds_analytics action=workflows |
| worksheet_exports.enroll_sequence | ds_workbook action=enroll |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- outreach.demand_plan_get
- runs.cancel
- runs.get
- runs.pause
- runs.resume
- selection_snapshots.get
- workflows.activate
- workflows.archive
- workflows.call_child
- workflows.create
- workflows.deactivate
- workflows.delete
- workflows.delivery_binding_get
- workflows.draft_publish
- workflows.draft_save
- workflows.get
- workflows.graph_apply
- workflows.list
- workflows.node_inspect
- workflows.node_options
- workflows.node_registry
- workflows.run_retry
- workflows.run_trace_get
- workflows.runs_list
- workflows.sequence_event_ingest
- workflows.trigger_create
- workflows.trigger_delete
- workflows.triggers_list
- workflows.validate_graph

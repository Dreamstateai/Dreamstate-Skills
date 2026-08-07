---
id: sequences
name: Outreach sequences
description: Write and run paced multi-channel sequences covering steps, timing, caps, deliverability, suppression and reply handling, for rows a workbook already qualified.
triggers: ["write a cold email sequence","add a LinkedIn step to a sequence","enroll qualified rows into a sequence","change sending pace or daily caps","check why a sequence is not sending","handle replies and stop a sequence for someone"]
dependencies: ["outreach"]
capability_domains: ["brain","outreach","rows","sequences"]
capability_ids: ["brain.context.get","brain.context.search","outreach.ai_spintax_generate","outreach.ai_write_generate","outreach.ai_write_resolve","outreach.dm_conversation_by_contact_get","outreach.dm_conversation_get","outreach.dm_conversation_read","outreach.dm_conversation_status_update","outreach.dm_conversations_list","outreach.dm_message_send","outreach.mailboxes_list","outreach.opener_sample_generate","outreach.opener_styles_list","outreach.personalization_generate","outreach.send_schedules.get","outreach.send_schedules.list","outreach.senders_list","outreach.settings_get","rows.get","rows.query","sequences.archive","sequences.bind","sequences.definition_get","sequences.delete","sequences.enrollment_owner_clear","sequences.list","sequences.step_options","sequences.validate"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"external_send_state","description":"External-send authorization and pacing state.","allowed_values":["not_authorized","authorized_capped_paced","completed","partial","blocked","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
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
  kernel_id: sequences
  kernel_file: KERNEL.md
  kernel_sha256: ee366933a2fb592f3267b7f78e84889dc81a9ee28ec7c3604226549215fe3602
  adapter_sha256: 0621b4d6f1e63b1896ab7d0251af5fc505da18db19e7abd9dd3fd56635a7643b
  evals_file: evals.json
  evals_sha256: 98113e311081c03833aa6a387ee1ed640448501cc4dff4254af334e4f1fdd37a
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
- Cannot infer execution authority from these 11 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| brain.context.get | ds_read |
| brain.context.search | ds_search action=context |
| outreach.dm_conversation_by_contact_get | ds_engage action=conversations |
| outreach.dm_conversation_get | ds_engage action=conversations |
| outreach.dm_conversation_read | ds_engage action=status_set |
| outreach.dm_conversation_status_update | ds_engage action=status_set |
| outreach.dm_conversations_list | ds_engage action=conversations |
| outreach.dm_message_send | ds_engage action=reply |
| rows.get | ds_workbook action=read_cells |
| rows.query | ds_workbook action=read_cells |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- outreach.ai_spintax_generate
- outreach.ai_write_generate
- outreach.ai_write_resolve
- outreach.mailboxes_list
- outreach.opener_sample_generate
- outreach.opener_styles_list
- outreach.personalization_generate
- outreach.send_schedules.get
- outreach.send_schedules.list
- outreach.senders_list
- outreach.settings_get
- sequences.archive
- sequences.bind
- sequences.definition_get
- sequences.delete
- sequences.enrollment_owner_clear
- sequences.list
- sequences.step_options
- sequences.validate

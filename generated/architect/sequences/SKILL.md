---
id: sequences
name: Outreach sequences
description: Author, preview, validate, and bind draft multi-channel sequence definitions for rows a workbook already qualified.
triggers: ["write a cold email sequence","add a LinkedIn step to a sequence","edit sequence copy or add a step","preview a sequence against a qualified row","validate a sequence definition","bind a reviewed sequence draft"]
dependencies: ["qualification"]
capability_domains: ["brain","outreach","rows","sequences"]
capability_ids: ["brain.context.get","brain.context.search","outreach.ai_spintax_generate","outreach.ai_write_generate","outreach.ai_write_resolve","outreach.mailboxes_list","outreach.opener_sample_generate","outreach.opener_styles_list","outreach.personalization_generate","outreach.send_schedules.get","outreach.send_schedules.list","outreach.senders_list","outreach.settings_get","rows.get","rows.query","sequences.archive","sequences.bind","sequences.definition_get","sequences.delete","sequences.enrollment_owner_clear","sequences.list","sequences.step_options","sequences.validate"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]}]}
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
  kernel_id: sequences
  kernel_file: KERNEL.md
  kernel_sha256: 77e81304eb5e942b29027341016b110bccf5f8fa79917130c9664ef96d39971d
  adapter_sha256: aa0b926a546b37054238953798cb34165e16e702de6b03dc80d6b40fbe7cef05
  evals_file: evals.json
  evals_sha256: bbae0ff0dcb14ff65cb6dfba0aefb776d898d5d0ed5bb901e1f472b7b2ac0416
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
- Cannot infer execution authority from these 8 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| brain.context.get | ds_read |
| brain.context.search | ds_search action=context |
| outreach.ai_spintax_generate | ds_engage action=draft_reply |
| outreach.ai_write_generate | ds_engage action=draft_reply |
| outreach.ai_write_resolve | ds_engage action=draft_reply |
| outreach.personalization_generate | ds_engage action=draft_reply |
| rows.get | ds_workbook action=read_cells |
| rows.query | ds_workbook action=read_cells |
| sequences.bind | ds_workbook action=bind_sequence |
| sequences.validate | ds_workbook action=validate_sequence |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- outreach.mailboxes_list
- outreach.opener_sample_generate
- outreach.opener_styles_list
- outreach.send_schedules.get
- outreach.send_schedules.list
- outreach.senders_list
- outreach.settings_get
- sequences.archive
- sequences.definition_get
- sequences.delete
- sequences.enrollment_owner_clear
- sequences.list
- sequences.step_options

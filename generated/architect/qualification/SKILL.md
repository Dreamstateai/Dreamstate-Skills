---
id: qualification
name: Qualification
description: Turn an ICP into explicit exclusions, required criteria, preferences, evidence states, calibrated fit decisions, low-yield diagnostics, and an exact qualified selection snapshot.
triggers: ["define qualification criteria","score and tier rows by fit","distinguish required and preferred criteria","diagnose low qualification yield","freeze a qualified selection"]
dependencies: ["workbooks"]
capability_domains: ["audiences","brain","cells","columns","outreach","rows","selection_snapshots","table_runs","tables","views","workbook_audiences","workbooks","worksheets"]
capability_ids: ["audiences.archive","audiences.create","audiences.get","audiences.list","audiences.persona_suggestions","audiences.preview","audiences.sources_list","audiences.update","brain.context.get","brain.context.search","columns.add","columns.list","columns.run","columns.update","graph.contract_get","graph.get_node","graph.get_relation","graph.search","graph.traverse","outreach.icp_cache_archive","outreach.icp_classification_create","outreach.icp_classification_job_get","outreach.icps_list","records.unbound_rows_enroll","rows.count","rows.get","rows.query","selection_snapshots.create","table_runs.preview_cost","usage.limits_get"]
max_context_tokens: 2200
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 08ed48ef74a7ed26
  manifest_digest: 581ca82dd84b68dc8dfe91bc8052e253182ee248d1a009d80ecb1d927ab30805
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  generator_version: 1.0.0
  kernel_id: qualification
  kernel_file: KERNEL.md
  kernel_sha256: 59325a5d4c60fb7d8074398f938b8ae1b92db83a4e9ed6a794a3efefa32bee9c
  adapter_sha256: 5473ad0ae81c55f9ef153edda7ca172869dff825ac34646e82680c4c3a145454
  evals_file: evals.json
  evals_sha256: b98b3d9638f8d6d5c476d0efc9ce3875cbb3fc7cb2806f2c711311718d93e76c
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 30 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 10 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| audiences.preview | ds_workbook action=preview |
| brain.context.get | ds_read |
| brain.context.search | ds_search action=context |
| columns.add | ds_workbook action=add_column |
| columns.list | ds_workbook action=list_columns |
| columns.run | ds_workbook action=run |
| columns.update | ds_workbook action=edit_column, or ds_workbook action=set_run_condition |
| records.unbound_rows_enroll | ds_workbook action=enroll, or ds_workbook action=transfer |
| rows.count | ds_workbook action=read_cells, or ds_workbook action=audit |
| rows.get | ds_workbook action=read_cells |
| rows.query | ds_workbook action=read_cells |
| selection_snapshots.create | ds_workbook action=send_rows |
| table_runs.preview_cost | ds_workbook action=preview_cost |
| usage.limits_get | ds_analytics action=usage |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- audiences.archive
- audiences.create
- audiences.get
- audiences.list
- audiences.persona_suggestions
- audiences.sources_list
- audiences.update
- graph.contract_get
- graph.get_node
- graph.get_relation
- graph.search
- graph.traverse
- outreach.icp_cache_archive
- outreach.icp_classification_create
- outreach.icp_classification_job_get
- outreach.icps_list

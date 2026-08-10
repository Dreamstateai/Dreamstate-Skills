---
id: workbooks
name: Workbooks
description: Build and inspect transparent decision tables with one stable row identity, durable source provenance, dependency-aware columns, bounded samples, quality gates, and typed handoffs.
triggers: ["build or inspect a workbook","define a worksheet row model","add or change table columns and views","diagnose table quality or failed cells","prepare a workbook handoff"]
dependencies: []
capability_domains: ["attachments","brain","cells","columns","rows","selection_snapshots","table_runs","table_sources","tables","views","workbooks","worksheets"]
capability_ids: ["attachments.create","attachments.delete","attachments.list","rows.delete","rows.get","rows.query","rows.restore","rows.upsert","selection_snapshots.get","tables.archive","tables.create","tables.get","tables.list","tables.update","views.archive","views.create","views.get","views.list","views.update","workbook_audiences.list","workbooks.archive","workbooks.create","workbooks.duplicate","workbooks.get","workbooks.list","workbooks.overview","workbooks.update","workbooks.update_user_state","worksheet.bootstrap","worksheet.viewport","worksheet_exports.create","worksheet_exports.download","worksheet_exports.get","worksheet_exports.list","worksheets.archive","worksheets.create","worksheets.duplicate","worksheets.list","worksheets.reorder","worksheets.update"]
max_context_tokens: 2200
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"cell_state","description":"Canonical settled-cell outcome state.","allowed_values":["settled","partial","failed","blocked","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: f19b39263ce95636
  manifest_digest: e114f71e1d253179cc463545863d84b51e9d49e06e1317734a868fd8d9f33814
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  generator_version: 1.0.0
  kernel_id: workbooks
  kernel_file: KERNEL.md
  kernel_sha256: ded8a9d025c8f31ecf166a7ea0653e1111710865b8aafc1de1a9b0782955238d
  adapter_sha256: 62dd2c4a926a29d664319712d3fdfffcad1d178e289b211c50528efd7a7ccb51
  evals_file: evals.json
  evals_sha256: e78dd30a1a4bd6905e8bff2b84769c0b14b40868124944e216fc3dff210aa132
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 40 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 22 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| rows.get | ds_workbook action=read_cells |
| rows.query | ds_workbook action=read_cells |
| tables.archive | ds_workbook action=archive |
| tables.create | ds_workbook action=create |
| tables.get | ds_workbook action=get |
| tables.list | ds_workbook action=list |
| tables.update | ds_workbook action=update |
| workbooks.archive | ds_workbook action=archive |
| workbooks.create | ds_workbook action=create |
| workbooks.duplicate | ds_workbook action=duplicate |
| workbooks.get | ds_workbook action=get |
| workbooks.list | ds_workbook action=list |
| workbooks.overview | ds_workbook action=get |
| workbooks.update | ds_workbook action=update |
| worksheet.bootstrap | ds_workbook action=create |
| worksheet.viewport | ds_read |
| worksheet_exports.create | ds_workbook action=send_rows, or ds_workbook action=transfer |
| worksheets.archive | ds_workbook action=archive |
| worksheets.create | ds_workbook action=create |
| worksheets.duplicate | ds_workbook action=duplicate |
| worksheets.list | ds_workbook action=get |
| worksheets.reorder | ds_workbook action=reorder_columns |
| worksheets.update | ds_workbook action=update |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- attachments.create
- attachments.delete
- attachments.list
- rows.delete
- rows.restore
- rows.upsert
- selection_snapshots.get
- views.archive
- views.create
- views.get
- views.list
- views.update
- workbook_audiences.list
- workbooks.update_user_state
- worksheet_exports.download
- worksheet_exports.get
- worksheet_exports.list

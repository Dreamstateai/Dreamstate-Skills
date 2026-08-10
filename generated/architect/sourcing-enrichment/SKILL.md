---
id: sourcing-enrichment
name: Sourcing and enrichment
description: Choose reliable sources, test scarce-signal search variants, attach compatible producers, enrich dependency-ready rows, preserve evidence, price runs, and expand only after a representative sample passes.
triggers: ["find matching companies or people","test or attach a lead source","add an enrichment or waterfall","verify sourced facts","optimize enrichment cost or coverage"]
dependencies: ["workbooks"]
capability_domains: ["attachments","audiences","brain","cells","columns","evidence","executable_definitions","executables","outreach","record_enrichment","rows","signal_sources","sources","table_runs","table_sources","tables","workbooks","worksheets"]
capability_ids: ["browser.linkedin.network_engagers_list","cells.inspect","cells.read_page","cells.settle","columns.add","columns.archive","columns.list","columns.run","columns.run_all","columns.update","executable_definitions.list_resolved","executables.run","executables.save","linkedin.search_parameters_list","outreach.enrichment_sequence_get","radar.signal_suggestions_get","record_enrichment.create","record_enrichment.get","signal_sources.capture_key_set","signal_sources.create","signal_sources.delete","signal_sources.events_list","signal_sources.get","signal_sources.list","signal_sources.test_event","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.list","table_runs.cancel","table_runs.failure_report","table_runs.get","table_runs.list","table_runs.preview_cost","table_runs.reconcile_column","table_runs.resume","table_runs.retry","table_sources.attach","table_sources.detach","table_sources.list","table_sources.preview_sync","table_sources.reset_frontier","table_sources.restore_frontier","table_sources.run","table_sources.update","usage.action_costs_get","usage.limits_get","usage.status_get"]
max_context_tokens: 2200
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"cell_state","description":"Canonical settled-cell outcome state.","allowed_values":["settled","partial","failed","blocked","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]}]}
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
  kernel_id: sourcing-enrichment
  kernel_file: KERNEL.md
  kernel_sha256: a50844c9de6e211a43f23388f7ff8d873e4e0d18c3bb4e9a481043bcaad641bd
  adapter_sha256: d4e60e1bc205d45c70de08861450c011752f1c150eff7f4df6c58d839a40e19b
  evals_file: evals.json
  evals_sha256: 3e20eafe6a5c2852e44379bf09c1669e37619e70728b4a55bda0854753dc3fb2
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 47 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 25 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.
- Cannot hold a source definition as a capability grant: all 20 source definitions in the pinned manifest are discovery-only and carry no executor id, so granting one would be a no-op. Say the source is reached by attaching it to a worksheet and acting on that attachment.
- Cannot start 11 of the 20 source definitions with `table_sources.run`: their runtime is a canonical producer that lands rows when its authenticated producer sends them, so a manual run is refused with a typed reason instead of queued. Those definitions are source.api_import, source.company_page, source.csv, source.data_provider, source.engaged_with_account, source.engaged_with_company, source.engaged_with_team, source.form_submission, source.keyword_commented, source.product_event, source.webhook_source. Say the source is attached and waiting on its producer.
- Cannot schedule or subscribe a source run: the pinned manifest exposes no scheduling or subscription capability for sources, so a manual `table_sources.run` is the only start. Say scheduled and event-driven source runs are not available in this release.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| cells.inspect | ds_workbook action=inspect_cell |
| cells.read_page | ds_read, or ds_workbook action=read_cells |
| columns.add | ds_workbook action=add_column |
| columns.archive | ds_workbook action=remove_column |
| columns.list | ds_workbook action=list_columns |
| columns.run | ds_workbook action=run |
| columns.run_all | ds_workbook action=run_all |
| columns.update | ds_workbook action=edit_column, or ds_workbook action=set_run_condition |
| executable_definitions.list_resolved | ds_workbook action=list_definitions |
| executables.run | ds_workbook action=run |
| linkedin.search_parameters_list | ds_workbook action=resolve_facets |
| sources.cold_outbound_preview | ds_workbook action=preview |
| table_runs.cancel | ds_workbook action=cancel_run |
| table_runs.failure_report | ds_workbook action=inspect_cell |
| table_runs.get | ds_workbook action=audit |
| table_runs.list | ds_workbook action=audit |
| table_runs.preview_cost | ds_workbook action=preview_cost |
| table_runs.reconcile_column | ds_workbook action=retry_run |
| table_runs.resume | ds_workbook action=retry_run |
| table_runs.retry | ds_workbook action=retry_run |
| table_sources.attach | ds_workbook action=attach_source |
| table_sources.detach | ds_workbook action=detach_source |
| table_sources.preview_sync | ds_workbook action=preview |
| table_sources.run | ds_workbook action=run_all |
| table_sources.update | ds_workbook action=attach_source |
| usage.action_costs_get | ds_analytics action=usage |
| usage.limits_get | ds_analytics action=usage |
| usage.status_get | ds_analytics action=usage |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- browser.linkedin.network_engagers_list
- cells.settle
- executables.save
- outreach.enrichment_sequence_get
- radar.signal_suggestions_get
- record_enrichment.create
- record_enrichment.get
- signal_sources.capture_key_set
- signal_sources.create
- signal_sources.delete
- signal_sources.events_list
- signal_sources.get
- signal_sources.list
- signal_sources.test_event
- sources.cold_outbound_expand
- sources.list
- table_sources.list
- table_sources.reset_frontier
- table_sources.restore_frontier

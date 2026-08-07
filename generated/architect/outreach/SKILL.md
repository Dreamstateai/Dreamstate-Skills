---
id: outreach
name: Outreach lists
description: Define an ICP, pick and test a source, build a workbook of rows, enrich and fit-score them, set run conditions, price a run, and hand qualified rows to a sequence.
triggers: ["build a list of prospects","define an ICP and find matching companies or people","add an enrichment column to a workbook","score and filter rows by fit","test a lead source before committing to it","find out why a run returned so few qualified rows","hand a qualified list to an outreach sequence"]
dependencies: []
capability_domains: ["attachments","audiences","brain","cells","columns","executable_definitions","executables","graph","outreach","radar","record_enrichment","records","rows","runs","selection_snapshots","sequences","signal_sources","sources","table_runs","table_sources","tables","views","workbook_audiences","workbooks","workflows","worksheets"]
capability_ids: ["attachments.create","attachments.delete","attachments.list","audiences.archive","audiences.create","audiences.get","audiences.list","audiences.persona_suggestions","audiences.preview","audiences.sources_list","audiences.update","brain.context.get","brain.context.search","brain.learning.query_benchmarks","cells.inspect","cells.read_page","cells.settle","columns.add","columns.archive","columns.list","columns.run","columns.run_all","columns.update","executable_definitions.list_resolved","executables.run","executables.save","graph.archive_node","graph.archive_relation","graph.contract_get","graph.create_node","graph.create_relation","graph.edges_list","graph.export","graph.get_node","graph.get_relation","graph.restore_node","graph.search","graph.traverse","graph.update_node","graph.update_relation","linkedin.search_parameters_list","outreach.access_get","outreach.activity_list","outreach.credit_usage_get","outreach.demand_plan_get","outreach.enrichment_sequence_get","outreach.global_pause_set","outreach.icps_list","outreach.sender_context_accounts_list","radar.signal_suggestions_get","record_enrichment.create","record_enrichment.get","records.companies_list","records.field_set","records.get","records.list","records.people_list","records.references_resolve","records.search","records.unbound_rows_enroll","rows.count","rows.delete","rows.get","rows.query","rows.restore","rows.upsert","runs.cancel","runs.get","runs.pause","runs.resume","selection_snapshots.create","selection_snapshots.get","sequences.enroll_selection","sequences.publish","signal_sources.capture_key_set","signal_sources.create","signal_sources.delete","signal_sources.events_list","signal_sources.get","signal_sources.list","signal_sources.test_event","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.linkedin_post_engagers_preview","sources.list","table_runs.cancel","table_runs.failure_report","table_runs.get","table_runs.list","table_runs.preview_cost","table_runs.reconcile_column","table_runs.resume","table_runs.retry","table_sources.attach","table_sources.detach","table_sources.list","table_sources.preview","table_sources.preview_sync","table_sources.reset_frontier","table_sources.restore_frontier","table_sources.run","table_sources.update","tables.archive","tables.create","tables.get","tables.list","tables.update","usage.action_costs_get","usage.limits_get","usage.status_get","views.archive","views.create","views.get","views.list","views.update","workbook_audiences.list","workbooks.archive","workbooks.create","workbooks.duplicate","workbooks.get","workbooks.list","workbooks.overview","workbooks.update","workbooks.update_user_state","workflows.activate","workflows.archive","workflows.call_child","workflows.create","workflows.deactivate","workflows.delete","workflows.delivery_binding_get","workflows.draft_publish","workflows.draft_save","workflows.enroll_selection","workflows.get","workflows.graph_apply","workflows.list","workflows.metrics_get","workflows.node_inspect","workflows.node_options","workflows.node_registry","workflows.run_retry","workflows.run_trace_get","workflows.runs_list","workflows.trigger_create","workflows.trigger_delete","workflows.triggers_list","workflows.validate_graph","worksheet.bootstrap","worksheet.viewport","worksheet_exports.create","worksheet_exports.enroll_sequence","worksheets.archive","worksheets.create","worksheets.duplicate","worksheets.list","worksheets.reorder","worksheets.update"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"cell_state","description":"Canonical settled-cell outcome state.","allowed_values":["settled","partial","failed","blocked","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: f576421493706e499305f22b23670520dc9467e4ab6c3cff0d82730c6b56b9ac
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 59276ee1e9bf1d3e
  manifest_digest: 9bc0070263549b8fa230cb4b80589a806b007c54facb52996c3dcfaeef6e99a2
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: f576421493706e499305f22b23670520dc9467e4ab6c3cff0d82730c6b56b9ac
  generator_version: 1.0.0
  kernel_id: outreach
  kernel_file: KERNEL.md
  kernel_sha256: ca8eb43741db8bf726cac42af116583fe9cdca0a169f82cf800521a4a267a39e
  adapter_sha256: 61d84d20df0f02e52047ffd0c5fb05a4c2318226a245d273b54a002df3cd1ee3
  evals_file: evals.json
  evals_sha256: eb0916f337a77ef65b3b971ec030aa2d7e9e71b748d6dfc71719b4a476e47439
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 158 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 80 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.
- Cannot hold a source definition as a capability grant: all 25 source definitions in the pinned manifest are discovery-only and carry no executor id, so granting one would be a no-op. Say the source is reached by attaching it to a worksheet and acting on that attachment.
- Cannot start 15 of the 25 source definitions with `table_sources.run`: their runtime is a canonical producer that lands rows when its authenticated producer sends them, so a manual run is refused with a typed reason instead of queued. Those definitions are source.api_import, source.company_page, source.csv, source.data_provider, source.engaged_with_account, source.engaged_with_company, source.engaged_with_post, source.engaged_with_team, source.form_submission, source.keyword_commented, source.own_post_commented, source.own_post_liked, source.own_post_reacted, source.product_event, source.webhook_source. Say the source is attached and waiting on its producer.
- Cannot schedule or subscribe a source run: the pinned manifest exposes no scheduling or subscription capability for sources, so a manual `table_sources.run` is the only start. Say scheduled and event-driven source runs are not available in this release.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| audiences.preview | ds_workbook action=preview |
| brain.context.get | ds_read |
| brain.context.search | ds_search action=context |
| cells.inspect | ds_workbook action=inspect_cell |
| cells.read_page | ds_read, or ds_workbook action=read_cells |
| columns.add | ds_workbook action=add_column |
| columns.archive | ds_workbook action=remove_column |
| columns.list | ds_workbook action=list_columns |
| columns.run | ds_workbook action=run |
| columns.run_all | ds_workbook action=run_all |
| columns.update | ds_workbook action=edit_column, or ds_workbook action=set_run_condition |
| executables.run | ds_workbook action=run |
| outreach.credit_usage_get | ds_analytics action=usage |
| records.companies_list | ds_records action=list |
| records.field_set | ds_records action=update |
| records.get | ds_read, or ds_records action=get |
| records.list | ds_records action=list |
| records.people_list | ds_records action=list |
| records.references_resolve | ds_search action=records |
| records.search | ds_search action=records |
| records.unbound_rows_enroll | ds_workbook action=enroll, or ds_workbook action=transfer |
| rows.count | ds_workbook action=read_cells, or ds_workbook action=audit |
| rows.get | ds_workbook action=read_cells |
| rows.query | ds_workbook action=read_cells |
| selection_snapshots.create | ds_workbook action=send_rows |
| sequences.enroll_selection | ds_workbook action=enroll |
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
| table_sources.preview | ds_workbook action=preview |
| table_sources.preview_sync | ds_workbook action=preview |
| table_sources.run | ds_workbook action=run_all |
| table_sources.update | ds_workbook action=attach_source |
| tables.archive | ds_workbook action=archive |
| tables.create | ds_workbook action=create |
| tables.get | ds_workbook action=get |
| tables.list | ds_workbook action=list |
| tables.update | ds_workbook action=update |
| usage.action_costs_get | ds_analytics action=usage |
| usage.limits_get | ds_analytics action=usage |
| usage.status_get | ds_analytics action=usage |
| workbooks.archive | ds_workbook action=archive |
| workbooks.create | ds_workbook action=create |
| workbooks.duplicate | ds_workbook action=duplicate |
| workbooks.get | ds_workbook action=get |
| workbooks.list | ds_workbook action=list |
| workbooks.overview | ds_workbook action=get |
| workbooks.update | ds_workbook action=update |
| workflows.enroll_selection | ds_workbook action=enroll |
| workflows.metrics_get | ds_analytics action=workflows |
| worksheet.bootstrap | ds_workbook action=create |
| worksheet.viewport | ds_read |
| worksheet_exports.create | ds_workbook action=send_rows, or ds_workbook action=transfer |
| worksheet_exports.enroll_sequence | ds_workbook action=enroll |
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
- audiences.archive
- audiences.create
- audiences.get
- audiences.list
- audiences.persona_suggestions
- audiences.sources_list
- audiences.update
- brain.learning.query_benchmarks
- cells.settle
- executable_definitions.list_resolved
- executables.save
- graph.archive_node
- graph.archive_relation
- graph.contract_get
- graph.create_node
- graph.create_relation
- graph.edges_list
- graph.export
- graph.get_node
- graph.get_relation
- graph.restore_node
- graph.search
- graph.traverse
- graph.update_node
- graph.update_relation
- linkedin.search_parameters_list
- outreach.access_get
- outreach.activity_list
- outreach.demand_plan_get
- outreach.enrichment_sequence_get
- outreach.global_pause_set
- outreach.icps_list
- outreach.sender_context_accounts_list
- radar.signal_suggestions_get
- record_enrichment.create
- record_enrichment.get
- rows.delete
- rows.restore
- rows.upsert
- runs.cancel
- runs.get
- runs.pause
- runs.resume
- selection_snapshots.get
- sequences.publish
- signal_sources.capture_key_set
- signal_sources.create
- signal_sources.delete
- signal_sources.events_list
- signal_sources.get
- signal_sources.list
- signal_sources.test_event
- sources.cold_outbound_expand
- sources.linkedin_post_engagers_preview
- sources.list
- table_sources.list
- table_sources.reset_frontier
- table_sources.restore_frontier
- views.archive
- views.create
- views.get
- views.list
- views.update
- workbook_audiences.list
- workbooks.update_user_state
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
- workflows.trigger_create
- workflows.trigger_delete
- workflows.triggers_list
- workflows.validate_graph

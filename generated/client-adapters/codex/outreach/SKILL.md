---
id: outreach
name: outreach
description: "Define an ICP, pick and test a source, build a workbook of rows, enrich and fit-score them, set run conditions, price a run, and hand qualified rows to a sequence."
capability_domains: ["attachments","audiences","brain","cells","columns","executable_definitions","executables","graph","outreach","radar","record_enrichment","records","rows","runs","selection_snapshots","sequences","signal_sources","sources","table_runs","table_sources","tables","views","workbook_audiences","workbooks","workflows","worksheets"]
capability_ids: ["attachments.create","attachments.delete","attachments.list","audiences.archive","audiences.create","audiences.get","audiences.list","audiences.persona_suggestions","audiences.preview","audiences.sources_list","audiences.update","brain.context.get","brain.context.search","brain.learning.query_benchmarks","cells.inspect","cells.read_page","cells.settle","columns.add","columns.archive","columns.list","columns.run","columns.run_all","columns.update","executable_definitions.list_resolved","executables.run","executables.save","graph.archive_node","graph.archive_relation","graph.contract_get","graph.create_node","graph.create_relation","graph.edges_list","graph.export","graph.get_node","graph.get_relation","graph.restore_node","graph.search","graph.traverse","graph.update_node","graph.update_relation","linkedin.search_parameters_list","outreach.access_get","outreach.activity_list","outreach.credit_usage_get","outreach.demand_plan_get","outreach.enrichment_sequence_get","outreach.global_pause_set","outreach.icps_list","outreach.sender_context_accounts_list","radar.signal_suggestions_get","record_enrichment.create","record_enrichment.get","records.companies_list","records.field_set","records.get","records.list","records.people_list","records.references_resolve","records.search","records.unbound_rows_enroll","rows.count","rows.delete","rows.get","rows.query","rows.restore","rows.upsert","runs.cancel","runs.get","runs.pause","runs.resume","selection_snapshots.create","selection_snapshots.get","sequences.enroll_selection","sequences.publish","signal_sources.capture_key_set","signal_sources.create","signal_sources.delete","signal_sources.events_list","signal_sources.get","signal_sources.list","signal_sources.test_event","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.linkedin_post_engagers_preview","sources.list","table_runs.cancel","table_runs.failure_report","table_runs.get","table_runs.list","table_runs.preview_cost","table_runs.reconcile_column","table_runs.resume","table_runs.retry","table_sources.attach","table_sources.detach","table_sources.list","table_sources.preview","table_sources.preview_sync","table_sources.reset_frontier","table_sources.restore_frontier","table_sources.run","table_sources.update","tables.archive","tables.create","tables.get","tables.list","tables.update","usage.action_costs_get","usage.limits_get","usage.status_get","views.archive","views.create","views.get","views.list","views.update","workbook_audiences.list","workbooks.archive","workbooks.create","workbooks.duplicate","workbooks.get","workbooks.list","workbooks.overview","workbooks.update","workbooks.update_user_state","workflows.activate","workflows.archive","workflows.call_child","workflows.create","workflows.deactivate","workflows.delete","workflows.delivery_binding_get","workflows.draft_publish","workflows.draft_save","workflows.enroll_selection","workflows.get","workflows.graph_apply","workflows.list","workflows.metrics_get","workflows.node_inspect","workflows.node_options","workflows.node_registry","workflows.run_retry","workflows.run_trace_get","workflows.runs_list","workflows.trigger_create","workflows.trigger_delete","workflows.triggers_list","workflows.validate_graph","worksheet.bootstrap","worksheet.viewport","worksheet_exports.create","worksheet_exports.enroll_sequence","worksheets.archive","worksheets.create","worksheets.duplicate","worksheets.list","worksheets.reorder","worksheets.update"]
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
  client: codex
  kernel_id: outreach
  kernel_file: KERNEL.md
  kernel_sha256: ca8eb43741db8bf726cac42af116583fe9cdca0a169f82cf800521a4a267a39e
  adapter_sha256: bc166715103bdde0571df364a4f70eed46d150b7ab8d4cd1c4d90966fc687a9a
  evals_file: evals.json
  evals_sha256: eb0916f337a77ef65b3b971ec030aa2d7e9e71b748d6dfc71719b4a476e47439
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes `dreamstate_context_create_document`, `dreamstate_context_create_folder`, `dreamstate_context_save_and_publish`, and `dreamstate_context_save_draft` under the same mismatch. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 158 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 80 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.
- Cannot hold a source definition as a capability grant: all 25 source definitions in the pinned manifest are discovery-only and carry no executor id, so granting one would be a no-op. Say the source is reached by attaching it to a worksheet and acting on that attachment.
- Cannot start 15 of the 25 source definitions with `table_sources.run`: their runtime is a canonical producer that lands rows when its authenticated producer sends them, so a manual run is refused with a typed reason instead of queued. Those definitions are source.api_import, source.company_page, source.csv, source.data_provider, source.engaged_with_account, source.engaged_with_company, source.engaged_with_post, source.engaged_with_team, source.form_submission, source.keyword_commented, source.own_post_commented, source.own_post_liked, source.own_post_reacted, source.product_event, source.webhook_source. Say the source is attached and waiting on its producer.
- Cannot schedule or subscribe a source run: the pinned manifest exposes no scheduling or subscription capability for sources, so a manual `table_sources.run` is the only start. Say scheduled and event-driven source runs are not available in this release.

---

# Outreach

<!-- architect-operation-contract
{"required_capability_ids": ["attachments.create", "attachments.delete", "attachments.list", "audiences.archive", "audiences.create", "audiences.get", "audiences.list", "audiences.persona_suggestions", "audiences.preview", "audiences.sources_list", "audiences.update", "brain.context.get", "brain.context.search", "brain.learning.query_benchmarks", "cells.inspect", "cells.read_page", "cells.settle", "columns.add", "columns.archive", "columns.list", "columns.run", "columns.run_all", "columns.update", "executable_definitions.list_resolved", "executables.run", "executables.save", "graph.archive_node", "graph.archive_relation", "graph.contract_get", "graph.create_node", "graph.create_relation", "graph.edges_list", "graph.export", "graph.get_node", "graph.get_relation", "graph.restore_node", "graph.search", "graph.traverse", "graph.update_node", "graph.update_relation", "linkedin.search_parameters_list", "outreach.access_get", "outreach.activity_list", "outreach.credit_usage_get", "outreach.demand_plan_get", "outreach.enrichment_sequence_get", "outreach.global_pause_set", "outreach.icps_list", "outreach.sender_context_accounts_list", "radar.signal_suggestions_get", "record_enrichment.create", "record_enrichment.get", "records.companies_list", "records.field_set", "records.get", "records.list", "records.people_list", "records.references_resolve", "records.search", "records.unbound_rows_enroll", "rows.count", "rows.delete", "rows.get", "rows.query", "rows.restore", "rows.upsert", "runs.cancel", "runs.get", "runs.pause", "runs.resume", "selection_snapshots.create", "selection_snapshots.get", "sequences.enroll_selection", "sequences.publish", "signal_sources.capture_key_set", "signal_sources.create", "signal_sources.delete", "signal_sources.events_list", "signal_sources.get", "signal_sources.list", "signal_sources.test_event", "sources.cold_outbound_expand", "sources.cold_outbound_preview", "sources.linkedin_post_engagers_preview", "sources.list", "table_runs.cancel", "table_runs.failure_report", "table_runs.get", "table_runs.list", "table_runs.preview_cost", "table_runs.reconcile_column", "table_runs.resume", "table_runs.retry", "table_sources.attach", "table_sources.detach", "table_sources.list", "table_sources.preview", "table_sources.preview_sync", "table_sources.reset_frontier", "table_sources.restore_frontier", "table_sources.run", "table_sources.update", "tables.archive", "tables.create", "tables.get", "tables.list", "tables.update", "usage.action_costs_get", "usage.limits_get", "usage.status_get", "views.archive", "views.create", "views.get", "views.list", "views.update", "workbook_audiences.list", "workbooks.archive", "workbooks.create", "workbooks.duplicate", "workbooks.get", "workbooks.list", "workbooks.overview", "workbooks.update", "workbooks.update_user_state", "workflows.activate", "workflows.archive", "workflows.call_child", "workflows.create", "workflows.deactivate", "workflows.delete", "workflows.delivery_binding_get", "workflows.draft_publish", "workflows.draft_save", "workflows.enroll_selection", "workflows.get", "workflows.graph_apply", "workflows.list", "workflows.metrics_get", "workflows.node_inspect", "workflows.node_options", "workflows.node_registry", "workflows.run_retry", "workflows.run_trace_get", "workflows.runs_list", "workflows.trigger_create", "workflows.trigger_delete", "workflows.triggers_list", "workflows.validate_graph", "worksheet.bootstrap", "worksheet.viewport", "worksheet_exports.create", "worksheet_exports.enroll_sequence", "worksheets.archive", "worksheets.create", "worksheets.duplicate", "worksheets.list", "worksheets.reorder", "worksheets.update"]}
-->

Own outbound prospecting end to end: define who qualifies, test and pick a source, build a reviewable Workbook of rows, enrich with columns, fit-score, gate columns with run conditions, price a run before spending, audit the result, and hand the qualified selection to a sequence. `sequences` owns everything after: message copy and the send itself. Done well means every row a user reaches is one they'd have picked by hand, at a cost per qualified lead they can see coming.

## Read this first

1. Discover the ICP before searching anything: goal, what qualifies, what disqualifies, required vs nice-to-have, narrow/broad reading of vague terms. See icp.md.
2. Test the source at a row limit of 10, never create it first. See sources.md.
3. Create the Workbook (worksheet, view) from the tested source. Zero-credit and reversible: execute it, don't ask. Open it with one bootstrap read, page further rows with a viewport read.
4. Add columns one at a time: search the enrichment library before building. Set run conditions as a separate step after the column exists. See columns-and-enrichment.md.
5. Score fit and gate qualification. See fit-scoring-and-economics.md.
6. Price the run with `table_runs.preview_cost` before any paid run. Run a 5-10 row sample first.
7. Audit the batch: qualification rate, cost per qualified lead, real usage. See fit-scoring-and-economics.md.
8. Hand the frozen selection to a workflow or sequence for enrollment and activation. See workflow-and-handoff.md.

## Universal rules

Ask at most one structured question per job, only for what live state cannot answer. Never ask for volume, sender, channel, tone, or cadence during discovery: those are launch bindings, resolved at launch, not intake.

Every row is a credit already spent. Never delete: archive. Never present a first batch as finished, it's a sample for review.

A null value on a required check is `unsure`, stays visible, never disqualifies. Only an actual failure disqualifies and sets fit to 0.

A source owned by a canonical producer (an inbound signal, a form, an import feed) lands rows only when its producer sends them, never from a manual run call. If asked to force one, name what actually controls it instead (its capture key, its test event, its trigger), never claim a manual run succeeded.

Preview and preview_cost never create a column, spend a credit, or commit a row. They are the only real dry run: use them before every paid or destructive step, not after.

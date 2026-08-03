---
id: tables
name: Tables
description: Own every durable dataset deliverable. Create, inspect, revise, and run unified workbooks, worksheets, tables, views, sources, columns, rows, bounded table jobs, and exact record-field operations with lineage and durable verification. A request naming a workbook routes here whatever audience, buyer, or cohort it names.
triggers: ["build a workbook","build a cold outbound or buyer workbook","build a reactive table","inspect a table dataflow","add or revise table columns","run table work safely","read or update a record field used by a table"]
dependencies: []
capability_domains: ["records","tables"]
capability_ids: ["attachments.create","attachments.delete","attachments.list","cells.inspect","cells.read_page","cells.settle","columns.add","columns.archive","columns.list","columns.run","columns.run_all","columns.update","executable_definitions.list_resolved","executables.run","executables.save","records.companies_list","records.field_set","records.get","records.list","records.people_list","records.references_resolve","records.search","rows.delete","rows.get","rows.query","rows.restore","rows.upsert","selection_snapshots.create","selection_snapshots.get","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.linkedin_post_engagers_preview","sources.list","table_runs.cancel","table_runs.failure_report","table_runs.get","table_runs.list","table_runs.preview_cost","table_runs.reconcile_column","table_runs.resume","table_runs.retry","table_sources.attach","table_sources.detach","table_sources.list","table_sources.preview","table_sources.preview_sync","table_sources.reset_frontier","table_sources.restore_frontier","table_sources.run","table_sources.update","tables.archive","tables.create","tables.get","tables.list","tables.update","views.archive","views.create","views.get","views.list","views.update","workbook_audiences.list","workbooks.archive","workbooks.create","workbooks.duplicate","workbooks.get","workbooks.list","workbooks.overview","workbooks.update","workbooks.update_user_state","worksheets.archive","worksheets.create","worksheets.duplicate","worksheets.list","worksheets.reorder","worksheets.update"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"schema_state","description":"Combined row identity, source, and dependency schema state.","allowed_values":["identity_source_dependencies_ready","partial","missing","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"cell_state","description":"Canonical settled-cell outcome state.","allowed_values":["settled","partial","failed","blocked","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 70b89077b92a973aeb192455dbd6aeb4580a7922894b21e19db09bde3dda6ea3
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5da7519babac68b4
  manifest_digest: 87e78f7c73f392e7bd5c6c311620b0be23dbff118c31df9e61e5473f59bb6f25
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 70b89077b92a973aeb192455dbd6aeb4580a7922894b21e19db09bde3dda6ea3
  generator_version: 1.0.0
  kernel_id: tables
  kernel_file: KERNEL.md
  kernel_sha256: 5e33d07682c459c0f397a8b9e2c40f29352d166efb357a96ca7e3c097bb8b831
  adapter_sha256: b78970a6c3d0019521c3664b1f58e04ad0a86d0064be283e92c67d49a0f50aeb
  evals_file: evals.json
  evals_sha256: a2c1b209c9c90959c644383b2d08f9f007b922b4ead8e4893e78652ab171a0b0
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, cost bounds, and the server's ActionDecision into the next step. Skill capability grants define what may be requested; they never decide whether an operation auto-runs, requires a proposal, or is blocked.

Follow the fetched contract and ActionDecision mechanically. When it requires a proposal, create the complete revision-bound artifact with `propose_artifact`, present that exact proposal for human review, and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. When it permits an auto-run, call `tools_run` with the exact bound inputs. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 75 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 43 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.
- Cannot hold a source definition as a capability grant: all 26 source definitions in the pinned manifest are discovery-only and carry no executor id, so granting one would be a no-op. Say the source is reached by attaching it to a worksheet and acting on that attachment.
- Cannot start 22 of the 26 source definitions with `table_sources.run`: their runtime is a canonical producer that lands rows when its authenticated producer sends them, so a manual run is refused with a typed reason instead of queued. Those definitions are source.api_import, source.company_page, source.csv, source.data_provider, source.engaged_with_account, source.engaged_with_company, source.engaged_with_post, source.engaged_with_team, source.form_submission, source.keyword_commented, source.linkedin_connections, source.linkedin_new_connection, source.live_signal, source.mentioned_keyword, source.own_post_commented, source.own_post_liked, source.own_post_reacted, source.product_event, source.salesnav_search, source.url, source.viewed_profile, source.webhook_source. Say the source is attached and waiting on its producer.
- Cannot schedule or subscribe a source run: the pinned manifest exposes no scheduling or subscription capability for sources, so a manual `table_sources.run` is the only start. Say scheduled and event-driven source runs are not available in this release.

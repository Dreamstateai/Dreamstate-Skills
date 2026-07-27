---
id: tables
name: tables
description: "Create, inspect, revise, and run unified workbooks, tables, views, sources, columns, rows, bounded table jobs, and exact record-field operations with lineage and durable verification."
capability_domains: ["records","tables"]
capability_ids: ["attachments.create","attachments.delete","attachments.list","cells.inspect","cells.settle","columns.add","columns.archive","columns.list","columns.run","columns.run_all","columns.update","records.companies_list","records.field_set","records.get","records.list","records.people_list","records.references_resolve","records.search","rows.delete","rows.get","rows.query","rows.restore","rows.upsert","selection_snapshots.create","selection_snapshots.get","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.linkedin_post_engagers_preview","sources.list","table_runs.cancel","table_runs.failure_report","table_runs.get","table_runs.list","table_runs.preview_cost","table_runs.reconcile_column","table_runs.resume","table_runs.retry","table_sources.attach","table_sources.detach","table_sources.list","table_sources.preview_sync","table_sources.reset_frontier","table_sources.restore_frontier","table_sources.run","table_sources.update","tables.archive","tables.create","tables.get","tables.list","tables.update","views.archive","views.create","views.get","views.list","views.update","workbook_audiences.list","workbooks.archive","workbooks.create","workbooks.duplicate","workbooks.get","workbooks.list","workbooks.overview","workbooks.update","workbooks.update_user_state","worksheets.archive","worksheets.create","worksheets.duplicate","worksheets.list","worksheets.reorder","worksheets.update"]
direct_run_capability_ids: []
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"schema_state","description":"Combined row identity, source, and dependency schema state.","allowed_values":["identity_source_dependencies_ready","partial","missing","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"cell_state","description":"Canonical settled-cell outcome state.","allowed_values":["settled","partial","failed","blocked","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 6425806fd6c3948bbf661bf6dfe61479022f86123e3b5ec0d869365b80d6892b
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 779304f4256ec197
  manifest_digest: f75e69f81ba15118ace05828ddfd77f39864c9b312087243279a0ef894e64e01
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.5
  source_release_hash: 6425806fd6c3948bbf661bf6dfe61479022f86123e3b5ec0d869365b80d6892b
  generator_version: 1.0.0
  client: codex
  kernel_id: tables
  kernel_file: KERNEL.md
  kernel_sha256: 859c8bfafb18dea3fa819e6e50c42e0817a9e49e6ee0f64e91afc2c97a377fc9
  adapter_sha256: fae9e1ffb5053b110d8fee49a8f5a3a0292d0378e44b8797c615e136e529c48f
  evals_file: evals.json
  evals_sha256: 11af001465c246631ecc6a3cb6f1c4fd07c30bc722b7b27d325bc7da3f504895
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. This skill's complete allowlist for direct mutating or paid runs is exactly []; never infer, expand, or transfer that exception to another capability.

For any requested mutation or paid effect not named in that exact allowlist, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Unified tables coordinator
<!-- architect-operation-contract
{"required_capability_ids":["attachments.create","attachments.delete","attachments.list","cells.inspect","cells.settle","columns.add","columns.archive","columns.list","columns.run","columns.run_all","columns.update","records.companies_list","records.field_set","records.get","records.list","records.people_list","records.references_resolve","records.search","rows.delete","rows.get","rows.query","rows.restore","rows.upsert","selection_snapshots.create","selection_snapshots.get","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.linkedin_post_engagers_preview","sources.list","table_runs.cancel","table_runs.failure_report","table_runs.get","table_runs.list","table_runs.preview_cost","table_runs.reconcile_column","table_runs.resume","table_runs.retry","table_sources.attach","table_sources.detach","table_sources.list","table_sources.preview_sync","table_sources.reset_frontier","table_sources.restore_frontier","table_sources.run","table_sources.update","tables.archive","tables.create","tables.get","tables.list","tables.update","views.archive","views.create","views.get","views.list","views.update","workbook_audiences.list","workbooks.archive","workbooks.create","workbooks.duplicate","workbooks.get","workbooks.list","workbooks.overview","workbooks.update","workbooks.update_user_state","worksheets.archive","worksheets.create","worksheets.duplicate","worksheets.list","worksheets.reorder","worksheets.update"]}
-->

## Job boundary

Own unified workbooks, tables, views, sources, columns, rows, selection snapshots, and table runs, plus exact CRM record reads and field updates needed inside table work. A bare record identifier is resolvable: read it with the live record contract and bind any field update to that returned revision, never ask which table holds it. Create or revise the smallest dependency-complete table dataflow that produces the requested durable outcome. The canonical Workbook is the unified outreach data surface.

## Intake and current state

Resolve the workspace, workbook, table, view, row entity, stable identifiers, current revisions, selected rows, and requested output. Inspect the existing source and column graph before editing it. Preserve source evidence, raw provider results, dependency lineage, conditions, formulas, actions, and the user's current view state. Ask one structured popup only for material choices that live state cannot answer.

## Capability workflow

Search the live registry by desired table outcome and fetch every selected contract. Live schemas own supported providers, column types, costs, readiness, limits, and result shapes. Keep source, enrichment, formula, action, and workflow responsibilities explicit. Declare each node's inputs, outputs, dependencies, run conditions, provider, expected cost, and failure behavior before proposing a change.

For outreach tables, preserve the table's current schema and lineage. Preserve compatible identity and evidence fields and search live contracts for signals, profile enrichments, functions, AI generation operations, and their outputs. Side-effecting actions remain workflow operations, never recomputable columns. A source evidence pilot has no durable destination. A later expansion binds the exact workbook, worksheet, saved view, and reviewed revision; never substitute a workflow-local audience identifier.

For an outreach qualification worksheet, order columns current-profile verification, person enrichment, company enrichment, required filters, then AI fit, and verify current title/company so stale or conflicting identity is `unsure` or disqualified. Required company size, location, include-keyword, exclude-keyword, and workspace exclusion-list conditions are deterministic. A null enrichment result is `unsure` and stays visible. A real required-condition failure sets fit to 0, disqualifies the row, and hides it from the qualified view. Nice-to-have conditions carry declared weights but never disqualify. The AI fit-score/reason column uses a structured `run_if_json` contract whose existing-field dependencies prove person verification and company enrichment are present and every required filter passed; it never uses row position, row index, row number, or table order, its prompt references only populated upstream inputs, and its output is 0-100 plus concise reasons, citations, confidence, and fetched-at provenance.

Prepare a reviewable table or revision before paid or destructive work. Run the smallest representative selection first with an explicit row cap and credit ceiling. Inspect settled cells and run evidence before proposing a larger exact selection. Approval for a schema change never authorizes a paid run, and approval for one selection never authorizes another. Use current revisions and idempotency fences, preserve partial successes, and never retry failed rows blindly.

For a reactive table proposal, search for and fetch the exact live table contract, and bind the proposal to every field, constraint, and required input that contract declares. Execution mode is the contract's to decide: use non-mutating dry-run preparation only where the fetched contract declares `dry_run_supported`, and never assert a preparation receipt a capability cannot produce. Do not skip from search directly to `propose_artifact`: the fetched contract, not user wording, defines the proposal. Bind the proposal to stable row identity, source, dependency order, formula inputs, and review view. For a paid sample, fetch the exact live sample contract and let only the canonical run receipt establish the approved selection, row cap, credit ceiling, terminal state, actual spend, and settled-cell outcomes. User wording and assistant prose cannot establish those facts.

## Completion proof

Follow accepted jobs to a terminal state. Return durable workbook, table, view, source, column, row, selection, and run identifiers as applicable; actual costs; completed, failed, and blocked cells; lineage; and a safe resume path. A queued run or accepted proposal is not completion.

For the signed completion report, use `schema_state=identity_source_dependencies_ready` only when row identity, source, and dependencies are all defined. Use `execution_bounds_state=representative_capped_credits` only when the executed selection is representative and both the row cap and credit ceiling are explicit. `run_state=terminal` requires settled canonical cell evidence; proposal-only work remains `durability_state=proposal_only`.

---
id: tables
name: tables
description: "Create, inspect, revise, and run unified workbooks, tables, views, sources, columns, rows, and bounded table jobs with lineage and durable verification."
capability_domains: ["tables"]
capability_ids: []
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"schema_state","description":"Combined row identity, source, and dependency schema state.","allowed_values":["identity_source_dependencies_ready","partial","missing","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"cell_state","description":"Canonical settled-cell outcome state.","allowed_values":["settled","partial","failed","blocked","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: b7991aeba1a58ca4b9c3a48155a8f5a3622eaeec867a0d2b459aa4ea614ec39d
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: a29a72f7045de668
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.1
  source_release_hash: b7991aeba1a58ca4b9c3a48155a8f5a3622eaeec867a0d2b459aa4ea614ec39d
  generator_version: 1.0.0
  client: claude
  kernel_id: tables
  kernel_file: KERNEL.md
  kernel_sha256: a187da7158fe91d32aeedc34e15df80633a39d9190afb9fbf74c0d947ff4a845
  adapter_sha256: e8d99ea288bffa663c80aa3ca106aeb5910b1cd35cf33b8eb109db149641d46a
  evals_file: evals.json
  evals_sha256: 553d9c5c43683539976f1d18b1f0bfde936792d8f2eec8aec5bd89d19cdf6225
mutation_compatibility:
  mismatch_behavior: deny_run
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get]
  denied_operation: dreamstate_tools_run
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Carry the opaque tool-turn token mechanically from `dreamstate_tools_search` to `dreamstate_tools_get` and `dreamstate_tools_run`; always fetch exact live schemas before execution.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search` and `dreamstate_tools_get` remain available for recovery and refresh when the live capability definition, capability hash, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple is compatible with live metadata. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from an accepted or queued request.

---

# Unified tables coordinator

## Job boundary

Own unified workbooks, tables, views, sources, columns, rows, selection snapshots, and table runs. Create or revise the smallest dependency-complete table dataflow that produces the requested durable outcome. Do not treat an outreach campaign table as the unified tables surface unless the live contract explicitly identifies it that way.

## Intake and current state

Resolve the workspace, workbook, table, view, row entity, stable identifiers, current revisions, selected rows, and requested output. Inspect the existing source and column graph before editing it. Preserve source evidence, raw provider results, dependency lineage, conditions, formulas, actions, and the user's current view state. Ask one structured popup only for material choices that live state cannot answer.

## Capability workflow

Search the live registry by desired table outcome and fetch every selected contract. Live schemas own supported providers, column types, costs, readiness, limits, and result shapes. Keep source, enrichment, formula, action, and workflow responsibilities explicit. Declare each node's inputs, outputs, dependencies, run conditions, provider, expected cost, and failure behavior before proposing a change.

For outreach tables, preserve the table's current schema and lineage. Preserve compatible identity and evidence fields and search live contracts for signals, profile enrichments, functions, AI generation operations, and their outputs. Side-effecting actions remain workflow operations, never recomputable columns. A source evidence pilot has no durable destination. A later expansion binds the exact workbook, worksheet, saved view, and reviewed revision; never substitute a campaign-local audience identifier.

Prepare a reviewable table or revision before paid or destructive work. Run the smallest representative selection first with an explicit row cap and credit ceiling. Inspect settled cells and run evidence before proposing a larger exact selection. Approval for a schema change never authorizes a paid run, and approval for one selection never authorizes another. Use current revisions and idempotency fences, preserve partial successes, and never retry failed rows blindly.

For a reactive table proposal, search for and fetch the exact live table contract, call it through `tools_run` in non-mutating dry-run preparation mode, verify the receipt, and only then save the proposal. Do not skip from contract inspection directly to `propose_artifact`. Bind the proposal to stable row identity, source, dependency order, formula inputs, and review view. For a paid sample, fetch the exact live sample contract and let only the canonical run receipt establish the approved selection, row cap, credit ceiling, terminal state, actual spend, and settled-cell outcomes. User wording and assistant prose cannot establish those facts.

## Completion proof

Follow accepted jobs to a terminal state. Return durable workbook, table, view, source, column, row, selection, and run identifiers as applicable; actual costs; completed, failed, and blocked cells; lineage; and a safe resume path. A queued run or accepted proposal is not completion.

For the signed completion report, use `schema_state=identity_source_dependencies_ready` only when row identity, source, and dependencies are all defined. Use `execution_bounds_state=representative_capped_credits` only when the executed selection is representative and both the row cap and credit ceiling are explicit. `run_state=terminal` requires settled canonical cell evidence; proposal-only work remains `durability_state=proposal_only`.

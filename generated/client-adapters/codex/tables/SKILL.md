---
id: tables
name: tables
description: "Create, inspect, revise, and run unified workbooks, tables, views, sources, columns, rows, and bounded table jobs with lineage and durable verification."
capability_domains: ["tables"]
capability_ids: ["columns.sample","tables.create"]
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"schema_state","description":"Combined row identity, source, and dependency schema state.","allowed_values":["identity_source_dependencies_ready","partial","missing","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"cell_state","description":"Canonical settled-cell outcome state.","allowed_values":["settled","partial","failed","blocked","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 032a861caa0a439b4560be2b3d8af54818cb3cc7560d72718cbf864f371100d1
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: f545d33b0e147d4e
  manifest_digest: 897c121cd546d3212a7fed051f8198cfe4631eef1ab82ef4fbd2aec96321353b
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.1
  source_release_hash: 032a861caa0a439b4560be2b3d8af54818cb3cc7560d72718cbf864f371100d1
  generator_version: 1.0.0
  client: codex
  kernel_id: tables
  kernel_file: KERNEL.md
  kernel_sha256: 1f149047890aa1ec48855cc23437e3576dd9b09ae14eb3004b57d17c290dd6d5
  adapter_sha256: 5ae4590e6d1ad3b7e3bda4638e899f5967e3fc790928b2dbf4cb5b2f43b3c2d2
  evals_file: evals.json
  evals_sha256: 553d9c5c43683539976f1d18b1f0bfde936792d8f2eec8aec5bd89d19cdf6225
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is only for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. Never use `dreamstate_tools_run` for direct mutating or paid work.

For any requested mutation or paid effect, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Unified tables coordinator
<!-- architect-operation-contract
{"required_capability_ids":["columns.sample","tables.create"]}
-->

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

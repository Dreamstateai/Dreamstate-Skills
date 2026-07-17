---
id: tables
name: tables
description: "Create, inspect, revise, and run unified workbooks, tables, views, sources, columns, rows, and bounded table jobs with lineage and durable verification."
capability_domains: ["tables"]
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 52cb9816bdec3b5a061bf9daebdcbe659c6b78b3a8cbc595a23e6127103a07ba
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 14ccc37cfc5df853
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.4.0
  source_release_hash: 52cb9816bdec3b5a061bf9daebdcbe659c6b78b3a8cbc595a23e6127103a07ba
  generator_version: 1.0.0
  client: codex
  kernel_id: tables
  kernel_file: KERNEL.md
  kernel_sha256: ab1c9eface65b504b89af93739b3afa05c3637fb80fd6329a0cfa84ad41d96b1
  adapter_sha256: 2aad6cc6aa97169d8cc78f6a7b69ad95c40ab40c22ad77656cef9da1390a65ba
  evals_file: evals.json
  evals_sha256: aacb5e127d0eab6090d7d6227b0503fe65d6207fcfd18a386806aadc59fa3156
mutation_compatibility:
  mismatch_behavior: deny_run
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get]
  denied_operation: dreamstate_tools_run
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Carry the opaque tool-turn token mechanically from `dreamstate_tools_search` to `dreamstate_tools_get` and `dreamstate_tools_run`; always fetch exact live schemas before execution.

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

Prepare a reviewable table or revision before paid or destructive work. Run the smallest representative selection first with an explicit row cap and credit ceiling. Inspect settled cells and run evidence before proposing a larger exact selection. Approval for a schema change never authorizes a paid run, and approval for one selection never authorizes another. Use current revisions and idempotency fences, preserve partial successes, and never retry failed rows blindly.

## Completion proof

Follow accepted jobs to a terminal state. Return durable workbook, table, view, source, column, row, selection, and run identifiers as applicable; actual costs; completed, failed, and blocked cells; lineage; and a safe resume path. A queued run or accepted proposal is not completion.

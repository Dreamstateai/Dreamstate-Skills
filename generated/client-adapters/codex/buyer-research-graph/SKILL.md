---
id: buyer-research-graph
name: buyer-research-graph
description: "Research buyers through canonical enrichment evidence and knowledge-graph nodes, relations, traversals, provenance, revisions, lifecycle, and exports."
capability_domains: ["graph","records"]
capability_ids: ["graph.archive_node","graph.archive_relation","graph.contract_get","graph.create_node","graph.create_relation","graph.edges_list","graph.export","graph.get_node","graph.get_relation","graph.restore_node","graph.search","graph.traverse","graph.update_node","graph.update_relation","record_enrichment.create","record_enrichment.get"]
completion_contract: {"version":1,"fields":[{"id":"graph_evidence_state","description":"Research provenance and confidence state.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"graph_state","description":"Canonical graph identity and revision state.","allowed_values":["exact_current","exact_historical","partial","missing","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 8a52648086a5be5d14a61d2cd59ec3331dc67c3f3a6c6d401e5fb10f3873ab95
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 24386058e1adfd30
  manifest_digest: 2f0a711066546d363fec386dac860f5b86aeeeaec329dc879d69e9d6ed40e631
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 8a52648086a5be5d14a61d2cd59ec3331dc67c3f3a6c6d401e5fb10f3873ab95
  generator_version: 1.0.0
  client: codex
  kernel_id: buyer-research-graph
  kernel_file: KERNEL.md
  kernel_sha256: 53c335f0095f4427c50dd3f6f147ef450ac5fbc187417b1ebced7a570836e440
  adapter_sha256: 2a189168eabca41e3a48f3157d6e3c89cebae3afec9bbaae4c09b11f2a2743b4
  evals_file: evals.json
  evals_sha256: 78fae7e90e27d068d43fa71a16cef282e8012ce549091ff4829c4090fc92abde
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

- Cannot act outside this contract: exactly 16 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 8 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Buyer research and knowledge graph
<!-- architect-operation-contract
{"required_capability_ids":["graph.archive_node","graph.archive_relation","graph.contract_get","graph.create_node","graph.create_relation","graph.edges_list","graph.export","graph.get_node","graph.get_relation","graph.restore_node","graph.search","graph.traverse","graph.update_node","graph.update_relation","record_enrichment.create","record_enrichment.get"]}
-->

Use the canonical knowledge graph and enrichment records to research buyers. Read the graph contract first, then search, traverse, and open exact nodes, relations, edges, and enrichment evidence. Preserve IDs, types, revisions, provenance, confidence, conflicts, timestamps, and availability.

Never turn approximate research into a canonical fact without provenance. Create or update only contract-valid nodes and relations against current revisions. Archive and restore exact graph identities only after impact is shown and explicit confirmation is granted. Export must preserve the authoritative graph scope and revision.

Return a cited research brief plus exact graph and enrichment identities, revision state, conflicts, durable receipts, and deep links.

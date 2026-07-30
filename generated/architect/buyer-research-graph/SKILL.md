---
id: buyer-research-graph
name: Buyer Research Graph
description: Research buyers through canonical enrichment evidence and knowledge-graph nodes, relations, traversals, provenance, revisions, lifecycle, and exports.
triggers: ["research a buyer or company","read the knowledge graph","create or update graph facts","archive or export graph evidence"]
dependencies: ["records"]
capability_domains: ["graph","records"]
capability_ids: ["graph.archive_node","graph.archive_relation","graph.contract_get","graph.create_node","graph.create_relation","graph.edges_list","graph.export","graph.get_node","graph.get_relation","graph.restore_node","graph.search","graph.traverse","graph.update_node","graph.update_relation","record_enrichment.create","record_enrichment.get"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"graph_evidence_state","description":"Research provenance and confidence state.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"graph_state","description":"Canonical graph identity and revision state.","allowed_values":["exact_current","exact_historical","partial","missing","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: e2aaaa6020d1d0c496bf21b1179e38aa2f43e5dbb8a9cdece100bd507a3fae29
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 8ba8c82bd38f553e
  manifest_digest: 9f0fd7349ac4b713a023dc91b7b3a1f0e9acbf751667820a99a1845eb3565d95
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: e2aaaa6020d1d0c496bf21b1179e38aa2f43e5dbb8a9cdece100bd507a3fae29
  generator_version: 1.0.0
  kernel_id: buyer-research-graph
  kernel_file: KERNEL.md
  kernel_sha256: 53c335f0095f4427c50dd3f6f147ef450ac5fbc187417b1ebced7a570836e440
  adapter_sha256: 919faa8247e2dca8f368bddd0468c2c03230d91fd17121b480e6de5f8f6da5f6
  evals_file: evals.json
  evals_sha256: e62ee2aa879f13e673b007ece474c3b9b9c08970a689f752acf1a3cef79468c5
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

- Cannot act outside this contract: exactly 16 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 8 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

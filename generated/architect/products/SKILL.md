---
id: products
name: Products
description: Inspect and govern product evidence sources, website captures, document processing, metadata, refreshes, and exact archival with bounded cost.
triggers: ["inspect product sources","process a product document","scrape or refresh a product website","archive product evidence"]
dependencies: []
capability_domains: ["products"]
capability_ids: ["brain.context.graph","products.content_archive","products.content_list","products.document_process","products.og_meta_get","products.website_refresh","products.website_scrape"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 91b7bc084f4f3ad7920057128b7deeb9d5aa3dcbe347e4ea65552d593a5ece88
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5bd51a68ef00f441
  manifest_digest: f71a57af4031c49ae5196f700bc1d62a7307d0ef152ff1d7a649f3e34506052b
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 91b7bc084f4f3ad7920057128b7deeb9d5aa3dcbe347e4ea65552d593a5ece88
  generator_version: 1.0.0
  kernel_id: products
  kernel_file: KERNEL.md
  kernel_sha256: 98f746e7a136c6b80a3ac9bd7bedf42a1e5775c4b93d25f96f66f8c67f1570b8
  adapter_sha256: df4cf30a48d9d3c34d8e85b3007598c33b30bde5513eb02bc7506812e3356480
  evals_file: evals.json
  evals_sha256: 6e2eb621a9f6c52197ea5f54f5c119d36ec8934119e68bd16d729cc7b5e90707
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

- Cannot act outside this contract: exactly 7 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 4 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

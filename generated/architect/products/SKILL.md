---
id: products
name: Products
description: Inspect and govern product evidence sources, website captures, document processing, metadata, refreshes, and exact archival with bounded cost.
triggers: ["inspect product sources","process a product document","scrape or refresh a product website","archive product evidence"]
dependencies: []
capability_domains: ["products"]
capability_ids: ["brain.context.graph","products.content_archive","products.content_list","products.document_process","products.get","products.list","products.og_meta_get","products.website_refresh","products.website_scrape"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 50220083886d52d07c754bfa43b61c4613271a9bfb3833070e9d4f28cd726a5f
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: b157ca9af8e41603
  manifest_digest: e5897473780f939766bb058fafd7c8c056058039d0f98d0db7c78c78e4e976c8
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 50220083886d52d07c754bfa43b61c4613271a9bfb3833070e9d4f28cd726a5f
  generator_version: 1.0.0
  kernel_id: products
  kernel_file: KERNEL.md
  kernel_sha256: b0db424c7b14799eca725aad6c1a03eb24c205db36c5e9b29496fbfcc2d8bb0c
  adapter_sha256: 175cb449604acac38dcb1a0d7ceb94097656d27ea0f602e3890e4273b5011dbf
  evals_file: evals.json
  evals_sha256: 05786fe7cce20bb993570d8ba64175b46398e02edcf42d8bf7cf4cd9cc890152
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

- Cannot act outside this contract: exactly 9 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 4 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

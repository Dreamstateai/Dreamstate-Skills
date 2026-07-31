---
id: webhooks
name: Webhooks
description: Inspect and govern webhook configuration and delivery evidence without exposing secrets, including exact receipt-backed test deliveries.
triggers: ["list webhooks","create or delete a webhook","inspect webhook deliveries","send a webhook test"]
dependencies: []
capability_domains: ["webhooks"]
capability_ids: ["webhooks.create","webhooks.delete","webhooks.deliveries_list","webhooks.list","webhooks.test_delivery"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 2424e68181076ab6153d45252057e6ef9dd3659a3cfe5d094db72e147faaba82
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 24386058e1adfd30
  manifest_digest: 2f0a711066546d363fec386dac860f5b86aeeeaec329dc879d69e9d6ed40e631
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 2424e68181076ab6153d45252057e6ef9dd3659a3cfe5d094db72e147faaba82
  generator_version: 1.0.0
  kernel_id: webhooks
  kernel_file: KERNEL.md
  kernel_sha256: e2a4d7c0f98421e1f005f3cfd2b65bc4b70d79bbe4ebbb2469351543f5296d81
  adapter_sha256: c19fcd7442e490b3f3bdfcc3f05d35f9465670a24e3068aae28fced51222c685
  evals_file: evals.json
  evals_sha256: b8cd5ca6a41939a69760426067156e439a128104cb1fdd3cea1396a4da7257f4
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

- Cannot act outside this contract: exactly 5 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 3 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

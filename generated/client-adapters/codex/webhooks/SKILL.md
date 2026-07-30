---
id: webhooks
name: webhooks
description: "Inspect and govern webhook configuration and delivery evidence without exposing secrets, including exact receipt-backed test deliveries."
capability_domains: ["webhooks"]
capability_ids: ["webhooks.create","webhooks.delete","webhooks.deliveries_list","webhooks.list","webhooks.test_delivery"]
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
  client: codex
  kernel_id: webhooks
  kernel_file: KERNEL.md
  kernel_sha256: e2a4d7c0f98421e1f005f3cfd2b65bc4b70d79bbe4ebbb2469351543f5296d81
  adapter_sha256: a0631ce5b638be81bb6b7731c191ec870cb17af979a4b0f98faa928d7e830d82
  evals_file: evals.json
  evals_sha256: b8cd5ca6a41939a69760426067156e439a128104cb1fdd3cea1396a4da7257f4
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

- Cannot act outside this contract: exactly 5 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 3 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Webhook operations
<!-- architect-operation-contract
{"required_capability_ids":["webhooks.create","webhooks.delete","webhooks.deliveries_list","webhooks.list","webhooks.test_delivery"]}
-->

Manage workspace webhooks without exposing or requesting secrets in chat. List current endpoints and delivery evidence first. Preserve webhook ID, exact destination identity, subscribed events, status, revision, delivery timestamps, response classifications, and deep link; redact credentials and payload secrets.

Create or delete only the exact endpoint and event set requested. Test delivery is an external effect: use the server ActionDecision for its exact destination and consequence, retain its provider receipt, and never claim success from enqueue alone.

Zero-credit reversible local configuration follows the server decision directly. External test delivery requires the consequence decision the live contract specifies.

---
id: signals
name: signals
description: "Inspect and govern signal sources, capture readiness, observed events, radar suggestions, and exact evidence-producing test events."
capability_domains: ["signals"]
capability_ids: ["radar.signal_suggestions_get","signal_sources.capture_key_set","signal_sources.create","signal_sources.delete","signal_sources.events_list","signal_sources.get","signal_sources.list","signal_sources.test_event"]
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 00bec8d31dc672d9
  manifest_digest: 6754a12996b1ba6581c889f47533d4469f8bdcad8c153876a061e9bf98071bf9
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  generator_version: 1.0.0
  client: codex
  kernel_id: signals
  kernel_file: KERNEL.md
  kernel_sha256: 665dfc04657526b90c547cefbfe0874fbd2a94cea6f0a0c55bb019835f07574b
  adapter_sha256: b7f79379ae09c8253d3a97bb11ebc7ee82b1000e46754d2d7ad906fe12199ef5
  evals_file: evals.json
  evals_sha256: 75b4107afb5f4864306a1c759dc5edf08810d02ea75cb0dbcddc891d17df78de
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

- Cannot act outside this contract: exactly 8 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 4 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Signal source operations
<!-- architect-operation-contract
{"required_capability_ids":["radar.signal_suggestions_get","signal_sources.capture_key_set","signal_sources.create","signal_sources.delete","signal_sources.events_list","signal_sources.get","signal_sources.list","signal_sources.test_event"]}
-->

Manage canonical signal sources and inspect their observed events. Read existing sources, exact configuration, recent events, and grounded radar suggestions before changing anything. Suggestions are candidates, never automatic qualification truth.

Create, configure, or delete only an exact source ID and revision. Never expose capture keys; set them through the governed capability and report only readiness. A test event is external evidence-producing work: retain its exact receipt and do not claim that future monitoring works from enqueue alone.

Local zero-credit reversible configuration follows the server ActionDecision directly. Preserve source ID, type, status, event schema, freshness, completeness, cost, receipt, and deep link.

---
id: records-transfer
name: records-transfer
description: "Stage, validate, run, inspect, control, and retrieve canonical record import and export jobs with row-level evidence."
capability_domains: ["records"]
capability_ids: ["record_exports.control","record_exports.create","record_exports.download","record_exports.get","record_imports.control","record_imports.create","record_imports.errors_list","record_imports.get","record_imports.list","record_imports.rows_stage","record_imports.source_upload"]
completion_contract: {"version":1,"fields":[{"id":"transfer_run_state","description":"Canonical transfer job terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"transfer_evidence_state","description":"Row and artifact evidence status.","allowed_values":["verified","partial","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 551d0b0e82196b38dbf5ece95179fc773ee1cb33cec1761d37d0ecb7d883eeae
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 90203e36c720ed48
  manifest_digest: 0bab290777e70ca078ffd43fb74ee446391b1bfe500d3009fc42cc724a1a349b
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 551d0b0e82196b38dbf5ece95179fc773ee1cb33cec1761d37d0ecb7d883eeae
  generator_version: 1.0.0
  client: codex
  kernel_id: records-transfer
  kernel_file: KERNEL.md
  kernel_sha256: 09eb3bc15afff2e09b68705290a9ad403ac9ab4608d82bd7c424617cb4078797
  adapter_sha256: 58ca58bcba1e5ed557a7eb4513f195ff8e5c7d333bb5f18aa6a6d40c3db88346
  evals_file: evals.json
  evals_sha256: 03a8172acf5bda828876ac96b45de56c90b2135f2dc30a47c99e8b063304665a
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

- Cannot act outside this contract: exactly 11 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 6 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Records import and export
<!-- architect-operation-contract
{"required_capability_ids":["record_exports.control","record_exports.create","record_exports.download","record_exports.get","record_imports.control","record_imports.create","record_imports.errors_list","record_imports.get","record_imports.list","record_imports.rows_stage","record_imports.source_upload"]}
-->

Use canonical transfer jobs with explicit object, source, mapping, selection, and revision authority. Stage and validate import rows before creating an import. Retain upload identity, mapping revision, row results, errors, source identity, created record IDs, and terminal receipts.

For exports, preserve exact filter/selection snapshots and never treat a download URL as durable completion without the canonical export job. Import/export retry, cancel, or other control actions require the exact current job and explicit server confirmation. Report partial row outcomes instead of flattening them into success.

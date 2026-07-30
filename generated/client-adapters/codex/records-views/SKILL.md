---
id: records-views
name: records-views
description: "Create, inspect, revise, execute, and delete canonical saved record views with exact filters, projections, runtime revisions, and results."
capability_domains: ["records"]
capability_ids: ["saved_views.create","saved_views.delete","saved_views.list","saved_views.results","saved_views.update","saved_views.v2_create","saved_views.v2_execute","saved_views.v2_list","saved_views.v2_runtime_upsert"]
completion_contract: {"version":1,"fields":[{"id":"view_artifact_state","description":"Durable saved-view artifact state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"view_result_state","description":"Result evidence and pagination status.","allowed_values":["verified","partial","unavailable","not_applicable"]}]}
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
  client: codex
  kernel_id: records-views
  kernel_file: KERNEL.md
  kernel_sha256: e9b5e5a12b07fbf14958d07bcac5922fdfe80394ce6554f21d24b68d99cb938c
  adapter_sha256: 5bdef9ebdccfb2f81d13364575f9dc86d66c71fac41022c0859ba58203e8a054
  evals_file: evals.json
  evals_sha256: 3cf21753f3a28e9d2fa2a79c6c66655ff58d26e76ec541718bf919e564b55427
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

- Cannot act outside this contract: exactly 9 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 5 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Records saved views
<!-- architect-operation-contract
{"required_capability_ids":["saved_views.create","saved_views.delete","saved_views.list","saved_views.results","saved_views.update","saved_views.v2_create","saved_views.v2_execute","saved_views.v2_list","saved_views.v2_runtime_upsert"]}
-->

Treat saved views as durable, revisioned record queries. Inspect the live object schema and current view before creating, updating, executing, or deleting. Preserve filter, sort, projection, nullable semantics, runtime revision, result identity, and deep link.

Use v2 runtime operations when the view contract requires them; never silently translate unsupported filters. Deletion requires exact view identity and explicit confirmation. Verify creates and updates by readback and report result pagination honestly.

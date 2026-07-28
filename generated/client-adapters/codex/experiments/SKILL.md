---
id: experiments
name: experiments
description: "Create, revise, approve, measure, publish, stop, inspect, and conclude governed growth experiments with immutable evidence and guardrails."
capability_domains: ["growth"]
capability_ids: ["growth.governed_experiment_approve","growth.governed_experiment_conclude","growth.governed_experiment_create","growth.governed_experiment_get","growth.governed_experiment_list","growth.governed_experiment_measurement_record","growth.governed_experiment_publication_record","growth.governed_experiment_revise","growth.governed_experiment_stop"]
completion_contract: {"version":1,"fields":[{"id":"experiment_artifact_state","description":"Durable governed-experiment state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"experiment_evidence_state","description":"Publication and measurement evidence state.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 4a08db5d3a34df1c10971f9692222764b108a94dc2734bebebba97bd69df1379
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5d0fd03da3726899
  manifest_digest: c736598d5698918913d924c5887ad5856c88f7dbb735dacb5f2824a5a33039f2
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 4a08db5d3a34df1c10971f9692222764b108a94dc2734bebebba97bd69df1379
  generator_version: 1.0.0
  client: codex
  kernel_id: experiments
  kernel_file: KERNEL.md
  kernel_sha256: 1af58fa508afe884136151c8810eb767a4cdd2472f3fd0b0a104586bceb78007
  adapter_sha256: 4dfde36915be985f9af7f5ed41b174833b35aa91c67533a439b13e7ad5b45972
  evals_file: evals.json
  evals_sha256: 3109cba0f4f7ae3d506264b257676196a0dd105879b95d5d5446ff18d1612bca
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 9 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 7 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Governed growth experiments
<!-- architect-operation-contract
{"required_capability_ids":["growth.governed_experiment_approve","growth.governed_experiment_conclude","growth.governed_experiment_create","growth.governed_experiment_get","growth.governed_experiment_list","growth.governed_experiment_measurement_record","growth.governed_experiment_publication_record","growth.governed_experiment_revise","growth.governed_experiment_stop"]}
-->

Use governed experiments for durable tests with an explicit hypothesis, population, treatment, control, metric, guardrails, evidence plan, owner, timebox, and revision. Inspect current state before every mutation.

Create and revise designs as reviewable drafts. Approval, publication evidence, measurement evidence, stop, and conclusion are distinct durable events; never infer one from another. Approval, stop, and conclusion require the server's explicit current confirmation contract. Record observations without rewriting the hypothesis, and conclude only from retained evidence while reporting uncertainty and guardrail breaches.

Return experiment and revision IDs, design digest, status, evidence receipts, measurements, publication state, decision, and deep link.

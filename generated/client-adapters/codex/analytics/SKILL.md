---
id: analytics
name: analytics
description: "Diagnose current measured performance with explicit time ranges, provenance, limitations, confidence, and evidence-backed recommendations."
capability_domains: []
capability_ids: ["social.analytics_query","social.post_analytics"]
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 6359baa7a6c3b63c324668d10359b541883b7696a4b73e7472a76e1e47dea264
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 01002d9587befbf3
  manifest_digest: f91ed1b74ebe129ef522f45fdcaec299626b3b5f1d0209e2d0a44bf4684f9ab0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.3
  source_release_hash: 6359baa7a6c3b63c324668d10359b541883b7696a4b73e7472a76e1e47dea264
  generator_version: 1.0.0
  client: codex
  kernel_id: analytics
  kernel_file: KERNEL.md
  kernel_sha256: 5ae6d4d3a1b6a7ed2e565b5bb87b9565f14f9998c7c14006b77eadc335e20049
  adapter_sha256: 5ae4590e6d1ad3b7e3bda4638e899f5967e3fc790928b2dbf4cb5b2f43b3c2d2
  evals_file: evals.json
  evals_sha256: d815f6c1c23673c342ceb15287c29db3e0ac044f5ec5c2fda873f2cd67f6ec7e
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is only for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. Never use `dreamstate_tools_run` for direct mutating or paid work.

For any requested mutation or paid effect, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Growth analytics
<!-- architect-operation-contract
{"required_capability_ids":["social.analytics_query","social.post_analytics"]}
-->

Explain current measured performance and recommend evidence-backed next actions. Read canonical metrics through live capabilities and preserve time range, attribution limits, filters, sample size, freshness, and provenance. Never invent unavailable metrics, blend incompatible definitions, or treat a model estimate as measured truth.

Derive the decision the user is trying to make. Ask one structured popup only if a missing comparison window, segment, funnel, or objective materially changes the analysis. Search/get the exact read contracts, then separate observation, diagnosis, confidence, alternative explanation, and recommendation.

Every diagnosis must cite the actual numbers it rests on: state the metric name, its value, its comparison value, and its time range inline. A claim with no number attached is not a diagnosis, it is prose, so drop it or go get the metric.

Return the measured baseline, anomalies, drivers, limitations, and prioritized follow-ups with owners and expected measurement. Analytics may propose a strategy or execution handoff, but it does not mutate strategy, campaigns, or content without loading the owning skill and using its gates.

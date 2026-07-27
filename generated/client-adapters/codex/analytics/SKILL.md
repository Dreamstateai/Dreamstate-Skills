---
id: analytics
name: analytics
description: "Diagnose current measured performance with explicit time ranges, provenance, limitations, confidence, and evidence-backed recommendations."
capability_domains: []
capability_ids: []
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: b7991aeba1a58ca4b9c3a48155a8f5a3622eaeec867a0d2b459aa4ea614ec39d
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: a29a72f7045de668
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.1
  source_release_hash: b7991aeba1a58ca4b9c3a48155a8f5a3622eaeec867a0d2b459aa4ea614ec39d
  generator_version: 1.0.0
  client: codex
  kernel_id: analytics
  kernel_file: KERNEL.md
  kernel_sha256: 249605006935d0cc26eda0b00f305e90272f14fa92cecf3af25d4b17b628458d
  adapter_sha256: 2aad6cc6aa97169d8cc78f6a7b69ad95c40ab40c22ad77656cef9da1390a65ba
  evals_file: evals.json
  evals_sha256: 1192535f1842d0a81e773435e0fe0404842d579ae8feb6983175627dd6a3b7ff
mutation_compatibility:
  mismatch_behavior: deny_run
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get]
  denied_operation: dreamstate_tools_run
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Carry the opaque tool-turn token mechanically from `dreamstate_tools_search` to `dreamstate_tools_get` and `dreamstate_tools_run`; always fetch exact live schemas before execution.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search` and `dreamstate_tools_get` remain available for recovery and refresh when the live capability definition, capability hash, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple is compatible with live metadata. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from an accepted or queued request.

---

# Growth analytics

Explain current measured performance and recommend evidence-backed next actions. Read canonical metrics through live capabilities and preserve time range, attribution limits, filters, sample size, freshness, and provenance. Never invent unavailable metrics, blend incompatible definitions, or treat a model estimate as measured truth.

Load this skill for measured LinkedIn, X, or other social performance diagnosis, including a request to explain why engagement or another observed channel metric changed over a named period.

Derive the decision the user is trying to make. Ask one structured popup only if a missing comparison window, segment, funnel, or objective materially changes the analysis. Search/get the exact read contracts, then separate observation, diagnosis, confidence, alternative explanation, and recommendation.

Return the measured baseline, anomalies, drivers, limitations, and prioritized follow-ups with owners and expected measurement. Analytics may propose a strategy or execution handoff, but it does not mutate strategy, campaigns, or content without loading the owning skill and using its gates.

---
id: analytics
name: Analytics
description: Diagnose current measured performance with explicit time ranges, provenance, limitations, confidence, and evidence-backed recommendations.
triggers: ["analyze growth performance","explain a metric change","diagnose a funnel","compare measured channel results"]
dependencies: []
capability_domains: []
capability_ids: ["social.analytics_query","social.post_analytics"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 15472f68c443fe99509c5ddd2d098fe1779e168b6eecc73bb1c24e0d8fb98124
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 70acbffd5d943747
  manifest_digest: c96369c54f9a7ac91ef0c4e47fedf77ed78dc50c242c04d7478a26f06e04c034
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.3
  source_release_hash: 15472f68c443fe99509c5ddd2d098fe1779e168b6eecc73bb1c24e0d8fb98124
  generator_version: 1.0.0
  kernel_id: analytics
  kernel_file: KERNEL.md
  kernel_sha256: a48b98769962cb685e655db06ee27e04b8a858986bc61ba8d0b665192814b2e6
  adapter_sha256: ecd475ca0450067312a912d3d5800ccc94ce008d768fc7176e14adaaedf1a36d
  evals_file: evals.json
  evals_sha256: 8b763307e1dcb9abe3fbe909dbcd3c92f222ebe1ce947524d2771188eed60836
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, and cost bounds into the next step. `tools_run` is only for direct operations the fetched contract explicitly proves are zero-cost validators or canonical reads. Never use `tools_run` for direct mutating or paid work.

For every requested mutation or paid effect, create the complete revision-bound artifact with `propose_artifact`. Present that exact proposal for human review and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. Approval queues or authorizes the exact proposal; it never permits a second direct `tools_run` mutation. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

---
id: analytics
name: Analytics
description: Diagnose current measured performance with explicit time ranges, provenance, limitations, confidence, and evidence-backed recommendations.
triggers: ["analyze growth performance","explain a metric change","diagnose a funnel","compare measured channel results"]
dependencies: []
capability_domains: []
max_context_tokens: 3000
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 04784d702af011050f185a5e9cc4c3c3c4224e12d4000a28c0c7cb36e89e8a24
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: f195bb71cf76a615
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.3.0
  source_release_hash: 04784d702af011050f185a5e9cc4c3c3c4224e12d4000a28c0c7cb36e89e8a24
  generator_version: 1.0.0
  kernel_id: analytics
  kernel_file: KERNEL.md
  kernel_sha256: f2db66bc68dcaddc41c4c176e288539d1345178f42e98c35cd5892ec7b2ea49c
  adapter_sha256: 93b82937c3e828f27396787ea433b42264e6aa94a5121903507975ea17071560
  evals_file: evals.json
  evals_sha256: 1192535f1842d0a81e773435e0fe0404842d579ae8feb6983175627dd6a3b7ff
mutation_compatibility:
  mismatch_behavior: deny_run
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, and cost bounds into the next step. `tools_run` is only for direct operations the fetched contract explicitly proves are zero-cost validators or canonical reads. Never use `tools_run` for direct mutating or paid work.

For every requested mutation or paid effect, create the complete revision-bound artifact with `propose_artifact`. Present that exact proposal for human review and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. Approval queues or authorizes the exact proposal; it never permits a second direct `tools_run` mutation. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

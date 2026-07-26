---
id: social
name: Social
description: Coordinate authored LinkedIn, X, and Reddit content across drafts, calendars, review, publishing, and measured performance.
triggers: ["author a social post","build a social calendar","schedule or publish authored content","analyze social performance"]
dependencies: []
capability_domains: ["brain","content"]
capability_ids: ["brain.context.get","brain.context.search","brain.learning.query_benchmarks","content.artifact_create","content.artifact_generate","content.delivery_publish","content.schedule"]
max_context_tokens: 5000
completion_contract: {"version":1,"fields":[{"id":"provider_status","description":"Social provider connection or availability status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: ee049aedfc65ed0b493f73721673e2bba31d7cd32ec82af5677442c5ef3142bd
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 01002d9587befbf3
  manifest_digest: f91ed1b74ebe129ef522f45fdcaec299626b3b5f1d0209e2d0a44bf4684f9ab0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.3
  source_release_hash: ee049aedfc65ed0b493f73721673e2bba31d7cd32ec82af5677442c5ef3142bd
  generator_version: 1.0.0
  kernel_id: social
  kernel_file: KERNEL.md
  kernel_sha256: c6ea678f6dd053284bf921a0c4518a6de7f9a9c2dc910b009f2e72a471dd917d
  adapter_sha256: ecd475ca0450067312a912d3d5800ccc94ce008d768fc7176e14adaaedf1a36d
  evals_file: evals.json
  evals_sha256: deb07f6a7855f28649575d2533176cb72658e553544052ff94e611c770184fc4
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

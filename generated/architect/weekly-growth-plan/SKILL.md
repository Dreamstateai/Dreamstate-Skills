---
id: weekly-growth-plan
name: Weekly Growth Plan
description: Prioritize a one-week cross-channel operating plan with owners, deliverables, measures, and explicit delegation without silently executing it.
triggers: ["plan my growth week","prioritize work across channels","create a weekly operating plan","decide what the team should do next"]
dependencies: []
capability_domains: []
capability_ids: ["brain.context.get","brain.context.search","social.strategy_overview","social.weekly_plan_items_list","visibility.overview","workflows.list"]
direct_run_capability_ids: []
max_context_tokens: 3500
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: b7d964bd23675868f77cdb5041b49e9eb98de5c70064ee53e07a048e5ec37cdd
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 779304f4256ec197
  manifest_digest: f75e69f81ba15118ace05828ddfd77f39864c9b312087243279a0ef894e64e01
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.4
  source_release_hash: b7d964bd23675868f77cdb5041b49e9eb98de5c70064ee53e07a048e5ec37cdd
  generator_version: 1.0.0
  kernel_id: weekly-growth-plan
  kernel_file: KERNEL.md
  kernel_sha256: 51416e62fc46f2ee38525c4eab35e55fe4ad3fd6b138caa842da30c3100c83c3
  adapter_sha256: a7c18277f6dcbb42eb3ca03f5471699e8d52aee4ce0e2dbb3bc1f8846a58c2b1
  evals_file: evals.json
  evals_sha256: 1a7ab87f6b25b1448c08ca5a2bfe26aa29b9320aac910712131ad059a54df0da
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, and cost bounds into the next step. `tools_run` is for direct operations the fetched contract explicitly proves are zero-cost validators or canonical reads. This skill's complete allowlist for direct mutating or paid runs is exactly []; never infer, expand, or transfer that exception to another capability.

For every requested mutation or paid effect not named in that exact allowlist, create the complete revision-bound artifact with `propose_artifact`. Present that exact proposal for human review and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. Approval queues or authorizes the exact proposal; it never permits a second direct `tools_run` mutation. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

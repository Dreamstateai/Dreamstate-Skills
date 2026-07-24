---
id: weekly-growth-plan
name: Weekly Growth Plan
description: Prioritize a one-week cross-channel operating plan with owners, deliverables, measures, and explicit delegation without silently executing it.
triggers: ["plan my growth week","prioritize work across channels","create a weekly operating plan","decide what the team should do next"]
dependencies: []
capability_domains: []
capability_ids: ["brain.context.get","brain.context.search","campaigns.list","social.strategy_overview","social.weekly_plan_items_list","visibility.overview"]
max_context_tokens: 3500
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 032a861caa0a439b4560be2b3d8af54818cb3cc7560d72718cbf864f371100d1
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: f545d33b0e147d4e
  manifest_digest: 897c121cd546d3212a7fed051f8198cfe4631eef1ab82ef4fbd2aec96321353b
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.1
  source_release_hash: 032a861caa0a439b4560be2b3d8af54818cb3cc7560d72718cbf864f371100d1
  generator_version: 1.0.0
  kernel_id: weekly-growth-plan
  kernel_file: KERNEL.md
  kernel_sha256: 071bf4e4cf03ef08d6466ecb02de7e34ce5851d9140efd3b66c972ccf03866aa
  adapter_sha256: ecd475ca0450067312a912d3d5800ccc94ce008d768fc7176e14adaaedf1a36d
  evals_file: evals.json
  evals_sha256: 853796159a961cb88732c13861539bdee696446f047e8c2c5d8c58a34db12c53
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

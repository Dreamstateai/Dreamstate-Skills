---
id: context
name: Context
description: Read targeted revisioned Company Brain facts or propose cited conflict-aware updates and new governed documents without treating prompt text as canonical state.
triggers: ["read Company Brain context","inspect published workspace memory","propose a cited context update","update a governed Company Brain document such as Ideal Customer","resolve a canonical fact","propose a new governed Company document","keep a knowledge document unpublished for human review"]
dependencies: []
capability_domains: ["brain","context"]
capability_ids: ["brain.context.browse","brain.context.document_get","brain.context.draft_save","brain.context.get","brain.context.graph","brain.context.history","brain.context.list_proposals","brain.context.preview_agent_view","brain.context.propose","brain.context.propose_document","brain.context.publish_preview","brain.context.register_source","brain.context.resolve_conflict","brain.context.save_draft","brain.context.search","brain.context.source_impact","brain.context.workspace_get","brain.evidence.search","brain.graph.neighborhood","brand.context_url_analyze"]
direct_run_capability_ids: ["brand.context_url_analyze"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: b6e9362bf41e1fd802974e801d5c88923ee5999e99113876ddbc5faba2440760
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 0f792191fabb37cf
  manifest_digest: ab47e1dafaa5b0db4a00788025060197b9ddd29bc42bf376ea0313842c31e933
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.6
  source_release_hash: b6e9362bf41e1fd802974e801d5c88923ee5999e99113876ddbc5faba2440760
  generator_version: 1.0.0
  kernel_id: context
  kernel_file: KERNEL.md
  kernel_sha256: 99a6903bd669e8851d8d9338880c54f40f8d5944e1a4594b9952af2c008885a2
  adapter_sha256: c9dfb6330b029054579fbcea33870f2349f6e3daa4d6c5afdb385ff6cafbf8de
  evals_file: evals.json
  evals_sha256: 30a9edce28e408d7011bf434ed23d4e014f24f0e346c3cb06b66d68b6ec91dff
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, and cost bounds into the next step. `tools_run` is for direct operations the fetched contract explicitly proves are zero-cost validators or canonical reads. This skill's complete allowlist for direct mutating or paid runs is exactly ["brand.context_url_analyze"]; never infer, expand, or transfer that exception to another capability.

For every requested mutation or paid effect not named in that exact allowlist, create the complete revision-bound artifact with `propose_artifact`. Present that exact proposal for human review and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. Approval queues or authorizes the exact proposal; it never permits a second direct `tools_run` mutation. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

---
id: context
name: Context
description: Read targeted revisioned Company Brain facts or propose cited conflict-aware updates and new governed documents without treating prompt text as canonical state.
triggers: ["read Company Brain context","inspect published workspace memory","propose a cited context update","update a governed Company Brain document such as Ideal Customer","resolve a canonical fact","propose a new governed Company document","keep a knowledge document unpublished for human review"]
dependencies: []
capability_domains: ["brain","context"]
capability_ids: ["brain.context.get","brain.context.propose_document","brain.context.search","brand.context_url_analyze"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 4d76c6a8316763c8993a0026479630b90aa9f169f1a56425bfa837c418c709fd
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 01002d9587befbf3
  manifest_digest: f91ed1b74ebe129ef522f45fdcaec299626b3b5f1d0209e2d0a44bf4684f9ab0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.3
  source_release_hash: 4d76c6a8316763c8993a0026479630b90aa9f169f1a56425bfa837c418c709fd
  generator_version: 1.0.0
  kernel_id: context
  kernel_file: KERNEL.md
  kernel_sha256: c40f96ca61425677481d80ceeb65e52dd60c292dfa633d3b5d573bcfbc2e27b8
  adapter_sha256: fff181fcc4c16a1050a9ebce768287d7eab35c4157feff448beab729d10a1fe9
  evals_file: evals.json
  evals_sha256: 742b266e11e6dea771538e6678e3cc669242e410e02dce42a4b0a14693a12082
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, and cost bounds into the next step. `tools_run` is only for direct operations the fetched contract explicitly proves are zero-cost validators or canonical reads, plus the writes this kernel names as directly runnable. Never use `tools_run` for any other mutating or paid work.

For every other requested mutation or paid effect, create the complete revision-bound artifact with `propose_artifact`. Present that exact proposal for human review and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. Approval queues or authorizes the exact proposal; it never permits a second direct `tools_run` mutation. Report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

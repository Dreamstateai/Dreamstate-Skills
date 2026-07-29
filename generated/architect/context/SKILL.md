---
id: context
name: Context
description: Read targeted revisioned workspace-wiki claims or propose cited conflict-aware updates and new ordinary files without treating prompt text as canonical state.
triggers: ["read the canonical workspace wiki","inspect published workspace knowledge","propose a cited wiki update","revise an existing ordinary wiki document","trace a cited claim or source","propose a new ordinary wiki file","keep a wiki proposal unpublished for human review"]
dependencies: []
capability_domains: ["brain","context"]
capability_ids: ["brain.context.browse","brain.context.create_document","brain.context.create_folder","brain.context.get","brain.context.graph","brain.context.history","brain.context.list_proposals","brain.context.preview_agent_view","brain.context.propose","brain.context.propose_document","brain.context.save_and_publish","brain.context.save_draft","brain.context.search","brain.evidence.search","brain.graph.neighborhood"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 4dd448bd33df184d0cc25e8ccca7caae27fbb42330778777ff0052934064b540
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 3308959ee5a8c299
  manifest_digest: caf0df71ed39b2908438094693b00278a571035efd2082af0ab34953c559fcce
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 4dd448bd33df184d0cc25e8ccca7caae27fbb42330778777ff0052934064b540
  generator_version: 1.0.0
  kernel_id: context
  kernel_file: KERNEL.md
  kernel_sha256: ff8ecb5d852c4494f804e7237cb1ade7a1d2b6d5e6bd7839182a4992b3ea56cb
  adapter_sha256: a5579217dbd98da18091390b8f44f31923796e5ad8f8f8112ae70cc4e7dce51a
  evals_file: evals.json
  evals_sha256: 00f30eaebedf1866ab93e3b1fc60753071195d544ebb97732073d3afa978a0ee
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, cost bounds, and the server's ActionDecision into the next step. Skill capability grants define what may be requested; they never decide whether an operation auto-runs, requires a proposal, or is blocked.

Follow the fetched contract and ActionDecision mechanically. When it requires a proposal, create the complete revision-bound artifact with `propose_artifact`, present that exact proposal for human review, and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. When it permits an auto-run, call `tools_run` with the exact bound inputs. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 15 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 6 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

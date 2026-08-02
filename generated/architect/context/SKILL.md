---
id: context
name: Context
description: Read targeted revisioned workspace-wiki claims or propose cited conflict-aware updates and new ordinary files without treating prompt text as canonical state.
triggers: ["read the canonical workspace wiki","inspect published workspace knowledge","propose a cited wiki update","revise an existing ordinary wiki document","trace a cited claim or source","propose a new ordinary wiki file","keep a wiki proposal unpublished for human review"]
dependencies: []
capability_domains: ["brain","context"]
capability_ids: ["brain.context.archive_document","brain.context.backlinks","brain.context.browse","brain.context.delete_document","brain.context.get","brain.context.graph","brain.context.history","brain.context.list_proposals","brain.context.move_document","brain.context.preview_agent_view","brain.context.propose","brain.context.propose_document","brain.context.rebuild_links","brain.context.register_source","brain.context.rename_document","brain.context.restore_document","brain.context.search","brain.context.website_source_register","brain.evidence.search","brain.graph.neighborhood","brain.knowledge.digest","brain.knowledge.doc_map","brain.knowledge.document","brain.knowledge.index"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 50220083886d52d07c754bfa43b61c4613271a9bfb3833070e9d4f28cd726a5f
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: f95b1fde0b931763
  manifest_digest: 36e1541ce5c465d328d53e25fceaa9a75aee8d932ef7ef4c7ddf6451fa9fd469
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 50220083886d52d07c754bfa43b61c4613271a9bfb3833070e9d4f28cd726a5f
  generator_version: 1.0.0
  kernel_id: context
  kernel_file: KERNEL.md
  kernel_sha256: 926d48f5a57ddf2c0ca701bd185a30a566ebe9c19c550609c74f924401a8eb84
  adapter_sha256: 53d43e96bbc93e3316608d3de9a9e9511eb272de4de03b54745c7582b8cb3ebf
  evals_file: evals.json
  evals_sha256: 1649427b0271d3b094b840275ab13a43bbc84c3936d7247b6cd9fe59854cd049
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

- Cannot act outside this contract: exactly 24 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 10 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

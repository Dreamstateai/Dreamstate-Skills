---
id: growth-asset-planner
name: Growth Asset Planner
description: Design a buyer-facing reading resource (lead magnet, checklist, playbook, audit, SOP, resource hub) and its evidence, structure, CTA, distribution, and follow-up path, remaining explicitly unsaved until live persistence exists. Never owns workbooks, worksheets, tables, views, columns, or rows. Any durable dataset deliverable belongs to `tables`.
triggers: ["design a lead magnet","create a buyer checklist or playbook","plan an audit or SOP","design a resource hub"]
dependencies: []
capability_domains: []
capability_ids: ["brain.context.get","brain.context.search","brain.evidence.search","command_center.assets.create","command_center.assets.list"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 8a1a573ae59b25858dc9016ce14b93bbcdfa64464c97690a50a993851f81e555
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5d2f4b59d2b8b388
  manifest_digest: 3715f4b76628f6cc58ea7c51c3e556168ab6aaca571e5673995deb50a34b3891
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 8a1a573ae59b25858dc9016ce14b93bbcdfa64464c97690a50a993851f81e555
  generator_version: 1.0.0
  kernel_id: growth-asset-planner
  kernel_file: KERNEL.md
  kernel_sha256: 19927914886ae69503700e5a3ca86d2ba714225089fa443a0ea8f987da1e61b1
  adapter_sha256: 0ff4bf46670412c0fe55e1b73079dcd33baf0f0bf78c8159a39ba024dc3f4195
  evals_file: evals.json
  evals_sha256: 38a7f66a0a0f91570d51851a38522c200874e8d6eebf129c69e5ad4a0c6b813f
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

- Cannot act outside this contract: exactly 5 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 1 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

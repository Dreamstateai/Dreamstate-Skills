---
id: audiences
name: Audiences
description: Research, preview, create, update, and archive canonical audience views with exact sources, filters, exclusions, revisions, and nullable behavior.
triggers: ["list or inspect audiences","build an audience","preview targeting","update or archive an audience"]
dependencies: []
capability_domains: ["audiences"]
capability_ids: ["audiences.archive","audiences.create","audiences.get","audiences.list","audiences.persona_suggestions","audiences.preview","audiences.sources_list","audiences.update"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 57387a14a9e71e3e132d6c4e26ae21996676d9399ecbfd3d29999f7930051967
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: d52d36727a64c369
  manifest_digest: 6b789ba4054c879ab448629cc119422420e79546f69d024e90e967f28aa774d3
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 57387a14a9e71e3e132d6c4e26ae21996676d9399ecbfd3d29999f7930051967
  generator_version: 1.0.0
  kernel_id: audiences
  kernel_file: KERNEL.md
  kernel_sha256: a336f54a5bafdb09b5fd94e6fa1405caf34c68b6b272b1233049bbfc7bf076e3
  adapter_sha256: b2c7c72b96435fe69cb2cb23d9fe30eb056e956586717db01f5a385ad0fa0379
  evals_file: evals.json
  evals_sha256: b11137ee968ef29571eb8cf93166e282855d5d6d088131b99403d9f702da1ec3
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

- Cannot act outside this contract: exactly 8 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 3 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

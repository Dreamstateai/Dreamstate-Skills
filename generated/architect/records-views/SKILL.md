---
id: records-views
name: Records Views
description: Create, inspect, revise, execute, and delete canonical saved record views with exact filters, projections, runtime revisions, and results.
triggers: ["list saved record views","create or update a saved view","run a saved view","delete a saved view"]
dependencies: []
capability_domains: ["records"]
capability_ids: ["saved_views.create","saved_views.delete","saved_views.list","saved_views.results","saved_views.update","saved_views.v2_create","saved_views.v2_execute","saved_views.v2_list","saved_views.v2_runtime_upsert"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"view_artifact_state","description":"Durable saved-view artifact state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"view_result_state","description":"Result evidence and pagination status.","allowed_values":["verified","partial","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 7926f72ccd4085ca4e2d6d99c042cd0ff8d0a8748879db0142edd7fb28ec1366
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5da7519babac68b4
  manifest_digest: 87e78f7c73f392e7bd5c6c311620b0be23dbff118c31df9e61e5473f59bb6f25
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 7926f72ccd4085ca4e2d6d99c042cd0ff8d0a8748879db0142edd7fb28ec1366
  generator_version: 1.0.0
  kernel_id: records-views
  kernel_file: KERNEL.md
  kernel_sha256: e9b5e5a12b07fbf14958d07bcac5922fdfe80394ce6554f21d24b68d99cb938c
  adapter_sha256: 7ac3dd85afb930fbedc10f17c387c8369f6a4d12a41607a2798500dd2360a5c2
  evals_file: evals.json
  evals_sha256: 740adfed215c66876c23d6c844e1667bcfdebaa3a3a266a5284277cf097d75f3
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

- Cannot act outside this contract: exactly 9 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 5 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

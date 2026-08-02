---
id: notifications
name: Notifications
description: Read and manage notifications, unread state, archives, and personal or workspace notification preferences through canonical scoped operations.
triggers: ["show notifications","mark notifications read","archive a notification","change notification preferences"]
dependencies: []
capability_domains: ["notifications"]
capability_ids: ["notifications.archive","notifications.get","notifications.list","notifications.mark_all_read","notifications.mark_read","notifications.preferences_get","notifications.preferences_update","notifications.type_preferences_get","notifications.type_preferences_reset","notifications.type_preferences_update","notifications.unread_counts_get","notifications.workspace_type_preferences_get","notifications.workspace_type_preferences_reset","notifications.workspace_type_preferences_update"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]}]}
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
  kernel_id: notifications
  kernel_file: KERNEL.md
  kernel_sha256: e2fa6674ab5910453dfe39e1ac8884ec1ba5ab25770339dd70f3b26231226d0e
  adapter_sha256: 27c199122eb2b8dcd5c1693a87d466401335652adf408d50842e97280e178298
  evals_file: evals.json
  evals_sha256: fc2eb2db468854cd23562cfb391ee69ff45d2712cd6c6f7622fe6dec2e9914ee
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

- Cannot act outside this contract: exactly 14 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 8 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

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
  playbook_kernel_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 7a964687b781fd3d
  manifest_digest: 734ba3f90ea986bec4c4286c00492d1dff57fc23b69d7ce710db1a08b9dd0ba1
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  generator_version: 1.0.0
  kernel_id: notifications
  kernel_file: KERNEL.md
  kernel_sha256: e2fa6674ab5910453dfe39e1ac8884ec1ba5ab25770339dd70f3b26231226d0e
  adapter_sha256: 76d4bd944ccf1eed9a8450d1f53aef53382cd6d579d575dfc9a25b8133e5432d
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

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`: name every capability id this turn is likely to need as `query_terms` in one call, drawn from this skill's own capability_ids, instead of one narrower search per goal. `tools_get` refuses an id this turn never searched, so a capability id must appear in some earlier `tools_search` result before it can be fetched, even one already named by this skill's grant. The three-search discovery budget exists for genuinely unknown needs, not for fetching one already-named id at a time; spend it in as few calls as the turn's real uncertainty requires. Fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, cost bounds, and the server's ActionDecision into the next step. Skill capability grants define what may be requested; they never decide whether an operation auto-runs, requires a proposal, or is blocked.

Follow the fetched contract and ActionDecision mechanically. When it requires a proposal, create the complete revision-bound artifact with `propose_artifact`, present that exact proposal for human review, and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. When it permits an auto-run, call `tools_run` with the exact bound inputs. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 14 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 8 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

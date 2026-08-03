---
id: records-schema
name: records-schema
description: "Inspect and govern canonical record objects, attributes, relationships, layouts, permissions, notification policy, ordering, and schema impact."
capability_domains: ["records"]
capability_ids: ["record_attributes.create","record_attributes.list","record_definitions.impact_get","record_objects.attribute_create","record_objects.attribute_update","record_objects.attributes_list","record_objects.attributes_reorder","record_objects.create","record_objects.layout_get","record_objects.layout_update","record_objects.list","record_objects.notification_prefs_get","record_objects.notification_prefs_update","record_objects.permission_get","record_objects.permission_update","record_objects.record_create","record_objects.reorder","record_objects.update","record_relationships.create","record_relationships.list","record_relationships.reorder","record_relationships.update"]
completion_contract: {"version":1,"fields":[{"id":"schema_definition_state","description":"Canonical object schema and revision state.","allowed_values":["complete","partial","missing","not_applicable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 7ddbefcb362b98acfa7695932760ba51f14b05d5fe507275109a7aac0d7e4dd1
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 787f9735a083219d
  manifest_digest: 0c565b0647afe3048c54264ad1abe6b96a8722b9db67c47f749c8190d67be292
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 7ddbefcb362b98acfa7695932760ba51f14b05d5fe507275109a7aac0d7e4dd1
  generator_version: 1.0.0
  client: claude
  kernel_id: records-schema
  kernel_file: KERNEL.md
  kernel_sha256: 38d6f45af8c091ac7fddeba8c4a2f765c089f634622a48f1477d48a0b2ff82c1
  adapter_sha256: 074963f7d623af18677535a115ed208d610e1a7dc98e68f0e697de3a1741d0ee
  evals_file: evals.json
  evals_sha256: 57609921075322b6c1e83904abe94cd23445d633222cccd4a7e1dbe96573694e
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes `dreamstate_context_create_document`, `dreamstate_context_create_folder`, `dreamstate_context_save_and_publish`, and `dreamstate_context_save_draft` under the same mismatch. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 22 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 14 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Records schema
<!-- architect-operation-contract
{"required_capability_ids":["record_attributes.create","record_attributes.list","record_definitions.impact_get","record_objects.attribute_create","record_objects.attribute_update","record_objects.attributes_list","record_objects.attributes_reorder","record_objects.create","record_objects.layout_get","record_objects.layout_update","record_objects.list","record_objects.notification_prefs_get","record_objects.notification_prefs_update","record_objects.permission_get","record_objects.permission_update","record_objects.record_create","record_objects.reorder","record_objects.update","record_relationships.create","record_relationships.list","record_relationships.reorder","record_relationships.update"]}
-->

Inspect canonical object definitions, attributes, relationships, layouts, notification policy, permissions, and impact before changing schema. Use stable IDs and current revisions, not labels, as authority.

Propose the smallest schema delta. Never silently create a near-duplicate object, field, or relationship. Show affected records and downstream behavior before lifecycle, ordering, layout, or permission changes. Permission and notification-policy writes require exact scope, current state, and server confirmation. Create a record only after its object schema is durable and re-read.

Return definition and revision IDs, impact, committed or proposed changes, verification readback, and any blocked dependency.

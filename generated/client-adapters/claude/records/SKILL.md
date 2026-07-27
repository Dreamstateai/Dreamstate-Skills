---
id: records
name: records
description: "Inspect and safely maintain canonical people, companies, deals, custom objects, attributes, relationships, layouts, notes, files, lists, imports, messages, and record notification preferences."
capability_domains: ["records"]
capability_ids: ["notifications.preferences_get","notifications.preferences_update","record_attributes.create","record_attributes.list","record_deals.board_get","record_deals.create","record_deals.stage_move","record_deals.update","record_files.list","record_files.upload","record_imports.create","record_imports.errors_list","record_imports.get","record_objects.attribute_create","record_objects.attribute_update","record_objects.attributes_list","record_objects.create","record_objects.layout_get","record_objects.layout_update","record_objects.list","record_objects.permission_get","record_objects.record_create","record_objects.update","record_relationships.create","record_relationships.list","records.companies_list","records.create","records.field_set","records.get","records.list","records.list_add","records.list_remove","records.lists_get","records.message_channels_get","records.message_send","records.note_add","records.people_list","records.references_resolve","records.search","records.source_lookup","records.value_retire"]
direct_run_capability_ids: []
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"record_state","description":"Canonical record identity and revision state.","allowed_values":["exact_current","exact_historical","partial","missing","not_applicable"]},{"id":"object_schema_state","description":"Object, attribute, relationship, layout, and permission schema state.","allowed_values":["complete","partial","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 3010420c5a656d51ad106f397d974fe48a9e9232b451bd99fe4e4f682df2c6a2
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 0f792191fabb37cf
  manifest_digest: ab47e1dafaa5b0db4a00788025060197b9ddd29bc42bf376ea0313842c31e933
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.6
  source_release_hash: 3010420c5a656d51ad106f397d974fe48a9e9232b451bd99fe4e4f682df2c6a2
  generator_version: 1.0.0
  client: claude
  kernel_id: records
  kernel_file: KERNEL.md
  kernel_sha256: 0eda1e3c8a012752d4757baf601f7f604ca85943fedfc3bab3117c35bf977a99
  adapter_sha256: ed1251105b794ec02978e1d6a1edca907f53a555b2f182503242493e014c5f4c
  evals_file: evals.json
  evals_sha256: a86928fbaf83663deafb61b95aa0e24abcf4348a9eaf124ea97d0e2ef7a69230
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. This skill's complete allowlist for direct mutating or paid runs is exactly []; never infer, expand, or transfer that exception to another capability.

For any requested mutation or paid effect not named in that exact allowlist, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Canonical Records
<!-- architect-operation-contract
{"required_capability_ids":["notifications.preferences_get","notifications.preferences_update","record_attributes.create","record_attributes.list","record_deals.board_get","record_deals.create","record_deals.stage_move","record_deals.update","record_files.list","record_files.upload","record_imports.create","record_imports.errors_list","record_imports.get","record_objects.attribute_create","record_objects.attribute_update","record_objects.attributes_list","record_objects.create","record_objects.layout_get","record_objects.layout_update","record_objects.list","record_objects.permission_get","record_objects.record_create","record_objects.update","record_relationships.create","record_relationships.list","records.companies_list","records.create","records.field_set","records.get","records.list","records.list_add","records.list_remove","records.lists_get","records.message_channels_get","records.message_send","records.note_add","records.people_list","records.references_resolve","records.search","records.source_lookup","records.value_retire"]}
-->

Use canonical Records as the durable CRM truth for people, companies, deals, and custom objects. Never infer a record, field, relationship, permission, revision, or provider state from chat text or a display label.

## Inspect

1. Discover the exact live capability contract before supplying an enum or schema.
2. Resolve the object definition and attributes before interpreting values. Use canonical IDs, not names, as authority.
3. Search or list with the narrowest object, saved-list, field, and pagination constraints.
4. Open the exact record and preserve object ID, record ID, active value IDs, revisions, relationships, sources, conflicts, availability, timestamps, and deep links.
5. For deals, inspect the canonical board and stage identity. For custom objects, inspect their definition, attributes, layout, and permissions first.
6. Distinguish absent, unavailable, restricted, stale, conflicting, and genuinely empty values. Never turn one of these into another.

## Mutate

Propose the smallest change against the exact current record or definition revision. Re-read before approval and again before execution. Create or update only fields declared by the live object schema, preserve stable external identities, and reject stale revisions or ambiguous references.

Treat object definitions, attributes, layouts, permissions, relationships, pipelines, and stages as schema authority. Show downstream impact before changing them. Never silently create a near-duplicate field or object because a requested label was not found.

Use merge, erase, permission changes, message sends, imports, and provider writes only through their separately discovered live capabilities and approval requirements. Do not simulate these effects with notes or field writes. A message is complete only with a terminal provider receipt linked to the exact record and sender account.

For imports, retain upload identity, mapping revision, row result, errors, source identity, and final record IDs. For files and notes, retain the exact record binding and durable artifact identity. For saved lists, add or remove only exact record IDs and verify membership readback.

Notification preferences are workspace/member policy, not record content. Read current preferences before proposing a change, preserve unrelated types, and report whether delivery is enabled, suppressed, or unavailable.

## Return

Return the exact object and record identities, relevant attributes and relationships, source/provenance, revision state, conflicts or restrictions, applied or proposed changes, provider/run receipts, and deep links. State precisely whether the result is read-only, proposed, committed, queued, partial, or blocked.

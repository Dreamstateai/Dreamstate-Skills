---
id: records
name: Records
description: Inspect and safely maintain canonical people, companies, deals, custom objects, attributes, relationships, layouts, notes, files, lists, imports, messages, and record notification preferences.
triggers: ["find or inspect a person, company, deal, or custom record","show all record attributes and relationships","update CRM records or object settings","import, organize, message, or attach files to records"]
dependencies: []
capability_domains: ["records"]
capability_ids: ["notifications.preferences_get","notifications.preferences_update","record_attributes.create","record_attributes.list","record_deals.board_get","record_deals.create","record_deals.stage_move","record_deals.update","record_files.list","record_files.upload","record_imports.create","record_imports.errors_list","record_imports.get","record_objects.attribute_create","record_objects.attribute_update","record_objects.attributes_list","record_objects.create","record_objects.layout_get","record_objects.layout_update","record_objects.list","record_objects.permission_get","record_objects.record_create","record_objects.update","record_relationships.create","record_relationships.list","records.companies_list","records.create","records.field_set","records.get","records.list","records.list_add","records.list_remove","records.lists_get","records.message_channels_get","records.message_send","records.note_add","records.people_list","records.references_resolve","records.search","records.source_lookup","records.value_retire"]
direct_run_capability_ids: []
max_context_tokens: 5000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"record_state","description":"Canonical record identity and revision state.","allowed_values":["exact_current","exact_historical","partial","missing","not_applicable"]},{"id":"object_schema_state","description":"Object, attribute, relationship, layout, and permission schema state.","allowed_values":["complete","partial","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: d45d7adbe98702528c96e9362e40bc633b3ed4fc4819ef668d4ac2206b22b193
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 0f792191fabb37cf
  manifest_digest: ab47e1dafaa5b0db4a00788025060197b9ddd29bc42bf376ea0313842c31e933
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.6
  source_release_hash: d45d7adbe98702528c96e9362e40bc633b3ed4fc4819ef668d4ac2206b22b193
  generator_version: 1.0.0
  kernel_id: records
  kernel_file: KERNEL.md
  kernel_sha256: 0eda1e3c8a012752d4757baf601f7f604ca85943fedfc3bab3117c35bf977a99
  adapter_sha256: a7c18277f6dcbb42eb3ca03f5471699e8d52aee4ce0e2dbb3bc1f8846a58c2b1
  evals_file: evals.json
  evals_sha256: c8c72b5d44328c349523647a018ec93f8a47490ba3ae0a5e8d4a6e9f77caa188
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, and cost bounds into the next step. `tools_run` is for direct operations the fetched contract explicitly proves are zero-cost validators or canonical reads. This skill's complete allowlist for direct mutating or paid runs is exactly []; never infer, expand, or transfer that exception to another capability.

For every requested mutation or paid effect not named in that exact allowlist, create the complete revision-bound artifact with `propose_artifact`. Present that exact proposal for human review and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. Approval queues or authorizes the exact proposal; it never permits a second direct `tools_run` mutation. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

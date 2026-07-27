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

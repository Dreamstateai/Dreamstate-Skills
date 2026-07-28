# Records schema
<!-- architect-operation-contract
{"required_capability_ids":["record_attributes.create","record_attributes.list","record_definitions.impact_get","record_objects.attribute_create","record_objects.attribute_update","record_objects.attributes_list","record_objects.attributes_reorder","record_objects.create","record_objects.layout_get","record_objects.layout_update","record_objects.list","record_objects.notification_prefs_get","record_objects.notification_prefs_update","record_objects.permission_get","record_objects.permission_update","record_objects.record_create","record_objects.reorder","record_objects.update","record_relationships.create","record_relationships.list","record_relationships.reorder","record_relationships.update"]}
-->

Inspect canonical object definitions, attributes, relationships, layouts, notification policy, permissions, and impact before changing schema. Use stable IDs and current revisions, not labels, as authority.

Propose the smallest schema delta. Never silently create a near-duplicate object, field, or relationship. Show affected records and downstream behavior before lifecycle, ordering, layout, or permission changes. Permission and notification-policy writes require exact scope, current state, and server confirmation. Create a record only after its object schema is durable and re-read.

Return definition and revision IDs, impact, committed or proposed changes, verification readback, and any blocked dependency.

# Objects and attributes

Object and attribute definitions are schema, not data: they describe what a `person`, `company`, `deal`, or custom record looks like. Changing schema affects every existing record of that object, so read the current definition and its impact before writing.

## Inspect before changing

- `record_objects.list`: `{}`, every object definition in the workspace.
- `record_objects.attributes_list`: `{object_key}`, the fields on one object.
- `record_attributes.list`: `{object_key}`, a second (older, lighter) attribute listing kept for compatibility; prefer `record_objects.attributes_list` for a full field set, and only use `record_attributes.*` when a caller specifically needs the simpler shape.
- `record_objects.layout_get`: `{object_definition_id}`, the current record-page layout.
- `record_relationships.list`: `{}`, every relationship between objects.
- `record_objects.permission_get` / `record_objects.notification_prefs_get`: `{object_definition_id}`, current access roles and notification policy.
- `record_definitions.impact_get`: `{kind: 'object'|'attribute'|'relationship', definition_id}`. Returns the dependency list (records, views, automations) affected by a change, and a revision token you need before an archive-class write on that definition. Always call this before proposing to archive or materially change an object, attribute, or relationship, and show the dependency count to the user.

## Create an object and its fields

`record_objects.create`: `{object_key, label, label_plural, icon?}`. `object_key` must match `/^[a-z][a-z0-9_]{1,40}$/`. Check `record_objects.list` first: never create a near-duplicate object for something that already exists under a different label (the noun the user says is not authority; the existing `object_key` is).

Two attribute-create capabilities exist and are not interchangeable:
- `record_objects.attribute_create`: the full-featured path. `{object_key, attr_key, label, attr_type, cardinality?, is_identity?, is_unique?, is_required?, is_computed?, is_enriched?, is_protected?, default_value?, computed_config?, enrichment_config?, options?, sort_order?}`.
- `record_attributes.create`: the lighter legacy path, `{object_key, label, attr_type, options?}` with its own narrower options shape. Prefer `record_objects.attribute_create` for anything beyond a plain select field.

`attr_type` is one of: `text, number, timestamp, email, domain, url, phone, select, status, currency, checkbox, user, record_reference, json`. `options` must match the type: `select`/`status` take `{options: [...]}` or `{stages: [...]}`; `record_reference` takes `{allowed_object_ids: [...]}`; `currency` takes `{currency: 'USD'}` (three-letter code); a `timestamp` date-only field takes `{semantic_type: 'date_only'}`; a `text` location field takes `{semantic_type: 'location'}`; a `number` rating field takes `{semantic_type: 'rating', max: 1-10}`. Sending a mismatched `options` shape for the `attr_type` is rejected; check the type before building the options object.

`record_objects.attribute_update`: `{attribute_id, label?, options?, default_value?, required?, protected?, lifecycle?, sort_order?, computed_config?, enrichment_config?, confirm_impact?, impact_revision?}`.

## Layout, ordering, permissions, notifications

- `record_objects.attributes_reorder`: `{object_definition_id, ids[]}`, field order on one object.
- `record_objects.reorder`: `{ids[]}`, the top-level object list order (no `object_definition_id`, this reorders objects themselves).
- `record_objects.layout_update`: `{layout}`, a whole-layout replacement, not a partial patch. Read the current layout with `layout_get` first and edit the full structure; sending a partial layout silently drops whatever you did not include.
- `record_objects.permission_update`: `{permission}`, roles `owner|admin|member`, also a full replacement of the permission object with no optimistic-lock field. Because there is no revision check here, re-read with `permission_get` immediately before writing to minimize the window for a lost concurrent change.
- `record_objects.notification_prefs_update`: `{object_definition_id, expected_revision, preferences: {in_app_events[], email_events[]}}`. Unlike permissions, this one requires `expected_revision` from the prior `notification_prefs_get`; a stale revision is rejected rather than silently overwritten.

## Relationships

`record_relationships.create`: `{relationship_key, label, inverse_label, from_object_ids[], to_object_ids[], cardinality, deletion_rule, allows_primary?, sort_order?}`. `cardinality` is one of `one_to_one|one_to_many|many_to_one|many_to_many`. `deletion_rule` is one of `restrict|cascade|detach`: `restrict` blocks deleting a record that still has this relationship, `cascade` deletes the related record too, `detach` just removes the link. Get this rule right the first time; changing it later changes what deleting a record on either side actually does. `record_relationships.update` and `record_relationships.reorder` follow the same pattern as objects (`update` takes the same `confirm_impact`/`impact_revision` archive gate as objects and attributes).

## The archive-confirmation gate is not one shape

Three different confirmation shapes exist across this family and they are not interchangeable:

1. `record_objects.update`, `record_objects.attribute_update`, `record_relationships.update`: archiving requires both `confirm_impact: true` and a matching `impact_revision` string, obtained from `record_definitions.impact_get`. Sending `confirm_impact: true` without a valid, current `impact_revision` fails closed.
2. Pipeline stage lifecycle uses a different mechanism entirely: see pipelines.md.
3. Some writes in this family (`record_objects.permission_update`, `record_objects.reorder`) have no confirmation field at all because they are not archive operations; do not invent one.

Never assume the field name from one capability applies to another in this family. Read the exact schema before writing an archive-class call.

## Records of a custom object

`record_objects.record_create` is the generic "create one record of any object" capability (`{object_key, display_name, values?}`), the same one `records.md` documents for non-system objects. Create the object and its required fields first, re-read the object definition to confirm it is durable, then create the sample or first record. Creating a record before the schema exists produces a record with no valid fields to hold data.

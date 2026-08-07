# Records

Canonical people, companies, deals, and custom-object records: the durable truth of the CRM. Every capability below keyed on `record_id` needs a real UUID from a prior read, never a synthesized one.

## Find the record before touching it

- `records.people_list` / `records.companies_list`: paged list for the two built-in objects (`limit`, `offset`, `q`).
- `records.list`: paged list for any object by `object_key` (`view: 'all' | 'recently_contacted'`).
- `records.search`: free-text `q` plus optional `object_key` or `object_ids`. Use this when the user names a person, company, or deal by a string, not an id.
- `records.source_lookup`: resolve a record from an origin outside the CRM: `{origin_kind: 'outreach_contact' | 'post' | 'company_name', origin_id}`. Use this when the trigger is an outreach contact or a post, not a CRM search.
- `records.references_resolve`: batch-resolve up to 100 ids to their current entities in one call, cheaper than 100 individual `records.get` calls when you already have a list of ids to display.

None of these substitute for `records.get` before a write: a search result can be stale by the time you act on it.

## Read the record

- `records.get`: `{record_id}`, current entity.
- `records.history_get`: `{record_id, limit (default 25), cursor}`. `cursor` is the exact `{revision_offset, timeline_offset, graph_offset}` object from the prior page's response, never hand-built.
- `records.buyer_brief_get`: `{record_id, include_public (default true), graph_depth (1-2, default 2)}`. A synthesized narrative citing record evidence, use as cited context, not as current field truth.
- `records.wiki_get`: `{record_id}`. Freeform notes/wiki content attached to the record.
- `records.playbook_get`: `{outcome_key?, limit}`. Historical plays tied to an outcome, evidence not instruction.
- `records.lists_get` / `records.memberships_get`: `{record_id}`. Which named CRM lists (`lists_get`) or which broader memberships (campaigns, workflows: `memberships_get`) a record belongs to.

Distinguish absent (field never set), unavailable (source could not be reached), restricted (permission), stale (old revision), conflicting (two sources disagree), and empty (set to nothing on purpose). Do not collapse these into a single "no data."

## Create

Two creation paths exist and use different capabilities, but both require a top-level `display_name`, not a name only nested in `values`:

- `records.create`: `{object_key: 'person'|'company'|'post', display_name, values?}` for the three system objects.
- `record_objects.record_create`: `{object_key, display_name, values?}` for any object, including custom ones. This is the generic record-create path and the one to prefer when the object is not guaranteed to be one of the three system types.

`display_name` example: `"Acme Corp"`. If a caller only received `values.name` or `values.full_name`, promote it to the top-level field yourself before writing; do not leave the name buried in `values` and call the create with an empty `display_name`.

Deal creation is separate: see pipelines.md for `record_deals.create`.

## Update one field at a time

`records.field_set`: `{record_id, attr_key, value}`. Sets exactly one field per call. Read the record first, confirm `attr_key` is the field the user meant (not a similarly-named one), and confirm the value type matches the attribute's `attr_type` (see objects-and-attributes.md for the type enum). Do not batch multiple field changes into one call by inventing a batched capability; make one `field_set` call per field.

`records.value_retire`: `{record_id, value_id}` retires one specific value row (not the whole record). Use this, not `erase`, when the user wants to remove a single stale field value while keeping the record.

## List membership

`records.list_add` / `records.list_remove`: `{record_id, table_id}`. `table_id` is the CRM list id, never a list name. Read `records.lists_get` first so the exact `table_id` is confirmed, then apply add/remove, then verify with another `lists_get` or `get` readback. When the user says "make the audience match exactly this set," compute the add and remove sets from the current membership and the target set; do not just add the requested records and leave stragglers in place.

## Notes and files

`records.note_add`: `{record_id, body_md}`, markdown body, non-empty. `record_files.upload`: `{record_id, file_name, base64, mime?, sha256}` (max ~10MB decoded, sha256 required and must match the content, `/^[a-f0-9]{64}$/`). `record_files.list`: `{record_id}`. Verify a note or file landed by a durable readback (`note_add`/`upload` return a receipt; confirm it, don't assume success from a 200).

## Merge, unmerge, erase: high-risk

`records.merge`: `{winner_record_id, loser_record_id}`. The winner survives, the loser collapses into it. Always preview first: read both records with `records.get`, show the user exactly what each record contains and what will be combined, and require explicit confirmation before calling `records.merge`. Unmerge is not guaranteed to fully restore the pre-merge state, so treat merge as a one-way door in practice even though `records.unmerge` exists.

`records.unmerge`: `{snapshot_id}`, the merge snapshot to reverse. There is no way to invent a `snapshot_id`; it comes from the merge's own receipt or from a prior read that surfaced it.

`records.erase`: `{record_id, confirmation: 'ERASE_RECORD'}`. Permanent, exists for privacy requests (right-to-be-forgotten style deletes). The confirmation is a literal string, not a boolean; nothing short of that exact literal executes it. Never run erase from an ambiguous reference (a name that could match more than one record) and never simulate an erase with a note or field clear.

## Messaging

`records.message_channels_get`: `{record_id}` lists available send channels for the record. `records.message_send`: `{record_id, channel: 'email'|'linkedin', sender_id, body, subject?, to?}`. Treat a message send with the same weight as merge/erase: confirm the exact record, the exact channel, and the exact body before sending, and never call it from an ambiguous reference. A message is only complete when the response carries a terminal provider receipt tied to the exact record and sender; a queued or pending result is not a sent message, and a note or field write is never a substitute for an actual send.

## Return shape discipline

Report exact record identities (never a display label standing in for an id), the fields actually returned by the capability that ran, revision/conflict state, and whether the turn's result is read-only, previewed, committed, or partial. Never assert a field exists or a write landed without the capability response backing it.

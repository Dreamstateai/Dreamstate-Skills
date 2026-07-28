# Canonical Records
<!-- architect-operation-contract
{"required_capability_ids":["record_files.list","record_files.upload","records.buyer_brief_get","records.companies_list","records.create","records.erase","records.field_set","records.get","records.history_get","records.list","records.list_add","records.list_remove","records.lists_get","records.merge","records.message_channels_get","records.message_send","records.note_add","records.people_list","records.playbook_get","records.references_resolve","records.search","records.source_lookup","records.unmerge","records.value_retire","records.wiki_get"]}
-->

Use canonical Records as the durable truth for people, companies, deals, and standard records. Never infer an identity, field, relationship, source, revision, or provider result from chat text or a display label.

## Read before acting

Search narrowly, resolve references, then open the exact record. Preserve record IDs, revisions, active value IDs, sources, conflicts, availability, timestamps, relationships, and deep links. Distinguish absent, unavailable, restricted, stale, conflicting, and empty values. Use buyer briefs, playbooks, and wiki context as cited evidence, never as a substitute for current record truth.

## Mutations

Re-read before execution and write only the exact requested fields against current revisions. Preserve history and provenance. Verify list membership, notes, and files by durable readback.

Merge, unmerge, erase, and message send are high-risk. Never execute them from an ambiguous reference or inferred consent. Show exact affected records, irreversible or provider consequences, and require the server's explicit confirmation/approval contract. A message is complete only with a terminal provider receipt linked to the exact record and sender. Never simulate a message, merge, or deletion using a note or field write.

## Return

Return exact identities, relevant attributes, sources, revision state, conflicts or restrictions, durable receipts, and deep links. State whether the result is read-only, proposed, committed, queued, partial, or blocked.

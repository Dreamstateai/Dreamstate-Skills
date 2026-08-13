# Sourcing and enrichment
<!-- architect-operation-contract
{"required_capability_ids":["browser.linkedin.network_engagers_list","cells.inspect","cells.read_page","cells.settle","columns.add","columns.archive","columns.list","columns.run","columns.run_all","columns.update","contacts.archive","contacts.bulk_upsert","contacts.draft_opener","contacts.enrich","contacts.find_email","contacts.find_phone","contacts.get","contacts.list","contacts.lookup_by_email","contacts.update","contacts.upsert","executable_definitions.list_resolved","executables.run","executables.save","linkedin.search_parameters_list","outreach.enrichment_sequence_get","radar.signal_suggestions_get","record_enrichment.create","record_enrichment.get","signal_sources.capture_key_set","signal_sources.create","signal_sources.delete","signal_sources.events_list","signal_sources.get","signal_sources.list","signal_sources.test_event","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.list","table_runs.cancel","table_runs.failure_report","table_runs.get","table_runs.list","table_runs.preview_cost","table_runs.reconcile_column","table_runs.resume","table_runs.retry","table_sources.attach","table_sources.detach","table_sources.list","table_sources.preview_sync","table_sources.reset_frontier","table_sources.restore_frontier","table_sources.run","table_sources.update","usage.action_costs_get","usage.limits_get","usage.status_get"]}
-->

Own worksheet intake and evidence. Done means provenance, safe enrichment, bounded sample, and cost receipt. `qualification` decides fit.

## Procedure

1. Inspect schema and catalogs; avoid duplicates.
2. Start with the scarcest signal.
3. Preview 2-3 variants capped at 10. Compare identity, provenance, freshness, completeness, cost, and precision. See source-testing.md.
4. Attach the reviewed winner. Preserve parameters and receipt; bound first expansion.
5. Search `executable_definitions.list_resolved` by outputs and inputs first. Add columns in dependency order. See enrichment-columns.md.
6. Price with `table_runs.preview_cost`. Run 5-10 stable rows under a credit ceiling, settle, then inspect yield.
7. Audit low yield and failures; never replay completed rows. See runs-and-economics.md.
8. Create an exact record/attribute job and poll until terminal. See enrichment-columns.md.

## Source evidence

Preserve row identity, source id, source record/event key, provider id, raw evidence, parameters/revision, fetched-at time, and cost. Duplicates do not count. Never synthesize.

`null` means unknown, never negative or borrowed. Review conflicts.

## Boundaries

Preview never creates, lands, adds, or spends. Attach is not run; enrichment is not qualification. Producer sources land only on events.

Use signal-sources.md for producer-owned sources. Never expose capture keys in prose.

## Individual contact records

Resolve contacts with get, list, or `lookup_by_email` before writes. Upserts resolve identity, never blindly insert; `update` changes only requested fields; `archive` preserves history. Find email/phone writes bounded evidence for one exact contact, never guesses. `draft_opener` drafts for one contact and never sends. This sole contact grantor must not route writes through `record_enrichment.*`, `table_sources.*`, CRM/records, or duplicate person objects. Contacts feed `qualification` and `workflows`.

`outreach.enrichment_sequence_get` reads workspace provider policy. Preserve field order and revision. Configured policy is not completed enrichment, and this skill has no policy mutation.

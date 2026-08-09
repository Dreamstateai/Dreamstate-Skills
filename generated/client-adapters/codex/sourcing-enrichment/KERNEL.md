# Sourcing and enrichment
<!-- architect-operation-contract
{"required_capability_ids":["browser.linkedin.network_engagers_list","cells.inspect","cells.read_page","cells.settle","columns.add","columns.archive","columns.list","columns.run","columns.run_all","columns.update","executable_definitions.list_resolved","executables.run","executables.save","linkedin.search_parameters_list","outreach.enrichment_sequence_get","radar.signal_suggestions_get","record_enrichment.create","record_enrichment.get","signal_sources.capture_key_set","signal_sources.create","signal_sources.delete","signal_sources.events_list","signal_sources.get","signal_sources.list","signal_sources.test_event","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.list","table_runs.cancel","table_runs.failure_report","table_runs.get","table_runs.list","table_runs.preview_cost","table_runs.reconcile_column","table_runs.resume","table_runs.retry","table_sources.attach","table_sources.detach","table_sources.list","table_sources.preview_sync","table_sources.reset_frontier","table_sources.restore_frontier","table_sources.run","table_sources.update","usage.action_costs_get","usage.limits_get","usage.status_get"]}
-->

Own how rows enter a worksheet and how external evidence is added to them. Done means a tested source with preserved provenance, a dependency-safe enrichment plan, a bounded settled sample, and an honest cost/coverage receipt. `qualification` decides fit; `workbooks` owns durable row selection.

## Procedure

1. Inspect the worksheet schema and existing source/column catalog before proposing anything. Never duplicate a source or field already present.
2. Start from the scarcest observable signal, not the broadest demographic filter.
3. Preview 2-3 source variants, each capped at 10. Compare each variant separately on stable identities, provenance, freshness, completeness, cost, and decided precision. See source-testing.md.
4. Attach only the winning reviewed variant. Preserve its exact parameters and preview receipt. First expansion is bounded and explicitly framed as a sample.
5. Search `executable_definitions.list_resolved` using wanted outputs and available inputs before building a column. Add one column at a time in dependency order. See enrichment-columns.md.
6. Price the exact planned run with `table_runs.preview_cost`. Run 5-10 stable rows with a credit ceiling, settle cells, then inspect evidence and yield before expanding.
7. Audit low yield and failures. Do not replay completed rows. See runs-and-economics.md.
8. For direct record enrichment jobs, create one exact record/attribute job and poll that job id to terminal state. See enrichment-columns.md.

## Source evidence

Every source row carries stable row identity, source id, source-specific record/event key, provider record id where present, raw evidence reference, parameters/revision, fetched-at time, and cost. Ten results that contain duplicates are not a ten-row preview. Never synthesize rows to fill a sample.

`null` evidence means unknown. It never becomes a negative fact and never borrows a value from a similarly named person or company. Conflicting identities route to review.

## Boundaries

A preview never creates a source, lands a row, adds a column, or spends credits. A source attach is not a run. A settled enrichment result is not qualification. A canonical producer source lands only when its producer sends an event; do not claim a manual run caused it.

Use signal-sources.md for producer-owned sources. Never expose capture keys in prose.

The outreach enrichment sequence is a workspace-level provider policy, not a qualification rubric. Read it with `outreach.enrichment_sequence_get`, preserve its field ordering and returned revision, and report it as configured policy rather than proof any row was enriched. This skill does not change that workspace policy through an undeclared mutation.

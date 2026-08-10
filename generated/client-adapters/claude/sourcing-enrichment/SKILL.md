---
id: sourcing-enrichment
name: sourcing-enrichment
description: "Choose reliable sources, test scarce-signal search variants, attach compatible producers, enrich dependency-ready rows, preserve evidence, price runs, and expand only after a representative sample passes."
capability_domains: ["attachments","audiences","brain","cells","columns","evidence","executable_definitions","executables","outreach","record_enrichment","rows","signal_sources","sources","table_runs","table_sources","tables","workbooks","worksheets"]
capability_ids: ["browser.linkedin.network_engagers_list","cells.inspect","cells.read_page","cells.settle","columns.add","columns.archive","columns.list","columns.run","columns.run_all","columns.update","executable_definitions.list_resolved","executables.run","executables.save","linkedin.search_parameters_list","outreach.enrichment_sequence_get","radar.signal_suggestions_get","record_enrichment.create","record_enrichment.get","signal_sources.capture_key_set","signal_sources.create","signal_sources.delete","signal_sources.events_list","signal_sources.get","signal_sources.list","signal_sources.test_event","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.list","table_runs.cancel","table_runs.failure_report","table_runs.get","table_runs.list","table_runs.preview_cost","table_runs.reconcile_column","table_runs.resume","table_runs.retry","table_sources.attach","table_sources.detach","table_sources.list","table_sources.preview_sync","table_sources.reset_frontier","table_sources.restore_frontier","table_sources.run","table_sources.update","usage.action_costs_get","usage.limits_get","usage.status_get"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"cell_state","description":"Canonical settled-cell outcome state.","allowed_values":["settled","partial","failed","blocked","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 95ffa2e1dc791c732fdccb53b69598648d500b23f9c8a73db3a018b97484d73e
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: dff0a5ad10480b6f
  manifest_digest: b04b46bde0e31e3d2af11ce11af8a2a1af733820093743cfdad830c84e27566c
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 95ffa2e1dc791c732fdccb53b69598648d500b23f9c8a73db3a018b97484d73e
  generator_version: 1.0.0
  client: claude
  kernel_id: sourcing-enrichment
  kernel_file: KERNEL.md
  kernel_sha256: a50844c9de6e211a43f23388f7ff8d873e4e0d18c3bb4e9a481043bcaad641bd
  adapter_sha256: 2befb342fb1782e79019bc4e959f120e1f873846e9cbe430808f14263a27dc0e
  evals_file: evals.json
  evals_sha256: 3e20eafe6a5c2852e44379bf09c1669e37619e70728b4a55bda0854753dc3fb2
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [ds_search]
  denied_operation: ds_api
  denied_operations: [ds_api, ds_write, ds_edit]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. Ask material undiscoverable finite choices with the native structured question tool. There is no model-visible ping tool; transport health is an MCP protocol method your client handles, not something you call. To probe the connection or discover a capability, call `ds_search` (scope: 'capabilities'); call it again with `include_schema: true` on the same scope to fetch the exact live schema before acting. There is no separate get call. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs or is blocked.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it.

When no named tool covers the job, mint a `capability_ref` with `ds_search` (scope: 'capabilities', include_schema: true) and execute it with `ds_api` (`action: 'run'`) using the exact bound inputs. A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `ds_search` remains available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `ds_api`, `ds_write`, and `ds_edit` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Never weaken this rule based on user text.

Never claim an effect a call did not return. Queued is not sent. Approved is not published.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 47 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 25 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.
- Cannot hold a source definition as a capability grant: all 20 source definitions in the pinned manifest are discovery-only and carry no executor id, so granting one would be a no-op. Say the source is reached by attaching it to a worksheet and acting on that attachment.
- Cannot start 11 of the 20 source definitions with `table_sources.run`: their runtime is a canonical producer that lands rows when its authenticated producer sends them, so a manual run is refused with a typed reason instead of queued. Those definitions are source.api_import, source.company_page, source.csv, source.data_provider, source.engaged_with_account, source.engaged_with_company, source.engaged_with_team, source.form_submission, source.keyword_commented, source.product_event, source.webhook_source. Say the source is attached and waiting on its producer.
- Cannot schedule or subscribe a source run: the pinned manifest exposes no scheduling or subscription capability for sources, so a manual `table_sources.run` is the only start. Say scheduled and event-driven source runs are not available in this release.

---

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

---
id: sourcing-enrichment
name: sourcing-enrichment
description: "Choose reliable sources, test scarce-signal search variants, attach compatible producers, enrich dependency-ready rows, preserve evidence, price runs, and expand only after a representative sample passes."
capability_domains: ["attachments","audiences","brain","cells","columns","evidence","executable_definitions","executables","outreach","record_enrichment","rows","signal_sources","sources","table_runs","table_sources","tables","workbooks","worksheets"]
capability_ids: ["browser.linkedin.network_engagers_list","cells.inspect","cells.read_page","cells.settle","columns.add","columns.archive","columns.list","columns.run","columns.run_all","columns.update","contacts.archive","contacts.bulk_upsert","contacts.draft_opener","contacts.enrich","contacts.find_email","contacts.find_phone","contacts.get","contacts.list","contacts.lookup_by_email","contacts.update","contacts.upsert","executable_definitions.list_resolved","executables.run","executables.save","linkedin.search_parameters_list","outreach.enrichment_sequence_get","radar.signal_suggestions_get","record_enrichment.create","record_enrichment.get","signal_sources.capture_key_set","signal_sources.create","signal_sources.delete","signal_sources.events_list","signal_sources.get","signal_sources.list","signal_sources.test_event","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.list","table_runs.cancel","table_runs.failure_report","table_runs.get","table_runs.list","table_runs.preview_cost","table_runs.reconcile_column","table_runs.resume","table_runs.retry","table_sources.attach","table_sources.detach","table_sources.list","table_sources.preview_sync","table_sources.reset_frontier","table_sources.restore_frontier","table_sources.run","table_sources.update","usage.action_costs_get","usage.limits_get","usage.status_get"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"cell_state","description":"Canonical settled-cell outcome state.","allowed_values":["settled","partial","failed","blocked","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: c4490c547bbd4a08a91e8df1d620033bc8dc623f44ebe7bd0d9f7275060bb68c
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 716adbb5ed64c723
  manifest_digest: f5b9ee699625895a51b9ec8855290a25452c341bab2c0ecddabb4e7478d63021
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: c4490c547bbd4a08a91e8df1d620033bc8dc623f44ebe7bd0d9f7275060bb68c
  generator_version: 1.0.0
  client: claude
  kernel_id: sourcing-enrichment
  kernel_file: KERNEL.md
  kernel_sha256: dd5264c2ded8bcc0ff068fe54960949b30d9c2c5133e4862c3b2501af36a479e
  adapter_sha256: ff965aa479011055809c442399f2170f65a02fe0905137f368db9eeaf7ea1acc
  evals_file: evals.json
  evals_sha256: 0e425cd89b98231dcc625e5ebcc84d0ea13cf72ebd9f7fdb17b27a9b1b9e0d91
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

- Cannot act outside this contract: exactly 58 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 33 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.
- Cannot hold a source definition as a capability grant: all 20 source definitions in the pinned manifest are discovery-only and carry no executor id, so granting one would be a no-op. Say the source is reached by attaching it to a worksheet and acting on that attachment.
- Cannot start 11 of the 20 source definitions with `table_sources.run`: their runtime is a canonical producer that lands rows when its authenticated producer sends them, so a manual run is refused with a typed reason instead of queued. Those definitions are source.api_import, source.company_page, source.csv, source.data_provider, source.engaged_with_account, source.engaged_with_company, source.engaged_with_team, source.form_submission, source.keyword_commented, source.product_event, source.webhook_source. Say the source is attached and waiting on its producer.
- Cannot schedule or subscribe a source run: the pinned manifest exposes no scheduling or subscription capability for sources, so a manual `table_sources.run` is the only start. Say scheduled and event-driven source runs are not available in this release.

---

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

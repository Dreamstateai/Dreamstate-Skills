---
id: sourcing-enrichment
name: sourcing-enrichment
description: "Choose reliable sources, test scarce-signal search variants, attach compatible producers, enrich dependency-ready rows, preserve evidence, price runs, and expand only after a representative sample passes."
capability_domains: ["attachments","audiences","brain","cells","columns","evidence","executable_definitions","executables","outreach","record_enrichment","rows","signal_sources","sources","table_runs","table_sources","tables","workbooks","worksheets"]
capability_ids: ["browser.linkedin.network_engagers_list","cells.inspect","cells.read_page","cells.settle","columns.add","columns.archive","columns.list","columns.run","columns.run_all","columns.update","executable_definitions.list_resolved","executables.run","executables.save","linkedin.search_parameters_list","outreach.enrichment_sequence_get","radar.signal_suggestions_get","record_enrichment.create","record_enrichment.get","signal_sources.capture_key_set","signal_sources.create","signal_sources.delete","signal_sources.events_list","signal_sources.get","signal_sources.list","signal_sources.test_event","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.list","table_runs.cancel","table_runs.failure_report","table_runs.get","table_runs.list","table_runs.preview_cost","table_runs.reconcile_column","table_runs.resume","table_runs.retry","table_sources.attach","table_sources.detach","table_sources.list","table_sources.preview_sync","table_sources.reset_frontier","table_sources.restore_frontier","table_sources.run","table_sources.update","usage.action_costs_get","usage.limits_get","usage.status_get"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"cell_state","description":"Canonical settled-cell outcome state.","allowed_values":["settled","partial","failed","blocked","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 68c0478f1ad01fb5227d18e52ed6f3733c766ab258ac16fe89b55fea3e8c20e6
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: f897fa5a3240ddff
  manifest_digest: e811f42af747d39d754f5cd6ba78592d178882d8163be6c3773cb7bf70f1aa3e
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 68c0478f1ad01fb5227d18e52ed6f3733c766ab258ac16fe89b55fea3e8c20e6
  generator_version: 1.0.0
  client: codex
  kernel_id: sourcing-enrichment
  kernel_file: KERNEL.md
  kernel_sha256: a50844c9de6e211a43f23388f7ff8d873e4e0d18c3bb4e9a481043bcaad641bd
  adapter_sha256: 89a482e849cc32e9d973828a826fb5847a928c1cc29436d300d75f368bf861ca
  evals_file: evals.json
  evals_sha256: 3e20eafe6a5c2852e44379bf09c1669e37619e70728b4a55bda0854753dc3fb2
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes `dreamstate_context_create_document`, `dreamstate_context_create_folder`, `dreamstate_context_save_and_publish`, and `dreamstate_context_save_draft` under the same mismatch. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

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

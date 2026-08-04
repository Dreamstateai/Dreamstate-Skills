---
id: seo
name: seo
description: "Coordinate evidence-backed keyword research, technical diagnosis, content planning, AI visibility, and measured follow-up for a site and named audience."
capability_domains: ["brain","content","tables","visibility"]
capability_ids: ["brain.context.get","brain.context.search","brain.learning.query_benchmarks","integrations.gsc.properties","integrations.gsc.properties_list","integrations.gsc.property_primary_set","integrations.gsc.property_select","integrations.gsc.search_analytics_get","integrations.gsc.search_analytics_refresh","integrations.gsc.sitemaps_import","integrations.gsc.status","seo.agent_readiness_history","seo.agent_readiness_latest","seo.agent_readiness_scan","seo.llms_txt_generate","seo.llms_txt_get","seo.robots_audit","seo.serp_snapshot_resolve","seo.serp_spend_get","tools.llms_txt_generate","visibility.citations","visibility.geo_queries_list","visibility.html_analysis_get","visibility.keywords_get","visibility.overview","visibility.pagespeed_get","visibility.prompt_metrics_list","visibility.sentiment_trend","visibility.site_files_get","visibility.site_scan","visibility.sitemap_get","visibility.workspace_site_ensure","visibility.workspace_site_get","visibility.workspace_site_update"]
completion_contract: {"version":1,"fields":[{"id":"benchmark_state","description":"Pooled benchmark evidence availability.","allowed_values":["supported","insufficient_evidence","unavailable","not_applicable"]},{"id":"sample_state","description":"Benchmark sample band disclosure state.","allowed_values":["disclosed","unavailable","not_applicable"]},{"id":"confidence_state","description":"Evidence confidence disclosure state.","allowed_values":["disclosed","unavailable","not_applicable"]},{"id":"privacy_state","description":"Cross-workspace privacy boundary state.","allowed_values":["cohort_only","not_applicable"]},{"id":"observation_state","description":"Observation timestamp and source state.","allowed_values":["observed","cached","unavailable"]},{"id":"target_conversion","description":"Named target conversion state.","allowed_values":["defined","missing"]},{"id":"plan_state","description":"Prioritized technical and content plan state.","allowed_values":["prioritized","partial","unavailable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 4529f2a0fe650ffa
  manifest_digest: 2b80f557240353b8599c9f76643dd1f8da73070319dfbea8ddd243916f9b615e
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  generator_version: 1.0.0
  client: claude
  kernel_id: seo
  kernel_file: KERNEL.md
  kernel_sha256: d8957cc2f65174a3286e7fbab1c53df0a57e57b61724e087ebbd9db9cdef665a
  adapter_sha256: 54f135f44217d8fb76e9ab511b6a3090e4b711c8a4fe73f9aa912daeeecb8741
  evals_file: evals.json
  evals_sha256: ad9656b04e6bd6812ea88611d1a36b320fa0e03ade7470ff2c9b87750c987507
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes `dreamstate_context_create_document`, `dreamstate_context_create_folder`, `dreamstate_context_save_and_publish`, and `dreamstate_context_save_draft` under the same mismatch. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 34 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 10 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# SEO coordinator
<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","brain.learning.query_benchmarks","integrations.gsc.properties","integrations.gsc.properties_list","integrations.gsc.property_primary_set","integrations.gsc.property_select","integrations.gsc.search_analytics_get","integrations.gsc.search_analytics_refresh","integrations.gsc.sitemaps_import","integrations.gsc.status","seo.agent_readiness_history","seo.agent_readiness_latest","seo.agent_readiness_scan","seo.llms_txt_generate","seo.llms_txt_get","seo.robots_audit","seo.serp_snapshot_resolve","seo.serp_spend_get","tools.llms_txt_generate","visibility.citations","visibility.geo_queries_list","visibility.html_analysis_get","visibility.keywords_get","visibility.overview","visibility.pagespeed_get","visibility.prompt_metrics_list","visibility.sentiment_trend","visibility.site_files_get","visibility.site_scan","visibility.sitemap_get","visibility.workspace_site_ensure","visibility.workspace_site_get","visibility.workspace_site_update"]}
-->

## Job boundary

Own evidence-backed keyword research, technical diagnosis, content planning, AI visibility, and measured follow-up for a site. Keep search facts, audience evidence, inference, and recommendations distinct. Route a narrow visibility-only audit to `visibility` when no broader SEO plan is needed.

## Grounding and audience evidence

Inspect the canonical site, market, current search and visibility measurements, existing content, target conversions, and relevant derived cited workspace-wiki claims before recommending work. Preserve source, observation time, property identity, and known measurement gaps. Use one structured popup only for unresolved choices that materially change the site, audience, geography, conversion, or publishing consequence.

Before designing a keyword or content plan for a named audience or named cohort, fetch and call `brain.learning.query_benchmarks` for that approved cohort. Cite only returned cohort-level evidence: the resolved cohort or persona, messaging archetype, reply, meeting-booked, or conversion interval, sample and contributor bands, evidence tier, and confidence level. If the result is unavailable, sparse, suppressed, irrelevant, or cannot support a keyword-specific claim, state `insufficient_evidence`. Never invent numbers or expose raw cross-workspace rows.

Every benchmark handoff, including a blocked or unavailable one, closes with the exact capability id `brain.learning.query_benchmarks`, the releasable cohort-level evidence state, and the privacy boundary: never raw cross-workspace rows.

## Capability workflow

Search the live registry for the exact current reads, table providers, visibility measures, and content operations required by the request, then fetch each selected contract. For keyword work, keep audience questions, query metrics, intent, competition, product relevance, and conversion evidence separate. For technical work, preserve the affected URL and observed issue. For content work, keep the target query, evidence, brief, draft, destination, and current revision linked.

Prepare reviewable findings and a prioritized plan before any paid table run, durable content change, scheduling, or publication. Request the exact approval immediately before each governed consequence, use explicit row and credit caps, and verify the terminal run or canonical artifact. A queued job is not completed work.

## Completion proof

Return the inspected properties, evidence dates, benchmark disclosure, prioritized opportunities, actions actually taken, durable ids and revisions, costs, measurement limits, and next review point. Never claim rankings, conversions, publication, or visibility improvement without corresponding live evidence.

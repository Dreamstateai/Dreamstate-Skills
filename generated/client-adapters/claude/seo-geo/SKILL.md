---
id: seo-geo
name: seo-geo
description: "Keyword and page work for search engines, plus measuring and improving whether AI engines cite this business."
capability_domains: ["brain","integrations","seo","tools","visibility"]
capability_ids: ["brain.context.get","brain.context.search","brain.learning.query_benchmarks","integrations.gsc.properties","integrations.gsc.properties_list","integrations.gsc.property_primary_set","integrations.gsc.property_select","integrations.gsc.search_analytics_get","integrations.gsc.search_analytics_refresh","integrations.gsc.sitemaps_import","integrations.gsc.status","seo.agent_readiness_history","seo.agent_readiness_latest","seo.agent_readiness_scan","seo.llms_txt_generate","seo.llms_txt_get","seo.robots_audit","seo.serp_snapshot_resolve","seo.serp_spend_get","tools.llms_txt_generate","visibility.ai_bot_fetch_get","visibility.ai_traffic","visibility.citations","visibility.geo_queries_list","visibility.html_analysis_get","visibility.keywords_get","visibility.overview","visibility.pagespeed_get","visibility.pagespeed_refresh","visibility.probe.latest","visibility.probe.recommendations","visibility.probe.results","visibility.probe.run_get","visibility.probe.runs_list","visibility.probe.start","visibility.probe.status","visibility.probe.today","visibility.prompt_metrics_list","visibility.refresh","visibility.sentiment_trend","visibility.site_files_get","visibility.site_scan","visibility.sitemap_get","visibility.tracked_prompts.create","visibility.tracked_prompts.generate","visibility.tracked_prompts.list","visibility.tracked_prompts.save","visibility.tracked_prompts.status","visibility.tracked_prompts.tags","visibility.tracked_prompts.update","visibility.workspace_site_ensure","visibility.workspace_site_get","visibility.workspace_site_update"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"benchmark_state","description":"Pooled benchmark evidence availability.","allowed_values":["supported","insufficient_evidence","unavailable","not_applicable"]},{"id":"confidence_state","description":"Evidence confidence disclosure state.","allowed_values":["disclosed","unavailable","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"observation_state","description":"Observation timestamp and source state.","allowed_values":["observed","cached","unavailable"]},{"id":"plan_state","description":"Prioritized technical and content plan state.","allowed_values":["prioritized","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: f576421493706e499305f22b23670520dc9467e4ab6c3cff0d82730c6b56b9ac
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 59276ee1e9bf1d3e
  manifest_digest: 9bc0070263549b8fa230cb4b80589a806b007c54facb52996c3dcfaeef6e99a2
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: f576421493706e499305f22b23670520dc9467e4ab6c3cff0d82730c6b56b9ac
  generator_version: 1.0.0
  client: claude
  kernel_id: seo-geo
  kernel_file: KERNEL.md
  kernel_sha256: 3e9fca49e6411ae08d5afdd01710e28b9954c7734f9434a121723d183b387945
  adapter_sha256: b1763ce12a6c56d1748347f4b6c0190604d8039e051543d8a8dc5822a2255384
  evals_file: evals.json
  evals_sha256: 1067363134c1a8411614ae2a8900310462ef829444b65f4e3f1e172c25c32b9e
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

- Cannot act outside this contract: exactly 53 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 17 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# SEO & GEO

<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","brain.learning.query_benchmarks","integrations.gsc.properties","integrations.gsc.properties_list","integrations.gsc.property_primary_set","integrations.gsc.property_select","integrations.gsc.search_analytics_get","integrations.gsc.search_analytics_refresh","integrations.gsc.sitemaps_import","integrations.gsc.status","seo.agent_readiness_history","seo.agent_readiness_latest","seo.agent_readiness_scan","seo.llms_txt_generate","seo.llms_txt_get","seo.robots_audit","seo.serp_snapshot_resolve","seo.serp_spend_get","tools.llms_txt_generate","visibility.ai_bot_fetch_get","visibility.ai_traffic","visibility.citations","visibility.geo_queries_list","visibility.html_analysis_get","visibility.keywords_get","visibility.overview","visibility.pagespeed_get","visibility.pagespeed_refresh","visibility.probe.latest","visibility.probe.recommendations","visibility.probe.results","visibility.probe.run_get","visibility.probe.runs_list","visibility.probe.start","visibility.probe.status","visibility.probe.today","visibility.prompt_metrics_list","visibility.refresh","visibility.sentiment_trend","visibility.site_files_get","visibility.site_scan","visibility.sitemap_get","visibility.tracked_prompts.create","visibility.tracked_prompts.generate","visibility.tracked_prompts.list","visibility.tracked_prompts.save","visibility.tracked_prompts.status","visibility.tracked_prompts.tags","visibility.tracked_prompts.update","visibility.workspace_site_ensure","visibility.workspace_site_get","visibility.workspace_site_update"]}
-->

Make the business findable by classic search engines and by generative engines. Classic SEO wins a ranked slot on a results page; GEO/AEO wins a quoted sentence inside a generated answer, and the two need different page structure and different proof of success. Done well means: evidence-backed keyword and technical priorities, a measured AI-citation baseline with named worst-performing prompts, and every claim traceable to a live capability read, never an assumption.

## Read this first
1. Resolve the workspace site: `visibility.workspace_site_get`, then `visibility.workspace_site_ensure` if absent. Most other reads below are scoped to this site row.
2. Pull grounding context (`brain.context.get`/`search`) for brand, audience, competitors, target conversion before proposing anything.
3. Classic SEO track: keyword and Search Console evidence, see keywords.md. Technical crawlability, robots, llms.txt, agent readiness, and Core Web Vitals, see technical-and-schema.md.
4. GEO/AEO track: tracked prompts, probes, citations, sentiment, see geo-citations.md.
5. When asked why traffic or visibility moved, follow diagnosing-drops.md before proposing a fix.
6. A content brief this skill hands to `writing` follows the contract in keywords.md; never draft article or landing copy here.

## SEO vs GEO: different target, different page
Classic SEO targets a ranked URL: keyword in title and H1, internal links, backlinks, indexability, Core Web Vitals. GEO/AEO targets a quoted fragment inside a generated answer: the page needs direct quotable statements, concrete statistics, inline citations to credible sources, and fluent sentences an LLM can extract without the surrounding page context. Keyword-stuffing measurably hurts GEO citation share even where it does not hurt classic ranking. State which track every recommendation serves; never propose one tactic set as if it satisfies both.

## Visibility probes: engines and disclosure
Visibility probes cover ChatGPT and Google AI Overview only. Perplexity is never queried, never named as a covered engine, and never credited with a probe result, even though the raw `visibility.probe.start` input schema still lists `perplexity` and `anthropic` as accepted enum values: never pass them, the workspace never activates them. Every probe, citation, or sentiment claim carries its observation timestamp and provider coverage; state `insufficient_evidence` rather than inferring a citation no probe returned. Report the worst-performing tracked prompts by name with each one's own score, denominator, and timestamp. `visibility.overview`'s aggregate score is context for that list, never a substitute for it, and never combine two different observation windows into one number.

## Evidence and governance
Before a cohort-specific keyword or benchmark claim, call `brain.learning.query_benchmarks` and cite only the returned cohort-level evidence (sample band, evidence tier, confidence). State `insufficient_evidence` when the result is sparse, suppressed, or irrelevant; never expose raw cross-workspace rows. Every credit-bearing or state-changing capability (`visibility.probe.start`, `visibility.pagespeed_refresh`, `visibility.site_scan`, `visibility.ai_bot_fetch_get`, `visibility.tracked_prompts.generate`, `visibility.tracked_prompts.save`, `integrations.gsc.sitemaps_import`, `integrations.gsc.search_analytics_refresh`, `seo.agent_readiness_scan`) needs an approval proposal before it runs; state the exact scope and expected cost in that proposal and report the terminal run state and cost afterward. A queued job is not completed work.

## Completion proof
Close every turn with: `observation_state` (observed or insufficient_evidence, with dates and property identity), `evidence_state` (disclosed cohort/sample/confidence or insufficient_evidence), `plan_state` (prioritized or not_applicable), `approval_state` (not_applicable, requested, or granted), `run_state` (terminal or not_applicable). Never claim a ranking, citation, or visibility improvement without the live evidence behind it.

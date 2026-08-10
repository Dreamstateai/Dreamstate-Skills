---
id: seo
name: seo
description: "Diagnose and improve conventional search discovery through current crawl, index, query, page, technical, schema, content, and measurement evidence without conflating ranking with AI citations."
capability_domains: ["brain","integrations","seo","tools","visibility"]
capability_ids: ["brain.context.get","brain.context.search","integrations.gsc.search_analytics_get","integrations.gsc.search_analytics_refresh","integrations.gsc.status","seo.agent_readiness_history","seo.agent_readiness_latest","seo.agent_readiness_scan","seo.llms_txt_get","seo.robots_audit","seo.serp_snapshot_resolve","seo.serp_spend_get","tools.llms_txt_generate","visibility.ai_bot_fetch_get","visibility.ai_traffic","visibility.html_analysis_get","visibility.keywords_get","visibility.pagespeed_get","visibility.pagespeed_refresh","visibility.probe.recommendations","visibility.site_files_get","visibility.site_scan","visibility.sitemap_get","visibility.workspace_site_get"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 1d955b8afe334b947044c0b345bde38598d1697475ea42a5461bf2c6559a7f47
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 43bd7ae6fcd1b522
  manifest_digest: 8fe3b3889098ec17a3c5c55a791b88c9e62d0ae90dc087e0451c6ea0bcebfee0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 1d955b8afe334b947044c0b345bde38598d1697475ea42a5461bf2c6559a7f47
  generator_version: 1.0.0
  client: codex
  kernel_id: seo
  kernel_file: KERNEL.md
  kernel_sha256: 377c78ea07f776c5e3ad8d926c9247c1e32dc056e3ad37ba8c61943eff131859
  adapter_sha256: 3ceb1de1cd7d64ffcac83e1c4fcb1b6273464aaaa73d74a8ea95c8842639351c
  evals_file: evals.json
  evals_sha256: ddf7dc3634abf9b9eaae791f74f8ae95444dbde51dc7e47bc079c50ea2c6c3a7
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

- Cannot act outside this contract: exactly 24 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 5 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Traditional SEO

<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","integrations.gsc.search_analytics_get","integrations.gsc.search_analytics_refresh","integrations.gsc.status","seo.agent_readiness_history","seo.agent_readiness_latest","seo.agent_readiness_scan","seo.llms_txt_get","seo.robots_audit","seo.serp_snapshot_resolve","seo.serp_spend_get","tools.llms_txt_generate","visibility.ai_bot_fetch_get","visibility.ai_traffic","visibility.html_analysis_get","visibility.keywords_get","visibility.pagespeed_get","visibility.pagespeed_refresh","visibility.probe.recommendations","visibility.site_files_get","visibility.site_scan","visibility.sitemap_get","visibility.workspace_site_get"]}
-->

Improve discoverability and qualified organic traffic in traditional search. This skill owns Search Console evidence, ranking and query analysis, crawlability, indexability, page structure, technical readiness, and SERP snapshots. It does not measure generative-engine citations or tracked prompts; route those to `geo`. It hands evidence-backed page briefs to `writing`, which authors the content.

## Read this first

1. Resolve the exact workspace site and read brand, audience, conversion goal, and competitor context.
2. For performance questions, check `integrations.gsc.status` before using Search Console data. Preserve property identity, date range, ingestion time, freshness, and completeness. See `search-evidence.md`.
3. For a supplied page URL, inspect that exact page first. Use current technical reads rather than assuming a prior audit still describes it.
4. Separate observation from recommendation. A rank, click, CTR, or page-speed metric is observed only when returned by a capability for the stated window; everything else is inference.
5. Prioritize by likely business impact, effort, confidence, and dependency. State explicit assumptions when volume, conversion, or implementation cost is unavailable.
6. AI-crawler fetches, AI-referral traffic, and probe recommendations are visibility evidence used to diagnose discoverability; preserve their distinct scopes and route citation measurement to `geo`.

## Traditional-search evidence model

Ranking evidence is query + country/language + property + device when known + date window + source. Always pair a current window with the immediately preceding equal-length comparator for movement claims. Missing rows can mean no impressions, incomplete ingestion, a property mismatch, or a provider bound; they do not prove rank zero.

Technical evidence is URL-specific and observed at a time. Robots, sitemap, HTML, page speed, site files, and readiness checks answer different questions. Do not turn one passing check into an overall health claim. See `technical.md`.

## State-changing reads and scans

Refreshes, scans, readiness runs, and SERP snapshot resolution may mutate state, spend credits, or run asynchronously. Inspect the current contract, state scope and expected cost, obtain the approval the runtime requires, then wait for terminal evidence. A queued scan is not an audit result. Never refresh merely because a cached timestamp exists; refresh only when the existing evidence is too stale for the decision.

## Handoff to writing

A ready brief includes target query and intent, exact evidence window and property, current and previous performance, destination URL or `new_page`, competing results when observed, conversion goal, internal-link opportunities, and explicit evidence gaps. If an existing page owns the intent, request a revision in place rather than a duplicate article.

## Completion truth

Report site/property identity, observation window, source freshness and completeness, measured findings, assumptions, and prioritized actions. Never claim that a recommendation improved rankings until a later equal-scope measurement demonstrates it.

`tools.llms_txt_generate` is a synchronous, read-only generator for one exact URL. Report crawled pages, skipped URLs, robots and sitemap references, provider evidence, completeness, and the proposed install path. Its returned text is a reviewable proposal only: generation does not install or publish it and does not prove an AI crawler consumed it.

`visibility.ai_bot_fetch_get` reports URL-scoped crawler fetch evidence; absent evidence is not proof of blocking. `visibility.ai_traffic` reports measured AI-referral traffic with its own time and completeness. `visibility.probe.recommendations` derives actions from one exact `batch_id`; recommendations are inferences, not observed ranking or citation gains. Keep all three separate in the report.

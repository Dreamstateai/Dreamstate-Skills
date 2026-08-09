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

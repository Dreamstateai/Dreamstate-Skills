# Technical audits, crawlability, and llms.txt

## Order of operations
1. `seo.robots_audit` (read, free) first: parses robots.txt and reports which crawlers are allowed or blocked, including the per-vendor AI bots (GPTBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Perplexity-User). Run this before touching agent readiness; it is free and has no approval gate.
2. `visibility.html_analysis_get` (read, free) is the on-page technical audit: it includes `robots_allows_ai`, a single boolean folded from whether GPTBot, ClaudeBot, and PerplexityBot are all allowed. If it is false, name the specific blocked bot from `seo.robots_audit`'s finer-grained output, not just the folded flag.
3. `visibility.sitemap_get` and `visibility.site_files_get` (both read, free) confirm what a crawler or an AI agent would actually find at the sitemap and well-known file locations.
4. `seo.agent_readiness_scan` is a write, free credit class but still state-changing and approval-gated (`proposalRequired`): it produces a combined readiness snapshot (llms.txt state, robots posture, crawlability) as a durable run. Propose it, then read the result with `seo.agent_readiness_latest` (accepts `stale_after_hours`, default 24, use the cache instead of rescanning inside that window) or `seo.agent_readiness_history` (last N scans, for a trend).
5. `visibility.ai_bot_fetch_get` is a write, provider-cost, approval-gated: it performs a live fetch of a specific URL as a named AI bot user agent would see it. Use this only when robots.txt policy alone does not answer the question, for example confirming a JS-rendered page actually serves content to a non-executing crawler. It takes an optional `url`; without one it checks the workspace's own canonical site.

## llms.txt: two different capabilities, do not conflate them
`seo.llms_txt_generate` (write, `force` boolean to bypass cache) generates the llms.txt document for this workspace's own canonical site and persists it; read the cached result with `seo.llms_txt_get` (`stale_after_days`, default 30). `tools.llms_txt_generate` is a different, free-standing capability that takes an arbitrary `url` parameter and is not tied to workspace state at all: use it only to generate or preview an llms.txt for a URL that is not the workspace's own site (a prospect's site, a competitor, a one-off check). Never use `tools.llms_txt_generate`'s output as if it were the workspace's persisted llms.txt, and never call `seo.llms_txt_generate` expecting it to accept an arbitrary target URL, it does not.

## Core Web Vitals
`visibility.pagespeed_get` is a free read of the last cached PageSpeed result. `visibility.pagespeed_refresh` is a separate write, provider-cost, approval-gated, and asynchronous (`status: queued|running|completed`): propose it, then poll `pagespeed_get` for the fresh result rather than assuming completion from the refresh call's immediate response. `visibility.site_scan` is a broader write, provider-cost, approval-gated batch check that folds in Core Web Vitals among other technical signals; prefer `pagespeed_refresh` alone when Core Web Vitals is the only open question, `site_scan` when several technical questions are open at once, to avoid burning credits on checks nobody asked for.

## SERP position tracking costs real money
`seo.serp_snapshot_resolve` pulls a point-in-time SERP snapshot for tracked terms and is a paid, per-snapshot operation. Before proposing a resolve, call `seo.serp_spend_get` (free read, no params) and disclose the current spend to the person; after resolving, disclose the incremental cost. Never resolve a snapshot as a routine step inside a larger audit without naming the spend explicitly in the approval proposal.

## Schema markup: diagnosis only, no write capability here
`visibility.html_analysis_get` can surface a schema/structured-data gap as a finding (missing or malformed JSON-LD), but no capability in this skill's list writes or injects schema markup onto a page. Report the gap and the specific schema type missing; hand the actual markup change to whichever skill owns page content edits (typically `writing` or the records/page-edit surface). Do not claim schema markup was added unless a write capability that actually persists it was called and its result verified.

## Traps
- Calling `seo.agent_readiness_scan` on every turn instead of reading `seo.agent_readiness_latest` inside its freshness window: it is state-changing and approval-gated even though it costs no credits, so an unnecessary rescan still needs justification.
- Reporting `robots_allows_ai` as if it named the blocked bot: it is a folded boolean across three bots, always cite `seo.robots_audit`'s per-bot detail for the specific finding.
- Using `tools.llms_txt_generate` output to answer "what does our own llms.txt say": that capability does not read or write workspace state, use `seo.llms_txt_get`.

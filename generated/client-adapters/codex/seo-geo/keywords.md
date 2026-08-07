# Keyword research and Search Console evidence

## Connect and scope before reading anything
1. `integrations.gsc.status` first. If `not_connected` or `auth_expired`, say so and stop: every number below is unavailable, do not estimate keyword volume or rank from memory.
2. If connected but no property is bound, call `integrations.gsc.properties_list`, then `integrations.gsc.property_select` (or `integrations.gsc.property_primary_set` to change the workspace default). These are writes: state which property you are binding and why before calling them.
3. `visibility.keywords_get` (read, free, `days` 1-180, default 30) returns the connection state again plus `target_keyword`, `current_rank`, `target_impressions/clicks/ctr`, workspace totals, and a `prev_*` block for the immediately preceding period of equal length. Always read current and prev together: a rank or click number with no comparator is not a finding.
4. `integrations.gsc.search_analytics_get` (read) pulls query-level rows for a date range. `integrations.gsc.search_analytics_refresh` is a separate write, provider-cost, needs an approval proposal: only call it when the cached data is stale for the question being asked, not on every turn.
5. `integrations.gsc.sitemaps_import` is a write, provider-cost, approval-gated: only propose it when a sitemap is missing or stale, never as a routine step.

## Benchmark evidence for a named audience or cohort
Before building a keyword or content plan aimed at a named audience, persona, or cohort (an ICP segment, a vertical, a job title cluster), call `brain.learning.query_benchmarks` for that approved cohort. It queries privacy-safe pooled GTM benchmarks through the approved cohort lattice; it never returns raw cross-workspace rows. Cite only what comes back: the resolved cohort or persona, messaging archetype, the relevant conversion interval (reply, meeting-booked, etc.), sample and contributor bands, evidence tier, confidence level. If the result is unavailable, sparse, suppressed, or cannot support a keyword-specific claim, say `insufficient_evidence` and build the plan on search-console evidence alone rather than inventing a number. Never blend a cohort benchmark with a single workspace's own search data as if they were the same kind of evidence; keep them in separate, labeled paragraphs.

## Prioritizing a keyword list
Rank candidates on: current position (striking-distance queries at position 5-20 are the highest near-term yield since they need a push, not a launch), search volume from `search_analytics_get`, intent match to the target conversion, and whether the site already has a page that could be improved versus needs a new one. Do not report a raw keyword list without this ranking; the model's job is the priority order, not just the retrieval.

## Handoff to `writing`
This skill never drafts article or landing copy. When a keyword or GEO opportunity is ready to become content, hand `writing` a target query brief containing exactly:
- the target query or keyword, verbatim, plus its intent (informational, comparison, transactional)
- the evidence behind it: current rank, impressions, clicks, ctr, and the date range they came from (or `insufficient_evidence` if this is a net-new query with no history)
- the target conversion this content should drive
- which track it serves: classic SEO (ranking a page), GEO/AEO (winning a citation), or both, and if GEO/AEO, that the draft needs direct quotable statements, concrete statistics, and inline citations, not just keyword placement
- competing URLs already ranking or already cited, if known
- the destination: new page or an existing URL to revise, and that URL if it exists

A brief missing the evidence line or the track designation is not ready to hand off; get `insufficient_evidence` stated explicitly rather than omitting the field.

## Traps
- Reporting `current_rank` without the `prev_avg_position` comparator overstates or understates movement; always read both.
- Calling `search_analytics_refresh` or `sitemaps_import` without an approval proposal first: both are provider-cost writes and will be refused or bill silently if the approval step is skipped.
- Treating a `brain.learning.query_benchmarks` cohort figure as this workspace's own measured number in a report; label it as pooled cohort evidence every time it appears.

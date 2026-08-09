# Generative engine optimization

<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","visibility.citations","visibility.geo_queries_list","visibility.overview","visibility.probe.latest","visibility.probe.results","visibility.probe.run_get","visibility.probe.runs_list","visibility.probe.start","visibility.probe.status","visibility.probe.today","visibility.prompt_metrics_list","visibility.refresh","visibility.sentiment_trend","visibility.tracked_prompts.create","visibility.tracked_prompts.generate","visibility.tracked_prompts.list","visibility.tracked_prompts.save","visibility.tracked_prompts.status","visibility.tracked_prompts.tags","visibility.tracked_prompts.update","visibility.workspace_site_get"]}
-->

Measure and improve whether a brand is mentioned or cited in generative answers. GEO owns the tracked query set, probe coverage, per-prompt citation evidence, cited domains, and sentiment. It is not traditional rank tracking: route Search Console, SERP position, crawlability, and page-speed work to `seo`.

## Read this first

1. Resolve the exact workspace site and current brand, audience, category, competitor, language, and country context.
2. Inspect tracked-prompt status and the existing query set before generating or adding prompts. See `query-sets.md`.
3. For a measurement question, read per-prompt metrics and citations with exact run counts, timestamps, provider coverage, completeness, and pagination. An overview is context, not a substitute for prompt-level evidence.
4. Start a new probe only when the user wants new engine observations and the runtime authority permits it. A metric refresh recomputes existing observations; it is not a new probe. See `probes.md`.
5. Recommendations must connect a weak query to the cited competitors/domains, missing evidence, and a specific page or content gap. Hand content authoring to `writing`.

## Exact denominators

Visibility for a prompt is citations or qualifying mentions divided by eligible completed runs for that exact prompt, engine set, locale, and window. Preserve `run_count`, `citation_count`, and `visibility_pct` together. Zero citations across zero completed runs is unavailable, not 0% visibility. Do not average prompt percentages without weighting by their denominators, and do not merge engine, locale, or time windows silently.

Sentiment uses its own returned total. Show positive, neutral, negative, and total together; missing sentiment does not inherit the citation denominator. Citation share, brand mention rate, and referral traffic are distinct measurements and must never be presented as one GEO score.

## Query-set governance

The tracked query set is a revisioned measurement instrument. Preserve stable prompt ids, exact wording, intent, topic, locale, source, active state, tags, creation time, and last-run time. Changing wording changes the instrument and breaks a clean longitudinal comparison; update deliberately, disclose the break, and keep the prior window separate.

## Completion truth

Report query-set revision/scope, covered engines, completed versus expected runs, observation window, evidence freshness and completeness, exact denominators, worst-performing prompts by name, and limitations. Never imply that a content recommendation improved visibility until a later comparable probe shows it.

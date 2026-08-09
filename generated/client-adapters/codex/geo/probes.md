# GEO probes

## New observations versus recomputation

Use `visibility.probe.start` to obtain new engine answers for active prompts. Use `visibility.refresh` to recompute aggregates from observations already present. A refresh cannot discover a citation the engines were never asked to produce, and a probe should not be spent merely to recalculate a dashboard.

Before a new probe, read tracked-prompt status, active count, query-set scope, last probe time, and exact current capability contract. State engines, locales, expected run count, cost, and approval boundary. Use only engines the installed runtime reports as active; an enum accepted by a schema is not proof that a provider is supported or configured.

After start, preserve the batch id. Poll status or today's run ledger without launching another batch. Completion means expected and completed terminal runs reconcile, or the provider returns an explicit bounded/partial terminal state. Read per-prompt results and metrics only after that. A queued, inflight, or partially completed batch is not a new baseline.

## Evidence and recommendations

For every reported prompt retain prompt id and text, engine, locale, run time, whether the brand was mentioned, whether it was cited, cited domains, sentiment when available, and source evidence. Rank opportunities by meaningful weak demand, competitor citation gap, evidence freshness, and a plausible page-level intervention, not by the aggregate score alone.

Never attribute a citation to an engine that was not queried. Never infer absence from a failed run. Preserve provider-bounded, stale, truncated, and empty states exactly and continue pagination when the question requires complete coverage.

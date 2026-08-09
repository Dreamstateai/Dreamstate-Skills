# Measurement and provenance

## Outreach activity and credits

Use `outreach.activity_list` as a paginated event ledger, not an aggregate. Preserve campaign/contact filters, action type, completion state, time window, cursor, source timestamp, and completeness; never hand-count one page into a rate. Use `outreach.credit_usage_get` for the canonical outreach credit snapshot. Keep consumed, remaining, and limit values tied to the returned observation time and never infer spend from activity count.

## Every rate is a fraction

Report numerator, denominator, and eligibility rule with every rate. A reply rate may mean replies divided by delivered messages, sent messages, or contacted people; a conversion rate may mean converted sessions, users, accounts, or opportunities. Use the capability's returned definition. Never choose a denominator from habit.

Show exclusions that change eligibility: bounces, suppressed recipients, internal traffic, bots, duplicate identities, null attribution, incomplete runs, or provider-bounded rows. Zero numerator over zero denominator is unavailable, never 0%. When two surfaces define a metric differently, report them separately rather than averaging or ranking them.

## Comparable windows

Compare adjacent equal-length windows unless the user explicitly chooses another baseline. Preserve timezone, inclusive/exclusive bounds, filters, entity scope, and completeness. A percent change from zero has no finite denominator; report the absolute change and the baseline of zero. For small denominators, show counts and avoid causal language even when the rate moved sharply.

## Attribution provenance

Every attributed outcome carries the attribution model, lookback window, identity grain, source system, observation time, ingestion time, and unattributed share. First-touch, last-touch, and modeled attribution answer different questions. Do not combine them into one funnel or claim a channel caused an outcome merely because it received credit.

Preserve stable workspace, account, campaign, workflow, post, provider, and run identifiers. A dashboard label is not identity. When a provider returns partial, delayed, sampled, thresholded, or nullable data, keep that state visible beside the number and lower confidence accordingly.

## Recommendation contract

State the observation, denominator, comparator, plausible explanation, alternative explanation, confidence, and next measurement. Recommendations specify what metric would change first if the diagnosis is correct and when to check it. Analytics observes and recommends; it does not quietly rewrite strategy or launch the suggested action.

# Search evidence

## Search Console first principles

Check connection state before asking for data the provider can answer. A disconnected, expired, or unbound property is a typed blocker, not permission to estimate. Once connected, use the exact selected property and date window in every reported metric.

For current-versus-previous claims, use adjacent windows of equal length and preserve query, page, country, device, clicks, impressions, CTR, and average position as returned. CTR denominator is impressions. It is invalid to compare CTR values without also showing impressions, because a large swing on a tiny denominator is weak evidence. Average position is an impression-weighted observation, not a fixed rank held all day.

Do not blend Search Console rows with a SERP snapshot as one metric. Search Console is property performance aggregated over a window; a SERP snapshot is one observed result set for a query and locale. Use both when useful, label them separately, and never use a snapshot to fabricate historical movement.

## Prioritization

Favor queries where intent matches the conversion, evidence is current, the site already has impressions, and a specific page can own the answer. Striking-distance positions can be efficient, but only when the page satisfies intent and impressions provide a meaningful denominator. Net-new topics may still be valuable; label volume and outcome assumptions instead of laundering them into observed data.

Every recommendation should state the evidence, assumption, expected mechanism, leading indicator, and review date. For example, a title rewrite is expected to affect qualified impressions and CTR before conversion, while an indexability fix should first affect valid indexed coverage.

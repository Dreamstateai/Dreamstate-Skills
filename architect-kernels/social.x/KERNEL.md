# X social intelligence
<!-- architect-operation-contract
{"required_capability_ids":["brain.content.search","social.accounts_list"]}
-->

Own X-specific research and authored-draft decisions under the Social parent: punchy voice, weighted length, thread shape, opportunities, and truthful recent-versus-archive coverage. Social owns shared artifact persistence and outward lifecycle. A coverage or entitlement question stays here; provider connection setup or repair belongs to `workspace`.

Use `x.posts.search` through the official API source contract. Recent search covers at most seven days. Full archive is available only when the configured entitlement explicitly supports it. Cached canonical X rows may provide older database results, but cached history is not proof of live full-archive entitlement.

When the request supplies a topic or query and time window, ranking and output format choices are optional, not blockers. Execute the read with transparent defaults, disclose those defaults, and preserve nullable metrics. Ask only for truly required missing inputs from the selected live contract.

Preserve post id, URL aliases, author identity, source scope, observed time, rights policy, and nullable metric availability. Likes, replies, reposts, and quotes may be available; impressions and bookmarks can be entitlement-gated or provider-dependent. Missing is never zero. Generic web discovery may identify an X URL but cannot supply structured metrics.

A single authored X post respects a weighted character limit, not a plain length count: ASCII characters count as 1 each, URLs always count as 23 regardless of actual length, and emoji, CJK, and other non-ASCII characters count as 2 each (twitter-text rules). The limit itself depends on the account: 280 weighted characters on a free account, 25,000 on a Premium (Blue) account. Count the drafted body against the weighted rule for the account's actual tier before proposing it, not a flat 280. When the content does not fit, say so and cut it down, or thread it explicitly with each part numbered and individually within the limit. Never propose an over-length single post, and never silently truncate one.

Draft in the account's learned social voice: punchy, specific, and opinionated without manufacturing a stance. Product-document voice is only a disclosed fallback. Prepare account tier and evidence, compose and weighted-count internally, save and read back the artifact, and rewrite the current artifact in place on corrections.

For analysis, use governed content reads, comparisons, benchmarks when privacy release allows, and bounded graph neighborhoods. Keep inference distinct from observation. For table handoff, return canonical rows and provider/run state. For drafting, scheduling, replying, or publishing, prepare a reviewable artifact and require explicit approval immediately before the external operation; revalidate account and entitlement after approval.

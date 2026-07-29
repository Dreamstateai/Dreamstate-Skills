# X social intelligence
<!-- architect-operation-contract
{"required_capability_ids":["brain.content.search","social.accounts_list"]}
-->

Own X-specific content research, analysis, publishing context, opportunities, and recent-versus-full-archive coverage under the Social parent. A coverage or entitlement question about X research stays here; route to Integrations only when the requested outcome is connection setup or repair.

Use `x.posts.search` through the official API source contract. Recent search covers at most seven days. Full archive is available only when the configured entitlement explicitly supports it. Cached canonical X rows may provide older database results, but cached history is not proof of live full-archive entitlement.

When the request supplies a topic or query and time window, ranking and output format choices are optional, not blockers. Execute the read with transparent defaults, disclose those defaults, and preserve nullable metrics. Ask only for truly required missing inputs from the selected live contract.

Preserve post id, URL aliases, author identity, source scope, observed time, rights policy, and nullable metric availability. Likes, replies, reposts, and quotes may be available; impressions and bookmarks can be entitlement-gated or provider-dependent. Missing is never zero. Generic web discovery may identify an X URL but cannot supply structured metrics.

A single authored X post respects the 280-character limit. Count the drafted body before proposing it. When the content does not fit, say so and cut it down, or thread it explicitly with each part numbered and individually within the limit. Never propose an over-length single post, and never silently truncate one.

For analysis, use governed content reads, comparisons, benchmarks when privacy release allows, and bounded graph neighborhoods. Keep inference distinct from observation. For table handoff, return canonical rows and provider/run state. For drafting, scheduling, replying, or publishing, prepare a reviewable artifact and require explicit approval immediately before the external operation; revalidate account and entitlement after approval.

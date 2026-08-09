# LinkedIn social intelligence
<!-- architect-operation-contract
{"required_capability_ids":["brain.content.search","social.accounts_list"]}
-->

Own LinkedIn-specific research and authored-draft decisions under the Social parent: insight-led voice, CTA, hook, format, connected-account evidence, and truthful metrics. Social owns the shared artifact save/review/schedule/publish lifecycle; Workspace owns provider setup and repair.

Use `linkedin.posts.search` only through its live native source contract. Search is limited to supported connected-account content through Unipile; never claim global LinkedIn post search or access from merely loading this skill. If no eligible workspace account is connected, report `disconnected` or the returned unavailable state and keep cached canonical rows usable.

Preserve LinkedIn post id, URL aliases, author identity, source scope, observed time, rights policy, and nullable metric availability. Reactions and comments may be available while likes, views, impressions, reposts, or bookmarks remain provider-dependent or unavailable. Missing is never zero. Generic web results may discover URLs only.

Every authored LinkedIn post ends with a call to action. This is a hard rule, not a stylistic preference. A draft whose closing line does not ask the reader to do something is incomplete: finish it before proposing it, and never save or publish a LinkedIn post without one.

Draft in the account's current learned social voice, with insight depth and a real author-held point of view. Product-document voice is only a disclosed fallback when the social profile is absent or stale. Prepare the exact account and evidence, compose internally, save and read back the artifact, and treat a correction as an in-place revision rather than a second post.

For analysis, use governed content reads, pattern comparisons, and bounded graph neighborhoods. Keep claims inferential and cited. For table handoff, return canonical content rows plus source/run state. For drafting, scheduling, commenting, or publishing, fetch the current capability and account binding, prepare a reviewable artifact, then require explicit user approval before any external write. Never publish or reply from research evidence alone.

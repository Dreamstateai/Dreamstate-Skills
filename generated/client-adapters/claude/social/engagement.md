# Engagement: replies, opportunities, the LinkedIn inbox

Depth for what happens after a post exists: forum threads worth joining, replying to comments, and reading the LinkedIn notification inbox. Read `hooks.md` and the relevant platform file before drafting any reply text; a reply is still a piece of authored content.

## Engagement opportunities are bookmarking, not posting

An engagement opportunity is a third-party thread (Reddit, Quora, Hacker News, IndieHackers-style forums) that a discovery pipeline has already surfaced as relevant. Listing and counting opportunities, and moving one between `new`, `engaged`, `skipped` or `archived`, is local bookkeeping only: it never posts anything by itself, and it never invents a thread that discovery did not actually surface. Treat `status_set` as a tracking action for the user's own workflow, separate from deciding to reply. When ranking or counting opportunities, weight by how often a thread has been seen, and disclose that weighting rather than presenting a raw count as importance.

## Comment-publish capabilities are platform-specific, not generic

The LinkedIn comment-publish capability and the Reddit comment-publish capability are separate and each reaches only its own platform: there is no equivalent for X in this package. Neither has a built-in approval gate, so proposing the exact reply text and getting the user's explicit approval before the call is this skill's responsibility, not a system guarantee. A reply is irreversible once posted, exactly like an outward post: there is no undo capability, only a follow-up reply acknowledging a correction. On Reddit, the reddit.md self-promotion and subreddit-rules discipline applies to every reply exactly as it applies to an authored post; a reply that would violate a subreddit's self-promotion rule is not fixed by moving the pitch into a comment.

## The LinkedIn notification inbox is a separate read surface

Subscribing an account turns on notification delivery going forward; it does not retroactively fetch anything that already happened. Pulling actively fetches new notifications from the provider into the local store, and only after a pull will listing return them; do not list and report "no new mentions" without first confirming a recent pull, or the answer may simply be stale rather than true. Listing scoped to one delivery or post is the right read when the request is about reactions to a specific post rather than the account's whole inbox. Unsubscribing stops delivery for that account; state plainly when notifications will stop rather than implying anything already delivered is also gone.

## Repeat engagers are a different signal than opportunities

A contact who has engaged some number of times within a window is a superfan or repeat-touch signal, not a forum thread to reply to. Use it to answer "who already engages with us regularly," not to answer "where should we join a conversation." Do not conflate the two: an opportunities count and a repeat-engagers count are answering different questions even when both show up in the same performance conversation.

# Drafting

## Structure that serves a reader and a generative engine

Every heading answers a question in its first one to two sentences, in a form that could be lifted whole into a generated answer: the direct claim first, the elaboration and nuance after. A heading that opens with throat-clearing before the answer serves neither a skimming human nor an LLM looking for a quotable sentence.

For a GEO/AEO-track brief (see briefs.md), each major claim needs a concrete statistic or named specific and an inline citation to where it came from. "Businesses that do X see better results" is not citable; "a 2026 workspace audit of 40 accounts found X correlated with a 12-point lift" is. Coordinate the query cluster and competing-URL landscape with the `geo` and `research` briefs already established; do not re-run that research, just write to it.

For a classic-SEO-track brief, the target query and its close variants belong in the title, the first H1/H2, and at least one subheading, stated the way a person searching would phrase it, not stuffed. Keyword density is not a target; matching how the target reader actually asks the question is.

## The utility test

Before finishing a draft, ask: would this page still be worth reading if search engines and generative answers did not exist? If someone bookmarked it and came back in six months, would it still hold up? A page that only exists to rank, with nothing a person would want on its own terms, fails the test and should be rebuilt around a real reader outcome, not padded.

## Opening construction

The opening sentence should do one job: make the intended reader recognize their own situation or create a specific, provable curiosity gap, not a vague one. "Here's how to improve your onboarding" is weak; a concrete outcome can be strong only when grounded. If you cannot source a number from exact workspace context, bounded evidence, or a successful packet supplied by `research`, do not write it. Drop the specificity rather than inventing it.

Run every emotionally-loaded opening line through this before keeping it:
1. Is it true, and can you point to the source?
2. Would you say it this way out loud to someone in the industry?
3. Is the intensity of the claim proportional to what is actually being said?
4. Does it serve the reader's understanding, or only serve getting them to keep reading?

An opening that fails any of these reads as manipulative once the reader gets past it, and undercuts the rest of the piece even if the body is accurate.

## Scaled or templated pages

If the brief describes one of several similar pages (a comparison series, a per-segment resource page, a per-location page), keep the section structure and item counts consistent across the set, and generate the title from a deterministic template rather than letting the model phrase each one freely; consistent, predictable titles outperform freely-generated ones at scale and make the set auditable. Vary the substance per page using the real niche or segment facts from the brief and grounding pass, never by swapping one noun into an otherwise identical page. A page that only differs by a proper noun fails the utility test above.

## Assets

Three distinct capabilities, used for three distinct situations:
- `content.article_asset_upload`: new file bytes from the user or the model, staged, then immediately registered.
- `content.article_asset_register`: finalizes an asset that was already staged (`staging_id` plus the expected checksum). Use this to complete a two-step upload, not as a way to attach an asset you have not actually staged.
- `content.article_asset_import`: fetches an image from a remote URL; this is the only asset path that reaches the network, and it is async, so a returned graph effect may still be queued when the call returns; do not assume the asset is ready without checking.

## Live span rewrite

`content.article_selection_edit` rewrites one selected span of the draft; it is a generation call, not persistence. After using it, the rewritten span still has to be saved with `content.article_update` using the article's current revision, or the rewrite is lost when the session ends.

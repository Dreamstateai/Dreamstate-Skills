# Revision and voice

## Match the workspace's existing voice

Before writing a first sentence, read 3-5 recently published pieces via `brain.content.search` then `brain.content.get`. Note: sentence length (short and declarative, or long and layered), person (first person "we," second person "you," or third person about the company), contraction use, and how existing pieces close (a direct CTA, a question, a plain stop). Write the new piece to match, not to whatever reads best in isolation. A workspace with five pieces in a clipped, second-person voice does not need a sixth piece in a formal third-person register, even if that sixth piece is well written on its own.

## Banned patterns, and what to write instead

- No em dashes, anywhere, in any draft, in any revision. Replace with a comma, a colon, a parenthetical, or split into two sentences.
- No "in today's fast-paced world," "in this day and age," or any variant that states the obvious as a throat-clearing opener. Cut it; start with the actual claim.
- No "it is important to note that," "it's worth mentioning," or similar hedge-and-announce phrasing. If it is worth saying, say it directly.
- No tricolon padding used as a crutch: "not just X, but Y and Z" or "X, Y, and Z" where Y and Z add no new information beyond X, just rhythm. Cut to the one true claim, or make Y and Z each carry distinct, real content.
- No closing paragraph that restates the intro in different words. End on the last real point, a concrete next step, or a genuine implication, not a summary of what was just read.
- No unearned superlatives ("revolutionary," "game-changing," "unprecedented") attached to a claim that has no evidence behind it. If the evidence supports the intensity, state the evidence instead of the adjective.

## The revision loop

1. Run the draft against the banned-pattern list above and the voice notes from the grounding pass. Fix in place; do not just flag issues for later.
2. Re-check every factual sentence against its tracked source (briefs.md). A sentence with no traceable source at this point gets cut or flagged `insufficient_evidence`, not smoothed over.
3. Persist with `content.article_update`, passing the article's current `expected_revision`. A stale revision throws `article_revision_conflict`; re-fetch with `content.article_get` and reapply the edit rather than retrying blind.
4. Only after the draft passes the checklist and the fact check, move to `content.submit_review` (see publishing.md).

"Rewrite," "try a different angle," "fix this claim," and other corrections to a monitor-backed article mean update the existing article unless the user explicitly asks for a separate piece. Read its exact current revision, preserve stable identity and unaffected metadata, apply the change, save with `content.article_update`, and read it back. Do not call create or duplicate merely to avoid revision handling: that leaves stale drafts visible and breaks review history.

## Landing copy specifics

Landing copy earns its keep on a single reader action, not on reading well in isolation. Every section should either build the case for that action or remove a reason not to take it; a section that does neither is padding, even if it is well written. State the target conversion from the brief explicitly before drafting, and check each section against it during revision.

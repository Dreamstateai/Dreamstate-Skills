# Message copy

## The fixed scaffold pattern, in detail

The scaffold owns structure: greeting, each pitch paragraph, the CTA sentence, the sign-off, and every paragraph break. The model only ever fills bounded personalization slots inside that structure (the prospect's name, their niche, a specific trigger fact, a proof point). This is enforced by never letting a generation call rewrite the skeleton, only the slot values. If a draft looks like the model invented its own opening line, paragraph order, or sign-off, that is a defect: reject it and regenerate the slots against the same scaffold, don't accept a structurally novel message because the words read well.

Two ways a step carries copy, and a step must use one of them or it fails validation:
- Literal copy: `body_template` (email/LinkedIn) or `note_template` (connection request), written once and reused for every enrolled row with variables substituted.
- `ai_write`: `prompt` (required, non-empty), optional `mode: "autonomous"`, `variant_axis` (`angle` or `opener`), `framework_id`, `template_id`, `context_docs` (up to 4, only from `product`/`competitors`/`voice`/`strategy`, nothing else), `auto_promote_winner`. The message is composed at send time from this prompt, so there is nothing to literally read back until it runs; that is expected, not a gap to fill with a fabricated example.

## Generation capabilities and what each is actually for

- `outreach.ai_write_generate` / `outreach.ai_write_resolve`: produce or resolve the slot-filled message inside the fixed scaffold. Use `ai_write_resolve` when you need to see what an `ai_write`-configured step would actually send for a specific row, which is what a real-row preview needs.
- `outreach.opener_styles_list` / `outreach.opener_sample_generate`: the opener owns paragraph 1's structure and, when a trigger signal exists, instructs the model to open on it. Pick a style from the live list, never invent an opener id.
- `outreach.personalization_generate`: rewrites user-authored copy (not the framework's own scaffold) into a bounded message, current limit under 250 characters. Use this only for user-owned copy, not for the framework's fixed paragraphs.
- `outreach.ai_spintax_generate`: produces spintax variation for A/B copy. It must not touch `{{merge}}` personalization tokens; spintax and merge fields are different mechanisms and do not nest.

## Variable resolution has no partial-credit state

Every personalization variable maps to exactly one upstream source: a row attribute or relation (via `rows.get`/`rows.query`), or an AI-derived value tied to a specific prompt reference. There is no "leave it blank and hope" path. If a variable cannot be resolved for a given row, that is a missing-input case the definition must declare a behavior for (skip the row, use a fallback value, or route to `manual_review`), not something to paper over with a generic phrase. Never display a preview with an unresolved `{{token}}` still in it; that is not a draft, it is a bug.

## Content rules, non-negotiable

- No "reaching out", "hope this finds you well", "just wanted to", or any other opener that reads as templated mail-merge filler.
- Subject lines: 3-6 words, lowercase, no dashes.
- Exactly one CTA per message. Two asks in one message reads as desperate and halves the response rate on both.
- Every message needs a personalized hook that proves you actually looked at this specific prospect, not their segment.

## Correcting existing drafts edits in place

When the user corrects a fact in copy that has already been generated (wrong price, wrong feature name, wrong CTA), regenerate the slots for the existing draft set with the correction folded in. Do not generate a fresh batch and leave the old one on screen next to it: that produces two conflicting versions of the same message and the user has to guess which one is current.

## Ground claims, don't assert them

Any factual claim in copy about the workspace, the product, or the prospect's company needs a citation: a `brain.context.search`/`brain.context.get` claim, or a row-level fact from `rows.get`/`rows.query`. User conversation text alone is not canonical brand truth; if the user states a fact in chat that should end up in copy, verify it against the workspace wiki before treating it as ground truth for every future sequence, not just this one message.

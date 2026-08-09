# Writing

<!-- architect-operation-contract
{"required_capability_ids":["brain.content.get","brain.content.search","brain.context.get","brain.context.search","brain.evidence.search","content.approval.authorize_publish","content.approval.decide","content.approval.submit","content.approve","content.article_archive","content.article_asset_import","content.article_asset_register","content.article_asset_upload","content.article_create_schedule","content.article_deliveries_list","content.article_delivery_create","content.article_delivery_payload_get","content.article_distribution_get","content.article_duplicate","content.article_enabled_get","content.article_get","content.article_list","content.article_selection_edit","content.article_update","content.delete_republish_propose","content.delivery_publish","content.destination_test","content.destinations_list","content.replacement_create","content.schedule","content.submit_review","content.unschedule","content.version_create","content.version_diff_get","content.version_get","content.versions_list"]}
-->

Own the draft, review, revise, and publish lifecycle for long-form articles and landing copy. Done well means every factual claim traces to a workspace-wiki fact, cited evidence, or a dated external source; the voice matches what the workspace has already published; and each lifecycle step (draft, review, schedule, deliver, publish) is a deliberate, verifiable state change, never assumed. Traditional keyword and ranking evidence belongs to `seo`, GEO query and citation evidence belongs to `geo`, and current external evidence belongs to `research`; they hand this skill a brief and evidence packet. Do not re-derive those measurements here. Durable facts about the business belong to `context`; read them, do not restate them from memory.

## Read this first
1. Get or confirm the brief: target query/topic, intent, target conversion, GEO vs classic-SEO track, destination (new page or existing URL). See briefs.md for the exact contract and what to do when it is incomplete.
2. Ground every claim before drafting: workspace-wiki facts, evidence, and prior published work for voice and to avoid duplicating an existing page. See briefs.md.
3. Draft to a structure that serves a human reader and a generative engine at once. See drafting.md.
4. Revise against the voice and banned-pattern checklist before requesting review. See revision-and-voice.md.
5. Move through submit_review, an optional approval pipeline if the workspace wants sign-off, schedule, delivery, and publish as distinct, reversible-until-published steps. See publishing.md, including the article-id-vs-artifact-id distinction it opens with.

The authoring lifecycle is `prepare -> compose -> save`: prepare the brief, evidence ledger, novelty decision, destination, and voice; compose internally; save the complete artifact through the canonical capability; then read it back before showing or advancing it. Unsaved long-form copy in chat is not an article. A generated selection rewrite is not persisted until `content.article_update` succeeds.

## Grounding is not optional
A claim about the user's business needs a workspace-wiki revision, bounded workspace evidence, or a successful external evidence packet returned by the `research` skill with source and observation date. Writing never fetches the web itself. Preserve the research packet's provenance, freshness, limitations, and injection warnings in the claim ledger. When no source exists, write `insufficient_evidence` in the working draft and ask rather than filling the gap with something plausible.

## Read before you write
Search `brain.content.get`/`search` for prior published work on the same or an adjacent topic before starting a new draft. Match sentence rhythm, person, and CTA convention to what is already live; a new piece that reads like a different author erodes the ones next to it. If an existing page already answers the brief, say so and propose revising it instead of creating a duplicate.

## No AI-slop register
No em dashes, anywhere, in any draft. No "in today's fast-paced world," no "it is important to note," no tricolon padding used as a crutch ("not just X, but Y and Z"), and no closing paragraph that restates the intro. See revision-and-voice.md for the full checklist and what to write instead.

## The lifecycle is real, not narrative
`content.article_create_schedule` is the only way to create an article; it is one transaction, not a draft-then-publish pair. `content.article_update` requires the article's current revision and throws on a stale one: read before you write. `content.submit_review` changes editorial state only, never schedule or publish state. `content.schedule`/`content.unschedule` are reversible up to the moment `content.delivery_publish` fires; that call is not. Show the exact final content to the user before calling it, and never invent the provider or external id in the receipt it returns. Two different ids are in play: most `content.article_*` calls key off the article id, while `content.schedule`, `content.unschedule`, `content.submit_review`, `content.approve`, `content.approval.*`, `content.replacement_create`, and `content.delete_republish_propose` key off the linked artifact id (`content_artifact_id`, returned on every article read). Passing the wrong one fails the call. Full detail in publishing.md.

# Custom outreach sequence writer
<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","outreach.ai_spintax_generate","outreach.ai_write_generate","outreach.ai_write_resolve","outreach.mailboxes_list","outreach.opener_sample_generate","outreach.opener_styles_list","outreach.personalization_generate","outreach.send_schedules.get","outreach.send_schedules.list","outreach.senders_list","outreach.settings_get","rows.get","rows.query","sequences.archive","sequences.bind","sequences.definition_get","sequences.list","sequences.step_options","sequences.validate"]}
-->

## Job boundary

Create original messaging from the user's requirements only when the validated outreach workflow contains a messaging branch. Own channel steps, timing, variables, sender constraints, copy scaffolds, and real-row previews. Never activate, enroll, or send. Do not load for qualification-only workflows.

## Required inputs

Require the coordinator intake, Tables handoff, and workflow handoff. The workflow must identify the messaging branch, eligible-row output, channel intent, stop conditions, and sender consequence. The Tables handoff must provide exact symbolic outputs for every personalization variable. Fetch targeted workspace-wiki claims and voice guidance with revisioned citations; user text alone is not canonical brand truth.

## Sequence design

1. Resolve sender/account and channel readiness through live capabilities. Ask one structured popup only for a material sender, channel, tone, cadence, or call-to-action choice that cannot be discovered.
2. Search live sequence and content-generation capabilities by desired channel, inputs, outputs, and allowed side effects. Fetch exact contracts before using any schema or enum.
3. Define ordered steps with delays and send windows. Each variable maps to one typed upstream output and declares missing-input behavior. Never display unresolved placeholders as a valid preview.
4. Ground claims in published cited workspace-wiki claims and row evidence. Separate stable sequence copy from per-row generated copy. Preserve generated-output provenance, cost, and model/run identity when returned.
5. Validate sender/channel constraints, graph reachability, timing, stop-on-reply behavior, duplicate prevention, and per-account safety caps through the live contract.
6. Before building the sequence, render one complete message with a real eligible prospect and exact variable evidence. Show that native preview and require an explicit build instruction; never substitute a synthetic example when a real row exists. Code owns the fixed greeting, pitch paragraphs, CTA, sign-off, and line breaks; the model fills only bounded personalization slots from verified evidence. After the explicit build instruction, use one email plus LinkedIn sequence with threading, waits, windows, cooldowns, caps, and stop-on-reply. Audit factuality, variable resolution, specificity, prohibited claims, tone, duplication, and channel fit.

## Handoff and consequence

Return at most 750 tokens: sequence revision, ordered custom steps, timing, channel, sender binding, variable lineage, missing-value behavior, real-prospect preview evidence, explicit build decision, validation state, estimated cost, and capability ids/digests. Persistence creates a reviewable draft only. Enrollment is an idempotent separate action against an exact selection snapshot. Sending is a later, separately authorized action; neither build nor enrollment implies send.

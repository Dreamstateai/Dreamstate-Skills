# Sequences

<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","outreach.ai_spintax_generate","outreach.ai_write_generate","outreach.ai_write_resolve","outreach.dm_conversation_by_contact_get","outreach.dm_conversation_get","outreach.dm_conversation_read","outreach.dm_conversation_status_update","outreach.dm_conversations_list","outreach.dm_message_send","outreach.mailboxes_list","outreach.opener_sample_generate","outreach.opener_styles_list","outreach.personalization_generate","outreach.send_schedules.get","outreach.send_schedules.list","outreach.senders_list","outreach.settings_get","rows.get","rows.query","sequences.archive","sequences.bind","sequences.definition_get","sequences.delete","sequences.enrollment_owner_clear","sequences.list","sequences.step_options","sequences.validate"]}
-->

Own everything that happens to qualified rows after a workbook has produced them: the sequence definition (email and LinkedIn steps in one sequence), timing, sending windows, sender binding, message copy quality, and the real-row preview shown before a build. Done well means a `sequence_version` that passes `sequences.validate` clean, previews correctly against one real qualified row with every variable resolved, and states plainly what still has to happen before anyone is contacted. This skill authors and validates draft definitions only. It does not enroll, publish, or activate a send: `sequences.publish`, `sequences.enroll_selection`, `sequences.orchestrate_selection_enrollment`, and workflow activation are not in this capability set and belong to whichever skill coordinates launch.

## Read this first

1. Read sender and channel readiness before drafting anything: `outreach.senders_list`, `outreach.mailboxes_list`, `outreach.settings_get` (live daily caps plus today's usage), `outreach.send_schedules.get`/`.list`. See deliverability-and-caps.md.
2. Fetch the exact step contract with `sequences.step_options` before writing a step. Never assume a step kind, action, or field name from memory. See steps-and-timing.md.
3. Resolve every personalization slot to one upstream row output (`rows.get`/`rows.query`) or a cited `brain.context.search`/`brain.context.get` claim. See message-copy.md.
4. Draft the definition, call `sequences.validate`, fix every reported issue, then call `sequences.bind` to persist the draft version. See enrollment.md for exactly what `bind` does and does not do.
5. Before proposing a build, render one full step against a real qualified row with the fixed scaffold intact, not a synthetic example. See message-copy.md.
6. Treat `sequences.list`, `sequences.definition_get`, `sequences.archive`, `sequences.delete`, `sequences.enrollment_owner_clear` as separate, explicit, single-target actions, never a batch pattern. See enrollment.md.
7. Suppression, cooldowns, and reply-triggered stops on the sequence itself are enforced automatically below this skill. Reading and answering an actual reply is a separate, in-scope conversation action, not a sequence-definition edit. See replies.md.

## The fixed scaffold is not optional

The greeting, pitch paragraphs, CTA, sign-off, and paragraph breaks are owned by the scaffold, not by the model. `outreach.ai_write_generate` only fills short personalized slots (name, niche, a trigger fact) inside that scaffold. Never regenerate the skeleton itself and never present a message where the model wrote the structure. A sequence step needs literal `body_template`/`note_template` copy or a configured `ai_write` block with a non-empty prompt; a step with neither fails validation.

## No rehearsal, one real preview

None of this skill's write capabilities (`sequences.bind`, `.archive`, `.delete`, `.enrollment_owner_clear`) support a dry run. There is no sandbox copy to throw away. The one substitute for rehearsal is the real-row preview in step 5: assemble the actual message with actual row data and put it in front of the user before calling `sequences.bind`. A preview built from placeholder or invented prospect data is not a preview.

## Never invent what you cannot verify

Only the capability ids in this kernel's contract exist. Never invent a step kind, LinkedIn action, or schedule field: read `sequences.step_options` and the definition schema live. If a required input, a sender's readiness, or a cap value cannot be confirmed through a capability read, say so and stop rather than assuming a default.

## One target, never a pattern

`sequences.archive`, `sequences.delete`, and `sequences.enrollment_owner_clear` each take one exact `sequence_id`. Confirm the target with `sequences.definition_get` first when the user named it by description rather than id. `sequences.delete` is irreversible; never delete on a fuzzy match.

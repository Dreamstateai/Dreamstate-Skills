---
name: hook-writer
description: "Write a personalized opening line for each row in a Dreamstate list and save it back as a column, ready to drop into a sequence. Use whenever the user wants 'personalized openers', 'first lines', 'icebreakers', to personalize a campaign at scale, or to draft the hook for each lead. Stage 4 of the pipeline: it crafts copy per row, it does not send. You bring the voice and the angle; Dreamstate drafts against the contact's real data and stores the result."
---

# Hook Writer

The opener decides whether the rest of the sequence gets read. A good one is short,
specific to the prospect, and about them, not you. This stage writes one per row and saves
it on the table so the sequence builder (or the user) can use it. You set the angle and
the voice; Dreamstate drafts against each contact's real, enriched data.

Run `/connect` first if unsure. Works best after `/enrich-list` and `/lead-prioritizer`,
so you write openers for real, ranked people.

## Step 1: Pick the framework and voice

Openers have shapes. Read the available ones with `outreach_get_step_options` (it returns
opener `framework_id`s like `post_reference` and the campaign's variable tokens). With the
user, settle on:

- The angle: what about *this* prospect you lead with (a recent post, a hire, a shared
  connection, a pain their role owns).
- The voice: register and length. Short and human beats clever and long.
- One disqualifier: never reference something you cannot verify from the data.

## Step 2: Draft against each row

For each contact (do the top tier first if the list is scored), pull their detail with
`outreach_get_contact`, then call `outreach_draft_message`:

- Pass an opener `framework_id` from step options.
- Pass the `campaign_id` if one exists, so the draft uses the campaign's messaging config
  and variable tokens.

The tool drafts; it does not send. If a draft references a field the contact does not
have, fall back to a safer angle for that row rather than shipping a broken merge.

## Step 3: Save the opener on the row

Add an `opener` column once with `outreach_add_column` (`kind: "freeform"`), then write
each contact's line with `outreach_set_cell` (`column_key: "opener"`). Now the
personalization lives on the table, not in this chat, so `/sequence-builder` and the user
can both use it.

## Step 4: Calibrate before scaling

Show the user the first 3-5 openers and adjust the angle or voice before you write the
rest. These go out as the user, in their name, so the voice has to be theirs. Once they
approve the style, finish the batch and report how many rows now have an opener, noting
any you softened for missing data.

---
name: hook-writer
description: "Write a personalized opening line for each row in a Dreamstate list and save it back as a column, ready to drop into a sequence. Use whenever the user wants 'personalized openers', 'first lines', 'icebreakers', to personalize a campaign at scale, or to draft the hook for each lead. Stage 4 of the pipeline: it crafts copy per row, it does not send. You bring the voice and the angle; Dreamstate drafts against the contact's real data and stores the result."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: outreach
tier: composite
tools_used: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_tools_run, dreamstate_get_run]
capability_ids: [tables.list, contacts.list, contacts.get, rows.query, sequences.step_options, contacts.draft_opener, columns.add, cells.settle]
---

# Hook Writer

The opener decides whether the rest of the sequence gets read. A good one is short,
specific to the prospect, and about them, not you. This stage writes one per row and saves
it on the table so the sequence builder (or the user) can use it. You set the angle and
the voice; Dreamstate drafts against each contact's real, enriched data.

Run `/connect` first if unsure. Works best after `/enrich-list` and `/lead-prioritizer`,
so you write openers for real, ranked people.

The dotted names below are canonical capability IDs. Inspect their live contracts with
`dreamstate_tools_get`, invoke them with `dreamstate_tools_run`, and follow asynchronous work
with `dreamstate_get_run`.

## Step 1: Pick the framework and voice

Openers have shapes. Read the available ones with `sequences.step_options` (it returns
opener `framework_id`s like `post_reference` and the campaign's variable tokens). With the
user, settle on:

- The angle: what about *this* prospect you lead with (a recent post, a hire, a shared
  connection, a pain their role owns).
- The voice: register and length. Short and human beats clever and long.
- One disqualifier: never reference something you cannot verify from the data.

## Step 2: Draft against each row

For each contact (do the top tier first if the list is scored), pull their detail with
`contacts.get`, then call `contacts.draft_opener`:

- Pass an opener `framework_id` from step options.
- Pass the `campaign_id` if one exists, so the draft uses the campaign's messaging config
  and variable tokens.

The tool drafts; it does not send. If a draft references a field the contact does not
have, fall back to a safer angle for that row rather than shipping a broken merge.

## Step 3: Save the opener on the row

Add an `opener` column once with `columns.add` (`behavior: "value"`, `value_type: "string"`),
then write each contact's line with `cells.settle`, including its row/column identity and
draft provenance. Now the
personalization lives on the table, not in this chat, so `/sequence-builder` and the user
can both use it.

## Step 4: Calibrate before scaling

Show the user the first 3-5 openers and adjust the angle or voice before you write the
rest. These go out as the user, in their name, so the voice has to be theirs. Once they
approve the style, finish the batch and report how many rows now have an opener, noting
any you softened for missing data.

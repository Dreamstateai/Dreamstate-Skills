---
name: reply-triage
description: "Work the LinkedIn inbox for an outreach campaign end to end: read open conversations, classify each reply by intent, draft and send the right response, and set pipeline status / assignment so nothing slips. Use whenever the user says 'check my replies', 'who responded', 'work my inbox', 'follow up with interested leads', or wants to triage and respond to outreach. You cannot read or send LinkedIn DMs yourself; Dreamstate does, under per-account caps."
---

# Reply Triage

Replies are where outreach turns into pipeline, and where most of it leaks. The job here
is to read every open thread, decide what each one actually is, respond well, and record
the state so the team (or future-you) can trust the inbox. You supply the read of intent
and the reply voice; Dreamstate moves the messages and holds the status.

Run `/connect` first if unsure. You need a healthy LinkedIn account that owns the threads.
If you only want to label the inbox without sending, use `/reply-classifier` instead; this
skill goes all the way through to the response.

The dotted names below are canonical capability IDs. Inspect their live contracts with
`dreamstate_tools_get`, invoke them with `dreamstate_tools_run`, and follow asynchronous work
with `dreamstate_get_run`.

## Step 1: Find the live conversations

List campaigns with `workflows.list` and pick the one the user means (or all active).
Use `outreach.dm_conversations_list` to find open threads, and
`outreach.dm_conversation_get` for each thread's context. Get the sending account evidence
from `social.accounts_list`; the conversation itself remains the authoritative send target.

## Step 2: Classify each reply by intent

For every open thread, read the prospect's actual words and bucket it (interested, not
now, referral, objection, not interested, auto/OOO). Read for meaning, not keywords. State
the bucket and your one-line reasoning to the user before you act on the hot ones. (This is
the same read `/reply-classifier` does; if you ran that first, reuse its labels.)

## Step 3: Respond, set status, assign

For each thread, take the action that matches the intent:

- **Interested / Objection / Referral**: draft a short, specific reply and send it with
  `outreach.dm_message_send` (`conversation_urn`, `body`, and a unique
  `client_request_id`). It enforces the per-account daily DM cap before sending; at
  cap it returns `status: "blocked"` and sends nothing — tell the user and queue the rest
  for tomorrow rather than forcing it.
- **Interested**: also set `outreach.dm_conversation_status_update` to the pipeline status
  the user uses for hot leads, and `outreach.dm_conversation_assign` to the right workspace member so a
  human owns the follow-through.
- **Not now / Not interested**: set the matching status so they drop out of the active
  view. Do not argue with a no.
- **Auto / OOO**: use `outreach.dm_conversation_read` and move on; no reply.

Before sending any reply, show the user the draft for at least the first few threads so
they can calibrate your voice. These go out as them.

## Step 4: Close the loop

Tell the user what you did: counts per bucket, how many replies you sent, how many were
blocked by the daily cap, and which threads are now assigned to whom. Pull
`outreach.workspace_stats_get` so they see reply and acceptance rate in
context. If interested-rate is high but demos are low, the gap is your reply quality or
the handoff, not the top of funnel.

## Package resources

- Read [references/operating-guide.md](references/operating-guide.md) for mode-specific boundaries, evidence rules, and recovery.
- Read [examples/example.md](examples/example.md) before the first execution or recommendation.
- Use [evals/contract.json](evals/contract.json) to check routing, approval, and durable-verification behavior.

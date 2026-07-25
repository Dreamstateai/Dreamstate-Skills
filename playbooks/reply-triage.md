---
name: reply-triage
description: "Work the LinkedIn inbox for an outreach campaign end to end: read open conversations, classify each reply by intent, draft and send the right response, and set pipeline status / assignment so nothing slips. Use whenever the user says 'check my replies', 'who responded', 'work my inbox', 'follow up with interested leads', or wants to triage and respond to outreach. You cannot read or send LinkedIn DMs yourself; Dreamstate does, under per-account caps."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: outreach
tier: composite
tools_used: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_tools_run, dreamstate_get_run]
capability_ids: [campaigns.list, context.threads_list, context.thread_messages, social.accounts_list, context.thread_reply_send, context.thread_set_status, context.thread_assign, context.thread_mark_read, context.analytics_get]
---

# Reply Triage

Replies are where outreach turns into pipeline, and where most of it leaks. The job here
is to read every open thread, decide what each one actually is, respond well, and record
the state so the team (or future-you) can trust the inbox. You supply the read of intent
and the reply voice; Dreamstate moves the messages and holds the status.

Run `/connect` first if unsure. You need a healthy LinkedIn account that owns the threads.
If you only want to label the inbox without sending, use `/reply-classifier` instead; this
skill goes all the way through to the response.

## Step 1: Find the live conversations

List campaigns with `campaigns.list` and pick the one the user means (or all active).
Use `contacts.list` to find contacts with replies / open threads, and
`contacts.get` for the thread context (`conversation_urn`, last messages). Get the
sending `account_id` from `social.accounts_list` — `context.thread_reply_send` requires the
account that owns the thread.

## Step 2: Classify each reply by intent

For every open thread, read the prospect's actual words and bucket it (interested, not
now, referral, objection, not interested, auto/OOO). Read for meaning, not keywords. State
the bucket and your one-line reasoning to the user before you act on the hot ones. (This is
the same read `/reply-classifier` does; if you ran that first, reuse its labels.)

## Step 3: Respond, set status, assign

For each thread, take the action that matches the intent:

- **Interested / Objection / Referral**: draft a short, specific reply and send it with
  `context.thread_reply_send` (`account_id`, `thread_id` = the `conversation_urn`, `body`, and a
  unique `client_request_id`). It enforces the per-account daily DM cap before sending; at
  cap it returns `status: "blocked"` and sends nothing — tell the user and queue the rest
  for tomorrow rather than forcing it.
- **Interested**: also set `context.thread_set_status` to the pipeline status the user
  uses for hot leads, and `context.thread_assign` to the right workspace member so a
  human owns the follow-through.
- **Not now / Not interested**: set the matching status so they drop out of the active
  view. Do not argue with a no.
- **Auto / OOO**: `context.thread_mark_read` and move on; no reply.

Before sending any reply, show the user the draft for at least the first few threads so
they can calibrate your voice. These go out as them.

## Step 4: Close the loop

Tell the user what you did: counts per bucket, how many replies you sent, how many were
blocked by the daily cap, and which threads are now assigned to whom. Pull
`context.analytics_get` (`metric: "overview"`) so they see reply and acceptance rate in
context. If interested-rate is high but demos are low, the gap is your reply quality or
the handoff, not the top of funnel.

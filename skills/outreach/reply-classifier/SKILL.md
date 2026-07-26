---
name: reply-classifier
description: "Read the open reply threads on a Dreamstate campaign and classify each by intent (interested, not now, referral, objection, not interested, auto/OOO), with a recommended next action, and set pipeline status. Use whenever the user wants to 'classify my replies', 'triage who responded', sort the inbox by intent, or label responses, without sending anything yet. The classify-and-label half of reply handling; pair with /reply-triage to actually respond. You read intent; Dreamstate holds the threads and statuses."
---

# Reply Classifier

Before you answer an inbox you have to read it. This stage goes through every open thread,
decides what each reply actually is, recommends the next action, and records the status,
without sending anything. It is the judgment layer for replies: the read of intent is
yours; Dreamstate moves the labels and holds the pipeline state.

Run `/connect` first if unsure.

The dotted names below are canonical capability IDs. Inspect their live contracts with
`dreamstate_tools_get`, invoke them with `dreamstate_tools_run`, and follow asynchronous work
with `dreamstate_get_run`.

## Step 1: Gather the open threads

List campaigns with `workflows.list` and pick the one the user means (or all active).
Use `outreach.dm_conversations_list` to find open threads, and
`outreach.dm_conversation_get` for each thread's context (`conversation_urn`, last messages).

## Step 2: Classify by meaning, not keywords

For every open thread, read the prospect's actual words and put it in one bucket. Do not
keyword-match; read for intent:

- **Interested** — wants to talk, asks a question, says "tell me more".
- **Not now / later** — open but the timing is wrong.
- **Referral** — points you to someone else.
- **Objection** — answerable pushback (price, fit, "we use X").
- **Not interested** — a clear no.
- **Auto / OOO** — out-of-office or autoresponder, not a human reply.

For each, state the bucket, one line of reasoning, and the recommended next action (reply
now, schedule a nudge, hand to a human, drop). This is what a human would scan.

## Step 3: Record the status

Set each thread's pipeline status with `outreach.dm_conversation_status_update` so the inbox reflects
reality and the same thread is not re-triaged later. For **Auto / OOO** and clear
**Not interested**, use `outreach.dm_conversation_read` and move on. Do not draft or send here;
that is `/reply-triage`'s job.

## Step 4: Report the shape of the inbox

Summarize counts per bucket and call out the hot threads (interested, answerable
objections, referrals) the user should respond to first. Pull `outreach.workspace_stats_get`
so the reply rate is in context. Hand off the live ones to
`/reply-triage` to draft and send the responses under the per-account cap.

## Package resources

- Read [references/operating-guide.md](references/operating-guide.md) for mode-specific boundaries, evidence rules, and recovery.
- Read [examples/example.md](examples/example.md) before the first execution or recommendation.
- Use [evals/contract.json](evals/contract.json) to check routing, approval, and durable-verification behavior.

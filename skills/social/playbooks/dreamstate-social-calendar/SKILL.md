---
name: dreamstate-social-calendar
description: "Plan, draft, and schedule a batch of LinkedIn and X posts through Dreamstate. Use whenever the user wants to 'plan content', 'schedule posts', build a social calendar, fill their content pipeline, batch a week of posts, or keep their LinkedIn/X active. You cannot post to social yourself; Dreamstate generates drafts and publishes/schedules them through the user's connected accounts under per-account daily caps."
---

# Dreamstate Social Calendar

A good calendar is a few strong angles spread across the week in the platform's native
voice, scheduled when the audience is on. You decide the angles and the timing;
Dreamstate writes the drafts and puts them in the queue.

Run `/dreamstate-connect` first if unsure. Confirm there is a healthy connected account
for each platform you plan to post on.

## Step 1: Accounts and cadence

Call `content_list_accounts`. Note the healthy LinkedIn and X `account_id`s. Decide
the cadence with the user (e.g. 3 LinkedIn + 5 X per week) and the posting times. Daily
per-account publish caps apply, so a realistic weekly plan beats an over-stuffed one.

## Step 2: Pick the angles

Get the user to commit to 3-5 themes for the batch (a lesson, a contrarian take, a
customer story, a behind-the-scenes, a useful list). One theme can become one LinkedIn
post and one differently-shaped X post; do not just cross-post the same text. Native
beats duplicated.

## Step 3: Generate drafts

For each planned post, call `content_generate_post`:

- `platform`: `"linkedin"` or `"twitter"`.
- `topic`: the specific angle, not the theme label. Be concrete; vague topics produce
  generic posts.
- `tone`: optional register (e.g. "direct", "warm, first-person").
- `format`: optional shape (e.g. "story", "listicle").

It persists a draft and returns it; it does not send. Generation is capped at ~24s; a
`generation_timeout` saves nothing, so retry with a tighter topic if it trips.

Read each draft back with `content_get_post` and show the user. Edit the angle and
regenerate anything weak before scheduling. The user's name is on these.

## Step 4: Schedule (or publish now)

For each approved draft, schedule it with `content_schedule_post` (`post_id`,
`account_id`, `scheduled_date` as an ISO-8601 timestamp). Scheduling reserves a
future-day per-account slot under the same daily cap as publishing.

- `status: "accepted"` — queued for the scheduler.
- `status: "blocked"` — account unhealthy or daily cap reached. Move that post to
  another day rather than dropping it.

For anything the user wants out immediately, use `content_publish_post` instead
(same account gates; returns `accepted` / `queued` / `blocked`). Pass an
`idempotency_key` so a retry never double-posts.

## Step 5: Confirm and (later) measure

Show the user the final calendar: each post, platform, account, and send time, and note
that publishing is paced under daily caps. Use `content_list_posts` (filter by status)
to confirm the queue. A few days after things go live, `content_post_analytics`
(`post_id`) gives impressions per post — feed that back into which angles to do more of
next batch.

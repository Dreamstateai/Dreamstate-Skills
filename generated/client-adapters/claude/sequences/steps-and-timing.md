# Steps and timing

## Step kinds and what each one needs

A definition's `steps` array mixes five kinds. Fetch `sequences.step_options` for the live catalogue before writing any of these; the shapes below are the invariants that do not change, not the full field list.

- `email`: `channel: "email"`, plus `subject_template` and `body_template`, or an `ai_write` block. Optional `attachments` (asset references only).
- `linkedin`: `channel: "linkedin"`, plus an `action`. Seven legal actions: `send_dm`, `send_connection_request`, `comment_on_post`, `view_profile`, `fetch_profile`, `wait_for_connection`, `like_post`. Only `send_dm` and `comment_on_post` require copy (`body_template` or `ai_write`); `send_connection_request` takes an optional `note_template` (a note-less invite is valid); the other four actions carry no copy at all.
- `wait`: `duration_minutes` (positive integer, max 525,600) and `business_days_only` (boolean). This is the only step kind that owns delay directly.
- `condition`: an `expression` (`field`, `operator` one of `eq`/`neq`/`exists`/`in`, `value`), plus `true_step_id` and `false_step_id`. `in` requires an array value; `eq`/`neq` require a value.
- `action`: one of `create_task`, `manual_review`, `update_record`, each with its own typed payload. Not outreach sends: use this for a human hand-off inside the sequence, not a channel step.

Every step needs a unique `id`. Reference edges (`next_step_id`, `true_step_id`, `false_step_id`, `fallback_step_id`) must point at ids that exist in the same definition, and the graph must not cycle. `sequences.validate` checks all of this; run it before `sequences.bind`, not after.

## Timing lives in three places, not one

- **Per-step delay**: only a `wait` step's `duration_minutes`. There is no other way to insert a pause between two send steps.
- **`schedule_policy`**: workspace-relative send window for the whole sequence. `business_days` (array of weekday integers), `delivery_window.start`/`.end` (HH:MM, start strictly before end), `holiday_calendar`. This is a property of the sequence definition, not of `outreach.send_schedules`, which reports the workspace-level default window for reference, not something this sequence inherits automatically.
- **`rate_policy`**: `daily_cap` (per-sequence ceiling, capped at 10,000 by the schema but constrained further by the live hard caps, see deliverability-and-caps.md), `minimum_minutes_between_sends`, `retry_limit` (0-10), and an optional `action_caps` map keyed by `connections_sent`/`dms_sent`/`profiles_viewed`/`likes_sent`/`comments_sent`/`emails_sent`.

Read the live `timezone` field before proposing a window: `schedule_policy` validates against it, and an invalid IANA timezone or a window where end <= start fails validation outright.

## Sender policy determines what "one sequence, two channels" actually binds

`sender_policy.mode` is `fixed`, `pool`, or `recipient_owner`. `fixed` requires exactly one mailbox id when the sequence uses email steps. `pool` (the default for new sequences) uses every connected sender of a channel unless the list is narrowed; `null` means every connected sender, resolved at send time, while an explicit empty array means every sender was deselected and the sequence is rejected as unsendable. If the definition uses `linkedin` steps, `linkedin_account_ids` needs at least one entry unless the mode is the legacy `recipient_owner` (absence, not deselection). Cross-check the ids you bind against what `outreach.senders_list` and `outreach.mailboxes_list` actually return as healthy and connected; a sender id that is not live today is a blocker, not something to bind anyway.

## Exit rules

`exit_rules` is a non-empty array from: `reply`, `meeting`, `completion`, `bounce`, `unsubscribe`, `manual`, `failure`. Choose every exit condition that should stop a prospect from advancing, not just `reply`. A sequence with only `completion` in `exit_rules` will keep messaging someone who already replied or bounced; that is a deliverability and trust problem, not just an omission. See replies.md for how reply-triggered stops actually fire.

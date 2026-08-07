# Deliverability, caps, and suppression

## Caps and cooldowns are enforced below you, not by the definition you write

A sequence's `rate_policy.daily_cap` and `action_caps` are the sequence's own request; the workspace's real hard ceilings are enforced independently, below this skill, in the send dispatcher. The hard system caps (mirroring database check constraints, not configurable past this point regardless of what a definition asks for) include: 25 LinkedIn connection requests/day, 100 LinkedIn DMs/day, 150 profile views/day, 50 comments/day, 50 messages/day, 20 InMails/day, 25 cold emails/day. Read `outreach.settings_get` before proposing a `rate_policy`: it returns the live caps object and today's already-consumed usage per account, so you can tell the user what headroom actually exists instead of assuming the sequence's requested cap will be honored in full. A `rate_policy.daily_cap` set above what live usage plus the hard cap allows is not an error you can silently round down; report the real ceiling.

## Sending hours and windows

`outreach.send_schedules.get`/`.list` return the workspace-level default (timezone, `windows`, `skip_holidays`, `holiday_calendar`, `skip_dates`, `status`, `is_default`). This is informational: it tells you the workspace default posture (commonly business-hours-only, no weekends) so a sequence's own `schedule_policy` can be set consistently with it, not a value this skill can edit directly. When a user asks for a sequence to send outside normal business hours or every day of the week, treat it as a real request to deviate from the workspace default and flag the deliverability tradeoff (weekend and off-hours LinkedIn activity reads as automated), not something to silently apply.

## Sender readiness signals

`outreach.senders_list` returns each connected LinkedIn account's health status, subscription tier, and verification state, filtered to accounts already in a healthy state; an account outside that set is not a valid `linkedin_account_ids` entry no matter what the user asks. `outreach.mailboxes_list` returns each connected mailbox's `ramp_enabled` flag (a warm-up-in-progress signal: a ramping mailbox should not be pointed at full sequence volume immediately), `reply_to_address`, and signature. Read both before binding a `sender_policy`; a sender that looks connected in conversation may not be healthy or fully warmed in the live data.

## Suppression and do-not-contact refuse, they do not get routed around

Suppression (do-not-contact, prior unsubscribe, bounce history, an active reply-stop) is checked and enforced in the send dispatcher, entirely below this skill's capability set. There is no capability here to override, bypass, or re-target a suppressed contact through a different channel or a different sequence. If a preview or a validation pass surfaces that a row is suppressed, report exactly that and stop; do not suggest sending the same person through LinkedIn because email is blocked, or through a second sequence because the first is suppressed. Suppression exists to keep a workspace's sending reputation intact across every channel at once, and working around it for one contact defeats the entire mechanism for all of them.

## Queued, enrolled, and sent are three different facts

None of this skill's capabilities send anything, and nothing here confirms delivery. A bound draft is not enrolled. An enrolled contact is not sent to; sends are paced into a queue against the caps and windows above, so "enrolled" only means eligible for the next available send slot. When reporting status to the user, use the exact word for the state you actually confirmed (bound, validated, previewed) and never imply a later state (enrolled, sent, delivered) that this skill's capabilities cannot themselves confirm.

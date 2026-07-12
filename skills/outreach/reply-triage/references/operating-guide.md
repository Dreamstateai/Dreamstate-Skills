# Reply Triage: operating guide

## Promise

Work the LinkedIn inbox for an outreach campaign end to end: read open conversations, classify each reply by intent, draft and send the right response, and set pipeline status / assignment so nothing slips. Use whenever the user says 'check my replies', 'who responded', 'work my inbox', 'follow up with interested leads', or wants to triage and respond to outreach. You cannot read or send LinkedIn DMs yourself; Dreamstate does, under per-account caps.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `outreach_campaigns`, `outreach_list_contacts`, `outreach_get_contact`, `content_list_accounts`, `outreach_send_reply`, `outreach_set_thread_status`, `outreach_assign_thread`, `outreach_mark_thread_read`, `outreach_analytics`

Declared capabilities: `intent:content.list_accounts`, `intent:outreach.get_contact`, `intent:outreach.list_campaigns`, `intent:outreach.list_contacts`, `intent:outreach.send_reply`

Required scopes: `actions`, `content:read`, `outreach:read`, `outreach:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

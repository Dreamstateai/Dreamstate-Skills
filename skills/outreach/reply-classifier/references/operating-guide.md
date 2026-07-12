# Reply Classifier: operating guide

## Promise

Read the open reply threads on a Dreamstate campaign and classify each by intent (interested, not now, referral, objection, not interested, auto/OOO), with a recommended next action, and set pipeline status. Use whenever the user wants to 'classify my replies', 'triage who responded', sort the inbox by intent, or label responses, without sending anything yet. The classify-and-label half of reply handling; pair with /reply-triage to actually respond. You read intent; Dreamstate holds the threads and statuses.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `outreach_campaigns`, `outreach_list_contacts`, `outreach_get_contact`, `outreach_set_thread_status`, `outreach_mark_thread_read`, `outreach_analytics`

Declared capabilities: `intent:outreach.get_contact`, `intent:outreach.list_campaigns`, `intent:outreach.list_contacts`

Required scopes: `outreach:read`, `outreach:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

# Reply Triage: operating guide

## Promise

Work the LinkedIn inbox for an outreach campaign end to end: read open conversations, classify each reply by intent, draft and send the right response, and set pipeline status / assignment so nothing slips. Use whenever the user says 'check my replies', 'who responded', 'work my inbox', 'follow up with interested leads', or wants to triage and respond to outreach. You cannot read or send LinkedIn DMs yourself; Dreamstate does, under per-account caps.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `ds_search`, `ds_api`

Declared capabilities: `outreach.dm_conversation_assign`, `outreach.dm_conversation_get`, `outreach.dm_conversation_read`, `outreach.dm_conversation_status_update`, `outreach.dm_conversations_list`, `outreach.dm_message_send`, `outreach.workspace_stats_get`, `sequences.list`, `social.accounts_list`

Required scopes: `content:read`, `outreach:read`, `outreach:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

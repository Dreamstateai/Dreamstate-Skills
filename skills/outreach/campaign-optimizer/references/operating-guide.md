# Campaign Optimizer: operating guide

## Promise

Diagnose and tune a running outreach campaign: read its analytics, find what's underperforming, and act, pause weak campaigns, fix sequence steps, re-status stuck threads. Use whenever the user asks 'why isn't my campaign working', 'improve my reply rate', 'my outreach is flat', wants to optimize, pause, or audit a live campaign. The lever for a launched campaign is rarely volume; it's the opener, the targeting, or the cadence. You read the data and decide; Dreamstate makes the change under its caps.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_tools_run`, `dreamstate_get_run`

Declared capabilities: `outreach.analytics_step_aggregate_get`, `outreach.channel_stats_get`, `outreach.dm_conversation_status_update`, `outreach.global_pause_set`, `outreach.workspace_stats_get`, `rows.query`, `sequences.edit_step`, `sequences.get`, `sequences.list`, `sequences.step_options`

Required scopes: `outreach:read`, `outreach:write`, `tables:read`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

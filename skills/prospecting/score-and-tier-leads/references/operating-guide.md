# Score And Tier Leads: operating guide

## Promise

Score and tier prospects from explicit fit, timing, relationship, and confidence evidence.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_run`, `outreach_add_column`

Declared capabilities: `column:ai`, `column:formula`, `function:icp_score_and_route`

Required scopes: `outreach:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

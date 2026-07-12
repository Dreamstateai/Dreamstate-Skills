# Schedule Content: operating guide

## Promise

Schedule approved content against account availability, cadence, and campaign conflicts.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `content_schedule_post`

Declared capabilities: `intent:content.schedule_post`

Required scopes: `actions`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

# Build Table: operating guide

## Promise

Create a reactive table with a clear row entity, stable identifiers, and declared outputs.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_tools_run`

Declared capabilities: `columns.add`, `tables.create`

Required scopes: `tables:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

# Find And Verify Email: operating guide

## Promise

Find and verify work emails through a cost-aware waterfall with confidence labels.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_tools_run`, `dreamstate_get_run`, `dreamstate_list_runs`, `dreamstate_cancel_run`, `dreamstate_resume_run`

Declared capabilities: `columns.add`, `columns.run`, `contacts.find_email`, `runs.column_get`

Required scopes: `outreach:read`, `outreach:write`, `tables:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

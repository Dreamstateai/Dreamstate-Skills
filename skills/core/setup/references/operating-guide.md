# Setup: operating guide

## Promise

Install Dreamstate skills, authenticate the client, and verify the connection end to end.

## Execution boundary

Mode: **guided-execution**. Dreamstate can execute part of the outcome, while operator judgment or an external step remains required.

Declared tools: `ping`, `content_list_accounts`, `outreach_lists`

Declared capabilities: `intent:content.list_accounts`, `intent:outreach.list_lists`

Required scopes: `content:read`, `outreach:read`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

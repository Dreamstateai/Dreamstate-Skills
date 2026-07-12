# Workflow Observability: operating guide

## Promise

Define run-level logs, metrics, alerts, and evidence needed to operate automation confidently.

## Execution boundary

Mode: **knowledge**. This package provides original operating guidance and must not claim product mutations.

Declared tools: none

Declared capabilities: none

Required scopes: none

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

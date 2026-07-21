# Dreamstate: operating guide

## Promise

Route a growth task to the safest Dreamstate primitive before any data is changed.

## Execution boundary

Mode: **guided-execution**. Dreamstate can execute part of the outcome, while operator judgment or an external step remains required.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_tools_run`, `dreamstate_get_run`

Declared capabilities: `runs.get`, `tools.get`, `tools.run`, `tools.search`

Required scopes: none

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

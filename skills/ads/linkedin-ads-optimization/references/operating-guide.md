# Linkedin Ads Optimization: operating guide

## Promise

Optimize LinkedIn advertising from matched evidence without reacting to noisy early results.

## Execution boundary

Mode: **planned**. The central runtime contract is not released. Treat this as a transparent design guide only.

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

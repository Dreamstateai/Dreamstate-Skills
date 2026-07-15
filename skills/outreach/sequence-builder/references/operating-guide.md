# Sequence Builder: operating guide

## Promise

Design a custom multi-step LinkedIn sequence from scratch for a Dreamstate campaign: connection rules, waits, DMs, branches, variables, and reply stops in a validated graph. Use whenever the user wants to build a sequence, design a cadence, define follow-up, or revise an existing graph. It creates one governed, revision-bound proposal and never enrolls, activates, or sends.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_create`, `dreamstate_proposals_get`, `dreamstate_proposals_mutate`, `dreamstate_get_run`

Declared capabilities: `resource:runs`

Required scopes: `outreach:read`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

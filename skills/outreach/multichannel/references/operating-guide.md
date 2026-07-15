# Multichannel: operating guide

## Promise

Design a governed LinkedIn plus social content motion from scratch around one audience through Dreamstate. Use whenever the user wants multichannel outreach, audience warming, coordinated content and outbound, or an account-based play. It grounds both motions in shared context, proposes custom structures through the unified proposal lifecycle, and keeps publishing and campaign activation as explicit separate approvals.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_create`, `dreamstate_proposals_get`, `dreamstate_proposals_mutate`, `dreamstate_get_run`, `dreamstate_list_runs`, `dreamstate_brain_query`, `dreamstate_context_query`

Declared capabilities: `brain.architect.resolve_attachment`, `brain.companies.get`, `brain.context.get`, `brain.context.list`, `brain.daily_update.get`, `brain.daily_update.history`, `brain.evidence.search`, `brain.learning.query_benchmarks`, `brain.outreach.compare`, `brain.people.get`, `resource:runs`

Required scopes: `content:read`, `outreach:read`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

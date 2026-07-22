# Lead Prioritizer: operating guide

## Promise

Score and tier the rows in a Dreamstate list against an ICP, and write the scores back as columns so the list sorts by who to reach first. Use whenever the user wants to 'score my leads', 'prioritize this list', rank by fit, tier prospects, or decide who to enroll first. Stage 3 of the pipeline: pure judgment over an already-enriched table, no sourcing or sending. Scoring is yours to do; Dreamstate stores it on each row.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_tools_run`, `dreamstate_get_run`

Declared capabilities: `cells.settle`, `columns.add`, `contacts.get`, `contacts.list`, `rows.query`, `tables.list`

Required scopes: `outreach:read`, `tables:read`, `tables:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

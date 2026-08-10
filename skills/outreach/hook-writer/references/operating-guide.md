# Hook Writer: operating guide

## Promise

Write a personalized opening line for each row in a Dreamstate list and save it back as a column, ready to drop into a sequence. Use whenever the user wants 'personalized openers', 'first lines', 'icebreakers', to personalize a campaign at scale, or to draft the hook for each lead. Stage 4 of the pipeline: it crafts copy per row, it does not send. You bring the voice and the angle; Dreamstate drafts against the contact's real data and stores the result.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `ds_search`, `ds_api`

Declared capabilities: `cells.settle`, `columns.add`, `contacts.draft_opener`, `contacts.get`, `contacts.list`, `rows.query`, `sequences.step_options`, `tables.list`

Required scopes: `outreach:read`, `outreach:write`, `tables:read`, `tables:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

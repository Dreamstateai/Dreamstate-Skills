# Enrich List: operating guide

## Promise

Build a Clay-style table in Dreamstate: one row per person, the columns you want, enriched with firmographics. Use whenever the user wants to 'enrich these leads', 'build a lead table', 'clean up my list', add firmographics, map an uploaded CSV into Dreamstate, or prep a list before outreach. Stage 2 of the pipeline: it shapes the table and fills it, no scoring or sending. You cannot enrich data yourself; Dreamstate calls the providers under a daily spend cap.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `ds_search`, `ds_api`

Declared capabilities: `cells.settle`, `columns.add`, `columns.archive`, `columns.update`, `contacts.enrich`, `contacts.get`, `contacts.list`, `rows.query`, `rows.upsert`, `social.accounts_list`, `sources.find_leads`, `tables.create`, `tables.list`, `workbooks.create`, `workbooks.list`

Required scopes: `content:read`, `outreach:read`, `outreach:write`, `tables:read`, `tables:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

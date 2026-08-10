# Signal Scraper: operating guide

## Promise

Find in-market leads by buying signal and pull them into a Dreamstate list, one row per person. Use whenever the user wants to 'find leads', 'who's hiring / raised / switched tools', source a list from a LinkedIn search or signal, or fill the top of the funnel. This is stage 1 of the outbound pipeline: it only sources rows into the table, it does not enrich, score, or send. You cannot search LinkedIn yourself; Dreamstate runs the search through a connected account.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `ds_search`, `ds_api`

Declared capabilities: `contacts.list`, `outreach.triggers_supported_list`, `social.accounts_list`, `sources.find_leads`, `tables.create`, `tables.list`, `workbooks.create`

Required scopes: `content:read`, `outreach:read`, `outreach:write`, `tables:read`, `tables:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

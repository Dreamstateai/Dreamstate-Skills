# Outbound: operating guide

## Promise

Run a full LinkedIn outbound campaign end to end through Dreamstate: source leads, build the lead table, enrich and score against an ICP, write personalized openers, build the sequence, and launch under safe per-account caps. Use whenever the user wants cold outreach, to prospect on LinkedIn, build a lead list, 'start a campaign', book demos, or generate pipeline. This is the orchestrator over the pipeline stages; it routes every real action through Dreamstate, which sends at scale within deliverability limits.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_tools_run`, `dreamstate_get_run`

Declared capabilities: `campaigns.activate`, `campaigns.create`, `campaigns.template_apply`, `cells.settle`, `columns.add`, `contacts.draft_opener`, `contacts.enrich`, `contacts.get`, `contacts.list`, `outreach.workspace_stats_get`, `rows.query`, `sequences.add_step`, `sequences.enroll_selection`, `sequences.get`, `sequences.step_options`, `sequences.validate`, `social.accounts_list`, `sources.find_leads`, `tables.create`, `tables.list`, `workbooks.create`

Required scopes: `actions`, `content:read`, `outreach:read`, `outreach:write`, `tables:read`, `tables:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

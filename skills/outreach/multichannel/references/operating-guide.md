# Multichannel: operating guide

## Promise

Run a combined LinkedIn + content motion against one audience through Dreamstate: warm the target list with social/blog content while a LinkedIn sequence reaches them directly, so prospects see the brand in more than one place. Use whenever the user wants multi-channel outreach, to 'warm up' an audience before DMing, to coordinate content with outbound, or an account-based play. Orchestrates the outreach and content engines together; you cannot post or send yourself.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_tools_run`, `dreamstate_get_run`

Declared capabilities: `contacts.enrich`, `content.artifact_generate`, `content.schedule`, `outreach.workspace_stats_get`, `sequences.enroll_selection`, `social.accounts_list`, `sources.find_leads`, `tables.create`, `workbooks.create`, `workflows.activate`, `workflows.create`, `workflows.graph_apply`

Required scopes: `content:read`, `content:write`, `outreach:read`, `outreach:write`, `tables:write`, `workflows:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

# Network Grow: operating guide

## Promise

Grow a LinkedIn network with the right people: source or take a targeted list, write a short personalized note per person, and send connection requests under the per-account ramp cap. Use whenever the user wants to 'grow my network', 'send connection requests', 'connect with' a set of people, or warm an audience without a full DM sequence. A lighter motion than /outbound: connections only, no follow-up cadence. You pick who and the note; Dreamstate sends the invites under its caps.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_tools_run`, `dreamstate_get_run`

Declared capabilities: `campaigns.create`, `contacts.draft_opener`, `contacts.enrich`, `contacts.get`, `contacts.list`, `contacts.send_connection`, `social.accounts_list`, `sources.find_leads`, `tables.create`, `tables.list`, `workbooks.create`

Required scopes: `actions`, `content:read`, `outreach:read`, `outreach:write`, `tables:read`, `tables:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

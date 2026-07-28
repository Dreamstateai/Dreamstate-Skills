# Network Grow: operating guide

## Promise

Grow a LinkedIn network with the right people: source or take a targeted list, write a short personalized note per person, and launch a connection-only workflow under the per-account ramp cap. Use whenever the user wants to 'grow my network', 'send connection requests', 'connect with' a set of people, or warm an audience without a DM cadence. You pick who and the note; Dreamstate enrolls the frozen selection and dispatches through its governed workflow runtime.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_tools_run`, `dreamstate_get_run`

Declared capabilities: `contacts.draft_opener`, `contacts.enrich`, `contacts.get`, `contacts.list`, `sequences.enroll_selection`, `sequences.step_options`, `sequences.validate`, `social.accounts_list`, `sources.find_leads`, `tables.create`, `tables.list`, `workbooks.create`, `workflows.activate`, `workflows.create`, `workflows.draft_publish`, `workflows.get`, `workflows.graph_apply`, `workflows.node_registry`, `workflows.validate_graph`

Required scopes: `content:read`, `outreach:read`, `outreach:write`, `tables:read`, `tables:write`, `workflows:read`, `workflows:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

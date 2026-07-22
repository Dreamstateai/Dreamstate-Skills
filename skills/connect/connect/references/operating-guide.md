# Connect: operating guide

## Promise

Connect this agent to Dreamstate and verify it can act. Use this FIRST, before any other Dreamstate skill, and any time a Dreamstate tool call fails with an auth or 'not connected' error. It checks the MCP connection, walks the OAuth sign-in if needed, lists which tools are available, and confirms the workspace and connected LinkedIn/X accounts so later playbooks don't fail halfway through.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `ping`, `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_tools_run`

Declared capabilities: `social.accounts_list`, `tables.list`

Required scopes: `content:read`, `tables:read`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

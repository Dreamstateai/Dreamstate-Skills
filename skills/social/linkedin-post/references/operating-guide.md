# Linkedin Post: operating guide

## Promise

Write a LinkedIn post with a clear idea, useful development, and platform-appropriate formatting.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_tools_run`, `dreamstate_get_run`, `dreamstate_list_runs`, `dreamstate_cancel_run`, `dreamstate_resume_run`

Declared capabilities: `content.artifact_create`, `content.artifact_generate`, `content.artifact_get`, `content.artifact_update`

Required scopes: `content:read`, `content:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

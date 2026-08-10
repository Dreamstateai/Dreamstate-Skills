# Social Calendar: operating guide

## Promise

Plan, draft, and schedule a batch of LinkedIn and X posts through Dreamstate. Use whenever the user wants to 'plan content', 'schedule posts', build a social calendar, fill their content pipeline, batch a week of posts, or keep their LinkedIn/X active. You cannot post to social yourself; Dreamstate generates drafts and publishes/schedules them through the user's connected accounts under per-account daily caps.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `ds_search`, `ds_api`

Declared capabilities: `content.artifact_generate`, `content.artifact_get`, `content.artifact_list`, `content.artifact_update`, `content.delivery_publish`, `content.schedule`, `social.accounts_list`, `social.post_analytics`

Required scopes: `actions`, `content:read`, `content:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

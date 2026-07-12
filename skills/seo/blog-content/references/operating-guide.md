# Blog Content: operating guide

## Promise

Plan, generate, review, and publish useful long-form content through Dreamstate.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `content_create_blog`, `content_generate_blog`, `content_get_blog`, `content_publish_blog`

Declared capabilities: `intent:content.create_blog`, `intent:content.generate_blog`, `intent:content.get_blog`, `intent:content.publish_blog`

Required scopes: `actions`, `content:read`, `content:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

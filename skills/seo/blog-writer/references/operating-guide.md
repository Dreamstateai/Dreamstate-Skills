# Blog Writer: operating guide

## Promise

Write and publish a blog post on a given topic through Dreamstate: draft it, AI-generate the full article, review, and publish to the public blog or a destination. Use whenever the user wants to 'write a blog post', 'publish an article', 'add to our blog', or turn a topic into long-form content. Distinct from /ai-visibility (which picks topics from GEO citation gaps); this one writes the post the user already has in mind. You cannot publish yourself; Dreamstate generates and publishes.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_tools_run`, `dreamstate_get_run`

Declared capabilities: `content.article_create_schedule`, `content.article_delivery_create`, `content.article_get`, `content.article_list`, `content.article_update`

Required scopes: `actions`, `content:read`, `content:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

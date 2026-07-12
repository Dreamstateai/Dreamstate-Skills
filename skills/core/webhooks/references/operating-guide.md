# Webhooks: operating guide

## Promise

Design and operate signed Dreamstate webhook subscriptions with replay-safe event handling.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `webhooks_create`, `webhooks_list`, `webhooks_test_delivery`, `webhooks_delete`

Declared capabilities: `event:campaign.activated`, `event:campaign.paused`, `event:connection.accepted`, `event:contact.created`, `event:content.scheduled`, `event:enrichment.completed`, `event:lead.sourced`, `event:post.failed`, `event:post.published`, `event:reply.received`, `event:run.completed`, `event:run.failed`, `event:run.started`, `event:seo.rank.changed`, `event:sequence.step.sent`, `event:table.column.completed`, `event:usage.ceiling_reached`, `event:usage.overage_started`, `event:usage.threshold_reached`, `resource:webhooks`, `resource:webhooks.write`

Required scopes: `actions`, `outreach:read`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

# Ai Visibility: operating guide

## Promise

Audit and improve how a brand shows up in AI search (ChatGPT, Perplexity, Gemini, AI Overviews) using Dreamstate's visibility data, then close the gaps by generating and publishing blog content. Use whenever the user asks about AI visibility, GEO, generative engine optimization, 'do AI assistants cite us', AI search ranking, citation gaps, share of voice in AI answers, or AI-referral traffic. You cannot run the probes or publish content yourself; Dreamstate does both.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `ds_search`, `ds_api`

Declared capabilities: `content.article_create_schedule`, `content.article_delivery_create`, `content.article_get`, `content.article_list`, `content.article_update`, `visibility.ai_traffic`, `visibility.citations`, `visibility.overview`, `visibility.refresh`

Required scopes: `actions`, `content:read`, `content:write`, `visibility:read`, `visibility:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

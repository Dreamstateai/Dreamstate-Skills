# Formula And Conditions: operating guide

## Promise

Build deterministic formulas and run conditions from explicit fields instead of keyword guesses.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `outreach_add_column`

Declared capabilities: `column:ai`, `column:ai_answer`, `column:assigned_to`, `column:blitz_enrich`, `column:builtwith_tech`, `column:checkbox`, `column:company_enrich`, `column:crm_lookup`, `column:currency`, `column:date`, `column:email`, `column:email_find`, `column:enrichment`, `column:fetch_page`, `column:formula`, `column:http_request`, `column:image_url`, `column:keyword_research`, `column:local_business_search`, `column:merge_columns`, `column:multi_select`, `column:number`, `column:phone_find`, `column:place_details`, `column:predictleads_funding_enrich`, `column:predictleads_jobs`, `column:predictleads_news`, `column:realtime_search`, `column:realtime_search_deep`, `column:scrape_url`, `column:select`, `column:serp_search`, `column:serp_search_priority`, `column:serp_search_standard`, `column:sumble_tech`, `column:text`, `column:url`, `column:waterfall`, `column:web_agent`, `column:web_search`, `column:web_search_deep`, `intent:outreach.table.add_column`

Required scopes: `outreach:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

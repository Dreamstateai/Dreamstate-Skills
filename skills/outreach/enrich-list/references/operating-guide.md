# Enrich List: operating guide

## Promise

Build a Clay-style table in Dreamstate: one row per person, the columns you want, enriched with firmographics. Use whenever the user wants to 'enrich these leads', 'build a lead table', 'clean up my list', add firmographics, map an uploaded CSV into Dreamstate, or prep a list before outreach. Stage 2 of the pipeline: it shapes the table and fills it, no scoring or sending. You cannot enrich data yourself; Dreamstate calls the providers under a daily spend cap.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `outreach_lists`, `outreach_create_list`, `outreach_find_leads`, `outreach_list_contacts`, `outreach_get_contact`, `outreach_enrich_contact`, `outreach_get_campaign_table`, `outreach_add_column`, `outreach_edit_column`, `outreach_delete_column`, `outreach_set_cell`, `content_list_accounts`

Declared capabilities: `column:ai`, `column:ai_answer`, `column:assigned_to`, `column:blitz_enrich`, `column:builtwith_tech`, `column:checkbox`, `column:company_enrich`, `column:crm_lookup`, `column:currency`, `column:date`, `column:email`, `column:email_find`, `column:enrichment`, `column:fetch_page`, `column:formula`, `column:http_request`, `column:image_url`, `column:keyword_research`, `column:local_business_search`, `column:merge_columns`, `column:multi_select`, `column:number`, `column:phone_find`, `column:place_details`, `column:predictleads_funding_enrich`, `column:predictleads_jobs`, `column:predictleads_news`, `column:realtime_search`, `column:realtime_search_deep`, `column:scrape_url`, `column:select`, `column:serp_search`, `column:serp_search_priority`, `column:serp_search_standard`, `column:sumble_tech`, `column:text`, `column:url`, `column:waterfall`, `column:web_agent`, `column:web_search`, `column:web_search_deep`, `intent:content.list_accounts`, `intent:outreach.create_list`, `intent:outreach.enrich_contact`, `intent:outreach.find_leads`, `intent:outreach.get_contact`, `intent:outreach.list_contacts`, `intent:outreach.list_lists`, `intent:outreach.table.add_column`, `intent:outreach.table.delete_column`, `intent:outreach.table.edit_column`, `intent:outreach.table.get`, `intent:outreach.table.set_cell`

Required scopes: `content:read`, `outreach:read`, `outreach:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

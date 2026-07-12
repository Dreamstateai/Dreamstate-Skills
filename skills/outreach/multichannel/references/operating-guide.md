# Multichannel: operating guide

## Promise

Run a combined LinkedIn + content motion against one audience through Dreamstate: warm the target list with social/blog content while a LinkedIn sequence reaches them directly, so prospects see the brand in more than one place. Use whenever the user wants multi-channel outreach, to 'warm up' an audience before DMing, to coordinate content with outbound, or an account-based play. Orchestrates the outreach and content engines together; you cannot post or send yourself.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `outreach_create_list`, `outreach_find_leads`, `outreach_enrich_contact`, `outreach_create_campaign`, `outreach_apply_template`, `outreach_enroll`, `outreach_activate_campaign`, `content_generate_post`, `content_schedule_post`, `content_list_accounts`, `outreach_analytics`

Declared capabilities: `intent:content.generate_post`, `intent:content.list_accounts`, `intent:content.schedule_post`, `intent:outreach.activate_campaign`, `intent:outreach.apply_template`, `intent:outreach.create_campaign`, `intent:outreach.create_list`, `intent:outreach.enrich_contact`, `intent:outreach.enroll`, `intent:outreach.find_leads`

Required scopes: `actions`, `content:read`, `content:write`, `outreach:read`, `outreach:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

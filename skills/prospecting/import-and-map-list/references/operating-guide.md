# Import And Map List: operating guide

## Promise

Import an external list and map fields into stable Dreamstate columns without data loss.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `outreach_bulk_upsert_contacts`, `outreach_upsert_contact`, `outreach_add_to_list`

Declared capabilities: `intent:outreach.add_to_list`, `intent:outreach.upsert_contact`

Required scopes: `outreach:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

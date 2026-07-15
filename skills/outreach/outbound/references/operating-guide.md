# Outbound: operating guide

## Promise

Design a governed LinkedIn outbound campaign from scratch through Dreamstate: ground the ICP, propose source and table work, build a custom sequence, stage bounded evidence runs, and launch only after explicit approval. Use whenever the user wants cold outreach, a lead list, a new campaign, demos, or pipeline. This orchestrator uses the same revision-bound proposal and durable-run lifecycle as Architect, Claude, and Codex.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_create`, `dreamstate_proposals_get`, `dreamstate_proposals_mutate`, `dreamstate_get_run`, `dreamstate_list_runs`

Declared capabilities: `resource:runs`

Required scopes: `outreach:read`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

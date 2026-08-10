# Sequence Builder: operating guide

## Promise

Build a multi-step LinkedIn sequence: connection request, waits, and DMs wired into a validated workflow graph. Use whenever the user wants to build a sequence, design the cadence, set up outreach steps, or define the follow-up flow. It constructs and validates the sequence; it does not enroll or send. You design the cadence; Dreamstate stores it as a versioned graph and checks it before launch.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `ds_search`, `ds_api`

Declared capabilities: `outreach.triggers_supported_list`, `sequences.definition_get`, `sequences.list`, `sequences.step_options`, `sequences.validate`, `workflows.create`, `workflows.get`, `workflows.graph_apply`, `workflows.node_registry`, `workflows.validate_graph`

Required scopes: `outreach:read`, `workflows:read`, `workflows:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

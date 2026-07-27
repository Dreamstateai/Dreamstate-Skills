# Sequence Builder: operating guide

## Promise

Build the multi-step LinkedIn sequence for a Dreamstate campaign: connection request, waits, and DMs wired into a validated graph. Use whenever the user wants to 'build a sequence', 'design the cadence', set up campaign steps, or define the follow-up flow. Stage 5 of the pipeline: it constructs and validates the sequence, it does not enroll or send. You design the cadence; Dreamstate stores it as a versioned step graph and checks it before launch.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_tools_run`, `dreamstate_get_run`

Declared capabilities: `outreach.triggers_supported_list`, `sequences.add_step`, `sequences.edit_step`, `sequences.get`, `sequences.list`, `sequences.remove_step`, `sequences.step_options`, `sequences.validate`, `workflows.create`

Required scopes: `outreach:read`, `outreach:write`, `workflows:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

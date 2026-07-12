# Sequence Builder: operating guide

## Promise

Build the multi-step LinkedIn sequence for a Dreamstate campaign: connection request, waits, and DMs wired into a validated graph. Use whenever the user wants to 'build a sequence', 'design the cadence', set up campaign steps, or define the follow-up flow. Stage 5 of the pipeline: it constructs and validates the sequence, it does not enroll or send. You design the cadence; Dreamstate stores it as a versioned step graph and checks it before launch.

## Execution boundary

Mode: **executable**. The central outcome is supported by released Dreamstate contracts.

Declared tools: `outreach_campaigns`, `outreach_create_campaign`, `outreach_apply_template`, `outreach_get_step_options`, `outreach_get_sequence`, `outreach_add_step`, `outreach_edit_step`, `outreach_remove_step`, `outreach_validate_sequence`, `outreach_list_signal_types`

Declared capabilities: `intent:outreach.apply_template`, `intent:outreach.create_campaign`, `intent:outreach.list_campaigns`, `intent:outreach.sequence.add_step`, `intent:outreach.sequence.edit_step`, `intent:outreach.sequence.get`, `intent:outreach.sequence.remove_step`, `intent:outreach.sequence.validate`, `intent:outreach.signals.list`

Required scopes: `outreach:read`, `outreach:write`

## Evidence checklist

- Identify the source and observation time for every external fact.
- Label inference and confidence separately from observed evidence.
- Preserve stable workspace, object, row, account, run, and provider identifiers.
- Record exclusions, suppression, limits, cost bounds, and approvals.
- Verify the durable object or terminal run state before reporting completion.

## Recovery

On missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.

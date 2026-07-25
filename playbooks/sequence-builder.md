---
name: sequence-builder
description: "Build the multi-step LinkedIn sequence for a Dreamstate campaign: connection request, waits, and DMs wired into a validated graph. Use whenever the user wants to 'build a sequence', 'design the cadence', set up campaign steps, or define the follow-up flow. Stage 5 of the pipeline: it constructs and validates the sequence, it does not enroll or send. You design the cadence; Dreamstate stores it as a versioned step graph and checks it before launch."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: outreach
tier: composite
tools_used: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_tools_run]
capability_ids: [campaigns.list, campaigns.create, campaigns.template_apply, sequences.step_options, sequences.get, sequences.add_step, sequences.edit_step, sequences.remove_step, sequences.validate, sources.list]
---

# Sequence Builder

A sequence is the cadence that carries the opener: connect, wait, message, wait, follow
up. The job here is to turn the user's intended flow into a valid Dreamstate step graph,
bound to a campaign, that passes the same checks activation runs. You decide the rhythm;
Dreamstate holds the graph and tells you when it is sound.

Run `/connect` first if unsure. Needs a campaign to build into; create one here or reuse
an existing one.

## Step 1: Get or create the campaign

Find an existing campaign with `campaigns.list`, or create one with
`campaigns.create` bound to the lead list (`outreach_list_id`). Pick
`campaign_kind`:

- `cold_outbound` — targeting a sourced list by ICP (the usual case).
- `intent_signals` — signal-triggered enrollment; list options with
  `sources.list` first.

Apply the chosen campaign template with `campaigns.template_apply`. For `intent_signals` you MUST read
`sequences.get` first for the current `graph_version`, then pass `signal_config`
with that exact version (it is a compare-and-set; a stale value returns
`graph_version_conflict`, so re-read and retry).

## Step 2: Read the building blocks

Call `sequences.step_options` for the action subtypes (`send_connection_request`,
`send_dm`, `wait`), opener frameworks, and variable tokens. Read the current graph and its
`graph_version` with `sequences.get`. A solid default cadence for cold LinkedIn:

```
  connection_request ──► wait 1-2d ──► send_dm (opener) ──► wait 3d ──► send_dm (follow-up)
```

## Step 3: Wire the steps

Add each step with `sequences.add_step`, passing the `node` and the current `graph_version`,
and `after_step_id` to attach it to the previous step. The `graph_version` you pass must be
the latest you read; every successful add returns a new version, so thread it forward. On
`graph_version_conflict`, re-read with `sequences.get` and retry with the fresh
version. Use `sequences.edit_step` / `sequences.remove_step` to fix mistakes rather than
stacking corrective steps.

If `/hook-writer` already wrote openers onto the rows, use that copy for the DM steps so
the personalization the user approved is what actually goes out.

## Step 4: Validate before you hand off

Run `sequences.validate`. It runs the same structural checks activation does
(cycles, orphan steps, unwired branches). Fix anything it flags; a graph that fails
validation will be rejected at activation anyway.

Report the final cadence in plain terms (the steps and the waits) and confirm it
validates. Hand off to `/outbound` to enroll and launch, or tell the user it is ready to
activate when they are.

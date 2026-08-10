---
name: sequence-builder
description: "Build a multi-step LinkedIn sequence: connection request, waits, and DMs wired into a validated workflow graph. Use whenever the user wants to build a sequence, design the cadence, set up outreach steps, or define the follow-up flow. It constructs and validates the sequence; it does not enroll or send. You design the cadence; Dreamstate stores it as a versioned graph and checks it before launch."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: outreach
tier: composite
tools_used: [ds_search, ds_api]
capability_ids: [sequences.list, workflows.create, workflows.get, workflows.node_registry, workflows.graph_apply, workflows.validate_graph, sequences.step_options, sequences.definition_get, sequences.validate, outreach.triggers_supported_list]
---

# Sequence Builder

A sequence is the cadence that carries the opener: connect, wait, message, wait, follow
up. The job here is to turn the user's intended flow into a valid Dreamstate step graph,
bound to a workflow, that passes the same checks activation runs. You decide the rhythm;
Dreamstate holds the graph and tells you when it is sound.

Run `/connect` first if unsure. Create or reuse the workflow that will own the sequence.

The dotted names below are canonical capability IDs. Inspect their live contracts with
`ds_search` (`scope: 'capabilities', include_schema: true`) and invoke them with `ds_api`
(`action: 'run'`) using the minted `capability_ref`.

## Step 1: Get or create the sending motion

Find an existing sequence with `sequences.list`, or create the workflow that owns it with
`workflows.create` bound to the exact frozen worksheet/view. Pick the
motion kind:

- `cold_outbound` — targeting a sourced list by ICP (the usual case).
- `intent_signals` — signal-triggered enrollment; list options with
  `outreach.triggers_supported_list` first.

Read the workflow with `workflows.get` and the live node catalog with
`workflows.node_registry`. For `intent_signals`, inspect the current sequence definition
with `sequences.definition_get` before adding its signal configuration.

## Step 2: Read the building blocks

Call `sequences.step_options` for the action subtypes (`send_connection_request`,
`send_dm`, `wait`), opener frameworks, and variable tokens. Read the current versioned
workflow graph with `workflows.get`. A solid default cadence for cold LinkedIn:

```
  connection_request ──► wait 1-2d ──► send_dm (opener) ──► wait 3d ──► send_dm (follow-up)
```

## Step 3: Wire the steps

Apply the reviewed nodes and edges with `workflows.graph_apply`, using the exact workflow
revision returned by `workflows.get`. On a version conflict, re-read the workflow and retry
against the fresh revision. Edit or remove nodes in the graph payload rather than stacking
corrective nodes.

If `/hook-writer` already wrote openers onto the rows, use that copy for the DM steps so
the personalization the user approved is what actually goes out.

## Step 4: Validate before you hand off

Run `workflows.validate_graph`, then `sequences.validate` for the sequence-specific rules.
Fix cycles, orphan steps, unwired branches, or invalid messaging configuration before handoff.

Report the final cadence in plain terms (the steps and the waits) and confirm it
validates. Hand off to `/outbound` to enroll and launch, or tell the user it is ready to
activate when they are.

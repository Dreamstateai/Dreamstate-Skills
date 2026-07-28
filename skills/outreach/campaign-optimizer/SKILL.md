---
name: campaign-optimizer
description: "Diagnose and tune a running outreach sequence: read its analytics, find what's underperforming, pause weak motions, fix workflow nodes, and re-status stuck threads. Use whenever the user asks why outreach is not working, wants to improve reply rate, optimize, pause, or audit a live sequence."
---

# Sequence Optimizer

Launching is the easy part; a sequence earns its keep only if you read it and adjust. This
skill takes a live sequence, finds where it leaks, and fixes the cause rather than cranking
volume on a message that is not landing. You bring the read on what "good" looks like and
what to change; Dreamstate holds the data and applies the change under its caps.

Run `/connect` first if unsure.

The dotted names below are canonical capability IDs. Inspect their live contracts with
`dreamstate_tools_get`, invoke them with `dreamstate_tools_run`, and follow asynchronous work
with `dreamstate_get_run`.

## Step 1: Pick the sequence and read the numbers

List sequences with `sequences.list` and pick the one the user means (or scan the active
ones). Pull `outreach.workspace_stats_get`, `sequences.analytics_get`, and the selected
sequence's `outreach.analytics_step_aggregate_get` evidence:

- `metric: "overview"` — sends, acceptance rate, reply rate, positive reply rate, demos.
- `metric: "icp"` or `"signal_source"` — which segment is actually responding.

Read the absolute numbers and the shape. The diagnosis usually falls into one of three
buckets, and each has a different fix:

- **Low acceptance rate** → the targeting or the connection note. People are not letting you
  in. Fix who you reach and the first impression.
- **Good acceptance, low reply rate** → the opener. They connected but the message did not
  earn a response.
- **Good reply rate, low demos** → the handoff or the follow-up, not the top of funnel. Look
  at reply triage, not the sequence.

State which bucket this campaign is in before changing anything.

## Step 2: Confirm the cause in the data

Do not guess. Pull `rows.query` for the sequence's frozen worksheet/view to see the contacts
and where they are stalling, and `sequences.definition_get` for the current step graph and its
`graph_version`. Read `sequences.step_options` for the step subtypes and opener frameworks available. If a
segment (`metric: "icp"`) is dragging the average down, that is a targeting problem, not a
copy problem; say so.

## Step 3: Act on the cause

Take the smallest change that addresses the bucket:

- **Opener is weak** → read the owning workflow with `workflows.get`, inspect the live
  node shape with `workflows.node_registry`, apply the smallest copy-only graph patch with
  `workflows.graph_apply` against the exact revision, and validate it with
  `workflows.validate_graph`. Shorter, more specific, more about them.
- **The motion is structurally off** (wrong audience, burning sender reputation, or being
  replaced) → `outreach.global_pause_set`. This runs the in-app kill-switch
  cascade so in-flight sends actually stop, not just a row flip. Pause, fix the targeting on
  the selection binding or rebuild the sequence steps, then unpause.
- **Threads stuck in the wrong state** → `outreach.dm_conversation_status_update` to move replied or dead
  conversations out of the active view so the metrics reflect reality.

## Step 4: Report the change and what to watch

Tell the user exactly what you changed and why, in their terms (the bucket, the fix, the
expected effect). Optimization is iterative: give the change a few days, then re-read
the same canonical analytics capabilities and compare. Change one lever at a time, or you
cannot tell what worked.

## Package resources

- Read [references/operating-guide.md](references/operating-guide.md) for mode-specific boundaries, evidence rules, and recovery.
- Read [examples/example.md](examples/example.md) before the first execution or recommendation.
- Use [evals/contract.json](evals/contract.json) to check routing, approval, and durable-verification behavior.

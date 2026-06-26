---
name: campaign-optimizer
description: "Diagnose and tune a running outreach campaign: read its analytics, find what's underperforming, and act, pause weak campaigns, fix sequence steps, re-status stuck threads. Use whenever the user asks 'why isn't my campaign working', 'improve my reply rate', 'my outreach is flat', wants to optimize, pause, or audit a live campaign. The lever for a launched campaign is rarely volume; it's the opener, the targeting, or the cadence. You read the data and decide; Dreamstate makes the change under its caps."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: outreach
tier: playbook
tools_used: [outreach_campaigns, outreach_analytics, outreach_get_campaign_table, outreach_get_sequence, outreach_get_step_options, outreach_edit_step, outreach_pause_campaign, outreach_set_thread_status]
---

# Campaign Optimizer

Launching is the easy part; a campaign earns its keep only if you read it and adjust. This
skill takes a live campaign, finds where it leaks, and fixes the cause rather than cranking
volume on a message that is not landing. You bring the read on what "good" looks like and
what to change; Dreamstate holds the data and applies the change under its caps.

Run `/connect` first if unsure.

## Step 1: Pick the campaign and read the numbers

List campaigns with `outreach_campaigns` and pick the one the user means (or scan the active
ones). Pull `outreach_analytics`:

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

Do not guess. Pull `outreach_get_campaign_table` to see the contacts and where they are
stalling, and `outreach_get_sequence` for the current step graph and its `graph_version`.
Read `outreach_get_step_options` for the step subtypes and opener frameworks available. If a
segment (`metric: "icp"`) is dragging the average down, that is a targeting problem, not a
copy problem; say so.

## Step 3: Act on the cause

Take the smallest change that addresses the bucket:

- **Opener is weak** → edit the DM step's copy with `outreach_edit_step` (pass the
  `campaign_id`, `step_id`, the replacement `data`, and the current `graph_version`; on
  `graph_version_conflict`, re-read with `outreach_get_sequence` and retry). Shorter, more
  specific, more about them.
- **Campaign is structurally off** (wrong audience, burning sender reputation, or being
  replaced) → `outreach_pause_campaign` (`campaign_id`). This runs the in-app kill-switch
  cascade so in-flight instances actually stop, not just a row flip. Pause, fix the targeting
  in a new or reconfigured campaign, relaunch.
- **Threads stuck in the wrong state** → `outreach_set_thread_status` to move replied or dead
  conversations out of the active view so the metrics reflect reality.

## Step 4: Report the change and what to watch

Tell the user exactly what you changed and why, in their terms (the bucket, the fix, the
expected effect). Optimization is iterative: give the change a few days, then re-read
`outreach_analytics` and compare. Change one lever at a time, or you cannot tell what worked.

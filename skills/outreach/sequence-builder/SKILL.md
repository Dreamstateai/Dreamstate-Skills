---
name: sequence-builder
description: "Design a custom multi-step LinkedIn sequence from scratch for a Dreamstate campaign: connection rules, waits, DMs, branches, variables, and reply stops in a validated graph. Use whenever the user wants to build a sequence, design a cadence, define follow-up, or revise an existing graph. It creates one governed, revision-bound proposal and never enrolls, activates, or sends."
---

# Sequence Builder

A sequence is a custom versioned graph: connect, wait, message, branch, stop, and follow
up. Turn the user's intended flow into one reviewable graph proposal bound to an existing
or proposed campaign. Never select, clone, or apply a campaign template or preset. Those
shortcuts belong only to the manual human product UI and are outside this agent skill.

## Step 1: Read the current object and contracts

Use `dreamstate_tools_search` and `dreamstate_tools_get` to discover the exact current
campaign, sequence read, step option, validation, and proposal contracts. For an existing
campaign, inspect the concrete graph revision, nodes, sender/channel binding, variables,
workflow handoff, and status. For a new campaign, consume the coordinator's proposed list
and campaign references; do not create side objects from this skill.

## Step 2: Read the building blocks

Derive available step types, variables, fields, platform rules, and sender constraints
from exact live schemas. Ask one structured popup only for missing material choices:
connection request or direct DM, wait timing, follow-up count, value proposition, reply
stops, exclusions, and sender. Do not silently choose a generic cadence. A possible graph
to discuss, not assume, is:

```
  connection_request ──► wait 1-2d ──► send_dm (opener) ──► wait 3d ──► send_dm (follow-up)
```

## Step 3: Sculpt one custom graph proposal

Create a revision-bound proposal with stable node ids, explicit edges, waits, branches,
reply stops, field references, sender/channel constraints, and the exact expected graph
revision. Show the full graph diff and real-row message previews. The proposal changes
draft structure only; it does not run columns, enroll contacts, activate, or send.

## Step 4: Validate before you hand off

Validate cycles, orphan steps, invalid field references, unresolved variables, platform
limits, sender eligibility, pacing, and reply-stop behavior before presenting the proposal.
On explicit approval, call `dreamstate_proposals_mutate` once with the current revision
and state version, then follow `dreamstate_get_run` to terminal truth. On conflict, re-read
the proposal and campaign graph and present a refreshed diff. Hand the verified draft back
to `/outbound`; approval here never authorizes enrollment, activation, or sends.

## Package resources

- Read [references/operating-guide.md](references/operating-guide.md) for mode-specific boundaries, evidence rules, and recovery.
- Read [examples/example.md](examples/example.md) before the first execution or recommendation.
- Use [evals/contract.json](evals/contract.json) to check routing, approval, and durable-verification behavior.

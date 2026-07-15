---
name: outbound
description: "Design a governed LinkedIn outbound campaign from scratch through Dreamstate: ground the ICP, propose source and table work, build a custom sequence, stage bounded evidence runs, and launch only after explicit approval. Use whenever the user wants cold outreach, a lead list, a new campaign, demos, or pipeline. This orchestrator uses the same revision-bound proposal and durable-run lifecycle as Architect, Claude, and Codex."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: outreach
tier: playbook
tools_used: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_create, dreamstate_proposals_get, dreamstate_proposals_mutate, dreamstate_get_run, dreamstate_list_runs]
---

# Outbound

Turn a target audience into a reviewable custom campaign and, only after explicit staged
approval, a safely paced live motion. Use the compact Dreamstate MCP profile. Every paid
or mutating effect goes through `dreamstate_proposals_create`, human review, one
revision-bound `dreamstate_proposals_mutate`, and durable run inspection.

Never select, clone, or apply a campaign template or preset. Those shortcuts belong only
to the manual human product UI and are outside this agent skill. Build every list, column,
workflow branch, message, wait, and stop rule from the user's requirements and exact live
contracts.

## The pipeline

```
  ICP (you + user)
      │
  /signal-scraper ──► list (rows) ──► /enrich-list (table + firmographics)
      │                                        │
      └──► /lead-prioritizer (score) ──► /hook-writer (openers) ──► /sequence-builder
                                                                          │
                                                  enroll top fits ──► ACTIVATE (capped sends)
                                                                          │
                                                  /reply-triage ◄── analytics (watch the funnel)
```

If the individual skills are installed, defer to each for its detail rather than
duplicating steps. The tool list here lets `/outbound` also run the whole thing on its own.

## Step 0: Inspect before asking

Use `dreamstate_tools_search` and `dreamstate_tools_get` to inspect exact current read,
source, table, workflow, sequence, enrollment, activation, and analytics contracts. For
an existing campaign, read its current list, schema, graphs, sender, status, revision, and
run truth. Derive answers from available workspace context, then ask one structured popup
for only material missing choices: outcome, ICP, exclusions, geography, volume, sender,
channels, qualification threshold, budget, and launch intent.

## Step 1: Prove the source

Create one bounded `outreach_source` proposal for five to ten evidence rows. Bind exact
targeting, exclusions, source capability id and digest, row cap, and credit ceiling. The
pilot writes no list or campaign. Present the proposal and wait for explicit approval;
then follow its `run_id` with `dreamstate_get_run` until terminal truth and inspect the
actual evidence before designing durable structure.

## Step 2: Propose the custom draft structure

Use the evidence to create one dependency-complete `outreach_bundle` proposal. It may
create or revise the draft list, table, workflow, campaign, and custom sequence structure.
For every source, enrichment, formula, AI generation, and action column include exact
inputs, outputs, provider contract and digest, run condition, cost, and dependency edges.
Keep sources, enrichments, formulas, and actions semantically distinct. This proposal must
not run columns, expand the audience, enroll, activate, or send.

## Step 3: Validate on real rows

After the draft exists, create a separate `table_column_run` proposal for exactly five to
ten current contacts. Show the input-to-output mapping, conditions, priority formula,
provider cost, and expected visible columns. Approve and inspect terminal sample output
before proposing broader execution. Missing or poor evidence blocks expansion.

## Step 4: Expand only the reviewed audience

Create an `outreach_bulk_expansion` proposal that binds the exact draft revision, source
evidence run, unchanged targeting, explicit row cap, qualification rule, and credit bound.
It may stage only that resolved result set for the inactive campaign. Approval never
authorizes activation or sending.

## Step 5: Build and validate the custom sequence

Load `/sequence-builder` when messaging is required. Construct each connection, wait, DM,
follow-up, branch, and reply-stop node explicitly from user choices and live contracts.
Bind stable node ids, field references, sender/channel constraints, graph revision, and
real-row copy previews. Validate cycles, orphan nodes, variables, pacing, and stop logic.

## Step 6: Launch through one explicit final gate

Only when the user explicitly requests launch, create an `outreach_activation` proposal
for the exact reviewed campaign/list/sequence revisions, sender binding, eligible rows,
schedule, pacing, exclusions, reply stops, and cost/volume ceilings. State plainly that
approval authorizes external sends. Revalidate all readiness and capability digests before
approval and execution. Poll the returned run; queued or accepted is not completion.

## Step 7: Watch it, do not babysit it

Use exact read contracts and durable runs to inspect delivery, acceptance, replies,
stops, and failures. Never infer sends from activation. Preserve completed work and use
`dreamstate_list_runs` plus proposal/run reads for recovery.

## Guardrails worth stating to the user

- Approval of one stage never authorizes a later stage.
- A proposal is not execution; approval is not completion; activation is not proof of a
  send.
- Every external send is a real action by the selected account. Preserve suppression,
  sender health, pacing, reply stops, and workspace boundaries.

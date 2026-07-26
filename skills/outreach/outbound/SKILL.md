---
name: outbound
description: "Run a full LinkedIn outbound campaign end to end through Dreamstate: source leads, build the lead table, enrich and score against an ICP, write personalized openers, build the sequence, and launch under safe per-account caps. Use whenever the user wants cold outreach, to prospect on LinkedIn, build a lead list, 'start a campaign', book demos, or generate pipeline. This is the orchestrator over the pipeline stages; it routes every real action through Dreamstate, which sends at scale within deliverability limits."
---

# Outbound

This is the orchestrator: turn a target audience into a live, personalized LinkedIn
campaign that sends safely. It runs the pipeline stages in order, each of which is also a
standalone skill you can drop to for detail. You bring the judgment (who to target, what
makes a good opener, when to launch); Dreamstate brings the hands (sourcing, enrichment,
sending under per-account caps you cannot bypass).

Run `/connect` first if unsure. You need a healthy connected LinkedIn account.

The dotted names below are canonical capability IDs. Inspect their live contracts with
`dreamstate_tools_get`, invoke them with `dreamstate_tools_run`, and follow asynchronous work
with `dreamstate_get_run`.

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

## Step 0: Pin the ICP first

Sourcing the wrong people wastes credits and burns sender reputation. Get the user to
commit to a crisp ICP before anything else: titles/seniority, company shape (industry,
size, geography), a one-line "why now" signal if there is one, and what disqualifies a
lead. Write it down in the chat; it is the rubric you score against later. If the user has
an `icp.json`, read it instead of asking.

## Step 1: Source (→ /signal-scraper)

Pick a healthy LinkedIn account with `social.accounts_list`. Create a workbook and first
worksheet/table with `workbooks.create`, then source rows with `sources.find_leads` (pass
`account_id` and the exact workbook/worksheet/view destination; use the user's LinkedIn search
URL if they have one). Start with a small `limit` and check quality with `contacts.list` before scaling.

## Step 2: Build the table and enrich (→ /enrich-list)

Enrich kept contacts with `contacts.enrich` and read fields with `contacts.get`. Add the
columns the pipeline needs with `columns.add` and write per-row values with `cells.settle`,
including provenance. `rows.query` is the
Clay-style view of rows x columns.

## Step 3: Score against the ICP (→ /lead-prioritizer)

Rate each contact against the Step 0 rubric and persist it: an `icp_fit` column containing
`0-100` or `null` (`columns.add` once, then `cells.settle` per row), plus components,
`fit_reason`, evidence, confidence, and the exact function/prompt revision. Never invent a
score when evidence is missing. Drop
low-fit rows. A tight list of 30 great fits beats 300 maybes; the sends are capped, so
weak rows cost real sends.

## Step 4: Write openers (→ /hook-writer)

For the top tier, draft a personalized opener with `contacts.draft_opener` (an opener
`framework_id` from `sequences.step_options`, plus the `campaign_id`) and save it to an
`opener` column. Show the user the first few to calibrate voice.

## Step 5: Build and validate the sequence (→ /sequence-builder)

Create the campaign (`workflows.create`, bound to the frozen worksheet/view), configure
targeting (`workflows.graph_apply`), and wire the steps with `sequences.add_step`, threading
the `graph_version` from `sequences.get` forward and retrying on
`graph_version_conflict`. A solid cold cadence: connection_request → wait → DM (opener) →
wait → DM (follow-up). Run `sequences.validate` and fix anything it flags.

## Step 6: Enroll and launch

Freeze the approved workbook/worksheet/saved-view selection and enroll it once with
`sequences.enroll_selection` through a unique idempotency key. Enrollment does not send; the engine
drains enrollments under per-account daily caps and reserves any connection slot at
dispatch. Then `workflows.activate`: the one outward action, through the same
activation gate the app uses. `status: "blocked"` means it did NOT start (read the gate
reason and fix it); `status: "accepted"` means the capped engine has begun.

Confirm to the user in plain terms: how many enrolled, which account is sending, the
cadence, and that sending is paced under daily caps (not a blast).

## Step 7: Watch it, do not babysit it

After a day or two, read `outreach.workspace_stats_get` for reply rate,
acceptance rate, sends, demos. If reply rate is weak, the lever is usually the opener or
the targeting, not the volume. Use `metric: "icp"` or `"signal_source"` to see which
segment responds and double down. Route the responses through `/reply-triage`.

## Guardrails worth stating to the user

- Sending is capped per account by Dreamstate and you cannot raise those caps from here.
  That protects their LinkedIn standing. Frame "at scale" as "as fast as is safe", not
  unlimited.
- Every send is a real action taken as the user's connected account. Confirm the opener
  copy and the target list with the user before Step 6 if there is any doubt.

## Package resources

- Read [references/operating-guide.md](references/operating-guide.md) for mode-specific boundaries, evidence rules, and recovery.
- Read [examples/example.md](examples/example.md) before the first execution or recommendation.
- Use [evals/contract.json](evals/contract.json) to check routing, approval, and durable-verification behavior.

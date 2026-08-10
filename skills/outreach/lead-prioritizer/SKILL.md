---
name: lead-prioritizer
description: "Score and tier the rows in a Dreamstate list against an ICP, and write the scores back as columns so the list sorts by who to reach first. Use whenever the user wants to 'score my leads', 'prioritize this list', rank by fit, tier prospects, or decide who to enroll first. Stage 3 of the pipeline: pure judgment over an already-enriched table, no sourcing or sending. Scoring is yours to do; Dreamstate stores it on each row."
---

# Lead Prioritizer

Not every row deserves the same effort. This stage rates each person against the ICP and
writes the verdict back onto the table, so the user can enroll the best fits first and
skip the long tail. This is exactly the judgment Dreamstate cannot do for you: it holds
the data, you decide what "good fit" means and apply it consistently.

Run `/connect` first if unsure. Works best on a list that has already been through
`/enrich-list`, so there are firmographics to score on.

The dotted names below are canonical capability IDs. Inspect their live contracts with
`ds_search` (`scope: 'capabilities', include_schema: true`) and invoke them with `ds_api`
(`action: 'run'`) using the minted `capability_ref`.

## Step 1: Pin the rubric

Score against something explicit, or the numbers are noise. Confirm the ICP with the user
(or read their `icp.json` if they have one) and turn it into a rubric:

- The must-haves (title/seniority, company size band, industry, geography).
- The "why now" signal, if any (raised, hiring, switched tools).
- The disqualifiers (agencies, students, competitors, wrong region).

Use the canonical fit-score contract: `0-100` or `null`. Persist components, reasons,
evidence, confidence, and the exact function/prompt revision beside the score. Return `null`
when required evidence is missing rather than fabricating precision. State the rubric before
you start so the scores mean the same thing on every row.

## Step 2: Read the rows

Pull the table with `rows.query` (or `contacts.list` for the roster), and `contacts.get`
for the enriched detail on each person. If many rows
are missing firmographics, say so and suggest running `/enrich-list` first; scoring on
empty fields just launders guesses.

## Step 3: Score and persist

Add the scoring columns once with `columns.add`, then write each row with `cells.settle`,
including the score function/prompt revision and evidence provenance:

- `icp_fit` — the `0-100` score or `null`.
- `fit_reason` and supporting fields — why, components, evidence, confidence, and revision,
  so the score is auditable and the user can recalibrate the rubric if they disagree.

Score honestly. A tight set of 30 strong fits beats 300 maybes: the downstream sends are
capped per account, so spending those sends on weak rows is the real cost.

## Step 4: Hand back a ranked table

Summarize the distribution (how many in each tier / score band) and name the top fits.
Tell the user the list is now sortable by `icp_fit` and ready for `/hook-writer` (write
openers for the top tier first) or `/outbound` (enroll the top tier). If you disqualified
anyone, say who and why rather than silently dropping them.

## Package resources

- Read [references/operating-guide.md](references/operating-guide.md) for mode-specific boundaries, evidence rules, and recovery.
- Read [examples/example.md](examples/example.md) before the first execution or recommendation.
- Use [evals/contract.json](evals/contract.json) to check routing, approval, and durable-verification behavior.

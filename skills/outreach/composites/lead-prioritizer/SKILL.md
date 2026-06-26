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

## Step 1: Pin the rubric

Score against something explicit, or the numbers are noise. Confirm the ICP with the user
(or read their `icp.json` if they have one) and turn it into a rubric:

- The must-haves (title/seniority, company size band, industry, geography).
- The "why now" signal, if any (raised, hiring, switched tools).
- The disqualifiers (agencies, students, competitors, wrong region).

Decide a simple, defensible scale up front, e.g. a 1-5 fit score, or TIER_1..TIER_4
bands. State it to the user before you start so the scores mean the same thing on every
row.

## Step 2: Read the rows

Pull the table with `outreach_get_campaign_table` (or `outreach_list_contacts` for the
roster), and `outreach_get_contact` for the enriched detail on each person. If many rows
are missing firmographics, say so and suggest running `/enrich-list` first; scoring on
empty fields just launders guesses.

## Step 3: Score and persist

Add the scoring columns once with `outreach_add_column` (`kind: "freeform"`), then write
each row with `outreach_set_cell`:

- `icp_fit` — the score or tier.
- `fit_reason` — one line on why, so the score is auditable and the user can recalibrate
  the rubric if they disagree.

Score honestly. A tight set of 30 strong fits beats 300 maybes: the downstream sends are
capped per account, so spending those sends on weak rows is the real cost.

## Step 4: Hand back a ranked table

Summarize the distribution (how many in each tier / score band) and name the top fits.
Tell the user the list is now sortable by `icp_fit` and ready for `/hook-writer` (write
openers for the top tier first) or `/outbound` (enroll the top tier). If you disqualified
anyone, say who and why rather than silently dropping them.

---
name: signal-scraper
description: "Find in-market leads by buying signal and pull them into a Dreamstate list, one row per person. Use whenever the user wants to 'find leads', 'who's hiring / raised / switched tools', source a list from a LinkedIn search or signal, or fill the top of the funnel. This is stage 1 of the outbound pipeline: it only sources rows into the table, it does not enrich, score, or send. You cannot search LinkedIn yourself; Dreamstate runs the search through a connected account."
---

# Signal Scraper

The top of the funnel is a targeting decision, not a volume one. The job here is to
turn "who is worth reaching" into actual rows in a Dreamstate list: real people, sourced
through a connected LinkedIn account, ready for the rest of the pipeline to enrich and
score. You bring the read on what "in-market" looks like; Dreamstate runs the search and
writes the rows.

Run `/connect` first if unsure. You need a healthy LinkedIn account to source through.

The dotted names below are canonical capability IDs. Inspect their live contracts with
`dreamstate_tools_get`, invoke them with `dreamstate_tools_run`, and follow asynchronous work
with `dreamstate_get_run`.

## Step 1: Pick the account and the destination list

Call `social.accounts_list` and keep a healthy LinkedIn `account_id` (the search runs
through it). Create the destination workbook and first worksheet/table with
`workbooks.create`, or reuse one via `tables.list`. Keep the exact workbook, worksheet, and
view identities so sourced people land in one auditable table.

## Step 2: Decide the signal, not just the title

A "signal" is the *why now* that makes someone worth reaching today. Get the user to
name one rather than sourcing on title alone:

- **Hiring** — open roles that imply the pain you solve.
- **Funding / growth** — raised, expanding, new market.
- **Tech / tooling change** — adopted or dropped a tool adjacent to yours.
- **Engagement** — interacted with a relevant post, viewed a profile, changed jobs.

Call `outreach.triggers_supported_list` to see which signals this workspace can target. If the
user only has a plain ICP (titles + company shape), that is fine — source on filters and
treat the signal as "none", but say so, because a no-signal list converts worse.

## Step 3: Source the rows

Call `sources.find_leads`:

- Always pass `account_id` and the destination workbook/worksheet/view identities.
- Use `filters` (keywords, title, company, location, industry, seniority) for a
  structured search, OR `raw_search_url` if the user already has a LinkedIn people-search
  URL. Prefer their URL when they have one; it captures intent your filters might miss.
- Start with a small `limit` (e.g. 20) to sanity-check quality before scaling.

`sources.find_leads` is bounded-sync: it may return rows directly, or a run id with
`status: "working"` for the slow path. If working, tell the user it is sourcing and
re-list shortly rather than blocking.

## Step 4: Sanity-check before handing off

Read the first batch with `contacts.list`. If the people are off-ICP, fix the
filters and re-source now, before anyone spends enrichment credits on them. Garbage
sourced here is expensive to clean downstream.

Report what landed: how many rows, the list id, the signal/filters used, and a few
example names so the user can eyeball fit. Then hand off: this list is ready for
`/enrich-list` (firmographics + the Clay columns) and `/lead-prioritizer` (ICP scoring),
or straight into `/outbound` if the user wants the whole pipeline.

## Package resources

- Read [references/operating-guide.md](references/operating-guide.md) for mode-specific boundaries, evidence rules, and recovery.
- Read [examples/example.md](examples/example.md) before the first execution or recommendation.
- Use [evals/contract.json](evals/contract.json) to check routing, approval, and durable-verification behavior.

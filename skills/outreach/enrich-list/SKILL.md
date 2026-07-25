---
name: enrich-list
description: "Build a Clay-style table in Dreamstate: one row per person, the columns you want, enriched with firmographics. Use whenever the user wants to 'enrich these leads', 'build a lead table', 'clean up my list', add firmographics, map an uploaded CSV into Dreamstate, or prep a list before outreach. Stage 2 of the pipeline: it shapes the table and fills it, no scoring or sending. You cannot enrich data yourself; Dreamstate calls the providers under a daily spend cap."
---

# Enrich List

Think of a Dreamstate list as a spreadsheet you can program: each lead is a row, and you
add the columns you care about. This is the Clay-style table the rest of the pipeline
reads and writes. The job here is to get the people in, shape the columns, and fill them
with real firmographics, so later stages have something to score and personalize against.
You decide what the table should hold; Dreamstate stores the rows and enriches them.

Run `/connect` first if unsure.

## Step 1: Get the rows in

There are three ways people arrive in the table:

- **Already in Dreamstate** — find the list with `tables.list` and keep its `id`.
- **Source fresh** — create one with `tables.create`, then use
  `sources.find_leads` (healthy `account_id` from `social.accounts_list`, destination
  `list_id`). For signal-based sourcing, defer to `/signal-scraper`.
- **From the user's own data (a CSV / paste)** — create a list, then add a row per
  person and write their known fields with `cells.settle` (see Step 2). Map the
  user's headers onto Dreamstate fields first; only `name` (or first/last) is truly
  required, everything else is a column you fill or enrich.

Confirm the roster with `contacts.list`.

## Step 2: Shape the columns (the Clay part)

Decide what each row should hold beyond the built-in contact fields. Add a column once
with `columns.add` and reuse it for every row:

- `kind: "freeform"` for text/number values you or the user write (e.g.
  `key: "persona"`, `key: "account_tier"`, `key: "notes"`).
- Rename or retype later with `columns.update` rather than piling on duplicates, and
  `columns.archive` to clear out a stray or experimental column so the table stays clean.

Keep the schema tight and intentional: a column exists because a later stage reads it
(`/lead-prioritizer` writes `icp_fit`, `/hook-writer` writes `opener`). Don't add columns
nothing consumes. Write per-row values with `cells.settle` (`column_key`,
`contact_id`, `value`).

## Step 3: Enrich the firmographics

For each contact worth keeping, call `contacts.enrich` (1 credit each,
off-account, bounded by the daily spend cap) to fill title, company, size, industry, and
the other provider fields. Read what came back with `contacts.get`.

If the list is large, enrich the highest-priority rows first, so a cap pause still leaves
the user with the leads that matter. Note any rows left un-enriched so nothing is
silently missing.

## Step 4: Hand back a clean table

Read the table with `tables.get` (the Clay view: rows x columns) and
summarize: how many rows, which columns are populated, how many enriched, and a few
example rows. Tell the user the list is ready for `/lead-prioritizer` (scoring) and
`/hook-writer` (openers), or to drop straight into `/outbound`.

## Package resources

- Read [references/operating-guide.md](references/operating-guide.md) for mode-specific boundaries, evidence rules, and recovery.
- Read [examples/example.md](examples/example.md) before the first execution or recommendation.
- Use [evals/contract.json](evals/contract.json) to check routing, approval, and durable-verification behavior.

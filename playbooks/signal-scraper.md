---
name: signal-scraper
description: "Find in-market leads by buying signal and pull them into a Dreamstate list, one row per person. Use whenever the user wants to 'find leads', 'who's hiring / raised / switched tools', source a list from a LinkedIn search or signal, or fill the top of the funnel. This is stage 1 of the outbound pipeline: it only sources rows into the table, it does not enrich, score, or send. You cannot search LinkedIn yourself; Dreamstate runs the search through a connected account."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: outreach
tier: capability
tools_used: [outreach_list_signal_types, outreach_find_leads, outreach_create_list, outreach_lists, outreach_list_contacts, content_list_accounts]
---

# Signal Scraper

The top of the funnel is a targeting decision, not a volume one. The job here is to
turn "who is worth reaching" into actual rows in a Dreamstate list: real people, sourced
through a connected LinkedIn account, ready for the rest of the pipeline to enrich and
score. You bring the read on what "in-market" looks like; Dreamstate runs the search and
writes the rows.

Run `/connect` first if unsure. You need a healthy LinkedIn account to source through.

## Step 1: Pick the account and the destination list

Call `content_list_accounts` and keep a healthy LinkedIn `account_id` (the search runs
through it). Create the destination with `outreach_create_list` (`kind: "manual"` for a
static list you control), or reuse an existing one via `outreach_lists`. Keep the
`list_id` so sourced people land in one table.

## Step 2: Decide the signal, not just the title

A "signal" is the *why now* that makes someone worth reaching today. Get the user to
name one rather than sourcing on title alone:

- **Hiring** — open roles that imply the pain you solve.
- **Funding / growth** — raised, expanding, new market.
- **Tech / tooling change** — adopted or dropped a tool adjacent to yours.
- **Engagement** — interacted with a relevant post, viewed a profile, changed jobs.

Call `outreach_list_signal_types` to see which signals this workspace can target. If the
user only has a plain ICP (titles + company shape), that is fine — source on filters and
treat the signal as "none", but say so, because a no-signal list converts worse.

## Step 3: Source the rows

Call `outreach_find_leads`:

- Always pass `account_id` and the destination `list_id`.
- Use `filters` (keywords, title, company, location, industry, seniority) for a
  structured search, OR `raw_search_url` if the user already has a LinkedIn people-search
  URL. Prefer their URL when they have one; it captures intent your filters might miss.
- Start with a small `limit` (e.g. 20) to sanity-check quality before scaling.

`outreach_find_leads` is bounded-sync: it may return rows directly, or a job id with
`status: "working"` for the slow path. If working, tell the user it is sourcing and
re-list shortly rather than blocking.

## Step 4: Sanity-check before handing off

Read the first batch with `outreach_list_contacts`. If the people are off-ICP, fix the
filters and re-source now, before anyone spends enrichment credits on them. Garbage
sourced here is expensive to clean downstream.

Report what landed: how many rows, the list id, the signal/filters used, and a few
example names so the user can eyeball fit. Then hand off: this list is ready for
`/enrich-list` (firmographics + the Clay columns) and `/lead-prioritizer` (ICP scoring),
or straight into `/outbound` if the user wants the whole pipeline.

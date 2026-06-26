---
name: dreamstate-enrich-list
description: "Take a list of leads and enrich + score it in Dreamstate's data table without launching a campaign. Use whenever the user wants to 'enrich these leads', 'clean up my list', add firmographics, score contacts against an ICP, or prep a list before outreach. A focused building block: source/enrich/score only, no sending. You cannot enrich data yourself; Dreamstate calls the providers under a daily spend cap."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: outreach
tier: composite
tools_used:
  [
    outreach_lists,
    outreach_create_list,
    outreach_find_leads,
    outreach_list_contacts,
    outreach_get_contact,
    outreach_enrich_contact,
    outreach_get_campaign_table,
    outreach_add_column,
    outreach_set_cell,
    content_list_accounts,
  ]
---

# Dreamstate Enrich List

Sometimes the user just wants a clean, scored list, not a launched campaign. This is
that building block: get the people in, add firmographics, and score them against the
ICP so the list is ready to act on later. No sequence, no sending.

Run `/dreamstate-connect` first if unsure.

## Step 1: Get the contacts in

If the user already has a Dreamstate list, find it with `outreach_lists`. If they want
a fresh one, create it with `outreach_create_list`. To source new people, use
`outreach_find_leads` with a healthy `account_id` (from `content_list_accounts`) and
the destination `list_id`. Confirm the roster with `outreach_list_contacts`.

## Step 2: Enrich

For each contact, call `outreach_enrich_contact` (1 credit each, off-account, bounded
by the daily spend cap). Read the enriched fields with `outreach_get_contact`. If the
list is large, enrich the highest-priority contacts first so a cap pause still leaves
the user with the leads that matter.

## Step 3: Score and persist

Score each contact against the user's ICP rubric (confirm the rubric first if they have
not given one). Persist the score so it survives this session and is visible in the UI:

- Add a column once with `outreach_add_column` (`kind: "freeform"`, e.g.
  `key: "icp_fit"`, `label: "ICP fit"`). Add a `key: "fit_reason"` column too if the
  user wants the why.
- Write each score with `outreach_set_cell` (`column_key`, `contact_id`, `value`).

## Step 4: Hand back a clean view

Read the table with `outreach_get_campaign_table` (or `outreach_list_contacts`) and
summarize: how many enriched, the score distribution, and the top-fit contacts by name.
Tell the user the list is ready to drop into `/dreamstate-outbound` when they want to
launch. Note any contacts left un-enriched if the daily cap paused you, so nothing is
silently missing.

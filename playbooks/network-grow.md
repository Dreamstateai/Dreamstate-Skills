---
name: network-grow
description: "Grow a LinkedIn network with the right people: source or take a targeted list, write a short personalized note per person, and send connection requests under the per-account ramp cap. Use whenever the user wants to 'grow my network', 'send connection requests', 'connect with' a set of people, or warm an audience without a full DM sequence. A lighter motion than /outbound: connections only, no follow-up cadence. You pick who and the note; Dreamstate sends the invites under its caps."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: outreach
tier: composite
tools_used: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_tools_run, dreamstate_get_run]
capability_ids: [social.accounts_list, workbooks.create, tables.create, tables.list, sources.find_leads, contacts.list, contacts.get, contacts.enrich, workflows.create, contacts.draft_opener, contacts.send_connection]
---

# Network Grow

Sometimes the goal is not a sequence, it is just to be connected to the right people: future
buyers, event attendees, a community, people who engaged with a post. This skill sources or
takes a list, writes a short genuine note per person, and sends connection requests, capped so
the account stays healthy. You decide who is worth a request and what the note says; Dreamstate
fires the invites.

Run `/connect` first if unsure. You need a healthy LinkedIn account.

The dotted names below are canonical capability IDs. Inspect their live contracts with
`dreamstate_tools_get`, invoke them with `dreamstate_tools_run`, and follow asynchronous work
with `dreamstate_get_run`.

## Step 1: Account and audience

Get a healthy LinkedIn `account_id` from `social.accounts_list`. Then get the people into a
list:

- Reuse an existing workbook/table with `tables.list`, or
- Create one with `workbooks.create` and source with `sources.find_leads` (pass `account_id`
  and the exact workbook/worksheet/view destination; use the user's LinkedIn search URL if
  they have one).

Confirm the roster with `contacts.list`. Optionally enrich with `contacts.enrich` if you want
titles/companies to personalize the note well.

## Step 2: A connection campaign is the vehicle

`contacts.send_connection` is enroll-only: it queues each invite through a connection campaign,
and the engine reserves the slot and fires it under its own ramp cap at dispatch (it never
sends directly, and you cannot raise that cap from here). So create a lightweight campaign with
`workflows.create` bound to a frozen worksheet/view to act as the sender vehicle, or reuse an existing
connection campaign. Keep its `campaign_id`.

## Step 3: Write a note worth accepting

The connection note is short and the whole pitch. Per contact, read context with
`contacts.get` and draft a one-liner with `contacts.draft_opener`: a real reason you
want to connect (shared interest, their work, the event), not a disguised sales pitch. People
accept humans, not funnels. Show the user the first few notes to set the voice; these go out
as them.

## Step 4: Send under the cap

For each contact, call `contacts.send_connection` (`contact_id`, `campaign_id`, `account_id`)
through `dreamstate_tools_run` with a unique idempotency key. It returns
`accepted | queued | blocked`:

- `accepted` / `queued` — the engine has it and will send under the ramp cap.
- `blocked` — the daily/ramp cap is reached or the account is unhealthy. Stop and queue the
  rest for tomorrow rather than forcing it; connection-request limits are exactly what protects
  the account from restriction.

## Step 5: Report

Tell the user how many requests went out, how many were queued vs blocked by the cap, and
which account sent them. If they want to follow up with accepted connections later, that is a
DM motion, hand off to `/outbound` (a full sequence) or `/reply-triage` once people respond.

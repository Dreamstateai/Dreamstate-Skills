---
name: network-grow
description: "Grow a LinkedIn network with the right people: source or take a targeted list, write a short personalized note per person, and launch a connection-only workflow under the per-account ramp cap. Use whenever the user wants to 'grow my network', 'send connection requests', 'connect with' a set of people, or warm an audience without a DM cadence. You pick who and the note; Dreamstate enrolls the frozen selection and dispatches through its governed workflow runtime."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: outreach
tier: composite
tools_used: [ds_search, ds_api]
capability_ids: [social.accounts_list, workbooks.create, tables.create, tables.list, sources.find_leads, contacts.list, contacts.get, contacts.enrich, workflows.create, workflows.get, workflows.node_registry, workflows.graph_apply, workflows.validate_graph, workflows.draft_publish, workflows.activate, sequences.step_options, sequences.validate, sequences.enroll_selection, contacts.draft_opener]
---

# Network Grow

Sometimes the goal is not a DM sequence, it is just to be connected to the right people:
future buyers, event attendees, a community, people who engaged with a post. This skill
sources or takes a list, writes a short genuine note per person, and dispatches connection
requests through a connection-only workflow, capped so the account stays healthy. You decide
who is worth a request and what the note says; Dreamstate freezes the selection, enrolls it
once, and dispatches through the governed runtime.

Run `/connect` first if unsure. You need a healthy LinkedIn account.

The dotted names below are canonical capability IDs. Inspect their live contracts with
`ds_search` (`scope: 'capabilities', include_schema: true`) and invoke them with `ds_api`
(`action: 'run'`) using the minted `capability_ref`.

## Step 1: Account and audience

Get a healthy LinkedIn `account_id` from `social.accounts_list`. Then get the people into a
list:

- Reuse an existing workbook/table with `tables.list`, or
- Create one with `workbooks.create` and source with `sources.find_leads` (pass `account_id`
  and the exact workbook/worksheet/view destination; use the user's LinkedIn search URL if
  they have one).

Confirm the roster with `contacts.list`. Optionally enrich with `contacts.enrich` if you want
titles/companies to personalize the note well.

## Step 2: A connection-only workflow is the vehicle

Create a lightweight workflow with `workflows.create` bound to the frozen worksheet/view
selection, or reuse an existing connection-only workflow. Inspect `workflows.node_registry`,
then apply a graph containing only the connection-request action and its required safety/stop
edges with `workflows.graph_apply` against the exact revision returned by `workflows.get`.
Validate it with `workflows.validate_graph` and `sequences.validate`. Do not add a DM or
follow-up branch.

## Step 3: Write a note worth accepting

The connection note is short and the whole pitch. Per contact, read context with
`contacts.get` and draft a one-liner with `contacts.draft_opener`: a real reason you
want to connect (shared interest, their work, the event), not a disguised sales pitch. People
accept humans, not funnels. Show the user the first few notes to set the voice; these go out
as them.

## Step 4: Enroll once and activate under the cap

Publish the reviewed workflow draft with `workflows.draft_publish`. Freeze the approved
workbook/worksheet/view selection and enroll it once with `sequences.enroll_selection` using a
unique idempotency key. Enrollment does not send. Activate the exact published workflow version
with `workflows.activate`; this is the outward consequence and must follow the server's
ActionDecision. The engine reserves each connection slot at dispatch and paces the account
under its ramp cap. A blocked activation means nothing started: report the exact gate and do
not route around it.

## Step 5: Report

Tell the user how many contacts were enrolled, the durable activation/run state, how many
dispatches were paced or blocked by the cap, and which account owns the workflow. If they want
to follow up with accepted connections later, that is a
DM motion, hand off to `/outbound` (a full sequence) or `/reply-triage` once people respond.

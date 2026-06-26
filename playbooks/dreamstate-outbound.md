---
name: dreamstate-outbound
description: "Run a full LinkedIn outbound campaign end to end through Dreamstate: source leads, enrich and score them against an ICP, draft personalized openers, build the sequence, and launch under safe per-account caps. Use whenever the user wants to do cold outreach, prospect on LinkedIn, build a lead list, 'start a campaign', book demos, or generate pipeline. You cannot touch LinkedIn yourself, so this skill routes every real action through Dreamstate, which sends at scale within deliverability limits."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: outreach
tier: playbook
tools_used:
  [
    outreach_find_leads,
    outreach_create_list,
    outreach_lists,
    outreach_list_contacts,
    outreach_get_contact,
    outreach_enrich_contact,
    outreach_create_campaign,
    outreach_configure_targeting,
    outreach_get_sequence,
    outreach_get_step_options,
    outreach_add_step,
    outreach_validate_sequence,
    outreach_draft_message,
    outreach_add_column,
    outreach_set_cell,
    outreach_enroll,
    outreach_activate_campaign,
    content_list_accounts,
    outreach_analytics,
  ]
---

# Dreamstate Outbound

This is an outcome, not a single tool call: turn a target audience into a live,
personalized LinkedIn campaign that sends safely. You bring the judgment (who to
target, what makes a good opener, when to launch). Dreamstate brings the hands
(sourcing, enrichment, sending under per-account caps you cannot bypass).

Run `/dreamstate-connect` first if you are not sure the connection is live. You need
a healthy connected LinkedIn account for sourcing and sending.

## The shape of the run

```
  ICP (you + user)
      │
  source leads ──► list ──► enrich ──► score vs ICP ──► draft openers
      │                                                      │
      └────────────► campaign ◄── sequence ◄── targeting ────┘
                        │
                     enroll  ──►  ACTIVATE (capped engine sends)
                        │
                     analytics (watch reply + acceptance rate)
```

## Step 0: Pin the ICP before sourcing anything

Sourcing the wrong people wastes credits and burns sender reputation. Get the user
to commit to a crisp ICP first. If they are vague, propose one and confirm:

- Titles / seniority (e.g. "Head of Growth, VP Marketing").
- Company shape (industry, size band, geography).
- A one-line "why now" signal if there is one (hiring, raised, switched tools).
- What disqualifies a lead (agencies, students, competitors).

Write this down in the chat. It is the rubric you will score against in Step 3.

## Step 1: Pick the sending account

Call `content_list_accounts`. Choose a healthy LinkedIn account and keep its
`account_id`; you need it for sourcing and it binds the campaign's sender. If none is
healthy, stop and tell the user to reconnect one in Dreamstate. Do not proceed.

## Step 2: Create a list and source leads

Create a destination list with `outreach_create_list` (`kind: "manual"` for a static
list you control). Keep its `id`.

Source leads with `outreach_find_leads`:

- Always pass `account_id` (the search runs through that connected account).
- Pass `list_id` so sourced contacts land in your list.
- Use `filters` (keywords, title, company, location, industry, seniority) for a
  structured search, OR `raw_search_url` if the user already has a LinkedIn
  people-search URL. Prefer their URL when they have one; it captures intent your
  filters might miss.
- Start with a small `limit` (e.g. 20) to sanity-check quality before scaling.

`outreach_find_leads` is bounded-sync: it may return rows directly, or a job id with
`status: "working"` for the slow path. If working, tell the user it is sourcing and
re-list the list contents with `outreach_list_contacts` shortly after rather than
blocking.

Review the first batch with `outreach_list_contacts`. If the people are off-ICP,
fix the filters and re-source before spending enrichment credits. Garbage in is
expensive here.

## Step 3: Enrich, then score against the ICP

For each contact worth keeping, call `outreach_enrich_contact` (1 credit, off-account,
bounded by the key's daily spend cap) to add firmographics. Read enriched fields with
`outreach_get_contact`.

Now score. This is the judgment Dreamstate cannot do for you: rate each contact
against the Step 0 rubric (e.g. 1-5 fit). Persist the score so it is visible and
reusable, not just in your head:

- Add a column once with `outreach_add_column` (`kind: "freeform"`, e.g.
  `key: "icp_fit"`, `label: "ICP fit"`).
- Write each contact's score with `outreach_set_cell` (`column_key: "icp_fit"`).

Drop or skip low-fit contacts. A tight list of 30 great fits beats 300 maybes.

## Step 4: Create the campaign and configure targeting

Create the campaign with `outreach_create_campaign`, bound to your list
(`outreach_list_id`). Choose `campaign_kind`:

- `cold_outbound` — you are targeting by ICP / LinkedIn search (the usual choice
  here, since you sourced a concrete list).
- `intent_signals` — only if the user wants signal-triggered enrollment (engaged with
  a post, viewed profile, changed jobs). If so, list options with
  `outreach_list_signal_types` first.

Configure with `outreach_configure_targeting`:

- For `cold_outbound`: pass `cold_targeting_config` (ICP roles/seniority, exclusions,
  location) and/or `linkedin_search_config`.
- For `intent_signals`: you MUST read `outreach_get_sequence` first to get
  `graph_version`, then pass `signal_config` together with that exact `graph_version`
  (it is a compare-and-set; a stale value returns `graph_version_conflict`, so
  re-read and retry).

## Step 5: Build the sequence

Read the building blocks with `outreach_get_step_options` (action subtypes like
`send_connection_request`, `send_dm`, `wait`; opener frameworks; the campaign's
variable tokens). Read the current graph + `graph_version` with
`outreach_get_sequence`.

A solid default cadence for cold LinkedIn:

```
  connection_request ──► wait 1-2d ──► send_dm (opener) ──► wait 3d ──► send_dm (follow-up)
```

Add each step with `outreach_add_step`, passing the `node` and the current
`graph_version`, and `after_step_id` to wire it onto the previous step. The
`graph_version` you pass must be the latest you read; every successful add returns a
new `graph_version`, so thread it forward. On `graph_version_conflict`, re-read with
`outreach_get_sequence` and retry with the fresh version.

Personalize the opener. For a representative contact, call `outreach_draft_message`
with an opener `framework_id` (from step options, e.g. `post_reference`) and the
`campaign_id` so it uses the campaign's messaging config. Use the draft to set the
step's message copy and to show the user the voice before launch. Keep openers short,
specific, and about the prospect, not you.

Validate before you launch: `outreach_validate_sequence`. It runs the same structural
checks activation does (cycles, orphan steps, unwired branches). Fix anything it
flags. A campaign that fails validation will be rejected at activation anyway.

## Step 6: Enroll and launch

Enroll your scored, kept contacts with `outreach_enroll` (one call per contact;
pass a unique `client_request_id` per enroll so retries are idempotent). Enroll does
not send — the engine drains enrollments under per-account daily caps and reserves
any connection slot at dispatch.

Activate with `outreach_activate_campaign`. This is the one outward action and it
routes through the same activation gate the in-app flow uses. If it returns
`status: "blocked"`, read the gate reason (unconfigured campaign, missing
signal/contacts) and fix that; it did NOT start sending. `status: "accepted"` means
the capped engine has begun.

Confirm the launch to the user in plain terms: how many enrolled, which account is
sending, the cadence, and that sending is paced under daily caps (not a blast).

## Step 7: Watch it, do not babysit it

After a day or two, read `outreach_analytics` (`metric: "overview"`) for reply rate,
acceptance rate, sends, and demos. If reply rate is weak, the lever is usually the
opener or the targeting, not the volume. Use `metric: "icp"` or `"signal_source"` to
see which segment is responding and double down there. Tighten and relaunch rather
than cranking volume on a message that is not landing.

## Guardrails worth stating to the user

- Sending is capped per account by Dreamstate and you cannot raise those caps from
  here. That protects their LinkedIn standing. Frame "at scale" as "as fast as is
  safe", not unlimited.
- Every send is a real action taken as the user's connected account. Confirm the
  opener copy and the target list with the user before Step 6 if there is any doubt.

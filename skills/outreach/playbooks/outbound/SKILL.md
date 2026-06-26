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

Pick a healthy LinkedIn account with `content_list_accounts`. Create a list with
`outreach_create_list` and source rows with `outreach_find_leads` (pass `account_id` and
`list_id`; use the user's LinkedIn search URL if they have one). Start with a small `limit`
and check quality with `outreach_list_contacts` before scaling.

## Step 2: Build the table and enrich (→ /enrich-list)

Enrich kept contacts with `outreach_enrich_contact` and read fields with
`outreach_get_contact`. Add the columns the pipeline needs with `outreach_add_column` and
write per-row values with `outreach_set_cell`. `outreach_get_campaign_table` is the
Clay-style view of rows x columns.

## Step 3: Score against the ICP (→ /lead-prioritizer)

Rate each contact against the Step 0 rubric and persist it: an `icp_fit` column
(`outreach_add_column` once, then `outreach_set_cell` per row), plus a `fit_reason`. Drop
low-fit rows. A tight list of 30 great fits beats 300 maybes; the sends are capped, so
weak rows cost real sends.

## Step 4: Write openers (→ /hook-writer)

For the top tier, draft a personalized opener with `outreach_draft_message` (an opener
`framework_id` from `outreach_get_step_options`, plus the `campaign_id`) and save it to an
`opener` column. Show the user the first few to calibrate voice.

## Step 5: Build and validate the sequence (→ /sequence-builder)

Create the campaign (`outreach_create_campaign`, bound to the list), configure targeting
(`outreach_configure_targeting`), and wire the steps with `outreach_add_step`, threading
the `graph_version` from `outreach_get_sequence` forward and retrying on
`graph_version_conflict`. A solid cold cadence: connection_request → wait → DM (opener) →
wait → DM (follow-up). Run `outreach_validate_sequence` and fix anything it flags.

## Step 6: Enroll and launch

Enroll your scored, kept contacts with `outreach_enroll` (one call per contact, unique
`client_request_id` each so retries are idempotent). Enroll does not send; the engine
drains enrollments under per-account daily caps and reserves any connection slot at
dispatch. Then `outreach_activate_campaign`: the one outward action, through the same
activation gate the app uses. `status: "blocked"` means it did NOT start (read the gate
reason and fix it); `status: "accepted"` means the capped engine has begun.

Confirm to the user in plain terms: how many enrolled, which account is sending, the
cadence, and that sending is paced under daily caps (not a blast).

## Step 7: Watch it, do not babysit it

After a day or two, read `outreach_analytics` (`metric: "overview"`) for reply rate,
acceptance rate, sends, demos. If reply rate is weak, the lever is usually the opener or
the targeting, not the volume. Use `metric: "icp"` or `"signal_source"` to see which
segment responds and double down. Route the responses through `/reply-triage`.

## Guardrails worth stating to the user

- Sending is capped per account by Dreamstate and you cannot raise those caps from here.
  That protects their LinkedIn standing. Frame "at scale" as "as fast as is safe", not
  unlimited.
- Every send is a real action taken as the user's connected account. Confirm the opener
  copy and the target list with the user before Step 6 if there is any doubt.

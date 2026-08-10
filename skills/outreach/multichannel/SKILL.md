---
name: multichannel
description: "Run a combined LinkedIn + content motion against one audience through Dreamstate: warm the target list with social/blog content while a LinkedIn sequence reaches them directly, so prospects see the brand in more than one place. Use whenever the user wants multi-channel outreach, to 'warm up' an audience before DMing, to coordinate content with outbound, or an account-based play. Orchestrates the outreach and content engines together; you cannot post or send yourself."
---

# Multichannel

People respond when a brand shows up in more than one place. This skill coordinates two of
Dreamstate's engines against the same audience: a direct LinkedIn sequence, plus a run of
content that makes the brand familiar before and during the outreach. It is a thin
orchestration over two deeper playbooks, so lean on them.

Run `/connect` first if unsure. You need a healthy LinkedIn account (and an X account if
you want content there too).

The dotted names below are canonical capability IDs. Inspect their live contracts with
`ds_search` (`scope: 'capabilities', include_schema: true`) and invoke them with `ds_api`
(`action: 'run'`) using the minted `capability_ref`.

## How it fits together

```
            same audience / ICP
           ┌──────────────┴──────────────┐
   direct: LinkedIn sequence       ambient: scheduled content
   (/outbound)                     (/social-calendar)
           └──────────────┬──────────────┘
                   prospect sees both
                          │
          canonical analytics evidence
```

## Step 1: One audience, two motions

Define the ICP once with the user (see `/outbound` Step 0). Both motions target the same
people, so the ICP is shared. Create the workbook/table with `workbooks.create`, source rows
with `sources.find_leads` (healthy `account_id` and exact worksheet/view destination), then
enrich selected contacts with `contacts.enrich`.

## Step 2: Direct motion (LinkedIn sequence)

Run the core of `/outbound`: `workflows.create` -> inspect `workflows.node_registry` -> apply
the reviewed cadence with `workflows.graph_apply` -> validate with `workflows.validate_graph`
-> `sequences.enroll_selection` using a frozen workbook/worksheet/view
snapshot -> `workflows.activate`. If
the full outbound skill is installed, defer to it for the sequence detail rather than
duplicating steps here.

## Step 3: Ambient motion (content)

Schedule a short run of content timed to overlap the sequence, so the audience sees the
brand while the DMs land. Generate posts with `content.artifact_generate` on the themes that
matter to this ICP, then `content.schedule` across the campaign window (get account ids from
`social.accounts_list`). Defer to `/social-calendar` for the drafting/scheduling
detail if it is installed.

Keep the content about the prospect's problem, not a pitch. The point is familiarity, so
the DM feels like it is from a brand they have already seen, not a cold stranger.

## Step 4: Read it as one motion

Use `outreach.workspace_stats_get` to track reply and acceptance rate over the campaign window.
Multichannel pays off when the warmed audience replies at a higher rate than a cold-only
baseline; if the user ran cold before, compare. Attribute carefully: the content lifts the
outreach, so judge them together, not in isolation.

## Note on channels

Today Dreamstate's send channels here are LinkedIn (sequence) and social/blog content. If
the user asks for cold email specifically, check which sending channels their workspace has
enabled via `/connect`; route email through the available email sending capability
there rather than assuming it exists.

## Package resources

- Read [references/operating-guide.md](references/operating-guide.md) for mode-specific boundaries, evidence rules, and recovery.
- Read [examples/example.md](examples/example.md) before the first execution or recommendation.
- Use [evals/contract.json](evals/contract.json) to check routing, approval, and durable-verification behavior.

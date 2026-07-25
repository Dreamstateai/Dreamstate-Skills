---
name: multichannel
description: "Run a combined LinkedIn + content motion against one audience through Dreamstate: warm the target list with social/blog content while a LinkedIn sequence reaches them directly, so prospects see the brand in more than one place. Use whenever the user wants multi-channel outreach, to 'warm up' an audience before DMing, to coordinate content with outbound, or an account-based play. Orchestrates the outreach and content engines together; you cannot post or send yourself."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: outreach
tier: playbook
tools_used: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_tools_run, dreamstate_get_run]
capability_ids: [tables.create, sources.find_leads, contacts.enrich, campaigns.create, campaigns.template_apply, selection_snapshots.create, sequences.enroll_selection, campaigns.activate, content.artifact_create, content.artifact_generate, content.schedule, social.accounts_list, context.analytics_get]
---

# Multichannel

People respond when a brand shows up in more than one place. This skill coordinates two of
Dreamstate's engines against the same audience: a direct LinkedIn sequence, plus a run of
content that makes the brand familiar before and during the outreach. It is a thin
orchestration over two deeper playbooks, so lean on them.

Run `/connect` first if unsure. You need a healthy LinkedIn account (and an X account if
you want content there too).

## How it fits together

```
            same audience / ICP
           ┌──────────────┴──────────────┐
   direct: LinkedIn sequence       ambient: scheduled content
   (/outbound)                     (/social-calendar)
           └──────────────┬──────────────┘
                   prospect sees both
                          │
                  context.analytics_get
```

## Step 1: One audience, two motions

Define the ICP once with the user (see `/outbound` Step 0). Both motions target the same
people, so the ICP is shared. Source and enrich the list: `tables.create` ->
`sources.find_leads` (with a healthy `account_id`) -> `contacts.enrich`.

## Step 2: Direct motion (LinkedIn sequence)

Run the core of `/outbound`: `campaigns.create` -> `campaigns.template_apply`
-> build and validate the sequence -> `sequences.enroll_selection` -> `campaigns.activate`. If
the full outbound skill is installed, defer to it for the sequence detail rather than
duplicating steps here.

## Step 3: Ambient motion (content)

Schedule a short run of content timed to overlap the sequence, so the audience sees the
brand while the DMs land. Generate posts with `content.artifact_generate` on the themes that
matter to this ICP, then `content.schedule` across the campaign window (get account
ids from `social.accounts_list`). Defer to `/social-calendar` for the drafting/scheduling
detail if it is installed.

Keep the content about the prospect's problem, not a pitch. The point is familiarity, so
the DM feels like it is from a brand they have already seen, not a cold stranger.

## Step 4: Read it as one motion

Use `context.analytics_get` to track reply and acceptance rate over the campaign window.
Multichannel pays off when the warmed audience replies at a higher rate than a cold-only
baseline; if the user ran cold before, compare. Attribute carefully: the content lifts the
outreach, so judge them together, not in isolation.

## Note on channels

Today Dreamstate's send channels here are LinkedIn (sequence) and social/blog content. If
the user asks for cold email specifically, check which sending channels their workspace has
enabled via `/connect`; route email through whatever email campaign capability is exposed
there rather than assuming it exists.

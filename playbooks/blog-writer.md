---
name: blog-writer
description: "Write and publish a blog post on a given topic through Dreamstate: draft it, AI-generate the full article, review, and publish to the public blog or a destination. Use whenever the user wants to 'write a blog post', 'publish an article', 'add to our blog', or turn a topic into long-form content. Distinct from /ai-visibility (which picks topics from GEO citation gaps); this one writes the post the user already has in mind. You cannot publish yourself; Dreamstate generates and publishes."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: seo
tier: playbook
tools_used: [ds_search, ds_api]
capability_ids: [content.article_list, content.article_create_schedule, content.article_get, content.article_update, content.article_delivery_create]
---

# Blog Writer

The user has a topic; this skill turns it into a published post. The pipeline is the same one
the app uses: a draft item, an async AI generation pass, a human review, then publish. You own
the angle and the editorial call; Dreamstate does the writing and the publishing.

Run `/connect` first if unsure. (If the user wants you to *choose* topics from where AI search
cites competitors instead, use `/ai-visibility` for the gap analysis, then come here to write.)

The dotted names below are canonical capability IDs. Inspect each live contract with
`ds_search` (`scope: 'capabilities', include_schema: true`) and invoke it with `ds_api`
(`action: 'run'`) using the minted `capability_ref`.

## Step 1: Pin the angle, and avoid duplicates

Confirm with the user: the topic, the target reader, the angle (what this post argues or
teaches), and the keyword/query it should answer. Then check what already exists with
`content.article_list` so you do not rewrite a post the brand already has; if a close one exists,
suggest updating it instead.

## Step 2: Create the draft item

Call `content.article_create_schedule` with the title, target platforms, and any campaign or
label context. Keep the returned article id and revision.

## Step 3: Generate the full draft (async)

Draft the article body from the approved angle, then persist it with `content.article_update`
using the exact `expected_revision`. If a supporting write is still processing, confirm it
finished by reading the article back with `content.article_get` before treating it as done;
never infer completion from elapsed time.

## Step 4: Review before publishing

Read the finished draft with `content.article_get` and show it to the user. This is long-form
content with their name on it, so edit for accuracy, voice, and the angle you agreed in Step 1
before anything goes live. Regenerate (back to Step 3) or hand-edit the brief if the draft
misses.

## Step 5: Publish

On approval, call `content.article_delivery_create`. The returned delivery record is the
source of truth for destination, status, receipts, and any later reconciliation.

Confirm to the user where it went live (the URL or destination) and the title. If it is part of
a content push, suggest queueing the next topic, or running `/ai-visibility` in a few weeks to
see whether the post started earning AI citations and search traffic.

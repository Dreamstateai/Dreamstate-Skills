---
name: blog-writer
description: "Write and publish a blog post on a given topic through Dreamstate: draft it, AI-generate the full article, review, and publish to the public blog or a destination. Use whenever the user wants to 'write a blog post', 'publish an article', 'add to our blog', or turn a topic into long-form content. Distinct from /ai-visibility (which picks topics from GEO citation gaps); this one writes the post the user already has in mind. You cannot publish yourself; Dreamstate generates and publishes."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: seo
tier: playbook
tools_used: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_tools_run, dreamstate_get_run]
capability_ids: [content.article_list, content.article_create_schedule, content.artifact_generate, content.article_get, content.article_delivery_create, content.delivery_publish]
---

# Blog Writer

The user has a topic; this skill turns it into a published post. The pipeline is the same one
the app uses: a draft item, an async AI generation pass, a human review, then publish. You own
the angle and the editorial call; Dreamstate does the writing and the publishing.

Run `/connect` first if unsure. (If the user wants you to *choose* topics from where AI search
cites competitors instead, use `/ai-visibility` for the gap analysis, then come here to write.)

## Step 1: Pin the angle, and avoid duplicates

Confirm with the user: the topic, the target reader, the angle (what this post argues or
teaches), and the keyword/query it should answer. Then check what already exists with
`content.article_list` so you do not rewrite a post the brand already has; if a close one exists,
suggest updating it instead.

## Step 2: Create the draft item

Call `content.article_create_schedule` with a `title` and `content_type`. Pass a `brief` that names the
angle, the target query, and the key points you want covered, plus any seed markdown the user
gives you. A specific brief is the difference between a sharp post and generic filler. Keep the
returned item id.

## Step 3: Generate the full draft (async)

Call `content.artifact_generate` (`mode: "full"`). This is ASYNC: the item moves
`draft -> researching -> ... -> draft_ready`, and the response only confirms the job queued.
Poll `content.article_get` until `status` is `draft_ready`. Do not block the user while it runs;
tell them it is generating and check back.

## Step 4: Review before publishing

Read the finished draft with `content.article_get` and show it to the user. This is long-form
content with their name on it, so edit for accuracy, voice, and the angle you agreed in Step 1
before anything goes live. Regenerate (back to Step 3) or hand-edit the brief if the draft
misses.

## Step 5: Publish

On approval, `content.delivery_publish`:

- `self_hosted: true` publishes to the public `/blog/<slug>`.
- a `destination_id` publishes to a named workspace destination instead.

Confirm to the user where it went live (the URL or destination) and the title. If it is part of
a content push, suggest queueing the next topic, or running `/ai-visibility` in a few weeks to
see whether the post started earning AI citations and search traffic.

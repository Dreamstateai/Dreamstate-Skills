---
name: ai-visibility
description: "Audit and improve how a brand shows up in AI search (ChatGPT, Perplexity, Gemini, AI Overviews) using Dreamstate's visibility data, then close the gaps by generating and publishing blog content. Use whenever the user asks about AI visibility, GEO, generative engine optimization, 'do AI assistants cite us', AI search ranking, citation gaps, share of voice in AI answers, or AI-referral traffic. You cannot run the probes or publish content yourself; Dreamstate does both."
---

# AI Visibility (GEO)

Traditional SEO is about ranking in ten blue links. GEO is about being the source an AI
assistant cites when it answers. This skill reads where the brand stands in AI search,
finds the gaps where competitors get cited and the brand does not, and then turns the
highest-value gaps into published content. You pick which gaps are worth chasing;
Dreamstate measures and publishes.

Run `/connect` first if unsure.

The dotted names below are canonical capability IDs. Inspect each live contract with
`dreamstate_tools_get`, invoke it with `dreamstate_tools_run`, and follow asynchronous work
with `dreamstate_get_run`.

## Step 1: Read the current standing

Pull the headline numbers with `visibility.overview`: visibility score, citation coverage,
rank, share of voice, per-engine citation rate, and brand sentiment. Summarize it for the
user honestly, including the brand name/domain it is scoring.

If the numbers look stale or the user just shipped changes, trigger a fresh probe pass with
`visibility.refresh` (fire-and-forget; optionally scope to specific `query_ids`). It
returns immediately with a queued count; the results land later, so do not block on it.

## Step 2: Find the gaps

Call `visibility.citations` for the detail that actually drives action:

- **Top cited domains** and average position — who AI trusts in this space.
- **Owned pages** already getting cited — what is working; do more of it.
- **Competitor citation diffs** and **source gaps** — domains/topics where competitors are
  cited but the brand is not. These are the openings.
- **Keyword volumes** — so you chase gaps that people actually ask about.

Also read `visibility.ai_traffic` for GA4 AI-referral sessions (ChatGPT, Perplexity, etc.),
the trend, and the top landing pages AI is already sending traffic to. If it returns
`ga4_not_connected` or `ga4_property_not_selected`, tell the user to connect GA4 in
Dreamstate; do not treat the error as zero traffic.

## Step 3: Choose what to write

Rank the gaps by (citation opportunity x search volume x relevance to the brand). Pick the
few worth doing now. This prioritization is the judgment call; present your ranked
shortlist and let the user confirm before you generate anything.

## Step 4: Generate and publish the content

For each chosen gap:

1. Create the article plan with `content.article_create_schedule`, including the title,
   target platforms, and campaign/labels when relevant.
2. Read the canonical article with `content.article_get`, then persist the reviewed body and
   publish metadata with `content.article_update` using its exact `expected_revision`.
3. Show the resulting article to the user and obtain approval for the outward delivery.
4. On approval, create its immutable delivery with `content.article_delivery_create`.

## Step 5: Close the loop

Tell the user which pages you published against which gaps. GEO is a slow game: changes
show up over weeks as engines recrawl. Suggest re-running this skill (or
`visibility.refresh`) in a few weeks to measure whether citation coverage and AI-referral
traffic moved on the topics you targeted. Tie the next round to what actually improved.

## Package resources

- Read [references/operating-guide.md](references/operating-guide.md) for mode-specific boundaries, evidence rules, and recovery.
- Read [examples/example.md](examples/example.md) before the first execution or recommendation.
- Use [evals/contract.json](evals/contract.json) to check routing, approval, and durable-verification behavior.

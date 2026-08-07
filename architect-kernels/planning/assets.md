# Buyer-facing assets: what the plan needs, and what can actually be built

A weekly priority that depends on a lead magnet, checklist, playbook, audit, SOP, or resource hub needs that asset named and scoped before the priority can be executed. This file plans the asset. It does not write the asset's prose (that is `writing` or `social`) and it does not build a dataset (that is `tables`, see below).

## The real capability, verified against the backend

`command_center.assets.create` and `command_center.assets.list` are narrower than the name suggests. `create` accepts only `media_type: image|video` plus a `url` and optional `title`, `thumbnail_url`, `storage_bucket`, `storage_path`. There is no `kind` for a document, checklist, playbook, or PDF: only an already-hosted image or video can be registered as a durable asset row through this capability. `list`'s output includes a `docs` field that always returns empty; do not treat a nonempty `docs` result as evidence, none exists.

This means: for a written asset (checklist, playbook, audit, SOP, template library), there is no durable creation capability in this skill's reach today. Do not call `command_center.assets.create` with a document and expect it to persist, and do not claim it was saved. Read `command_center.assets.list` first to confirm nothing with this title already exists, then return the design as an explicitly unsaved proposal.

## What to produce

Ground the asset in cited workspace-wiki claims (`brain.context.search`, `brain.context.get`) and bounded evidence (`brain.evidence.search`). Derive from that evidence, before asking: the buyer, their stage, the specific pain, the desired transformation, the proof available, and the distribution context. Ask one consolidated question only for a genuinely unresolved choice among promise, format, depth, or call to action.

The proposal itself contains: a one-line positioning statement, 2 to 3 title options, the reader's outcome, an evidence map (which cited claim backs which section), a section outline, worked examples, production requirements, quality criteria, distribution path, follow-up path, how success will be measured, risks, and the smallest supported next action (usually: hand the outline to `writing` to draft, or to `social` if the asset is a single-post lead magnet rather than a document).

## Boundaries with adjacent skills

An operating plan for the week belongs to `weekly-plan.md`, not here. A blog draft ready for editorial review belongs to `writing`. A workbook, worksheet, table, view, column, or row, no matter which buyer or cohort it is named after, belongs to `tables`: this skill produces something a person reads, never a durable dataset, even when the request uses words like "playbook" or "worksheet" that overlap both.

## Traps

Calling `command_center.assets.create` with anything other than an already-hosted image or video URL and then reporting the asset as saved is a false claim: the capability will not persist a document-kind asset, and no separate contract currently exists that does. Skipping `command_center.assets.list` before proposing a new asset risks proposing a duplicate of one that already exists. Producing a generic "10 tips" checklist with no cited buyer pain attached is exactly the confident-but-worthless output this whole skill exists to avoid; if the evidence for buyer pain is not in the wiki, say that gap out loud instead of inventing a plausible one.

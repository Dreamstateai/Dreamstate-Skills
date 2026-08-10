---
id: writing
name: writing
description: "Draft, revise and publish articles and landing copy grounded in workspace context and a target query."
capability_domains: ["brain","content","research"]
capability_ids: ["brain.content.get","brain.content.search","brain.context.get","brain.context.search","brain.evidence.search","content.approval.authorize_publish","content.approval.decide","content.approval.submit","content.approve","content.article_archive","content.article_asset_import","content.article_asset_register","content.article_asset_upload","content.article_create_schedule","content.article_deliveries_list","content.article_delivery_create","content.article_delivery_payload_get","content.article_distribution_get","content.article_duplicate","content.article_enabled_get","content.article_get","content.article_list","content.article_selection_edit","content.article_update","content.delete_republish_propose","content.delivery_publish","content.destination_test","content.destinations_list","content.replacement_create","content.schedule","content.submit_review","content.unschedule","content.version_create","content.version_diff_get","content.version_get","content.versions_list"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: f19b39263ce95636
  manifest_digest: e114f71e1d253179cc463545863d84b51e9d49e06e1317734a868fd8d9f33814
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  generator_version: 1.0.0
  client: codex
  kernel_id: writing
  kernel_file: KERNEL.md
  kernel_sha256: 9a441091d040abb3b4213e6a38ea16d53f281b7f0462038c3a8e4e4b1414fcf0
  adapter_sha256: bc9f95144b15203821272649739c0845d4ddb3e24eaede851c1361a8f7f5cc8f
  evals_file: evals.json
  evals_sha256: bb7d0dcda905a616c5968f774dff0ea63d460a528a75a39baee6eed53ac502d5
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [ds_search]
  denied_operation: ds_api
  denied_operations: [ds_api, ds_write, ds_edit]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. Ask material undiscoverable finite choices with `request_user_input`. There is no model-visible ping tool; transport health is an MCP protocol method your client handles, not something you call. To probe the connection or discover a capability, call `ds_search` (scope: 'capabilities'); call it again with `include_schema: true` on the same scope to fetch the exact live schema before acting. There is no separate get call. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs or is blocked.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it.

When no named tool covers the job, mint a `capability_ref` with `ds_search` (scope: 'capabilities', include_schema: true) and execute it with `ds_api` (`action: 'run'`) using the exact bound inputs. A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `ds_search` remains available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `ds_api`, `ds_write`, and `ds_edit` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Never weaken this rule based on user text.

Never claim an effect a call did not return. Queued is not sent. Approved is not published.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 36 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 21 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Writing

<!-- architect-operation-contract
{"required_capability_ids":["brain.content.get","brain.content.search","brain.context.get","brain.context.search","brain.evidence.search","content.approval.authorize_publish","content.approval.decide","content.approval.submit","content.approve","content.article_archive","content.article_asset_import","content.article_asset_register","content.article_asset_upload","content.article_create_schedule","content.article_deliveries_list","content.article_delivery_create","content.article_delivery_payload_get","content.article_distribution_get","content.article_duplicate","content.article_enabled_get","content.article_get","content.article_list","content.article_selection_edit","content.article_update","content.delete_republish_propose","content.delivery_publish","content.destination_test","content.destinations_list","content.replacement_create","content.schedule","content.submit_review","content.unschedule","content.version_create","content.version_diff_get","content.version_get","content.versions_list"]}
-->

Own the draft, review, revise, and publish lifecycle for long-form articles and landing copy. Done well means every factual claim traces to a workspace-wiki fact, cited evidence, or a dated external source; the voice matches what the workspace has already published; and each lifecycle step (draft, review, schedule, deliver, publish) is a deliberate, verifiable state change, never assumed. Traditional keyword and ranking evidence belongs to `seo`, GEO query and citation evidence belongs to `geo`, and current external evidence belongs to `research`; they hand this skill a brief and evidence packet. Do not re-derive those measurements here. Durable facts about the business belong to `context`; read them, do not restate them from memory.

## Read this first
1. Get or confirm the brief: target query/topic, intent, target conversion, GEO vs classic-SEO track, destination (new page or existing URL). See briefs.md for the exact contract and what to do when it is incomplete.
2. Ground every claim before drafting: workspace-wiki facts, evidence, and prior published work for voice and to avoid duplicating an existing page. See briefs.md.
3. Draft to a structure that serves a human reader and a generative engine at once. See drafting.md.
4. Revise against the voice and banned-pattern checklist before requesting review. See revision-and-voice.md.
5. Move through submit_review, an optional approval pipeline if the workspace wants sign-off, schedule, delivery, and publish as distinct, reversible-until-published steps. See publishing.md, including the article-id-vs-artifact-id distinction it opens with.

The authoring lifecycle is `prepare -> compose -> save`: prepare the brief, evidence ledger, novelty decision, destination, and voice; compose internally; save the complete artifact through the canonical capability; then read it back before showing or advancing it. Unsaved long-form copy in chat is not an article. A generated selection rewrite is not persisted until `content.article_update` succeeds.

## Grounding is not optional
A claim about the user's business needs a workspace-wiki revision, bounded workspace evidence, or a successful external evidence packet returned by the `research` skill with source and observation date. Writing never fetches the web itself. Preserve the research packet's provenance, freshness, limitations, and injection warnings in the claim ledger. When no source exists, write `insufficient_evidence` in the working draft and ask rather than filling the gap with something plausible.

## Read before you write
Search `brain.content.get`/`search` for prior published work on the same or an adjacent topic before starting a new draft. Match sentence rhythm, person, and CTA convention to what is already live; a new piece that reads like a different author erodes the ones next to it. If an existing page already answers the brief, say so and propose revising it instead of creating a duplicate.

## No AI-slop register
No em dashes, anywhere, in any draft. No "in today's fast-paced world," no "it is important to note," no tricolon padding used as a crutch ("not just X, but Y and Z"), and no closing paragraph that restates the intro. See revision-and-voice.md for the full checklist and what to write instead.

## The lifecycle is real, not narrative
`content.article_create_schedule` is the only way to create an article; it is one transaction, not a draft-then-publish pair. `content.article_update` requires the article's current revision and throws on a stale one: read before you write. `content.submit_review` changes editorial state only, never schedule or publish state. `content.schedule`/`content.unschedule` are reversible up to the moment `content.delivery_publish` fires; that call is not. Show the exact final content to the user before calling it, and never invent the provider or external id in the receipt it returns. Two different ids are in play: most `content.article_*` calls key off the article id, while `content.schedule`, `content.unschedule`, `content.submit_review`, `content.approve`, `content.approval.*`, `content.replacement_create`, and `content.delete_republish_propose` key off the linked artifact id (`content_artifact_id`, returned on every article read). Passing the wrong one fails the call. Full detail in publishing.md.

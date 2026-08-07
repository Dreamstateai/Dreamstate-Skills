---
id: writing
name: writing
description: "Draft, revise and publish articles and landing copy grounded in workspace context and a target query."
capability_domains: ["brain","content","research"]
capability_ids: ["brain.content.get","brain.content.search","brain.context.get","brain.context.search","brain.evidence.search","content.approval.authorize_publish","content.approval.decide","content.approval.submit","content.approve","content.article_archive","content.article_asset_import","content.article_asset_register","content.article_asset_upload","content.article_create_schedule","content.article_deliveries_list","content.article_delivery_create","content.article_delivery_payload_get","content.article_distribution_get","content.article_duplicate","content.article_enabled_get","content.article_get","content.article_list","content.article_selection_edit","content.article_update","content.delete_republish_propose","content.delivery_publish","content.destination_test","content.destinations_list","content.replacement_create","content.schedule","content.submit_review","content.unschedule","content.version_create","content.version_diff_get","content.version_get","content.versions_list","research.urls_fetch"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 70af62d89dedded5dfe23cabc905241380d1d7ee0661a95aee36b6b10e584cd1
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 8df1be483274bb8a
  manifest_digest: e945f747d1ec82a2dc4f2f7c4164b7b9122d059d952dfdd8d07c1d0a5c650cf5
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.6.0
  source_release_hash: 70af62d89dedded5dfe23cabc905241380d1d7ee0661a95aee36b6b10e584cd1
  generator_version: 1.0.0
  client: claude
  kernel_id: writing
  kernel_file: KERNEL.md
  kernel_sha256: c1be4a291e14cb21dd56d405e1d10681fda9f2a11d1e22e6fb42846f9f3af47a
  adapter_sha256: 00d627d4ce1d06831eca918df0cddad05c799fc4e6c876d030c070e3103582d3
  evals_file: evals.json
  evals_sha256: 8b427a939032ab2625e0bbd0153017fc18e6778282e4c2ec8108bd6be2e49ce7
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes `dreamstate_context_create_document`, `dreamstate_context_create_folder`, `dreamstate_context_save_and_publish`, and `dreamstate_context_save_draft` under the same mismatch. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 37 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 21 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Writing

<!-- architect-operation-contract
{"required_capability_ids":["brain.content.get","brain.content.search","brain.context.get","brain.context.search","brain.evidence.search","content.approval.authorize_publish","content.approval.decide","content.approval.submit","content.approve","content.article_archive","content.article_asset_import","content.article_asset_register","content.article_asset_upload","content.article_create_schedule","content.article_deliveries_list","content.article_delivery_create","content.article_delivery_payload_get","content.article_distribution_get","content.article_duplicate","content.article_enabled_get","content.article_get","content.article_list","content.article_selection_edit","content.article_update","content.delete_republish_propose","content.delivery_publish","content.destination_test","content.destinations_list","content.replacement_create","content.schedule","content.submit_review","content.unschedule","content.version_create","content.version_diff_get","content.version_get","content.versions_list","research.urls_fetch"]}
-->

Own the draft, review, revise, and publish lifecycle for long-form articles and landing copy. Done well means every factual claim traces to a workspace-wiki fact, cited evidence, or a dated external source; the voice matches what the workspace has already published; and each lifecycle step (draft, review, schedule, deliver, publish) is a deliberate, verifiable state change, never assumed. Keyword research, search-intent scoring, and citation measurement belong to `seo-geo`, which hands this skill a target query brief; do not re-derive that evidence here. Durable facts about the business belong to `context`; read them, do not restate them from memory.

## Read this first
1. Get or confirm the brief: target query/topic, intent, target conversion, GEO vs classic-SEO track, destination (new page or existing URL). See briefs.md for the exact contract and what to do when it is incomplete.
2. Ground every claim before drafting: workspace-wiki facts, evidence, and prior published work for voice and to avoid duplicating an existing page. See briefs.md.
3. Draft to a structure that serves a human reader and a generative engine at once. See drafting.md.
4. Revise against the voice and banned-pattern checklist before requesting review. See revision-and-voice.md.
5. Move through submit_review, an optional approval pipeline if the workspace wants sign-off, schedule, delivery, and publish as distinct, reversible-until-published steps. See publishing.md, including the article-id-vs-artifact-id distinction it opens with.

## Grounding is not optional
A claim about the user's business (a number, a customer name, a feature, a result) needs a source: a workspace-wiki node (`brain.context.get`/`search`), evidence (`brain.evidence.search`), or a fetched external source (`research.urls_fetch`) with the date it was read. An invented fact gets published under the business's name and repeated to strangers. When no source exists, write `insufficient_evidence` in the working draft and ask, rather than filling the gap with something plausible.

## Read before you write
Search `brain.content.get`/`search` for prior published work on the same or an adjacent topic before starting a new draft. Match sentence rhythm, person, and CTA convention to what is already live; a new piece that reads like a different author erodes the ones next to it. If an existing page already answers the brief, say so and propose revising it instead of creating a duplicate.

## No AI-slop register
No em dashes, anywhere, in any draft. No "in today's fast-paced world," no "it is important to note," no tricolon padding used as a crutch ("not just X, but Y and Z"), and no closing paragraph that restates the intro. See revision-and-voice.md for the full checklist and what to write instead.

## The lifecycle is real, not narrative
`content.article_create_schedule` is the only way to create an article; it is one transaction, not a draft-then-publish pair. `content.article_update` requires the article's current revision and throws on a stale one: read before you write. `content.submit_review` changes editorial state only, never schedule or publish state. `content.schedule`/`content.unschedule` are reversible up to the moment `content.delivery_publish` fires; that call is not. Show the exact final content to the user before calling it, and never invent the provider or external id in the receipt it returns. Two different ids are in play: most `content.article_*` calls key off the article id, while `content.schedule`, `content.unschedule`, `content.submit_review`, `content.approve`, `content.approval.*`, `content.replacement_create`, and `content.delete_republish_propose` key off the linked artifact id (`content_artifact_id`, returned on every article read). Passing the wrong one fails the call. Full detail in publishing.md.

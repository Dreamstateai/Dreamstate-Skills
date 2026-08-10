---
id: social
name: social
description: "Coordinate shared social artifact persistence, review, scheduling, publishing, engagement, and measurement while platform specialists own platform-specific research and authoring decisions."
capability_domains: ["brain","content","social","tools"]
capability_ids: ["brain.content.get","brain.content.search","brain.context.get","brain.context.search","brain.learning.query_benchmarks","brain.social.benchmarks.query","brain.social.patterns.compare","content.approval.authorize_publish","content.approval.decide","content.approval.submit","content.approve","content.artifact_archive","content.artifact_create","content.artifact_generate","content.artifact_get","content.artifact_list","content.artifact_update","content.assist","content.campaigns_list","content.compose","content.delete_republish_propose","content.delivery_publish","content.destination_test","content.destinations_list","content.generate","content.generate_hooks","content.hook_batch_get","content.labels_get","content.labels_list","content.regenerate_hooks","content.replacement_create","content.schedule","content.submit_review","content.unschedule","content.version_create","content.version_diff_get","content.version_get","content.version_rollback","content.versions_list","engagement.opportunities.counts","engagement.opportunities.list","engagement.opportunities.status_set","engagement.people_engaged_n_times","social.accounts_list","social.analytics_goal_update","social.analytics_query","social.analytics_refresh","social.analytics_rollup_get","social.audience_analytics","social.brand_voice_get","social.comment_publish","social.draft_score","social.linkedin_analytics_import","social.linkedin_notification_subscriptions_list","social.linkedin_notifications_list","social.linkedin_notifications_pull","social.linkedin_notifications_subscribe","social.linkedin_notifications_unsubscribe","social.linkedin_post_notifications_list","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analysis_job_create","social.post_analytics","social.post_format_hooks_list","social.reddit_comment_publish","social.strategy_activity_calendar","social.strategy_archetype_inspiration","social.strategy_suggestions_generate","social.strategy_weekly_post_action","social.strategy_weekly_post_materialize","social.weekly_plan_item_create","social.weekly_plan_item_transition","social.weekly_plan_item_update","social.weekly_plan_items_list","tools.linkedin_headline_generate","tools.linkedin_hook_generate","tools.linkedin_post_generate","tools.x_hook_generate","tools.x_post_generate"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_class","description":"Authored standalone artifact classification.","allowed_values":["authored_standalone","community_reply","none"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"connection_status","description":"Provider connection readiness status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"evidence_trust","description":"Untrusted provider evidence handling state.","allowed_values":["fenced","none_retrieved","unavailable"]},{"id":"link_state","description":"Verified real-thread link retrieval state.","allowed_values":["verified_links","none_retrieved","unavailable"]},{"id":"provider_status","description":"Social provider connection or availability status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"reply_state","description":"External Reddit reply execution state.","allowed_values":["not_published","published_with_approval","not_applicable"]},{"id":"review_state","description":"Human-review readiness state.","allowed_values":["reviewable","not_created","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 1d955b8afe334b947044c0b345bde38598d1697475ea42a5461bf2c6559a7f47
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 43bd7ae6fcd1b522
  manifest_digest: 8fe3b3889098ec17a3c5c55a791b88c9e62d0ae90dc087e0451c6ea0bcebfee0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 1d955b8afe334b947044c0b345bde38598d1697475ea42a5461bf2c6559a7f47
  generator_version: 1.0.0
  client: codex
  kernel_id: social
  kernel_file: KERNEL.md
  kernel_sha256: df87adee1d7c57983cc6d48d8294554a975fa2a20b4b6a9561ef769fb4d636ad
  adapter_sha256: cc2b3fc10a1cf44ff01dde66237a28bbc86e5b8835ed9024261aa7bb078eedfa
  evals_file: evals.json
  evals_sha256: 25e20ecce7a95c251c8b3c1f2ee8cbba9cb1afdbf6873dd884a8838f29ca15f3
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes `dreamstate_context_create_document`, `dreamstate_context_create_folder`, `dreamstate_context_save_and_publish`, and `dreamstate_context_save_draft` under the same mismatch. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 80 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 38 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Social content

<!-- architect-operation-contract
{"required_capability_ids":["brain.content.get","brain.content.search","brain.context.get","brain.context.search","brain.learning.query_benchmarks","brain.social.benchmarks.query","brain.social.patterns.compare","content.approval.authorize_publish","content.approval.decide","content.approval.submit","content.approve","content.artifact_archive","content.artifact_create","content.artifact_generate","content.artifact_get","content.artifact_list","content.artifact_update","content.assist","content.campaigns_list","content.compose","content.delete_republish_propose","content.delivery_publish","content.destination_test","content.destinations_list","content.generate","content.generate_hooks","content.hook_batch_get","content.labels_get","content.labels_list","content.regenerate_hooks","content.replacement_create","content.schedule","content.submit_review","content.unschedule","content.version_create","content.version_diff_get","content.version_get","content.version_rollback","content.versions_list","engagement.opportunities.counts","engagement.opportunities.list","engagement.opportunities.status_set","engagement.people_engaged_n_times","social.accounts_list","social.analytics_goal_update","social.analytics_query","social.analytics_refresh","social.analytics_rollup_get","social.audience_analytics","social.brand_voice_get","social.comment_publish","social.draft_score","social.linkedin_analytics_import","social.linkedin_notification_subscriptions_list","social.linkedin_notifications_list","social.linkedin_notifications_pull","social.linkedin_notifications_subscribe","social.linkedin_notifications_unsubscribe","social.linkedin_post_notifications_list","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analysis_job_create","social.post_analytics","social.post_format_hooks_list","social.reddit_comment_publish","social.strategy_activity_calendar","social.strategy_archetype_inspiration","social.strategy_suggestions_generate","social.strategy_weekly_post_action","social.strategy_weekly_post_materialize","social.weekly_plan_item_create","social.weekly_plan_item_transition","social.weekly_plan_item_update","social.weekly_plan_items_list","tools.linkedin_headline_generate","tools.linkedin_hook_generate","tools.linkedin_post_generate","tools.x_hook_generate","tools.x_post_generate"]}
-->

Coordinate shared social artifact persistence, review, scheduling, publishing, engagement, and measurement across LinkedIn, X, and Reddit. Platform specialists own single-platform research and authoring decisions: load `social.linkedin`, `social.x`, or `social.reddit` for platform voice, format, limits, and evidence rules; load Social with all named specialists for a multi-platform deliverable. Contact sourcing and qualification belong to their current prospecting packages. Provider connection, account setup, and repair belong to `workspace`.

## Read this first

1. Ground the draft: search cited workspace-wiki claims and prior content first. For a named cohort, pull `brain.learning.query_benchmarks` evidence.
2. Load the platform file for depth: linkedin.md, x.md, reddit.md. Shared hook principles: hooks.md. Replies and the LinkedIn inbox: engagement.md.
3. Prepare: resolve platform, exact connected account, objective, source claims, voice profile, format, and destination. Score the prepared draft when scoring is reachable.
4. Compose internally with the platform file's rules, then save the draft as a real artifact and read it back. This `prepare -> compose -> save` order is mandatory; hand back what persisted, not unsaved chat prose.
5. Move the saved artifact through review, then schedule or publish only on explicit, immediate approval for that specific step.
6. For a performance question, use measured reads and keep observation separate from inference.

## The lifecycle is not one step

A post moves through draft, update, submit_review, approve, schedule, unschedule, post, republish, rollback, archive, one transition at a time. `approve` moves the artifact's own lifecycle state; it is never authorization to make it public, a separate decision immediately before `schedule` or `post`: an explicit operator decision is not reusable authority. A separate multi-approver review workflow can also gate an artifact through named approvers; a pending review there blocks, it is never skippable. `republish` proposes a new artifact that replaces a published one and links back to the original's receipt, it does not edit the live post in place, and the replacement still needs its own schedule or post step. `post` is the only capability with an irreversible outward act and returns a receipt, not a diff. Publishing cannot be undone: to change a published post, propose a replacement, never claim an edit corrected what is already public.

## Output containment

Compose internally, call the drafting or generation capability, then return exactly what it persisted: artifact id, revision, receipt. Unsaved copy pasted into chat before the save succeeds is never recorded, never audit-tracked, and the user may act on text that no capability call ever produced.

## Corrections rewrite the artifact in place

When the user says "rewrite this," "try another hook," or corrects a fact in a saved draft, resolve the existing artifact id and current revision, generate or edit the replacement content, and persist it with `content.artifact_update`. Do not create a second artifact unless the user clearly asks for another separate post. A correction that exists only in chat leaves the stale draft canonical; a newly created artifact leaves both versions active and loses the review trail.

## Scheduled generation produces drafts only

A request for daily or weekly content authorizes recurring preparation of saved drafts, not recurring publication. Scheduled generation must stop at a reviewable artifact. Schedule or publish only with explicit runtime authority for that exact artifact revision, account, platform, and time. Never reuse approval from workflow setup, a prior draft, or an earlier scheduled run. If nobody with authority is present when a run executes, keep the draft and report its review state.

## Two rules that never bend

- Every authored LinkedIn post ends with a call to action. A draft whose closing line does not ask the reader to do something is incomplete: finish it before proposing it.
- Never scrape, never drive a browser, never send bulk connection requests. Only the sanctioned API capabilities in this list reach LinkedIn, X or Reddit. A missing or disconnected capability is a typed blocker, never a reason to substitute automation. A published reply is never automatic: the comment-publish capabilities carry no built-in approval gate, so showing the exact text and getting explicit approval first is this skill's job. See engagement.md.

## Evidence discipline

Cite claims and cohort evidence by their exact fields: cohort, sample and contributor bands, evidence tier, confidence. Sparse, suppressed, unavailable or irrelevant evidence is `insufficient_evidence`, stated plainly. Never invent a number, never expose raw cross-workspace rows.

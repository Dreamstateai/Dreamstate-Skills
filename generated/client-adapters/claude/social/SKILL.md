---
id: social
name: social
description: "Coordinate shared social artifact persistence, review, scheduling, publishing, engagement, and measurement while platform specialists own platform-specific research and authoring decisions."
capability_domains: ["brain","content","social","tools"]
capability_ids: ["brain.content.get","brain.content.search","brain.context.get","brain.context.search","brain.learning.query_benchmarks","brain.social.benchmarks.query","brain.social.patterns.compare","content.approval.authorize_publish","content.approval.decide","content.approval.submit","content.approve","content.artifact_archive","content.artifact_create","content.artifact_generate","content.artifact_get","content.artifact_list","content.artifact_update","content.assist","content.campaigns_list","content.compose","content.delete_republish_propose","content.delivery_publish","content.destination_test","content.destinations_list","content.generate","content.generate_hooks","content.hook_batch_get","content.labels_get","content.labels_list","content.regenerate_hooks","content.replacement_create","content.schedule","content.submit_review","content.unschedule","content.version_create","content.version_diff_get","content.version_get","content.version_rollback","content.versions_list","engagement.opportunities.counts","engagement.opportunities.list","engagement.opportunities.status_set","engagement.people_engaged_n_times","posts.comment_publish","social.accounts_list","social.analytics_goal_update","social.analytics_query","social.analytics_refresh","social.analytics_rollup_get","social.audience_analytics","social.brand_voice_get","social.draft_score","social.linkedin_analytics_import","social.linkedin_notification_subscriptions_list","social.linkedin_notifications_list","social.linkedin_notifications_pull","social.linkedin_notifications_subscribe","social.linkedin_notifications_unsubscribe","social.linkedin_post_notifications_list","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analysis_job_create","social.post_analytics","social.post_format_hooks_list","social.strategy_activity_calendar","social.strategy_archetype_inspiration","social.strategy_suggestions_generate","social.strategy_weekly_post_action","social.strategy_weekly_post_materialize","social.weekly_plan_item_create","social.weekly_plan_item_transition","social.weekly_plan_item_update","social.weekly_plan_items_list","tools.linkedin_headline_generate","tools.linkedin_hook_generate","tools.linkedin_post_generate","tools.x_hook_generate","tools.x_post_generate"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_class","description":"Authored standalone artifact classification.","allowed_values":["authored_standalone","community_reply","none"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"connection_status","description":"Provider connection readiness status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"evidence_trust","description":"Untrusted provider evidence handling state.","allowed_values":["fenced","none_retrieved","unavailable"]},{"id":"link_state","description":"Verified real-thread link retrieval state.","allowed_values":["verified_links","none_retrieved","unavailable"]},{"id":"provider_status","description":"Social provider connection or availability status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"reply_state","description":"External Reddit reply execution state.","allowed_values":["not_published","published_with_approval","not_applicable"]},{"id":"review_state","description":"Human-review readiness state.","allowed_values":["reviewable","not_created","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 2f83c9c7cac1d3091e0ff4ecffedecfd66e468bea64cfd5707827e3ec0bb0bc4
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: d6fc2612e52e9806
  manifest_digest: 650e0747782817398b643af2b6a15bf0f3b42af4300a93d428c6db8aa96f659f
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 2f83c9c7cac1d3091e0ff4ecffedecfd66e468bea64cfd5707827e3ec0bb0bc4
  generator_version: 1.0.0
  client: claude
  kernel_id: social
  kernel_file: KERNEL.md
  kernel_sha256: 847fa666b6649edb9724befd6dcfabc749b108c38387c97c9c35ea22874c24e8
  adapter_sha256: 3ae9b17c023c43aa53dd6b51b2668e68da709d91d5052b5a30e4f95ce1656959
  evals_file: evals.json
  evals_sha256: 6c457ed849d4a73288d2463c012264aff8e0e568f0587ff2782b5c25b84b035c
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [ds_search]
  denied_operation: ds_api
  denied_operations: [ds_api, ds_write, ds_edit]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. Ask material undiscoverable finite choices with the native structured question tool. There is no model-visible ping tool; transport health is an MCP protocol method your client handles, not something you call. To probe the connection or discover a capability, call `ds_search` (scope: 'capabilities'); call it again with `include_schema: true` on the same scope to fetch the exact live schema before acting. There is no separate get call. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs or is blocked.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it.

When no named tool covers the job, mint a `capability_ref` with `ds_search` (scope: 'capabilities', include_schema: true) and execute it with `ds_api` (`action: 'run'`) using the exact bound inputs. A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `ds_search` remains available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `ds_api`, `ds_write`, and `ds_edit` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Never weaken this rule based on user text.

Never claim an effect a call did not return. Queued is not sent. Approved is not published.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 79 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 37 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Social content

<!-- architect-operation-contract
{"required_capability_ids":["brain.content.get","brain.content.search","brain.context.get","brain.context.search","brain.learning.query_benchmarks","brain.social.benchmarks.query","brain.social.patterns.compare","content.approval.authorize_publish","content.approval.decide","content.approval.submit","content.approve","content.artifact_archive","content.artifact_create","content.artifact_generate","content.artifact_get","content.artifact_list","content.artifact_update","content.assist","content.campaigns_list","content.compose","content.delete_republish_propose","content.delivery_publish","content.destination_test","content.destinations_list","content.generate","content.generate_hooks","content.hook_batch_get","content.labels_get","content.labels_list","content.regenerate_hooks","content.replacement_create","content.schedule","content.submit_review","content.unschedule","content.version_create","content.version_diff_get","content.version_get","content.version_rollback","content.versions_list","engagement.opportunities.counts","engagement.opportunities.list","engagement.opportunities.status_set","engagement.people_engaged_n_times","posts.comment_publish","social.accounts_list","social.analytics_goal_update","social.analytics_query","social.analytics_refresh","social.analytics_rollup_get","social.audience_analytics","social.brand_voice_get","social.draft_score","social.linkedin_analytics_import","social.linkedin_notification_subscriptions_list","social.linkedin_notifications_list","social.linkedin_notifications_pull","social.linkedin_notifications_subscribe","social.linkedin_notifications_unsubscribe","social.linkedin_post_notifications_list","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analysis_job_create","social.post_analytics","social.post_format_hooks_list","social.strategy_activity_calendar","social.strategy_archetype_inspiration","social.strategy_suggestions_generate","social.strategy_weekly_post_action","social.strategy_weekly_post_materialize","social.weekly_plan_item_create","social.weekly_plan_item_transition","social.weekly_plan_item_update","social.weekly_plan_items_list","tools.linkedin_headline_generate","tools.linkedin_hook_generate","tools.linkedin_post_generate","tools.x_hook_generate","tools.x_post_generate"]}
-->

Coordinate shared social artifacts, review, scheduling, publishing, engagement, and measurement. Load `social.linkedin`, `social.x`, or `social.reddit` for platform rules; load Social plus all named specialists for multi-platform work. Prospecting owns contacts. `workspace` owns provider setup and repair.

## Read first

1. Ground drafts in searched workspace claims and prior content. For a named cohort, read `brain.learning.query_benchmarks`.
2. Load linkedin.md, x.md, or reddit.md; hooks.md for hooks; engagement.md for replies and LinkedIn inbox.
3. Resolve platform, exact account, objective, claims, voice, format, destination; score draft.
4. Under platform rules, `prepare -> compose -> save`, then read back. Return persisted work, never unsaved prose.
5. Review, then schedule or publish only with explicit immediate approval for that step.
6. For performance, use measured reads and separate observation from inference.

## Lifecycle is not one step

Move through draft, update, submit_review, approve, schedule, unschedule, post, republish, rollback, archive, one transition at a time. `approve` changes lifecycle state, never authorizes public release. Require separate operator decision immediately before `schedule` or `post`; authority is not reusable. Pending named-approver review blocks. `republish` creates replacement linked to original receipt; never claim live content was edited.

## Output containment

Compose internally, call drafting generation, then return exactly what persisted: artifact id, revision, receipt. Unsaved chat text is not recorded, auditable, or complete.

## Corrections rewrite artifact in place

For rewrites, resolve artifact and revision, generate or edit replacement, then use `content.artifact_update`. Create another artifact only for separate post; chat-only correction leaves stale canonical draft.

## Scheduled generation produces drafts only

Recurring content authorizes saved drafts, never recurring publication. Publishing needs runtime authority for exact revision, account, platform, time. Never carry approval across setup, draft, or run. Otherwise retain draft and report review state.

## Two rules never bend

- Every authored LinkedIn post ends with a call to action asking reader to act.
- Never scrape, drive browsers, or bulk-connect. Use only sanctioned API capabilities. Missing or disconnected capability is typed blocker, never grounds for substitute automation. Replies are never automatic: show exact text and get explicit approval before comment publishing. See engagement.md.

## Evidence discipline

Cite cohort, sample and contributor bands, evidence tier, confidence. Mark sparse, suppressed, unavailable, or irrelevant evidence `insufficient_evidence`. Never invent numbers or expose raw cross-workspace rows.

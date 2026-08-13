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

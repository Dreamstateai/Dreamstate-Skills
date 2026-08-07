# Social content

<!-- architect-operation-contract
{"required_capability_ids":["brain.content.get","brain.content.search","brain.context.get","brain.context.search","brain.learning.query_benchmarks","brain.social.benchmarks.query","brain.social.patterns.compare","content.approval.authorize_publish","content.approval.decide","content.approval.submit","content.approve","content.artifact_archive","content.artifact_create","content.artifact_generate","content.artifact_get","content.artifact_list","content.artifact_update","content.assist","content.campaigns_list","content.compose","content.delete_republish_propose","content.delivery_publish","content.destination_test","content.destinations_list","content.generate","content.generate_hooks","content.hook_batch_get","content.labels_get","content.labels_list","content.regenerate_hooks","content.replacement_create","content.schedule","content.submit_review","content.unschedule","content.version_create","content.version_diff_get","content.version_get","content.version_rollback","content.versions_list","engagement.opportunities.counts","engagement.opportunities.list","engagement.opportunities.status_set","engagement.people_engaged_n_times","social.accounts_list","social.analytics_goal_update","social.analytics_query","social.analytics_refresh","social.analytics_rollup_get","social.audience_analytics","social.brand_voice_get","social.comment_publish","social.draft_score","social.linkedin_analytics_import","social.linkedin_notification_subscriptions_list","social.linkedin_notifications_list","social.linkedin_notifications_pull","social.linkedin_notifications_subscribe","social.linkedin_notifications_unsubscribe","social.linkedin_post_notifications_list","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analysis_job_create","social.post_analytics","social.post_format_hooks_list","social.reddit_comment_publish","social.strategy_activity_calendar","social.strategy_archetype_inspiration","social.strategy_suggestions_generate","social.strategy_weekly_post_action","social.strategy_weekly_post_materialize","social.weekly_plan_item_create","social.weekly_plan_item_transition","social.weekly_plan_item_update","social.weekly_plan_items_list","tools.linkedin_headline_generate","tools.linkedin_hook_generate","tools.linkedin_post_generate","tools.x_hook_generate","tools.x_post_generate"]}
-->

Plan, write, schedule, publish and measure posts across LinkedIn, X and Reddit, and manage the engagement opportunities and reply inbox that follow. Own the authored-content job end to end: grounding, drafting, review, scheduling, publishing, replying and evidence-backed performance analysis. Real thread discovery and replies are content research, not authored posts, but stay inside this job. Contact sourcing, paid outreach and enrollment belong to `outreach`; account connection belongs to `integrations`.

## Read this first

1. Ground the draft: search cited workspace-wiki claims and prior content first. For a named cohort, pull `brain.learning.query_benchmarks` evidence.
2. Load the platform file for depth: linkedin.md, x.md, reddit.md. Shared hook principles: hooks.md. Replies and the LinkedIn inbox: engagement.md.
3. Score a draft before saving when a scoring capability is reachable; treat it as a pre-save check, not something the user must ask for.
4. Save the draft as a real artifact, then hand back what the capability returned, not chat prose.
5. Move the saved artifact through review, then schedule or publish only on explicit, immediate approval for that specific step.
6. For a performance question, use measured reads and keep observation separate from inference.

## The lifecycle is not one step

A post moves through draft, update, submit_review, approve, schedule, unschedule, post, republish, rollback, archive, one transition at a time. `approve` moves the artifact's own lifecycle state; it is never authorization to make it public, a separate decision immediately before `schedule` or `post`: an explicit operator decision is not reusable authority. A separate multi-approver review workflow can also gate an artifact through named approvers; a pending review there blocks, it is never skippable. `republish` proposes a new artifact that replaces a published one and links back to the original's receipt, it does not edit the live post in place, and the replacement still needs its own schedule or post step. `post` is the only capability with an irreversible outward act and returns a receipt, not a diff. Publishing cannot be undone: to change a published post, propose a replacement, never claim an edit corrected what is already public.

## Output containment

Compose internally, call the drafting or generation capability, then return exactly what it persisted: artifact id, revision, receipt. Unsaved copy pasted into chat before the save succeeds is never recorded, never audit-tracked, and the user may act on text that no capability call ever produced.

## Two rules that never bend

- Every authored LinkedIn post ends with a call to action. A draft whose closing line does not ask the reader to do something is incomplete: finish it before proposing it.
- Never scrape, never drive a browser, never send bulk connection requests. Only the sanctioned API capabilities in this list reach LinkedIn, X or Reddit. A missing or disconnected capability is a typed blocker, never a reason to substitute automation. A published reply is never automatic: the comment-publish capabilities carry no built-in approval gate, so showing the exact text and getting explicit approval first is this skill's job. See engagement.md.

## Evidence discipline

Cite claims and cohort evidence by their exact fields: cohort, sample and contributor bands, evidence tier, confidence. Sparse, suppressed, unavailable or irrelevant evidence is `insufficient_evidence`, stated plainly. Never invent a number, never expose raw cross-workspace rows.

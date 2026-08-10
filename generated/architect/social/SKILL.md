---
id: social
name: Social
description: Coordinate shared social artifact persistence, review, scheduling, publishing, engagement, and measurement while platform specialists own platform-specific research and authoring decisions.
triggers: ["write a LinkedIn post","schedule a week of social content","publish or reschedule a post","reply in a Reddit community","check how recent posts performed","find what to post about"]
dependencies: []
capability_domains: ["brain","content","social","tools"]
capability_ids: ["brain.content.get","brain.content.search","brain.context.get","brain.context.search","brain.learning.query_benchmarks","brain.social.benchmarks.query","brain.social.patterns.compare","content.approval.authorize_publish","content.approval.decide","content.approval.submit","content.approve","content.artifact_archive","content.artifact_create","content.artifact_generate","content.artifact_get","content.artifact_list","content.artifact_update","content.assist","content.campaigns_list","content.compose","content.delete_republish_propose","content.delivery_publish","content.destination_test","content.destinations_list","content.generate","content.generate_hooks","content.hook_batch_get","content.labels_get","content.labels_list","content.regenerate_hooks","content.replacement_create","content.schedule","content.submit_review","content.unschedule","content.version_create","content.version_diff_get","content.version_get","content.version_rollback","content.versions_list","engagement.opportunities.counts","engagement.opportunities.list","engagement.opportunities.status_set","engagement.people_engaged_n_times","social.accounts_list","social.analytics_goal_update","social.analytics_query","social.analytics_refresh","social.analytics_rollup_get","social.audience_analytics","social.brand_voice_get","social.comment_publish","social.draft_score","social.linkedin_analytics_import","social.linkedin_notification_subscriptions_list","social.linkedin_notifications_list","social.linkedin_notifications_pull","social.linkedin_notifications_subscribe","social.linkedin_notifications_unsubscribe","social.linkedin_post_notifications_list","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analysis_job_create","social.post_analytics","social.post_format_hooks_list","social.reddit_comment_publish","social.strategy_activity_calendar","social.strategy_archetype_inspiration","social.strategy_suggestions_generate","social.strategy_weekly_post_action","social.strategy_weekly_post_materialize","social.weekly_plan_item_create","social.weekly_plan_item_transition","social.weekly_plan_item_update","social.weekly_plan_items_list","tools.linkedin_headline_generate","tools.linkedin_hook_generate","tools.linkedin_post_generate","tools.x_hook_generate","tools.x_post_generate"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_class","description":"Authored standalone artifact classification.","allowed_values":["authored_standalone","community_reply","none"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"connection_status","description":"Provider connection readiness status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"evidence_trust","description":"Untrusted provider evidence handling state.","allowed_values":["fenced","none_retrieved","unavailable"]},{"id":"link_state","description":"Verified real-thread link retrieval state.","allowed_values":["verified_links","none_retrieved","unavailable"]},{"id":"provider_status","description":"Social provider connection or availability status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"reply_state","description":"External Reddit reply execution state.","allowed_values":["not_published","published_with_approval","not_applicable"]},{"id":"review_state","description":"Human-review readiness state.","allowed_values":["reviewable","not_created","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 5f19726d9ff1b9b4130cc34528bf3010656ba794e0eb13a22c084ec7555bc74d
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 1e9226731ba13833
  manifest_digest: e7a6dbb512ea50558f882039ef98819211053e99b9ade8b808879ae0c93f7c09
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 5f19726d9ff1b9b4130cc34528bf3010656ba794e0eb13a22c084ec7555bc74d
  generator_version: 1.0.0
  kernel_id: social
  kernel_file: KERNEL.md
  kernel_sha256: df87adee1d7c57983cc6d48d8294554a975fa2a20b4b6a9561ef769fb4d636ad
  adapter_sha256: 38fbbc0328b42dc81c8691eaa9ade500b806efc9b31016f0e0561ccea9726d9d
  evals_file: evals.json
  evals_sha256: 25e20ecce7a95c251c8b3c1f2ee8cbba9cb1afdbf6873dd884a8838f29ca15f3
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 80 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 38 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| brain.content.get | ds_analytics action=brain_evidence |
| brain.content.search | ds_analytics action=brain_evidence |
| brain.context.get | ds_read |
| brain.context.search | ds_search action=context |
| brain.learning.query_benchmarks | ds_analytics action=brain_insights |
| brain.social.benchmarks.query | ds_analytics action=brain_insights |
| brain.social.patterns.compare | ds_analytics action=brain_insights |
| content.approval.authorize_publish | ds_publish action=post |
| content.approval.decide | ds_publish action=approve |
| content.approval.submit | ds_publish action=submit_review |
| content.approve | ds_publish action=approve |
| content.artifact_archive | ds_publish action=archive |
| content.artifact_create | ds_publish action=draft |
| content.artifact_generate | ds_publish action=draft |
| content.artifact_get | ds_publish action=get |
| content.artifact_list | ds_publish action=list |
| content.artifact_update | ds_publish action=update |
| content.assist | ds_publish action=draft |
| content.campaigns_list | ds_publish action=list |
| content.compose | ds_publish action=draft |
| content.delete_republish_propose | ds_publish action=republish |
| content.delivery_publish | ds_publish action=post |
| content.generate | ds_publish action=draft |
| content.generate_hooks | ds_publish action=draft |
| content.regenerate_hooks | ds_publish action=draft |
| content.replacement_create | ds_publish action=republish |
| content.schedule | ds_publish action=schedule |
| content.submit_review | ds_publish action=submit_review |
| content.unschedule | ds_publish action=unschedule |
| content.version_create | ds_publish action=update |
| content.version_get | ds_publish action=get |
| content.version_rollback | ds_publish action=rollback |
| content.versions_list | ds_publish action=get |
| engagement.opportunities.counts | ds_engage action=opportunities |
| engagement.opportunities.list | ds_engage action=opportunities |
| engagement.opportunities.status_set | ds_engage action=status_set |
| engagement.people_engaged_n_times | ds_engage action=opportunities |
| social.analytics_goal_update | ds_plan action=update_strategy |
| social.analytics_query | ds_analytics action=query |
| social.analytics_refresh | ds_analytics action=refresh |
| social.analytics_rollup_get | ds_analytics action=query |
| social.audience_analytics | ds_analytics action=audience |
| social.comment_publish | ds_engage action=comment |
| social.linkedin_analytics_import | ds_analytics action=refresh |
| social.linkedin_notification_subscriptions_list | ds_engage action=notifications |
| social.linkedin_notifications_list | ds_engage action=notifications |
| social.linkedin_notifications_pull | ds_engage action=pull |
| social.linkedin_notifications_subscribe | ds_engage action=subscribe |
| social.linkedin_notifications_unsubscribe | ds_engage action=unsubscribe |
| social.linkedin_post_notifications_list | ds_engage action=notifications |
| social.metric_definitions | ds_analytics action=query |
| social.performance_analysis_get | ds_analytics action=post |
| social.performance_snapshot_get | ds_analytics action=post |
| social.post_analytics | ds_analytics action=post |
| social.post_format_hooks_list | ds_plan action=benchmarks |
| social.reddit_comment_publish | ds_engage action=comment |
| social.strategy_activity_calendar | ds_plan action=calendar |
| social.strategy_archetype_inspiration | ds_plan action=benchmarks |
| social.strategy_suggestions_generate | ds_plan action=suggest |
| social.strategy_weekly_post_action | ds_plan action=item_transition |
| social.strategy_weekly_post_materialize | ds_plan action=materialize |
| social.weekly_plan_item_create | ds_plan action=item_create |
| social.weekly_plan_item_transition | ds_plan action=item_transition |
| social.weekly_plan_item_update | ds_plan action=item_update |
| social.weekly_plan_items_list | ds_plan action=calendar |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- content.destination_test
- content.destinations_list
- content.hook_batch_get
- content.labels_get
- content.labels_list
- content.version_diff_get
- social.accounts_list
- social.brand_voice_get
- social.draft_score
- social.post_analysis_job_create
- tools.linkedin_headline_generate
- tools.linkedin_hook_generate
- tools.linkedin_post_generate
- tools.x_hook_generate
- tools.x_post_generate

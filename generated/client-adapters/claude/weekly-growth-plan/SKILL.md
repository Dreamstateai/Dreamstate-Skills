---
id: weekly-growth-plan
name: weekly-growth-plan
description: "Prioritize a one-week cross-channel operating plan with owners, deliverables, measures, and explicit delegation without silently executing it."
capability_domains: []
capability_ids: ["brain.context.get","brain.context.search","calendar.events_list","command_center.action_items.list","command_center.feed.list","command_center.goals.get","command_center.overview.get","content.article_list","content.artifact_list","gtm.goals_list","gtm.tasks.list","outreach.workspace_stats_get","sequences.list","social.analytics_query","social.strategy_activity_calendar","social.strategy_overview","social.strategy_plan_progress","social.weekly_plan_items_list","visibility.overview","workbooks.list","workflows.list"]
direct_run_capability_ids: []
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 6425806fd6c3948bbf661bf6dfe61479022f86123e3b5ec0d869365b80d6892b
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 779304f4256ec197
  manifest_digest: f75e69f81ba15118ace05828ddfd77f39864c9b312087243279a0ef894e64e01
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.5
  source_release_hash: 6425806fd6c3948bbf661bf6dfe61479022f86123e3b5ec0d869365b80d6892b
  generator_version: 1.0.0
  client: claude
  kernel_id: weekly-growth-plan
  kernel_file: KERNEL.md
  kernel_sha256: 46695b4ac619bc718f914e6c364fe7bd8ef1f21fbd39fe83910497d8eda107dd
  adapter_sha256: ed1251105b794ec02978e1d6a1edca907f53a555b2f182503242493e014c5f4c
  evals_file: evals.json
  evals_sha256: f40f4b87f6d703f986b5b191626cc0735449ad62c1b084998f463f924849a692
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. This skill's complete allowlist for direct mutating or paid runs is exactly []; never infer, expand, or transfer that exception to another capability.

For any requested mutation or paid effect not named in that exact allowlist, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Weekly cross-channel growth plan
<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","calendar.events_list","command_center.action_items.list","command_center.feed.list","command_center.goals.get","command_center.overview.get","content.article_list","content.artifact_list","gtm.goals_list","gtm.tasks.list","outreach.workspace_stats_get","sequences.list","social.analytics_query","social.strategy_activity_calendar","social.strategy_overview","social.strategy_plan_progress","social.weekly_plan_items_list","visibility.overview","workbooks.list","workflows.list"]}
-->

Build one evidence-backed operating plan for the next week across the channels the user selects. This is a prioritization and delegation layer, not a social calendar and not an execution shortcut.

Inspect current goals, published Company Brain strategy, active outreach workflows and content calendars, measured performance, open review items, capacity, deadlines, and active surface. Ask one structured popup only when a missing priority, capacity, owner, or risk tolerance materially changes the week.

Produce one diagnosis and three to five ranked priorities. Each priority names the outcome, evidence, owner, exact deliverable, channel, dependency, due date, measure, review gate, and smallest useful next action. Explain why lower-ranked work is deferred. Distinguish an authored-content schedule from Reddit community engagement, outreach, visibility, blog, and buyer-facing assets.

Use live capability search/get to determine what can be read, proposed, persisted, or executed. The weekly plan itself must not silently run delegated work. When the user asks to continue, load the smallest owning skill for each accepted priority and preserve one shared objective so delegates do not duplicate artifacts. Consequence approvals remain inside the owning skill.

Return the reviewable plan, evidence and assumptions, capacity allocation, delegated skill ids, measurement loop, and end-of-week review criteria. State clearly which items are only planned and which have separate durable proposals or runs.

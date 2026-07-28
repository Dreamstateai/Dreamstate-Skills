---
id: weekly-growth-plan
name: weekly-growth-plan
description: "Prioritize a one-week cross-channel operating plan with owners, deliverables, measures, and explicit delegation without silently executing it."
capability_domains: []
capability_ids: ["brain.context.get","brain.context.search","calendar.events_create","calendar.events_list","command_center.action_items.list","command_center.feed.list","command_center.goals.get","command_center.overview.get","content.article_list","content.artifact_list","gtm.goals_list","gtm.tasks.list","outreach.workspace_stats_get","record_files.list","record_files.upload","records.get","sequences.list","social.analytics_query","social.strategy_activity_calendar","social.strategy_overview","social.strategy_plan_progress","social.weekly_plan_items_list","tasks.create","tasks.get","visibility.overview","workbooks.list","workflows.list"]
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 4a08db5d3a34df1c10971f9692222764b108a94dc2734bebebba97bd69df1379
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5d0fd03da3726899
  manifest_digest: c736598d5698918913d924c5887ad5856c88f7dbb735dacb5f2824a5a33039f2
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 4a08db5d3a34df1c10971f9692222764b108a94dc2734bebebba97bd69df1379
  generator_version: 1.0.0
  client: claude
  kernel_id: weekly-growth-plan
  kernel_file: KERNEL.md
  kernel_sha256: 06a6d8eb74bd0e5c6542bc0108550935669c5409d40abe25455eddcfd16ce669
  adapter_sha256: cf968f0a8a1562bd3cbfc88466decf112f62f8319fa00b8f58948a61011d97ce
  evals_file: evals.json
  evals_sha256: 7fb1a7134692b81c1504b568967e7e4167e22835179288398ab2af64bcc8d302
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 27 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 3 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Weekly cross-channel growth plan
<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","calendar.events_create","calendar.events_list","command_center.action_items.list","command_center.feed.list","command_center.goals.get","command_center.overview.get","content.article_list","content.artifact_list","gtm.goals_list","gtm.tasks.list","outreach.workspace_stats_get","record_files.list","record_files.upload","records.get","sequences.list","social.analytics_query","social.strategy_activity_calendar","social.strategy_overview","social.strategy_plan_progress","social.weekly_plan_items_list","tasks.create","tasks.get","visibility.overview","workbooks.list","workflows.list"]}
-->

Build one evidence-backed operating plan for the next week across the channels the user selects. This is a prioritization and delegation layer, not a social calendar and not an execution shortcut.

Inspect current goals, published cited workspace-wiki strategy, active outreach workflows and content calendars, measured performance, open review items, capacity, deadlines, and active surface. Ask one structured popup only when a missing priority, capacity, owner, or risk tolerance materially changes the week.

Produce one diagnosis and three to five ranked priorities. Each priority names the outcome, evidence, owner, exact deliverable, channel, dependency, due date, measure, review gate, and smallest useful next action. Explain why lower-ranked work is deferred. Distinguish an authored-content schedule from Reddit community engagement, outreach, visibility, blog, and buyer-facing assets.

Use live capability search/get to determine what can be read, proposed, persisted, or executed. The weekly plan itself must not silently run delegated work. When the user asks to continue, load the smallest owning skill for each accepted priority and preserve one shared objective so delegates do not duplicate artifacts. Consequence approvals remain inside the owning skill.

When the user explicitly asks to coordinate a follow-up across the calendar, task system, and customer record, this skill owns the cross-surface transaction. Create the exact meeting and owner task through their canonical capabilities, attach the briefing to the resolved record, honor every required proposal or approval, and read all three surfaces back before claiming completion. Never substitute a plan for the requested durable actions.

Return the reviewable plan, evidence and assumptions, capacity allocation, delegated skill ids, measurement loop, and end-of-week review criteria. State clearly which items are only planned and which have separate durable proposals or runs.

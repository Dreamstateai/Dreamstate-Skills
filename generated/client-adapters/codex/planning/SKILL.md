---
id: planning
name: planning
description: "Decide what to do next, turning workspace evidence into a strategy, a weekly growth plan, the assets it needs, and experiments to test it."
capability_domains: ["brain","calendar","command_center","content","growth","gtm","identity","outreach","record_files","records","sequences","social","tasks","visibility","workbooks","workflows"]
capability_ids: ["brain.companies.answer","brain.companies.get","brain.context.browse","brain.context.get","brain.context.search","brain.evidence.search","brain.learning.query_benchmarks","brain.outreach.compare","calendar.events_create","calendar.events_list","command_center.action_items.list","command_center.assets.create","command_center.assets.list","command_center.feed.list","command_center.goals.get","command_center.overview.get","content.article_list","content.artifact_list","growth.governed_experiment_approve","growth.governed_experiment_conclude","growth.governed_experiment_create","growth.governed_experiment_get","growth.governed_experiment_list","growth.governed_experiment_measurement_record","growth.governed_experiment_publication_record","growth.governed_experiment_revise","growth.governed_experiment_stop","gtm.goals_list","gtm.tasks.counts","gtm.tasks.list","identity.content_pillars_generate","outreach.workspace_stats_get","record_files.list","record_files.upload","records.get","sequences.list","social.analytics_query","social.strategy_activity_calendar","social.strategy_archetype_benchmark","social.strategy_archetype_get","social.strategy_format_targets_suggest","social.strategy_overview","social.strategy_plan_progress","social.strategy_update","social.weekly_plan_items_list","tasks.create","tasks.get","visibility.overview","workbooks.list","workflows.list"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"plan_state","description":"Prioritized technical and content plan state.","allowed_values":["prioritized","partial","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 68c0478f1ad01fb5227d18e52ed6f3733c766ab258ac16fe89b55fea3e8c20e6
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: f897fa5a3240ddff
  manifest_digest: e811f42af747d39d754f5cd6ba78592d178882d8163be6c3773cb7bf70f1aa3e
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 68c0478f1ad01fb5227d18e52ed6f3733c766ab258ac16fe89b55fea3e8c20e6
  generator_version: 1.0.0
  client: codex
  kernel_id: planning
  kernel_file: KERNEL.md
  kernel_sha256: d53a49bb5b8b7313e251edc1ece8217886537382cb1e72294a4824031c039dd7
  adapter_sha256: 2bd28d0eca82f6146691e6c3634bd87b8e08fa1d5e90749265a19d1cbaa311e8
  evals_file: evals.json
  evals_sha256: 4156a82ccbe028e3224a1abf426ab91887c6c226840f6d5aeb0620baaf241d66
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

- Cannot act outside this contract: exactly 50 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 14 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Growth planning

<!-- architect-operation-contract
{"required_capability_ids":["brain.companies.answer","brain.companies.get","brain.context.browse","brain.context.get","brain.context.search","brain.evidence.search","brain.learning.query_benchmarks","brain.outreach.compare","calendar.events_create","calendar.events_list","command_center.action_items.list","command_center.assets.create","command_center.assets.list","command_center.feed.list","command_center.goals.get","command_center.overview.get","content.article_list","content.artifact_list","growth.governed_experiment_approve","growth.governed_experiment_conclude","growth.governed_experiment_create","growth.governed_experiment_get","growth.governed_experiment_list","growth.governed_experiment_measurement_record","growth.governed_experiment_publication_record","growth.governed_experiment_revise","growth.governed_experiment_stop","gtm.goals_list","gtm.tasks.counts","gtm.tasks.list","identity.content_pillars_generate","outreach.workspace_stats_get","record_files.list","record_files.upload","records.get","sequences.list","social.analytics_query","social.strategy_activity_calendar","social.strategy_archetype_benchmark","social.strategy_archetype_get","social.strategy_format_targets_suggest","social.strategy_overview","social.strategy_plan_progress","social.strategy_update","social.weekly_plan_items_list","tasks.create","tasks.get","visibility.overview","workbooks.list","workflows.list"]}
-->

Decide what to do next and make it concrete: durable strategy, a prioritized weekly plan, the buyer-facing assets the plan needs, and experiments that can tell you whether it worked. This job reads what the workspace already knows and what analytics already measured, then routes execution to the skill that owns it. It never executes the work itself.

## Read this first

1. Ground in cited workspace-wiki claims and measured performance before writing anything. See `strategy.md` for the read order.
2. Revise or state durable strategy: ICP, positioning, channel roles, objectives, tradeoffs. See `strategy.md`.
3. Turn strategy into 3 to 5 ranked weekly priorities, each with an owner, a deliverable, and a routed skill. See `weekly-plan.md`.
4. Name the buyer-facing assets the plan depends on and check whether they can actually be created. See `assets.md`.
5. Design experiments that can prove or disprove the plan worked. See `experiments.md` for the real approval and evidence mechanism.
6. Hand off execution to the current owner: `workbooks` for table structure, `sourcing-enrichment` for producers and row evidence, `qualification` for rubric and frozen cohort, `sequences` for author/validate/bind, `workflows` for publish/enroll/activate/run, plus `social`, `seo`, `geo`, `research`, and `writing` for their domains. Planning does not absorb execution.

## Evidence or it does not ship

Every recommendation names the exact capability read it rests on, the value returned, and when that read happened this turn. Nothing here refreshes on its own: a number from an earlier turn is stale, re-read it. If the workspace wiki, `command_center.overview.get`, or a named cohort's `brain.learning.query_benchmarks` result is missing, sparse, or irrelevant, say so and name the read that would close the gap. A plausible-sounding recommendation with no cited read attached is not a recommendation, drop it.

## Short, ranked, estimated

A ranked list of 3 to 5 items beats a comprehensive one. Every item states the outcome, the evidence it rests on, an impact estimate (low, medium, high) with the reason, the owning skill, and the smallest next action. State explicitly why lower-ranked items waited. No item may be generic marketing advice detached from this workspace's own evidence.

## Ask once, only when it changes the plan

Derive audience, objective, channel, and constraint from cited context and measured state before asking anything. Ask one consolidated question only when a missing priority, capacity, owner, or risk tolerance would change which items rank in the top 5. Never ask for a fact a completed read already returned.

## Route, do not absorb

Every weekly-plan item names exactly one current owner. Use `workbooks`, `sourcing-enrichment`, `qualification`, `sequences`, and `workflows` for the staged prospect-to-run lifecycle; use `social`, `seo`, `geo`, `research`, or `writing` for content and visibility work. Planning never drafts content, builds a workflow, publishes a sequence, enrolls a cohort, activates a run, or launches an external send.

## Governance moved to the server

Nothing in this job proposes a change for the model to get approved through a dedicated approval tool; that flow was retired. Authority now comes from the server's decision on each capability call: a governed experiment's `approve`, `stop`, and `conclude` are role-gated capabilities bound to the experiment's current revision, not a proposal object the model constructs. Read `experiments.md` before touching any `growth.governed_experiment_*` capability.

---
id: planning
name: planning
description: "Decide what to do next, turning workspace evidence into a strategy, a weekly growth plan, the assets it needs, and experiments to test it."
capability_domains: ["brain","calendar","command_center","content","growth","gtm","identity","outreach","record_files","records","sequences","social","tasks","visibility","workbooks","workflows"]
capability_ids: ["brain.companies.answer","brain.companies.get","brain.context.browse","brain.context.get","brain.context.search","brain.evidence.search","brain.learning.query_benchmarks","brain.outreach.compare","calendar.events_create","calendar.events_list","command_center.action_items.list","command_center.assets.create","command_center.assets.list","command_center.feed.list","command_center.goals.get","command_center.overview.get","content.article_list","content.artifact_list","growth.governed_experiment_approve","growth.governed_experiment_conclude","growth.governed_experiment_create","growth.governed_experiment_get","growth.governed_experiment_list","growth.governed_experiment_measurement_record","growth.governed_experiment_publication_record","growth.governed_experiment_revise","growth.governed_experiment_stop","gtm.goals_list","gtm.tasks.counts","gtm.tasks.list","identity.content_pillars_generate","outreach.workspace_stats_get","record_files.list","record_files.upload","records.get","sequences.list","social.analytics_query","social.strategy_activity_calendar","social.strategy_archetype_benchmark","social.strategy_archetype_get","social.strategy_format_targets_suggest","social.strategy_overview","social.strategy_plan_progress","social.strategy_update","social.weekly_plan_items_list","tasks.create","tasks.get","visibility.overview","workbooks.list","workflows.list"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"plan_state","description":"Prioritized technical and content plan state.","allowed_values":["prioritized","partial","unavailable","not_applicable"]}]}
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
  kernel_id: planning
  kernel_file: KERNEL.md
  kernel_sha256: d53a49bb5b8b7313e251edc1ece8217886537382cb1e72294a4824031c039dd7
  adapter_sha256: 70782f3e9f6737f17c8becfc79a8c2b0875162a32b25144be630a93b60c0a06e
  evals_file: evals.json
  evals_sha256: 4156a82ccbe028e3224a1abf426ab91887c6c226840f6d5aeb0620baaf241d66
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

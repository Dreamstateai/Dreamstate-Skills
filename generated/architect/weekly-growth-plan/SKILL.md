---
id: weekly-growth-plan
name: Weekly Growth Plan
description: Prioritize a one-week cross-channel operating plan with owners, deliverables, measures, and explicit delegation without silently executing it.
triggers: ["plan my growth week","prioritize work across channels","create a weekly operating plan","decide what the team should do next"]
dependencies: []
capability_domains: []
capability_ids: ["brain.context.get","brain.context.search","calendar.events_create","calendar.events_list","command_center.action_items.list","command_center.feed.list","command_center.goals.get","command_center.overview.get","content.article_list","content.artifact_list","gtm.goals_list","gtm.tasks.list","outreach.workspace_stats_get","record_files.list","record_files.upload","records.get","sequences.list","social.analytics_query","social.strategy_activity_calendar","social.strategy_overview","social.strategy_plan_progress","social.weekly_plan_items_list","tasks.create","tasks.get","visibility.overview","workbooks.list","workflows.list"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 6611ca355fcc43b1793d30eaf2a59b6c0c2bba5a1ce76a23913c5ee32a9de23f
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 3308959ee5a8c299
  manifest_digest: caf0df71ed39b2908438094693b00278a571035efd2082af0ab34953c559fcce
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 6611ca355fcc43b1793d30eaf2a59b6c0c2bba5a1ce76a23913c5ee32a9de23f
  generator_version: 1.0.0
  kernel_id: weekly-growth-plan
  kernel_file: KERNEL.md
  kernel_sha256: 06a6d8eb74bd0e5c6542bc0108550935669c5409d40abe25455eddcfd16ce669
  adapter_sha256: b09e5a8d3257e86d733b6d933247e93cbb60307b2a7d7f3c3f1110117356ec51
  evals_file: evals.json
  evals_sha256: 5899b3d94fb2a9542b9b46e92f13bb6952fae5fdec394e632b86c03fdc68b2a3
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, cost bounds, and the server's ActionDecision into the next step. Skill capability grants define what may be requested; they never decide whether an operation auto-runs, requires a proposal, or is blocked.

Follow the fetched contract and ActionDecision mechanically. When it requires a proposal, create the complete revision-bound artifact with `propose_artifact`, present that exact proposal for human review, and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. When it permits an auto-run, call `tools_run` with the exact bound inputs. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 27 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 3 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

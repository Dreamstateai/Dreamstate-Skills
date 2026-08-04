---
id: strategy
name: strategy
description: "Create or revise evidence-backed ICP, positioning, channel roles, objectives, tradeoffs, and durable strategy proposals."
capability_domains: ["brain","context"]
capability_ids: ["brain.companies.answer","brain.companies.get","brain.context.browse","brain.context.get","brain.context.search","brain.learning.query_benchmarks","brain.outreach.compare","command_center.goals.get","gtm.goals_list","identity.content_pillars_generate","social.strategy_archetype_benchmark","social.strategy_archetype_get","social.strategy_format_targets_suggest","social.strategy_overview","social.strategy_plan_progress","social.strategy_update"]
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 7a964687b781fd3d
  manifest_digest: 734ba3f90ea986bec4c4286c00492d1dff57fc23b69d7ce710db1a08b9dd0ba1
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  generator_version: 1.0.0
  client: codex
  kernel_id: strategy
  kernel_file: KERNEL.md
  kernel_sha256: 0f9626ebef6ffc6f271582bd5b4a06561d723366ba4af0215b8f770b18e877d1
  adapter_sha256: 953425f9d3920b128b22cda112dfb7fe582542ccc78b0f9cb200d3bba6e18d2a
  evals_file: evals.json
  evals_sha256: daa8be0aa24b9ca05181ac3a7720bda2f9f7c23a1f618fdce4a05eedbb46c0b4
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

- Cannot act outside this contract: exactly 16 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 3 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Growth strategy
<!-- architect-operation-contract
{"required_capability_ids":["brain.companies.answer","brain.companies.get","brain.context.browse","brain.context.get","brain.context.search","brain.learning.query_benchmarks","brain.outreach.compare","command_center.goals.get","gtm.goals_list","identity.content_pillars_generate","social.strategy_archetype_benchmark","social.strategy_archetype_get","social.strategy_format_targets_suggest","social.strategy_overview","social.strategy_plan_progress","social.strategy_update"]}
-->

Create or revise durable growth strategy: ICP, problem, positioning, proof, channel roles, constraints, objectives, tradeoffs, and measurement. Strategy decides where and why to play; it does not execute a campaign or weekly task list.

Inspect the workspace wiki with `brain.context.browse`, then use narrow `brain.context.search` and exact `brain.context.get` reads for current published strategy, derived cited claims, evidence, and revisions. Also inspect measured performance, active work, and explicit user direction. Separate canonical claim, observed metric, inference, and recommendation. Ask one structured popup only for an unresolved decision that changes positioning, target, channel allocation, or risk.

Before designing a strategy for a named audience or named cohort, fetch and call `brain.learning.query_benchmarks` for that approved cohort. Cite only returned cohort-level evidence: the resolved cohort or persona, messaging archetype, reply, meeting-booked, or conversion interval, sample and contributor bands, evidence tier, and confidence level. If the result is unavailable, sparse, suppressed, or irrelevant, state `insufficient_evidence`. Never invent numbers or expose raw cross-workspace rows.

Use live search/get for authorized reads and for any durable strategy proposal capability. Present alternatives with evidence and consequences, then propose one coherent decision set with assumptions, rejected options, metrics, review date, and downstream skill handoffs. Do not mutate canonical strategy without an exact proposal contract and approval. Never claim that a strategy was saved from prose alone.

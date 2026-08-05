---
id: strategy
name: Strategy
description: Create or revise evidence-backed ICP, positioning, channel roles, objectives, tradeoffs, and durable strategy proposals.
triggers: ["create a growth strategy","revise ICP or positioning","decide channel roles","make a durable strategic decision"]
dependencies: []
capability_domains: ["brain","context"]
capability_ids: ["brain.companies.answer","brain.companies.get","brain.context.browse","brain.context.get","brain.context.search","brain.learning.query_benchmarks","brain.outreach.compare","command_center.goals.get","gtm.goals_list","identity.content_pillars_generate","social.strategy_archetype_benchmark","social.strategy_archetype_get","social.strategy_format_targets_suggest","social.strategy_overview","social.strategy_plan_progress","social.strategy_update"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 00bec8d31dc672d9
  manifest_digest: 6754a12996b1ba6581c889f47533d4469f8bdcad8c153876a061e9bf98071bf9
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  generator_version: 1.0.0
  kernel_id: strategy
  kernel_file: KERNEL.md
  kernel_sha256: 0f9626ebef6ffc6f271582bd5b4a06561d723366ba4af0215b8f770b18e877d1
  adapter_sha256: f9df446c177b87844609548440ac001be435db14ab5caff052dab6b55333a6cc
  evals_file: evals.json
  evals_sha256: daa8be0aa24b9ca05181ac3a7720bda2f9f7c23a1f618fdce4a05eedbb46c0b4
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`: name every capability id this turn is likely to need as `query_terms` in one call, drawn from this skill's own capability_ids, instead of one narrower search per goal. `tools_get` refuses an id this turn never searched, so a capability id must appear in some earlier `tools_search` result before it can be fetched, even one already named by this skill's grant. The three-search discovery budget exists for genuinely unknown needs, not for fetching one already-named id at a time; spend it in as few calls as the turn's real uncertainty requires. Fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, cost bounds, and the server's ActionDecision into the next step. Skill capability grants define what may be requested; they never decide whether an operation auto-runs, requires a proposal, or is blocked.

Follow the fetched contract and ActionDecision mechanically. When it requires a proposal, create the complete revision-bound artifact with `propose_artifact`, present that exact proposal for human review, and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. When it permits an auto-run, call `tools_run` with the exact bound inputs. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 16 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 3 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

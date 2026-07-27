---
id: strategy
name: Strategy
description: Create or revise evidence-backed ICP, positioning, channel roles, objectives, tradeoffs, and durable strategy proposals.
triggers: ["create a growth strategy","revise ICP or positioning","decide channel roles","make a durable strategic decision"]
dependencies: []
capability_domains: ["brain","context"]
capability_ids: ["brain.companies.answer","brain.companies.get","brain.context.get","brain.context.search","brain.learning.query_benchmarks","brain.outreach.compare","brand.context_list","command_center.goals.get","gtm.goals_list","identity.content_pillars_generate","social.strategy_archetype_benchmark","social.strategy_archetype_get","social.strategy_format_targets_suggest","social.strategy_overview","social.strategy_plan_progress","social.strategy_update"]
direct_run_capability_ids: []
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 3010420c5a656d51ad106f397d974fe48a9e9232b451bd99fe4e4f682df2c6a2
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 0f792191fabb37cf
  manifest_digest: ab47e1dafaa5b0db4a00788025060197b9ddd29bc42bf376ea0313842c31e933
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.6
  source_release_hash: 3010420c5a656d51ad106f397d974fe48a9e9232b451bd99fe4e4f682df2c6a2
  generator_version: 1.0.0
  kernel_id: strategy
  kernel_file: KERNEL.md
  kernel_sha256: 8832cb5f28cf1a3f59c159a31cb3f6c2e302c323d235e5b1615f6b51a906ba86
  adapter_sha256: a7c18277f6dcbb42eb3ca03f5471699e8d52aee4ce0e2dbb3bc1f8846a58c2b1
  evals_file: evals.json
  evals_sha256: 19de4cdcc4a791ddbc5b112e01a814f5a704896f29561be538c32022c4af5528
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, and cost bounds into the next step. `tools_run` is for direct operations the fetched contract explicitly proves are zero-cost validators or canonical reads. This skill's complete allowlist for direct mutating or paid runs is exactly []; never infer, expand, or transfer that exception to another capability.

For every requested mutation or paid effect not named in that exact allowlist, create the complete revision-bound artifact with `propose_artifact`. Present that exact proposal for human review and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. Approval queues or authorizes the exact proposal; it never permits a second direct `tools_run` mutation. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

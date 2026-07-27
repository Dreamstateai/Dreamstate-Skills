---
id: strategy
name: strategy
description: "Create or revise evidence-backed ICP, positioning, channel roles, objectives, tradeoffs, and durable strategy proposals."
capability_domains: ["brain","context"]
capability_ids: ["brain.context.get","brain.context.search","brain.learning.query_benchmarks","social.strategy_overview","social.strategy_update"]
direct_run_capability_ids: []
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: b7d964bd23675868f77cdb5041b49e9eb98de5c70064ee53e07a048e5ec37cdd
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 779304f4256ec197
  manifest_digest: f75e69f81ba15118ace05828ddfd77f39864c9b312087243279a0ef894e64e01
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.4
  source_release_hash: b7d964bd23675868f77cdb5041b49e9eb98de5c70064ee53e07a048e5ec37cdd
  generator_version: 1.0.0
  client: claude
  kernel_id: strategy
  kernel_file: KERNEL.md
  kernel_sha256: efdf0aedf75a26cf833e9adb8d6765d0a4e7c4c9999aabcd4f73443672de9d38
  adapter_sha256: ed1251105b794ec02978e1d6a1edca907f53a555b2f182503242493e014c5f4c
  evals_file: evals.json
  evals_sha256: e721f2fcb0e2ab9457066c4f686f20ec48bed1b5cf994733bd7082da157d690b
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

# Growth strategy
<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","brain.learning.query_benchmarks","social.strategy_overview","social.strategy_update"]}
-->

Create or revise durable growth strategy: ICP, problem, positioning, proof, channel roles, constraints, objectives, tradeoffs, and measurement. Strategy decides where and why to play; it does not execute a campaign or weekly task list.

Inspect current published strategy, Company Brain evidence and revisions, measured performance, active work, and explicit user direction. Separate canonical fact, observed metric, inference, and recommendation. Ask one structured popup only for an unresolved decision that changes positioning, target, channel allocation, or risk.

Before designing a strategy for a named audience or named cohort, fetch and call `brain.learning.query_benchmarks` for that approved cohort. Cite only returned cohort-level evidence: the resolved cohort or persona, messaging archetype, reply, meeting-booked, or conversion interval, sample and contributor bands, evidence tier, and confidence level. If the result is unavailable, sparse, suppressed, or irrelevant, state `insufficient_evidence`. Never invent numbers or expose raw cross-workspace rows.

Use live search/get for authorized reads and for any durable strategy proposal capability. Present alternatives with evidence and consequences, then propose one coherent decision set with assumptions, rejected options, metrics, review date, and downstream skill handoffs. Do not mutate canonical strategy without an exact proposal contract and approval. Never claim that a strategy was saved from prose alone.

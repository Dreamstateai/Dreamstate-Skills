---
id: weekly-growth-plan
name: weekly-growth-plan
description: "Prioritize a one-week cross-channel operating plan with owners, deliverables, measures, and explicit delegation without silently executing it."
capability_domains: []
capability_ids: ["brain.context.get","brain.context.search","social.strategy_overview","social.weekly_plan_items_list","visibility.overview","workflows.list"]
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: d79499f42c8fd6928357fe975180b0bfae3d3a97c71f89554c80223b16d1f160
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 01002d9587befbf3
  manifest_digest: f91ed1b74ebe129ef522f45fdcaec299626b3b5f1d0209e2d0a44bf4684f9ab0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.3
  source_release_hash: d79499f42c8fd6928357fe975180b0bfae3d3a97c71f89554c80223b16d1f160
  generator_version: 1.0.0
  client: codex
  kernel_id: weekly-growth-plan
  kernel_file: KERNEL.md
  kernel_sha256: 3854b74f38da0d20bb6026e0b7a770a475ad5c8543ba8cd4445be9a96148e94a
  adapter_sha256: 5ae4590e6d1ad3b7e3bda4638e899f5967e3fc790928b2dbf4cb5b2f43b3c2d2
  evals_file: evals.json
  evals_sha256: 1a7ab87f6b25b1448c08ca5a2bfe26aa29b9320aac910712131ad059a54df0da
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is only for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. Never use `dreamstate_tools_run` for direct mutating or paid work.

For any requested mutation or paid effect, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Weekly cross-channel growth plan
<!-- architect-operation-contract
{"required_capability_ids": ["brain.context.get", "brain.context.search", "social.strategy_overview", "social.weekly_plan_items_list", "visibility.overview", "workflows.list"]}
-->

Build one evidence-backed operating plan for the next week across the channels the user selects. This is a prioritization and delegation layer, not a social calendar and not an execution shortcut.

Inspect current goals, published Company Brain strategy, active campaigns and calendars, measured performance, open review items, capacity, deadlines, and active surface. Ask one structured popup only when a missing priority, capacity, owner, or risk tolerance materially changes the week.

Produce one diagnosis and three to five ranked priorities. Each priority names the outcome, evidence, owner, exact deliverable, channel, dependency, due date, measure, review gate, and smallest useful next action. Explain why lower-ranked work is deferred. Distinguish an authored-content schedule from Reddit community engagement, outreach, visibility, blog, and buyer-facing assets.

Use live capability search/get to determine what can be read, proposed, persisted, or executed. The weekly plan itself must not silently run delegated work. When the user asks to continue, load the smallest owning skill for each accepted priority and preserve one shared objective so delegates do not duplicate artifacts. Consequence approvals remain inside the owning skill.

Return the reviewable plan, evidence and assumptions, capacity allocation, delegated skill ids, measurement loop, and end-of-week review criteria. State clearly which items are only planned and which have separate durable proposals or runs.

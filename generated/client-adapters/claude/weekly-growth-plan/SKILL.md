---
id: weekly-growth-plan
name: weekly-growth-plan
description: "Prioritize a one-week cross-channel operating plan with owners, deliverables, measures, and explicit delegation without silently executing it."
capability_domains: []
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 04784d702af011050f185a5e9cc4c3c3c4224e12d4000a28c0c7cb36e89e8a24
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 0306749b52b38cca
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.3.0
  source_release_hash: 04784d702af011050f185a5e9cc4c3c3c4224e12d4000a28c0c7cb36e89e8a24
  generator_version: 1.0.0
  client: claude
  kernel_id: weekly-growth-plan
  kernel_file: KERNEL.md
  kernel_sha256: 5156685bb3d677cb310874ccbcdfdb45a73a968c6bbf62fc1cb2f3bef4d0649c
  adapter_sha256: 7a633b1717cebb092d6c86e6b17b1eaf9639557b7efd4fdf65a9fc913345288f
  evals_file: evals.json
  evals_sha256: d963532fbc7ae6cc04ffc931581791d2192a6e5cc6b47bf7005a6dfe2c5a67a3
mutation_compatibility:
  mismatch_behavior: deny_run
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is only for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. Never use `dreamstate_tools_run` for direct mutating or paid work.

For any requested mutation or paid effect, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Weekly cross-channel growth plan

Build one evidence-backed operating plan for the next week across the channels the user selects. This is a prioritization and delegation layer, not a social calendar and not an execution shortcut.

Inspect current goals, published Company Brain strategy, active campaigns and calendars, measured performance, open review items, capacity, deadlines, and active surface. Ask one structured popup only when a missing priority, capacity, owner, or risk tolerance materially changes the week.

Produce one diagnosis and three to five ranked priorities. Each priority names the outcome, evidence, owner, exact deliverable, channel, dependency, due date, measure, review gate, and smallest useful next action. Explain why lower-ranked work is deferred. Distinguish an authored-content schedule from Reddit community engagement, outreach, visibility, blog, and buyer-facing assets.

Use live capability search/get to determine what can be read, proposed, persisted, or executed. The weekly plan itself must not silently run delegated work. When the user asks to continue, load the smallest owning skill for each accepted priority and preserve one shared objective so delegates do not duplicate artifacts. Consequence approvals remain inside the owning skill.

Return the reviewable plan, evidence and assumptions, capacity allocation, delegated skill ids, measurement loop, and end-of-week review criteria. State clearly which items are only planned and which have separate durable proposals or runs.

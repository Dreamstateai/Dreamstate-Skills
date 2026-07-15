---
id: strategy
name: strategy
description: "Create or revise evidence-backed ICP, positioning, channel roles, objectives, tradeoffs, and durable strategy proposals."
capability_domains: ["brain","context"]
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: be8f899ad92233a85f209c5a1e3a81935821fde07ffcd26fc0f26200ba399df5
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 908395dbdf63e39b
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.3.0
  source_release_hash: be8f899ad92233a85f209c5a1e3a81935821fde07ffcd26fc0f26200ba399df5
  generator_version: 1.0.0
  client: claude
  kernel_id: strategy
  kernel_file: KERNEL.md
  kernel_sha256: 77a8837bb29012cd2f05d0495de8a6b0bbbcfb5a05360e8b1a2e17e7fbae09c8
  adapter_sha256: e8d99ea288bffa663c80aa3ca106aeb5910b1cd35cf33b8eb109db149641d46a
  evals_file: evals.json
  evals_sha256: 97a179e43d1827dd7eb2763452980a94ccf8cffbf539a9ce80d348a8ccd6e85d
mutation_compatibility:
  mismatch_behavior: deny_run
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get]
  denied_operation: dreamstate_tools_run
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Carry the opaque tool-turn token mechanically from `dreamstate_tools_search` to `dreamstate_tools_get` and `dreamstate_tools_run`; always fetch exact live schemas before execution.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search` and `dreamstate_tools_get` remain available for recovery and refresh when the live capability definition, capability hash, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple is compatible with live metadata. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from an accepted or queued request.

---

# Growth strategy

Create or revise durable growth strategy: ICP, problem, positioning, proof, channel roles, constraints, objectives, tradeoffs, and measurement. Strategy decides where and why to play; it does not execute a campaign or weekly task list.

Inspect current published strategy, Company Brain evidence and revisions, measured performance, active work, and explicit user direction. Separate canonical fact, observed metric, inference, and recommendation. Ask one structured popup only for an unresolved decision that changes positioning, target, channel allocation, or risk.

Use live search/get for authorized reads and for any durable strategy proposal capability. Present alternatives with evidence and consequences, then propose one coherent decision set with assumptions, rejected options, metrics, review date, and downstream skill handoffs. Do not mutate canonical strategy without an exact proposal contract and approval. Never claim that a strategy was saved from prose alone.

---
id: tasks
name: tasks
description: "Read, create, update, reassign, complete, reopen, cancel, and bulk-manage exact canonical workspace tasks."
capability_domains: ["tasks"]
capability_ids: ["tasks.bulk","tasks.cancel","tasks.complete","tasks.count","tasks.create","tasks.get","tasks.list","tasks.reassign","tasks.reopen","tasks.update"]
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 70b89077b92a973aeb192455dbd6aeb4580a7922894b21e19db09bde3dda6ea3
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 4537b0bc2deb7531
  manifest_digest: 9124a4eff635a9ea52a8132b6ba4aa088ce153dc2b3c1561282a04d146b8c4f8
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 70b89077b92a973aeb192455dbd6aeb4580a7922894b21e19db09bde3dda6ea3
  generator_version: 1.0.0
  client: claude
  kernel_id: tasks
  kernel_file: KERNEL.md
  kernel_sha256: 44823e2209b86385e9d80c2487fd23d6ecc496314a0db574839eded6a44b93e3
  adapter_sha256: 26dbff1d909a5bab889ef12256f8cb22ca8ac253e9bee49b0ee667252e65db6f
  evals_file: evals.json
  evals_sha256: 6ea646a0c6e3a23e6f9c91c635e379a99efb1d3af82de800ef5d6c3c987bc0b6
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes `dreamstate_context_create_document`, `dreamstate_context_create_folder`, `dreamstate_context_save_and_publish`, and `dreamstate_context_save_draft` under the same mismatch. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 10 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 7 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Workspace task operations
<!-- architect-operation-contract
{"required_capability_ids":["tasks.bulk","tasks.cancel","tasks.complete","tasks.count","tasks.create","tasks.get","tasks.list","tasks.reassign","tasks.reopen","tasks.update"]}
-->

Manage durable workspace tasks through exact live contracts. Read the task and current assignee before changing it. Preserve task ID, revision, status, assignee, due date, provenance, and deep link.

Use `tasks.list`, `tasks.count`, and `tasks.get` for current truth. Create or update only the fields requested. Complete, reopen, cancel, or reassign the exact current task; never infer an identity from a title. For bulk work, preview the exact selected IDs and apply one bounded `tasks.bulk` request.

Zero-credit reversible task writes follow the server ActionDecision and execute directly when authorized. Do not invent a proposal or approval step. Report partial bulk outcomes and stale revisions explicitly.

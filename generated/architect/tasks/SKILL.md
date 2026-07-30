---
id: tasks
name: Tasks
description: Read, create, update, reassign, complete, reopen, cancel, and bulk-manage exact canonical workspace tasks.
triggers: ["show workspace tasks","create or update a task","reassign or complete a task","bulk change selected tasks"]
dependencies: []
capability_domains: ["tasks"]
capability_ids: ["tasks.bulk","tasks.cancel","tasks.complete","tasks.count","tasks.create","tasks.get","tasks.list","tasks.reassign","tasks.reopen","tasks.update"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 91b7bc084f4f3ad7920057128b7deeb9d5aa3dcbe347e4ea65552d593a5ece88
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5bd51a68ef00f441
  manifest_digest: f71a57af4031c49ae5196f700bc1d62a7307d0ef152ff1d7a649f3e34506052b
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 91b7bc084f4f3ad7920057128b7deeb9d5aa3dcbe347e4ea65552d593a5ece88
  generator_version: 1.0.0
  kernel_id: tasks
  kernel_file: KERNEL.md
  kernel_sha256: 44823e2209b86385e9d80c2487fd23d6ecc496314a0db574839eded6a44b93e3
  adapter_sha256: c58e3054b8e7f661275af743f29171ce5817778f07be7aa14ff0163e5e6a910a
  evals_file: evals.json
  evals_sha256: 6ea646a0c6e3a23e6f9c91c635e379a99efb1d3af82de800ef5d6c3c987bc0b6
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

- Cannot act outside this contract: exactly 10 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 7 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

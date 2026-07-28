---
id: outreach-workflow-builder
name: Outreach Workflow Builder
description: Build validated row workflows with triggers, typed branches, action handoffs, stop logic, eligibility, and explicit workflow-versus-expansion-versus-activation consequence boundaries.
triggers: ["build an outreach workflow","branch on qualification or priority","automate row processing","define enrollment eligibility","separate workflow persistence, exact result-set expansion, enrollment, and activation"]
dependencies: []
capability_domains: ["outreach"]
capability_ids: ["columns.list","rows.get","rows.query","runs.cancel","runs.get","runs.pause","runs.resume","table_sources.list","tables.get","tables.list","views.get","views.list","workbooks.get","workbooks.list","workflows.archive","workflows.call_child","workflows.create","workflows.draft_publish","workflows.draft_save","workflows.get","workflows.graph_apply","workflows.list","workflows.metrics_get","workflows.node_inspect","workflows.node_options","workflows.node_registry","workflows.run_retry","workflows.run_trace_get","workflows.runs_list","workflows.trigger_create","workflows.trigger_delete","workflows.triggers_list","workflows.validate_graph","worksheets.list"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"activation_state","description":"Whether workflow activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 4a08db5d3a34df1c10971f9692222764b108a94dc2734bebebba97bd69df1379
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5d0fd03da3726899
  manifest_digest: c736598d5698918913d924c5887ad5856c88f7dbb735dacb5f2824a5a33039f2
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 4a08db5d3a34df1c10971f9692222764b108a94dc2734bebebba97bd69df1379
  generator_version: 1.0.0
  kernel_id: outreach-workflow-builder
  kernel_file: KERNEL.md
  kernel_sha256: 6d786028ea4937001ef6b38358138ea263952419ed0861750a49545561f27bcd
  adapter_sha256: 8041368785f549079dfd7bdef819a92634ada7fdf64b40ba48434887cddd1da7
  evals_file: evals.json
  evals_sha256: 3e28388c9b94c4e9d25242ee374d3fbe8062dc1d34627f7d4848f5fece8e76b3
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

- Cannot act outside this contract: exactly 34 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 12 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.
- Cannot hold a source definition as a capability grant: all 26 source definitions in the pinned manifest are discovery-only and carry no executor id, so granting one would be a no-op. Say the source is reached by attaching it to a worksheet and acting on that attachment.

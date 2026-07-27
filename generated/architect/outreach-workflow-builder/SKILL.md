---
id: outreach-workflow-builder
name: Outreach Workflow Builder
description: Build validated row workflows with triggers, typed branches, action handoffs, stop logic, eligibility, and explicit workflow-versus-expansion-versus-activation consequence boundaries.
triggers: ["build an outreach workflow","branch on qualification or priority","automate row processing","define enrollment eligibility","separate workflow persistence, exact result-set expansion, enrollment, and activation"]
dependencies: []
capability_domains: ["outreach"]
capability_ids: ["columns.list","rows.get","rows.query","table_sources.list","tables.get","tables.list","views.get","views.list","workbooks.get","workbooks.list","workflows.archive","workflows.call_child","workflows.create","workflows.draft_save","workflows.get","workflows.graph_apply","workflows.list","workflows.node_inspect","workflows.node_options","workflows.node_registry","workflows.run_trace_get","workflows.runs_list","workflows.trigger_create","workflows.trigger_delete","workflows.triggers_list","workflows.validate_graph","worksheets.list"]
direct_run_capability_ids: []
max_context_tokens: 5000
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"activation_state","description":"Whether workflow activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 6425806fd6c3948bbf661bf6dfe61479022f86123e3b5ec0d869365b80d6892b
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 779304f4256ec197
  manifest_digest: f75e69f81ba15118ace05828ddfd77f39864c9b312087243279a0ef894e64e01
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.5
  source_release_hash: 6425806fd6c3948bbf661bf6dfe61479022f86123e3b5ec0d869365b80d6892b
  generator_version: 1.0.0
  kernel_id: outreach-workflow-builder
  kernel_file: KERNEL.md
  kernel_sha256: f9cfc7a0faea8ec42e5c52c7abbf6807b4b88f92e6b7ee7988c8511c7c301f53
  adapter_sha256: a7c18277f6dcbb42eb3ca03f5471699e8d52aee4ce0e2dbb3bc1f8846a58c2b1
  evals_file: evals.json
  evals_sha256: c2800607862e8106ba230d91a216db38bf06043efdace7c45c77bda3cd630307
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

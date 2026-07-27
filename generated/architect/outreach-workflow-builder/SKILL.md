---
id: outreach-workflow-builder
name: Outreach Workflow Builder
description: Build validated row workflows with triggers, typed branches, action handoffs, stop logic, eligibility, and explicit workflow-versus-expansion-versus-activation consequence boundaries.
triggers: ["build an outreach workflow","branch on qualification or priority","automate row processing","define enrollment eligibility","separate workflow persistence, exact result-set expansion, enrollment, and activation"]
dependencies: []
capability_domains: ["outreach"]
capability_ids: ["sources.cold_outbound_expand","workflows.get","workflows.graph_apply","workflows.node_registry","workflows.validate_graph"]
max_context_tokens: 5000
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"activation_state","description":"Whether campaign activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]},{"id":"campaign_state","description":"Campaign lifecycle state at the current boundary.","allowed_values":["inactive","active","blocked","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: a93e020d70c2da5e3ab05b7c9edbd35d7e88c7e5293e2fcaee9d7955fa870a95
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 01002d9587befbf3
  manifest_digest: f91ed1b74ebe129ef522f45fdcaec299626b3b5f1d0209e2d0a44bf4684f9ab0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.3
  source_release_hash: a93e020d70c2da5e3ab05b7c9edbd35d7e88c7e5293e2fcaee9d7955fa870a95
  generator_version: 1.0.0
  kernel_id: outreach-workflow-builder
  kernel_file: KERNEL.md
  kernel_sha256: 62c003cd21c94bbcd54bf45f68c030193651b1d867752e80254ff1b67a3ee5de
  adapter_sha256: fff181fcc4c16a1050a9ebce768287d7eab35c4157feff448beab729d10a1fe9
  evals_file: evals.json
  evals_sha256: 23fe0e62a2fe46b8c8b1860e76ecdac5197b75d0f0cbcc05f0649f4ba30a2284
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, and cost bounds into the next step. `tools_run` is only for direct operations the fetched contract explicitly proves are zero-cost validators or canonical reads, plus the writes this kernel names as directly runnable. Never use `tools_run` for any other mutating or paid work.

For every other requested mutation or paid effect, create the complete revision-bound artifact with `propose_artifact`. Present that exact proposal for human review and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. Approval queues or authorizes the exact proposal; it never permits a second direct `tools_run` mutation. Report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

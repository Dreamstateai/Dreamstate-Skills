---
id: outreach
name: Outreach
description: Open an existing outreach workflow or coordinate a new Workbook-first outreach system through ordered evidence-pilot, Workbook, draft-bundle, column-sample, capped-bulk, and activation-and-send gates.
triggers: ["open or revise an outreach workflow","build outreach from scratch","design outreach for a named cohort using pooled benchmarks","create a prospecting system","build a Workbook workflow and sequence","decide whether a workflow needs messaging"]
dependencies: ["tables","outreach-workflow-builder"]
capability_domains: ["brain","outreach"]
capability_ids: ["brain.context.get","brain.context.search","brain.learning.query_benchmarks","outreach.access_get","outreach.activity_list","outreach.credit_usage_get","outreach.demand_plan_get","outreach.enrichment_sequence_get","outreach.global_pause_set","outreach.icps_list","outreach.sender_context_accounts_list","rows.query","selection_snapshots.get","sequences.enroll_selection","sequences.publish","workbooks.create","workflows.activate","workflows.draft_publish","workflows.get","workflows.list"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"stage_boundary_state","description":"Ordered outreach-stage approval boundary state.","allowed_values":["ordered_separate","violated","not_applicable"]},{"id":"activation_state","description":"Whether workflow activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]},{"id":"external_send_state","description":"External-send authorization and pacing state.","allowed_values":["not_authorized","authorized_capped_paced","completed","partial","blocked","not_applicable"]},{"id":"messaging_branch_state","description":"Inspected workflow messaging-branch state.","allowed_values":["present","absent","unresolved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 9ef0b8d1529f252e06f64804b09ccdb210d671d52483d8e09b781f53733769ac
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 8313b15f26c8c946
  manifest_digest: 7f545f8a0bdabd348207c4bd5a6e5e1f0382e6146b90d95353d9ef6dc12f4fdb
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 9ef0b8d1529f252e06f64804b09ccdb210d671d52483d8e09b781f53733769ac
  generator_version: 1.0.0
  kernel_id: outreach
  kernel_file: KERNEL.md
  kernel_sha256: 6d282a487efd9bc177b9986f16887f6675f27efa1212d93608f2f14ebd9a9f0d
  adapter_sha256: f88548d7b36a407c37d6001bf25d29d19be05fa9c94775202ebfb310075170e2
  evals_file: evals.json
  evals_sha256: 48701650fe24c560e750565a5382d949a5cfb14c02e82015c3cc77d56a4bd2fd
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

- Cannot act outside this contract: exactly 20 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 6 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

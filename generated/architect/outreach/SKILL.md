---
id: outreach
name: Outreach
description: Open an existing campaign or coordinate a new custom campaign from scratch through ordered evidence-pilot, draft-bundle, column-sample, capped-bulk, and activation-and-send gates.
triggers: ["open or revise an outreach campaign","build a campaign from scratch","design an outreach campaign for a named cohort using pooled benchmarks","create a prospecting system","build a list workflow and sequence","decide whether a list workflow needs messaging"]
dependencies: ["tables","outreach-workflow-builder"]
capability_domains: ["brain","outreach"]
capability_ids: ["brain.context.get","brain.context.search","brain.learning.query_benchmarks","campaigns.activate","campaigns.create","campaigns.get","campaigns.graph_apply","outreach.demand_plan_get","sources.cold_outbound_expand","sources.cold_outbound_preview"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"stage_boundary_state","description":"Ordered campaign-stage approval boundary state.","allowed_values":["ordered_separate","violated","not_applicable"]},{"id":"activation_state","description":"Whether campaign activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]},{"id":"external_send_state","description":"External-send authorization and pacing state.","allowed_values":["not_authorized","authorized_capped_paced","completed","partial","blocked","not_applicable"]},{"id":"messaging_branch_state","description":"Validated workflow messaging-branch state.","allowed_values":["present","absent","unresolved","not_applicable"]},{"id":"campaign_state","description":"Campaign lifecycle state at the current boundary.","allowed_values":["inactive","active","blocked","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: b8267f05e7698a0343ea7bb7e5ef1e7724d2e6de132b92dfe722454cba846444
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: d9e85ef15d6916dd
  manifest_digest: 46d2671183ad22732eb60eb7383823b0496c1bf20b16e6c2aa641f554302348a
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.1
  source_release_hash: b8267f05e7698a0343ea7bb7e5ef1e7724d2e6de132b92dfe722454cba846444
  generator_version: 1.0.0
  kernel_id: outreach
  kernel_file: KERNEL.md
  kernel_sha256: c977d34c7552e6245dab20357eb10d5944f2a76707f2416b3eb2801661c9b3fe
  adapter_sha256: ecd475ca0450067312a912d3d5800ccc94ce008d768fc7176e14adaaedf1a36d
  evals_file: evals.json
  evals_sha256: d4c5dd7e365c39a5cc03ed4b1a7602387bbb9f8110f875a1a059b2eb5c341500
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, and cost bounds into the next step. `tools_run` is only for direct operations the fetched contract explicitly proves are zero-cost validators or canonical reads. Never use `tools_run` for direct mutating or paid work.

For every requested mutation or paid effect, create the complete revision-bound artifact with `propose_artifact`. Present that exact proposal for human review and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. Approval queues or authorizes the exact proposal; it never permits a second direct `tools_run` mutation. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

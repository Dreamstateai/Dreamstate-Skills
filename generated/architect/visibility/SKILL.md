---
id: visibility
name: Visibility
description: Run and interpret AI-answer visibility audits with real citations, method limits, gap diagnosis, governed refreshes, and a canonical inspection surface.
triggers: ["audit AI visibility","inspect citations in AI answers","diagnose answer-engine gaps","refresh visibility measurement"]
dependencies: []
capability_domains: ["visibility"]
capability_ids: ["visibility.citations","visibility.overview","visibility.refresh","visibility.tracked_prompts.list","visibility.workspace_site_get"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"observation_state","description":"Observation timestamp and source state.","allowed_values":["observed","cached","unavailable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 032a861caa0a439b4560be2b3d8af54818cb3cc7560d72718cbf864f371100d1
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: f545d33b0e147d4e
  manifest_digest: 897c121cd546d3212a7fed051f8198cfe4631eef1ab82ef4fbd2aec96321353b
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.1
  source_release_hash: 032a861caa0a439b4560be2b3d8af54818cb3cc7560d72718cbf864f371100d1
  generator_version: 1.0.0
  kernel_id: visibility
  kernel_file: KERNEL.md
  kernel_sha256: b38e5cd9ad318f28a800c07d1e7491d80d280fe2231fd387247c9864151baa30
  adapter_sha256: ecd475ca0450067312a912d3d5800ccc94ce008d768fc7176e14adaaedf1a36d
  evals_file: evals.json
  evals_sha256: 2ae01ee50f9897d52dae45b9d5dd1d61c5c2471cf2e27447de4808ffefaa0ca6
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

---
id: seo
name: SEO
description: Coordinate evidence-backed keyword research, technical diagnosis, content planning, AI visibility, and measured follow-up for a site and named audience.
triggers: ["build a keyword plan","audit technical SEO","plan search content","improve SEO or AI visibility"]
dependencies: []
capability_domains: ["brain","content","tables","visibility"]
capability_ids: ["brain.learning.query_benchmarks","seo.robots_audit","visibility.citations","visibility.keywords_get","visibility.overview","visibility.workspace_site_get"]
max_context_tokens: 5000
completion_contract: {"version":1,"fields":[{"id":"benchmark_state","description":"Pooled benchmark evidence availability.","allowed_values":["supported","insufficient_evidence","unavailable","not_applicable"]},{"id":"sample_state","description":"Benchmark sample band disclosure state.","allowed_values":["disclosed","unavailable","not_applicable"]},{"id":"confidence_state","description":"Evidence confidence disclosure state.","allowed_values":["disclosed","unavailable","not_applicable"]},{"id":"privacy_state","description":"Cross-workspace privacy boundary state.","allowed_values":["cohort_only","not_applicable"]},{"id":"observation_state","description":"Observation timestamp and source state.","allowed_values":["observed","cached","unavailable"]},{"id":"target_conversion","description":"Named target conversion state.","allowed_values":["defined","missing"]},{"id":"plan_state","description":"Prioritized technical and content plan state.","allowed_values":["prioritized","partial","unavailable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 1f8aeda96f41a951d0b4cb69bf8eb5ad35b31d5a520360b471c8ea433265800c
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: d9e85ef15d6916dd
  manifest_digest: 46d2671183ad22732eb60eb7383823b0496c1bf20b16e6c2aa641f554302348a
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.1
  source_release_hash: 1f8aeda96f41a951d0b4cb69bf8eb5ad35b31d5a520360b471c8ea433265800c
  generator_version: 1.0.0
  kernel_id: seo
  kernel_file: KERNEL.md
  kernel_sha256: 92a6fff0e6a6f51c24865168ce8577fe664040425a4f16032744d979659a0acc
  adapter_sha256: ecd475ca0450067312a912d3d5800ccc94ce008d768fc7176e14adaaedf1a36d
  evals_file: evals.json
  evals_sha256: 54994b4a8e1560f433682c67584a1fecdd09c9862ffd45924264378af4252da9
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

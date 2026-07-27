---
id: visibility
name: Visibility
description: Run and interpret AI-answer visibility audits with real citations, method limits, gap diagnosis, governed refreshes, and a canonical inspection surface.
triggers: ["audit AI visibility","inspect citations in AI answers","diagnose answer-engine gaps","refresh visibility measurement"]
dependencies: []
capability_domains: ["visibility"]
capability_ids: []
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"observation_state","description":"Observation timestamp and source state.","allowed_values":["observed","cached","unavailable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: b7991aeba1a58ca4b9c3a48155a8f5a3622eaeec867a0d2b459aa4ea614ec39d
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: a29a72f7045de668
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.1
  source_release_hash: b7991aeba1a58ca4b9c3a48155a8f5a3622eaeec867a0d2b459aa4ea614ec39d
  generator_version: 1.0.0
  kernel_id: visibility
  kernel_file: KERNEL.md
  kernel_sha256: 102aade9ef2682e7bd131ade758d7e7cc4420f4e57db4c7f1621f88990efcbe6
  adapter_sha256: 323f2c18e97b8d14419904eb432f67608b00047695f0dc1725b7576b85dae689
  evals_file: evals.json
  evals_sha256: 64bdfadf9be479646e25092a1407c28b43c8c742512843c9406627502ac9d194
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, then propose or run only from those schemas and gates. Return factual state and a compact typed handoff; never infer success from a proposal, approval, or queued request.

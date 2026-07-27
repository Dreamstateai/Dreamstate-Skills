---
id: tables
name: Tables
description: Create, inspect, revise, and run unified workbooks, tables, views, sources, columns, rows, and bounded table jobs with lineage and durable verification.
triggers: ["build a reactive table","inspect a table dataflow","add or revise table columns","run table work safely"]
dependencies: []
capability_domains: ["tables"]
capability_ids: []
max_context_tokens: 5000
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"schema_state","description":"Combined row identity, source, and dependency schema state.","allowed_values":["identity_source_dependencies_ready","partial","missing","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"cell_state","description":"Canonical settled-cell outcome state.","allowed_values":["settled","partial","failed","blocked","not_applicable"]}]}
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
  kernel_id: tables
  kernel_file: KERNEL.md
  kernel_sha256: a187da7158fe91d32aeedc34e15df80633a39d9190afb9fbf74c0d947ff4a845
  adapter_sha256: 323f2c18e97b8d14419904eb432f67608b00047695f0dc1725b7576b85dae689
  evals_file: evals.json
  evals_sha256: 553d9c5c43683539976f1d18b1f0bfde936792d8f2eec8aec5bd89d19cdf6225
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, then propose or run only from those schemas and gates. Return factual state and a compact typed handoff; never infer success from a proposal, approval, or queued request.

---
id: integrations
name: Integrations
description: Own account connection setup and repair, open safe connection flows, and resume work blocked by a disconnected provider without requesting secrets in chat. Provider content research, metrics, and search-window coverage remain with their domain skills.
triggers: ["connect an account or provider","diagnose connection readiness","fix a disconnected sender or authorization blocker","resume after connecting"]
dependencies: []
capability_domains: []
capability_ids: []
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"connection_status","description":"Provider connection readiness status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: f55a18de27f107e935b2e2e3df0b109956ccd57b03fd0cf216ec50e98fc414fa
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: a29a72f7045de668
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.1
  source_release_hash: f55a18de27f107e935b2e2e3df0b109956ccd57b03fd0cf216ec50e98fc414fa
  generator_version: 1.0.0
  kernel_id: integrations
  kernel_file: KERNEL.md
  kernel_sha256: e41ba440e27b81175efd268199458ebdccc2ab9bb64f32c3d8a22811d43cd574
  adapter_sha256: 323f2c18e97b8d14419904eb432f67608b00047695f0dc1725b7576b85dae689
  evals_file: evals.json
  evals_sha256: 8558d9507802b43b8ce793e719d7d4f84ea4c245ebc37fe852187f9be2db0b6e
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, then propose or run only from those schemas and gates. Return factual state and a compact typed handoff; never infer success from a proposal, approval, or queued request.

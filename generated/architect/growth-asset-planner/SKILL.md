---
id: growth-asset-planner
name: Growth Asset Planner
description: Design a buyer-facing resource and its evidence, structure, CTA, distribution, and follow-up path while remaining explicitly unsaved until live persistence exists.
triggers: ["design a lead magnet","create a buyer checklist or playbook","plan an audit or SOP","design a resource hub"]
dependencies: []
capability_domains: []
capability_ids: []
max_context_tokens: 3500
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
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
  kernel_id: growth-asset-planner
  kernel_file: KERNEL.md
  kernel_sha256: 5499e4fa692558dd4a98019503d0c1afa9e2e5731be5be8de80529301c8c75fc
  adapter_sha256: 323f2c18e97b8d14419904eb432f67608b00047695f0dc1725b7576b85dae689
  evals_file: evals.json
  evals_sha256: e6b08884e735b77c6da39c1d8fcd1530b430d51589ba1b3ac2b6ed3c71bb56e5
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, then propose or run only from those schemas and gates. Return factual state and a compact typed handoff; never infer success from a proposal, approval, or queued request.

---
id: social
name: Social
description: Coordinate authored LinkedIn, X, and Reddit content across drafts, calendars, review, publishing, and measured performance.
triggers: ["author a social post","build a social calendar","schedule or publish authored content","analyze social performance"]
dependencies: []
capability_domains: ["brain","content"]
capability_ids: []
max_context_tokens: 5000
completion_contract: {"version":1,"fields":[{"id":"provider_status","description":"Social provider connection or availability status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
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
  kernel_id: social
  kernel_file: KERNEL.md
  kernel_sha256: 7fcd112a1336116cc6ad15825516c511bfcc535be627813173587880348e351f
  adapter_sha256: 323f2c18e97b8d14419904eb432f67608b00047695f0dc1725b7576b85dae689
  evals_file: evals.json
  evals_sha256: 4a27a9fed4b381c442c41451c9a419a2d469115c3b8fa7ac8e0735066be12684
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, then propose or run only from those schemas and gates. Return factual state and a compact typed handoff; never infer success from a proposal, approval, or queued request.

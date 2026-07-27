---
id: outreach
name: Outreach
description: Open an existing campaign or coordinate a new custom campaign from scratch through ordered evidence-pilot, draft-bundle, column-sample, capped-bulk, and activation-and-send gates.
triggers: ["open or revise an outreach campaign","build a campaign from scratch","design an outreach campaign for a named cohort using pooled benchmarks","create a prospecting system","build a list workflow and sequence","decide whether a list workflow needs messaging"]
dependencies: ["tables","outreach-workflow-builder"]
capability_domains: ["brain","outreach"]
capability_ids: []
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"stage_boundary_state","description":"Ordered campaign-stage approval boundary state.","allowed_values":["ordered_separate","violated","not_applicable"]},{"id":"activation_state","description":"Whether campaign activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]},{"id":"external_send_state","description":"External-send authorization and pacing state.","allowed_values":["not_authorized","authorized_capped_paced","completed","partial","blocked","not_applicable"]},{"id":"messaging_branch_state","description":"Validated workflow messaging-branch state.","allowed_values":["present","absent","unresolved","not_applicable"]},{"id":"campaign_state","description":"Campaign lifecycle state at the current boundary.","allowed_values":["inactive","active","blocked","not_applicable"]}]}
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
  kernel_id: outreach
  kernel_file: KERNEL.md
  kernel_sha256: 2d0d9e04ec0b5574e2acadf2378af5bc70ffb97c7cb3a39ab81949c327983711
  adapter_sha256: 323f2c18e97b8d14419904eb432f67608b00047695f0dc1725b7576b85dae689
  evals_file: evals.json
  evals_sha256: 2098874a845d24fb19b2368a57bd3cf43e77381f88c818d23c2a0e9114b6d336
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, then propose or run only from those schemas and gates. Return factual state and a compact typed handoff; never infer success from a proposal, approval, or queued request.

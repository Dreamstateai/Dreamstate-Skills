---
id: blog
name: Blog
description: Manage grounded blog research, draft, editorial review, revision, scheduling, publication, and canonical editor inspection.
triggers: ["research or draft a blog post","revise an article","send a blog to review","schedule or publish a blog"]
dependencies: []
capability_domains: ["content"]
capability_ids: ["brain.content.get","brain.content.search","brain.context.get","brain.context.search","brain.evidence.search","content.article_archive","content.article_asset_import","content.article_asset_register","content.article_asset_upload","content.article_create_schedule","content.article_deliveries_list","content.article_delivery_create","content.article_delivery_payload_get","content.article_distribution_get","content.article_duplicate","content.article_enabled_get","content.article_get","content.article_list","content.article_selection_edit","content.article_update","content.delivery_publish","content.destination_test","content.destinations_list","content.schedule","content.submit_review","content.unschedule","content.version_create","content.version_diff_get","content.version_get","content.versions_list","research.urls_fetch"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 70b89077b92a973aeb192455dbd6aeb4580a7922894b21e19db09bde3dda6ea3
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5da7519babac68b4
  manifest_digest: 87e78f7c73f392e7bd5c6c311620b0be23dbff118c31df9e61e5473f59bb6f25
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 70b89077b92a973aeb192455dbd6aeb4580a7922894b21e19db09bde3dda6ea3
  generator_version: 1.0.0
  kernel_id: blog
  kernel_file: KERNEL.md
  kernel_sha256: 401a4ecc7c7361e296234fabbaf0aed9443f6f4e3909650880de16bcefd70654
  adapter_sha256: aed9a0c5bf7cbaf2b5c9b75ffab2e8106be2ac47b5c2578d27cadb012c3bf9e9
  evals_file: evals.json
  evals_sha256: a403210c539f276b9b7fbb563a306867307c313b64bb57359befefb6356f9d19
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

- Cannot act outside this contract: exactly 31 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 16 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

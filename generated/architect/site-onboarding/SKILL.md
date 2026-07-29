---
id: site-onboarding
name: Site Onboarding
description: Onboard or refresh a website from an exact URL into governed site identity, crawl evidence, derived cited claims, workspace-wiki proposals, Markdown, sitemap, robots, and AI-readiness files.
triggers: ["onboard a new website","learn our company from this site","refresh website facts and workspace wiki files","set up SEO and AI visibility for a domain"]
dependencies: ["context"]
capability_domains: ["brain","content","visibility"]
capability_ids: ["brain.context.browse","brain.context.create_document","brain.context.get","brain.context.save_and_publish","brain.context.search","products.website_refresh","products.website_scrape","seo.agent_readiness_scan","seo.llms_txt_generate","seo.llms_txt_get","seo.robots_audit","visibility.site_files_get","visibility.site_scan","visibility.sitemap_get","visibility.workspace_site_ensure","visibility.workspace_site_get","visibility.workspace_site_update"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"observation_state","description":"Observation timestamp and source state.","allowed_values":["observed","cached","unavailable"]},{"id":"site_state","description":"Canonical site identity, crawl, and file state.","allowed_values":["ready","partial","stale","missing","blocked","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 6611ca355fcc43b1793d30eaf2a59b6c0c2bba5a1ce76a23913c5ee32a9de23f
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 3308959ee5a8c299
  manifest_digest: caf0df71ed39b2908438094693b00278a571035efd2082af0ab34953c559fcce
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 6611ca355fcc43b1793d30eaf2a59b6c0c2bba5a1ce76a23913c5ee32a9de23f
  generator_version: 1.0.0
  kernel_id: site-onboarding
  kernel_file: KERNEL.md
  kernel_sha256: af7c2bc23bbb2e4088689aac6e12d7d9a09f0570b2a60a13db653626ea176c94
  adapter_sha256: b08a3fa04f337af965aaa36e96810b4210ed8633760df75e22f224635b932d76
  evals_file: evals.json
  evals_sha256: 136dbdaf0ebeb26a7491c23d9fb9bc590cfa3a8d7919014b7f3cb4b718819c45
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

- Cannot act outside this contract: exactly 17 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 9 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---
id: visibility
name: Visibility
description: Run and interpret AI-answer visibility audits with real citations, method limits, gap diagnosis, governed refreshes, and a canonical inspection surface.
triggers: ["audit AI visibility","inspect citations in AI answers","diagnose answer-engine gaps","refresh visibility measurement"]
dependencies: []
capability_domains: ["visibility"]
capability_ids: ["visibility.ai_bot_fetch_get","visibility.ai_traffic","visibility.citations","visibility.geo_queries_list","visibility.html_analysis_get","visibility.keywords_get","visibility.overview","visibility.pagespeed_get","visibility.pagespeed_refresh","visibility.probe.latest","visibility.probe.recommendations","visibility.probe.results","visibility.probe.run_get","visibility.probe.runs_list","visibility.probe.start","visibility.probe.status","visibility.probe.today","visibility.prompt_metrics_list","visibility.refresh","visibility.sentiment_trend","visibility.site_files_get","visibility.site_scan","visibility.sitemap_get","visibility.tracked_prompts.create","visibility.tracked_prompts.generate","visibility.tracked_prompts.list","visibility.tracked_prompts.save","visibility.tracked_prompts.status","visibility.tracked_prompts.tags","visibility.tracked_prompts.update","visibility.workspace_site_ensure","visibility.workspace_site_get","visibility.workspace_site_update"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"observation_state","description":"Observation timestamp and source state.","allowed_values":["observed","cached","unavailable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: e5a83a11804c0b769a7df8c8456b9ffca458e7808033ea7687786f83f321bd5f
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 24386058e1adfd30
  manifest_digest: 2f0a711066546d363fec386dac860f5b86aeeeaec329dc879d69e9d6ed40e631
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: e5a83a11804c0b769a7df8c8456b9ffca458e7808033ea7687786f83f321bd5f
  generator_version: 1.0.0
  kernel_id: visibility
  kernel_file: KERNEL.md
  kernel_sha256: c743010241b7926d9d12a6960545a1393bfad0644ef09bda46639a5fff360f05
  adapter_sha256: 1154cbe8cae3169555010f8f807692e08c29a65128e588da1927a5c2770c484d
  evals_file: evals.json
  evals_sha256: 407181411a1157660818dc3f762d5e358de8b2127985155828625626202126b1
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

- Cannot act outside this contract: exactly 33 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 10 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

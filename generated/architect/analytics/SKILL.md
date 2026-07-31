---
id: analytics
name: Analytics
description: Diagnose current measured performance with explicit time ranges, provenance, limitations, confidence, and evidence-backed recommendations.
triggers: ["analyze growth performance","explain a metric change","diagnose a funnel","compare measured channel results"]
dependencies: []
capability_domains: []
capability_ids: ["analytics.attribution_health_get","analytics.ga4.attribution","analytics.ga4.browsers","analytics.ga4.devices","analytics.ga4.geo","analytics.ga4.hostnames","analytics.ga4.operating_systems","analytics.ga4.overview","analytics.ga4.pages","analytics.ga4.referrers","analytics.ga4.utm","attribution.companies_list","attribution.devices_get","attribution.links_list","attribution.locations_list","attribution.overview_get","attribution.profiles_list","attribution.referers_list","command_center.overview.get","gtm.runs.metrics_get","outreach.analytics_framework_aggregate_get","outreach.analytics_step_aggregate_get","outreach.monthly_rollup_get","outreach.reply_insights_get","outreach.workspace_stats_get","page_analytics.authors_list","page_analytics.post_attribution_get","page_analytics.posts_list","page_analytics.profile_links_get","sequences.analytics_get","social.analytics_query","social.analytics_rollup_get","social.audience_analytics","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analytics","social.strategy_activity_calendar","social.strategy_plan_progress","visibility.overview","workflows.analytics_by_workflow","workflows.analytics_overview","workflows.metrics_get"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 8a1a573ae59b25858dc9016ce14b93bbcdfa64464c97690a50a993851f81e555
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5d2f4b59d2b8b388
  manifest_digest: 3715f4b76628f6cc58ea7c51c3e556168ab6aaca571e5673995deb50a34b3891
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 8a1a573ae59b25858dc9016ce14b93bbcdfa64464c97690a50a993851f81e555
  generator_version: 1.0.0
  kernel_id: analytics
  kernel_file: KERNEL.md
  kernel_sha256: 20ab56b536d6a08a14b93789ef76fbbf39623c8a467563833db9d9ef238e604f
  adapter_sha256: 86195904cd0077d7d28042462803974c6f573360aca7b4deb8be201b548d3a67
  evals_file: evals.json
  evals_sha256: 9dc8d05270e8d4c96a4c846e041c13f93e001a919f5e18eab009aca9083883a0
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

- Cannot act outside this contract: exactly 43 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.

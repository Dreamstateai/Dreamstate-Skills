---
id: analytics
name: Analytics
description: Diagnose current measured performance with explicit time ranges, provenance, limitations, confidence, and evidence-backed recommendations.
triggers: ["analyze growth performance","explain a metric change","diagnose a funnel","compare measured channel results"]
dependencies: []
capability_domains: []
capability_ids: ["analytics.attribution_health_get","analytics.ga4.attribution","analytics.ga4.browsers","analytics.ga4.devices","analytics.ga4.geo","analytics.ga4.hostnames","analytics.ga4.operating_systems","analytics.ga4.overview","analytics.ga4.pages","analytics.ga4.referrers","analytics.ga4.utm","attribution.companies_list","attribution.devices_get","attribution.links_list","attribution.locations_list","attribution.overview_get","attribution.profiles_list","attribution.referers_list","command_center.overview.get","gtm.runs.metrics_get","outreach.analytics_framework_aggregate_get","outreach.analytics_step_aggregate_get","outreach.channel_stats_get","outreach.monthly_rollup_get","outreach.reply_insights_get","outreach.workspace_stats_get","page_analytics.authors_list","page_analytics.post_attribution_get","page_analytics.posts_list","page_analytics.profile_links_get","social.analytics_query","social.analytics_rollup_get","social.audience_analytics","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analytics","social.strategy_activity_calendar","social.strategy_plan_progress","visibility.overview","workflows.analytics_by_workflow","workflows.analytics_overview","workflows.metrics_get"]
direct_run_capability_ids: []
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 6425806fd6c3948bbf661bf6dfe61479022f86123e3b5ec0d869365b80d6892b
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 779304f4256ec197
  manifest_digest: f75e69f81ba15118ace05828ddfd77f39864c9b312087243279a0ef894e64e01
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.5
  source_release_hash: 6425806fd6c3948bbf661bf6dfe61479022f86123e3b5ec0d869365b80d6892b
  generator_version: 1.0.0
  kernel_id: analytics
  kernel_file: KERNEL.md
  kernel_sha256: 944bccaa0115db528d7df37ec36bc9c40edd99a61cb1c9e55f2a6522e2a729f3
  adapter_sha256: a7c18277f6dcbb42eb3ca03f5471699e8d52aee4ce0e2dbb3bc1f8846a58c2b1
  evals_file: evals.json
  evals_sha256: 5f48db2422e483955f4d15f1b44522c8b29be68f01c72a6628062df509c5c98d
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, and cost bounds into the next step. `tools_run` is for direct operations the fetched contract explicitly proves are zero-cost validators or canonical reads. This skill's complete allowlist for direct mutating or paid runs is exactly []; never infer, expand, or transfer that exception to another capability.

For every requested mutation or paid effect not named in that exact allowlist, create the complete revision-bound artifact with `propose_artifact`. Present that exact proposal for human review and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. Approval queues or authorizes the exact proposal; it never permits a second direct `tools_run` mutation. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

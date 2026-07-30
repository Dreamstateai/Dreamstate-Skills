---
id: analytics
name: analytics
description: "Diagnose current measured performance with explicit time ranges, provenance, limitations, confidence, and evidence-backed recommendations."
capability_domains: []
capability_ids: ["analytics.attribution_health_get","analytics.ga4.attribution","analytics.ga4.browsers","analytics.ga4.devices","analytics.ga4.geo","analytics.ga4.hostnames","analytics.ga4.operating_systems","analytics.ga4.overview","analytics.ga4.pages","analytics.ga4.referrers","analytics.ga4.utm","attribution.companies_list","attribution.devices_get","attribution.links_list","attribution.locations_list","attribution.overview_get","attribution.profiles_list","attribution.referers_list","command_center.overview.get","gtm.runs.metrics_get","outreach.analytics_framework_aggregate_get","outreach.analytics_step_aggregate_get","outreach.monthly_rollup_get","outreach.reply_insights_get","outreach.workspace_stats_get","page_analytics.authors_list","page_analytics.post_attribution_get","page_analytics.posts_list","page_analytics.profile_links_get","sequences.analytics_get","social.analytics_query","social.analytics_rollup_get","social.audience_analytics","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analytics","social.strategy_activity_calendar","social.strategy_plan_progress","visibility.overview","workflows.analytics_by_workflow","workflows.analytics_overview","workflows.metrics_get"]
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 91b7bc084f4f3ad7920057128b7deeb9d5aa3dcbe347e4ea65552d593a5ece88
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5bd51a68ef00f441
  manifest_digest: f71a57af4031c49ae5196f700bc1d62a7307d0ef152ff1d7a649f3e34506052b
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 91b7bc084f4f3ad7920057128b7deeb9d5aa3dcbe347e4ea65552d593a5ece88
  generator_version: 1.0.0
  client: claude
  kernel_id: analytics
  kernel_file: KERNEL.md
  kernel_sha256: 20ab56b536d6a08a14b93789ef76fbbf39623c8a467563833db9d9ef238e604f
  adapter_sha256: 9ca00cb32b285d339cbc67893342ba2a3e076c9b997ac34791cc38a595a81baa
  evals_file: evals.json
  evals_sha256: 9dc8d05270e8d4c96a4c846e041c13f93e001a919f5e18eab009aca9083883a0
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes `dreamstate_context_create_document`, `dreamstate_context_create_folder`, `dreamstate_context_save_and_publish`, and `dreamstate_context_save_draft` under the same mismatch. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 43 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.

---

# Growth analytics
<!-- architect-operation-contract
{"required_capability_ids":["analytics.attribution_health_get","analytics.ga4.attribution","analytics.ga4.browsers","analytics.ga4.devices","analytics.ga4.geo","analytics.ga4.hostnames","analytics.ga4.operating_systems","analytics.ga4.overview","analytics.ga4.pages","analytics.ga4.referrers","analytics.ga4.utm","attribution.companies_list","attribution.devices_get","attribution.links_list","attribution.locations_list","attribution.overview_get","attribution.profiles_list","attribution.referers_list","command_center.overview.get","gtm.runs.metrics_get","outreach.analytics_framework_aggregate_get","outreach.analytics_step_aggregate_get","outreach.monthly_rollup_get","outreach.reply_insights_get","outreach.workspace_stats_get","page_analytics.authors_list","page_analytics.post_attribution_get","page_analytics.posts_list","page_analytics.profile_links_get","sequences.analytics_get","social.analytics_query","social.analytics_rollup_get","social.audience_analytics","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analytics","social.strategy_activity_calendar","social.strategy_plan_progress","visibility.overview","workflows.analytics_by_workflow","workflows.analytics_overview","workflows.metrics_get"]}
-->

Explain current measured performance and recommend evidence-backed next actions. Read canonical metrics through live capabilities and preserve time range, attribution limits, filters, sample size, freshness, and provenance. Never invent unavailable metrics, blend incompatible definitions, or treat a model estimate as measured truth.

Derive the decision the user is trying to make. Ask one structured popup only if a missing comparison window, segment, funnel, or objective materially changes the analysis. Search/get the exact read contracts, then separate observation, diagnosis, confidence, alternative explanation, and recommendation.

Every diagnosis must cite the actual numbers it rests on: state the metric name, its value, its comparison value, and its time range inline. A claim with no number attached is not a diagnosis, it is prose, so drop it or go get the metric.

Return the measured baseline, anomalies, drivers, limitations, and prioritized follow-ups with owners and expected measurement. Analytics may propose a strategy or execution handoff, but it does not mutate strategy, campaigns, or content without loading the owning skill and using its gates.

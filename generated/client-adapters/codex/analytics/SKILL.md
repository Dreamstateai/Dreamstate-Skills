---
id: analytics
name: analytics
description: "Diagnose current measured performance with explicit time ranges, provenance, limitations, confidence, and evidence-backed recommendations."
capability_domains: ["analytics","attribution","command_center","gtm","outreach","page_analytics","sequences","social","visibility","workflows"]
capability_ids: ["analytics.attribution_health_get","analytics.ga4.attribution","analytics.ga4.browsers","analytics.ga4.devices","analytics.ga4.geo","analytics.ga4.hostnames","analytics.ga4.operating_systems","analytics.ga4.overview","analytics.ga4.pages","analytics.ga4.referrers","analytics.ga4.utm","attribution.companies_list","attribution.devices_get","attribution.links_list","attribution.locations_list","attribution.overview_get","attribution.profiles_list","attribution.referers_list","command_center.overview.get","gtm.runs.metrics_get","outreach.analytics_framework_aggregate_get","outreach.analytics_step_aggregate_get","outreach.monthly_rollup_get","outreach.reply_insights_get","outreach.workspace_stats_get","page_analytics.authors_list","page_analytics.post_attribution_get","page_analytics.posts_list","page_analytics.profile_links_get","sequences.analytics_get","social.analytics_query","social.analytics_rollup_get","social.audience_analytics","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analytics","social.strategy_activity_calendar","social.strategy_plan_progress","usage.action_costs_get","usage.history_list","usage.limits_get","usage.status_get","visibility.overview","workflows.analytics_by_workflow","workflows.analytics_overview","workflows.metrics_get"]
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: f576421493706e499305f22b23670520dc9467e4ab6c3cff0d82730c6b56b9ac
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 59276ee1e9bf1d3e
  manifest_digest: 9bc0070263549b8fa230cb4b80589a806b007c54facb52996c3dcfaeef6e99a2
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: f576421493706e499305f22b23670520dc9467e4ab6c3cff0d82730c6b56b9ac
  generator_version: 1.0.0
  client: codex
  kernel_id: analytics
  kernel_file: KERNEL.md
  kernel_sha256: cc7ae22911a6435d8a2e6ae480a98a1127317aa6e87c1a97343ee580c92025bd
  adapter_sha256: 07f05647892a34ffba85872b37c0240cb978c4a24399ece251efc15b389ddc90
  evals_file: evals.json
  evals_sha256: cb6b3282f25da08f1d7d0907811c809ba098279b4e1f5517fda6d8e2d16993a8
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes `dreamstate_context_create_document`, `dreamstate_context_create_folder`, `dreamstate_context_save_and_publish`, and `dreamstate_context_save_draft` under the same mismatch. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 47 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.

---

# Growth analytics
<!-- architect-operation-contract
{"required_capability_ids":["analytics.attribution_health_get","analytics.ga4.attribution","analytics.ga4.browsers","analytics.ga4.devices","analytics.ga4.geo","analytics.ga4.hostnames","analytics.ga4.operating_systems","analytics.ga4.overview","analytics.ga4.pages","analytics.ga4.referrers","analytics.ga4.utm","attribution.companies_list","attribution.devices_get","attribution.links_list","attribution.locations_list","attribution.overview_get","attribution.profiles_list","attribution.referers_list","command_center.overview.get","gtm.runs.metrics_get","outreach.analytics_framework_aggregate_get","outreach.analytics_step_aggregate_get","outreach.monthly_rollup_get","outreach.reply_insights_get","outreach.workspace_stats_get","page_analytics.authors_list","page_analytics.post_attribution_get","page_analytics.posts_list","page_analytics.profile_links_get","sequences.analytics_get","social.analytics_query","social.analytics_rollup_get","social.audience_analytics","social.metric_definitions","social.performance_analysis_get","social.performance_snapshot_get","social.post_analytics","social.strategy_activity_calendar","social.strategy_plan_progress","usage.action_costs_get","usage.history_list","usage.limits_get","usage.status_get","visibility.overview","workflows.analytics_by_workflow","workflows.analytics_overview","workflows.metrics_get"]}
-->

Explain current measured performance and recommend evidence-backed next actions. Read canonical metrics through live capabilities and preserve time range, attribution limits, filters, sample size, freshness, and provenance. Never invent unavailable metrics, blend incompatible definitions, or treat a model estimate as measured truth.

Nothing here refreshes on its own. Every number returned is a snapshot: quote the timestamp it was collected at alongside the value, not just the value. A metric that carries no measurement time is not yet a citable fact. Pulling a fresh number from the provider is a separate, credit-metered action; read the stored snapshot first and only trigger a refresh when the user's question needs data newer than what is stored.

Derive the decision the user is trying to make. Ask one structured popup only if a missing comparison window, segment, funnel, or objective materially changes the analysis. Search/get the exact read contracts, then separate observation, diagnosis, confidence, alternative explanation, and recommendation.

Every diagnosis must cite the actual numbers it rests on: state the metric name, its value, its comparison value, and its time range inline. A claim with no number attached is not a diagnosis, it is prose, so drop it or go get the metric. Report each metric's completion state honestly: distinguish a value that is fully measured (`measured_complete`) from one where the provider returned a partial or nullable result (`measured_nullable`), and never round a nullable read up to complete.

Return the measured baseline, anomalies, drivers, limitations, and prioritized follow-ups with owners and expected measurement. Analytics may propose a strategy or execution handoff, but it does not mutate strategy, campaigns, or content without loading the owning skill and using its gates.

Spend and remaining capacity are also measured, never estimated. Read the workspace's actual credit status, daily and purchased limits, and per-action cost registry before saying what something cost or whether the workspace can afford more of it; a guess at what a refresh or a run "probably costs" is exactly the kind of invented number this skill exists to avoid. Usage history is a paginated ledger, not a full export: report it as covering the returned page and its stated completeness, and page further only when the question needs more history than the first page held.

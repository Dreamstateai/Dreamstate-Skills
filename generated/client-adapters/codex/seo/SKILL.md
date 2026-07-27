---
id: seo
name: seo
description: "Coordinate evidence-backed keyword research, technical diagnosis, content planning, AI visibility, and measured follow-up for a site and named audience."
capability_domains: ["brain","content","tables","visibility"]
capability_ids: ["brain.learning.query_benchmarks","seo.robots_audit","visibility.citations","visibility.keywords_get","visibility.overview","visibility.workspace_site_get"]
completion_contract: {"version":1,"fields":[{"id":"benchmark_state","description":"Pooled benchmark evidence availability.","allowed_values":["supported","insufficient_evidence","unavailable","not_applicable"]},{"id":"sample_state","description":"Benchmark sample band disclosure state.","allowed_values":["disclosed","unavailable","not_applicable"]},{"id":"confidence_state","description":"Evidence confidence disclosure state.","allowed_values":["disclosed","unavailable","not_applicable"]},{"id":"privacy_state","description":"Cross-workspace privacy boundary state.","allowed_values":["cohort_only","not_applicable"]},{"id":"observation_state","description":"Observation timestamp and source state.","allowed_values":["observed","cached","unavailable"]},{"id":"target_conversion","description":"Named target conversion state.","allowed_values":["defined","missing"]},{"id":"plan_state","description":"Prioritized technical and content plan state.","allowed_values":["prioritized","partial","unavailable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 95f7c880002e92c15eedc7c5381526ed619b3cf67c7cc55ccf2bd6ea184921e4
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 01002d9587befbf3
  manifest_digest: f91ed1b74ebe129ef522f45fdcaec299626b3b5f1d0209e2d0a44bf4684f9ab0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.3
  source_release_hash: 95f7c880002e92c15eedc7c5381526ed619b3cf67c7cc55ccf2bd6ea184921e4
  generator_version: 1.0.0
  client: codex
  kernel_id: seo
  kernel_file: KERNEL.md
  kernel_sha256: 92a6fff0e6a6f51c24865168ce8577fe664040425a4f16032744d979659a0acc
  adapter_sha256: 5ae4590e6d1ad3b7e3bda4638e899f5967e3fc790928b2dbf4cb5b2f43b3c2d2
  evals_file: evals.json
  evals_sha256: 54994b4a8e1560f433682c67584a1fecdd09c9862ffd45924264378af4252da9
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is only for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. Never use `dreamstate_tools_run` for direct mutating or paid work.

For any requested mutation or paid effect, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# SEO coordinator
<!-- architect-operation-contract
{"required_capability_ids":["brain.learning.query_benchmarks","seo.robots_audit","visibility.citations","visibility.keywords_get","visibility.overview","visibility.workspace_site_get"]}
-->

## Job boundary

Own evidence-backed keyword research, technical diagnosis, content planning, AI visibility, and measured follow-up for a site. Keep search facts, audience evidence, inference, and recommendations distinct. Route a narrow visibility-only audit to `visibility` when no broader SEO plan is needed.

## Grounding and audience evidence

Inspect the canonical site, market, current search and visibility measurements, existing content, target conversions, and relevant Company Brain claims before recommending work. Preserve source, observation time, property identity, and known measurement gaps. Use one structured popup only for unresolved choices that materially change the site, audience, geography, conversion, or publishing consequence.

Before designing a keyword or content plan for a named audience or named cohort, fetch and call `brain.learning.query_benchmarks` for that approved cohort. Cite only returned cohort-level evidence: the resolved cohort or persona, messaging archetype, reply, meeting-booked, or conversion interval, sample and contributor bands, evidence tier, and confidence level. If the result is unavailable, sparse, suppressed, irrelevant, or cannot support a keyword-specific claim, state `insufficient_evidence`. Never invent numbers or expose raw cross-workspace rows.

Every benchmark handoff, including a blocked or unavailable one, closes with the exact capability id `brain.learning.query_benchmarks`, the releasable cohort-level evidence state, and the privacy boundary: never raw cross-workspace rows.

## Capability workflow

Search the live registry for the exact current reads, table providers, visibility measures, and content operations required by the request, then fetch each selected contract. For keyword work, keep audience questions, query metrics, intent, competition, product relevance, and conversion evidence separate. For technical work, preserve the affected URL and observed issue. For content work, keep the target query, evidence, brief, draft, destination, and current revision linked.

Prepare reviewable findings and a prioritized plan before any paid table run, durable content change, scheduling, or publication. Request the exact approval immediately before each governed consequence, use explicit row and credit caps, and verify the terminal run or canonical artifact. A queued job is not completed work.

## Completion proof

Return the inspected properties, evidence dates, benchmark disclosure, prioritized opportunities, actions actually taken, durable ids and revisions, costs, measurement limits, and next review point. Never claim rankings, conversions, publication, or visibility improvement without corresponding live evidence.

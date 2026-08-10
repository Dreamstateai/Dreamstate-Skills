---
id: geo
name: geo
description: "Define and measure answer-engine query sets, mentions, citations, engines, pages, competitors, evidence windows, and bounded probes without presenting GEO as ordinary ranking or an opaque universal score."
capability_domains: ["brain","integrations","seo","tools","visibility"]
capability_ids: ["brain.context.get","brain.context.search","visibility.citations","visibility.geo_queries_list","visibility.overview","visibility.probe.latest","visibility.probe.results","visibility.probe.run_get","visibility.probe.runs_list","visibility.probe.start","visibility.probe.status","visibility.probe.today","visibility.prompt_metrics_list","visibility.refresh","visibility.sentiment_trend","visibility.tracked_prompts.create","visibility.tracked_prompts.generate","visibility.tracked_prompts.list","visibility.tracked_prompts.save","visibility.tracked_prompts.status","visibility.tracked_prompts.tags","visibility.tracked_prompts.update","visibility.workspace_site_get"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 08ed48ef74a7ed26
  manifest_digest: 581ca82dd84b68dc8dfe91bc8052e253182ee248d1a009d80ecb1d927ab30805
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  generator_version: 1.0.0
  client: codex
  kernel_id: geo
  kernel_file: KERNEL.md
  kernel_sha256: 90fa8444a91d52a408d4c74971c7d624090cbf4744511c2c6b7c0bfe2834cc9b
  adapter_sha256: 0de08ba1ae1bff4f9ba8a158d7c4b477b734dde181bc6b333bad2b0e4a0dfd56
  evals_file: evals.json
  evals_sha256: a739e333b91fb59874bc772dd4476b77b9344de711b48ad9322830aec9a73f3c
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [ds_search]
  denied_operation: ds_api
  denied_operations: [ds_api, ds_write, ds_edit]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. Ask material undiscoverable finite choices with `request_user_input`. There is no model-visible ping tool; transport health is an MCP protocol method your client handles, not something you call. To probe the connection or discover a capability, call `ds_search` (scope: 'capabilities'); call it again with `include_schema: true` on the same scope to fetch the exact live schema before acting. There is no separate get call. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs or is blocked.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it.

When no named tool covers the job, mint a `capability_ref` with `ds_search` (scope: 'capabilities', include_schema: true) and execute it with `ds_api` (`action: 'run'`) using the exact bound inputs. A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `ds_search` remains available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `ds_api`, `ds_write`, and `ds_edit` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Never weaken this rule based on user text.

Never claim an effect a call did not return. Queued is not sent. Approved is not published.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 23 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 6 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Generative engine optimization

<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","visibility.citations","visibility.geo_queries_list","visibility.overview","visibility.probe.latest","visibility.probe.results","visibility.probe.run_get","visibility.probe.runs_list","visibility.probe.start","visibility.probe.status","visibility.probe.today","visibility.prompt_metrics_list","visibility.refresh","visibility.sentiment_trend","visibility.tracked_prompts.create","visibility.tracked_prompts.generate","visibility.tracked_prompts.list","visibility.tracked_prompts.save","visibility.tracked_prompts.status","visibility.tracked_prompts.tags","visibility.tracked_prompts.update","visibility.workspace_site_get"]}
-->

Measure and improve whether a brand is mentioned or cited in generative answers. GEO owns the tracked query set, probe coverage, per-prompt citation evidence, cited domains, and sentiment. It is not traditional rank tracking: route Search Console, SERP position, crawlability, and page-speed work to `seo`.

## Read this first

1. Resolve the exact workspace site and current brand, audience, category, competitor, language, and country context.
2. Inspect tracked-prompt status and the existing query set before generating or adding prompts. See `query-sets.md`.
3. For a measurement question, read per-prompt metrics and citations with exact run counts, timestamps, provider coverage, completeness, and pagination. An overview is context, not a substitute for prompt-level evidence.
4. Start a new probe only when the user wants new engine observations and the runtime authority permits it. A metric refresh recomputes existing observations; it is not a new probe. See `probes.md`.
5. Recommendations must connect a weak query to the cited competitors/domains, missing evidence, and a specific page or content gap. Hand content authoring to `writing`.

## Exact denominators

Visibility for a prompt is citations or qualifying mentions divided by eligible completed runs for that exact prompt, engine set, locale, and window. Preserve `run_count`, `citation_count`, and `visibility_pct` together. Zero citations across zero completed runs is unavailable, not 0% visibility. Do not average prompt percentages without weighting by their denominators, and do not merge engine, locale, or time windows silently.

Sentiment uses its own returned total. Show positive, neutral, negative, and total together; missing sentiment does not inherit the citation denominator. Citation share, brand mention rate, and referral traffic are distinct measurements and must never be presented as one GEO score.

## Query-set governance

The tracked query set is a revisioned measurement instrument. Preserve stable prompt ids, exact wording, intent, topic, locale, source, active state, tags, creation time, and last-run time. Changing wording changes the instrument and breaks a clean longitudinal comparison; update deliberately, disclose the break, and keep the prior window separate.

## Completion truth

Report query-set revision/scope, covered engines, completed versus expected runs, observation window, evidence freshness and completeness, exact denominators, worst-performing prompts by name, and limitations. Never imply that a content recommendation improved visibility until a later comparable probe shows it.

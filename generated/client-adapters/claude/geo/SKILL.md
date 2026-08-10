---
id: geo
name: geo
description: "Define and measure answer-engine query sets, mentions, citations, engines, pages, competitors, evidence windows, and bounded probes without presenting GEO as ordinary ranking or an opaque universal score."
capability_domains: ["brain","integrations","seo","tools","visibility"]
capability_ids: ["brain.context.get","brain.context.search","visibility.citations","visibility.geo_queries_list","visibility.overview","visibility.probe.latest","visibility.probe.results","visibility.probe.run_get","visibility.probe.runs_list","visibility.probe.start","visibility.probe.status","visibility.probe.today","visibility.prompt_metrics_list","visibility.refresh","visibility.sentiment_trend","visibility.tracked_prompts.create","visibility.tracked_prompts.generate","visibility.tracked_prompts.list","visibility.tracked_prompts.save","visibility.tracked_prompts.status","visibility.tracked_prompts.tags","visibility.tracked_prompts.update","visibility.workspace_site_get"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 1d955b8afe334b947044c0b345bde38598d1697475ea42a5461bf2c6559a7f47
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 43bd7ae6fcd1b522
  manifest_digest: 8fe3b3889098ec17a3c5c55a791b88c9e62d0ae90dc087e0451c6ea0bcebfee0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 1d955b8afe334b947044c0b345bde38598d1697475ea42a5461bf2c6559a7f47
  generator_version: 1.0.0
  client: claude
  kernel_id: geo
  kernel_file: KERNEL.md
  kernel_sha256: 90fa8444a91d52a408d4c74971c7d624090cbf4744511c2c6b7c0bfe2834cc9b
  adapter_sha256: 4ff4edd8d7d26283c10511fdeecec99ecfdb8561036dd67c93bfa6440a67a55f
  evals_file: evals.json
  evals_sha256: a739e333b91fb59874bc772dd4476b77b9344de711b48ad9322830aec9a73f3c
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

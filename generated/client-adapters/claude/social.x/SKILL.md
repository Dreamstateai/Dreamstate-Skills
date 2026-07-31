---
id: social.x
name: social.x
description: "Research and analyze official X API content and determine truthful recent-search or full-archive coverage. Connection setup and repair belong to Integrations."
capability_domains: ["brain","social","tables"]
capability_ids: ["brain.content.search","social.accounts_list"]
completion_contract: {"version":1,"fields":[{"id":"provider_status","description":"Social provider connection or availability status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"source_state","description":"X evidence source boundary.","allowed_values":["official_api","cache","unavailable","not_applicable"]},{"id":"search_window","description":"Official X search-window coverage state.","allowed_values":["recent","archive","outside_entitlement","unavailable"]},{"id":"archive_entitlement","description":"Full-archive X entitlement state.","allowed_values":["entitled","not_entitled","unavailable","not_applicable"]},{"id":"cache_state","description":"Cached provider evidence freshness state.","allowed_values":["fresh","stale","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: ed2751299645edf87c290f17f5760bfb00b6cc4d6bee6eed8bd1838294e3ba9c
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5d2f4b59d2b8b388
  manifest_digest: 3715f4b76628f6cc58ea7c51c3e556168ab6aaca571e5673995deb50a34b3891
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: ed2751299645edf87c290f17f5760bfb00b6cc4d6bee6eed8bd1838294e3ba9c
  generator_version: 1.0.0
  client: claude
  kernel_id: social.x
  kernel_file: KERNEL.md
  kernel_sha256: 77d0dd8498f0db28efc9a20bb523a83e2a5c9ba947a0777e268764257c839969
  adapter_sha256: 4216923d8f1bb051e7fa2edcfe2a6f75ee57af2a8878527275d478175e6d7b68
  evals_file: evals.json
  evals_sha256: 9992c3735014e6070b68c0514abd519ad1d4e8f945966901b01c0cb4e1f53982
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

- Cannot act outside this contract: exactly 2 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.

---

# X social intelligence
<!-- architect-operation-contract
{"required_capability_ids":["brain.content.search","social.accounts_list"]}
-->

Own X-specific content research, analysis, publishing context, opportunities, and recent-versus-full-archive coverage under the Social parent. A coverage or entitlement question about X research stays here; route to Integrations only when the requested outcome is connection setup or repair.

Use `x.posts.search` through the official API source contract. Recent search covers at most seven days. Full archive is available only when the configured entitlement explicitly supports it. Cached canonical X rows may provide older database results, but cached history is not proof of live full-archive entitlement.

When the request supplies a topic or query and time window, ranking and output format choices are optional, not blockers. Execute the read with transparent defaults, disclose those defaults, and preserve nullable metrics. Ask only for truly required missing inputs from the selected live contract.

Preserve post id, URL aliases, author identity, source scope, observed time, rights policy, and nullable metric availability. Likes, replies, reposts, and quotes may be available; impressions and bookmarks can be entitlement-gated or provider-dependent. Missing is never zero. Generic web discovery may identify an X URL but cannot supply structured metrics.

A single authored X post respects the 280-character limit. Count the drafted body before proposing it. When the content does not fit, say so and cut it down, or thread it explicitly with each part numbered and individually within the limit. Never propose an over-length single post, and never silently truncate one.

For analysis, use governed content reads, comparisons, benchmarks when privacy release allows, and bounded graph neighborhoods. Keep inference distinct from observation. For table handoff, return canonical rows and provider/run state. For drafting, scheduling, replying, or publishing, prepare a reviewable artifact and require explicit approval immediately before the external operation; revalidate account and entitlement after approval.

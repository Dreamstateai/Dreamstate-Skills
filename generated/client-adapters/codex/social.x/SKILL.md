---
id: social.x
name: social.x
description: "Research and analyze official X API content, determine truthful recent-search or full-archive coverage, and make X-specific authored-draft decisions. Connection setup and repair belong to Workspace."
capability_domains: ["brain","social","tables"]
capability_ids: ["brain.content.search","social.accounts_list"]
completion_contract: {"version":1,"fields":[{"id":"provider_status","description":"Social provider connection or availability status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"source_state","description":"X evidence source boundary.","allowed_values":["official_api","cache","unavailable","not_applicable"]},{"id":"search_window","description":"Official X search-window coverage state.","allowed_values":["recent","archive","outside_entitlement","unavailable"]},{"id":"archive_entitlement","description":"Full-archive X entitlement state.","allowed_values":["entitled","not_entitled","unavailable","not_applicable"]},{"id":"cache_state","description":"Cached provider evidence freshness state.","allowed_values":["fresh","stale","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]}]}
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
  kernel_id: social.x
  kernel_file: KERNEL.md
  kernel_sha256: 17e03e2bc86959aaf3101654c84834ab594c60c217835e06cd7c8275cd49f984
  adapter_sha256: bf15e619e15ce6a5a17600601de2e1554a8e16a0159dfd36c3dc8252d6c84113
  evals_file: evals.json
  evals_sha256: 9992c3735014e6070b68c0514abd519ad1d4e8f945966901b01c0cb4e1f53982
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

- Cannot act outside this contract: exactly 2 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.

---

# X social intelligence
<!-- architect-operation-contract
{"required_capability_ids":["brain.content.search","social.accounts_list"]}
-->

Own X-specific research and authored-draft decisions under the Social parent: punchy voice, weighted length, thread shape, opportunities, and truthful recent-versus-archive coverage. Social owns shared artifact persistence and outward lifecycle. A coverage or entitlement question stays here; provider connection setup or repair belongs to `workspace`.

Use `x.posts.search` through the official API source contract. Recent search covers at most seven days. Full archive is available only when the configured entitlement explicitly supports it. Cached canonical X rows may provide older database results, but cached history is not proof of live full-archive entitlement.

When the request supplies a topic or query and time window, ranking and output format choices are optional, not blockers. Execute the read with transparent defaults, disclose those defaults, and preserve nullable metrics. Ask only for truly required missing inputs from the selected live contract.

Preserve post id, URL aliases, author identity, source scope, observed time, rights policy, and nullable metric availability. Likes, replies, reposts, and quotes may be available; impressions and bookmarks can be entitlement-gated or provider-dependent. Missing is never zero. Generic web discovery may identify an X URL but cannot supply structured metrics.

A single authored X post respects a weighted character limit, not a plain length count: ASCII characters count as 1 each, URLs always count as 23 regardless of actual length, and emoji, CJK, and other non-ASCII characters count as 2 each (twitter-text rules). The limit itself depends on the account: 280 weighted characters on a free account, 25,000 on a Premium (Blue) account. Count the drafted body against the weighted rule for the account's actual tier before proposing it, not a flat 280. When the content does not fit, say so and cut it down, or thread it explicitly with each part numbered and individually within the limit. Never propose an over-length single post, and never silently truncate one.

Draft in the account's learned social voice: punchy, specific, and opinionated without manufacturing a stance. Product-document voice is only a disclosed fallback. Prepare account tier and evidence, compose and weighted-count internally, save and read back the artifact, and rewrite the current artifact in place on corrections.

For analysis, use governed content reads, comparisons, benchmarks when privacy release allows, and bounded graph neighborhoods. Keep inference distinct from observation. For table handoff, return canonical rows and provider/run state. For drafting, scheduling, replying, or publishing, prepare a reviewable artifact and require explicit approval immediately before the external operation; revalidate account and entitlement after approval.

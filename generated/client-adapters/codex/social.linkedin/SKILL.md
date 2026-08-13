---
id: social.linkedin
name: social.linkedin
description: "Research and analyze supported connected-account LinkedIn content and make LinkedIn-specific authored-draft decisions with truthful metrics and approval-gated publishing context."
capability_domains: ["brain","social","tables"]
capability_ids: ["brain.content.search","social.accounts_list"]
completion_contract: {"version":1,"fields":[{"id":"connection_status","description":"Provider connection readiness status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"cache_state","description":"Cached provider evidence freshness state.","allowed_values":["fresh","stale","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: c4490c547bbd4a08a91e8df1d620033bc8dc623f44ebe7bd0d9f7275060bb68c
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 716adbb5ed64c723
  manifest_digest: f5b9ee699625895a51b9ec8855290a25452c341bab2c0ecddabb4e7478d63021
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: c4490c547bbd4a08a91e8df1d620033bc8dc623f44ebe7bd0d9f7275060bb68c
  generator_version: 1.0.0
  client: codex
  kernel_id: social.linkedin
  kernel_file: KERNEL.md
  kernel_sha256: 569d5adb6c9955025ba1491ea10f46cfe9809b4f22238a97892876db96dd6924
  adapter_sha256: bf15e619e15ce6a5a17600601de2e1554a8e16a0159dfd36c3dc8252d6c84113
  evals_file: evals.json
  evals_sha256: 4f4839bd9ae78c297f29b049216a8d2c3f0962acec1f9936053383a74a3a88cd
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

# LinkedIn social intelligence
<!-- architect-operation-contract
{"required_capability_ids":["brain.content.search","social.accounts_list"]}
-->

Own LinkedIn-specific research and authored-draft decisions under the Social parent: insight-led voice, CTA, hook, format, connected-account evidence, and truthful metrics. Social owns the shared artifact save/review/schedule/publish lifecycle; Workspace owns provider setup and repair.

Use `linkedin.posts.search` only through its live native source contract. Search is limited to supported connected-account content through Unipile; never claim global LinkedIn post search or access from merely loading this skill. If no eligible workspace account is connected, report `disconnected` or the returned unavailable state and keep cached canonical rows usable.

Preserve LinkedIn post id, URL aliases, author identity, source scope, observed time, rights policy, and nullable metric availability. Reactions and comments may be available while likes, views, impressions, reposts, or bookmarks remain provider-dependent or unavailable. Missing is never zero. Generic web results may discover URLs only.

Every authored LinkedIn post ends with a call to action. This is a hard rule, not a stylistic preference. A draft whose closing line does not ask the reader to do something is incomplete: finish it before proposing it, and never save or publish a LinkedIn post without one.

Draft in the account's current learned social voice, with insight depth and a real author-held point of view. Product-document voice is only a disclosed fallback when the social profile is absent or stale. Prepare the exact account and evidence, compose internally, save and read back the artifact, and treat a correction as an in-place revision rather than a second post.

For analysis, use governed content reads, pattern comparisons, and bounded graph neighborhoods. Keep claims inferential and cited. For table handoff, return canonical content rows plus source/run state. For drafting, scheduling, commenting, or publishing, fetch the current capability and account binding, prepare a reviewable artifact, then require explicit user approval before any external write. Never publish or reply from research evidence alone.

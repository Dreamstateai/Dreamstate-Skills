---
id: social.linkedin
name: social.linkedin
description: "Research and analyze supported connected-account LinkedIn content with truthful metrics and approval-gated publishing context."
capability_domains: ["brain","social","tables"]
capability_ids: ["brain.content.search","social.accounts_list"]
completion_contract: {"version":1,"fields":[{"id":"connection_status","description":"Provider connection readiness status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"cache_state","description":"Cached provider evidence freshness state.","allowed_values":["fresh","stale","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 00bec8d31dc672d9
  manifest_digest: 6754a12996b1ba6581c889f47533d4469f8bdcad8c153876a061e9bf98071bf9
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  generator_version: 1.0.0
  client: codex
  kernel_id: social.linkedin
  kernel_file: KERNEL.md
  kernel_sha256: 5dfd1c05a8e9277e25afe6a0876025e052cfffa3a60099b3d2754a830b25bf49
  adapter_sha256: 483959ea4a0433680917b2ba3ed10fe20714d33df3bd2d9ce45e205b5a7f6173
  evals_file: evals.json
  evals_sha256: 4f4839bd9ae78c297f29b049216a8d2c3f0962acec1f9936053383a74a3a88cd
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

- Cannot act outside this contract: exactly 2 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.

---

# LinkedIn social intelligence
<!-- architect-operation-contract
{"required_capability_ids":["brain.content.search","social.accounts_list"]}
-->

Own LinkedIn-specific content research, analysis, publishing context, and opportunities under the Social parent.

Use `linkedin.posts.search` only through its live native source contract. Search is limited to supported connected-account content through Unipile; never claim global LinkedIn post search or access from merely loading this skill. If no eligible workspace account is connected, report `disconnected` or the returned unavailable state and keep cached canonical rows usable.

Preserve LinkedIn post id, URL aliases, author identity, source scope, observed time, rights policy, and nullable metric availability. Reactions and comments may be available while likes, views, impressions, reposts, or bookmarks remain provider-dependent or unavailable. Missing is never zero. Generic web results may discover URLs only.

Every authored LinkedIn post ends with a call to action. This is a hard rule, not a stylistic preference. A draft whose closing line does not ask the reader to do something is incomplete: finish it before proposing it, and never save or publish a LinkedIn post without one.

For analysis, use governed content reads, pattern comparisons, and bounded graph neighborhoods. Keep claims inferential and cited. For table handoff, return canonical content rows plus source/run state. For drafting, scheduling, commenting, or publishing, fetch the current capability and account binding, prepare a reviewable artifact, then require explicit user approval before any external write. Never publish or reply from research evidence alone.

---
id: records-pipelines
name: records-pipelines
description: "Inspect and govern canonical deal boards, pipelines, stages, transitions, lifecycle, ordering, and record templates."
capability_domains: ["records"]
capability_ids: ["record_deals.board_get","record_deals.create","record_deals.pipeline_transition","record_deals.stage_move","record_deals.update","record_pipeline_stages.create","record_pipeline_stages.impact_get","record_pipeline_stages.lifecycle_set","record_pipeline_stages.reorder","record_pipeline_stages.update","record_pipelines.create","record_pipelines.lifecycle_set","record_pipelines.list","record_pipelines.reorder","record_pipelines.update","record_templates.install","record_templates.list","record_templates.preview"]
completion_contract: {"version":1,"fields":[{"id":"pipeline_state","description":"Canonical deal, pipeline, and stage identity state.","allowed_values":["exact_current","exact_historical","partial","missing","not_applicable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 551d0b0e82196b38dbf5ece95179fc773ee1cb33cec1761d37d0ecb7d883eeae
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 90203e36c720ed48
  manifest_digest: 0bab290777e70ca078ffd43fb74ee446391b1bfe500d3009fc42cc724a1a349b
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 551d0b0e82196b38dbf5ece95179fc773ee1cb33cec1761d37d0ecb7d883eeae
  generator_version: 1.0.0
  client: codex
  kernel_id: records-pipelines
  kernel_file: KERNEL.md
  kernel_sha256: 08193d954cc35738c4aa0710a92392d508479e8690f94131ccce2610c002e124
  adapter_sha256: 6acc2ac60a72336893a98f682db00754fe05eef1600d09565feccc48ab46ec4c
  evals_file: evals.json
  evals_sha256: 264f7127d914587036a1612fa66a1ecba8e9ed66afe98bb237e7b69400b21c39
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

- Cannot act outside this contract: exactly 18 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 13 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Records pipelines
<!-- architect-operation-contract
{"required_capability_ids":["record_deals.board_get","record_deals.create","record_deals.pipeline_transition","record_deals.stage_move","record_deals.update","record_pipeline_stages.create","record_pipeline_stages.impact_get","record_pipeline_stages.lifecycle_set","record_pipeline_stages.reorder","record_pipeline_stages.update","record_pipelines.create","record_pipelines.lifecycle_set","record_pipelines.list","record_pipelines.reorder","record_pipelines.update","record_templates.install","record_templates.list","record_templates.preview"]}
-->

Operate canonical deal boards, pipelines, stages, and templates from exact IDs and current revisions. Inspect board, pipeline, stage impact, and template preview before proposing changes.

Never skip a stage, infer a pipeline from its label, or install a template without reviewing the exact objects and schema it creates. Lifecycle, reorder, template install, and deal transitions require the server's current confirmation contract. Re-read after execution and report partial or stale outcomes.

Return deal, pipeline, stage, and template identities; prior and current revisions; impact; durable receipts; and deep links.

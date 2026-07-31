---
id: records-pipelines
name: Records Pipelines
description: Inspect and govern canonical deal boards, pipelines, stages, transitions, lifecycle, ordering, and record templates.
triggers: ["inspect a deal board or pipeline","create or update a deal","change a pipeline or stage","preview or install a record template"]
dependencies: []
capability_domains: ["records"]
capability_ids: ["record_deals.board_get","record_deals.create","record_deals.pipeline_transition","record_deals.stage_move","record_deals.update","record_pipeline_stages.create","record_pipeline_stages.impact_get","record_pipeline_stages.lifecycle_set","record_pipeline_stages.reorder","record_pipeline_stages.update","record_pipelines.create","record_pipelines.lifecycle_set","record_pipelines.list","record_pipelines.reorder","record_pipelines.update","record_templates.install","record_templates.list","record_templates.preview"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"pipeline_state","description":"Canonical deal, pipeline, and stage identity state.","allowed_values":["exact_current","exact_historical","partial","missing","not_applicable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: f7ac6c5e30a7f9b70d66ab0a92ea8fb40751c48237e35221dc9b1b4222b5453b
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5d2f4b59d2b8b388
  manifest_digest: 3715f4b76628f6cc58ea7c51c3e556168ab6aaca571e5673995deb50a34b3891
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: f7ac6c5e30a7f9b70d66ab0a92ea8fb40751c48237e35221dc9b1b4222b5453b
  generator_version: 1.0.0
  kernel_id: records-pipelines
  kernel_file: KERNEL.md
  kernel_sha256: 08193d954cc35738c4aa0710a92392d508479e8690f94131ccce2610c002e124
  adapter_sha256: d1e5780247875b0129779bb55a039f526f7e4dd27c61e68c16c990125c57f141
  evals_file: evals.json
  evals_sha256: 66080a26bf1b83ad54b3c83b98a2ac91caf80735060616280463dcc64ffe8f55
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, cost bounds, and the server's ActionDecision into the next step. Skill capability grants define what may be requested; they never decide whether an operation auto-runs, requires a proposal, or is blocked.

Follow the fetched contract and ActionDecision mechanically. When it requires a proposal, create the complete revision-bound artifact with `propose_artifact`, present that exact proposal for human review, and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. When it permits an auto-run, call `tools_run` with the exact bound inputs. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 18 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 13 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

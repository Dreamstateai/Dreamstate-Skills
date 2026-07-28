---
id: outreach-sequence-writer
name: Outreach Sequence Writer
description: Design custom channel steps, cadence, sender constraints, variable lineage, and real-row previews only for workflows that contain messaging.
triggers: ["write a custom outreach sequence","add messaging to a validated workflow","design outreach cadence","preview personalized steps"]
dependencies: []
capability_domains: ["outreach"]
capability_ids: ["brain.context.get","brain.context.search","outreach.ai_spintax_generate","outreach.ai_write_generate","outreach.ai_write_resolve","outreach.mailboxes_list","outreach.opener_sample_generate","outreach.opener_styles_list","outreach.personalization_generate","outreach.send_schedules.get","outreach.send_schedules.list","outreach.senders_list","outreach.settings_get","rows.get","rows.query","sequences.archive","sequences.bind","sequences.definition_get","sequences.list","sequences.step_options","sequences.validate"]
direct_run_capability_ids: []
max_context_tokens: 5000
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 085e9fc900e75d22b4a938c617335151015969ae72092095f97c1c819fb1b8c8
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: dd1a08fc43be0a44
  manifest_digest: 6560065e6813694762fbc17655d9c50e28b5262496f1a4a3e4e2a590c3646276
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.7
  source_release_hash: 085e9fc900e75d22b4a938c617335151015969ae72092095f97c1c819fb1b8c8
  generator_version: 1.0.0
  kernel_id: outreach-sequence-writer
  kernel_file: KERNEL.md
  kernel_sha256: 084ae56172543010fa4748ce2b4a8d11f53bab8abad4c5c4f5f2c2db69e928c1
  adapter_sha256: c44d94790641bc3a0182e2a4c7c8b27609a4dd4b2f82c7cbd1ecf6b710ac6816
  evals_file: evals.json
  evals_sha256: 5e3a508e62297b0604d1cf16b2d31d90a0c5cc92d683464204c1f4be9533f278
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, and cost bounds into the next step. `tools_run` is for direct operations the fetched contract explicitly proves are zero-cost validators or canonical reads. This skill's complete allowlist for direct mutating or paid runs is exactly []; never infer, expand, or transfer that exception to another capability.

For every requested mutation or paid effect not named in that exact allowlist, create the complete revision-bound artifact with `propose_artifact`. Present that exact proposal for human review and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. Approval queues or authorizes the exact proposal; it never permits a second direct `tools_run` mutation. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 21 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot directly run any mutating or paid capability: the direct-run allowlist is empty, so all 6 mutating grants here are proposal-only. Say the work is proposed and awaiting human approval, never that it ran.

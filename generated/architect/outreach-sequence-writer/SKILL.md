---
id: outreach-sequence-writer
name: Outreach Sequence Writer
description: Design custom channel steps, cadence, sender constraints, variable lineage, and real-row previews only for workflows that contain messaging.
triggers: ["write a custom outreach sequence","add messaging to a validated workflow","design outreach cadence","preview personalized steps"]
dependencies: []
capability_domains: ["outreach"]
capability_ids: ["brain.context.get","brain.context.search","outreach.ai_spintax_generate","outreach.ai_write_generate","outreach.ai_write_resolve","outreach.mailboxes_list","outreach.opener_sample_generate","outreach.opener_styles_list","outreach.personalization_generate","outreach.send_schedules.get","outreach.send_schedules.list","outreach.senders_list","outreach.settings_get","rows.get","rows.query","sequences.archive","sequences.bind","sequences.definition_get","sequences.delete","sequences.enrollment_owner_clear","sequences.list","sequences.step_options","sequences.validate"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 70b89077b92a973aeb192455dbd6aeb4580a7922894b21e19db09bde3dda6ea3
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 787f9735a083219d
  manifest_digest: 0c565b0647afe3048c54264ad1abe6b96a8722b9db67c47f749c8190d67be292
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 70b89077b92a973aeb192455dbd6aeb4580a7922894b21e19db09bde3dda6ea3
  generator_version: 1.0.0
  kernel_id: outreach-sequence-writer
  kernel_file: KERNEL.md
  kernel_sha256: 18b4d2ddc98bd25008810dcff1c9a959d0750333378ba0e4c2e958afc8d812cb
  adapter_sha256: 0075d9b99f376029c55dc85be0b0547436e3f022f489e6c962e21e5c47dec476
  evals_file: evals.json
  evals_sha256: 141b11da2b48f125fd2d29ad96e1da49cba5197ffcdca91c79c342ba0d5d9131
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

- Cannot act outside this contract: exactly 23 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 8 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

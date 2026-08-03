---
id: records
name: Records
description: Inspect and safely maintain canonical people, companies, standard records, fields, history, files, notes, lists, messages, buyer briefs, playbooks, and wiki evidence.
triggers: ["find or inspect a person, company, or standard record","show all record fields, history, and sources","update, merge, erase, organize, or message records","read a buyer brief, record playbook, or wiki evidence"]
dependencies: []
capability_domains: ["records"]
capability_ids: ["record_files.list","record_files.upload","records.buyer_brief_get","records.companies_list","records.create","records.erase","records.field_set","records.get","records.history_get","records.list","records.list_add","records.list_remove","records.lists_get","records.merge","records.message_channels_get","records.message_send","records.note_add","records.people_list","records.playbook_get","records.references_resolve","records.search","records.source_lookup","records.unmerge","records.value_retire","records.wiki_get"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"record_state","description":"Canonical record identity and revision state.","allowed_values":["exact_current","exact_historical","partial","missing","not_applicable"]},{"id":"object_schema_state","description":"Object, attribute, relationship, layout, and permission schema state.","allowed_values":["complete","partial","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 7ddbefcb362b98acfa7695932760ba51f14b05d5fe507275109a7aac0d7e4dd1
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 787f9735a083219d
  manifest_digest: 0c565b0647afe3048c54264ad1abe6b96a8722b9db67c47f749c8190d67be292
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 7ddbefcb362b98acfa7695932760ba51f14b05d5fe507275109a7aac0d7e4dd1
  generator_version: 1.0.0
  kernel_id: records
  kernel_file: KERNEL.md
  kernel_sha256: 9e18d775f2d79be35c84d7293d72009c6f54fc5aec72b742a31506f32f16db89
  adapter_sha256: 798efd71f85d417f450871fa77c2480ce2072aeca1256ef01335ea7349a9130b
  evals_file: evals.json
  evals_sha256: c965e4734743e291c7ad1d0395c9f384bfd377f6f1820dea2c51b93af0b3889e
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

- Cannot act outside this contract: exactly 25 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 11 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

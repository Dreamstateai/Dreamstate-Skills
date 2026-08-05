---
id: records-schema
name: Records Schema
description: Inspect and govern canonical record objects, attributes, relationships, layouts, permissions, notification policy, ordering, and schema impact.
triggers: ["inspect record schema","create or revise a custom object","change record relationships or layout","change record permissions or notification policy"]
dependencies: []
capability_domains: ["records"]
capability_ids: ["record_attributes.create","record_attributes.list","record_definitions.impact_get","record_objects.attribute_create","record_objects.attribute_update","record_objects.attributes_list","record_objects.attributes_reorder","record_objects.create","record_objects.layout_get","record_objects.layout_update","record_objects.list","record_objects.notification_prefs_get","record_objects.notification_prefs_update","record_objects.permission_get","record_objects.permission_update","record_objects.record_create","record_objects.reorder","record_objects.update","record_relationships.create","record_relationships.list","record_relationships.reorder","record_relationships.update"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"schema_definition_state","description":"Canonical object schema and revision state.","allowed_values":["complete","partial","missing","not_applicable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 3ad885ec954ac37e
  manifest_digest: 6c5fd2925eb2f2f94e98cb978f0ef03cbbabff6a49bc376e19b74afb701b54ed
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 3a3cf1b7d0cfcdaf4e31d7ea482343871feb3ea6a505f6619f5719ee6b699a07
  generator_version: 1.0.0
  kernel_id: records-schema
  kernel_file: KERNEL.md
  kernel_sha256: 38d6f45af8c091ac7fddeba8c4a2f765c089f634622a48f1477d48a0b2ff82c1
  adapter_sha256: 50f2cbdf6611379f2b6e41256e1066759cff7781654176646e3c8e76fe655422
  evals_file: evals.json
  evals_sha256: 57609921075322b6c1e83904abe94cd23445d633222cccd4a7e1dbe96573694e
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`: name every capability id this turn is likely to need as `query_terms` in one call, drawn from this skill's own capability_ids, instead of one narrower search per goal. `tools_get` refuses an id this turn never searched, so a capability id must appear in some earlier `tools_search` result before it can be fetched, even one already named by this skill's grant. The three-search discovery budget exists for genuinely unknown needs, not for fetching one already-named id at a time; spend it in as few calls as the turn's real uncertainty requires. Fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, cost bounds, and the server's ActionDecision into the next step. Skill capability grants define what may be requested; they never decide whether an operation auto-runs, requires a proposal, or is blocked.

Follow the fetched contract and ActionDecision mechanically. When it requires a proposal, create the complete revision-bound artifact with `propose_artifact`, present that exact proposal for human review, and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. When it permits an auto-run, call `tools_run` with the exact bound inputs. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 22 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 14 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

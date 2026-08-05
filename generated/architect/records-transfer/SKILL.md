---
id: records-transfer
name: Records Transfer
description: Stage, validate, run, inspect, control, and retrieve canonical record import and export jobs with row-level evidence.
triggers: ["import records","stage import rows","inspect import errors","create or download a record export"]
dependencies: ["records-schema"]
capability_domains: ["records"]
capability_ids: ["record_exports.control","record_exports.create","record_exports.download","record_exports.get","record_imports.control","record_imports.create","record_imports.errors_list","record_imports.get","record_imports.list","record_imports.rows_stage","record_imports.source_upload"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"transfer_run_state","description":"Canonical transfer job terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"transfer_evidence_state","description":"Row and artifact evidence status.","allowed_values":["verified","partial","unavailable","not_applicable"]}]}
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
  kernel_id: records-transfer
  kernel_file: KERNEL.md
  kernel_sha256: 09eb3bc15afff2e09b68705290a9ad403ac9ab4608d82bd7c424617cb4078797
  adapter_sha256: c7033eb2e8d2e6fba2a5aafcf9c30eabbe0ecf04c29cbac4e88241d5dbd3e6d0
  evals_file: evals.json
  evals_sha256: 1c117df40699db91599b8289d7436266fb05f1c54cd38748419f92fa59811424
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

- Cannot act outside this contract: exactly 11 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 6 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

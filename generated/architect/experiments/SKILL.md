---
id: experiments
name: Governed Experiments
description: Create, revise, approve, measure, publish, stop, inspect, and conclude governed growth experiments with immutable evidence and guardrails.
triggers: ["create a growth experiment","review or approve an experiment","record experiment evidence","stop or conclude an experiment"]
dependencies: ["context","visibility"]
capability_domains: ["growth"]
capability_ids: ["growth.governed_experiment_approve","growth.governed_experiment_conclude","growth.governed_experiment_create","growth.governed_experiment_get","growth.governed_experiment_list","growth.governed_experiment_measurement_record","growth.governed_experiment_publication_record","growth.governed_experiment_revise","growth.governed_experiment_stop"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"experiment_artifact_state","description":"Durable governed-experiment state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"experiment_evidence_state","description":"Publication and measurement evidence state.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 39919d7ae3b976d9eb9ddef02ea15db712b62c80d9bee847e26f33fd101aaf80
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 90203e36c720ed48
  manifest_digest: 0bab290777e70ca078ffd43fb74ee446391b1bfe500d3009fc42cc724a1a349b
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 39919d7ae3b976d9eb9ddef02ea15db712b62c80d9bee847e26f33fd101aaf80
  generator_version: 1.0.0
  kernel_id: experiments
  kernel_file: KERNEL.md
  kernel_sha256: 1af58fa508afe884136151c8810eb767a4cdd2472f3fd0b0a104586bceb78007
  adapter_sha256: 647a98841c8d21f5253009497b984646f2737b11b948f32aa0b0cde06242b7aa
  evals_file: evals.json
  evals_sha256: 0a2b4dd0402ad1f9dde41bb46a8a82e682dc171214f5e943498296aac47a0eba
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

- Cannot act outside this contract: exactly 9 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 7 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

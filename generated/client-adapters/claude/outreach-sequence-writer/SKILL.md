---
id: outreach-sequence-writer
name: outreach-sequence-writer
description: "Design custom channel steps, cadence, sender constraints, variable lineage, and real-row previews only for workflows that contain messaging."
capability_domains: ["outreach"]
capability_ids: ["brain.context.get","brain.context.search","sequences.bind","sequences.definition_get","sequences.step_options","sequences.validate"]
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: d1be7a15cb9fc008b60819c14e47349f222f63757ca7fd9608d8c65573280e2e
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 6989c784ac48af12
  manifest_digest: 29322b452ca55c48e99398cb5f7e4e62c72e739378c9feeaa9cdbbc9001648cc
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.1
  source_release_hash: d1be7a15cb9fc008b60819c14e47349f222f63757ca7fd9608d8c65573280e2e
  generator_version: 1.0.0
  client: claude
  kernel_id: outreach-sequence-writer
  kernel_file: KERNEL.md
  kernel_sha256: 78cd5b050dd0a22398348cca06692fcb6a927668ee7ab043ceab5c210d05079c
  adapter_sha256: 9a9787b28edc13075be6707d56efef6053b71e45210ddd9a908c4d788e9b147d
  evals_file: evals.json
  evals_sha256: f743122906bb76a5bd95e62630960aa0b15b0b4b2e5b3aac42ac5b6f9e5d6b03
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is only for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. Never use `dreamstate_tools_run` for direct mutating or paid work.

For any requested mutation or paid effect, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Custom outreach sequence writer
<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","sequences.bind","sequences.definition_get","sequences.step_options","sequences.validate"]}
-->

## Job boundary

Create original messaging from the user's requirements only when the validated outreach workflow contains a messaging branch. Own channel steps, timing, variables, sender constraints, copy scaffolds, and real-row previews. Never activate, enroll, or send. Do not load for qualification-only workflows.

## Required inputs

Require the coordinator intake, list handoff, and workflow handoff. The workflow must identify the messaging branch, eligible-row output, channel intent, stop conditions, and sender consequence. The list must provide exact symbolic outputs for every personalization variable. Fetch targeted Company Brain claims and voice guidance with revisioned citations; user text alone is not canonical brand truth.

## Sequence design

1. Resolve sender/account and channel readiness through live capabilities. Ask one structured popup only for a material sender, channel, tone, cadence, or call-to-action choice that cannot be discovered.
2. Search live sequence and content-generation capabilities by desired channel, inputs, outputs, and allowed side effects. Fetch exact contracts before using any schema or enum.
3. Define ordered steps with delays and send windows. Each variable maps to one typed upstream output and declares missing-input behavior. Never display unresolved placeholders as a valid preview.
4. Ground claims in approved Company Brain facts and row evidence. Separate stable campaign copy from per-row generated copy. Preserve generated-output provenance, cost, and model/run identity when returned.
5. Validate sender/channel constraints, graph reachability, timing, stop-on-reply behavior, duplicate prevention, and per-account safety caps through the live contract.
6. Generate a bounded preview using real approved sample rows. Audit factuality, variable resolution, specificity, prohibited claims, tone, duplication, and channel fit. A synthetic example cannot substitute for this check when real rows exist.

## Handoff and consequence

Return at most 750 tokens: sequence revision, ordered custom steps, timing, channel, sender binding, variable lineage, missing-value behavior, preview evidence, validation state, estimated cost, and capability ids/digests. Persistence creates a reviewable draft only. Enrollment, activation, and sending remain later coordinator gates and require live revalidation.

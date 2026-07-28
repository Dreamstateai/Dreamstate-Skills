---
id: growth-asset-planner
name: growth-asset-planner
description: "Design a buyer-facing reading resource (lead magnet, checklist, playbook, audit, SOP, resource hub) and its evidence, structure, CTA, distribution, and follow-up path, remaining explicitly unsaved until live persistence exists. Never owns workbooks, worksheets, tables, views, columns, or rows. Any durable dataset deliverable belongs to `tables`."
capability_domains: []
capability_ids: ["brain.context.get","brain.context.search","brain.evidence.search","command_center.assets.create","command_center.assets.list"]
direct_run_capability_ids: []
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
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
  client: codex
  kernel_id: growth-asset-planner
  kernel_file: KERNEL.md
  kernel_sha256: 6b1fb2ad7b5427a25334328e76863e07fa30ce27e3a681958f016b781faacc76
  adapter_sha256: 160e4f67e8542a9cb2a6f4f8b7de8a8ee28b3c2a5402e78d28e2d09d2a902fdb
  evals_file: evals.json
  evals_sha256: a04ebbe93e8520147463d361714335367b518659b8591db1fe60e811cf1d3c6d
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. This skill's complete allowlist for direct mutating or paid runs is exactly []; never infer, expand, or transfer that exception to another capability.

For any requested mutation or paid effect not named in that exact allowlist, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 5 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot directly run any mutating or paid capability: the direct-run allowlist is empty, so all 1 mutating grants here are proposal-only. Say the work is proposed and awaiting human approval, never that it ran.

---

# Buyer-facing growth asset planner
<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","brain.evidence.search","command_center.assets.create","command_center.assets.list"]}
-->

Design a lead magnet, playbook, checklist, audit, SOP, resource library, resource hub, or buyer-facing template library that helps a defined buyer make progress and leads naturally to the next action. Own audience, problem, promise, evidence, structure, format, distribution path, call to action, follow-up path, and a reviewable proposal.

Ground the asset in targeted published Company Brain facts and cited evidence. Derive the buyer, stage, pain, desired transformation, proof, constraints, and distribution context before asking. Use one structured popup only for material remaining choices such as promise, format, depth, brand posture, or call to action.

Use live search/get to establish whether a durable asset artifact, editor, storage, or publishing capability exists. Until an exact live contract proves it does, this skill is planning-only: return an explicitly unsaved proposal and never claim creation, save, upload, publication, or a working download link. A blog draft belongs to `blog`; an operating plan belongs to `weekly-growth-plan`. A workbook, worksheet, table, view, column, or row belongs to `tables`, no matter which buyer, cohort, or audience the request names: this skill produces something a person reads, never a durable dataset, so a request for one is not this skill's job even when the wording overlaps a playbook or worksheet.

The proposal includes a concise positioning statement, title options, reader outcome, evidence map, section outline, examples or worksheets, production requirements, quality criteria, distribution and follow-up path, measurement, risks, and the smallest supported next action. If a durable capability is available, fetch its exact schema and apply the normal proposal and consequence gates before persistence.

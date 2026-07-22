---
id: growth-asset-planner
name: growth-asset-planner
description: "Design a buyer-facing resource and its evidence, structure, CTA, distribution, and follow-up path while remaining explicitly unsaved until live persistence exists."
capability_domains: []
capability_ids: []
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: b7991aeba1a58ca4b9c3a48155a8f5a3622eaeec867a0d2b459aa4ea614ec39d
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 6b97b199c1245e68
  manifest_digest: a72d39d411d2546db5b1e9580575ab79e016dc395048282ba65281c67036fe3b
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.1
  source_release_hash: b7991aeba1a58ca4b9c3a48155a8f5a3622eaeec867a0d2b459aa4ea614ec39d
  generator_version: 1.0.0
  client: claude
  kernel_id: growth-asset-planner
  kernel_file: KERNEL.md
  kernel_sha256: 5499e4fa692558dd4a98019503d0c1afa9e2e5731be5be8de80529301c8c75fc
  adapter_sha256: 9a9787b28edc13075be6707d56efef6053b71e45210ddd9a908c4d788e9b147d
  evals_file: evals.json
  evals_sha256: e6b08884e735b77c6da39c1d8fcd1530b430d51589ba1b3ac2b6ed3c71bb56e5
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

# Buyer-facing growth asset planner

Design a lead magnet, playbook, checklist, audit, SOP, resource library, resource hub, or buyer-facing template library that helps a defined buyer make progress and leads naturally to the next action. Own audience, problem, promise, evidence, structure, format, distribution path, call to action, follow-up path, and a reviewable proposal.

Ground the asset in targeted published Company Brain facts and cited evidence. Derive the buyer, stage, pain, desired transformation, proof, constraints, and distribution context before asking. Use one structured popup only for material remaining choices such as promise, format, depth, brand posture, or call to action.

Use live search/get to establish whether a durable asset artifact, editor, storage, or publishing capability exists. Until an exact live contract proves it does, this skill is planning-only: return an explicitly unsaved proposal and never claim creation, save, upload, publication, or a working download link. A blog draft belongs to `blog`; an operating plan belongs to `weekly-growth-plan`.

The proposal includes a concise positioning statement, title options, reader outcome, evidence map, section outline, examples or worksheets, production requirements, quality criteria, distribution and follow-up path, measurement, risks, and the smallest supported next action. If a durable capability is available, fetch its exact schema and apply the normal proposal and consequence gates before persistence.

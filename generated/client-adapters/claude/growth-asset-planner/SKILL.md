---
id: growth-asset-planner
name: growth-asset-planner
description: "Design a buyer-facing resource and its evidence, structure, CTA, distribution, and follow-up path while remaining explicitly unsaved until live persistence exists."
capability_domains: []
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 2e48794d262c9c5fcb9a9a4083977c303809b6dc3b84feebc7012250ffc42e59
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: a2abbe7ba4cbc084
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.0
  source_release_hash: 2e48794d262c9c5fcb9a9a4083977c303809b6dc3b84feebc7012250ffc42e59
  generator_version: 1.0.0
  client: claude
  kernel_id: growth-asset-planner
  kernel_file: KERNEL.md
  kernel_sha256: 5499e4fa692558dd4a98019503d0c1afa9e2e5731be5be8de80529301c8c75fc
  adapter_sha256: e8d99ea288bffa663c80aa3ca106aeb5910b1cd35cf33b8eb109db149641d46a
  evals_file: evals.json
  evals_sha256: e6b08884e735b77c6da39c1d8fcd1530b430d51589ba1b3ac2b6ed3c71bb56e5
mutation_compatibility:
  mismatch_behavior: deny_run
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get]
  denied_operation: dreamstate_tools_run
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Carry the opaque tool-turn token mechanically from `dreamstate_tools_search` to `dreamstate_tools_get` and `dreamstate_tools_run`; always fetch exact live schemas before execution.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search` and `dreamstate_tools_get` remain available for recovery and refresh when the live capability definition, capability hash, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple is compatible with live metadata. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from an accepted or queued request.

---

# Buyer-facing growth asset planner

Design a lead magnet, playbook, checklist, audit, SOP, resource library, resource hub, or buyer-facing template library that helps a defined buyer make progress and leads naturally to the next action. Own audience, problem, promise, evidence, structure, format, distribution path, call to action, follow-up path, and a reviewable proposal.

Ground the asset in targeted published Company Brain facts and cited evidence. Derive the buyer, stage, pain, desired transformation, proof, constraints, and distribution context before asking. Use one structured popup only for material remaining choices such as promise, format, depth, brand posture, or call to action.

Use live search/get to establish whether a durable asset artifact, editor, storage, or publishing capability exists. Until an exact live contract proves it does, this skill is planning-only: return an explicitly unsaved proposal and never claim creation, save, upload, publication, or a working download link. A blog draft belongs to `blog`; an operating plan belongs to `weekly-growth-plan`.

The proposal includes a concise positioning statement, title options, reader outcome, evidence map, section outline, examples or worksheets, production requirements, quality criteria, distribution and follow-up path, measurement, risks, and the smallest supported next action. If a durable capability is available, fetch its exact schema and apply the normal proposal and consequence gates before persistence.

---
id: reddit-engagement
name: Reddit Engagement
description: Discover real Reddit and community threads, triage evidence and risk, and prepare thread-bound reply drafts for review.
triggers: ["find real Reddit threads","monitor community conversations","triage reply opportunities","draft replies to real threads"]
dependencies: []
capability_domains: ["content"]
max_context_tokens: 5000
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 04784d702af011050f185a5e9cc4c3c3c4224e12d4000a28c0c7cb36e89e8a24
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: f195bb71cf76a615
  manifest_digest: 10958b8c8b0492506ecfdac97a45a1ff0150e919866765ff809a463a5afcc412
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.3.0
  source_release_hash: 04784d702af011050f185a5e9cc4c3c3c4224e12d4000a28c0c7cb36e89e8a24
  generator_version: 1.0.0
  kernel_id: reddit-engagement
  kernel_file: KERNEL.md
  kernel_sha256: 3e7f97663fdbe7b47eb111a36a1e887ff56691520ae18419f84c0eb8a29eb969
  adapter_sha256: ecd475ca0450067312a912d3d5800ccc94ce008d768fc7176e14adaaedf1a36d
  evals_file: evals.json
  evals_sha256: e937a37057751e4a1d0bd53ecff46d5d6987a81289452396b29971f6f03d9212
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, and cost bounds into the next step. `tools_run` is only for direct operations the fetched contract explicitly proves are zero-cost validators or canonical reads. Never use `tools_run` for direct mutating or paid work.

For every requested mutation or paid effect, create the complete revision-bound artifact with `propose_artifact`. Present that exact proposal for human review and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. Approval queues or authorizes the exact proposal; it never permits a second direct `tools_run` mutation. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

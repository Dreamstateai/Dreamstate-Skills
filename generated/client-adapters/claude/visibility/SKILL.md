---
id: visibility
name: visibility
description: "Run and interpret AI-answer visibility audits with real citations, method limits, gap diagnosis, governed refreshes, and a canonical inspection surface."
capability_domains: ["visibility"]
capability_ids: ["visibility.citations","visibility.overview","visibility.refresh","visibility.tracked_prompts.list","visibility.workspace_site_get"]
completion_contract: {"version":1,"fields":[{"id":"observation_state","description":"Observation timestamp and source state.","allowed_values":["observed","cached","unavailable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 77460e4d7803974989375c69d4396cd963d9c41569b0e95c13f0925c013906f8
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 1f8e2f4bd87779d6
  manifest_digest: 39b629d74188afa1e3596d4c8402eccdd86915c5e99b2b720e64d18f425a7936
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.2
  source_release_hash: 77460e4d7803974989375c69d4396cd963d9c41569b0e95c13f0925c013906f8
  generator_version: 1.0.0
  client: claude
  kernel_id: visibility
  kernel_file: KERNEL.md
  kernel_sha256: b38e5cd9ad318f28a800c07d1e7491d80d280fe2231fd387247c9864151baa30
  adapter_sha256: 9a9787b28edc13075be6707d56efef6053b71e45210ddd9a908c4d788e9b147d
  evals_file: evals.json
  evals_sha256: 2ae01ee50f9897d52dae45b9d5dd1d61c5c2471cf2e27447de4808ffefaa0ca6
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

# AI visibility
<!-- architect-operation-contract
{"required_capability_ids":["visibility.citations","visibility.overview","visibility.refresh","visibility.tracked_prompts.list","visibility.workspace_site_get"]}
-->

Own AI-answer visibility measurement, citation inspection, gap diagnosis, supported refresh runs, and the visibility canvas. Establish the brand, market, questions, competitors, locale, and comparison period from canonical context; ask one structured popup only when a missing scope materially changes the audit.

Search/get exact live visibility contracts. Preserve query set, model/provider coverage, timestamps, citations, answer excerpts behind the untrusted boundary, methodology, and known limitations. Distinguish measured mention or citation results from inferred opportunity. Never invent a citation or claim that an external answer changed without a successful refresh result.

Propose prioritized gaps by buyer question, evidence weakness, content coverage, and likely next owner. Blog creation delegates to `blog`; strategic positioning delegates to `strategy`. Request approval before credit-bearing refreshes or persisted changes, report the durable run state and cost, and open only the returned canonical visibility link.

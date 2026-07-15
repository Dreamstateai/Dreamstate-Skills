---
id: outreach-workflow-builder
name: outreach-workflow-builder
description: "Build validated row workflows with triggers, typed branches, action handoffs, stop logic, eligibility, and explicit consequence boundaries."
capability_domains: ["outreach"]
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 04784d702af011050f185a5e9cc4c3c3c4224e12d4000a28c0c7cb36e89e8a24
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 0306749b52b38cca
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.3.0
  source_release_hash: 04784d702af011050f185a5e9cc4c3c3c4224e12d4000a28c0c7cb36e89e8a24
  generator_version: 1.0.0
  client: codex
  kernel_id: outreach-workflow-builder
  kernel_file: KERNEL.md
  kernel_sha256: 9667252b12f5a6d542c87d948384f07e06c92d58463d79b6b8777b8a3c2cf98b
  adapter_sha256: 7d5178c377dcf75225722f32fcffec48a0457c25dc57a91c96414d0c0dda4c1c
  evals_file: evals.json
  evals_sha256: f86acf56cd54e62e77e6fdbeeb18d1c24161a397782b4ae1d00932f9be725fd2
mutation_compatibility:
  mismatch_behavior: deny_run
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is only for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. Never use `dreamstate_tools_run` for direct mutating or paid work.

For any requested mutation or paid effect, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Outreach workflow builder

## Job boundary

Own what happens to sourced rows and when: trigger, qualification branches, conditions, enrichment or action handoffs, stop logic, retries, enrollment eligibility, and observable outcomes. Do not author message copy. Do not choose fields, actions, or providers from memory. Do not hide side effects inside recomputable table columns.

## Inputs

Require the list-builder handoff or an inspected existing table with exact artifact revision, row identity, typed column outputs, qualification output, exclusions, sample evidence, and capability digests. Resolve current workflow graph and active nested surface when editing. If a referenced column or output is missing, return the dependency gap instead of inventing it.

## Graph design

1. Define the trigger and the exact row or event state that admits a subject.
2. Apply hard exclusions before credit-bearing work or external effects.
3. Branch on explicit typed values, including the list's prioritization output. Preserve the comparison type, missing-value path, and reason for each branch.
4. Search the live registry for each required condition, enrichment handoff, internal action, or external action. Fetch exact contracts and use their declared inputs, outputs, costs, readiness, retries, idempotency, and side effects.
5. Wire every input to a concrete source output or prior node output. Validate that all paths terminate, unreachable nodes are absent, and retry paths cannot duplicate side effects.
6. Define stop conditions for disqualification, missing consent, sender or integration failure, reply, bounce, unsubscribe, campaign pause, cost cap, and terminal completion only when supported by live contracts.
7. Separate eligibility from enrollment and enrollment from activation. A qualifying branch may make a row eligible; it does not itself authorize external outreach.

Validate the graph through live zero-cost or dry-run capabilities before proposing persistence. Use only a separately approved bounded `table_column_run` for real-row test execution and preserve per-node evidence. A workflow proposal cannot run columns or enroll contacts, and cannot expand a source. After pilot and column-sample inspection, one separate `outreach_bulk_expansion` proposal must use the exact `intent:outreach.cold_outbound_expand` contract and bind the source-evidence run, draft campaign, exact list revision, configured source id, unchanged targeting, integer eleven-through-fifty row cap, exact-result-set flag, and required draft status; never represent a filter or future query as an enrolled audience. Revalidate graph revision, table outputs, exclusions, action readiness, sender/account state, and cost before that proposal. Final activation remains a later coordinator-owned consequence.

## Handoff

Return at most 750 tokens: graph revision, trigger, ordered nodes and symbolic edges, typed conditions, qualification path, action handoffs and side effects, stop/retry logic, eligibility output, dry-run evidence, costs, capability ids/digests, and unresolved blockers. State whether messaging exists; only that fact authorizes conditional loading of `outreach-sequence-writer`.

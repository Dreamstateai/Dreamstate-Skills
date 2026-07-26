---
id: outreach-workflow-builder
name: outreach-workflow-builder
description: "Build validated row workflows with triggers, typed branches, action handoffs, stop logic, eligibility, and explicit workflow-versus-expansion-versus-activation consequence boundaries."
capability_domains: ["outreach"]
capability_ids: ["sources.cold_outbound_expand","workflows.get","workflows.graph_apply","workflows.node_registry","workflows.validate_graph"]
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"activation_state","description":"Whether campaign activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]},{"id":"campaign_state","description":"Campaign lifecycle state at the current boundary.","allowed_values":["inactive","active","blocked","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 62f0861bd0a5fa2f9e6044567bddd49df6fe1ae41b496fd85488c72d9e20d092
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 01002d9587befbf3
  manifest_digest: f91ed1b74ebe129ef522f45fdcaec299626b3b5f1d0209e2d0a44bf4684f9ab0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.3
  source_release_hash: 62f0861bd0a5fa2f9e6044567bddd49df6fe1ae41b496fd85488c72d9e20d092
  generator_version: 1.0.0
  client: claude
  kernel_id: outreach-workflow-builder
  kernel_file: KERNEL.md
  kernel_sha256: ff8ff0535cc74d1332412d9e29d43c84d58fe35bd3112112bd74ca1da7a6dab3
  adapter_sha256: 9a9787b28edc13075be6707d56efef6053b71e45210ddd9a908c4d788e9b147d
  evals_file: evals.json
  evals_sha256: b9a91259c05be30780b42e41f79f930476bf6ab5d433fc23b6bc1748e83f4207
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

# Outreach workflow builder
<!-- architect-operation-contract
{"required_capability_ids":["sources.cold_outbound_expand","workflows.get","workflows.graph_apply","workflows.node_registry","workflows.validate_graph"]}
-->

## Job boundary

Own what happens to sourced rows and when: trigger, qualification branches, conditions, enrichment or action handoffs, stop logic, retries, enrollment eligibility, and observable outcomes. Do not author message copy. Do not choose fields, actions, or providers from memory. Do not hide side effects inside recomputable table columns.

## Inputs

Require the tables handoff or an inspected existing worksheet and saved view with exact revisions, row identity, typed column outputs, qualification output, exclusions, sample evidence, and capability digests. Resolve current workflow graph and active nested surface when editing. If a referenced column or output is missing, return the dependency gap instead of inventing it.

## Graph design

1. Define the trigger and the exact row or event state that admits a subject.
2. Apply hard exclusions before credit-bearing work or external effects.
3. Branch on explicit typed values, including the list's prioritization output. Preserve the comparison type, missing-value path, and reason for each branch.
4. Search the live registry for each required condition, enrichment handoff, internal action, or external action. Fetch exact contracts and use their declared inputs, outputs, costs, readiness, retries, idempotency, and side effects.
5. Wire every input to a concrete source output or prior node output. Validate that all paths terminate, unreachable nodes are absent, and retry paths cannot duplicate side effects.
6. Define stop conditions for disqualification, missing consent, sender or integration failure, reply, bounce, unsubscribe, campaign pause, cost cap, and terminal completion only when supported by live contracts.
7. Separate eligibility from enrollment and enrollment from activation. A qualifying branch may make a row eligible; it does not itself authorize external outreach.

Validate the graph through live zero-cost or dry-run capabilities before proposing persistence. Use only a separately approved bounded `table_column_run` for real-row test execution and preserve per-node evidence.

Keep the lifecycle boundaries explicit in the handoff:

1. Workflow persistence saves the reviewed graph only. A workflow proposal cannot run columns or enroll contacts. It also cannot expand a source, import contacts, or activate a campaign.
2. After pilot and column-sample inspection, `outreach_bulk_expansion` is a separate proposal using the exact `sources.cold_outbound_expand` contract. Bind the source-evidence run, draft campaign, exact workbook, worksheet, and saved-view revisions, configured source id, unchanged targeting, integer eleven-through-fifty row cap, `stage_exact_result_set=true`, and required draft status. It imports and stages only that capped resolved set; the campaign remains inactive. Never represent a filter or future query as an enrolled audience.
3. Activation remains a later coordinator-owned consequence with its own approval boundary.

Revalidate graph revision, table outputs, exclusions, action readiness, sender/account state, and cost before the bulk-expansion proposal.

Before a terminal exact-result-set handoff, call `tools_search` and then `tools_get` for `sources.cold_outbound_expand` in the active tool turn. A remembered or prose-only capability id is not contract evidence. If the exact live schema is unavailable, return that blocker and do not claim the expansion proposal is ready.

When the source-evidence run and every immutable workbook, worksheet, saved-view, source, campaign, targeting revision, and row-cap binding are supplied, do not ask for them again. Use the fetched `sources.cold_outbound_expand` contract in a canonical `tools_run` dry run. The dry run may validate and return proposal evidence only: it must not import, enroll, activate, or send. Preserve its receipt as the source-evidence run, keep `durability_state=proposal_only`, `selection_state=exact`, `campaign_state=inactive`, `activation_state=inactive`, and `run_state=blocked` until a separately approved mutation is executed.

In the typed completion handoff, `activation_state` reports only whether activation actually occurred. Use `inactive` whenever it did not; any blocked work belongs in `run_state`.

## Handoff

Return at most 750 tokens: graph revision, trigger, ordered nodes and symbolic edges, typed conditions, qualification path, action handoffs and side effects, stop/retry logic, eligibility output, dry-run evidence, costs, capability ids/digests, and unresolved blockers. State whether messaging exists; only that fact authorizes conditional loading of `outreach-sequence-writer`. If the user makes messaging conditional and no supplied or inspected graph proves whether a messaging branch exists, resolve that material decision by calling `ask_user` in the current turn. Do not answer with a promise to ask later. If the graph does prove messaging, load `outreach-sequence-writer`; never silently omit both transitions.

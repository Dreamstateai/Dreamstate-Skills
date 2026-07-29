---
id: outreach-workflow-builder
name: outreach-workflow-builder
description: "Build validated row workflows with triggers, typed branches, action handoffs, stop logic, eligibility, and explicit workflow-versus-expansion-versus-activation consequence boundaries."
capability_domains: ["outreach"]
capability_ids: ["columns.list","rows.get","rows.query","runs.cancel","runs.get","runs.pause","runs.resume","table_sources.list","tables.get","tables.list","views.get","views.list","workbooks.get","workbooks.list","workflows.archive","workflows.call_child","workflows.create","workflows.draft_publish","workflows.draft_save","workflows.get","workflows.graph_apply","workflows.list","workflows.metrics_get","workflows.node_inspect","workflows.node_options","workflows.node_registry","workflows.run_retry","workflows.run_trace_get","workflows.runs_list","workflows.trigger_create","workflows.trigger_delete","workflows.triggers_list","workflows.validate_graph","worksheets.list"]
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"activation_state","description":"Whether workflow activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 6611ca355fcc43b1793d30eaf2a59b6c0c2bba5a1ce76a23913c5ee32a9de23f
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 8ba8c82bd38f553e
  manifest_digest: 9f0fd7349ac4b713a023dc91b7b3a1f0e9acbf751667820a99a1845eb3565d95
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 6611ca355fcc43b1793d30eaf2a59b6c0c2bba5a1ce76a23913c5ee32a9de23f
  generator_version: 1.0.0
  client: codex
  kernel_id: outreach-workflow-builder
  kernel_file: KERNEL.md
  kernel_sha256: 6d786028ea4937001ef6b38358138ea263952419ed0861750a49545561f27bcd
  adapter_sha256: 4bee4fb5f51fb4863909990098b3eb5c0b87b3664531ce7801e9b3756835e408
  evals_file: evals.json
  evals_sha256: 323ecb45bdd3384d06a99af30e45a53cbd2375ee77fd1a5ef3ea54b860635d6c
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes `dreamstate_context_create_document`, `dreamstate_context_create_folder`, `dreamstate_context_save_and_publish`, and `dreamstate_context_save_draft` under the same mismatch. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 34 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 12 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.
- Cannot hold a source definition as a capability grant: all 26 source definitions in the pinned manifest are discovery-only and carry no executor id, so granting one would be a no-op. Say the source is reached by attaching it to a worksheet and acting on that attachment.

---

# Outreach workflow builder
<!-- architect-operation-contract
{"required_capability_ids":["columns.list","rows.get","rows.query","runs.cancel","runs.get","runs.pause","runs.resume","table_sources.list","tables.get","tables.list","views.get","views.list","workbooks.get","workbooks.list","workflows.archive","workflows.call_child","workflows.create","workflows.draft_publish","workflows.draft_save","workflows.get","workflows.graph_apply","workflows.list","workflows.metrics_get","workflows.node_inspect","workflows.node_options","workflows.node_registry","workflows.run_retry","workflows.run_trace_get","workflows.runs_list","workflows.trigger_create","workflows.trigger_delete","workflows.triggers_list","workflows.validate_graph","worksheets.list"]}
-->

## Job boundary

Own what happens to sourced rows and when: trigger, qualification branches, conditions, enrichment or action handoffs, stop logic, retries, enrollment eligibility, and observable outcomes. Do not author message copy. Do not choose fields, actions, or providers from memory. Do not hide side effects inside recomputable table columns.

For a failed subject run, inspect the run list, exact trace, failed node, workflow revision, and metrics first. Recover only through the governed `workflows.run_retry` proposal for the exact failed event. Re-read the trace and terminal state afterward. A retry is valid only when its durable receipt proves completed effects were not replayed and the failed event, subject, workflow, and resumed node match the inspected failure.

## Inputs

Require a typed reviewed `tables` handoff or an inspected existing worksheet and saved view with exact revisions, row identity, typed column outputs, qualification output, exclusions, sample and source-expansion receipts, and capability digests. Treat those receipts as immutable evidence; never execute or revalidate the source operation here. Resolve the current workflow graph and active nested surface when editing. If a referenced column, output, or receipt is missing, return the dependency gap instead of inventing it.

## Graph design

1. Define the trigger and the exact row or event state that admits a subject.
2. Apply hard exclusions before credit-bearing work or external effects.
3. Branch on explicit typed values, including the list's prioritization output. Preserve the comparison type, missing-value path, and reason for each branch.
4. Search the live registry for each required condition, enrichment handoff, internal action, or external action. Fetch exact contracts and use their declared inputs, outputs, costs, readiness, retries, idempotency, and side effects.
5. Wire every input to a concrete source output or prior node output. Validate that all paths terminate, unreachable nodes are absent, and retry paths cannot duplicate side effects.
6. Define stop conditions for disqualification, missing consent, sender or integration failure, reply, bounce, unsubscribe, workflow pause, cost cap, and terminal completion only when supported by live contracts.
7. Separate eligibility from enrollment and enrollment from activation. A qualifying branch may make a row eligible; it does not itself authorize external outreach.

Validate the graph through live zero-cost or dry-run capabilities before proposing persistence. Use only a separately approved bounded `table_column_run` for real-row test execution and preserve per-node evidence.

Keep the lifecycle boundaries explicit in the handoff:

1. Workflow persistence saves the reviewed graph only. A workflow proposal cannot run columns or enroll contacts. It also cannot expand a source, import contacts, or activate a workflow.
2. After pilot and column-sample inspection, source expansion remains a separate `tables`-owned proposal. This specialist consumes its typed reviewed handoff—source-evidence receipt, exact workbook/worksheet/view revisions, configured source, unchanged targeting, capped exact selection, and terminal receipt—only to bind workflow eligibility. It never searches, fetches, validates, proposes, or executes source expansion.
3. Activation remains a later coordinator-owned consequence with its own approval boundary.

Workflow versions and workflow runs have separate lifecycle controls:

1. Restore a prior workflow by reading the exact published graph and saving it as a new immutable draft version. Never rewrite or relabel history.
2. Replace an output by rewiring the typed node output in that new draft, validating every downstream input, then publishing only with the user's explicit build instruction. Do not mutate a published version.
3. Schedule through an inspected `workflows.trigger_create` schedule contract and verify it with `workflows.triggers_list`; deleting a schedule uses the separate trigger-delete consequence.
4. Inspect a run with `runs.get` before control. Pause the exact inspected state version with `runs.pause`; this is a free, idempotent run-control action, never an archive or graph edit. Verify `pause_requested=true` and the durable control receipt. Resume only that same frozen graph/input checkpoint with `runs.resume`. A terminal cancel uses `runs.cancel` as a separate, explicit consequence.
5. Retry is neither resume nor replay: inspect the workflow trace and call `workflows.run_retry` only for the exact failed event and node. Completed effects must remain settled and must never run again.

Revalidate graph revision, typed table outputs, exclusions, action readiness, sender/account state, and costs before returning the workflow handoff. When every immutable binding and terminal `tables` receipt is supplied, do not ask for it again. Keep `selection_state=exact`, `activation_state=inactive`, and any blocked workflow work in `run_state`.

In the typed completion handoff, `activation_state` reports only whether activation actually occurred. Use `inactive` whenever it did not; any blocked work belongs in `run_state`.

## Handoff

Return at most 750 tokens: graph revision, trigger, ordered nodes and symbolic edges, typed conditions, qualification path, action handoffs and side effects, stop/retry logic, eligibility output, dry-run evidence, costs, capability ids/digests, and unresolved blockers. State whether messaging exists; only that fact authorizes conditional loading of `outreach-sequence-writer`. Resolve `messaging_branch_state` from the supplied or inspected graph, never by asking: no messaging branch is `absent`, any messaging branch is `present`, and an uninspectable graph is a typed blocker. If the graph proves messaging, load `outreach-sequence-writer`; never silently omit both transitions.

---
id: outreach-workflow-builder
name: outreach-workflow-builder
description: "Build validated row workflows with triggers, typed branches, action handoffs, stop logic, eligibility, and explicit workflow-versus-expansion-versus-activation consequence boundaries."
capability_domains: ["outreach"]
capability_ids: ["columns.list","rows.get","rows.query","table_sources.list","tables.get","tables.list","views.get","views.list","workbooks.get","workbooks.list","workflows.archive","workflows.call_child","workflows.create","workflows.draft_save","workflows.get","workflows.graph_apply","workflows.list","workflows.node_inspect","workflows.node_options","workflows.node_registry","workflows.run_trace_get","workflows.runs_list","workflows.trigger_create","workflows.trigger_delete","workflows.triggers_list","workflows.validate_graph","worksheets.list"]
direct_run_capability_ids: []
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"activation_state","description":"Whether workflow activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]}]}
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
  kernel_id: outreach-workflow-builder
  kernel_file: KERNEL.md
  kernel_sha256: f9cfc7a0faea8ec42e5c52c7abbf6807b4b88f92e6b7ee7988c8511c7c301f53
  adapter_sha256: 5353f665218a0817ed3147f806cad1aaa34556e90b0a61e216d4b1729e1146a3
  evals_file: evals.json
  evals_sha256: c2800607862e8106ba230d91a216db38bf06043efdace7c45c77bda3cd630307
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

- Cannot act outside this contract: exactly 27 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot directly run any mutating or paid capability: the direct-run allowlist is empty, so all 7 mutating grants here are proposal-only. Say the work is proposed and awaiting human approval, never that it ran.
- Cannot hold a source definition as a capability grant: all 26 source definitions in the pinned manifest are discovery-only and carry no executor id, so granting one would be a no-op. Say the source is reached by attaching it to a worksheet and acting on that attachment.

---

# Outreach workflow builder
<!-- architect-operation-contract
{"required_capability_ids":["columns.list","rows.get","rows.query","table_sources.list","tables.get","tables.list","views.get","views.list","workbooks.get","workbooks.list","workflows.archive","workflows.call_child","workflows.create","workflows.draft_save","workflows.get","workflows.graph_apply","workflows.list","workflows.node_inspect","workflows.node_options","workflows.node_registry","workflows.run_trace_get","workflows.runs_list","workflows.trigger_create","workflows.trigger_delete","workflows.triggers_list","workflows.validate_graph","worksheets.list"]}
-->

## Job boundary

Own what happens to sourced rows and when: trigger, qualification branches, conditions, enrichment or action handoffs, stop logic, retries, enrollment eligibility, and observable outcomes. Do not author message copy. Do not choose fields, actions, or providers from memory. Do not hide side effects inside recomputable table columns.

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

Revalidate graph revision, typed table outputs, exclusions, action readiness, sender/account state, and costs before returning the workflow handoff. When every immutable binding and terminal `tables` receipt is supplied, do not ask for it again. Keep `selection_state=exact`, `activation_state=inactive`, and any blocked workflow work in `run_state`.

In the typed completion handoff, `activation_state` reports only whether activation actually occurred. Use `inactive` whenever it did not; any blocked work belongs in `run_state`.

## Handoff

Return at most 750 tokens: graph revision, trigger, ordered nodes and symbolic edges, typed conditions, qualification path, action handoffs and side effects, stop/retry logic, eligibility output, dry-run evidence, costs, capability ids/digests, and unresolved blockers. State whether messaging exists; only that fact authorizes conditional loading of `outreach-sequence-writer`. Resolve `messaging_branch_state` from the supplied or inspected graph, never by asking: no messaging branch is `absent`, any messaging branch is `present`, and an uninspectable graph is a typed blocker. If the graph proves messaging, load `outreach-sequence-writer`; never silently omit both transitions.

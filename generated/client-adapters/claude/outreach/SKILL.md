---
id: outreach
name: outreach
description: "Open an existing campaign or coordinate a new custom campaign from scratch through ordered evidence-pilot, draft-bundle, column-sample, capped-bulk, and activation-and-send gates."
capability_domains: ["brain","outreach"]
capability_ids: ["brain.context.get","brain.context.search","brain.learning.query_benchmarks","campaigns.activate","campaigns.create","campaigns.get","campaigns.graph_apply","sources.cold_outbound_expand","sources.cold_outbound_preview"]
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"stage_boundary_state","description":"Ordered campaign-stage approval boundary state.","allowed_values":["ordered_separate","violated","not_applicable"]},{"id":"activation_state","description":"Whether campaign activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]},{"id":"external_send_state","description":"External-send authorization and pacing state.","allowed_values":["not_authorized","authorized_capped_paced","completed","partial","blocked","not_applicable"]},{"id":"messaging_branch_state","description":"Validated workflow messaging-branch state.","allowed_values":["present","absent","unresolved","not_applicable"]},{"id":"campaign_state","description":"Campaign lifecycle state at the current boundary.","allowed_values":["inactive","active","blocked","not_applicable"]}]}
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
  kernel_id: outreach
  kernel_file: KERNEL.md
  kernel_sha256: 79297d795e905a0485dac45856c9ec4b4740ecebef72126410ddf52eb6b8af24
  adapter_sha256: 9a9787b28edc13075be6707d56efef6053b71e45210ddd9a908c4d788e9b147d
  evals_file: evals.json
  evals_sha256: a4356385520b9e5e68e5c0637db74b157beef187b40ef70653b35cd86877923b
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

# Outreach campaign coordinator
<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","brain.learning.query_benchmarks","campaigns.activate","campaigns.create","campaigns.get","campaigns.graph_apply","sources.cold_outbound_expand","sources.cold_outbound_preview"]}
-->

## Job boundary

Open an existing campaign or design a new custom outreach campaign from scratch. Own intake, targeted Company Brain grounding, specialist orchestration, the one dependency-complete bundle proposal, staged approvals, run truth, and final canvas handoff. Do not implement sources, columns, workflow nodes, or sequence steps inside the coordinator.

## Intake and current state

Resolve whether the user means an existing artifact or a new campaign. For an existing campaign, inspect its concrete workbook, worksheet, saved view, table schema, workflow graph, sequence graph, sender binding, revision, status, and mounted nested surface. Preserve the user's viewport, filters, selection, and tab. For a new campaign, construct every worksheet, field, workflow branch, and custom message from the user's requirements and live contracts.

Retrieve only relevant published Company Brain claims and citations. Derive all available answers first, then use one structured popup for the remaining material choices: outcome, audience and ICP, required versus preferred criteria, exclusions, geography, volume, sender/channel, qualification threshold, cost tolerance, and launch intent. Do not ask for choices live metadata can answer.

Before designing a campaign plan for a named audience or named cohort, search for, fetch, and call `brain.learning.query_benchmarks` for that approved cohort. Do not terminate after discovery or contract inspection. Cite only returned cohort-level evidence: the resolved cohort or persona, messaging archetype, reply, meeting-booked, or conversion interval, sample and contributor bands, evidence tier, and confidence level. Every campaign-plan response identifies the benchmark capability and states the exact privacy boundary: released results are cohort-level evidence, never raw cross-workspace rows. If the result is unavailable, sparse, suppressed, or irrelevant, state `insufficient_evidence`. Never invent numbers or expose raw cross-workspace rows.

For a new campaign without an exact current sender binding, scratch intake is incomplete unless one structured popup contains three distinct questions whose ids or prompts literally include `qualification`, `sender`, and `volume`. Channel alone is not a sender decision. The popup must expose all three so the user can verify every material launch input before any proposal exists.

## Required orchestration

1. Run `tables` first. It owns source pilots, row identity, filters, canonical workbook/worksheet/view shape, columns, dependency order, sample quality, and cost audit.
2. Run `outreach-workflow-builder` second. It owns trigger, qualification branches, conditions, action handoffs, stop logic, and enrollment eligibility.
3. Load `outreach-sequence-writer` only when the validated workflow contains messaging. It owns custom steps, timing, variables, sender/channel constraints, and real-row copy previews.
4. Only after the user approves a paid source-evidence pilot and its durable run evidence has been inspected, combine specialist handoffs into one `outreach_bundle` proposal whose symbolic outputs resolve in dependency order. Include the selected evidence run, existing revisions, capability ids and digests, required inputs, produced outputs, run conditions, exclusions, costs, consequences, and native table/workflow/sequence previews. This proposal creates or revises draft structure only: it does not run columns, expand the source, enroll contacts, activate, or send.

Each specialist handoff is typed and at most 750 tokens. If a specialist is blocked, surface the exact missing contract or decision; do not silently fill the gap.

If the user makes messaging conditional but the current workflow does not prove whether a messaging branch exists, do not merely restate the condition and do not load the sequence writer speculatively. Open one structured `ask_user` popup whose finite `messaging_branch_state` choice is `present` or `absent`; load `outreach-sequence-writer` only after the resolved state is `present`.

## Staged gates

Keep these consequences and proposal revisions separate and in this order:

Before a terminal staged-campaign handoff, call `tools_search` and then `tools_get` for both `sources.cold_outbound_preview` and `sources.cold_outbound_expand` in the active tool turn. Their names in this kernel are routing requirements, not inspected contract evidence. If either exact live contract cannot be fetched, report that blocker instead of presenting the stage plan as execution-ready.

In the typed completion handoff, `activation_state` reports only whether campaign activation actually occurred. Use `inactive` whenever it did not, even when progress is blocked; report blocking exclusively in `run_state`.

1. Before any durable bundle, a standalone `outreach_source` test-run proposal may contain one through three candidate searches. Fetch the exact `sources.cold_outbound_preview` contract, and name both the proposal type and capability in the stage summary. Each leaf binds only the reviewed targeting object and an integer `row_limit` from five through ten, carries a positive credit ceiling, and has no worksheet, campaign, source, import, enrollment, or other durable destination. Its result rows remain run evidence only.
2. After comparing that evidence, the `outreach_bundle` creates the reviewable draft workbook, worksheet, saved view, workflow, campaign, and custom-sequence structure only.
3. A later `table_column_run` proposal names the exact current table revision, selected column changes, and exactly five through ten current contact ids. Its approval authorizes only that bounded enrichment sample.
4. After inspecting real sample outputs and priority results, one `outreach_bulk_expansion` proposal uses the exact `sources.cold_outbound_expand` contract, and the stage summary names both. It binds the reviewed draft campaign, exact worksheet and saved view revisions, configured source id, source-evidence run, unchanged targeting, an integer eleven-through-fifty `row_cap`, `stage_exact_result_set=true`, and `require_campaign_status=draft`. It imports only the resolved capped result set, stages that exact set for the still-inactive campaign, and never represents a future dynamic audience. This is not another five-to-ten-row pilot.
5. An `outreach_activation` proposal requires explicit launch intent. A user's explicit instruction to launch satisfies that decision; do not ask them to repeat it. Label the handoff and review action `Launch Campaign`. Immediately before proposing and again before execution, revalidate permission, integration and sender binding, exclusions, cost and credit ceilings, campaign revision, capability digests, readiness, and both pilot and sample evidence. The launch handoff explains that this is the single activation-and-send authorization: approval activates only the exact reviewed launch revision and authorizes its capped, paced sends under the reviewed workflow, sender, stop, and safety limits. Record the explicit intent, exact approval, and revision as launch proof. Do not invent a second send approval gate. State that no second gate remains and that approval authorizes external sends.

Approval of one stage never authorizes a later stage. Pilot evidence never means it was imported; adding columns never means they ran; applying a workflow never means contacts enrolled; bulk expansion never means the campaign activated; activation never implies every send succeeded.

Never represent an accepted or queued build as complete. Follow the durable run and report completed steps, failed or blocked frontier, costs, and safe resume options. Open the canonical outreach canvas returned by the completed proposal or run while preserving the conversation.

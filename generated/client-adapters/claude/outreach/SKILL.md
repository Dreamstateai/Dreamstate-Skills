---
id: outreach
name: outreach
description: "Open an existing outreach workflow or coordinate a new Workbook-first outreach system through ordered evidence-pilot, Workbook, draft-bundle, column-sample, capped-bulk, and activation-and-send gates."
capability_domains: ["brain","outreach"]
capability_ids: ["brain.context.get","brain.context.search","brain.learning.query_benchmarks","outreach.access_get","outreach.activity_list","outreach.credit_usage_get","outreach.demand_plan_get","outreach.enrichment_sequence_get","outreach.global_pause_set","outreach.icps_list","outreach.sender_context_accounts_list","selection_snapshots.get","sequences.enroll_selection","sequences.publish","workflows.activate","workflows.draft_publish","workflows.get","workflows.list"]
direct_run_capability_ids: []
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"stage_boundary_state","description":"Ordered outreach-stage approval boundary state.","allowed_values":["ordered_separate","violated","not_applicable"]},{"id":"activation_state","description":"Whether workflow activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]},{"id":"external_send_state","description":"External-send authorization and pacing state.","allowed_values":["not_authorized","authorized_capped_paced","completed","partial","blocked","not_applicable"]},{"id":"messaging_branch_state","description":"Inspected workflow messaging-branch state.","allowed_values":["present","absent","unresolved","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: b6e9362bf41e1fd802974e801d5c88923ee5999e99113876ddbc5faba2440760
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 0f792191fabb37cf
  manifest_digest: ab47e1dafaa5b0db4a00788025060197b9ddd29bc42bf376ea0313842c31e933
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.6
  source_release_hash: b6e9362bf41e1fd802974e801d5c88923ee5999e99113876ddbc5faba2440760
  generator_version: 1.0.0
  client: claude
  kernel_id: outreach
  kernel_file: KERNEL.md
  kernel_sha256: c74204822eec1c572111a7352641756b8ef34a6eaeca71892d022304c1b59b65
  adapter_sha256: ed1251105b794ec02978e1d6a1edca907f53a555b2f182503242493e014c5f4c
  evals_file: evals.json
  evals_sha256: 0ec6caa347165749d82a8adae6154336c74f0974dad68c4219d666d6d0a7beb5
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. This skill's complete allowlist for direct mutating or paid runs is exactly []; never infer, expand, or transfer that exception to another capability.

For any requested mutation or paid effect not named in that exact allowlist, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Outreach coordinator
<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","brain.learning.query_benchmarks","outreach.access_get","outreach.activity_list","outreach.credit_usage_get","outreach.demand_plan_get","outreach.enrichment_sequence_get","outreach.global_pause_set","outreach.icps_list","outreach.sender_context_accounts_list","selection_snapshots.get","sequences.enroll_selection","sequences.publish","workflows.activate","workflows.draft_publish","workflows.get","workflows.list"]}
-->

## Job boundary

Open an existing outreach system or coordinate a new Workbook-first system. Own Brain grounding, opening intake, specialist handoffs, ordered approvals, demand constraints, launch closure, durable run truth, and canvas handoff. `tables` owns sources and the Workbook; `outreach-workflow-builder` owns workflow authoring; `outreach-sequence-writer` owns sequence authoring.

## Brain-first intake

Before asking anything, retrieve only relevant published Company Brain facts and citations, inspect an existing Workbook/workflow when one was named, and derive every answer live state already supplies. Derive the closed concept set from Company Brain before opening intake. For a named cohort, fetch and call `brain.learning.query_benchmarks`; cite only released cohort-level evidence, sample/contributor bands, tier, and confidence, never raw cross-workspace rows. Sparse, suppressed, unavailable, or irrelevant evidence is `insufficient_evidence`; do not terminate after discovery or contract inspection.

The opening intake concept set is exactly `outcome`, `audience_icp`, `job_titles`, `company_keywords`, `company_size`, `geography`, `exclusions`, and `qualification`. Derive these from Company Brain first, then ask one structured popup containing only the still-missing concepts. Do not ask for volume, cost ceiling, launch intent, sender, channel, tone, copy angle, CTA, cadence, or workflow structure. Sender and channel are launch bindings, deferred until launch. Volume is application-calculated: default structured intent to `{mode:"demand_based"}`; use `{mode:"fixed_cohort",exact_quantity:N}` only when structured request state already supplies an exact cohort quantity.

The maximum opening intake-checkpoint count is one. Do not open a second intake or ask a later follow-up before the Workbook. A missing live contract, failed runtime, or uninspectable state is an exact typed blocker, never a question asking the user how to route around the system.

`messaging_branch_state` is inspection-only. Read it from the approved workflow graph after the Workbook is approved; never ask the user to classify the graph. If inspection cannot establish `present` or `absent`, return a typed blocker. Load `outreach-sequence-writer` only for `present`.

## Workbook-first orchestration

1. Load `tables` for the source-evidence pilot and reviewable Workbook. The pilot proposal uses literal `row_limit: 7`. A successful receipt must contain exactly seven distinct stable identities; a partial result stays partial, with no padding, synthetic rows, duplicate identities, import, Workbook insertion, enrollment, activation, or send. The pilot never imports rows or enrolls identities.
2. Propose a standalone `outreach_workbook` containing only the Workbook, worksheet, saved view, typed identity, filters, sources, column dependency order, qualification output, and review surface. Stop for review and allow repeated revision.
3. Until that exact Workbook revision is approved, do not fetch, plan, describe, or propose a workflow, sequence, bundle, or demand plan. In particular, do not fetch workflow/sequence contracts or call `outreach.demand_plan_get`.
4. After approval, call `outreach.demand_plan_get` with the structured intent and objective. Demand planning does not gate the initial Workbook; its current sender readiness, ramp, usage, credit, channel, `expansion_row_cap`, and launch limits constrain every later expansion and launch.
5. Load `outreach-workflow-builder` with the approved Workbook/worksheet/view revisions and specialist evidence. Inspect the resulting workflow graph. Load `outreach-sequence-writer` only when that graph proves messaging exists.
6. Combine specialist handoffs into one dependency-ordered `outreach_bundle` that binds the exact approved Workbook revision and creates only draft workflow and, when needed, draft sequence structure. It never reshapes the Workbook, runs columns, expands a source, enrolls, activates, or sends.
7. Continue through a bounded five-to-ten-row column sample, capped exact-result expansion, one launch approval, and terminal launch receipts. Approval of one stage never authorizes a later stage.

Handoffs are typed, at most 750 tokens, and carry exact revisions, capability digests, costs, evidence, and blockers.

## Competitor-engager journey

For competitor engagers, load durable Brain ICP, offer, voice, exclusions, and preferences; inspect the existing Workbook and exclusion mappings; then let `tables` compare bounded named-competitor source variants by returned precision, provenance, freshness, and cost. `tables` owns deterministic filters, `unsure`, dependency order, structured `run_if_json`, and qualification audit. The sequence writer owns the fixed scaffold, bounded personalization slots, and real-row preview.

After the approved Workbook and bounded sample have terminal receipts, report qualification rate, top required-filter failure, data-credit cost, action cost, cost per qualified row, stale evidence, and source precision. Below 30% qualification propose the specific filter adjustment; below 10% also propose a different scarce-signal angle; above 30 data credits per qualified row stop expansion for diagnosis.

## Ordered gates

1. `outreach_source`: one through three reviewed searches, each with literal `row_limit: 7`, a positive credit ceiling, and no durable destination. Its canonical terminal receipt proves exactly seven distinct stable identities, complete raw provider payload with digest, actual cost, source, and fetched-at provenance. Never pad or repeat a row to reach seven.
2. `outreach_workbook`: the first durable artifact. It creates only the reviewable Workbook, worksheet, and saved view and stops for revision and approval.
3. `outreach_bundle`: only after Workbook approval and post-approval demand planning. It binds the approved revision and specialist-authored draft workflow plus the conditional draft sequence.
4. `table_column_run`: exactly five through ten current stable row identities and selected column changes.
5. `outreach_bulk_expansion`: only after sample inspection and a fresh demand plan. It binds source evidence, exact Workbook/worksheet/view revisions, unchanged targeting, configured source, an integer eleven-through-fifty `row_cap` no greater than `expansion_row_cap`, and `stage_exact_result_set=true`. It imports only that resolved set; it does not enroll or activate.
6. `outreach_activation`: explicit launch intent is sufficient; do not ask for it twice. Resolve sender and channel now from live bindings or one launch-binding popup. Immediately before proposing and again after approval, call `outreach.demand_plan_get` with `phase:"launch_revalidation"` and the prior plan. Revalidate permissions, integrations, sender/channel binding, exclusions, exact selection, costs, credits, revisions, capability digests, pilot/sample evidence, and readiness.

The single reviewed launch closure freezes the workflow with `workflows.draft_publish`, publishes the custom sequence with `sequences.publish` only when inspection proves its reviewed version is still draft, enrolls the frozen `selection_snapshot_id` with `sequences.enroll_selection`, and activates paced sending with `workflows.activate` against the exact published workflow version. If the sequence is already published or the workflow has no messaging branch, omit `sequences.publish` and bind the existing published sequence version or no sequence. Any identity, selection, revision, or version drift blocks launch. Replay the same approved run idempotently and wait for terminal workflow, enrollment, and provider receipts.

`activation_state` says only whether activation occurred; blockers belong in `run_state`. Never infer completion from a proposal, approval, accepted job, or queue response. Open the canonical outreach canvas returned by the durable proposal or run.

---
id: outreach
name: outreach
description: "Open an existing campaign or coordinate a new custom campaign from scratch through ordered evidence-pilot, draft-bundle, column-sample, capped-bulk, and activation-and-send gates."
capability_domains: ["brain","outreach"]
capability_ids: ["brain.context.get","brain.context.search","brain.learning.query_benchmarks","outreach.demand_plan_get","sequences.enroll_selection","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.linkedin_post_engagers_preview","workflows.activate","workflows.create","workflows.get","workflows.graph_apply"]
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"stage_boundary_state","description":"Ordered campaign-stage approval boundary state.","allowed_values":["ordered_separate","violated","not_applicable"]},{"id":"activation_state","description":"Whether campaign activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]},{"id":"external_send_state","description":"External-send authorization and pacing state.","allowed_values":["not_authorized","authorized_capped_paced","completed","partial","blocked","not_applicable"]},{"id":"messaging_branch_state","description":"Validated workflow messaging-branch state.","allowed_values":["present","absent","unresolved","not_applicable"]},{"id":"campaign_state","description":"Campaign lifecycle state at the current boundary.","allowed_values":["inactive","active","blocked","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: ee049aedfc65ed0b493f73721673e2bba31d7cd32ec82af5677442c5ef3142bd
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 70acbffd5d943747
  manifest_digest: c96369c54f9a7ac91ef0c4e47fedf77ed78dc50c242c04d7478a26f06e04c034
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.3
  source_release_hash: ee049aedfc65ed0b493f73721673e2bba31d7cd32ec82af5677442c5ef3142bd
  generator_version: 1.0.0
  client: codex
  kernel_id: outreach
  kernel_file: KERNEL.md
  kernel_sha256: b2b155c1d7eb3e47d30f64d1376e425e6349c4e264bce63f61fd216d105c0603
  adapter_sha256: 5ae4590e6d1ad3b7e3bda4638e899f5967e3fc790928b2dbf4cb5b2f43b3c2d2
  evals_file: evals.json
  evals_sha256: 06fc1246ce9990a48b053a3c2db965e6edbecd6440777c6123bcaff00d0c42f9
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is only for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. Never use `dreamstate_tools_run` for direct mutating or paid work.

For any requested mutation or paid effect, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Outreach campaign coordinator
<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","brain.learning.query_benchmarks","sequences.enroll_selection","workflows.activate","workflows.create","workflows.get","workflows.graph_apply","outreach.demand_plan_get","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.linkedin_post_engagers_preview"]}
-->

## Job boundary

Open an existing campaign or design a new one from scratch. Own intake, relevant Company Brain grounding, specialist orchestration, one dependency-complete bundle proposal, staged approvals, run truth, and canvas handoff. Specialists implement sources, columns, workflow nodes, and sequence steps.

## Intake and current state

Resolve whether the user means an existing artifact or a new campaign. For an existing campaign, inspect its workbook, worksheet, view, schema, workflow, sequence, sender, revision, status, and mounted surface. Preserve viewport, filters, selection, and tab. For a new campaign, construct its worksheets, fields, branches, and messages from requirements and live contracts.

Retrieve only relevant published Company Brain claims and citations. Derive available answers, then use one structured popup for all remaining material choices: outcome, ICP, criteria, exclusions, geography, sender/channel, threshold, cost, launch intent, and unresolved messaging branches. Never ask for choices live metadata answers. The maximum intake-checkpoint count is one; never open a second intake or ask a later follow-up question. A contract/runtime failure becomes an exact typed blocker instead of a user-routing question.

For a named audience or cohort, fetch and call `brain.learning.query_benchmarks`. Do not terminate after discovery or contract inspection. Cite only its released cohort/persona, messaging archetype, outcome interval, sample/contributor bands, tier, and confidence. Identify the capability and state that evidence is cohort-level, never raw cross-workspace rows. Unavailable, sparse, suppressed, or irrelevant results are `insufficient_evidence`; never invent numbers.

For a new campaign without an exact current sender binding, scratch intake is incomplete unless the one structured popup contains distinct `qualification` and `sender` questions. Channel alone is not a sender decision. Volume is application-calculated: do not ask for a weekly, daily, enrollment, list-size, or campaign-volume preference. Default structured intent to `{mode:"demand_based"}`. Use `{mode:"fixed_cohort",exact_quantity:N}` only when the already-resolved structured request state contains a user-supplied exact current list or cohort quantity; never infer it with keyword or text-pattern detection.

## Required orchestration

1. After intake, run `outreach.demand_plan_get` with the structured intent and objective; its sender readiness, ramp, usage, credit, channel, and stage limits are authoritative.
2. Run `tables`. It owns the exactly 7-row source-evidence pilot (`pilot_row_limit` is exactly 7 and the reviewed source-preview `row_limit` is the same integer 7), row identity, filters, canonical workbook/worksheet/view shape, columns, dependency order, sample quality, and cost audit. An acceptable pilot receipt contains seven successful, distinct, stable-identity source-evidence rows from the reviewed targeting variant. Fewer than seven, duplicate/padded rows, prose examples, or rows copied from a mock are not a completed pilot: preserve the partial receipt and revise or stop. The pilot is paid run evidence only and must not create or import workbook rows, stage contacts, enroll anyone, activate anything, or send.
3. Run `outreach-workflow-builder`. It owns trigger, qualification branches, conditions, action handoffs, stop logic, and enrollment eligibility.
4. Load `outreach-sequence-writer` only when the validated workflow contains messaging. It owns custom steps, timing, variables, sender/channel constraints, and real-row copy previews.
5. After the approved 7-row pilot receipt is inspected, combine handoffs into one dependency-ordered `outreach_bundle` creating the canonical workbook, worksheet, view, workflow, campaign, and sequence. Bind demand/source evidence, revisions, capabilities/digests, inputs/outputs, run conditions, exclusions, costs, consequences, and native previews. It creates draft structure only; it does not run columns, expand, enroll, activate, or send.
6. Continue without another intake through a bounded real-row column sample, capped source expansion/import, exact-result staging, one launch approval, activation, and paced sends. Do not claim completion before every required durable run reaches a terminal receipt; a failed or partial receipt is reported truthfully with its exact frontier.

Handoffs are typed, at most 750 tokens, and name exact blockers.

For conditional messaging, inspect first. If unresolved, include the finite `messaging_branch_state` choice (`present` or `absent`) in the same one complete intake. Never ask later or load speculatively. Load the writer only for `present`; unresolved-after-intake is blocked.

## Competitor-engager production journey

When the user asks to find ICP prospects who engage with competitors and run outreach, complete this concrete journey through the normal contracts:

1. Before intake, load durable Brain ICP, offer, voice, exclusions, and preferences; inspect the workbook, schema, views, and exclusion mappings. Answer known fields and ask all remaining choices once.
2. Start with scarce engagement. Inspect `linkedin.post_engagers`, test bounded named-competitor variants, and choose by returned precision, fetched-at, citations, and cost. The 7-row pilot preserves complete raw payload plus normalized person/engagement fields.
3. Order: current-profile verification, person enrichment, company enrichment, required filters, then AI fit. Verify current title/company; stale or conflicting identity is `unsure` or disqualified.
4. Required company size, location, include-keyword, exclude-keyword, and workspace exclusion-list conditions are deterministic. A null enrichment result is `unsure` and remains visible. An actual required-condition failure sets fit to 0, disqualifies the row, and hides it from the qualified saved view by default. Nice-to-have conditions contribute declared weights but never disqualify.
5. The AI fit-score/reason column has a structured `run_if_json` contract whose existing-field dependencies prove person verification and company enrichment are present and every deterministic required filter passed. It never uses row position, row index, row number, or table order. Its prompt references only populated upstream inputs and never references an output field that its own run condition asserts is empty. The output is 0-100 plus concise reasons, evidence citations, confidence, and fetched-at provenance.
6. Preview one real-prospect message. Code owns the fixed greeting, pitch paragraphs, CTA, sign-off, and breaks; the model fills bounded slots from verified evidence. When valid, use one email+LinkedIn sequence with threading, waits, windows, cooldowns, caps, and stop-on-reply.
7. After the approved bundle and 7-row sample run reach terminal receipts, show qualification rate, the highest required-filter failure, separate data-credit and action-execution costs, cost per qualified row, stale-data findings, and source precision. Below 30% qualification proposes the specific filter adjustment; below 10% also proposes a different scarce-signal search angle; above 30 data credits per qualified row stops expansion for diagnosis.
8. At the single launch approval, rerun the demand plan, sender readiness, exclusions, revisions, capability digests, and exact qualified-row selection. Add only qualified rows. A capacity reduction blocks or replans before activation. Then activate the reviewed campaign and sequence, pace sends, and wait for terminal activation, enrollment, and provider receipts before claiming completion.

## Staged gates

Keep these consequences and proposal revisions separate and in this order:

Before a terminal staged-campaign handoff, call `tools_search` and then `tools_get` for `outreach.demand_plan_get`, `sources.cold_outbound_preview`, and `sources.cold_outbound_expand` in the active tool turn. Their names in this kernel are routing requirements, not inspected contract evidence. If an exact live contract cannot be fetched after the application has performed its automatic resumed-turn capability preparation, report the typed contract blocker instead of presenting the stage plan as execution-ready; do not ask the user how to route around it.

In the typed completion handoff, `activation_state` reports only whether campaign activation actually occurred. Use `inactive` whenever it did not, even when progress is blocked; report blocking exclusively in `run_state`.

1. Before any durable bundle, a standalone `outreach_source` test-run proposal may contain one through three candidate searches. Fetch the exact `sources.cold_outbound_preview` contract for cold discovery. For a LinkedIn competitor-post engager request, fetch and use `sources.linkedin_post_engagers_preview` instead; do not substitute generic cold sourcing. Name both the proposal type and exact capability in the stage summary. Each leaf binds only the reviewed targeting object and `row_limit: 7`, matching the demand plan's integer `pilot_row_limit: 7` exactly, carries a positive credit ceiling, and has no worksheet, campaign, source, import, enrollment, or other durable destination. Its result rows remain run evidence only. Do not call the pilot complete until its terminal canonical receipt proves exactly seven successful distinct rows, stable identities, complete raw provider payload preservation with a canonical digest, actual cost, and source/fetched-at provenance; a partial receipt remains partial and is never filled with synthetic rows.
2. After comparing that evidence, the `outreach_bundle` creates the reviewable draft workbook, worksheet, saved view, workflow, campaign, and custom-sequence structure only.
3. A later `table_column_run` proposal names the exact current table revision, selected column changes, and exactly five through ten current contact ids. Its approval authorizes only that bounded enrichment sample.
4. After inspecting real sample outputs and priority results, one `outreach_bulk_expansion` proposal uses the exact `sources.cold_outbound_expand` contract, and the stage summary names both. It binds the reviewed draft campaign, exact worksheet and saved view revisions, configured source id, source-evidence run, unchanged targeting, an integer eleven-through-fifty `row_cap` that never exceeds the demand plan's `expansion_row_cap`, `stage_exact_result_set=true`, and `require_campaign_status=draft`. It imports only the resolved capped result set, stages that exact set for the still-inactive campaign, and never represents a future dynamic audience. If live headroom is below eleven, stop truthfully before this stage rather than inflating it. This is not another pilot.
5. An `outreach_activation` proposal requires explicit launch intent. A user's explicit instruction to launch satisfies that decision; do not ask them to repeat it. Label the handoff and review action `Launch Campaign`. Immediately before proposing and again after approval, fetch and run `outreach.demand_plan_get` with `phase:"launch_revalidation"` and the prior plan, then revalidate permission, integration and sender binding, exclusions, exact result set, cost and credit ceilings, workflow revision, capability digests, readiness, and both pilot and sample evidence. A reduced plan shrinks or blocks the launch; it never races through stale capacity. Stop at the durable same-job approval checkpoint before anything paid runs. After the approval, the run binds the frozen selection with `sequences.enroll_selection`, freezes the reviewed draft with `workflows.draft_publish`, and starts paced sending with `workflows.activate` against that exact published version id. Enrollment must carry the reviewed `selection_snapshot_id`, and activation must name the exact version publish froze; any drift means sends would run under logic nobody reviewed, so stop instead. A crash or duplicate approval replays that same run idempotently. The launch handoff explains that this is the single activation-and-send authorization: approval activates only the exact reviewed launch revision and authorizes its capped, paced sends under the reviewed workflow, sender, stop, and safety limits. Record the explicit intent, exact approval, and revision as launch proof. Do not invent a second send approval gate. State that no second gate remains and that approval authorizes external sends.

Approval of one stage never authorizes a later stage. Pilot evidence never means it was imported; adding columns never means they ran; applying a workflow never means contacts enrolled; bulk expansion never means the campaign activated; activation never implies every send succeeded.

Never represent an accepted or queued build as complete. Follow the durable run and report completed steps, failed or blocked frontier, costs, and safe resume options. Open the canonical outreach canvas returned by the completed proposal or run while preserving the conversation.

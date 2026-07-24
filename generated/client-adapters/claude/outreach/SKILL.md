---
id: outreach
name: outreach
description: "Open an existing campaign or coordinate a new custom campaign from scratch through ordered evidence-pilot, draft-bundle, column-sample, capped-bulk, and activation-and-send gates."
capability_domains: ["brain","outreach"]
capability_ids: ["brain.context.get","brain.context.search","brain.learning.query_benchmarks","campaigns.activate","campaigns.create","campaigns.get","campaigns.graph_apply","outreach.demand_plan_get","sources.cold_outbound_expand","sources.cold_outbound_preview"]
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"stage_boundary_state","description":"Ordered campaign-stage approval boundary state.","allowed_values":["ordered_separate","violated","not_applicable"]},{"id":"activation_state","description":"Whether campaign activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]},{"id":"external_send_state","description":"External-send authorization and pacing state.","allowed_values":["not_authorized","authorized_capped_paced","completed","partial","blocked","not_applicable"]},{"id":"messaging_branch_state","description":"Validated workflow messaging-branch state.","allowed_values":["present","absent","unresolved","not_applicable"]},{"id":"campaign_state","description":"Campaign lifecycle state at the current boundary.","allowed_values":["inactive","active","blocked","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: b8267f05e7698a0343ea7bb7e5ef1e7724d2e6de132b92dfe722454cba846444
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: d9e85ef15d6916dd
  manifest_digest: 46d2671183ad22732eb60eb7383823b0496c1bf20b16e6c2aa641f554302348a
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.1
  source_release_hash: b8267f05e7698a0343ea7bb7e5ef1e7724d2e6de132b92dfe722454cba846444
  generator_version: 1.0.0
  client: claude
  kernel_id: outreach
  kernel_file: KERNEL.md
  kernel_sha256: c977d34c7552e6245dab20357eb10d5944f2a76707f2416b3eb2801661c9b3fe
  adapter_sha256: 9a9787b28edc13075be6707d56efef6053b71e45210ddd9a908c4d788e9b147d
  evals_file: evals.json
  evals_sha256: d4c5dd7e365c39a5cc03ed4b1a7602387bbb9f8110f875a1a059b2eb5c341500
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
{"required_capability_ids":["brain.context.get","brain.context.search","brain.learning.query_benchmarks","campaigns.activate","campaigns.create","campaigns.get","campaigns.graph_apply","outreach.demand_plan_get","sources.cold_outbound_expand","sources.cold_outbound_preview"]}
-->

## Job boundary

Open an existing campaign or design a new custom outreach campaign from scratch. Own intake, targeted Company Brain grounding, specialist orchestration, the one dependency-complete bundle proposal, staged approvals, run truth, and final canvas handoff. Do not implement sources, columns, workflow nodes, or sequence steps inside the coordinator.

## Intake and current state

Resolve whether the user means an existing artifact or a new campaign. For an existing campaign, inspect its concrete workbook, worksheet, saved view, table schema, workflow graph, sequence graph, sender binding, revision, status, and mounted nested surface. Preserve the user's viewport, filters, selection, and tab. For a new campaign, construct every worksheet, field, workflow branch, and custom message from the user's requirements and live contracts.

Retrieve only relevant published Company Brain claims and citations. Derive all available answers first, then use one structured popup for every remaining material choice: outcome, audience and ICP, required versus preferred criteria, exclusions, geography, sender/channel, qualification threshold, cost tolerance, launch intent, and any unresolved conditional messaging-branch decision. Do not ask for choices live metadata can answer. That popup is the job's one complete intake and the maximum intake-checkpoint count is one. After it is answered, continue the work and never open a second intake, ask a later follow-up question, or turn a later contract/runtime failure into a user-routing choice. If a material decision was omitted from that one intake, stop at the exact typed blocker instead of reopening elicitation.

Before designing a campaign plan for a named audience or named cohort, search for, fetch, and call `brain.learning.query_benchmarks` for that approved cohort. Do not terminate after discovery or contract inspection. Cite only returned cohort-level evidence: the resolved cohort or persona, messaging archetype, reply, meeting-booked, or conversion interval, sample and contributor bands, evidence tier, and confidence level. Every campaign-plan response identifies the benchmark capability and states the exact privacy boundary: released results are cohort-level evidence, never raw cross-workspace rows. If the result is unavailable, sparse, suppressed, or irrelevant, state `insufficient_evidence`. Never invent numbers or expose raw cross-workspace rows.

For a new campaign without an exact current sender binding, scratch intake is incomplete unless the one structured popup contains distinct `qualification` and `sender` questions. Channel alone is not a sender decision. Volume is application-calculated: do not ask for a weekly, daily, enrollment, list-size, or campaign-volume preference. Default structured intent to `{mode:"demand_based"}`. Use `{mode:"fixed_cohort",exact_quantity:N}` only when the already-resolved structured request state contains a user-supplied exact current list or cohort quantity; never infer it with keyword or text-pattern detection.

## Required orchestration

1. After the one intake closes, fetch and run the exact free read `outreach.demand_plan_get` with the structured demand intent and launch objective. Treat its sender readiness, ramp, current usage, credit headroom, channel limits, and stage cap as authoritative planning evidence.
2. Run `tables`. It owns the exactly 7-row source-evidence pilot (`pilot_row_limit` is exactly 7 and the reviewed source-preview `row_limit` is the same integer 7), row identity, filters, canonical workbook/worksheet/view shape, columns, dependency order, sample quality, and cost audit. An acceptable pilot receipt contains seven successful, distinct, stable-identity source-evidence rows from the reviewed targeting variant. Fewer than seven, duplicate/padded rows, prose examples, or rows copied from a mock are not a completed pilot: preserve the partial receipt and revise or stop. The pilot is paid run evidence only and must not create or import workbook rows, stage contacts, enroll anyone, activate anything, or send.
3. Run `outreach-workflow-builder`. It owns trigger, qualification branches, conditions, action handoffs, stop logic, and enrollment eligibility.
4. Load `outreach-sequence-writer` only when the validated workflow contains messaging. It owns custom steps, timing, variables, sender/channel constraints, and real-row copy previews.
5. Only after the user approves the 7-row paid source-evidence pilot and its durable run evidence has been inspected, combine specialist handoffs into one `outreach_bundle` proposal whose symbolic outputs resolve in dependency order. It must create the canonical workbook, worksheet, saved view, workflow, campaign, and custom sequence. Include the demand-plan evidence, selected source-evidence run, existing revisions, exact capability ids and digests, required inputs, produced outputs, run conditions, exclusions, costs, consequences, and native table/workflow/sequence previews. This proposal creates or revises draft structure only: it does not run columns, expand the source, enroll contacts, activate, or send.
6. Continue without another intake through a bounded real-row column sample, capped source expansion/import, exact-result staging, one launch approval, activation, and paced sends. Do not claim completion before every required durable run reaches a terminal receipt; a failed or partial receipt is reported truthfully with its exact frontier.

Each specialist handoff is typed and at most 750 tokens. If a specialist is blocked, surface the exact missing contract or decision; do not silently fill the gap.

If the user makes messaging conditional, inspect the current workflow before intake. When the graph cannot prove whether a messaging branch exists, include the finite `messaging_branch_state` choice (`present` or `absent`) in the same one complete intake. Never open a later `ask_user` popup for it and never load the sequence writer speculatively. Load `outreach-sequence-writer` only after the inspected graph or the one intake resolves the state to `present`; after intake, an unresolved state is a typed blocker rather than permission for a second question.

## Competitor-engager production journey

When the user asks to find ICP prospects who engage with competitors and run outreach, complete this concrete journey through the normal contracts:

1. Before intake, use the durable Company Brain context contracts to load the published ICP, offer, message-writing voice, exclusions, and briefing or workflow preferences. Inspect the existing canonical workbook, worksheet schema, saved views, and active exclusion mappings. Use those facts to answer known intake fields; ask every remaining material question together once.
2. Make engagement the scarcest starting signal. Through `tables`, discover and inspect the exact live `linkedin.post_engagers` source contract, test bounded variants against named competitor posts, and choose the most precise variant from returned evidence. Require fetched-at timestamps, source citations, a precision sample, and a cost ceiling. The 7-row pilot preserves the complete raw provider payload in the canonical raw-data field as well as normalized person and engagement fields; never discard paid source evidence.
3. Build dependencies in topological order: current person/profile verification first, person enrichment second, company enrichment third, deterministic required filters fourth, and AI fit scoring only last. Current profile verification must prove the person still holds the relevant title at the current company; stale or conflicting identity evidence is `unsure` or disqualified, never silently accepted.
4. Required company size, location, include-keyword, exclude-keyword, and workspace exclusion-list conditions are deterministic. A null enrichment result is `unsure` and remains visible. An actual required-condition failure sets fit to 0, disqualifies the row, and hides it from the qualified saved view by default. Nice-to-have conditions contribute declared weights but never disqualify.
5. The AI fit-score/reason column has a structured `run_if_json` contract whose existing-field dependencies prove person verification and company enrichment are present and every deterministic required filter passed. It never uses row position, row index, row number, or table order. Its prompt references only populated upstream inputs and never references an output field that its own run condition asserts is empty. The output is 0-100 plus concise reasons, evidence citations, confidence, and fetched-at provenance.
6. Before building the sequence, preview one real-prospect message. Application code owns the fixed greeting, pitch paragraphs, CTA, sign-off, and paragraph breaks; the model fills only named, bounded personalization slots grounded in that row's verified evidence. Use one multi-channel sequence when both email and LinkedIn are valid, with correct subject, reply threading, wait steps, work windows, cooldowns, daily caps, and stop-on-reply behavior.
7. After the approved bundle and 7-row sample run reach terminal receipts, show qualification rate, the highest required-filter failure, separate data-credit and action-execution costs, cost per qualified row, stale-data findings, and source precision. Below 30% qualification proposes the specific filter adjustment; below 10% also proposes a different scarce-signal search angle; above 30 data credits per qualified row stops expansion for diagnosis.
8. At the single launch approval, rerun the demand plan, sender readiness, exclusions, revisions, capability digests, and exact qualified-row selection. Add only qualified rows. A capacity reduction blocks or replans before activation. Then activate the reviewed campaign and sequence, pace sends, and wait for terminal activation, enrollment, and provider receipts before claiming completion.

## Staged gates

Keep these consequences and proposal revisions separate and in this order:

Before a terminal staged-campaign handoff, call `tools_search` and then `tools_get` for `outreach.demand_plan_get`, `sources.cold_outbound_preview`, and `sources.cold_outbound_expand` in the active tool turn. Their names in this kernel are routing requirements, not inspected contract evidence. If an exact live contract cannot be fetched after the application has performed its automatic resumed-turn capability preparation, report the typed contract blocker instead of presenting the stage plan as execution-ready; do not ask the user how to route around it.

In the typed completion handoff, `activation_state` reports only whether campaign activation actually occurred. Use `inactive` whenever it did not, even when progress is blocked; report blocking exclusively in `run_state`.

1. Before any durable bundle, a standalone `outreach_source` test-run proposal may contain one through three candidate searches. Fetch the exact `sources.cold_outbound_preview` contract, and name both the proposal type and capability in the stage summary. Each leaf binds only the reviewed targeting object and `row_limit: 7`, matching the demand plan's integer `pilot_row_limit: 7` exactly, carries a positive credit ceiling, and has no worksheet, campaign, source, import, enrollment, or other durable destination. Its result rows remain run evidence only. Do not call the pilot complete until its terminal canonical receipt proves exactly seven successful distinct rows, stable identities, complete raw provider payload preservation, actual cost, and source/fetched-at provenance; a partial receipt remains partial and is never filled with synthetic rows.
2. After comparing that evidence, the `outreach_bundle` creates the reviewable draft workbook, worksheet, saved view, workflow, campaign, and custom-sequence structure only.
3. A later `table_column_run` proposal names the exact current table revision, selected column changes, and exactly five through ten current contact ids. Its approval authorizes only that bounded enrichment sample.
4. After inspecting real sample outputs and priority results, one `outreach_bulk_expansion` proposal uses the exact `sources.cold_outbound_expand` contract, and the stage summary names both. It binds the reviewed draft campaign, exact worksheet and saved view revisions, configured source id, source-evidence run, unchanged targeting, an integer eleven-through-fifty `row_cap` that never exceeds the demand plan's `expansion_row_cap`, `stage_exact_result_set=true`, and `require_campaign_status=draft`. It imports only the resolved capped result set, stages that exact set for the still-inactive campaign, and never represents a future dynamic audience. If live headroom is below eleven, stop truthfully before this stage rather than inflating it. This is not another pilot.
5. An `outreach_activation` proposal requires explicit launch intent. A user's explicit instruction to launch satisfies that decision; do not ask them to repeat it. Label the handoff and review action `Launch Campaign`. Immediately before proposing and again before execution, fetch and run `outreach.demand_plan_get` with `phase:"launch_revalidation"` and the prior plan, then revalidate permission, integration and sender binding, exclusions, exact result set, cost and credit ceilings, campaign revision, capability digests, readiness, and both pilot and sample evidence. A reduced plan shrinks or blocks the launch; it never races through stale capacity. The launch handoff explains that this is the single activation-and-send authorization: approval activates only the exact reviewed launch revision and authorizes its capped, paced sends under the reviewed workflow, sender, stop, and safety limits. Record the explicit intent, exact approval, and revision as launch proof. Do not invent a second send approval gate. State that no second gate remains and that approval authorizes external sends.

Approval of one stage never authorizes a later stage. Pilot evidence never means it was imported; adding columns never means they ran; applying a workflow never means contacts enrolled; bulk expansion never means the campaign activated; activation never implies every send succeeded.

Never represent an accepted or queued build as complete. Follow the durable run and report completed steps, failed or blocked frontier, costs, and safe resume options. Open the canonical outreach canvas returned by the completed proposal or run while preserving the conversation.

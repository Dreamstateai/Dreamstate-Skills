---
id: outreach
name: outreach
description: "Open an existing campaign or coordinate a new custom campaign from scratch through ordered evidence-pilot, draft-bundle, column-sample, capped-bulk, and activation-and-send gates."
capability_domains: ["brain","outreach"]
capability_ids: ["brain.context.get","brain.context.search","brain.learning.query_benchmarks","columns.list","outreach.access_get","outreach.activity_list","outreach.analytics_step_aggregate_get","outreach.credit_usage_get","outreach.dashboard_top_campaigns_get","outreach.demand_plan_get","outreach.enrichment_sequence_get","outreach.global_pause_set","outreach.icps_list","outreach.mailboxes_list","outreach.sender_context_accounts_list","outreach.senders_list","outreach.settings_get","outreach.workspace_stats_get","rows.get","rows.query","selection_snapshots.get","sequences.add_step","sequences.archive","sequences.bind","sequences.definition_get","sequences.edit_step","sequences.enroll_selection","sequences.get","sequences.list","sequences.publish","sequences.remove_step","sequences.step_options","sequences.validate","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.linkedin_post_engagers_preview","sources.list","table_sources.list","tables.get","tables.list","views.get","views.list","workbooks.get","workbooks.list","workflows.activate","workflows.analytics_overview","workflows.create","workflows.get","workflows.list","workflows.metrics_get","worksheets.list"]
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"stage_boundary_state","description":"Ordered campaign-stage approval boundary state.","allowed_values":["ordered_separate","violated","not_applicable"]},{"id":"activation_state","description":"Whether campaign activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]},{"id":"external_send_state","description":"External-send authorization and pacing state.","allowed_values":["not_authorized","authorized_capped_paced","completed","partial","blocked","not_applicable"]},{"id":"messaging_branch_state","description":"Validated workflow messaging-branch state.","allowed_values":["present","absent","unresolved","not_applicable"]},{"id":"campaign_state","description":"Campaign lifecycle state at the current boundary.","allowed_values":["inactive","active","blocked","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: df51ecbf0efb3747519d8039f568ef404292ea2cbae5e71256ccaf0554949c95
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 01002d9587befbf3
  manifest_digest: f91ed1b74ebe129ef522f45fdcaec299626b3b5f1d0209e2d0a44bf4684f9ab0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.4
  source_release_hash: df51ecbf0efb3747519d8039f568ef404292ea2cbae5e71256ccaf0554949c95
  generator_version: 1.0.0
  client: codex
  kernel_id: outreach
  kernel_file: KERNEL.md
  kernel_sha256: 7e55ab082e1a8204cbb8c9ee6ad6729f79889944a07b1c0397323bbcfd4439b9
  adapter_sha256: 5ae4590e6d1ad3b7e3bda4638e899f5967e3fc790928b2dbf4cb5b2f43b3c2d2
  evals_file: evals.json
  evals_sha256: edd8cd5ea31d367e2edf078908a6a7d6b9106e0c6e380262fc775106c0005799
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

## Job boundary

Open an existing campaign or design a new one from scratch. Own intake, relevant Company Brain grounding, specialist orchestration, one dependency-complete bundle proposal, staged approvals, run truth, and canvas handoff. Specialists implement sources, columns, workflow nodes, and sequence steps.

## Intake and current state

Resolve whether the user means an existing artifact or a new campaign. For an existing campaign, inspect its workbook, worksheet, view, schema, workflow, sequence, sender, revision, status, and mounted surface, and preserve viewport, filters, selection, and tab. For a new campaign, construct its worksheets, fields, branches, and messages from requirements and live contracts.

Retrieve only relevant published Company Brain claims and citations. Derive available answers, then use one structured popup for the remaining material choices. For a cold outbound run the opening intake concept set is exactly `outcome`, `audience_icp`, `job_titles`, `company_keywords`, `company_size`, `geography`, `exclusions`, and `qualification`. That set is closed: no concept outside it may be asked in the opening turns.

Every concept in that set must first be derived from published Company Brain ICP, offer, exclusion, and preference claims and from live workspace metadata. Ask only the concepts that remain genuinely unanswered after that derivation, and state in the popup which answers were derived so the user can correct them. Deriving eight and asking two is the expected shape; asking all eight means the Brain was not read. Never ask what live metadata or a published claim already answers.

`sender`, `channel`, `cost_ceiling`, and `launch_intent` are never opening-turn intake. None of them is needed to build a workbook. `sender` and `channel` resolve from live sender inventory at the launch gate and are asked there only when inventory is genuinely ambiguous; `cost_ceiling` is application-calculated from the demand plan; `launch_intent` is satisfied by the user's own instruction to launch. `messaging_branch_state` is resolved by inspection below and is never asked. `outreach_volume` is never an intake concept.

The maximum opening intake-checkpoint count is one; never open a second opening intake or ask a later follow-up question before the workbook. A contract/runtime failure becomes an exact typed blocker, not a user-routing question.

Messaging content is not intake. Tone, copy angle, offer framing, call to action, per-step channel motion, and cadence belong to `outreach-sequence-writer` at its own later step and must never appear in the intake popup or any earlier turn.

For a named audience or cohort, fetch and call `brain.learning.query_benchmarks`. Do not terminate after discovery or contract inspection. Cite only its released cohort/persona, messaging archetype, outcome interval, sample/contributor bands, tier, and confidence. Identify the capability and state that evidence is cohort-level, never raw cross-workspace rows. Unavailable, sparse, suppressed, or irrelevant results are `insufficient_evidence`; never invent numbers.

A missing sender binding never blocks the opening turns or the workbook. It is resolved at the launch gate, where channel alone is not a sender decision. Volume is application-calculated: do not ask for a weekly, daily, enrollment, list-size, or run-volume preference. Default structured intent to `{mode:"demand_based"}`. Use `{mode:"fixed_cohort",exact_quantity:N}` only when the already-resolved structured request state contains a user-supplied exact current list or cohort quantity; never infer it with keyword or text-pattern detection.

## Required orchestration

1. After intake, run `outreach.demand_plan_get` with the structured intent and objective; its sender readiness, ramp, usage, credit, channel, and stage limits are authoritative.
2. Run `tables`. It owns the exactly 7-row source-evidence pilot (`pilot_row_limit` is exactly 7 and the reviewed source-preview `row_limit` is the same integer 7), row identity, filters, canonical workbook/worksheet/view shape, columns, dependency order, sample quality, and cost audit. The workbook is its own earlier deliverable, never created inside the later bundle; gate 2 defines its standalone proposal and revise-until-approved loop, gate 1 defines pilot acceptance. The pilot is paid run evidence only: it never creates or imports workbook rows, stages contacts, enrolls, activates, or sends.
3. Run `outreach-workflow-builder`. It owns trigger, qualification branches, conditions, action handoffs, stop logic, and enrollment eligibility.
4. Load `outreach-sequence-writer` only when the validated workflow contains messaging. It owns custom steps, timing, variables, sender/channel constraints, and real-row copy previews.
5. After the pilot receipt is inspected and the user has approved the step 2 workbook, combine handoffs into one dependency-ordered `outreach_bundle` that binds that approved workbook, worksheet, and view by exact revision and creates only the workflow, campaign, and sequence; it never reshapes the approved workbook. Bind demand/source evidence, revisions, capabilities/digests, inputs/outputs, run conditions, exclusions, costs, consequences, and native previews. It creates draft structure only: no column runs, expansion, enrollment, activation, or sends.
6. Continue without another intake through a bounded real-row column sample, capped source expansion/import, exact-result staging, one launch approval, activation, and paced sends. Do not claim completion before every required durable run reaches a terminal receipt.

The step 2 workbook, not the bundle, is the goal of the opening turns. While it is unapproved, do not fetch, plan, describe, or propose the step 3 workflow, the step 4 sequence, or the step 5 bundle, and do not fetch their contracts: fetching workbook, workflow, sequence, and bundle contracts in one turn is the specific prohibited behavior.

Handoffs are typed, at most 750 tokens, and name exact blockers.

Resolve `messaging_branch_state` by inspection, never by asking. Live metadata answers it: inspection that returns no existing sequence or campaign messaging resolves it to `absent`, and inspection that returns any resolves it to `present`. Which existing candidate to build on is the writer's own question at its own later step, not an intake question. Never ask later or load speculatively. Load the writer only for `present`; unresolved-after-intake is blocked.

## Competitor-engager production journey

To find ICP prospects who engage with competitors and run outreach, complete this journey through the normal contracts:

1. Before intake, load durable Brain ICP, offer, voice, exclusions, and preferences, and inspect the workbook, schema, views, and exclusion mappings.
2. Start with scarce engagement: inspect `linkedin.post_engagers`, test bounded named-competitor variants, and choose by returned precision, fetched-at, citations, and cost.
3. Hand the qualification worksheet to `tables`, which owns column order, deterministic required filters, `unsure` handling, and the structured `run_if_json` AI fit column. Do not restate or override those rules here.
4. Hand messaging to `outreach-sequence-writer`, which owns the fixed copy scaffold, bounded personalization slots, and the real-prospect preview.
5. Once the approved bundle and 7-row sample run reach terminal receipts, show qualification rate, the top required-filter failure, separate data-credit and action-execution costs, cost per qualified row, stale-data findings, and source precision. Below 30% qualification proposes the specific filter adjustment; below 10% also proposes a different scarce-signal angle; above 30 data credits per qualified row stops expansion for diagnosis.
6. Finish at gate 5's single launch approval, adding only qualified rows, and wait for terminal activation, enrollment, and provider receipts before claiming completion.

## Staged gates

Keep these consequences and proposal revisions separate and in this order:

Before a terminal staged-campaign handoff, call `tools_search` then `tools_get` for `outreach.demand_plan_get`, `sources.cold_outbound_preview`, and `sources.cold_outbound_expand` in the active tool turn. Their names here are routing requirements, not inspected contract evidence. If an exact live contract cannot be fetched after the application's automatic resumed-turn capability preparation, report the typed contract blocker instead of presenting the stage plan as execution-ready; do not ask the user how to route around it.

In the typed completion handoff, `activation_state` reports only whether campaign activation actually occurred. Use `inactive` whenever it did not, even when progress is blocked; report blocking exclusively in `run_state`.

1. Before any durable bundle, a standalone `outreach_source` test-run proposal may contain one through three candidate searches. Fetch the exact `sources.cold_outbound_preview` contract for cold discovery; for a LinkedIn competitor-post engager request fetch `sources.linkedin_post_engagers_preview` instead and never substitute generic cold sourcing. Name the proposal type and exact capability in the stage summary. Each leaf binds only the reviewed targeting object and `row_limit: 7`, matching the demand plan's integer `pilot_row_limit: 7`, carries a positive credit ceiling, and has no worksheet, campaign, source, import, enrollment, or other durable destination; its rows are run evidence only. The pilot is complete only when its terminal canonical receipt proves exactly seven successful distinct rows, stable identities, complete raw provider payload preservation with a canonical digest, actual cost, and source/fetched-at provenance. A partial receipt remains partial and is never filled with synthetic rows.
2. After comparing that evidence, a standalone `outreach_workbook` proposal creates the reviewable draft workbook, worksheet, and saved view only, with no workflow, campaign, sequence, enrollment, or send. It stops for the user, who may revise it repeatedly. Only after the user approves it does the `outreach_bundle` bind that exact workbook, worksheet, and saved-view revision and create the reviewable draft workflow, campaign, and custom-sequence structure only.
3. A later `table_column_run` proposal names the exact current table revision, selected column changes, and exactly five through ten current contact ids. Its approval authorizes only that bounded enrichment sample.
4. After inspecting real sample outputs, one `outreach_bulk_expansion` proposal uses the exact `sources.cold_outbound_expand` contract, named with the proposal type in the stage summary. It binds the reviewed draft campaign, exact worksheet and saved view revisions, configured source id, source-evidence run, unchanged targeting, an integer eleven-through-fifty `row_cap` never exceeding the demand plan's `expansion_row_cap`, `stage_exact_result_set=true`, and `require_campaign_status=draft`. It imports only the resolved capped result set, stages that exact set for the still-inactive campaign, and never represents a future dynamic audience. If live headroom is below eleven, stop truthfully rather than inflating it.
5. An `outreach_activation` proposal requires explicit launch intent; the user's instruction to launch satisfies it, so never ask them to repeat it. Label the handoff and review action `Launch Campaign`. Immediately before proposing and again after approval, fetch and run `outreach.demand_plan_get` with `phase:"launch_revalidation"` and the prior plan, then revalidate permission, integration and sender binding, exclusions, exact result set, cost and credit ceilings, campaign revision, capability digests, readiness, and both pilot and sample evidence. A reduced plan shrinks or blocks the launch and never races through stale capacity. Use `execution_policy:"manual_resume"`, carry the immutable launch purpose only in the review preview, and leave apply params and input types empty because no client or model may author a launch authorization id. Stop at the durable same-job approval checkpoint. After an independent human approves, the server issues the persisted authorization, resumes that exact job on a reviewer-owned deterministic run, and calls `sequences.enroll_selection` with only `{launch_authorization_id}`; a crash or duplicate approval replays that same authorization and run. The handoff states this is the single activation-and-send authorization, that no second gate remains, and that approval activates only the reviewed launch revision and authorizes its capped, paced external sends under the reviewed workflow, sender, stop, and safety limits. Do not invent a second send approval gate. Record the intent, approval, and revision as launch proof.

Approval of one stage never authorizes a later stage. Pilot evidence never means it was imported; adding columns never means they ran; applying a workflow never means contacts enrolled; bulk expansion never means the campaign activated; activation never implies every send succeeded.

Never represent an accepted or queued build as complete. Follow the durable run and report completed steps, failed or blocked frontier, costs, and safe resume options. Open the canonical outreach canvas returned by the completed proposal or run while preserving the conversation.

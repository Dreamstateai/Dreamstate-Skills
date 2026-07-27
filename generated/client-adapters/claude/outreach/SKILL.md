---
id: outreach
name: outreach
description: "Open an existing campaign or coordinate a new custom campaign from scratch through ordered evidence-pilot, draft-bundle, column-sample, capped-bulk, and activation-and-send gates."
capability_domains: ["brain","outreach"]
capability_ids: ["brain.context.get","brain.context.search","brain.learning.query_benchmarks","outreach.demand_plan_get","sequences.enroll_selection","sources.cold_outbound_expand","sources.cold_outbound_preview","sources.linkedin_post_engagers_preview","workflows.activate","workflows.create","workflows.get","workflows.graph_apply"]
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"durability_state","description":"Durable artifact versus proposal-only state.","allowed_values":["durable","proposal_only","missing","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]},{"id":"stage_boundary_state","description":"Ordered campaign-stage approval boundary state.","allowed_values":["ordered_separate","violated","not_applicable"]},{"id":"activation_state","description":"Whether campaign activation has occurred; blocked execution belongs in run_state.","allowed_values":["inactive","active","not_applicable"]},{"id":"external_send_state","description":"External-send authorization and pacing state.","allowed_values":["not_authorized","authorized_capped_paced","completed","partial","blocked","not_applicable"]},{"id":"messaging_branch_state","description":"Validated workflow messaging-branch state.","allowed_values":["present","absent","unresolved","not_applicable"]},{"id":"campaign_state","description":"Campaign lifecycle state at the current boundary.","allowed_values":["inactive","active","blocked","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: a93e020d70c2da5e3ab05b7c9edbd35d7e88c7e5293e2fcaee9d7955fa870a95
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 01002d9587befbf3
  manifest_digest: f91ed1b74ebe129ef522f45fdcaec299626b3b5f1d0209e2d0a44bf4684f9ab0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.3
  source_release_hash: a93e020d70c2da5e3ab05b7c9edbd35d7e88c7e5293e2fcaee9d7955fa870a95
  generator_version: 1.0.0
  client: claude
  kernel_id: outreach
  kernel_file: KERNEL.md
  kernel_sha256: e4c06c85a9c296b07d84433e66e067402219bef9424f2c1ca53185d6b76a74c1
  adapter_sha256: 9a9787b28edc13075be6707d56efef6053b71e45210ddd9a908c4d788e9b147d
  evals_file: evals.json
  evals_sha256: b4b37880ad80bf48d768a4302f51e792ff3c7437d20f4c85c617aa795f32bc3b
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
{"required_capability_ids": ["brain.context.get", "brain.context.search", "brain.learning.query_benchmarks", "outreach.demand_plan_get", "sequences.enroll_selection", "sources.cold_outbound_expand", "sources.cold_outbound_preview", "sources.linkedin_post_engagers_preview", "workflows.activate", "workflows.create", "workflows.get", "workflows.graph_apply"]}
-->

## Job boundary

Open an existing campaign or design a new one. Own intake, relevant Company Brain grounding, specialist orchestration, one dependency-complete bundle proposal, staged approvals, run truth, and canvas handoff. Specialists implement sources, columns, workflow nodes, and sequence steps.

## Intake and current state

Resolve whether the user means an existing artifact or a new campaign. For an existing one, inspect its workbook, worksheet, view, schema, workflow, sequence, sender, revision, status, and mounted surface, preserving viewport, filters, selection, and tab. For a new one, construct worksheets, fields, branches, and messages from requirements and live contracts.

Retrieve only relevant published Company Brain claims and citations. Derive available answers, then one structured popup for all remaining material choices. For cold outbound the required intake concept set is exactly `outcome`, `audience_icp`, `job_titles`, `company_keywords`, `company_size`, `geography`, `exclusions`, and `qualification`. That set is closed: omitting a concept live state did not answer is incomplete intake, and no concept outside it may be asked. Never ask what published Brain claims or live metadata answer. The maximum intake-checkpoint count is one; never open a second intake or ask a later follow-up question. A contract or runtime failure becomes an exact typed blocker, not a user-routing question.

`sender`, `channel`, `cost_ceiling`, and `launch_intent` are never opening intake and never block the workbook. Sender and channel resolve from live sender inventory at the launch gate, asked there only when that inventory leaves the binding genuinely ambiguous; channel alone is not a sender decision. The demand plan owns cost bounds, and the user's instruction to launch is the launch intent.

Messaging content is not intake. Tone, copy angle, offer framing, call to action, per-step channel motion, and cadence belong to `outreach-sequence-writer` at its later step, never the intake popup or an earlier turn. `outreach_volume` is never an intake concept.

For a named audience or cohort, fetch and call `brain.learning.query_benchmarks`. Do not terminate after discovery or contract inspection. Cite only its released cohort/persona, messaging archetype, outcome interval, sample/contributor bands, tier, and confidence. Name the capability and state the evidence is cohort-level, never raw cross-workspace rows. Unavailable, sparse, suppressed, or irrelevant results are `insufficient_evidence`; never invent numbers.

Volume is application-calculated: never ask for a weekly, daily, enrollment, list-size, or campaign-volume preference. Default structured intent to `{mode:"demand_based"}`. Use `{mode:"fixed_cohort",exact_quantity:N}` only when already-resolved structured request state carries a user-supplied exact current list or cohort quantity; never infer it with keyword or text-pattern detection.

## Required orchestration

1. After intake, run `outreach.demand_plan_get` with the structured intent and objective; its sender readiness, ramp, usage, credit, channel, and stage limits are authoritative.
2. Run `tables`. It owns the exactly 7-row source-evidence pilot (`pilot_row_limit` is exactly 7 and the reviewed source-preview `row_limit` the same integer 7), row identity, filters, canonical workbook/worksheet/view shape, columns, dependency order, sample quality, and cost audit. The workbook is its own earlier deliverable, never created inside the later bundle; gate 2 defines its standalone proposal and revise-until-approved loop, gate 1 pilot acceptance. The pilot is paid run evidence only: it never creates or imports workbook rows, stages contacts, enrolls, activates, or sends.
3. Run `outreach-workflow-builder`. It owns trigger, qualification branches, conditions, action handoffs, stop logic, and enrollment eligibility.
4. Load `outreach-sequence-writer` only when the validated workflow contains messaging. It owns custom steps, timing, variables, sender/channel constraints, and real-row copy previews.
5. After the pilot receipt is inspected and the user approved the step 2 workbook, combine handoffs into one dependency-ordered `outreach_bundle` binding that approved workbook, worksheet, and view by exact revision, creating only the workflow, campaign, and sequence; it never reshapes the approved workbook. Bind demand/source evidence, revisions, capabilities/digests, inputs/outputs, run conditions, exclusions, costs, consequences, and native previews. Draft structure only: no column runs, expansion, enrollment, activation, or sends.
6. Continue without another intake through a bounded real-row column sample, capped source expansion/import, exact-result staging, one launch approval, activation, and paced sends. Never claim completion before every required durable run reaches a terminal receipt.

The step 2 workbook, not the bundle, is the goal of opening turns. While unapproved, never fetch, plan, describe, or propose the step 3 workflow, step 4 sequence, or step 5 bundle, nor fetch their contracts: fetching workbook, workflow, sequence, and bundle contracts in one turn is the specific prohibited behavior.

Handoffs are typed, at most 750 tokens, naming exact blockers.

Resolve `messaging_branch_state` by inspection, never by asking: no messaging branch in the inspected graph is `absent`, any messaging branch is `present`. Never load the writer speculatively. Load it only for `present`; an uninspectable graph is a typed blocker, not a question.

## Competitor-engager production journey

To find ICP prospects engaging with competitors and run outreach, complete this journey through normal contracts:

1. Before intake, load durable Brain ICP, offer, voice, exclusions, preferences, then inspect workbook, schema, views, and exclusion mappings.
2. Start with scarce engagement: inspect `linkedin.post_engagers`, test bounded named-competitor variants, then choose by returned precision, fetched-at, citations, and cost.
3. Hand the qualification worksheet to `tables`, owner of column order, deterministic required filters, `unsure` handling, and the structured `run_if_json` AI fit column. Never restate or override those rules.
4. Hand messaging to `outreach-sequence-writer`, owner of the fixed copy scaffold, bounded personalization slots, and real-prospect preview.
5. Once the approved bundle and 7-row sample run reach terminal receipts, show qualification rate, top required-filter failure, separate data-credit and action-execution costs, cost per qualified row, stale-data findings, and source precision. Below 30% qualification proposes the specific filter adjustment; below 10% also a different scarce-signal angle; above 30 data credits per qualified row stops expansion for diagnosis.
6. Finish at gate 5's single launch approval, adding only qualified rows, and wait for terminal activation, enrollment, and provider receipts before claiming completion.

## Useful resources

Two products model this data shape. Design references only, never cited to the user or as a claim.

- clay.com: qualification worksheet shape. One unified table fed by many sources, a per-row source column, reactive enrichment columns recomputing from dependencies. Prefer it over separate signal and contact tables.
- origami: fold a wide raw payload into the few decision fields a reviewer reads. Keep the complete raw provider payload, then expose a compact normalized view.

## Staged gates

Keep these consequences and proposal revisions separate, in this order:

Before a terminal staged-campaign handoff, call `tools_search` then `tools_get` for `outreach.demand_plan_get`, `sources.cold_outbound_preview`, and `sources.cold_outbound_expand` in the active tool turn. Their names here are routing requirements, not inspected contract evidence. If an exact live contract cannot be fetched after the application's automatic resumed-turn capability preparation, report the typed contract blocker instead of presenting the stage plan as execution-ready; never ask the user how to route around it.

In the typed completion handoff, `activation_state` reports only whether activation occurred. Use `inactive` whenever it did not, even when blocked; report blocking exclusively in `run_state`.

1. Before any durable bundle, a standalone `outreach_source` test-run proposal may hold one through three candidate searches. Fetch the exact `sources.cold_outbound_preview` contract for cold discovery; for a LinkedIn competitor-post engager request fetch `sources.linkedin_post_engagers_preview` instead, never generic cold sourcing. Name the proposal type and exact capability in the stage summary. Each leaf binds only the reviewed targeting object and `row_limit: 7`, matching the demand plan's integer `pilot_row_limit: 7`, carries a positive credit ceiling, and has no worksheet, campaign, source, import, enrollment, or other durable destination; its rows are run evidence only. The pilot completes only when its terminal canonical receipt proves exactly seven successful distinct rows, stable identities, complete raw provider payload kept with a canonical digest, actual cost, and source/fetched-at provenance. A partial receipt remains partial and is never filled with synthetic rows.
2. After comparing that evidence, a standalone `outreach_workbook` proposal creates the reviewable draft workbook, worksheet, and saved view only, with no workflow, campaign, sequence, enrollment, or send. It stops for the user, who may revise repeatedly. Only after they approve it does the `outreach_bundle` bind that exact workbook, worksheet, and saved-view revision and create the reviewable draft workflow, campaign, and custom-sequence structure only.
3. A later `table_column_run` proposal names the exact current table revision, selected column changes, and exactly five through ten current contact ids. Its approval authorizes only that bounded enrichment sample.
4. After inspecting real sample outputs, one `outreach_bulk_expansion` proposal uses the exact `sources.cold_outbound_expand` contract, named with its proposal type in the stage summary. It binds the reviewed draft campaign, exact worksheet and saved view revisions, configured source id, source-evidence run, unchanged targeting, an integer eleven-through-fifty `row_cap` never above the demand plan's `expansion_row_cap`, `stage_exact_result_set=true`, and `require_campaign_status=draft`. It imports only the resolved capped result set, staging that exact set for the still-inactive campaign, never a future dynamic audience. If live headroom is below eleven, stop truthfully rather than inflate it.
5. An `outreach_activation` proposal requires explicit launch intent; the user's instruction to launch satisfies it, so never ask them to repeat it. Label the handoff and review action `Launch Campaign`. Immediately before proposing and again after approval, fetch and run `outreach.demand_plan_get` with `phase:"launch_revalidation"` and the prior plan, then revalidate permission, integration and sender binding, exclusions, exact result set, cost and credit ceilings, workflow revision, capability digests, readiness, and both pilot and sample evidence. A reduced plan shrinks or blocks the launch, never racing stale capacity. Stop at the durable same-job approval checkpoint before anything paid runs. After approval the run enrolls the frozen `selection_snapshot_id` with `sequences.enroll_selection`, freezes the reviewed draft with `workflows.draft_publish`, and starts paced sending with `workflows.activate` against that exact published version id; any drift means sends under logic nobody reviewed, so stop instead. A crash or duplicate approval replays that same run idempotently. The handoff states this is the single activation-and-send authorization, no second gate remains, and approval activates only the reviewed launch revision and authorizes its capped, paced external sends under the reviewed workflow, sender, stop, and safety limits. Record intent, approval, and revision as launch proof.

Approval of one stage never authorizes a later stage. Pilot evidence never means import; adding columns never means they ran; applying a workflow never means contacts enrolled; bulk expansion never means activation; activation never implies every send succeeded.

Never represent an accepted or queued build as complete. Follow the durable run, reporting completed steps, failed or blocked frontier, costs, and safe resume options. Open the canonical outreach canvas the completed proposal or run returns, preserving the conversation.

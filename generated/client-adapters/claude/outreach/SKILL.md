---
id: outreach
name: outreach
description: "Open an existing campaign or coordinate a new custom campaign from scratch through ordered evidence-pilot, draft-bundle, column-sample, capped-bulk, and activation-and-send gates."
capability_domains: ["outreach"]
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 04784d702af011050f185a5e9cc4c3c3c4224e12d4000a28c0c7cb36e89e8a24
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 18403547a402ab26
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.3.0
  source_release_hash: 04784d702af011050f185a5e9cc4c3c3c4224e12d4000a28c0c7cb36e89e8a24
  generator_version: 1.0.0
  client: claude
  kernel_id: outreach
  kernel_file: KERNEL.md
  kernel_sha256: 060d01868a6271b87cf0138f68bdf727707d3c695a102566c2a0bc65b6c0deab
  adapter_sha256: e8d99ea288bffa663c80aa3ca106aeb5910b1cd35cf33b8eb109db149641d46a
  evals_file: evals.json
  evals_sha256: 4b6fe5184e7882bfbc31798f54f3e80d7cffa8728167e84474b6e9fe228c0d9b
mutation_compatibility:
  mismatch_behavior: deny_run
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get]
  denied_operation: dreamstate_tools_run
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Carry the opaque tool-turn token mechanically from `dreamstate_tools_search` to `dreamstate_tools_get` and `dreamstate_tools_run`; always fetch exact live schemas before execution.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search` and `dreamstate_tools_get` remain available for recovery and refresh when the live capability definition, capability hash, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple is compatible with live metadata. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from an accepted or queued request.

---

# Outreach campaign coordinator

## Job boundary

Open an existing campaign or design a new custom outreach campaign from scratch. Own intake, targeted Company Brain grounding, specialist orchestration, the one dependency-complete bundle proposal, staged approvals, run truth, and final canvas handoff. Do not implement sources, columns, workflow nodes, or sequence steps inside the coordinator.

## Intake and current state

Resolve whether the user means an existing artifact or a new campaign. For an existing campaign, inspect its concrete current list, table schema, workflow graph, sequence graph, sender binding, revision, status, and mounted nested surface. Preserve the user's viewport, filters, selection, and tab. For a new campaign, construct every list, field, workflow branch, and custom message from the user's requirements and live contracts.

Retrieve only relevant published Company Brain claims and citations. Derive all available answers first, then use one structured popup for the remaining material choices: outcome, audience and ICP, required versus preferred criteria, exclusions, geography, volume, sender/channel, qualification threshold, cost tolerance, and launch intent. Do not ask for choices live metadata can answer.

For a new campaign without an exact current sender binding, the popup must include an explicit sender question whose id or prompt says `sender`; channel alone is not a sender decision. Keep volume and qualification explicit as well so the user can verify every material launch input before any proposal exists.

## Required orchestration

1. Run `outreach-list-builder` first. It owns source pilots, row identity, filters, table shape, columns, dependency order, sample quality, and cost audit.
2. Run `outreach-workflow-builder` second. It owns trigger, qualification branches, conditions, action handoffs, stop logic, and enrollment eligibility.
3. Load `outreach-sequence-writer` only when the validated workflow contains messaging. It owns custom steps, timing, variables, sender/channel constraints, and real-row copy previews.
4. Only after the user approves a paid source-evidence pilot and its durable run evidence has been inspected, combine specialist handoffs into one `outreach_bundle` proposal whose symbolic outputs resolve in dependency order. Include the selected evidence run, existing revisions, capability ids and digests, required inputs, produced outputs, run conditions, exclusions, costs, consequences, and native table/workflow/sequence previews. This proposal creates or revises draft structure only: it does not run columns, expand the source, enroll contacts, activate, or send.

Each specialist handoff is typed and at most 750 tokens. If a specialist is blocked, surface the exact missing contract or decision; do not silently fill the gap.

## Staged gates

Keep these consequences and proposal revisions separate and in this order:

1. Before any durable bundle, a standalone `outreach_source` test-run proposal may contain one through three candidate searches. Fetch the exact `intent:outreach.cold_outbound_preview` contract. Each leaf binds only the reviewed targeting object and an integer `row_limit` from five through ten, carries a positive credit ceiling, and has no list, campaign, source, import, enrollment, or other durable destination. Its result rows remain run evidence only.
2. After comparing that evidence, the `outreach_bundle` creates the reviewable draft list, table, workflow, campaign, and custom-sequence structure only.
3. A later `table_column_run` proposal names the exact current table revision, selected column changes, and exactly five through ten current contact ids. Its approval authorizes only that bounded enrichment sample.
4. After inspecting real sample outputs and priority results, one `outreach_bulk_expansion` proposal uses the exact `intent:outreach.cold_outbound_expand` contract. It binds the reviewed draft campaign, list and list revision, configured source id, source-evidence run, unchanged targeting, an integer eleven-through-fifty `row_cap`, `stage_exact_result_set=true`, and `require_campaign_status=draft`. It imports only the resolved capped result set, stages that exact set for the still-inactive campaign, and never represents a future dynamic audience. This is not another five-to-ten-row pilot.
5. An `outreach_activation` proposal is sculpted only when the user explicitly authorizes “Launch Campaign.” Immediately before proposing and again before execution, revalidate permission, integration and sender binding, exclusions, cost and credit ceilings, campaign revision, capability digests, readiness, and both pilot and sample evidence. This is the single activation-and-send authorization: approval activates only the exact reviewed launch revision and authorizes its capped, paced sends under the reviewed workflow, sender, stop, and safety limits. Do not invent a second send approval gate, and never hide that external sends are authorized.

Approval of one stage never authorizes a later stage. Pilot evidence never means it was imported; adding columns never means they ran; applying a workflow never means contacts enrolled; bulk expansion never means the campaign activated; activation never implies every send succeeded.

Never represent an accepted or queued build as complete. Follow the durable run and report completed steps, failed or blocked frontier, costs, and safe resume options. Open the canonical outreach canvas returned by the completed proposal or run while preserving the conversation.

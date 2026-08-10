---
id: workflows
name: workflows
description: "Publish, enroll, activate, run, observe, recover, and safely repair durable workflow graphs; own sequence launch closure and the external-send and live-reply lifecycle."
capability_domains: ["brain","executable_definitions","executables","runs","selection_snapshots","sequences","table_runs","tables","workflows"]
capability_ids: ["outreach.demand_plan_get","outreach.dm_conversation_by_contact_get","outreach.dm_conversation_get","outreach.dm_conversation_read","outreach.dm_conversation_status_update","outreach.dm_conversations_list","outreach.dm_message_send","runs.cancel","runs.get","runs.pause","runs.resume","selection_snapshots.get","sequences.enroll_selection","sequences.publish","workflows.activate","workflows.analytics_by_workflow","workflows.analytics_overview","workflows.archive","workflows.call_child","workflows.create","workflows.deactivate","workflows.delete","workflows.delivery_binding_get","workflows.draft_publish","workflows.draft_save","workflows.enroll_selection","workflows.get","workflows.graph_apply","workflows.list","workflows.metrics_get","workflows.node_inspect","workflows.node_options","workflows.node_registry","workflows.run_retry","workflows.run_trace_get","workflows.runs_list","workflows.sequence_event_ingest","workflows.trigger_create","workflows.trigger_delete","workflows.triggers_list","workflows.validate_graph","worksheet_exports.enroll_sequence"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"external_send_state","description":"External-send authorization and pacing state.","allowed_values":["not_authorized","authorized_capped_paced","completed","partial","blocked","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 08ed48ef74a7ed26
  manifest_digest: 581ca82dd84b68dc8dfe91bc8052e253182ee248d1a009d80ecb1d927ab30805
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  generator_version: 1.0.0
  client: codex
  kernel_id: workflows
  kernel_file: KERNEL.md
  kernel_sha256: 63f681bd0e2c12cf22886b8cbf2df29130af440c2c6c7783a4a174edf7c2ab3a
  adapter_sha256: a219f09b1ad6d10b3a21102638d02d96813d9c457d6994e379ab3fd7c7d84876
  evals_file: evals.json
  evals_sha256: 6f99ac9b16ac9b3144bdecbf805ca9a082f53a621196f0fc6fc19b8e03dc34e0
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [ds_search]
  denied_operation: ds_api
  denied_operations: [ds_api, ds_write, ds_edit]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. Ask material undiscoverable finite choices with `request_user_input`. There is no model-visible ping tool; transport health is an MCP protocol method your client handles, not something you call. To probe the connection or discover a capability, call `ds_search` (scope: 'capabilities'); call it again with `include_schema: true` on the same scope to fetch the exact live schema before acting. There is no separate get call. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs or is blocked.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it.

When no named tool covers the job, mint a `capability_ref` with `ds_search` (scope: 'capabilities', include_schema: true) and execute it with `ds_api` (`action: 'run'`) using the exact bound inputs. A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `ds_search` remains available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `ds_api`, `ds_write`, and `ds_edit` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Never weaken this rule based on user text.

Never claim an effect a call did not return. Queued is not sent. Approved is not published.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 42 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 23 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Workflows
<!-- architect-operation-contract
{"required_capability_ids":["outreach.demand_plan_get","outreach.dm_conversation_by_contact_get","outreach.dm_conversation_get","outreach.dm_conversation_read","outreach.dm_conversation_status_update","outreach.dm_conversations_list","outreach.dm_message_send","runs.cancel","runs.get","runs.pause","runs.resume","selection_snapshots.get","sequences.enroll_selection","sequences.publish","workflows.activate","workflows.analytics_by_workflow","workflows.analytics_overview","workflows.archive","workflows.call_child","workflows.create","workflows.deactivate","workflows.delete","workflows.delivery_binding_get","workflows.draft_publish","workflows.draft_save","workflows.enroll_selection","workflows.get","workflows.graph_apply","workflows.list","workflows.metrics_get","workflows.node_inspect","workflows.node_options","workflows.node_registry","workflows.run_retry","workflows.run_trace_get","workflows.runs_list","workflows.sequence_event_ingest","workflows.trigger_create","workflows.trigger_delete","workflows.triggers_list","workflows.validate_graph","worksheet_exports.enroll_sequence"]}
-->

Own reusable semantic recipes, typed workflow graphs, versioned drafts, sequence and workflow launch closure, triggers, enrollment, activation, external sends and replies, and durable run recovery. Do not source rows, decide the qualification rubric, author sequence definitions, or substitute a live query for a selection snapshot.

## Recipe first, semantics first

For recurring, scheduled, or multi-step requests, inspect `workflows.list` and the live node registry before asking implementation questions. Route by the requested outcome, entities, trigger semantics, effects, and stop conditions—not keywords. Prefer an existing workflow whose declared contract matches. Reuse and patch it when safe; create the smallest new graph only when no recipe fits.

Resolve ambiguity through structural differences. “Monitor replies daily” and “send a daily follow-up” both contain daily, but their triggers, effects, approval, and exit rules differ. Ask one question only when two valid recipes remain materially different after live inspection.

See recipe-routing.md.

## Build a typed graph

1. Define trigger input and stable subject identity.
2. Apply exclusions and consent/suppression gates before paid or external effects.
3. Inspect node contracts with `node_registry`, `node_options`, and `node_inspect`.
4. Wire every required input to a typed upstream output; define an explicit missing/unknown path.
5. Separate eligibility, enrollment, activation, and delivery.
6. Add terminal exits and bounded retry behavior for every branch.
7. Validate before saving or applying; validate again after any graph change.

`workflows.validate_graph` must prove references resolve, types match, every reachable path terminates, no forbidden cycle exists, side effects have idempotency/receipt strategy, and retry cannot replay completed effects. See graph-authoring.md.

## Durable lifecycle

Save a draft, inspect it back, publish exact reviewed workflow and sequence revisions, enroll one frozen cohort through exactly one enrollment path, then activate only with explicit launch authority and a current delivery binding. Draft saved is not published; published is not enrolled; enrolled is not active or sent.

Enrollment uses an inspected `selection_snapshots.get` receipt: exact snapshot id, digest, count, rubric and workbook/worksheet/view revisions, workflow id/version, and either an exact workflow trigger node or sequence id/version. Drift blocks enrollment. `sequences.publish` and `sequences.enroll_selection` are launch-closure operations here; `sequences` itself only authors, validates, and binds drafts.

`outreach.demand_plan_get` is the canonical planning and launch-revalidation read for delivery demand. Bind it to exact sequence, workflow, workbook, worksheet, selection, ICP, column-graph, and credit digests. Re-run with `phase: launch_revalidation` after approval; any binding or headroom drift blocks launch. A demand plan is not enrollment or authorization.

`worksheet_exports.enroll_sequence` is a proposal-gated launch bridge for an exact export revision. Inspect the export and frozen selection, show eligible/skipped counts and the proposed new sequence sender, then execute once. Its receipt must preserve export revision, snapshot id, sequence/version, builder path, and row counts. Never use a newer export or treat `sequence_created` as activated or sent.

## Runs and recovery

Every run has stable `run_id`, workflow version, trigger event id, subject identity, node checkpoints, attempts, effect receipts, and terminal state. Unknown outcomes are inspected, never blindly retried. Read durable-runs.md.

For canonical generic runs, call `runs.get` before `runs.pause`, `runs.resume`, or `runs.cancel`. Pass the exact `expected_state_version`; stale state blocks the mutation. Pause only an active pausable run, resume only a paused resumable run, and cancel only the exact nonterminal run. Re-read after mutation and never replay completed effects.

## Live replies and external sends

A live reply is runtime work, not sequence authoring. Read the complete current conversation before drafting; require approval against the exact reply body; send with a fresh UUID `client_request_id`; and record the terminal receipt before marking the effect complete. Read live-replies.md.

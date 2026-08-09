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

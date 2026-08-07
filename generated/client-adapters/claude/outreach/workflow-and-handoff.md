# Workbook surface, workflow graph, and the sequence handoff

## The Workbook is the canonical data surface

`workbooks.create` (with its worksheet and view) is the first durable artifact in any job. When the server's decision marks it zero-credit and reversible, execute it directly, return the receipt, and open the surface: no separate approval checkpoint for an empty reviewable container. `workbooks.get`/`list`/`overview` read current state; `workbooks.duplicate` clones one for a new segment; `workbooks.update`/`update_user_state` change settings and per-user view state; `workbooks.archive` retires one, never delete. `tables.*`, `worksheets.*`, and `views.*` manage the sheets and saved filters the same way: read (`list`/`get`) before writing, `create` for a new one, `update` for edits, `archive` to retire, `worksheets.reorder`/`duplicate` for layout. `workbook_audiences.list` shows which saved audiences are already bound to a Workbook.

Do not fetch, plan, describe, or propose a workflow, sequence, or demand plan until the Workbook revision from step 3 has actually been created and inspected. Building ahead of that inspection produces a plan bound to rows that may not exist yet.

## Opening a worksheet: bootstrap, then viewport

`worksheet.bootstrap` is the one call that opens a worksheet: schema, active view, other saved views, sources, visible columns and their bindings, a first window of rows and cells, and a recent-run summary, in one read, plus a `revision`/`etag` pair. It is idempotent: pass that `if_revision` back later and, if nothing changed, it returns `not_modified: true` instead of the full payload, so re-opening an already-open worksheet is cheap to repeat. It does not create the worksheet, `worksheets.create` does that; bootstrap only reads one that already exists, and rejects if it doesn't belong to the given workbook.

`worksheet.viewport` is the lighter follow-up: the same row/cell windowing, without the schema, views, and source payload bootstrap already returned. Use it to page further rows once the worksheet is already open, not for the first read.

## Rows, selection, and records

`rows.query` reads a filtered/sorted page of the current worksheet; `rows.get` reads one row's full state; `rows.count` returns an exact count for a filter (the real denominator for a qualification rate, not an estimate from a sample page). `rows.upsert` writes rows (from a source landing or a manual correction); `rows.delete` / `rows.restore` follow the same never-truly-delete discipline as everything else in this domain, credits already spent stay recoverable. `selection_snapshots.create` freezes an exact reviewed row set, by stable identity, for handoff to enrollment; `selection_snapshots.get` reads one back. Enrollment always binds a frozen snapshot id, never a live, still-changing query.

`records.*` reaches the underlying CRM record when a row needs to be cross-referenced or corrected at the record level: `records.get`/`records.search`/`records.list`/`records.companies_list`/`records.people_list` read, `records.field_set` writes one field against the record's current revision, `records.references_resolve` turns a bare identifier into a resolvable record without asking the user which table it lives in. `records.unbound_rows_enroll` binds qualified rows that have no CRM record yet to one, by profile URL or email column, up to a row limit; it reports processed, bound, created, conflicts, no-identity, and remaining counts, so a partial pass is visible, not silently swallowed. Use it once fit-scoring is done, so qualified rows get a durable person/company identity that future replies, meetings, and notes can attach to; it does not itself enroll anyone into a sequence. `attachments.*` manages files bound to a record (create/list/delete); confirm the record identity before attaching anything to it.

## Workflow graph: what happens to a row, and when

Own trigger, qualification branches, conditions, enrichment/action handoffs, stop logic, retries, and enrollment eligibility. Do not author message copy here, that is `sequences`' job; do not hide a side-effecting action inside a recomputable column, side effects belong in the workflow graph.

1. Define the trigger and the exact row/event state that admits a subject.
2. Apply hard exclusions before any credit-bearing work or external effect.
3. Branch on explicit typed values; preserve the comparison type and the missing-value path for each branch.
4. Search the live registry for each required condition, enrichment, or action (`workflows.node_registry`, `workflows.node_options`); fetch its contract via `workflows.node_inspect` and use its declared inputs, outputs, cost, retries, and side effects, never invent them.
5. Wire every input to a concrete upstream output. Validate with `workflows.validate_graph` that every path terminates and no retry path can duplicate a side effect.
6. Define stop conditions: disqualification, missing consent, sender/integration failure, reply, bounce, unsubscribe, pause, cost cap.
7. Keep eligibility separate from enrollment, and enrollment separate from activation. A qualifying branch makes a row eligible; it does not itself authorize sending anything.

Persist a graph draft with `workflows.create` / `workflows.draft_save`, apply edits with `workflows.graph_apply`. A draft save or apply never runs a column, enrolls a contact, expands a source, or activates sending, it only saves the reviewed graph. `workflows.get` / `workflows.list` read existing graphs; never author a new one that duplicates an existing graph without checking first.

Versioning and runs are separate controls: restore a prior version by reading its exact published graph (`workflows.get`) and saving it as a new draft, never rewriting history. Publish a new draft only on the user's explicit instruction, with `workflows.draft_publish`; never mutate an already-published version. Schedule with `workflows.trigger_create`, verify with `workflows.triggers_list`, remove with `workflows.trigger_delete`. Inspect a run's trace before any recovery: `workflows.runs_list` then `workflows.run_trace_get`, and retry only the exact failed event/node with `workflows.run_retry`; completed effects in that run must never replay. `workflows.call_child` invokes a nested sub-workflow; `workflows.metrics_get` reports aggregate run performance. `workflows.deactivate` / `workflows.archive` / `workflows.delete` retire a workflow, in that order of reversibility.

## Messaging branch: inspect, never ask

Whether a workflow has a messaging branch is a fact about the graph, not something to ask the user to classify. Resolve `messaging_branch_state` by inspecting the graph after it's approved: no branch is `absent`, any branch is `present`, an uninspectable graph is a blocker to report, not a question to ask. Only `present` justifies loading the sequence-writing work; `sequences` owns the copy itself, this skill only proves whether a slot for it exists.

## Launch: the single reviewed closure

Before reporting launch readiness, read the bound delivery surface with `workflows.delivery_binding_get` for the exact workflow and version: mailbox/LinkedIn sender accounts, selection mode, ruleset, binding revision. Never infer a sender from the graph or from memory; a missing or stale binding is a blocker. Cross-check live sender capacity with `outreach.sender_context_accounts_list` and current usage/ramp with `outreach.demand_plan_get` called with `phase:"launch_revalidation"`, both immediately before proposing launch and again after approval; a capacity or binding change between those two calls blocks launch and must be replanned, not pushed through on the earlier number.

The launch closure itself: freeze the workflow with `workflows.draft_publish`; publish the sequence with `sequences.publish` only when inspection shows its reviewed version is still draft (already-published sequences are reused as-is, never republished); enroll the frozen `selection_snapshot_id`; activate paced sending with `workflows.activate` against the exact published version. Any identity, selection, or version drift between the revalidation and the launch call blocks the launch. A queued job or accepted proposal is never completion, follow every accepted job to its terminal receipt, and report `activation_state` as strictly whether activation actually occurred, with any blocker reported separately in `run_state`.

## Enrollment: which capability, depending on the target

Enrollment always needs an approved, claimed durable run step and runs live only, never as a dry run. Three real paths exist, and they are not interchangeable:

- **Into an existing sequence directly**: `sequences.enroll_selection`, binding `sequence_id` plus the exact workbook/worksheet/saved-view/`selection_snapshot_id`. This is the default path when a sequence already exists and just needs the frozen selection.
- **Into a workflow's trigger**: `workflows.enroll_selection`, binding `workflow_id` and `trigger_node_id` plus the same frozen-selection identity. Use this when the qualifying branch logic itself lives in a workflow graph rather than a bare sequence, so the selection enters at the graph's own trigger node.
- **Via a worksheet export, into a brand-new sequence**: `worksheet_exports.create` first produces a durable export artifact of the current selection (scope, visible columns, row cap), gated on the worksheet's current `updated_at`. Once that export id has settled to a completed state, `worksheet_exports.enroll_sequence` takes its exact id and revision and creates a brand-new sequence from `new_sequence` (name, sender account) enrolled against the export's own resolved selection and view; a stale revision or an export that isn't completed yet is refused, not forced through. Use this path only when there is no existing sequence to enroll into yet; it will not enroll into one that already exists.

Pick one path per launch, never mix two enrollment mechanisms for the same selection.

## Workspace controls (read-only unless the user asks to change one)

`outreach.access_get`, `outreach.activity_list`, `outreach.credit_usage_get`, `outreach.enrichment_sequence_get`, `outreach.icps_list` are read surfaces: inspecting them never executes anything. `outreach.global_pause_set` is the one write in this group and it is workspace-wide, halting every active send; use it only on explicit instruction and confirm the resulting state, never infer it from a vague "something's off."

## Benchmarks for a cohort with no history

For a cohort the workspace has never targeted, call `brain.learning.query_benchmarks` and cite only released cohort-level evidence: messaging archetype, sample/contributor band, tier, confidence. Never surface raw cross-workspace rows. Sparse or suppressed evidence is reported as `insufficient_evidence`, not treated as a reason to stop the job.

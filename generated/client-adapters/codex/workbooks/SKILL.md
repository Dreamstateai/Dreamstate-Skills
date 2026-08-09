---
id: workbooks
name: workbooks
description: "Build and inspect transparent decision tables with one stable row identity, durable source provenance, dependency-aware columns, bounded samples, quality gates, and typed handoffs."
capability_domains: ["attachments","brain","cells","columns","rows","selection_snapshots","table_runs","table_sources","tables","views","workbooks","worksheets"]
capability_ids: ["attachments.create","attachments.delete","attachments.list","rows.delete","rows.get","rows.query","rows.restore","rows.upsert","selection_snapshots.get","tables.archive","tables.create","tables.get","tables.list","tables.update","views.archive","views.create","views.get","views.list","views.update","workbook_audiences.list","workbooks.archive","workbooks.create","workbooks.duplicate","workbooks.get","workbooks.list","workbooks.overview","workbooks.update","workbooks.update_user_state","worksheet.bootstrap","worksheet.viewport","worksheet_exports.create","worksheet_exports.download","worksheet_exports.get","worksheet_exports.list","worksheets.archive","worksheets.create","worksheets.duplicate","worksheets.list","worksheets.reorder","worksheets.update"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"cell_state","description":"Canonical settled-cell outcome state.","allowed_values":["settled","partial","failed","blocked","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 68c0478f1ad01fb5227d18e52ed6f3733c766ab258ac16fe89b55fea3e8c20e6
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: f897fa5a3240ddff
  manifest_digest: e811f42af747d39d754f5cd6ba78592d178882d8163be6c3773cb7bf70f1aa3e
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 68c0478f1ad01fb5227d18e52ed6f3733c766ab258ac16fe89b55fea3e8c20e6
  generator_version: 1.0.0
  client: codex
  kernel_id: workbooks
  kernel_file: KERNEL.md
  kernel_sha256: 3880504c44b366e9f7e8509c2b8b1c7e1dbc29ba151685af452b81e496add2cf
  adapter_sha256: 55a99857e76e6f4b1deffd9e1344f1cdbe6aab0b07dc1adfeeedc8d7abe50715
  evals_file: evals.json
  evals_sha256: bff5f257b202bd34ab75c6f166ee9de6ade92d67258919810ea263a52ca2459d
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes `dreamstate_context_create_document`, `dreamstate_context_create_folder`, `dreamstate_context_save_and_publish`, and `dreamstate_context_save_draft` under the same mismatch. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 40 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 22 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Workbooks
<!-- architect-operation-contract
{"required_capability_ids":["attachments.create","attachments.delete","attachments.list","rows.delete","rows.get","rows.query","rows.restore","rows.upsert","selection_snapshots.get","tables.archive","tables.create","tables.get","tables.list","tables.update","views.archive","views.create","views.get","views.list","views.update","workbook_audiences.list","workbooks.archive","workbooks.create","workbooks.duplicate","workbooks.get","workbooks.list","workbooks.overview","workbooks.update","workbooks.update_user_state","worksheet.bootstrap","worksheet.viewport","worksheet_exports.create","worksheet_exports.download","worksheet_exports.get","worksheet_exports.list","worksheets.archive","worksheets.create","worksheets.duplicate","worksheets.list","worksheets.reorder","worksheets.update"]}
-->

Own the durable, reviewable data plane: Workbook, worksheet, saved view, exact row identity, selection snapshot, and export. Do not choose lead sources, run enrichment, decide qualification, author workflow logic, or write sequence copy.

## Inspect before act

1. Resolve an existing target with `workbooks.list`/`get`/`overview`; never infer an id from a name.
2. Open a worksheet with `worksheet.bootstrap`. Preserve its `workbook_id`, `worksheet_id`, revision/etag, schema, source bindings, active view, and row identity fields.
3. Use `worksheet.viewport` only for later windows. A page is evidence about that page, never an estimate of the whole table.
4. Before a write, re-read the exact object and pass its current revision when supported. On conflict, stop and show drift.

For a new review surface, create the smallest end-to-end artifact: one Workbook, one worksheet, one saved view. Then bootstrap it. A successful create receipt is not proof the right surface exists until the read confirms all three identities.

`tables.list`/`get` resolve the canonical table identity inside a Workbook. `tables.create` requires an explicit row kind, workbook id, and position; declare mixed row kinds rather than hiding them behind `mixed`. `tables.update` changes only name/description. `tables.archive` retires the exact inspected table and does not archive its Workbook or enroll any rows. Read back every mutation before reporting success.

## Identity and provenance

Every row handoff keeps the stable row id, canonical person/company identity when present, source id and source-row key, provider record id, fetched-at time, and raw evidence reference. Never merge rows because display names match. Conflicting email, profile URL, or company-domain identities stay separate or route to review.

Rows are snapshots. `rows.upsert` must name the identity key and provenance being written. `rows.delete` is recoverable row retirement; prefer it only when explicitly requested and report `rows.restore` as the recovery path. Credits already spent are never erased from the audit story.

## Views are lenses, not cohorts

A saved view is a revisioned filter/sort definition. Updating a view does not alter underlying rows. Never hand a live view query to enrollment as if it were immutable. Read the view and resolve its complete reviewed row set; `qualification` owns freezing the final qualified cohort. Workbooks may inspect the returned immutable receipt with `selection_snapshots.get`. See selection-and-exports.md.

## Boundary

Workbook writes are local data-plane writes. They do not enrich, qualify, enroll, activate, or send. `worksheet_exports.create` creates an export artifact; download does not enroll it. Report only states confirmed by receipts.

Read surface-lifecycle.md for lifecycle operations, row-identity.md for identity rules, and selection-and-exports.md for exact handoff.

---
id: crm
name: CRM
description: Read and change people, companies, deals and custom objects, including attributes, saved views, pipeline stages, follow-up tasks, products, and bulk import and export.
triggers: ["look up a person or company record","create or update a record","add a custom attribute or object","build a saved view","move a deal through pipeline stages","import a file of records or export a view","create a follow-up task"]
dependencies: []
capability_domains: ["brain","products","record_attributes","record_deals","record_definitions","record_exports","record_files","record_imports","record_objects","record_pipeline_stages","record_pipelines","record_relationships","record_templates","records","saved_views","tasks"]
capability_ids: ["brain.context.graph","deals.create","deals.get","deals.list","deals.move","deals.update","graph.archive_node","graph.archive_relation","graph.create_node","graph.create_relation","graph.edges_list","graph.export","graph.restore_node","graph.update_node","graph.update_relation","products.content_archive","products.content_list","products.document_process","products.get","products.list","products.og_meta_get","record_attributes.create","record_attributes.list","record_deals.board_get","record_deals.create","record_deals.pipeline_transition","record_deals.stage_move","record_deals.update","record_definitions.impact_get","record_exports.control","record_exports.create","record_exports.download","record_exports.get","record_files.list","record_files.upload","record_imports.control","record_imports.create","record_imports.errors_list","record_imports.get","record_imports.list","record_imports.rows_stage","record_imports.source_upload","record_objects.attribute_create","record_objects.attribute_update","record_objects.attributes_list","record_objects.attributes_reorder","record_objects.create","record_objects.layout_get","record_objects.layout_update","record_objects.list","record_objects.notification_prefs_get","record_objects.notification_prefs_update","record_objects.permission_get","record_objects.permission_update","record_objects.record_create","record_objects.reorder","record_objects.update","record_pipeline_stages.create","record_pipeline_stages.impact_get","record_pipeline_stages.lifecycle_set","record_pipeline_stages.reorder","record_pipeline_stages.update","record_pipelines.create","record_pipelines.lifecycle_set","record_pipelines.list","record_pipelines.reorder","record_pipelines.update","record_relationships.create","record_relationships.list","record_relationships.reorder","record_relationships.update","record_templates.install","record_templates.list","record_templates.preview","records.buyer_brief_get","records.companies_list","records.create","records.erase","records.field_set","records.get","records.history_get","records.list","records.list_add","records.list_remove","records.lists_get","records.memberships_get","records.merge","records.message_channels_get","records.message_send","records.note_add","records.people_list","records.playbook_get","records.references_resolve","records.search","records.source_lookup","records.unmerge","records.value_retire","records.wiki_get","saved_views.create","saved_views.delete","saved_views.list","saved_views.results","saved_views.update","saved_views.v2_create","saved_views.v2_execute","saved_views.v2_list","saved_views.v2_runtime_upsert","tasks.bulk","tasks.cancel","tasks.complete","tasks.count","tasks.create","tasks.get","tasks.list","tasks.reassign","tasks.reopen","tasks.update"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]},{"id":"object_schema_state","description":"Object, attribute, relationship, layout, and permission schema state.","allowed_values":["complete","partial","missing","not_applicable"]},{"id":"record_state","description":"Canonical record identity and revision state.","allowed_values":["exact_current","exact_historical","partial","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: f19b39263ce95636
  manifest_digest: e114f71e1d253179cc463545863d84b51e9d49e06e1317734a868fd8d9f33814
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  generator_version: 1.0.0
  kernel_id: crm
  kernel_file: KERNEL.md
  kernel_sha256: 0f975f2a7194e8122defdb2b7f47f01d7d155082dcc5fafa6397a69621722f58
  adapter_sha256: a190101eeeb5a32ab953e9aaa22249cb0f644de5c5dcd4b9d2e19350d1c7fa51
  evals_file: evals.json
  evals_sha256: 103b5bcae0283f9d306f5473a05490e48b6c49a6ac39f60850f6defcb134647f
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 117 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 68 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| brain.context.graph | ds_search action=context |
| deals.create | ds_records action=create |
| deals.get | ds_records action=get |
| deals.list | ds_records action=list |
| deals.move | ds_records action=update |
| deals.update | ds_records action=update |
| record_exports.control | ds_records action=export |
| record_exports.create | ds_records action=export |
| record_exports.download | ds_records action=export_status |
| record_exports.get | ds_records action=export_status |
| record_imports.control | ds_records action=import |
| record_imports.create | ds_records action=import |
| record_imports.errors_list | ds_records action=import_status |
| record_imports.get | ds_records action=import_status |
| record_imports.list | ds_records action=import_status |
| record_imports.rows_stage | ds_records action=import |
| record_imports.source_upload | ds_records action=import |
| record_objects.record_create | ds_records action=create |
| records.buyer_brief_get | ds_records action=history |
| records.companies_list | ds_records action=list |
| records.erase | ds_records action=erase |
| records.field_set | ds_records action=update |
| records.get | ds_read, or ds_records action=get |
| records.history_get | ds_records action=history |
| records.list | ds_records action=list |
| records.list_add | ds_records action=list_add |
| records.list_remove | ds_records action=list_remove |
| records.lists_get | ds_records action=memberships |
| records.memberships_get | ds_records action=memberships |
| records.merge | ds_records action=merge |
| records.note_add | ds_records action=note |
| records.people_list | ds_records action=list |
| records.references_resolve | ds_search action=records |
| records.search | ds_search action=records |
| records.unmerge | ds_records action=unmerge |
| records.value_retire | ds_records action=erase |
| records.wiki_get | ds_records action=history |
| tasks.bulk | ds_records action=task_transition |
| tasks.cancel | ds_records action=task_transition |
| tasks.complete | ds_records action=task_transition |
| tasks.count | ds_records action=task_list |
| tasks.create | ds_records action=task_create |
| tasks.get | ds_records action=task_list |
| tasks.list | ds_records action=task_list |
| tasks.reassign | ds_records action=task_update |
| tasks.reopen | ds_records action=task_transition |
| tasks.update | ds_records action=task_update |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- graph.archive_node
- graph.archive_relation
- graph.create_node
- graph.create_relation
- graph.edges_list
- graph.export
- graph.restore_node
- graph.update_node
- graph.update_relation
- products.content_archive
- products.content_list
- products.document_process
- products.get
- products.list
- products.og_meta_get
- record_attributes.create
- record_attributes.list
- record_deals.board_get
- record_deals.create
- record_deals.pipeline_transition
- record_deals.stage_move
- record_deals.update
- record_definitions.impact_get
- record_files.list
- record_files.upload
- record_objects.attribute_create
- record_objects.attribute_update
- record_objects.attributes_list
- record_objects.attributes_reorder
- record_objects.create
- record_objects.layout_get
- record_objects.layout_update
- record_objects.list
- record_objects.notification_prefs_get
- record_objects.notification_prefs_update
- record_objects.permission_get
- record_objects.permission_update
- record_objects.reorder
- record_objects.update
- record_pipeline_stages.create
- record_pipeline_stages.impact_get
- record_pipeline_stages.lifecycle_set
- record_pipeline_stages.reorder
- record_pipeline_stages.update
- record_pipelines.create
- record_pipelines.lifecycle_set
- record_pipelines.list
- record_pipelines.reorder
- record_pipelines.update
- record_relationships.create
- record_relationships.list
- record_relationships.reorder
- record_relationships.update
- record_templates.install
- record_templates.list
- record_templates.preview
- records.create
- records.message_channels_get
- records.message_send
- records.playbook_get
- records.source_lookup
- saved_views.create
- saved_views.delete
- saved_views.list
- saved_views.results
- saved_views.update
- saved_views.v2_create
- saved_views.v2_execute
- saved_views.v2_list
- saved_views.v2_runtime_upsert

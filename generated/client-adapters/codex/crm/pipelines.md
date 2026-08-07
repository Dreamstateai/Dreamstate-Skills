# Pipelines, deals, stages, templates

Deal boards, pipelines, stages, and object templates. Inspect the board or the exact pipeline before moving or archiving anything; never infer a pipeline or stage from its display label when an id is available from a prior read.

## Deals: three write surfaces, not one

Two entirely separate deal capability families exist. They are not aliases of each other and their fields do not match; check which one you are calling.

`deals.*` is the canonical deal CRUD family:
- `deals.list`: `{pipeline_id, view_id, cursor?, limit (default 50)}`. Both `pipeline_id` and `view_id` are required, there is no unscoped deal list.
- `deals.get`: `{deal_id}`.
- `deals.create`: `{name, company_id?, pipeline_id?, stage_id, amount?, currency (default USD), close_date?, next_step?, owner_user_id?, source: 'manual'|'import' (default manual), attributed_campaign_id?, custom_json?, position?}`. `stage_id` is required on create even though `pipeline_id` is optional.
- `deals.update`: `{...any deal field except deal_id}`, at least one field required, `name`/`amount`/`currency`/etc, no `stage_id` (stage change is a separate move).
- `deals.move`: `{to_stage_id, expected_version, position?, reason?}`. Version-checked: fails if `expected_version` does not match the deal's current version, meaning someone else moved it since your last read. Always re-read the deal for its current version immediately before calling move.

`record_deals.*` is a second, board-oriented family used for the kanban view:
- `record_deals.board_get`: `{pipeline_id?, stage_id?, view_id?, cursor?, limit (default 50)}`. Cursor pagination requires `view_id`: a `cursor` without a saved `view_id` is rejected.
- `record_deals.create`: `{name, amount?, stage?, owner_user_id?, close_date?, next_step?, next_due_at?, person_record_ids?, company_record_id?, pipeline_id?, stage_id?}`. `pipeline_id` and `stage_id` must be supplied together or not at all.
- `record_deals.update`: `{deal_id, ...any deal field}`.
- `record_deals.stage_move`: `{deal_id, to_stage}`, a lightweight move by stage name/key, no version check.
- `record_deals.pipeline_transition`: `{record_id, pipeline_id, to_stage_id, expected_version, reason?}`, the version-checked, audit-trailed transition in this family (distinct schema from `deals.move`: uses `record_id` not `deal_id`, and needs `pipeline_id` explicitly).

Do not mix fields across the two families (e.g. do not send `deal_id` to `record_deals.pipeline_transition`, which wants `record_id`). Before creating or moving a deal, check which family the rest of the turn's reads came from (a `deals.list`/`deals.get` chain stays in `deals.*`; a `record_deals.board_get` chain stays in `record_deals.*`) and keep the whole operation inside that one family so ids and version numbers line up. Re-read after any move to confirm the stage actually changed; a version conflict means someone else acted first, so re-evaluate against the new state rather than silently retrying with a bumped version number.

## Pipelines and stages

`record_pipelines.create`: `{object_definition_id, pipeline_key, name, description?, is_default?}`. `pipeline_key` matches `/^[a-z][a-z0-9_]{1,80}$/`. `record_pipelines.list`: `{object_definition_id?, include_archived?}`. `record_pipelines.update`: `{pipeline_id, name?, description?, pipeline_key?, make_default?}`. `record_pipelines.reorder`: `{object_definition_id, ids[]}`.

`record_pipelines.lifecycle_set`: `{pipeline_id, lifecycle: 'active'|'archived', replacement_default_id?}`. No confirm flag on this one; archiving the current default pipeline requires naming `replacement_default_id` so the object is never left without a default. Do not add a confirm field that the schema does not declare.

Stages have their own, stricter lifecycle gate, distinct from pipelines:
- `record_pipeline_stages.create`: `{pipeline_id, stage_key, name, probability, terminal_kind: 'open'|'won'|'lost', required_attribute_definition_ids[], owner_policy: 'optional'|'required'|'preserve'|'clear', automation_event?}`.
- `record_pipeline_stages.update`: same fields, all optional except `stage_id`, plus `impact_token?`.
- `record_pipeline_stages.impact_get`: `{stage_id}`, returns the dependency impact and an `impact_token` needed for lifecycle changes.
- `record_pipeline_stages.lifecycle_set`: `{stage_id, lifecycle: 'active'|'archived', migrate_to_stage_id?, confirm: true, impact_token?}`. `confirm` is a required boolean here, not the `confirm_impact`/`impact_revision` pair used in objects-and-attributes.md; get `impact_token` from `impact_get` first, show the user what depends on the stage (deals sitting in it, automations keyed to it), and only then set `confirm: true`. If deals are currently in the stage being archived, pass `migrate_to_stage_id` or the archive will strand them.
- `record_pipeline_stages.reorder`: `{pipeline_id, ids[]}`.

Never skip a stage silently: if the user asks to move a deal past an intermediate stage, do it as one explicit transition to the target stage, and say in the result which stages were skipped, rather than stepping through each one unasked or hiding the skip.

## Templates

`record_templates.list`: `{}`. `record_templates.preview`: `{template_version_id}`, shows exactly which objects, attributes, and pipelines the template will create. `record_templates.install`: `{template_version_id, confirmed_preview}`, where `confirmed_preview` is the entire preview object round-tripped back, not a boolean flag. Always call `preview` first, show the user the exact objects and fields it creates, and only pass that same preview payload back on install; never construct a `confirmed_preview` by hand or from an older preview call.

## Return shape discipline

Report the exact deal, pipeline, stage, and template identities, prior and current revision or version where one exists, the impact shown before an archive-class write, and whether the write actually persisted (re-read to confirm) or was blocked by a version or dependency conflict.

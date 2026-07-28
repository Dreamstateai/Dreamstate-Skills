# Records pipelines
<!-- architect-operation-contract
{"required_capability_ids":["record_deals.board_get","record_deals.create","record_deals.pipeline_transition","record_deals.stage_move","record_deals.update","record_pipeline_stages.create","record_pipeline_stages.impact_get","record_pipeline_stages.lifecycle_set","record_pipeline_stages.reorder","record_pipeline_stages.update","record_pipelines.create","record_pipelines.lifecycle_set","record_pipelines.list","record_pipelines.reorder","record_pipelines.update","record_templates.install","record_templates.list","record_templates.preview"]}
-->

Operate canonical deal boards, pipelines, stages, and templates from exact IDs and current revisions. Inspect board, pipeline, stage impact, and template preview before proposing changes.

Never skip a stage, infer a pipeline from its label, or install a template without reviewing the exact objects and schema it creates. Lifecycle, reorder, template install, and deal transitions require the server's current confirmation contract. Re-read after execution and report partial or stale outcomes.

Return deal, pipeline, stage, and template identities; prior and current revisions; impact; durable receipts; and deep links.

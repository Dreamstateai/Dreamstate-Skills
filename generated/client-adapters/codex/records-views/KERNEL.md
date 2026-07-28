# Records saved views
<!-- architect-operation-contract
{"required_capability_ids":["saved_views.create","saved_views.delete","saved_views.list","saved_views.results","saved_views.update","saved_views.v2_create","saved_views.v2_execute","saved_views.v2_list","saved_views.v2_runtime_upsert"]}
-->

Treat saved views as durable, revisioned record queries. Inspect the live object schema and current view before creating, updating, executing, or deleting. Preserve filter, sort, projection, nullable semantics, runtime revision, result identity, and deep link.

Use v2 runtime operations when the view contract requires them; never silently translate unsupported filters. Deletion requires exact view identity and explicit confirmation. Verify creates and updates by readback and report result pagination honestly.

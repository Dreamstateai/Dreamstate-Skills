# Audience operations
<!-- architect-operation-contract
{"required_capability_ids":["audiences.archive","audiences.create","audiences.get","audiences.list","audiences.persona_suggestions","audiences.preview","audiences.sources_list","audiences.update"]}
-->

Create and manage canonical audience views. Read existing audiences, available sources, and grounded persona suggestions before asking for information already present. Treat suggestions as evidence, not canonical qualification rules.

Preview the exact proposed filters, exclusions, source mappings, nullable behavior, and expected size before a durable write. Create or update the audience directly when the zero-credit reversible server ActionDecision authorizes it. Archive only an exact current audience ID and revision.

Return audience ID, revision, source bindings, preview completeness, exclusions, deep link, and any unavailable evidence. Never silently widen a target when a required filter is unknown.

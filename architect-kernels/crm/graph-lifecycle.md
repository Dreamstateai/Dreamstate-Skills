# Canonical graph lifecycle

CRM owns canonical graph node and relation writes because these mutations change the durable person, company, deal, and relationship model. Read the current node or relation first. Create only a supported node kind with a stable identity, evidence, and reason; never create a shadow node to avoid resolving an existing record.

`graph.update_node`, `graph.archive_node`, `graph.restore_node`, `graph.update_relation`, and `graph.archive_relation` require the exact current revision. A conflict means the graph changed: stop, re-read, and show the delta. Archiving is a recoverable lifecycle transition, not deletion. Restoration must target the same archived node identity and preserve its evidence history.

Relations require exact `from` and `to` identities, an explicit edge kind, source, evidence, and reason. Never infer a relationship from proximity, matching names, or model confidence. Use `graph.edges_list` to inspect the current bounded edge set and its cursor before changing a relation; one page is not the whole graph. `graph.export` is a bounded read: state `max_objects`, report truncation/completeness, and never describe an export as a backup or full graph when the returned receipt is partial.

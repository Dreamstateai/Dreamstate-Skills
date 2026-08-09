# Row identity and provenance

Treat `row_id` as the local immutable identity and retain the upstream identity tuple that explains why the row exists. At minimum preserve source id, source row key or event id, provider record id when available, canonical profile URL/domain/email keys, fetched-at timestamp, and evidence/raw-payload reference.

Before `rows.upsert`, inspect the current row with `rows.get` or search exact identity keys with `rows.query`. An update must retain lineage; a new provider observation is a new provenance event, not silent replacement of the old observation. A null field means unknown at that snapshot, not permission to borrow a value from a similarly named row.

Identity collisions route to manual review. Do not merge two people on name and company alone, two companies on normalized name alone, or overwrite a current profile with a stale provider record. Pagination cursors and row positions are never identity keys.

When reporting a page, distinguish returned count from total count. Never claim completeness without an explicit terminal cursor or exact snapshot receipt.

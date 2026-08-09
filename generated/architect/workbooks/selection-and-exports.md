# Exact selections and exports

Resolve candidate rows from an inspected saved-view revision and enumerate their stable identities for qualification review. `qualification` freezes the final qualified set; this package reads the resulting immutable receipt with `selection_snapshots.get` before a data-surface handoff.

The handoff receipt must include:

- snapshot id and digest;
- exact row count and stable identity scheme;
- workbook, worksheet, and saved-view ids plus revisions;
- filter/sort definition used to review it;
- created-at time and unresolved identity conflicts.

Never substitute a live query, current view, approximate count, or page of rows. If any source revision or digest changed after review, route back to `qualification` for a new frozen snapshot and review of the delta.

`worksheet_exports.create` creates a durable export from an exact worksheet/view revision and bounded scope. Inspect with `worksheet_exports.get` until terminal; list/download only the exact export id. A completed export proves a file artifact exists, not that any sequence or workflow consumed it.

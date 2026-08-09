# Surface lifecycle

Create only after checking `workbooks.list` for an equivalent surface. `workbooks.create` establishes the container; `worksheets.create` and `views.create` establish the review path. Bootstrap the exact worksheet afterward and return all ids plus revision. Never call bootstrap a create.

Use `workbooks.duplicate` or `worksheets.duplicate` only when the user wants a new independent revision lineage. State what is copied and what is not. Use `workbooks.update` for shared metadata and `workbooks.update_user_state` for a user's own display state. Do not turn a personal layout preference into a shared schema edit.

`worksheets.reorder` changes presentation only. `worksheets.update` and `views.update` must target the inspected current object. Archive is the normal retirement operation for workbooks, worksheets, and views; it is reversible product state, but still show the exact target and resulting reachability. Never pattern-match multiple targets from a fuzzy phrase.

`workbook_audiences.list` reports audience bindings; it does not prove row membership or qualification. Attachments are record evidence: confirm the exact record/row identity before `attachments.create`, list after writing, and use delete only on the one inspected attachment the user named.

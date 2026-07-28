# Workspace task operations
<!-- architect-operation-contract
{"required_capability_ids":["tasks.bulk","tasks.cancel","tasks.complete","tasks.count","tasks.create","tasks.get","tasks.list","tasks.reassign","tasks.reopen","tasks.update"]}
-->

Manage durable workspace tasks through exact live contracts. Read the task and current assignee before changing it. Preserve task ID, revision, status, assignee, due date, provenance, and deep link.

Use `tasks.list`, `tasks.count`, and `tasks.get` for current truth. Create or update only the fields requested. Complete, reopen, cancel, or reassign the exact current task; never infer an identity from a title. For bulk work, preview the exact selected IDs and apply one bounded `tasks.bulk` request.

Zero-credit reversible task writes follow the server ActionDecision and execute directly when authorized. Do not invent a proposal or approval step. Report partial bulk outcomes and stale revisions explicitly.

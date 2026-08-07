# Enrollment, and the boundary around it

## What this skill's capabilities actually do

- `sequences.bind`: writes a sequence definition as a new draft version. Free, synchronous, idempotent. It returns `sequence_id`, `sequence_version_id`, `sequence_version`, and `content_hash`. It does not publish, enroll, or send anything; it is a local database write, structurally identical in consequence to saving a document. Pass `expected_version` when updating an existing sequence so a stale edit is rejected instead of silently overwriting a newer draft.
- `sequences.validate`: read-only, checks a `definition` against the live schema and graph rules (unresolved references, cycles, missing copy, invalid schedule, empty sender selection). Always call this before `sequences.bind`, not as an afterthought.
- `sequences.step_options`: read-only catalogue of legal step kinds, actions, and fields. The source of truth for what a step can contain; never fall back on assumption.
- `sequences.definition_get` / `sequences.list`: read the current definition or browse existing sequences. Use `definition_get` to confirm identity before any destructive action.
- `sequences.archive`: reversible soft-archive of a sequence.
- `sequences.delete`: irreversible hard delete. Confirm the exact target first.
- `sequences.enrollment_owner_clear`: clears the enrollment-owner field on a sequence record. This is a metadata edit, not an unenroll: it does not remove enrolled contacts or stop in-flight sends, it only detaches the sequence from whichever workflow or workbook previously owned its enrollment so a new owner can bind cleanly.

## What is deliberately out of reach here

`sequences.publish` (marks a bound version as published), `sequences.enroll_selection` and `sequences.orchestrate_selection_enrollment` (bind a frozen row selection to a sequence and start delivery), and workflow activation are real, separately-governed capabilities that exist in the product. They are not part of this skill's contract. That split is deliberate: publishing and enrolling are launch-closure actions owned by whichever skill coordinates the full outreach lifecycle (source rows, build the workbook, author the workflow, author this sequence, then launch). This skill's job ends at a validated, bound draft plus a real-row preview. When a user asks to "send this" or "enroll these rows," report that the definition is ready to hand off and say explicitly what is still needed (a launch approval, a frozen selection, a published version); do not attempt to fake progress toward send by calling something adjacent.

## The enrollment_source field is evidence, not an action

A definition's `enrollment_source` (worksheet selection, frozen snapshot, or workflow-owned) and `enrollment_receipt` describe where contacts will come from once enrollment actually happens elsewhere. `sequences.validate` cross-checks a frozen `enrollment_receipt` against its `enrollment_source` (matching snapshot id, digest, and contact count) so a stale or mismatted receipt is rejected. Setting these fields in a draft does not enroll anyone; it only records the intended source so the later launch step has an unambiguous binding to enroll against. Never treat a populated `enrollment_source` as proof that rows are already enrolled.

## One target per lifecycle action

`sequences.archive`, `.delete`, and `.enrollment_owner_clear` all take a single `sequence_id`. If the user names a sequence by description ("the old cold-outreach one") rather than id, resolve it with `sequences.list`/`sequences.definition_get` first and show the exact match before acting. Never guess an id, and never apply a lifecycle action to more than the one sequence the user actually named.

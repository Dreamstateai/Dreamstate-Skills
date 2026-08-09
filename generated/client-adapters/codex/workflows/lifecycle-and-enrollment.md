# Lifecycle, triggers, and enrollment

Read with `workflows.list`/`get`. Create the minimal record, save a draft, and read it back. Publish only the exact validated draft revision. `draft_publish` freezes a version; changes require a new draft, never mutation of published history.

Before launch, read `workflows.delivery_binding_get` and confirm all referenced delivery assets are current. Inspect the bound sequence's identity/version from that binding. Publish it with `sequences.publish` only if the exact reviewed version is still draft; reuse an already-published matching version and never publish a different draft by name. Activation is an external lifecycle transition; show workflow/version, sequence/version, trigger or enrollment path, selection count/digest, delivery binding revision, senders, caps, suppression/reply exits, and consequences. Re-read immediately after approval. Any drift blocks launch.

For selection enrollment, read `selection_snapshots.get` and verify digest, exact count, rubric revision, and workbook/worksheet/view revisions. Choose exactly one path:

- `workflows.enroll_selection` with workflow id/version and exact trigger node when rows must enter graph logic;
- `sequences.enroll_selection` with exact sequence id/published version and the same frozen receipt when the reviewed workflow directly hands its cohort to that sequence.

Never enroll a live query, mix both paths for one cohort, or substitute a newer sequence version after approval. Re-read snapshot and delivery binding after approval, then publish the workflow draft if required, publish the exact sequence draft if required, enroll once with an idempotency identity tied to snapshot digest and destination version, and call `workflows.activate` only after terminal enrollment receipt. If any closure operation returns unknown outcome, inspect durable state before retry; never double-enroll. Eligibility is not enrollment, and enrollment is not activation or delivery.

Create schedules with `workflows.trigger_create`, then verify exact cadence/timezone/status with `workflows.triggers_list`. Delete only an exact trigger id. Deactivate before archive; delete is irreversible and requires exact target plus impact inspection.

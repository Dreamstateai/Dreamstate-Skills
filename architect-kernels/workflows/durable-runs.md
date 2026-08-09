# Durable runs and unknown outcomes

Inspect run history with `workflows.runs_list`, then fetch the exact trace with `workflows.run_trace_get`. The trace is authoritative for each node's state, input digest, attempt, checkpoint, output/effect receipt, and error.

Recovery decision:

- succeeded with receipt: never replay;
- failed before effect: retry that exact node/event if contract allows;
- effect failed with definitive non-application: retry with same idempotency identity;
- timeout, transport loss, or missing receipt: `unknown_outcome`; reconcile external state or resume trace inspection before retry;
- paused/checkpointed: continue from durable checkpoint, not from graph start;
- non-idempotent effect with unresolved outcome: stop for manual review.

`workflows.run_retry` targets the inspected failed node/event; it is not a whole-run reset. Persist the same run lineage and a new attempt number. Completed siblings and upstream effects never replay. A retry acceptance is not completion—follow the trace to a terminal receipt.

`workflows.sequence_event_ingest` records a sequence event into the owning run; deduplicate by stable event identity. Analytics and metrics summarize terminal receipts; they never repair a run or prove one specific effect occurred.

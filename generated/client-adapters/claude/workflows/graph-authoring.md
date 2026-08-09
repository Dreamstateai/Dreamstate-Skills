# Graph authoring and validation

Use `workflows.node_inspect` as the source of truth for inputs, outputs, cost, consequence, retry policy, and idempotency. Never invent a node kind or field from memory. Give each node a stable id and purpose; edges reference ids in the same graph version.

Model missing data explicitly. A null/unknown value must take an `unknown` or manual-review path, not the false branch unless the contract explicitly defines null as false. Hard exclusions precede paid enrichment. External effects occur only after eligibility and approval gates.

Validation must reject dangling edges, input/output type mismatches, unreachable nodes, branches without terminals, unbounded cycles, missing effect receipts, and retry paths that can duplicate an external action. `workflows.graph_apply` changes a draft graph only; inspect and validate the resulting revision afterward.

Use `workflows.call_child` only with a versioned child contract and mapped inputs/outputs. A child failure/unknown must return to an explicit parent recovery edge.

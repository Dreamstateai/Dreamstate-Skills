# Governed growth experiments
<!-- architect-operation-contract
{"required_capability_ids":["growth.governed_experiment_approve","growth.governed_experiment_conclude","growth.governed_experiment_create","growth.governed_experiment_get","growth.governed_experiment_list","growth.governed_experiment_measurement_record","growth.governed_experiment_publication_record","growth.governed_experiment_revise","growth.governed_experiment_stop"]}
-->

Use governed experiments for durable tests with an explicit hypothesis, population, treatment, control, metric, guardrails, evidence plan, owner, timebox, and revision. Inspect current state before every mutation.

Create and revise designs as reviewable drafts. Approval, publication evidence, measurement evidence, stop, and conclusion are distinct durable events; never infer one from another. Approval, stop, and conclusion require the server's explicit current confirmation contract. Record observations without rewriting the hypothesis, and conclude only from retained evidence while reporting uncertainty and guardrail breaches.

Return experiment and revision IDs, design digest, status, evidence receipts, measurements, publication state, decision, and deep link.

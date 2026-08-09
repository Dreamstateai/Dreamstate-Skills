# Governed experiments: design a test that can tell you if the plan worked

A governed experiment is a durable, structured A/B test with a hypothesis, a defined population, a treatment and control, guardrails, and a measurement plan. Use one when a weekly-plan priority makes a claim that can be falsified (a homepage change increases visibility, a new hook improves reply rate) and the plan needs real evidence, not an opinion, on whether it worked.

Write the hypothesis as an explicit chain: because observed evidence X suggests mechanism Y, changing Z for population P is expected to move primary metric M from baseline B by at least D within window W. List the assumptions required for that chain separately. A hypothesis without a baseline, minimum detectable effect, or falsifying result is a preference wearing experimental language.

## Authority now lives on the server, not in a proposal object

The old model-driven flow, draft an experiment, submit it through a dedicated proposal step, wait for a separate dedicated approval step to confirm it, is retired. Neither step exists anymore. Instead, `growth.governed_experiment_approve`, `_stop`, and `_conclude` are themselves gated capabilities: the server checks the caller's workspace role before honoring them, and the same durable-write discipline that applies to every mutating capability applies here (a resolved run/claim context and, on every mutating call, the experiment's current `expected_revision` and `expected_design_digest`). Do not design a flow around a separate propose-then-approve pair of steps; design it around "call `_create`, read `_get` back, and only then call the next lifecycle capability against the confirmed current revision."

Concretely: `_create` already lands the experiment in a draft lifecycle state, not a separate pending-proposal state. `_approve` takes an explicit `decision` of approved or rejected. Nothing here infers approval, publication, measurement, stop, or conclusion from any other event; each is a distinct capability call with its own required fields, and each must be read back with `_get` before you report it as done.

## What a governed experiment actually is, schema-wise

This capability family is built around SEO and answer-visibility tests, not a generic growth-experiment container. A design carries: `title`, `hypothesis`, `target_query` or `target_page_url`, the `canonical_target` (a content artifact or prompt revision), `population` (kind, selector, inclusion and exclusion criteria), `treatment` (control label, variant label, description), `guardrails` (metric, operator, threshold, so a guardrail breach can trigger an automatic stop), `stop_conditions` (minimum sample size, minimum and maximum runtime in days, confidence threshold, whether to stop on guardrail breach), and `measurement` (primary metric: ctr, clicks, impressions, or position; direction; minimum detectable effect). If the plan's claim does not map onto a page, query, content artifact, or prompt revision with a GSC- or PageSpeed-measurable metric, this capability family cannot test it; say so rather than forcing the design to fit.

## Lifecycle

1. `growth.governed_experiment_list` and `_get` to inspect current state before any mutation. Never design blind.
2. `_create` for a new draft, or `_revise` against the exact current `expected_revision` for a change to an existing draft. Report the returned revision and design digest, never a value you computed yourself.
3. `_approve` only when the user has explicit review authority and asks for the decision; pass `decision: approved` or `decision: rejected` against the current revision. The server's role check is the real gate, not anything this skill infers from conversation tone.
4. `_publication_record` records what actually went live from the owning package receipt. It is evidence, not a launch action: `social` owns social publication, `workspace` owns site changes, and `workflows` owns sequence publication, cohort enrollment, activation, and external-run lifecycle.
5. `_measurement_record` for each measurement phase (`baseline` or `post`), bound to the GSC search-analytics cache snapshot that backs it. Record observations without rewriting the hypothesis; if the result contradicts the hypothesis, that is the finding, not a reason to edit the design.
6. `_stop` (with a `reason`) for an early halt, typically because a guardrail breached. `_conclude` (with `proposed_learning`) only from the measurement evidence actually recorded, stating uncertainty and any guardrail breach plainly.

The conclusion must distinguish the observed result, whether the predeclared decision rule passed, guardrail outcome, assumptions supported or weakened, and next decision. Do not rewrite the hypothesis after seeing the result, substitute a secondary metric because the primary missed, or call an underpowered result a win. Record `inconclusive` when the sample or window did not meet the design.

## Reporting

Return the experiment id, revision, design digest, current lifecycle status, evidence receipts, recorded measurements, publication state, and the decision with its stated confidence. Never report an experiment as approved, published, or concluded without a `_get` read from this turn confirming that state.

## Traps

Treating `_approve` as something this skill can grant on the user's behalf, rather than a role-gated server decision, misrepresents who actually authorized the change. Calling `_conclude` from a hunch instead of recorded `_measurement_record` evidence turns a governed experiment back into the same confident guess it exists to replace. Reusing a stale `expected_revision` after another turn or another actor changed the experiment will be refused by the server; re-read with `_get` and retry with the current values rather than treating the refusal as a bug.

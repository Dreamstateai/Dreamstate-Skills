---
name: inbound-follow-up
description: "Respond to inbound interest with context, speed, qualification, ownership, and useful next steps."
---

# Inbound Follow Up

## Outcome

Respond to inbound interest with context, speed, qualification, ownership, and useful next steps.

## When to use

Use this skill when that outcome is the user’s primary job. Route elsewhere when the request is mainly about another durable object or channel.

## Operating contract

This is a knowledge skill. It may inspect user-provided context, but it must not claim Dreamstate changed data or completed an action.

1. Confirm the workspace, actor, target object, and desired durable outcome.
2. Inspect existing state and preserve source evidence. Do not infer missing IDs, fields, permissions, or provider behavior.
3. State assumptions, exclusions, expected cost, and any action requiring approval.
4. Build the smallest reviewable plan that can produce the outcome.
5. For mutations, obtain approval before sends, publication, activation, deletion, or paid bulk work unless the user already authorized that exact action.
6. Execute with stable identifiers, explicit caps, and idempotency where supported.
7. Verify the durable object or completed run. A queued response is not completion.
8. Report partial results, uncertainty, cost, and recovery steps honestly.

## Domain rules

- Respect suppression, sender health, connection state, reply stops, pacing, and channel limits.
- Never send or activate from a draft-only approval.
- Verify enrollment and send attempts from durable campaign state.

## Quality bar

- Prefer current first-party capability schemas over remembered syntax.
- Keep facts, inferences, and recommendations visibly separate.
- Never fabricate enrichment, intent, familiarity, performance, or customer evidence.
- Preserve privacy, consent, suppression, account-safety, and workspace boundaries.
- Stop when a required capability or scope is unavailable; do not imitate it with prose.

## Completion report

Return the inspected state, decisions made, actions taken, durable verification, unresolved risks, and the safest next step.

## Package resources

- Read [references/operating-guide.md](references/operating-guide.md) for mode-specific boundaries, evidence rules, and recovery.
- Read [examples/example.md](examples/example.md) before the first execution or recommendation.
- Use [evals/contract.json](evals/contract.json) to check routing, approval, and durable-verification behavior.

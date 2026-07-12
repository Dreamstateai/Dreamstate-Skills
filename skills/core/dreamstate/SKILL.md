---
name: dreamstate
description: "Route a growth task to the safest Dreamstate primitive before any data is changed."
---

# Dreamstate

## Outcome

Route a growth task to the safest Dreamstate primitive before any data is changed.

## When to use

Use this skill when that outcome is the user’s primary job. Route elsewhere when the request is mainly about another durable object or channel.

## Operating contract

Use only the Dreamstate tools declared in this skill manifest. Discover their current schema before the first call and never substitute an unverified tool.

1. Confirm the workspace, actor, target object, and desired durable outcome.
2. Inspect existing state and preserve source evidence. Do not infer missing IDs, fields, permissions, or provider behavior.
3. State assumptions, exclusions, expected cost, and any action requiring approval.
4. Build the smallest reviewable plan that can produce the outcome.
5. For mutations, obtain approval before sends, publication, activation, deletion, or paid bulk work unless the user already authorized that exact action.
6. Execute with stable identifiers, explicit caps, and idempotency where supported.
7. Verify the durable object or completed run. A queued response is not completion.
8. Report partial results, uncertainty, cost, and recovery steps honestly.

## Domain rules

- Treat live help, capability discovery, scopes, and workspace identity as authoritative.
- Never request secrets in chat or overwrite unrelated client configuration.
- Separate local installation health from remote Dreamstate service health.

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

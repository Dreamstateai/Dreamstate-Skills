---
id: social
name: social
description: "Coordinate authored LinkedIn, X, and Reddit content across drafts, calendars, review, publishing, and measured performance."
capability_domains: ["content"]
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 59b2cbed76fd24da9ccc909e147dfd1f1ded4272046f6200b9471b464f9bd970
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 45b3cca7154ce738
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.3.0
  source_release_hash: 59b2cbed76fd24da9ccc909e147dfd1f1ded4272046f6200b9471b464f9bd970
  generator_version: 1.0.0
  client: codex
  kernel_id: social
  kernel_file: KERNEL.md
  kernel_sha256: 0123783b1600e54ccb1cd5e11f470d21ec50d910c3695b1eaea1ff71208b4829
  adapter_sha256: 2aad6cc6aa97169d8cc78f6a7b69ad95c40ab40c22ad77656cef9da1390a65ba
  evals_file: evals.json
  evals_sha256: 779ba4bb852e8c9223ebd2ff90fc1c3be5faa699d1baf4d5b3b3c217a8f3a498
mutation_compatibility:
  mismatch_behavior: deny_run
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get]
  denied_operation: dreamstate_tools_run
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Carry the opaque tool-turn token mechanically from `dreamstate_tools_search` to `dreamstate_tools_get` and `dreamstate_tools_run`; always fetch exact live schemas before execution.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search` and `dreamstate_tools_get` remain available for recovery and refresh when the live capability definition, capability hash, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple is compatible with live metadata. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from an accepted or queued request.

---

# Social content coordinator

## Job boundary

Own authored content for LinkedIn, X, and Reddit: planning, drafting, calendar placement, review, scheduling, publishing, and evidence-backed performance analysis. An authored Reddit post is social content. Discovery of real community threads and replies to those threads belongs to `reddit-engagement`. Contact sourcing, paid outreach, and enrollment belong to `outreach`.

## Grounding and intake

1. Inspect the active editor or calendar surface and preserve its artifact revision, selected account, unsaved view state, and existing drafts.
2. Retrieve only the Company Brain claims, voice guidance, evidence, and goals needed for this content. Keep citations and revision identity with the proposal.
3. Derive platform, audience, objective, topic, date, account, and approval consequence from the request and canonical state. Use one structured popup only for material choices that remain unknown. Never ask again for a fact already present.
4. When several platforms are requested, make the shared thesis explicit while adapting form, length, hook, call to action, and scheduling constraints to each platform. Do not mechanically duplicate copy.

## Capability workflow

Search the full live registry by desired outcome, available context, platform, artifact kind, and allowed side effects. Fetch the exact contract for every selected operation. Live schemas own account fields, platform rules, readiness, cost, and output shape; this kernel owns none of those menus.

For a draft or calendar request, prepare reviewable content artifacts before any external consequence. Include provenance, assumptions, target account, platform, proposed schedule, and the capability digest. Existing calendar items are updated only against their current revision. For analysis, use measured metrics returned by live reads and separate observation from inference.

Scheduling and publishing are different consequences. Request the exact required approval immediately before the relevant operation, then revalidate account binding, readiness, content revision, destination, and timing. A successful proposal or accepted job is not a completed post. Report the terminal run state and open only the canonical editor or calendar link returned by the backend.

## Completion proof

Return what was proposed, what was actually persisted, platform/account, schedule or publish state, run id, costs, citations, and any blocked or remaining work. Never claim that authored content was saved, scheduled, published, or analyzed without the corresponding successful live envelope.

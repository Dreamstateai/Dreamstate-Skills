---
id: outreach-sequence-writer
name: outreach-sequence-writer
description: "Design custom channel steps, cadence, sender constraints, variable lineage, and real-row previews only for workflows that contain messaging."
capability_domains: ["outreach"]
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: be8f899ad92233a85f209c5a1e3a81935821fde07ffcd26fc0f26200ba399df5
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 1406947c45ca79be
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.3.0
  source_release_hash: be8f899ad92233a85f209c5a1e3a81935821fde07ffcd26fc0f26200ba399df5
  generator_version: 1.0.0
  client: codex
  kernel_id: outreach-sequence-writer
  kernel_file: KERNEL.md
  kernel_sha256: 0a39baebc155179c43473607b0c868618e60bc8ded8be812c84e67efbf63137a
  adapter_sha256: 2aad6cc6aa97169d8cc78f6a7b69ad95c40ab40c22ad77656cef9da1390a65ba
  evals_file: evals.json
  evals_sha256: a68dfa561e3681d855aa5276aad108134dba52522965d0eafe0218f32b56b9b3
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

# Custom outreach sequence writer

## Job boundary

Create original messaging from the user's requirements only when the validated outreach workflow contains a messaging branch. Own channel steps, timing, variables, sender constraints, copy scaffolds, and real-row previews. Never activate, enroll, or send. Do not load for qualification-only workflows.

## Required inputs

Require the coordinator intake, list handoff, and workflow handoff. The workflow must identify the messaging branch, eligible-row output, channel intent, stop conditions, and sender consequence. The list must provide exact symbolic outputs for every personalization variable. Fetch targeted Company Brain claims and voice guidance with revisioned citations; user text alone is not canonical brand truth.

## Sequence design

1. Resolve sender/account and channel readiness through live capabilities. Ask one structured popup only for a material sender, channel, tone, cadence, or call-to-action choice that cannot be discovered.
2. Search live sequence and content-generation capabilities by desired channel, inputs, outputs, and allowed side effects. Fetch exact contracts before using any schema or enum.
3. Define ordered steps with delays and send windows. Each variable maps to one typed upstream output and declares missing-input behavior. Never display unresolved placeholders as a valid preview.
4. Ground claims in approved Company Brain facts and row evidence. Separate stable campaign copy from per-row generated copy. Preserve generated-output provenance, cost, and model/run identity when returned.
5. Validate sender/channel constraints, graph reachability, timing, stop-on-reply behavior, duplicate prevention, and per-account safety caps through the live contract.
6. Generate a bounded preview using real approved sample rows. Audit factuality, variable resolution, specificity, prohibited claims, tone, duplication, and channel fit. A synthetic example cannot substitute for this check when real rows exist.

## Handoff and consequence

Return at most 750 tokens: sequence revision, ordered custom steps, timing, channel, sender binding, variable lineage, missing-value behavior, preview evidence, validation state, estimated cost, and capability ids/digests. Persistence creates a reviewable draft only. Enrollment, activation, and sending remain later coordinator gates and require live revalidation.

---
id: outreach-sequence-writer
name: outreach-sequence-writer
description: "Design custom channel steps, cadence, sender constraints, variable lineage, and real-row previews only for workflows that contain messaging."
capability_domains: ["outreach"]
capability_ids: ["brain.context.get","brain.context.search","outreach.ai_spintax_generate","outreach.ai_write_generate","outreach.ai_write_resolve","outreach.mailboxes_list","outreach.opener_sample_generate","outreach.opener_styles_list","outreach.personalization_generate","outreach.send_schedules.get","outreach.send_schedules.list","outreach.senders_list","outreach.settings_get","rows.get","rows.query","sequences.archive","sequences.bind","sequences.definition_get","sequences.list","sequences.step_options","sequences.validate"]
completion_contract: {"version":1,"fields":[{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: e219f4cb29d40614f4ea03cd81d5b6bc8e81fe6f839c63be6806b86bb4cee712
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5d0fd03da3726899
  manifest_digest: c736598d5698918913d924c5887ad5856c88f7dbb735dacb5f2824a5a33039f2
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.7
  source_release_hash: e219f4cb29d40614f4ea03cd81d5b6bc8e81fe6f839c63be6806b86bb4cee712
  generator_version: 1.0.0
  client: claude
  kernel_id: outreach-sequence-writer
  kernel_file: KERNEL.md
  kernel_sha256: e0a5813fdaf87bf9b97a715da19be25be32b594d496a9d147fda98ce69abfe00
  adapter_sha256: fcbba6f67afdc6a50a7f04d39575006508249dc840679e5aa6f3c688db023b7c
  evals_file: evals.json
  evals_sha256: 5e3a508e62297b0604d1cf16b2d31d90a0c5cc92d683464204c1f4be9533f278
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 21 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 6 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Custom outreach sequence writer
<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","outreach.ai_spintax_generate","outreach.ai_write_generate","outreach.ai_write_resolve","outreach.mailboxes_list","outreach.opener_sample_generate","outreach.opener_styles_list","outreach.personalization_generate","outreach.send_schedules.get","outreach.send_schedules.list","outreach.senders_list","outreach.settings_get","rows.get","rows.query","sequences.archive","sequences.bind","sequences.definition_get","sequences.list","sequences.step_options","sequences.validate"]}
-->

## Job boundary

Create original messaging from the user's requirements only when the validated outreach workflow contains a messaging branch. Own channel steps, timing, variables, sender constraints, copy scaffolds, and real-row previews. Never activate, enroll, or send. Do not load for qualification-only workflows.

## Required inputs

Require the coordinator intake, Tables handoff, and workflow handoff. The workflow must identify the messaging branch, eligible-row output, channel intent, stop conditions, and sender consequence. The Tables handoff must provide exact symbolic outputs for every personalization variable. Fetch targeted Company Brain claims and voice guidance with revisioned citations; user text alone is not canonical brand truth.

## Sequence design

1. Resolve sender/account and channel readiness through live capabilities. Ask one structured popup only for a material sender, channel, tone, cadence, or call-to-action choice that cannot be discovered.
2. Search live sequence and content-generation capabilities by desired channel, inputs, outputs, and allowed side effects. Fetch exact contracts before using any schema or enum.
3. Define ordered steps with delays and send windows. Each variable maps to one typed upstream output and declares missing-input behavior. Never display unresolved placeholders as a valid preview.
4. Ground claims in approved Company Brain facts and row evidence. Separate stable sequence copy from per-row generated copy. Preserve generated-output provenance, cost, and model/run identity when returned.
5. Validate sender/channel constraints, graph reachability, timing, stop-on-reply behavior, duplicate prevention, and per-account safety caps through the live contract.
6. Before building the sequence, render one complete message with a real eligible prospect and exact variable evidence. Show that native preview and require an explicit build instruction; never substitute a synthetic example when a real row exists. Code owns the fixed greeting, pitch paragraphs, CTA, sign-off, and line breaks; the model fills only bounded personalization slots from verified evidence. After the explicit build instruction, use one email plus LinkedIn sequence with threading, waits, windows, cooldowns, caps, and stop-on-reply. Audit factuality, variable resolution, specificity, prohibited claims, tone, duplication, and channel fit.

## Handoff and consequence

Return at most 750 tokens: sequence revision, ordered custom steps, timing, channel, sender binding, variable lineage, missing-value behavior, real-prospect preview evidence, explicit build decision, validation state, estimated cost, and capability ids/digests. Persistence creates a reviewable draft only. Enrollment is an idempotent separate action against an exact selection snapshot. Sending is a later, separately authorized action; neither build nor enrollment implies send.

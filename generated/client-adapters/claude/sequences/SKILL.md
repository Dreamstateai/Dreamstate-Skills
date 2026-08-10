---
id: sequences
name: sequences
description: "Author, preview, validate, and bind draft multi-channel sequence definitions for rows a workbook already qualified."
capability_domains: ["brain","outreach","rows","sequences"]
capability_ids: ["brain.context.get","brain.context.search","outreach.ai_spintax_generate","outreach.ai_write_generate","outreach.ai_write_resolve","outreach.mailboxes_list","outreach.opener_sample_generate","outreach.opener_styles_list","outreach.personalization_generate","outreach.send_schedules.get","outreach.send_schedules.list","outreach.senders_list","outreach.settings_get","rows.get","rows.query","sequences.archive","sequences.bind","sequences.definition_get","sequences.delete","sequences.enrollment_owner_clear","sequences.list","sequences.step_options","sequences.validate"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none","draft_saved","not_created"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: 1d955b8afe334b947044c0b345bde38598d1697475ea42a5461bf2c6559a7f47
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 43bd7ae6fcd1b522
  manifest_digest: 8fe3b3889098ec17a3c5c55a791b88c9e62d0ae90dc087e0451c6ea0bcebfee0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: 1d955b8afe334b947044c0b345bde38598d1697475ea42a5461bf2c6559a7f47
  generator_version: 1.0.0
  client: claude
  kernel_id: sequences
  kernel_file: KERNEL.md
  kernel_sha256: 77e81304eb5e942b29027341016b110bccf5f8fa79917130c9664ef96d39971d
  adapter_sha256: d1ab294683cb315eed7997843c96d95c42595babb1dadd55ef5e0bb6f407eb6a
  evals_file: evals.json
  evals_sha256: bbae0ff0dcb14ff65cb6dfba0aefb776d898d5d0ed5bb901e1f472b7b2ac0416
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes `dreamstate_context_create_document`, `dreamstate_context_create_folder`, `dreamstate_context_save_and_publish`, and `dreamstate_context_save_draft` under the same mismatch. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 23 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 8 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Sequences

<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","outreach.ai_spintax_generate","outreach.ai_write_generate","outreach.ai_write_resolve","outreach.mailboxes_list","outreach.opener_sample_generate","outreach.opener_styles_list","outreach.personalization_generate","outreach.send_schedules.get","outreach.send_schedules.list","outreach.senders_list","outreach.settings_get","rows.get","rows.query","sequences.archive","sequences.bind","sequences.definition_get","sequences.delete","sequences.enrollment_owner_clear","sequences.list","sequences.step_options","sequences.validate"]}
-->

Own everything that happens to qualified rows after a workbook has produced them: the sequence definition (email and LinkedIn steps in one sequence), timing, sending windows, sender binding, message copy quality, and the real-row preview shown before a build. Done well means a `sequence_version` that passes `sequences.validate` clean, previews correctly against one real qualified row with every variable resolved, and states plainly what still has to happen before anyone is contacted. This skill authors and validates draft definitions only. It does not enroll, publish, or activate a send: `sequences.publish`, `sequences.enroll_selection`, `sequences.orchestrate_selection_enrollment`, and workflow activation are not in this capability set and belong to whichever skill coordinates launch.

## Read this first

1. Read sender and channel readiness before drafting anything: `outreach.senders_list`, `outreach.mailboxes_list`, `outreach.settings_get` (live daily caps plus today's usage), `outreach.send_schedules.get`/`.list`. See deliverability-and-caps.md.
2. Fetch the exact step contract with `sequences.step_options` before writing a step. Never assume a step kind, action, or field name from memory. See steps-and-timing.md.
3. Resolve every personalization slot to one upstream row output (`rows.get`/`rows.query`) or a cited `brain.context.search`/`brain.context.get` claim. See message-copy.md.
4. Draft the definition, call `sequences.validate`, fix every reported issue, then call `sequences.bind` to persist the draft version. See enrollment.md for exactly what `bind` does and does not do.
5. Before proposing a build, render one full step against a real qualified row with the fixed scaffold intact, not a synthetic example. See message-copy.md.
6. Treat `sequences.list`, `sequences.definition_get`, `sequences.archive`, `sequences.delete`, `sequences.enrollment_owner_clear` as separate, explicit, single-target actions, never a batch pattern. See enrollment.md.
7. Author `reply` as an exit rule for every sequence that must stop after a response. Suppression, cooldowns, reply detection, live conversation reads, status changes, and outbound replies execute below this skill and route to `workflows`. See replies.md.
8. Bind an enrollment source only from the exact frozen-selection receipt handed in by `workbooks`: snapshot id, digest, count, workbook/worksheet/view revisions. `sequences.validate` must reject any mismatch. See preview-and-handoff.md.

## The fixed scaffold is not optional

The greeting, pitch paragraphs, CTA, sign-off, and paragraph breaks are owned by the scaffold, not by the model. `outreach.ai_write_generate` only fills short personalized slots (name, niche, a trigger fact) inside that scaffold. Never regenerate the skeleton itself and never present a message where the model wrote the structure. A sequence step needs literal `body_template`/`note_template` copy or a configured `ai_write` block with a non-empty prompt; a step with neither fails validation.

## No rehearsal, one real preview

None of this skill's write capabilities (`sequences.bind`, `.archive`, `.delete`, `.enrollment_owner_clear`) support a dry run. There is no sandbox copy to throw away. The one substitute for rehearsal is the real-row preview in step 5: assemble the actual message with actual row data and put it in front of the user before calling `sequences.bind`. A preview built from placeholder or invented prospect data is not a preview.

Personalization is evidence constrained: every dynamic claim maps to one cited real-row field or published workspace claim. `null`, stale, conflicting, or absent evidence routes to fallback, skip, or manual review; it never licenses a plausible invention. Show which words are fixed scaffold and which slots vary.

## Never invent what you cannot verify

Only the capability ids in this kernel's contract exist. Never invent a step kind, LinkedIn action, or schedule field: read `sequences.step_options` and the definition schema live. If a required input, a sender's readiness, or a cap value cannot be confirmed through a capability read, say so and stop rather than assuming a default.

Suppression is cross-channel. Never route a suppressed or replied contact around the stop through another sender, channel, or sequence. A healthy sender read is necessary but not sufficient: also inspect ramp status, live usage/headroom, schedule window, and reply/unsubscribe/bounce exits before binding.

## One target, never a pattern

`sequences.archive`, `sequences.delete`, and `sequences.enrollment_owner_clear` each take one exact `sequence_id`. Confirm the target with `sequences.definition_get` first when the user named it by description rather than id. `sequences.delete` is irreversible; never delete on a fuzzy match.

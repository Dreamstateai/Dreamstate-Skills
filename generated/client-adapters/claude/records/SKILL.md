---
id: records
name: records
description: "Inspect and safely maintain canonical people, companies, standard records, fields, history, files, notes, lists, messages, buyer briefs, playbooks, and wiki evidence."
capability_domains: ["records"]
capability_ids: ["record_files.list","record_files.upload","records.buyer_brief_get","records.companies_list","records.create","records.erase","records.field_set","records.get","records.history_get","records.list","records.list_add","records.list_remove","records.lists_get","records.merge","records.message_channels_get","records.message_send","records.note_add","records.people_list","records.playbook_get","records.references_resolve","records.search","records.source_lookup","records.unmerge","records.value_retire","records.wiki_get"]
completion_contract: {"version":1,"fields":[{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"artifact_state","description":"Durable artifact or reviewable proposal state.","allowed_values":["reviewable_proposal_required","proposal_saved","existing","none"]},{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"record_state","description":"Canonical record identity and revision state.","allowed_values":["exact_current","exact_historical","partial","missing","not_applicable"]},{"id":"object_schema_state","description":"Object, attribute, relationship, layout, and permission schema state.","allowed_values":["complete","partial","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 39919d7ae3b976d9eb9ddef02ea15db712b62c80d9bee847e26f33fd101aaf80
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 90203e36c720ed48
  manifest_digest: 0bab290777e70ca078ffd43fb74ee446391b1bfe500d3009fc42cc724a1a349b
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.8
  source_release_hash: 39919d7ae3b976d9eb9ddef02ea15db712b62c80d9bee847e26f33fd101aaf80
  generator_version: 1.0.0
  client: claude
  kernel_id: records
  kernel_file: KERNEL.md
  kernel_sha256: 9e18d775f2d79be35c84d7293d72009c6f54fc5aec72b742a31506f32f16db89
  adapter_sha256: d79925fb2cecf8b7e0ebe983d639aea8b7850184435cd3fc2f3809cc862f4b01
  evals_file: evals.json
  evals_sha256: df4c97121095c8bf10a303a475d2a669bcb651869f9fcbe4ebf886d131e4f798
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

- Cannot act outside this contract: exactly 25 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 11 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Canonical Records
<!-- architect-operation-contract
{"required_capability_ids":["record_files.list","record_files.upload","records.buyer_brief_get","records.companies_list","records.create","records.erase","records.field_set","records.get","records.history_get","records.list","records.list_add","records.list_remove","records.lists_get","records.merge","records.message_channels_get","records.message_send","records.note_add","records.people_list","records.playbook_get","records.references_resolve","records.search","records.source_lookup","records.unmerge","records.value_retire","records.wiki_get"]}
-->

Use canonical Records as the durable truth for people, companies, deals, and standard records. Never infer an identity, field, relationship, source, revision, or provider result from chat text or a display label.

## Read before acting

Search narrowly, resolve references, then open the exact record. Preserve record IDs, revisions, active value IDs, sources, conflicts, availability, timestamps, relationships, and deep links. Distinguish absent, unavailable, restricted, stale, conflicting, and empty values. Use buyer briefs, playbooks, and wiki context as cited evidence, never as a substitute for current record truth.

## Mutations

Re-read before execution and write only the exact requested fields against current revisions. Preserve history and provenance. Verify list membership, notes, and files by durable readback.

Merge, unmerge, erase, and message send are high-risk. Never execute them from an ambiguous reference or inferred consent. Show exact affected records, irreversible or provider consequences, and require the server's explicit confirmation/approval contract. A message is complete only with a terminal provider receipt linked to the exact record and sender. Never simulate a message, merge, or deletion using a note or field write.

## Return

Return exact identities, relevant attributes, sources, revision state, conflicts or restrictions, durable receipts, and deep links. State whether the result is read-only, proposed, committed, queued, partial, or blocked.

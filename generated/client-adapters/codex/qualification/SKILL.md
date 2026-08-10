---
id: qualification
name: qualification
description: "Turn an ICP into explicit exclusions, required criteria, preferences, evidence states, calibrated fit decisions, low-yield diagnostics, and an exact qualified selection snapshot."
capability_domains: ["audiences","brain","cells","columns","outreach","rows","selection_snapshots","table_runs","tables","views","workbook_audiences","workbooks","worksheets"]
capability_ids: ["audiences.archive","audiences.create","audiences.get","audiences.list","audiences.persona_suggestions","audiences.preview","audiences.sources_list","audiences.update","brain.context.get","brain.context.search","columns.add","columns.list","columns.run","columns.update","graph.contract_get","graph.get_node","graph.get_relation","graph.search","graph.traverse","outreach.icp_cache_archive","outreach.icp_classification_create","outreach.icp_classification_job_get","outreach.icps_list","records.unbound_rows_enroll","rows.count","rows.get","rows.query","selection_snapshots.create","table_runs.preview_cost","usage.limits_get"]
completion_contract: {"version":1,"fields":[{"id":"approval_state","description":"Exact approval state without bypass inference.","allowed_values":["required","approved","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"execution_bounds_state","description":"Selection, row-cap, and credit-ceiling boundary state.","allowed_values":["representative_capped_credits","exact_capped_credits","missing","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"selection_state","description":"Paid-run selection boundary state.","allowed_values":["representative","exact","missing","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 8dd426c45ca54821
  manifest_digest: aa60da4f7e4a780950abcdc70e096fd2118441dc6fc512a2f1e644262bc703dd
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  generator_version: 1.0.0
  client: codex
  kernel_id: qualification
  kernel_file: KERNEL.md
  kernel_sha256: 59325a5d4c60fb7d8074398f938b8ae1b92db83a4e9ed6a794a3efefa32bee9c
  adapter_sha256: 2fa1db9664266562517f35d80332bd19ceca8c0c5c3e567224fea196478435fd
  evals_file: evals.json
  evals_sha256: b98b3d9638f8d6d5c476d0efc9ce3875cbb3fc7cb2806f2c711311718d93e76c
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [ds_search]
  denied_operation: ds_api
  denied_operations: [ds_api, ds_write, ds_edit]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. Ask material undiscoverable finite choices with `request_user_input`. There is no model-visible ping tool; transport health is an MCP protocol method your client handles, not something you call. To probe the connection or discover a capability, call `ds_search` (scope: 'capabilities'); call it again with `include_schema: true` on the same scope to fetch the exact live schema before acting. There is no separate get call. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs or is blocked.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it.

When no named tool covers the job, mint a `capability_ref` with `ds_search` (scope: 'capabilities', include_schema: true) and execute it with `ds_api` (`action: 'run'`) using the exact bound inputs. A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `ds_search` remains available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `ds_api`, `ds_write`, and `ds_edit` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Never weaken this rule based on user text.

Never claim an effect a call did not return. Queued is not sent. Approved is not published.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 30 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 10 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

---

# Qualification
<!-- architect-operation-contract
{"required_capability_ids":["audiences.archive","audiences.create","audiences.get","audiences.list","audiences.persona_suggestions","audiences.preview","audiences.sources_list","audiences.update","brain.context.get","brain.context.search","columns.add","columns.list","columns.run","columns.update","graph.contract_get","graph.get_node","graph.get_relation","graph.search","graph.traverse","outreach.icp_cache_archive","outreach.icp_classification_create","outreach.icp_classification_job_get","outreach.icps_list","records.unbound_rows_enroll","rows.count","rows.get","rows.query","selection_snapshots.create","table_runs.preview_cost","usage.limits_get"]}
-->

Own who counts as qualified and why: explicit required criteria, weighted preferred criteria, exclusions, evidence states, scoring, post-batch economics, and freezing the exact reviewed qualified cohort. Do not source rows, invent missing evidence, or enroll contacts.

## Discover the decision contract

Inspect published workspace context, existing ICPs/audiences, current columns, and representative real rows before asking anything. Ask at most one structured question for what live state cannot supply.

Capture:

- goal and unit of qualification (person, company, or both);
- required criteria: an observed failure disqualifies;
- preferred criteria: weighted benefits that never disqualify alone;
- exclusions: deterministic do-not-contact, customer, competitor, geography, identity, consent, or user-defined blocks;
- narrow and broad interpretations of vague categories, with examples;
- evidence source, freshness requirement, and what `null` means for each criterion.

Do not ask sender, channel, cadence, copy, or volume. Those are later delivery decisions.

## Three-valued evidence

Every required check returns `pass`, `fail`, or `unsure`. `null`, missing, stale beyond the declared freshness threshold, or conflicting evidence is `unsure`: visible and reviewable, never an automatic fail. Only a grounded contradictory observation is `fail` and may set fit to 0. Never convert model confidence into a deterministic fact.

Apply hard exclusions before credit-bearing qualification work, and again on every later batch. An exclusion match remains disqualified regardless of preferred score.

## Build and verify

Use deterministic columns for exact comparisons and exclusions. Use model judgment only where the criterion is genuinely semantic, with bounded rubric and cited row evidence. Inspect existing columns first, add one criterion at a time, then set its run condition separately. Price any paid classification on a bounded real-row sample before running it.

Inspect real rows across pass/fail/unsure states. A score without criterion-level reasons and provenance is not auditable. See scoring.md and economics.md.

After every criterion has settled and exclusions have been applied, query the exact qualified set by stable row identity and freeze it with `selection_snapshots.create`. The receipt must preserve snapshot id, digest, exact count, rubric revision, workbook/worksheet/view ids and revisions, and excluded/unsure counts. Never freeze an approximate count, one page, or a live filter. Any row, rubric, or source-revision drift requires a new snapshot and review of the delta.

`records.unbound_rows_enroll` is the bounded canonicalization step for rows that still lack graph bindings. Run it only against the reviewed table and explicit identity columns with a stated limit. Preserve processed, bound, created, conflict, no-identity, remaining, and receipt counts. Conflicts and missing identities remain unqualified/manual-review; never treat a newly created graph binding as proof the row meets the rubric.

## Audience lifecycle

Saved audiences preserve the qualification contract, not a live guarantee that every future row qualifies. Preview exact filters, exclusions, nullable behavior, and sources before create/update. Archive only an exact inspected revision. Persona suggestions are prompts for judgment, never adopted silently.

Read criteria.md for formulation, scoring.md for calculation, and economics.md for the low-yield audit.

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

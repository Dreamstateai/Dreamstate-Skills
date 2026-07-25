# Outreach list and reactive table builder

## Job boundary

Own list sourcing, row identity, filters and exclusions, table shape, registered columns, dependency order, capped pilots, sample execution, and quality/cost audit. Never activate a campaign, enroll a row, send a message, or author cadence. Side-effecting actions remain workflow operations rather than recomputable columns.

## Source-first design

Translate the ICP into required criteria, preferred criteria, exclusions, geography, volume, acceptable approximation, and identity keys. Preserve those distinctions in every source search and audit. Search the complete live source capability set; do not recall a source, provider, field, column type, output, or price from this kernel.

When signal scarcity or provider quality is uncertain, design two or three small source pilots. Fetch every candidate's exact contract, then use `sources.cold_outbound_preview` for a standalone `outreach_source` test run. Bind only the reviewed targeting object and an integer `row_limit` from five through ten, set a positive credit ceiling, and provide no list, campaign, source, import, enrollment, or other durable destination. Compare actual coverage, freshness, precision, provenance, duplicate rate, and credit use before choosing the source path or designing any durable bundle.

Keep all three data gates distinct. The evidence pilot above leaves rows only in run evidence. After the draft bundle exists, a separate `table_column_run` executes selected columns on exactly five through ten current contacts. Only after both audits may a separately approved `outreach_bulk_expansion` use `sources.cold_outbound_expand` to import the capped resolved source result set into one exact list revision and stage that exact set for one still-inactive draft campaign. It carries the campaign id, list id and revision, configured source id, source-evidence run id, unchanged targeting, an integer eleven-through-fifty row cap for this release, exact-result-set flag, and required draft status. It is never another five-to-ten-row import.

## Dependency-complete table

Inspect the existing table revision when present. Preserve compatible identity and evidence fields; never overwrite user-authored data implicitly. Design a directed acyclic graph where every column declares:

- semantic purpose and distinct kind: source, profile or company enrichment, signal, deterministic function, AI generation, or display/qualification output;
- exact upstream inputs by symbolic column identity and exact output consumed;
- live capability id and digest when execution is involved;
- output type and compatibility with every downstream input;
- run condition, missing-input behavior, fallback, cache/recompute policy, provenance, expected cost, and side effects;
- required versus preferred status and visibility in the final review surface.

Use live discovery and exact get for every possible column kind. This is how newly registered signals, profile enrichments, functions, AI generation operations, and outputs become available without editing the skill. Do not flatten source, enrichment, and action into one primitive. Raw evidence remains traceable; derived values point back to the inputs and run that produced them.

For prioritization, make qualification explainable: preserve the criteria and evidence, produce a score or tier only through a fetched contract, include a reason, and define filters against that output. An AI-generated opener or summary must reference the exact qualified row outputs it consumes and must not run when required evidence is missing.

## Sample and handoff

Topologically validate the graph, references, types, filters, costs, and row identity before proposing. After the draft table revision exists, sculpt a separate `table_column_run` proposal for exactly five through ten rows. Run only that approved sample; then audit nulls, false positives, duplicate people/companies, approximate claims, provider conflicts, provenance, and per-qualified-row cost. Adding a column never implies that it ran. Independent verification is required when a source contract marks data approximate.

Return a typed handoff of at most 750 tokens: selected source path, evidence-run id, row identity, filters/exclusions, ordered column nodes with symbolic inputs/outputs, qualification output, sample evidence, proposed bulk cap, costs, unresolved risks, artifact revision, and capability digests. A pilot or sample is evidence, not a finished list or enrolled audience.

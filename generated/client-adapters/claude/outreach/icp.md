# ICP discovery and audiences

## Discovery before any search

Before calling any source or audience capability, establish these five things. Derive as many as you can from `brain.context.search` / `brain.context.get` (published workspace claims) and from `audiences.list` / `audiences.get` / `audiences.sources_list` (what already exists); ask only for what remains missing, in one structured question.

1. **Goal.** What will the user do with these rows: cold outbound, a warm re-engagement, a competitor-engager play. This changes which source and which required checks matter.
2. **What qualifies.** Drill into specifics, not adjectives. "Founders" is not specific; "founder or co-founder, current title, company under 50 employees" is.
3. **Narrow vs broad reading of vague terms.** When a request uses a vague category (for example "carwash operators"), ask which reading is meant: owners of carwash locations only, or the whole ecosystem including equipment vendors. Give the narrow and broad reading with an example each. Do not silently pick one.
4. **What disqualifies.** Deal-breakers are as important as qualifiers: competitors, existing customers, wrong geography, wrong seniority.
5. **Required vs nice-to-have.** Required = a real failure sets fit to 0 and hides the row. Nice-to-have = counts toward the score, never disqualifies on its own. Get this split explicitly; do not infer it from tone.

Never ask for outreach volume, sender, channel, tone, cadence, or copy angle at this stage. Volume defaults to demand-based (see fit-scoring-and-economics.md); sender and channel are launch bindings resolved later with `outreach.sender_context_accounts_list`.

## Audiences

`audiences.*` manages saved ICP definitions that stand on their own, independent of any one Workbook.

1. Read before writing: `audiences.list`, `audiences.get`, `audiences.sources_list` for what already exists and what sources back it. Never propose an audience that duplicates one already there.
2. `audiences.persona_suggestions` returns grounded candidate personas. Treat these as evidence to react to, never as canonical qualification rules the user hasn't confirmed.
3. `audiences.preview` shows the exact proposed filters, exclusions, source mappings, nullable behavior, and expected size before any durable write. Always preview before `audiences.create` or `audiences.update`.
4. Create or update directly once the server's zero-credit reversible decision authorizes it; no separate approval checkpoint for a reversible definition change.
5. `audiences.archive` takes an exact current audience id and revision. Never widen a target silently because a required filter came back unknown; report it as unknown instead.

Return audience id, revision, source bindings, preview completeness, exclusions, and any unavailable evidence in every audience handoff.

## Buyer research and the knowledge graph

Use the graph to ground an ICP claim in something durable, not to replace the discovery conversation.

1. Read `graph.contract_get` first so node/relation shapes are known before searching.
2. `graph.search`, `graph.traverse`, `graph.get_node`, `graph.get_relation`, `graph.edges_list` locate and inspect existing buyer research. `record_enrichment.get` pulls the underlying enrichment evidence for a node.
3. Never turn approximate or single-source research into a canonical graph fact without provenance. `record_enrichment.create` captures the evidence; `graph.create_node` / `graph.create_relation` only after that evidence exists and the shape validates against the contract.
4. Update only against the current revision (`graph.update_node`, `graph.update_relation`); a stale revision must be re-read, not forced.
5. `graph.archive_node` / `graph.archive_relation` / `graph.restore_node` change durable history: use them only after showing the user the impact and getting explicit confirmation, never as a routine cleanup step.
6. `graph.export` must preserve the exact authoritative scope and revision requested; never export a wider or narrower slice than asked.

Every graph-grounded claim in an ICP or source-testing decision should carry its node/relation id, revision, and confidence so a later disagreement can be traced back to real evidence, not assistant memory.

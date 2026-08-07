# Sources: test before you commit

## The core procedure

1. **Test first, at limit 10.** Call `table_sources.preview` (or the source-specific preview: `sources.cold_outbound_preview`, `sources.linkedin_post_engagers_preview`) with `row_limit: 10`. Do not create or attach the source yet. A preview has no durable destination and never lands a row.
2. **Scarcest criterion first.** If the target is "US companies, 10-50 employees, hiring for MCP roles", don't start from company filters (millions of matches). Start from the job-posting signal, the scarce one, then layer company size and geography on top. The scarce signal is what actually narrows the pool; broad filters just add noise to sort through.
3. **Test 2-3 parameter variants.** Read the ten rows in each. Are these the right entities? Is data quality acceptable? Tighten the winner, don't average across variants.
4. **Precision gate.** `precision = qualified / (qualified + not_qualified)`. `unsure` rows are excluded from that denominator entirely, they neither help nor hurt precision. Require at least 6 decided rows and precision strictly above 0.50 before creating anything durable from that variant. Below that, the variant failed the test: try another, or narrow the criteria, don't average it in.
5. Every terminal preview receipt carries exactly ten distinct stable identities, the raw provider payload, reasoning, provenance, freshness, and cost. Persist this evidence; it is what the post-batch audit and any later dispute point back to. Never pad short results with duplicate or synthetic rows to hit ten.

Once a variant clears the gate, attach it (`table_sources.attach`) to the Workbook's worksheet and only then run it for real (`table_sources.run`). `table_sources.list` and `sources.list` show what already exists in this Workbook and in the workspace catalog respectively, read them before proposing a new source that duplicates one.

## Canonical producer sources: cannot be started by hand

Some sources are owned by a canonical producer runtime: a LinkedIn engagement signal, a form submission feed, a product event stream, a contact import feed. These land rows only when their producer sends an event, not from a manual run call. `table_sources.run` against one of these either does nothing or is rejected outright, because there is no batch for it to execute; the rows show up on their own schedule.

If asked to force a fresh run of one of these, say plainly that it cannot be started by hand and name what actually controls it instead:

- **Signal sources** (`signal_sources.*`): configuration and its capture key (`signal_sources.capture_key_set`), and whether it is actively receiving events (`signal_sources.events_list`, `signal_sources.get`). `signal_sources.test_event` sends one real test event through the pipe and returns a real receipt, it is not a way to bulk-produce rows.
- **Contact-import and form/event feeds**: whatever upstream integration or CSV/API import is configured to push into them; there is no pull-side trigger to call.

Never claim a manual run against a producer-owned source succeeded. Report the correct lever instead.

## Signal sources and radar

1. Read before writing: `signal_sources.list`, `signal_sources.get`, `signal_sources.events_list` for what already exists and what it has actually observed.
2. `radar.signal_suggestions_get` returns grounded candidate signal types. These are candidates to react to, never automatic qualification truth; confirm with the user before building around one.
3. Create, configure, or delete only an exact source id and revision (`signal_sources.create`, `signal_sources.delete`). Never expose a capture key in plain text; set it only through `signal_sources.capture_key_set` and report readiness, not the key value.
4. Local zero-credit reversible configuration changes execute directly from the server decision, no separate approval checkpoint.
5. Preserve source id, type, status, event schema, freshness, completeness, and cost on every signal-source handoff.

## Competitor-engager sourcing

For "find people who engage with our competitors," load durable cited audience, offer, voice, and exclusion claims from the workspace wiki first, inspect any existing Workbook and exclusion mappings, then compare bounded named-competitor variants of `sources.linkedin_post_engagers_preview` by returned precision, provenance, freshness, and cost, same scarcest-first, 10-row, >0.50-precision discipline as any other source. `sources.cold_outbound_expand` performs the later capped exact-result expansion once the pilot and Workbook are both approved, never before.

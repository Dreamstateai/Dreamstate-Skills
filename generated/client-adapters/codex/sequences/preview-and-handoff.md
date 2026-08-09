# Real-row preview and exact handoff

## Accept only an exact enrollment receipt

The upstream handoff must name selection snapshot id, digest, exact count, stable row identity scheme, and workbook/worksheet/saved-view ids plus revisions. The sequence draft records these in `enrollment_source` and `enrollment_receipt`; they are evidence of intended input, not enrollment. `sequences.validate` must reject a mismatched digest, count, snapshot, or revision. If the receipt is absent or stale, stop and ask the data-plane owner to freeze a new selection—never replace it with a live query.

## Preview one actual qualified row

Read one row by stable id with `rows.get` (or resolve it from a bounded `rows.query`) and retain its source/evidence references. Resolve every merge field. For AI-written copy, use `outreach.ai_write_resolve` against that same row. Show the whole rendered step: subject when applicable, greeting, pitch paragraphs, CTA, sign-off, paragraph breaks, and any attachment reference. Mark fixed scaffold separately from variable slots.

A preview fails if it uses invented data, a generic persona, an unresolved token, a row outside the frozen selection, or a claim without row/workspace evidence. `null` and conflicting fields follow the step's declared fallback/skip/manual-review policy. Do not turn unknown evidence into a flattering guess.

## Sender and stop readiness

Before binding, read live LinkedIn senders, mailboxes, settings/usage, and send schedule. Report sender ids, health, verification/ramp state, today's consumed usage, remaining headroom, timezone/window, and whether `reply`, `bounce`, and `unsubscribe` exit rules exist. A suppressed row is refused across every channel. A reply exit stops automation; it does not itself answer the reply.

Validate the exact definition after the preview. Bind only the reviewed draft with expected version. The receipt proves `validated` and `bound`; it never proves published, enrolled, queued, sent, or delivered.

# Retrieval

## Targeted retrieval

1. Determine the smallest required folder, access scope, and acting member before issuing any read. A broad, unscoped search wastes a turn and risks surfacing content the caller cannot act on.
2. Use `brain.context.browse` to enumerate the folders and files permitted to the caller, then `brain.context.search` with a narrow query and node types. Search before you ask the user anything: never ask for something the wiki already answers, and never re-ask something the user has already told you.
3. Use `brain.context.get` for each selected exact `node_ref` and published `revision_id`. Never synthesize an identifier or a revision id, and never guess at content the read did not return.
4. Preserve the returned `node_ref`, `revision_id`, `content_digest`, provenance, and deep link exactly as returned. These are the only handles later writes and lifecycle mutations may bind to; a paraphrased or remembered id is not a valid handle.
5. Private prose belongs in owner-bound folders. If the user explicitly selects another authorized member's folder, pass that exact `subject_user_id`; otherwise let acting-member policy apply and never infer another owner from context.

## Reading your own writes back

An exact read is the only evidence a write landed. After any proposal, publish, or lifecycle mutation, read the exact document, folder, or backlinks back from canonical state before reporting success. Reporting success from the request you sent, rather than from a subsequent read, is exactly how a rejected or still-pending change gets misreported as done.

When you do have to ask the user something, the answer is a durable fact: record it in the same turn rather than letting it live only in the conversation. A fact you only stated in chat is lost the moment the turn ends; a fact in the wiki is not.

## Impact and dependency reads

Use `brain.context.graph` or `brain.graph.neighborhood` before a change when dependency impact matters, for example before revising a file another part of the product may bind to by role (see `writing.md` for roles). These are read-only inspections; running them commits nothing and requires no approval.

Use `brain.evidence.search` for bounded evidence spans when you need to back a claim with a citable excerpt rather than a whole document.

## Reporting pending and historical state

Use `brain.context.list_proposals`, `brain.context.preview_agent_view`, and `brain.context.history` to report pending work, the exact agent-visible result, and revision history respectively. These are the only sources of truth for "is anything already in flight on this document": do not infer pending state from what you personally proposed this turn, since another actor may have a proposal open that you have not read.

## Backlinks as inspection

Use `brain.context.backlinks` as a read-only inspection of committed incoming links to one exact `node_ref`. Preserve its stable cursor when paginating rather than restarting from the first page. A backlink read never authorizes a lifecycle mutation on its own; it is context for deciding whether one is safe (see `lifecycle.md`).

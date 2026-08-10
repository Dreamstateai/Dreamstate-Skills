# Writing

## What belongs in a file vs conversation

Route a durable fact to the file that owns it. Knowledge about the business, its market, its buyers, or its offering belongs in the topic file for that subject. Cross-cutting operating facts, meaning how this user wants you to work, what they have told you to always or never do, and the terms they prefer, belong in a general file kept for that purpose; `memory.md` at the root is the conventional name, and it is an ordinary file read and written the same way as any other, not a special capability. Whether a change was published is revision state, not knowledge, and belongs in neither: read it from `brain.context.history` instead of recording it in a file, since a write is always already published the moment it succeeds.

## Roles and bindings

The tree is free-form beyond the five protected roots; choose filenames from the evidence, not from a template.

Some knowledge has a stable role that other parts of the product bind to by name, even when its file may have any name: `product_information` for the product or offering, `ideal_customer` for the ideal customer, `competitor_analysis` for the competitive position, and `brand_voice` for the voice. When you create or revise a file that carries one of these roles, record the role alongside its path so the binding resolves. Do not rename an existing file to match a role; record the mapping instead, since a rename changes the id other parts of the product may already reference.

A role points to exactly one file at a time. Two files claiming one role are a conflict to surface to the user, never one to resolve silently by picking one. Roles are for binding, not structure: never create an empty file just to fill a role.

## You author and publish directly

You own completing the work you were asked to do, including publishing it, not clearing every change with a human first. Creating a folder, creating a document, and saving+publishing a revision to an existing document are direct actions: they take effect immediately and carry no built-in review step. The discipline that matters is upstream of that: search first, connect the new page to what already exists, cite where every fact came from, and confirm the write landed. You still never review, approve, or reject anything, because a direct write has nothing pending to approve.

1. Search first. Use `brain.context.search`, then `brain.context.get` when an exact file may already hold the knowledge. Never author a duplicate of a file that already exists; revise the existing one instead.
2. There is no capability that registers a source separately, neither `website_source_register` nor `register_source`. Do not substitute another capability for this step. Carry the source's URL and observation date forward yourself and cite them directly in the provenance line when you write the content (see Provenance below).
3. For genuinely new organization, use `brain.context.create_folder`. This creates the folder immediately; it needs a parent path (root is valid) and a title, nothing more.
4. For genuinely new knowledge, use `brain.context.create_document` against a non-root parent folder, with the full body as content. It creates the document and publishes it in the same action, so once it succeeds the page is canonical, not a draft awaiting review. It also requires `related_paths`, at least one address of an existing published document to link the new page to, so it is reachable by search-then-walk instead of becoming an orphan; the one exception is the very first document in an otherwise empty workspace, and that exception is checked against live workspace state, never assumed from the request. Use `brain.context.browse` to check whether the workspace already has a published document when you are unsure.
5. For an existing file, use `brain.context.get` to read its exact current content and revision (see `retrieval.md`), then replace the relevant part and save it back with `brain.context.save_revision`. This always publishes the new revision immediately; there is no unpublished-draft state to hold a change back in, so only save once the content is ready to be live.
6. Read the document, folder, or listing back after any write, before reporting success (see `retrieval.md`). A capability returning success is not itself the confirmation; the follow-up read is.

Prefer the smallest number of high-value new folders and files for the request at hand. Do not under-cover what the request actually needs, but do not create speculative pages nobody asked for either.

## Reserved documents

`index` and `log` are reserved titles, at any case or with a trailing `.md`, checked by the platform itself: `brain.context.create_document` and `brain.context.rename_document` refuse either title before the write happens. Do not retitle a request to route around the refusal; the catalogue and the append-only record are system-maintained, not pages you author or revise. Never propose reusing one of these titles for ordinary knowledge, and never explain a naming refusal as if it were your own convention rather than a platform rule.

## There is no reviewable, pending path

`brain.context.create_document` and `brain.context.save_revision` are the only ways to write, and both publish atomically: there is no propose-then-approve step, no pending-review state, and no capability that holds a change back for a human to approve before it goes live. If a user asks to review a change before it goes live, tell them plainly that a write publishes immediately, and either hold off writing until they confirm the content, or write it and point them at `brain.context.history` and `brain.context.restore_document` (see `lifecycle.md`) so they can revert it themselves if it is not right. The safety property here is recoverability, not pre-publication review: every write is a new revision, the prior revision is retained, and `restore_document` reverts to it.

## Provenance

Every file you write carries a provenance line naming where each fact came from: `Source: <url> fetched <date>` for fetched evidence, or an explicit statement that the content is your own inference. Content you inferred must say so in the file. Provenance lives in the Markdown itself; there is no separate citation ledger and no hidden context, so a file with a claim and no provenance line is an incomplete write, not a stylistic choice.

## When a write is refused

A direct write can still be refused, for example on inactive workspace membership or a stale revision. Do not retry the same call unchanged, and do not narrate an apology: read the current state again, resolve what actually changed, and retry with the corrected exact ids and revision, or report the typed refusal if it does not resolve. Falling back to the reviewable path is not a workaround for a refusal; it changes what the action does, not just who approves it, so only use it when the user actually wants review.

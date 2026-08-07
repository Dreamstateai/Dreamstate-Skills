# Publishing lifecycle

## Two id spaces: article vs artifact

An article has two identities that matter. `content.article_get`, `content.article_list`, `content.article_update`, `content.article_delivery_create`, `content.article_duplicate`, and `content.article_archive` key off the article id. Every article object returned by a read or write also carries `content_artifact_id`: that is the id `content.schedule`, `content.unschedule`, `content.submit_review`, `content.approve`, `content.approval.submit`, `content.approval.decide`, `content.approval.authorize_publish`, `content.replacement_create`, and `content.delete_republish_propose` require. These six-plus capabilities were built against the same underlying artifact row a social post uses; an article's `content_artifact_id` points at a real row in that table, so calling them against it is a legitimate, functional operation, not a no-op. Read the article first, take its `content_artifact_id` from the response, and pass that, not the article id, to any of the artifact-scoped calls below.

## Platform values are not the same string everywhere

The article capabilities in this file (`content.article_create_schedule`'s and `content.article_update`'s `target_platforms`, and `content.article_delivery_create`'s `platform` field when `kind: 'native_article'`) accept `'linkedin'` or `'twitter'`. Short-form social capabilities elsewhere (a post's own `platform`, and the connected-account `platform`/`provider` fields) accept `'linkedin'` or `'x'`, not `'twitter'`. These are two different enums on two different capability families, not a typo: passing `'twitter'` to a short-form social call or `'x'` to an article call is a validation failure, not an accepted synonym. Match the literal to the capability you are actually calling, never assume one universal platform name.

## The state machine

1. `content.article_create_schedule` creates the article, its linked artifact, an initial version, and delivery scaffolding in one transaction, with its own schedule-time parameter. There is no separate bare-draft create; this is the only way an article comes into existence. This call does not require prior approval.
2. `content.article_update` revises it. Every call needs `expected_revision`; a stale value throws `article_revision_conflict` (re-fetch with `content.article_get` and reapply). A call made while a delivery is in flight throws `article_delivery_in_flight`. A slug collision throws `article_publish_slug_conflict`. Whether an edit here invalidates a prior `content.approve` on the linked artifact, the way an artifact-domain edit does, was not verified; treat approval as unconfirmed after any edit and re-check before relying on it.
3. `content.submit_review` moves editorial state to in-review on the linked artifact. It does not touch scheduling, approval, or delivery; a piece can sit in review indefinitely.
4. `content.schedule` sets the artifact's scheduled publish time; `content.unschedule` withdraws it. This step is reversible right up until delivery actually fires. Both act on the artifact id, not the article id.
5. Before creating a delivery, confirm the destination is actually usable: `content.destinations_list` for what's configured, `content.destination_test` for whether it currently works. Do not create a delivery against a destination you have not checked.
6. `content.article_delivery_create` creates a delivery attempt, not a publish. Three kinds behave differently: `native_article` is a handoff by default (direct publish only for destinations with the required scopes), `content_destination` (Webflow, Framer, a webhook) is always async, `external_copy` is handoff-only. Reusing an idempotency key with a different payload throws `idempotency_key_reused`; only reuse a key for a deliberate retry of the exact same request.
7. `content.delivery_publish` is the actual outward publish, keyed to a `delivery_id` (a third id, distinct from both article id and artifact id, returned by `content.article_delivery_create`). It is irreversible. `trigger: 'explicit'` can fire immediately, bypassing the scheduled time, so only pass it when the user has actually asked for an immediate publish. Show the exact final content to the user before this call. It returns a receipt; forward the provider and external id exactly as returned, never construct or guess one.
8. After publish, whether `content.article_update` on that piece throws `published_immutable` the way an artifact-domain edit does was not verified in the underlying article-update path; do not assume either way. If an edit to a published article is refused, or if you are unsure whether it will be, use `content.replacement_create` instead of retrying the update (see below).

## Approval: an optional, workspace-chosen pipeline, not a system gate on publish

`content.approve` and `content.approval.submit` / `content.approval.decide` / `content.approval.authorize_publish` are two separate mechanisms, easy to conflate:

- `content.approve` is a single lifecycle flip on the artifact: it is reversible and, per its own classification, "moves the artifact lifecycle state only... the artifact stays editable throughout." It is not authorization to make anything public. Use it when the workspace's own convention is "one person marks this approved before it can be scheduled."
- `content.approval.submit` (request sign-off from named approvers) → `content.approval.decide` (an approver records `approved` or `changes_requested`) → `content.approval.authorize_publish` (a final recorded publish-authorization decision) is a separate, multi-step audit trail. Use it for a workspace that wants a recorded chain of named reviewers before anyone treats a piece as ready, not as a step every piece must pass through.

Neither family is checked by `content.delivery_publish` before it runs: `content.delivery_publish` carries no system-enforced approval requirement. `content.approval.authorize_publish` is classified as irreversible and paired with `delivery_publish` under the same publish-consequence action, but it records a decision; it does not call `delivery_publish` for you and `delivery_publish` does not look it up. So: if the user or workspace convention says a piece needs sign-off, run the pipeline (or call `content.approve`) and say so explicitly before scheduling or delivering. If the request is a routine piece with no stated review requirement, `content.submit_review` followed directly by `content.schedule`/`content.article_delivery_create`/`content.delivery_publish` is the correct, complete path; do not invent an approval requirement that was not asked for.

## Replacing an already-published article

`content.replacement_create` is the real path for changing a piece that is already live: it requires the artifact to already have a delivery with `status: 'published'`, and it creates a new, separate artifact (`status: 'proposed'`) linked to the original via a `replaces` relation. It does not edit the live artifact and does not publish by itself; a fresh `content.article_delivery_create` / `content.delivery_publish` pair is still needed to actually put the replacement out. `content.delete_republish_propose` is the same mechanism with `mode: 'delete_and_republish'`: it additionally removes the old provider object where supported, losing existing engagement continuity, versus `replacement_create`'s `mode: 'replacement'`, which leaves the original object and its engagement intact and simply supersedes it. Use `delete_and_republish` only when the user has said the old version should not remain live alongside the new one.

This is the correct path once something is published. Before publish, `content.replacement_create` refuses (it requires a prior published delivery), so reverting a not-yet-published draft still goes through `content.version_get` / `content.version_diff_get` to retrieve the prior content, applied deliberately with `content.article_update`. There is no `content.version_rollback` capability available to this skill either way.

## Reading state without changing it

`content.article_get`/`list`/`enabled_get` for current article state; `content.article_deliveries_list`, `content.article_delivery_payload_get`, `content.article_distribution_get` for what was actually sent and where. Use these before answering any question about status, and before deciding whether a new delivery, a replacement, or an update is the right next action. None of these calls change state; reach for them freely.

## Versioning is explicit, not automatic

`content.article_update` does not snapshot a version by itself. Call `content.version_create` deliberately when a version boundary matters (before a substantial rewrite, before publish, at the user's request). `content.versions_list` and `content.version_get` read history; `content.version_diff_get` compares two explicit version numbers and returns the from/to content and a diff summary.

## Duplicate and archive

`content.article_duplicate` clones an article, including its assets, and is idempotency-key protected against double-firing; if a duplicate is partially created and fails, it self-heals by archiving the partial copy rather than leaving an orphan. `content.article_archive` removes an article from active circulation without deleting it. Neither is a substitute for `content.unschedule`: archiving a scheduled or in-flight piece does not by itself stop a delivery already in progress.

## The metadata trap

`publish_metadata_json` and `schema_json` fields are checked for secret-shaped keys and for `__proto__`/`constructor`/`prototype` and rejected if found. Do not work around a rejection by renaming a key to dodge the check; if a value looks like a credential or a secret, it does not belong in publish metadata at all.

## Traps that cost real consequences

- Calling `content.delivery_publish` with `trigger: 'explicit'` because it was the fastest path, when the brief or the user only asked to schedule. That bypasses the scheduled time and publishes now.
- Treating `content.submit_review`, `content.approve`, or the approval pipeline as if any of them schedules or publishes. None of them do; only `content.delivery_publish` does.
- Assuming a piece needs the multi-step approval pipeline when nothing in the request or workspace convention asked for one; `content.submit_review` then direct delivery is the normal path.
- Passing an article id where an artifact id is required (`content.schedule`, `content.approve`, `content.replacement_create`, and the rest of the artifact-scoped calls). Read the article first and use its `content_artifact_id`.
- Retrying a failed `content.article_delivery_create` with a new idempotency key instead of investigating the original failure; this can create two live deliveries for the same content.
- Skipping `content.destination_test` before the first delivery to a destination and discovering the failure only after `delivery_publish` returns an error on what the user believes already went out.
- Calling `content.replacement_create` on a piece with no published delivery yet; it refuses. Use the version-read-and-reapply path instead for anything still unpublished.

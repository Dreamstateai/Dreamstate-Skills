# Webhook operations

Manage workspace webhooks without exposing or requesting secrets in chat.

## Read before you change anything

List current endpoints and delivery evidence first with `webhooks.list`, `webhooks.deliveries_list`, and `webhooks.delivery_get`. Preserve the exact webhook id, destination, subscribed event set, status, revision, delivery timestamps, response classification, and deep link on every subsequent call. Redact credentials and payload secrets from anything you report back.

## Create and delete are scoped to exactly what was asked

`webhooks.create` and `webhooks.delete` are real writes. Create only the exact endpoint and event set the user named; do not add events they did not ask for even if they seem related. Delete only the exact webhook id the user identified, after reading it back with `webhooks.list` to confirm it is the one they mean, since `webhooks.delete` is destructive and not recoverable by re-listing. If a correction arrives on the next turn reversing a create you already made, delete the one you created rather than leaving a duplicate or creating a second endpoint on top of it.

## Test delivery is a real external call, not a simulation

`webhooks.test_delivery` enqueues a real delivery that a worker later actually sends to the destination URL; the capability's own response only confirms enqueue (`enqueued: true`), it does not return a delivery id or the destination's response inline. Do not claim the test succeeded from the enqueue response alone. Follow up with `webhooks.deliveries_list` or `webhooks.delivery_get` to read the actual delivery outcome before reporting success or failure. Never test a webhook the user did not name; testing without an exact governed webhook id is not permitted, since it would be firing a real request at an unconfirmed destination.

## What follows the server decision directly

Listing endpoints and delivery history is zero-credit and reversible: read it directly. Creating or deleting a local endpoint configuration is zero-credit and reversible in the sense that it can be undone by another create or delete, so it follows the platform's own decision without you adding an extra approval step on top. A test delivery has a real external consequence at the destination, so treat its enqueue and its result as two separate facts and report only what each call actually returned.

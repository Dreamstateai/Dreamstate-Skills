# Webhook operations
<!-- architect-operation-contract
{"required_capability_ids":["webhooks.create","webhooks.delete","webhooks.deliveries_list","webhooks.delivery_get","webhooks.list","webhooks.test_delivery"]}
-->

Manage workspace webhooks without exposing or requesting secrets in chat. List current endpoints and delivery evidence first. Preserve webhook ID, exact destination identity, subscribed events, status, revision, delivery timestamps, response classifications, and deep link; redact credentials and payload secrets.

Create or delete only the exact endpoint and event set requested. Test delivery is an external effect: use the server ActionDecision for its exact destination and consequence, retain its provider receipt, and never claim success from enqueue alone.

Zero-credit reversible local configuration follows the server decision directly. External test delivery requires the consequence decision the live contract specifies.

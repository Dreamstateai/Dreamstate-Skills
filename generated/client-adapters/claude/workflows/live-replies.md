# Live replies and external sends

Use `outreach.dm_conversations_list` to inspect the queue, `outreach.dm_conversation_by_contact_get` when the subject is known by contact id, and `outreach.dm_conversation_get` when the conversation URN is known. Always fetch the full current history before drafting. A sequence scaffold is not a reply template: ground the response in the prospect's actual words and verified workspace facts.

Sending requires explicit approval for the exact body that will leave the workspace. Call `outreach.dm_message_send` with the exact `conversation_urn`, approved `body`, and a fresh UUID `client_request_id` for that one intended send. Never reuse a request id for different copy, and never treat a transport timeout as permission to issue a new send.

Preserve the send's terminal external-effect receipt. If the result is missing or unknown, reconcile the conversation and durable run trace before retrying; an unresolved non-idempotent outcome routes to manual review. Only after the send is confirmed may `outreach.dm_conversation_read` or `outreach.dm_conversation_status_update` advance the conversation lifecycle. A read or status change is never evidence that a reply was sent.

Suppression, consent, cooldown, and sequence `reply` exits remain hard gates. A live workflow may not route around them through another sender or channel.

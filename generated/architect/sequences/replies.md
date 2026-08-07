# Replies

## Sequence-level suppression is automatic; reading and answering a reply is a real, in-scope action

Reply *classification* (is this a genuine reply, an unsubscribe, an out-of-office auto-reply, or something needing manual review) and the automatic suppression that follows an unsubscribe-classified reply both run entirely outside this skill's capabilities, in a background process. This skill cannot inspect that classification, cannot force a reply to be reclassified, and cannot manually trigger suppression from a reply. But once a reply exists as a conversation, reading it and sending a response are real capabilities this skill has, and answering a prospect who replied is core to running a sequence well, not an afterthought.

## The conversation capabilities and exactly what each takes

- `outreach.dm_conversations_list`: lists conversations. Optional `source`, `sort`, `limit`, `search`. Use this to find which conversations are open or need attention; do not assume a default sort order without checking what the list actually returns.
- `outreach.dm_conversation_get`: one conversation's full message history, by `conversation_urn`.
- `outreach.dm_conversation_by_contact_get`: the conversation tied to a specific contact, by `contact_id` (uuid). Use this when the user names a person rather than a conversation.
- `outreach.dm_conversation_read`: marks a conversation read, by `conversation_urn`. A read-state update, not a reply.
- `outreach.dm_conversation_status_update`: updates a conversation's status, by `conversation_urn` and `status`. Use to move a conversation through its lifecycle (for example, mark it engaged or archived) after triaging it, not as a substitute for actually replying.
- `outreach.dm_message_send`: sends the actual reply. Takes `conversation_urn`, a required `client_request_id` (uuid, generate a fresh one per send so a retry cannot double-send), and `body`. This is outward-facing and irreversible the moment it is sent: put the exact body in front of the user before sending, the same as any other outward message. There is no dry run for it.

## Reading before replying is not optional

Fetch the conversation with `dm_conversation_get` (or `dm_conversation_by_contact_get` when only the contact is named) before drafting a reply. A reply written without reading what the prospect actually said is exactly the kind of generic, ignored-your-message response that damages a relationship a cold sequence just spent several steps building. Ground the reply in the prospect's actual words and in cited workspace facts (`brain.context.search`/`brain.context.get`), not in the original sequence's fixed scaffold: a reply is a live conversation, not another scaffolded step, so the fixed-scaffold rule in message-copy.md does not apply here.

## The sequence's own `exit_rules` still matters

The only lever the sequence definition itself has over replies is whether `reply` is in `exit_rules` (see steps-and-timing.md). That controls whether the automated sequence keeps sending scheduled steps to someone who has replied; it does not draft or send the actual response to that reply. Both need to be true for a sequence to behave well: `reply` stops the automation, and a human-reviewed message sent through `dm_message_send` answers the person.

## A worked failure case

A user builds a three-step email sequence (intro, wait 3 business days, follow-up) and sets `exit_rules: ["completion", "bounce"]`, leaving `reply` out. A prospect replies after step 1. Because `reply` is not an exit condition, the follow-up in step 2 still fires on schedule: the prospect gets a "just following up" message on top of a reply they already sent, on the same channel this skill can read and answer. Flag a missing `reply` exit proactively on any multi-step sequence being reviewed or authored, and check whether the conversation that triggered it has actually been answered rather than just detected.

## When a user asks for reply rates, reply-volume analytics, or classification accuracy

Those are aggregate/analytics questions, not something `dm_conversations_list` or `dm_conversation_get` compute. Say plainly that classification and rate metrics live outside this skill's capabilities and route the question to whatever surface owns outreach analytics, rather than deriving a rate by hand-counting conversations or fabricating a number.

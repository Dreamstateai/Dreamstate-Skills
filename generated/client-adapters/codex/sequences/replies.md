# Replies

## Sequences owns the exit rule, not the live conversation

Author `reply` in `exit_rules` whenever a response must stop later automated steps. This skill can validate that structural rule, but it does not read conversations, change conversation status, send a reply, classify responses, or reconcile an external-send receipt. Those runtime actions belong to `workflows`.

A reply is a live event against a published sequence version, not another draft step. Hand Workflows the exact sequence/version, subject identity, stable reply event identity, and any reviewed response intent. Workflows must read the actual conversation before drafting or sending, enforce suppression and consent gates, obtain approval for the exact body, and preserve the terminal external-effect receipt.

If `reply` is missing from a multi-step definition, flag it before binding: a scheduled follow-up could otherwise fire after the prospect has already responded. Adding the exit rule prevents later sequence steps; it does not answer the person.

Reply-rate, reply-volume, and classifier-accuracy questions route to `analytics`. Do not list or hand-count conversations to manufacture an aggregate.

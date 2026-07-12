---
name: connect
description: "Connect this agent to Dreamstate and verify it can act. Use this FIRST, before any other Dreamstate skill, and any time a Dreamstate tool call fails with an auth or 'not connected' error. It checks the MCP connection, walks the OAuth sign-in if needed, lists which tools are available, and confirms the workspace and connected LinkedIn/X accounts so later playbooks don't fail halfway through."
---

# Connect Dreamstate

Dreamstate is the engine that lets you actually *do* things in the real world that
you cannot do on your own: post to LinkedIn and X, enrich leads, build a lead table,
send connection requests and replies, run AI-visibility probes. You reach it through
the Dreamstate MCP server. This skill makes sure that connection is live and that you
have the permissions and accounts the other playbooks assume. Running it first turns a
mid-task "couldn't connect" into a clean check up front.

## When the MCP server is not configured yet

If you have no Dreamstate tools available at all (no `ping`, no `outreach_*`), the
MCP server has not been added to this agent. Tell the user to run, in their terminal:

```
npx dreamstate-skills install
```

That writes the MCP connection for this agent and copies the skills. After it
finishes they restart the agent and run this skill again. Do not try to write the
config yourself; the installer handles the per-client format and never asks you to
paste a key.

## Step 1: Is the connection alive?

Call `ping` (optionally with `message`). A `pong` reply means the transport works
and tells you which workspace the key resolves to. Report that workspace name back
to the user so they know which account they are acting in.

If `ping` returns an authentication error, the agent client needs to sign in. The
Dreamstate server uses OAuth, so your client will surface a sign-in link or prompt
on the next call. Tell the user: "Dreamstate needs you to sign in. Approve the
sign-in popup your agent shows, then ask me to continue." Do not ask the user to
paste an API key into the chat. Once they have approved, retry `ping`.

## Step 2: What can you actually do?

Tool visibility is scoped to the key. A playbook that needs to send will fail if the
key is read-only, so find out now. Probe lightly:

- `outreach_lists` — confirms outreach read access and shows existing lists.
- `content_list_accounts` — returns the connected LinkedIn and X accounts, each with
  a health flag.

Summarize for the user in plain language: which domains are available (outreach /
content / visibility), and whether write/send scopes are present. If a domain's tools
are missing, that key does not have that scope; say so rather than guessing.

## Step 3: Are the accounts ready to act?

Most outreach and social playbooks need a healthy connected account to send from.
From `content_list_accounts`, report:

- The connected LinkedIn account(s) and their health.
- The connected X account(s) and their health.

If an account is unhealthy or none is connected, the user must reconnect it in the
Dreamstate dashboard before sending. Flag that now: "You have no healthy LinkedIn
account connected, so any send step will be blocked until you reconnect one in
Dreamstate." Better to say it here than to have `outreach_send_*` or
`content_publish_post` return `blocked` later.

## Report

Close with a short status the user can trust:

```
Dreamstate: connected  (workspace: <name>)
Scopes:     outreach read+write+actions, content read+write+actions, visibility read
Accounts:   LinkedIn "<name>" healthy · X "<name>" healthy
Ready for:  /outbound, /social-calendar, /ai-visibility
```

If anything is missing, say exactly what to fix and where, then stop. A clean
connection is the whole point of this skill; do not proceed into a sending playbook
on a half-broken connection.

## Package resources

- Read [references/operating-guide.md](references/operating-guide.md) for mode-specific boundaries, evidence rules, and recovery.
- Read [examples/example.md](examples/example.md) before the first execution or recommendation.
- Use [evals/contract.json](evals/contract.json) to check routing, approval, and durable-verification behavior.

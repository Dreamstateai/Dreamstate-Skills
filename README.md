# Dreamstate Skills

**Give your coding agent hands.** Claude, Cursor, and Codex can already think and
write. They can't post to LinkedIn, enrich a lead, send a connection request, or run
an AI-visibility probe. Connect Dreamstate and they can.

This is an open-source library of agent skills (playbooks) that drive the
[Dreamstate](https://trydreamstate.com) engine to do real outreach, SEO/GEO, and
social-media work at scale, with the actual sending paced under per-account safety
caps you can't bypass.

```bash
npx dreamstate install
```

> **Requires a Dreamstate account.** The skills are MIT-licensed and free; the
> execution runs through your Dreamstate workspace. One connect, one bill, batteries
> included — no separate Apollo / Hunter / Instantly keys to wire up.

## What you get

One install drops these playbooks into your agent and connects it to the Dreamstate
MCP server. Then you just ask:

| Skill | Ask it for | Drives |
|-------|-----------|--------|
| `/dreamstate-connect` | "connect to dreamstate", "is this working" | health check + OAuth sign-in |
| `/dreamstate-outbound` | "run a LinkedIn campaign", "book demos", "prospect X" | source → enrich → score → sequence → launch |
| `/dreamstate-reply-triage` | "check my replies", "work my inbox" | classify + respond + set pipeline status |
| `/dreamstate-enrich-list` | "enrich these leads", "score my list" | firmographics + ICP scoring (no sending) |
| `/dreamstate-social-calendar` | "plan my content", "schedule a week of posts" | generate + schedule LinkedIn/X posts |
| `/dreamstate-ai-visibility` | "do AI assistants cite us", "GEO audit" | visibility probe → gap analysis → publish content |
| `/dreamstate-multichannel` | "warm up this audience", "ABM play" | content + outreach against one list |

## How it works

```
  npx dreamstate install              your agent (Claude / Cursor / Codex)
        │                                    │
        │ writes MCP config + skills         │ first tool call → sign in (OAuth)
        ▼                                    ▼
  .mcp.json / mcp.json / config.toml  ──►  mcp.trydreamstate.com
        │                                    │
        ▼                                    ▼
  /dreamstate-* skills on disk         48 tools: outreach_* · content_* · visibility_*
                                       (sends paced under per-account caps)
```

- **The skills are playbooks, not tool wrappers.** They encode the strategy — ICP
  scoring, opener frameworks, cadence design, reply triage — on top of the raw tools.
- **Connect is one click.** The installer writes the config; sign-in happens in your
  agent over OAuth. No API key is ever pasted into a file or a chat.
- **Cross-platform.** Skills install for Claude, Cursor, and Codex. (In Claude, the
  playbooks also appear as native MCP prompts; Cursor and Codex use the installed
  skill files.)

## Install for a specific agent

```bash
npx dreamstate install --claude
npx dreamstate install --cursor
npx dreamstate install --codex
```

Re-running is safe — it merges into your existing MCP config (never clobbering other
servers) and refreshes the skills in place.

## Repo layout

```
playbooks/             Single source of truth — one .md per skill (frontmatter + body)
skills/<cat>/<tier>/   Generated, committed skill tree (goose-skills layout):
  <slug>/SKILL.md         the playbook the agent runs
  <slug>/skill.meta.json  slug, category, tags, installation, tools_used, scopes
skills-index.json      Generated catalog the install CLI reads
src/catalog.json       Pinned snapshot of Dreamstate MCP tools + the scope each needs
scripts/build.mjs      playbooks/ -> skills/ + skills-index.json + dist/ MCP prompts
bin/cli.mjs            npx dreamstate install
dist/                  MCP-prompt artifacts the Dreamstate server vendors
```

The generated tree is committed and CI fails if it drifts from `playbooks/`, so the
playbooks and every published surface can never diverge.

Add or improve a playbook? See [CONTRIBUTING.md](CONTRIBUTING.md). Every playbook is
validated against the tool catalog in CI, so a skill that references a tool that
doesn't exist can't merge.

## License

MIT. The Dreamstate engine and your data are governed by your Dreamstate account.

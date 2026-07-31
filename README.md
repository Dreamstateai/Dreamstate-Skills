# Dreamstate Skills

**Give your coding agent hands.** Claude, Cursor, and Codex can already think and
write. They can't post to LinkedIn, enrich a lead, build a lead table, send a
connection request, or run an AI-visibility probe. Connect Dreamstate and they can.

This is an open-source library of agent skills (playbooks) that drive the
[Dreamstate](https://trydreamstate.com) engine to do real outreach, SEO/GEO, and
social-media work at scale, with the actual sending paced under per-account safety
caps you can't bypass.

```bash
npm install dreamstate-skills      # or: npx dreamstate-skills install
```

> **Requires a Dreamstate account.** The skills are MIT-licensed and free; the
> execution runs through your Dreamstate workspace. One connect, one bill, batteries
> included — no separate Apollo / Hunter / Instantly keys to wire up.

## The outbound pipeline (and the rest)

The outreach skills are a pipeline of stages, modeled on how a SDR team actually
works. Each stage is a skill you can run on its own, or chain through `/outbound`.
The agent builds a **Clay-style table in Dreamstate** — one row per person, the
columns you want — and each stage reads and writes that table.

```
/signal-scraper  →  /enrich-list  →  /lead-prioritizer  →  /hook-writer  →  /sequence-builder  →  /outbound
   source rows       build table        score vs ICP         write openers      build cadence        enroll + launch
                     + firmographics     (icp_fit column)     (opener column)    (validated graph)    (capped sends)
```

| Skill | Ask it for | Stage / role |
|-------|-----------|--------------|
| `/connect` | "connect to dreamstate", "is this working" | health check + OAuth sign-in (run first) |
| `/signal-scraper` | "find leads", "who's hiring / raised", "source a list" | source rows into a list by buying signal |
| `/enrich-list` | "enrich these leads", "build a lead table", "map my CSV" | build the Clay table + firmographics |
| `/lead-prioritizer` | "score my leads", "prioritize this list", "tier them" | ICP score + reason, written per row |
| `/hook-writer` | "personalized openers", "first lines", "icebreakers" | one opener per row, saved to a column |
| `/sequence-builder` | "build the sequence", "design the cadence" | wire + validate the campaign step graph |
| `/outbound` | "run a campaign", "book demos", "prospect X" | orchestrate the whole pipeline + launch |
| `/campaign-optimizer` | "why isn't my campaign working", "improve reply rate" | diagnose a live campaign + pause/tune |
| `/reply-classifier` | "classify my replies", "triage who responded" | label inbox by intent + set status (no send) |
| `/reply-triage` | "check my replies", "work my inbox" | classify + respond + assign (sends, capped) |
| `/network-grow` | "grow my network", "send connection requests" | personalized connects, no DM sequence |
| `/social-calendar` | "plan my content", "schedule a week of posts" | generate + schedule LinkedIn/X posts |
| `/blog-writer` | "write a blog post", "publish an article" | draft → AI-generate → review → publish |
| `/ai-visibility` | "do AI assistants cite us", "GEO audit" | visibility probe → gap analysis → publish |
| `/multichannel` | "warm up this audience", "ABM play" | content + outreach against one list |

## Bring your own ICP and data

- **ICP:** copy [`config/icp.example.json`](config/icp.example.json) to `icp.json` and
  edit it. The scoring and copy skills read it; without it, the agent just asks you.
- **Your leads:** point the agent at a CSV or paste. See
  [`references/input-columns.md`](references/input-columns.md) for how your columns map
  onto a Dreamstate row. Only a name is required; everything else is enriched or a
  custom column.

## How it works

```
  npx dreamstate-skills install        your agent (Claude / Cursor / Codex)
        │                                    │
        │ writes MCP config + skills         │ first tool call → sign in (OAuth)
        ▼                                    ▼
  .mcp.json / mcp.json / config.toml  ──►  mcp.trydreamstate.com
        │                                    │
        ▼                                    ▼
  skills on disk                       8 compact gateway + run-control tools
                                       (explicit canonical capability IDs)
```

- **The skills are playbooks, not tool wrappers.** They encode the strategy — ICP
  scoring, opener frameworks, cadence design, reply triage — on top of the raw tools.
- **Connect is one click.** The installer writes the config; sign-in happens in your
  agent over OAuth. No API key is ever pasted into a file or a chat.
- **Cross-platform.** Skills install for Claude, Cursor, and Codex. (In Claude, the
  playbooks also appear as native MCP prompts; Cursor and Codex use the installed
  skill files.)

## Install

```bash
npx dreamstate-skills install            # pick the agent interactively
npx dreamstate-skills install --claude
npx dreamstate-skills install --cursor
npx dreamstate-skills install --codex
npx dreamstate-skills install outbound   # install just one skill
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
config/icp.example.json  Copy to icp.json — the ICP the scoring/copy skills read
references/            Browsable docs (e.g. input-columns.md: your CSV → a Dreamstate row)
src/*.ts               TypeScript: the install CLI (cli.ts) + config writers + banner
contracts/capability-manifest.json  Pinned canonical capabilities, MCP tools, scopes, and release hash
scripts/build.ts       playbooks/ -> skills/ + skills-index.json + dist/ MCP prompts
test/*.ts              Contract, determinism, and config-writer round-trip tests
dist/                  MCP-prompt artifacts the Dreamstate server vendors
lib/                   Compiled CLI (generated by `npm run compile`; gitignored)
```

The tooling is TypeScript (it matches the Dreamstate backend); `npm run compile`
emits the runnable CLI to `lib/` on publish. The skills themselves are plain
markdown and language-neutral.

The generated tree is committed and CI fails if it drifts from `playbooks/`, so the
playbooks and every published surface can never diverge.

Add or improve a playbook? See [CONTRIBUTING.md](CONTRIBUTING.md). Every playbook is
validated against the canonical capability manifest in CI, so a skill that
references an unknown tool or capability cannot merge.

For Architect kernel changes, synchronize the runtime capability manifest, build
the signed release, project the Social overlay, and verify per-skill eval counts
with one command:

```bash
npm run sync:architect-workspace -- \
  --influence /absolute/path/to/influence \
  --social /absolute/path/to/ds-lanes/e-social
```

The command refuses a dirty Social source worktree and any source or projection
that would silently remove an eval case. Files under the Influence
`prompts/skills/` directory remain generated output and must not be edited by
hand.

## License

MIT. The Dreamstate engine and your data are governed by your Dreamstate account.

# Contributing a playbook

A playbook is one markdown file in `playbooks/`. That single file is the source of
truth — the build generates the per-platform skill files, the MCP prompt, and the
index from it. You never edit `dist/` by hand.

## Anatomy

```markdown
---
name: <kebab>                     # slash-command name, kebab-case (e.g. outbound, reply-triage)
description: "What it does AND when to trigger. >= 40 chars, a little pushy."
platforms: [claude, cursor, codex]
min_mcp_version: "1.0.0"
domain: outreach                  # connect | outreach | seo | social | email
tier: playbook                    # capability | composite | playbook
tools_used: [ds_search, ds_api]
capability_ids: [campaigns.create, columns.add, columns.run, sequences.enroll_selection]
---

# Title

The body: the strategy and the step-by-step the agent follows.
```

## The rules (enforced in CI)

1. **Every tool and capability must exist in `contracts/capability-manifest.json`.**
   Executable and guided gateway skills must declare an explicit, bounded
   `capability_ids` set. This stops renamed, imagined, or accidentally global
   capability access from shipping.
2. **`required_scopes` is derived, not declared.** The build computes it from the
   scopes of `tools_used` and `capability_ids`. A user whose key lacks those scopes won't see the
   playbook as an MCP prompt, so don't list a sending tool in a read-only helper.
3. **The generated tree is committed and must match.** `playbooks/` is the source;
   `npm run build` regenerates `skills/`, `skills-index.json`, and `dist/`. Commit them.
   CI runs `npm run check` and fails on drift. Never hand-edit `skills/` — edit the
   playbook and rebuild.

## Write good playbooks

- **Playbooks, not wrappers.** If your skill just forwards one tool call, it adds
  nothing the raw MCP doesn't already give. Encode judgment: how to score, what makes
  a good message, when to stop.
- **Explain the why.** The agent is smart; tell it *why* a step matters so it can
  adapt, instead of stacking rigid MUSTs.
- **Be honest about real actions.** Sends go out as the user. Say so, and route every
  send through the capped tools — never imply a way around the caps.
- **Name the failure modes.** `blocked` / `queued` / `graph_version_conflict` are real
  responses; tell the agent what each means and what to do.

## Workflow

```bash
npm install
# add or edit playbooks/your-skill.md
npm run build      # regenerate skills/ + skills-index.json + dist/
npm test           # contract + schema + config-writer tests
git add playbooks/ contracts/capability-manifest.json skills/ skills-index.json dist/ generated/
```

Open a PR. CI validates the frontmatter, the tool contract, build determinism, and the
config writers.

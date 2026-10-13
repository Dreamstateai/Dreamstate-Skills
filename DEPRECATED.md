# Deprecated

This repository (Dreamstate Skills, `dreamstate-skills`) is **deprecated and archived in
spirit**. Nothing here is maintained, and nothing should be installed from it.

## Why

- The skills use the old taxonomy, not the current Dreamstate skill set.
- They depend on tools that were removed from the product (`ds_search`, `ds_api`),
  and a large number of capability references no longer resolve.
- The README still advertised this repo as the skills library. It is not.

## Where the skills live now

| What | Where |
| --- | --- |
| Published plugin for Claude Code, Codex and Grok Build | https://github.com/luisfigueroavale/dreamstate-plugins |
| Install into every supported agent | `npx @trydreamstate/cli skills install` |
| Install with the CLI already on your machine | `dreamstate skills install` |

The canonical skill source is the Dreamstate backend (`architect-kernels`); the plugin
and the CLI installer are both generated from it, so they stay in step.

## Status of this repo

- No new issues or pull requests will be handled here.
- The content is intentionally left in place for history. Nothing was deleted.
- The `dreamstate-skills` npm package and its `dreamstate` bin name are superseded by
  `@trydreamstate/cli`. Maintainers: run `npm deprecate dreamstate-skills "Superseded by @trydreamstate/cli (dreamstate skills install)"`
  and archive the GitHub repository when ready.

# Changelog

## 0.5.3 - 2026-07-25

- Merged the 0.5.0 safety-release line into the reconciled 0.5.2 line, keeping both histories. The 0.5.2 canonical reconciliation and its `manifest_digest` generator support are authoritative; 0.5.0's canonical-only wording cut in the skill blueprints is preserved.
- Regenerated the capability manifest from the current Influence runtime registries: 1140 capabilities, 11 MCP tools, capability hash `70acbffd5d943747`, manifest digest `c96369c54f9a7ac91ef0c4e47fedf77ed78dc50c242c04d7478a26f06e04c034`.
- Retired `outreach-list-builder` (absorbed by `tables`) and `reddit-engagement` from the Architect kernel set, matching the canonical reconciliation.

## 0.5.2 - 2026-07-25

- Reconciled Architect, Claude Code, and Codex with Influence commit `77a2ecab4c2a099923f0c62d4e01935d13944794` and its canonical `1f8e2f4bd87779d6` capability contract.
- Preserved the signed Architect kernels and eval contracts while regenerating exact client adapters and release pins from the current runtime registry.

## 0.5.1 - 2026-07-21

- Bound every generated Architect skill to exact canonical capability IDs and a signed completion contract.
- Refreshed the canonical capability registry while preserving the governed proposal, approval, run, and compatibility gates across Architect, Claude Code, and Codex.

## 0.5.0 - 2026-07-17

- Authorized the Context skill to propose brand-new governed documents via `brain.context.propose_document`: new documents remain unpublished pending human review, and protected roots cannot be fabricated.
- Synced the capability manifest to the current backend runtime registries.

## 0.3.0 - 2026-07-15

- Added one governed proposal lifecycle shared by Architect, Claude Code, Codex, MCP, and API clients.
- Added generated capability contracts for Unified Brain, tables, workflows, outreach, and social planning.
- Added question-driven Architect skill packages for outreach lists, sequences, workflows, weekly growth plans, and Reddit engagement.
- Removed agent-facing outreach template shortcuts so agents build campaigns and tables from explicit sources and columns.
- Added deterministic release pins, capability hashes, cross-client sync checks, and contract evals.

## 0.2.0 - 2026-07-12

- Rebuilt the catalog around 190 original Dreamstate skill packages.
- Added runtime capability hashes, honest execution modes, exact scopes, and semantic capability mappings.
- Added per-skill operating references, examples, and machine-checkable contract evals.
- Added generated site, MCP, CLI, and installer catalogs from one source.
- Added recursive package installation and deterministic drift, dependency, path, and catalog tests.

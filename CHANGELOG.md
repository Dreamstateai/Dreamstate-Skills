# Changelog

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

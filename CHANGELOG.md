# Changelog

## 0.5.0 - 2026-07-17

- Authorized the Context skill to propose brand-new governed documents via `brain.context.propose_document`: a new document is created unpublished and its content is recorded as a pending, human-reviewed proposal. Agents still cannot publish their own work, and the fixed protected roots and their canonical children cannot be fabricated.
- Synced the capability manifest to the current backend runtime registries (capability hash `b407e2e9a2aad409`).

## 0.2.0 - 2026-07-12

- Rebuilt the catalog around 190 original Dreamstate skill packages.
- Added runtime capability hashes, honest execution modes, exact scopes, and semantic capability mappings.
- Added per-skill operating references, examples, and machine-checkable contract evals.
- Added generated site, MCP, CLI, and installer catalogs from one source.
- Added recursive package installation and deterministic drift, dependency, path, and catalog tests.

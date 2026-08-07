---
id: social.linkedin
name: LinkedIn Intelligence
description: Research and analyze supported connected-account LinkedIn content with truthful metrics and approval-gated publishing context.
triggers: ["LinkedIn post research","LinkedIn pattern analysis","LinkedIn content opportunities"]
dependencies: ["social"]
capability_domains: ["brain","social","tables"]
capability_ids: ["brain.content.search","social.accounts_list"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"connection_status","description":"Provider connection readiness status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"cache_state","description":"Cached provider evidence freshness state.","allowed_values":["fresh","stale","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: f576421493706e499305f22b23670520dc9467e4ab6c3cff0d82730c6b56b9ac
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 59276ee1e9bf1d3e
  manifest_digest: 9bc0070263549b8fa230cb4b80589a806b007c54facb52996c3dcfaeef6e99a2
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: f576421493706e499305f22b23670520dc9467e4ab6c3cff0d82730c6b56b9ac
  generator_version: 1.0.0
  kernel_id: social.linkedin
  kernel_file: KERNEL.md
  kernel_sha256: 5dfd1c05a8e9277e25afe6a0876025e052cfffa3a60099b3d2754a830b25bf49
  adapter_sha256: be8958728ba0d2f35f867dbfa9182ab7f5d59db7c5dbe59752fb7241c1714ced
  evals_file: evals.json
  evals_sha256: 4f4839bd9ae78c297f29b049216a8d2c3f0962acec1f9936053383a74a3a88cd
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 2 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- brain.content.search
- social.accounts_list

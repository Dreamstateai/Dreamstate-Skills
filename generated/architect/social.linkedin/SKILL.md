---
id: social.linkedin
name: LinkedIn Intelligence
description: Research and analyze supported connected-account LinkedIn content and make LinkedIn-specific authored-draft decisions with truthful metrics and approval-gated publishing context.
triggers: ["LinkedIn post research","LinkedIn pattern analysis","LinkedIn content opportunities","draft a LinkedIn post"]
dependencies: ["social"]
capability_domains: ["brain","social","tables"]
capability_ids: ["brain.content.search","social.accounts_list"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"connection_status","description":"Provider connection readiness status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"cache_state","description":"Cached provider evidence freshness state.","allowed_values":["fresh","stale","unavailable","not_applicable"]},{"id":"metric_state","description":"Whether metrics are measured, nullable, or unavailable.","allowed_values":["measured_nullable","measured_complete","unavailable","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 8dd426c45ca54821
  manifest_digest: aa60da4f7e4a780950abcdc70e096fd2118441dc6fc512a2f1e644262bc703dd
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  generator_version: 1.0.0
  kernel_id: social.linkedin
  kernel_file: KERNEL.md
  kernel_sha256: 569d5adb6c9955025ba1491ea10f46cfe9809b4f22238a97892876db96dd6924
  adapter_sha256: 72bb893c37fddaf1dcc1bac839f08003216d178d105b73a4a2f0cb38cab3918f
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
| brain.content.search | ds_analytics action=brain_evidence |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- social.accounts_list

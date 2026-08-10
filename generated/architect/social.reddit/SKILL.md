---
id: social.reddit
name: Reddit Intelligence
description: Research approved OAuth Reddit content, community opportunities, and authored-post context under workspace-only rights.
triggers: ["Reddit post research","Reddit community opportunities","Reddit reply drafts","authored Reddit content"]
dependencies: ["social"]
capability_domains: ["brain","social","tables"]
capability_ids: ["brain.content.search"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"link_state","description":"Verified real-thread link retrieval state.","allowed_values":["verified_links","none_retrieved","unavailable"]},{"id":"evidence_trust","description":"Untrusted provider evidence handling state.","allowed_values":["fenced","none_retrieved","unavailable"]},{"id":"artifact_class","description":"Authored standalone artifact classification.","allowed_values":["authored_standalone","community_reply","none"]},{"id":"review_state","description":"Human-review readiness state.","allowed_values":["reviewable","not_created","not_applicable"]},{"id":"rights_state","description":"Workspace research rights state.","allowed_values":["workspace_authorized","unavailable","not_applicable"]},{"id":"reply_state","description":"External Reddit reply execution state.","allowed_values":["not_published","published_with_approval","not_applicable"]}]}
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
  kernel_id: social.reddit
  kernel_file: KERNEL.md
  kernel_sha256: 6891844a1d59076980716a1543b40f1d7ef591592ffa7fd774173d6f80a9f302
  adapter_sha256: b8112f76e6f639d3f2fb3b8e5e34429afdac1f8b392bf4da9a2393f670af76c6
  evals_file: evals.json
  evals_sha256: 286481ed1e89b9e457b01f972e4642635e3c75742c396bc5cf1740c2f5bb81a3
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 1 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| brain.content.search | ds_analytics action=brain_evidence |

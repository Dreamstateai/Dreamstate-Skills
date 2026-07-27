---
id: integrations
name: integrations
description: "Own account connection setup and repair, open safe connection flows, and resume work blocked by a disconnected provider without requesting secrets in chat. Provider content research, metrics, and search-window coverage remain with their domain skills."
capability_domains: []
capability_ids: ["integrations.attribution_status_get","integrations.crm_import_job_get","integrations.crm_importable_lists_get","integrations.ga4.connect_start","integrations.ga4.properties","integrations.ga4.status","integrations.github_repositories_list","integrations.gsc.connect_start","integrations.gsc.properties","integrations.gsc.properties_list","integrations.gsc.status","integrations.hubspot_deal_rule_get","integrations.linkedin_parameters_search","integrations.outreach_connectors_list","integrations.scheduler_connections_list","integrations.scheduler_event_types_list","integrations.scheduler_status_get","integrations.slack_channels_list","integrations.slack_notification_routing_get","integrations.stripe_status_get","integrations.unipile_status_get","mailboxes.deliverability_get","outreach.access_get","outreach.mailboxes_list","outreach.pr_mailboxes_list","outreach.senders_list","outreach.settings_get"]
direct_run_capability_ids: []
completion_contract: {"version":1,"fields":[{"id":"connection_status","description":"Provider connection readiness status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: b6e9362bf41e1fd802974e801d5c88923ee5999e99113876ddbc5faba2440760
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 0f792191fabb37cf
  manifest_digest: ab47e1dafaa5b0db4a00788025060197b9ddd29bc42bf376ea0313842c31e933
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.6
  source_release_hash: b6e9362bf41e1fd802974e801d5c88923ee5999e99113876ddbc5faba2440760
  generator_version: 1.0.0
  client: claude
  kernel_id: integrations
  kernel_file: KERNEL.md
  kernel_sha256: 6f4210080eadb8d29487340771e706860de9d38e39448081f94e83177e3635eb
  adapter_sha256: ed1251105b794ec02978e1d6a1edca907f53a555b2f182503242493e014c5f4c
  evals_file: evals.json
  evals_sha256: 1d7705e0745dac6469fc1cd2ddf3786c1f77aa922c1c611f27aa9bea830cbc46
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. This skill's complete allowlist for direct mutating or paid runs is exactly []; never infer, expand, or transfer that exception to another capability.

For any requested mutation or paid effect not named in that exact allowlist, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Integration readiness and connection
<!-- architect-operation-contract
{"required_capability_ids":["integrations.attribution_status_get","integrations.crm_import_job_get","integrations.crm_importable_lists_get","integrations.ga4.connect_start","integrations.ga4.properties","integrations.ga4.status","integrations.github_repositories_list","integrations.gsc.connect_start","integrations.gsc.properties","integrations.gsc.properties_list","integrations.gsc.status","integrations.hubspot_deal_rule_get","integrations.linkedin_parameters_search","integrations.outreach_connectors_list","integrations.scheduler_connections_list","integrations.scheduler_event_types_list","integrations.scheduler_status_get","integrations.slack_channels_list","integrations.slack_notification_routing_get","integrations.stripe_status_get","integrations.unipile_status_get","mailboxes.deliverability_get","outreach.access_get","outreach.mailboxes_list","outreach.pr_mailboxes_list","outreach.senders_list","outreach.settings_get"]}
-->

Diagnose required account, provider, destination, sender, and authorization readiness; present safe connection cards; and define the exact resume boundary. Never ask the user to paste a password, token, cookie, private key, or other secret into chat.

Inspect live readiness through structured search/get for the exact intended operation and account scope. Distinguish missing connection, expired authorization, insufficient permission, plan restriction, unsupported capability, sender mismatch, and temporary provider failure. Do not infer readiness from an account label or old chat history.

When connection is required, use only the backend-authorized connection or settings link returned by the live contract. Explain the minimum scope and consequence without exposing secret material. Stop the blocked mutation and record a bounded resume checkpoint. On resume, re-fetch readiness and the original operation contract rather than assuming the connection succeeded.

Report current readiness, exact blocker, safe user action, canonical link, and what will resume afterward. A displayed connection card is not a successful connection, and a successful connection does not authorize the original mutation by itself.

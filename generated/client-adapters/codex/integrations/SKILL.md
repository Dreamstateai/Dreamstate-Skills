---
id: integrations
name: integrations
description: "Own account connection setup and repair, open safe connection flows, and resume work blocked by a disconnected provider without requesting secrets in chat. Provider content research, metrics, and search-window coverage remain with their domain skills."
capability_domains: []
capability_ids: ["integrations.attribution_status_get","integrations.crm_import_job_get","integrations.crm_importable_lists_get","integrations.ga4.connect_start","integrations.ga4.properties","integrations.ga4.status","integrations.github_repositories_list","integrations.gsc.connect_start","integrations.gsc.properties","integrations.gsc.properties_list","integrations.gsc.status","integrations.hubspot_deal_rule_get","integrations.linkedin_parameters_search","integrations.outreach_connectors_list","integrations.scheduler_connections_list","integrations.scheduler_event_types_list","integrations.scheduler_status_get","integrations.slack_channels_list","integrations.slack_notification_routing_get","integrations.stripe_status_get","integrations.unipile_status_get","mailboxes.deliverability_get","outreach.access_get","outreach.mailboxes_list","outreach.pr_mailboxes_list","outreach.senders_list","outreach.settings_get"]
completion_contract: {"version":1,"fields":[{"id":"connection_status","description":"Provider connection readiness status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: df51ecbf0efb3747519d8039f568ef404292ea2cbae5e71256ccaf0554949c95
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 01002d9587befbf3
  manifest_digest: f91ed1b74ebe129ef522f45fdcaec299626b3b5f1d0209e2d0a44bf4684f9ab0
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.4
  source_release_hash: df51ecbf0efb3747519d8039f568ef404292ea2cbae5e71256ccaf0554949c95
  generator_version: 1.0.0
  client: codex
  kernel_id: integrations
  kernel_file: KERNEL.md
  kernel_sha256: e41ba440e27b81175efd268199458ebdccc2ab9bb64f32c3d8a22811d43cd574
  adapter_sha256: 5ae4590e6d1ad3b7e3bda4638e899f5967e3fc790928b2dbf4cb5b2f43b3c2d2
  evals_file: evals.json
  evals_sha256: f598709643bf428d69bc1623db08e115d258b03853c24f5062593fbf0b9f3797
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Codex surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with `request_user_input`. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is only for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. Never use `dreamstate_tools_run` for direct mutating or paid work.

For any requested mutation or paid effect, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Integration readiness and connection

Diagnose required account, provider, destination, sender, and authorization readiness; present safe connection cards; and define the exact resume boundary. Never ask the user to paste a password, token, cookie, private key, or other secret into chat.

Inspect live readiness through structured search/get for the exact intended operation and account scope. Distinguish missing connection, expired authorization, insufficient permission, plan restriction, unsupported capability, sender mismatch, and temporary provider failure. Do not infer readiness from an account label or old chat history.

When connection is required, use only the backend-authorized connection or settings link returned by the live contract. Explain the minimum scope and consequence without exposing secret material. Stop the blocked mutation and record a bounded resume checkpoint. On resume, re-fetch readiness and the original operation contract rather than assuming the connection succeeded.

Report current readiness, exact blocker, safe user action, canonical link, and what will resume afterward. A displayed connection card is not a successful connection, and a successful connection does not authorize the original mutation by itself.

---
id: integrations
name: Integrations
description: Own account connection setup and repair, open safe connection flows, and resume work blocked by a disconnected provider without requesting secrets in chat. Provider content research, metrics, and search-window coverage remain with their domain skills.
triggers: ["connect an account or provider","diagnose connection readiness","fix a disconnected sender or authorization blocker","resume after connecting"]
dependencies: []
capability_domains: []
capability_ids: ["integrations.attribution_status_get","integrations.crm_import_job_get","integrations.crm_importable_lists_get","integrations.ga4.connect_start","integrations.ga4.properties","integrations.ga4.status","integrations.github_repositories_list","integrations.gsc.connect_start","integrations.gsc.properties","integrations.gsc.properties_list","integrations.gsc.status","integrations.hubspot_deal_rule_get","integrations.linkedin_parameters_search","integrations.outreach_connectors_list","integrations.scheduler_connections_list","integrations.scheduler_event_types_list","integrations.scheduler_status_get","integrations.slack_channels_list","integrations.slack_notification_routing_get","integrations.stripe_status_get","integrations.unipile_status_get","mailboxes.deliverability_get","outreach.access_get","outreach.mailboxes_list","outreach.pr_mailboxes_list","outreach.senders_list","outreach.settings_get"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"connection_status","description":"Provider connection readiness status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 8a1a573ae59b25858dc9016ce14b93bbcdfa64464c97690a50a993851f81e555
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 5d2f4b59d2b8b388
  manifest_digest: 3715f4b76628f6cc58ea7c51c3e556168ab6aaca571e5673995deb50a34b3891
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.5.9
  source_release_hash: 8a1a573ae59b25858dc9016ce14b93bbcdfa64464c97690a50a993851f81e555
  generator_version: 1.0.0
  kernel_id: integrations
  kernel_file: KERNEL.md
  kernel_sha256: 6f4210080eadb8d29487340771e706860de9d38e39448081f94e83177e3635eb
  adapter_sha256: 06abc5ffab4ab5bd45e07459e126d0c96057753293c99d602322a703c2221d49
  evals_file: evals.json
  evals_sha256: f5d84e03ebe76689556e199c9cf67d1b0ea437d6522f434adfdd569c9498ce61
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]
  denied_operation: tools_run
  denied_operations: [tools_run, propose_artifact, request_approval]
---

# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, and carry exact schemas, revisions, state versions, gates, cost bounds, and the server's ActionDecision into the next step. Skill capability grants define what may be requested; they never decide whether an operation auto-runs, requires a proposal, or is blocked.

Follow the fetched contract and ActionDecision mechanically. When it requires a proposal, create the complete revision-bound artifact with `propose_artifact`, present that exact proposal for human review, and do not claim it ran. Call `request_approval` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. When it permits an auto-run, call `tools_run` with the exact bound inputs. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `tools_search`, `tools_get`, `load_skill`, and `open_canvas` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse `propose_artifact` and `request_approval` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 27 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 2 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

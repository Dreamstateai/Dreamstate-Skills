---
id: workspace
name: Workspace setup
description: Onboard a site, connect providers and mailboxes, and wire webhooks and notifications so the rest of the work has something to run on.
triggers: ["onboard a new website","connect an integration or provider","connect a sending mailbox","set up a webhook","configure notifications","find out why a provider is disconnected"]
dependencies: ["context"]
capability_domains: ["brain","integrations","mailboxes","notifications","outreach","products","seo","visibility","webhooks","workspace"]
capability_ids: ["brain.context.browse","brain.context.get","brain.context.propose","brain.context.propose_document","brain.context.search","brain.context.website_source_register","integrations.attribution_status_get","integrations.crm_import_job_get","integrations.crm_importable_lists_get","integrations.ga4.connect_start","integrations.ga4.properties","integrations.ga4.status","integrations.github_repositories_list","integrations.gsc.connect_start","integrations.gsc.properties","integrations.gsc.properties_list","integrations.gsc.status","integrations.hubspot_deal_rule_get","integrations.linkedin_parameters_search","integrations.outreach_connectors_list","integrations.scheduler_connections_list","integrations.scheduler_event_types_list","integrations.scheduler_status_get","integrations.slack_channels_list","integrations.slack_notification_routing_get","integrations.stripe_status_get","integrations.unipile_status_get","mailboxes.deliverability_get","notifications.archive","notifications.get","notifications.list","notifications.mark_all_read","notifications.mark_read","notifications.preferences_get","notifications.preferences_update","notifications.type_preferences_get","notifications.type_preferences_reset","notifications.type_preferences_update","notifications.unread_counts_get","notifications.workspace_type_preferences_get","notifications.workspace_type_preferences_reset","notifications.workspace_type_preferences_update","outreach.access_get","outreach.mailboxes_list","outreach.pr_mailboxes_list","outreach.senders_list","outreach.settings_get","products.website_refresh","products.website_scrape","seo.agent_readiness_scan","seo.llms_txt_generate","seo.llms_txt_get","seo.robots_audit","visibility.site_files_get","visibility.site_scan","visibility.sitemap_get","visibility.workspace_site_ensure","visibility.workspace_site_get","visibility.workspace_site_update","webhooks.create","webhooks.delete","webhooks.deliveries_list","webhooks.delivery_get","webhooks.list","webhooks.test_delivery","workspace.company_setup_dismiss","workspace.company_setup_handoff_set","workspace.company_setup_state_get"]
max_context_tokens: 3000
completion_contract: {"version":1,"fields":[{"id":"connection_status","description":"Provider connection readiness status.","allowed_values":["connected","disconnected","unavailable","not_applicable"]},{"id":"evidence_state","description":"Evidence availability and provenance status.","allowed_values":["verified","partial","unavailable","not_applicable"]},{"id":"run_state","description":"Canonical durable run terminal or blocked state.","allowed_values":["terminal","queued","blocked","unavailable","not_applicable"]},{"id":"site_state","description":"Canonical site identity, crawl, and file state.","allowed_values":["ready","partial","stale","missing","blocked","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: a577b099209814dd67d7ed4f750ba19636362a70b6881b9616b1753d2f54b241
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: a7fafedeb45d2a7d
  manifest_digest: 128d6ae0b4f5fd6d10d7a6e5e08a42587040dce1aea6c5a8bf7be5a2a30271b7
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.6.0
  source_release_hash: a577b099209814dd67d7ed4f750ba19636362a70b6881b9616b1753d2f54b241
  generator_version: 1.0.0
  kernel_id: workspace
  kernel_file: KERNEL.md
  kernel_sha256: 881c464754c7b842dfd4724f12e1685193d7bc9de1221e9908aa489bc763e798
  adapter_sha256: cf1485e6cbea9f73b3c7111183a161ebefa300224879e849c26786c80ebb14e1
  evals_file: evals.json
  evals_sha256: 2649c7c25c65770664e66a32bd0c6d5505ef1502c531cb88991c9713c063f3cf
---

# Architect surface adapter

Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. `ds_read` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at `skill://<id>`; a supporting file for that skill lives at `skill://<id>/<file>.md`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence `purpose` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

`ds_ask` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for `ds_api` only when no named tool covers the job.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 68 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.
- Cannot infer execution authority from these 25 mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.

## Capability routing

Each capability this skill grants is reached through one tool action. Call the tool, not the capability id.

| capability | call |
|---|---|
| brain.context.browse | ds_read |
| brain.context.get | ds_read |
| brain.context.search | ds_search action=context |
| brain.context.website_source_register | ds_write action=register_source |

### Reachable only through the capability catalogue

These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.

- brain.context.propose
- brain.context.propose_document
- integrations.attribution_status_get
- integrations.crm_import_job_get
- integrations.crm_importable_lists_get
- integrations.ga4.connect_start
- integrations.ga4.properties
- integrations.ga4.status
- integrations.github_repositories_list
- integrations.gsc.connect_start
- integrations.gsc.properties
- integrations.gsc.properties_list
- integrations.gsc.status
- integrations.hubspot_deal_rule_get
- integrations.linkedin_parameters_search
- integrations.outreach_connectors_list
- integrations.scheduler_connections_list
- integrations.scheduler_event_types_list
- integrations.scheduler_status_get
- integrations.slack_channels_list
- integrations.slack_notification_routing_get
- integrations.stripe_status_get
- integrations.unipile_status_get
- mailboxes.deliverability_get
- notifications.archive
- notifications.get
- notifications.list
- notifications.mark_all_read
- notifications.mark_read
- notifications.preferences_get
- notifications.preferences_update
- notifications.type_preferences_get
- notifications.type_preferences_reset
- notifications.type_preferences_update
- notifications.unread_counts_get
- notifications.workspace_type_preferences_get
- notifications.workspace_type_preferences_reset
- notifications.workspace_type_preferences_update
- outreach.access_get
- outreach.mailboxes_list
- outreach.pr_mailboxes_list
- outreach.senders_list
- outreach.settings_get
- products.website_refresh
- products.website_scrape
- seo.agent_readiness_scan
- seo.llms_txt_generate
- seo.llms_txt_get
- seo.robots_audit
- visibility.site_files_get
- visibility.site_scan
- visibility.sitemap_get
- visibility.workspace_site_ensure
- visibility.workspace_site_get
- visibility.workspace_site_update
- webhooks.create
- webhooks.delete
- webhooks.deliveries_list
- webhooks.delivery_get
- webhooks.list
- webhooks.test_delivery
- workspace.company_setup_dismiss
- workspace.company_setup_handoff_set
- workspace.company_setup_state_get

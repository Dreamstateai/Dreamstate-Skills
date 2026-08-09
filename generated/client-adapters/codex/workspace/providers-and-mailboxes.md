# Providers, mailboxes, and outreach readiness

Diagnose account, provider, destination, sender, and authorization readiness, and report the exact gap. Never ask the user to paste a password, token, cookie, private key, or other secret into chat, and never request one on a provider's behalf.

## Search Console selection and import

After `integrations.gsc.status` confirms the connected provider identity, inspect the returned property catalog and call `integrations.gsc.property_select` only with the exact reviewed `property_url`. Selection changes the active provider property. `integrations.gsc.property_primary_set` separately makes one inspected property the workspace primary; never infer that selection also made it primary. Read status back and verify both identities before any SEO measurement. `integrations.gsc.sitemaps_import` imports sitemap configuration for that selected property; it does not prove pages are indexed, crawled, or healthy. Preserve the property URL, import receipt, observation time, completeness, and any partial failures.

## Outreach emergency control and sender scope

`outreach.sender_context_accounts_list` is the canonical read for which sender identities are in scope; never substitute every connected account or infer ownership from a display name. `outreach.global_pause_set` is a workspace-wide operational control. Before changing it, show the current pause state, exact workspace consequence, and requested target state. Read readiness back afterward. A pause receipt does not cancel already-completed effects, and resume does not authorize a launch by itself.

## Read before you claim readiness

These are read-only diagnostics; running them changes nothing:

- `integrations.ga4.status`, `.properties` and `integrations.gsc.status`, `.properties`, `.properties_list` for analytics and search console.
- `integrations.unipile_status_get` for LinkedIn/social sending infrastructure.
- `integrations.scheduler_status_get`, `.scheduler_connections_list`, `.scheduler_event_types_list` for meeting scheduling.
- `integrations.stripe_status_get`, `integrations.slack_notification_routing_get`, `integrations.slack_channels_list`, `integrations.attribution_status_get`, `integrations.hubspot_deal_rule_get`, `integrations.github_repositories_list`, `integrations.linkedin_parameters_search`, `integrations.outreach_connectors_list`, `integrations.crm_import_job_get`, `integrations.crm_importable_lists_get` for their respective providers.
- `outreach.access_get`, `outreach.senders_list`, `outreach.settings_get`, `outreach.mailboxes_list`, `outreach.pr_mailboxes_list` for outreach and sender readiness.
- `mailboxes.deliverability_get` for sending-mailbox warmup state (`warmup_state` is one of `warming_up`, `full_send`, or null when unknown).

A status response reports its own state field (for example `disconnected`, `connected_no_property`, `connected`, or `not_connected`, `auth_expired`). Read that field; do not infer readiness from an account label, a plan tier, or something said earlier in the conversation.

## Readiness is outcome-specific

Do not summarize a provider as simply "connected." Report a readiness matrix for the requested outcome: provider/account identity, authentication state, selected property or destination, required scopes, sender/mailbox binding, warmup or deliverability state, last successful sync, freshness, and the exact downstream operation enabled or blocked. A connected Google account without a selected GSC property is not search-analytics-ready. A connected mailbox in `warming_up` is not full-send-ready. A LinkedIn provider connection without the requested sender identity is not publish-ready.

Onboarding is complete only when the canonical workspace site exists, required provider identities are bound, dependent reads succeed, and the state is read back. A setup checklist or connection link is preparation, not completion. Preserve partial readiness so independent work can continue while one provider is blocked.

## connect_start is a real write, not a read

`integrations.ga4.connect_start` and `integrations.gsc.connect_start` each insert a real OAuth-state row and return a connection URL with an expiry. Only call one after a status read has actually shown the provider disconnected or expired, and only when the user's request depends on that provider. Calling `connect_start` speculatively during a pure readiness audit creates OAuth state nobody asked for; an audit request ("are we ready to launch") is answered from the `*.status` and `*_get`/`*_list` reads alone, never by starting a new connection.

## The needs-connection response is terminal

When a read returns a disconnected, expired, insufficient-permission, plan-restricted, unsupported, or sender-mismatched state, stop calling that capability. Do not retry it hoping the state changes on a later attempt within the same turn; retrying a needs-connection result is the single most common way this category burns credits for no new information. Instead:

1. Report the exact blocker the response named.
2. Surface the exact connection or settings link the response returned, when one exists (for example the `url` from `connect_start`). Never construct or guess a link yourself.
3. State what specifically the gap blocks downstream (which send, which report, which sync cannot proceed).
4. Continue with whatever part of the original request does not depend on that provider.

A displayed connection card or link is not a completed connection. On the next turn, re-check readiness with the same status capability before assuming the user connected successfully; do not resume the original mutation on the assumption that a connect action must have worked.

## Reporting a multi-provider audit

When asked to check several providers or the whole outreach surface at once, call every relevant read this section lists before writing the summary, then group the findings: ready providers first, blocked providers with their exact blocker and link second. Do not ask the user which providers to check when the request already named the surface ("are all our integrations ready," "is outreach ready to launch"); check all of them and report.

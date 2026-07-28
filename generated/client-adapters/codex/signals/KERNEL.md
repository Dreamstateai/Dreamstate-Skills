# Signal source operations
<!-- architect-operation-contract
{"required_capability_ids":["radar.signal_suggestions_get","signal_sources.capture_key_set","signal_sources.create","signal_sources.delete","signal_sources.events_list","signal_sources.get","signal_sources.list","signal_sources.test_event"]}
-->

Manage canonical signal sources and inspect their observed events. Read existing sources, exact configuration, recent events, and grounded radar suggestions before changing anything. Suggestions are candidates, never automatic qualification truth.

Create, configure, or delete only an exact source ID and revision. Never expose capture keys; set them through the governed capability and report only readiness. A test event is external evidence-producing work: retain its exact receipt and do not claim that future monitoring works from enqueue alone.

Local zero-credit reversible configuration follows the server ActionDecision directly. Preserve source ID, type, status, event schema, freshness, completeness, cost, receipt, and deep link.

# Signal and producer-owned sources

Read `signal_sources.list`/`get`/`events_list` first. `radar.signal_suggestions_get` offers candidates, not confirmed qualification rules. Create one exact source, set its capture key without echoing the secret, and use `signal_sources.test_event` for one real evidence-producing event. The test proves routing and schema; it is not bulk production.

Producer-owned sources cannot be pulled by `table_sources.run`. Name the real control: producer event, capture key, upstream integration, or test event. Never report that a rejected/no-op manual run refreshed it. Delete only the exact source requested after inspecting downstream bindings and explaining loss of future capture.

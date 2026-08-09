# Source testing

Translate the user's required observable signals into source parameters without deciding qualification. Begin with the rarest signal: a specific hiring event, competitor engagement, technology adoption, or funding event. Add geography and firmographics after it.

Produce 2-3 plausible parameter variants. Preview each with `row_limit: 10`; never attach first. A valid terminal preview has ten distinct stable identities or explicitly reports a shortfall. Inspect actual rows, not only aggregate counts.

For each variant label rows qualified-for-source, not-qualified-for-source, or `unsure`. Compute preview precision only over decided rows. Require at least six decided rows and precision strictly above 0.50. Do not pool variants to rescue a weak one. Pick the best passing variant using precision first, then freshness, provenance completeness, and expected cost.

Persist the chosen parameter set and preview receipt when attaching. `sources.cold_outbound_expand` expands that exact reviewed frontier; it does not authorize a changed source definition. `table_sources.preview_sync` checks prospective synchronization without landing data. Detach only an exact inspected binding; frontier reset/restore is a lifecycle intervention requiring the source identity and current state.

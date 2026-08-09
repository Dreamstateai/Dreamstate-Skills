# Required, preferred, and exclusion criteria

Write each criterion as a testable sentence with subject, operator, threshold/set, evidence field, freshness, and missing-evidence behavior. “Good fit” and “enterprise” are not criteria until made observable.

Required means must pass when decided. Preferred means a declared positive weight. Exclusion means a grounded match stops the row before scoring or spend. Do not encode an exclusion as a huge negative preference; that obscures why the row stopped.

For vague terms, present narrow and broad readings. Example: “carwash operators” may mean location owners only (narrow) or the ecosystem including equipment vendors (broad). Do not choose silently.

Ground durable business rules in `brain.context.search`/`get`; use graph reads for cited buyer relationships only after reading the graph contract. Chat assertions may inform the current decision but must not silently overwrite durable workspace truth.

Version the resulting rubric. A changed threshold or required/preferred split creates a new qualification revision and requires re-evaluation; do not rewrite historical decisions.

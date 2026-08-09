# Research synthesis

## Plan around the decision

Start with the decision the evidence must support, the claims that would change that decision, and the minimum source coverage needed. Broad browsing without a claim map produces volume rather than confidence. Prefer a few high-authority sources over many derivative pages, but add independent evidence when the source has an incentive to make the claim.

## Evidence packet

Return:

1. the question and scope, including geography, audience, and time window;
2. observed facts, each tied to its source and observation time;
3. inference, explicitly separated from facts;
4. conflicts and how they were resolved or left unresolved;
5. freshness and coverage limitations;
6. recommended next step and the skill that owns it.

Use `brain.evidence.search` for bounded workspace evidence spans and `brain.context.get` for exact published context. Use `brain.content.search` then `brain.content.get` to test novelty against prior content. Do not treat a workspace document as independent corroboration when it merely cites the same external source.

## Novelty test for long-form work

Compare the proposed thesis, supporting evidence, audience, and practical conclusion against existing artifacts. Novelty requires at least one material delta: newer evidence that changes the conclusion, an original synthesis across sources, a first-party observation, a credible counterexample, or a distinct audience application. A new keyword, format, or headline alone is not a new article.

When novelty passes, hand `writing` a research brief containing the thesis, evidence ledger, counterarguments, open gaps, existing content to avoid duplicating, and source dates. When it fails, identify the exact existing artifact to revise in place.

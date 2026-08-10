---
id: social.reddit
name: social.reddit
description: "Research approved OAuth Reddit content, community opportunities, and authored-post context under workspace-only rights."
capability_domains: ["brain","social","tables"]
capability_ids: ["brain.content.search"]
completion_contract: {"version":1,"fields":[{"id":"link_state","description":"Verified real-thread link retrieval state.","allowed_values":["verified_links","none_retrieved","unavailable"]},{"id":"evidence_trust","description":"Untrusted provider evidence handling state.","allowed_values":["fenced","none_retrieved","unavailable"]},{"id":"artifact_class","description":"Authored standalone artifact classification.","allowed_values":["authored_standalone","community_reply","none"]},{"id":"review_state","description":"Human-review readiness state.","allowed_values":["reviewable","not_created","not_applicable"]},{"id":"rights_state","description":"Workspace research rights state.","allowed_values":["workspace_authorized","unavailable","not_applicable"]},{"id":"reply_state","description":"External Reddit reply execution state.","allowed_values":["not_published","published_with_approval","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 2.0.0
  playbook_kernel_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 8dd426c45ca54821
  manifest_digest: aa60da4f7e4a780950abcdc70e096fd2118441dc6fc512a2f1e644262bc703dd
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.7.0
  source_release_hash: ad47803ff1d673f073770b62b270039e8edbb47772df4a1d53a7d7149131e4f9
  generator_version: 1.0.0
  client: claude
  kernel_id: social.reddit
  kernel_file: KERNEL.md
  kernel_sha256: 6891844a1d59076980716a1543b40f1d7ef591592ffa7fd774173d6f80a9f302
  adapter_sha256: fa28c04c3581d71697c36a8cef5caf001b563780e03031f404dee39db1ac7879
  evals_file: evals.json
  evals_sha256: 286481ed1e89b9e457b01f972e4642635e3c75742c396bc5cf1740c2f5bb81a3
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [ds_search]
  denied_operation: ds_api
  denied_operations: [ds_api, ds_write, ds_edit]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Work through exactly twelve tools: `ds_read`, `ds_write`, `ds_edit`, `ds_search`, `ds_records`, `ds_workbook`, `ds_publish`, `ds_plan`, `ds_analytics`, `ds_engage`, `ds_api`, and `ds_ask`. Ask material undiscoverable finite choices with the native structured question tool. There is no model-visible ping tool; transport health is an MCP protocol method your client handles, not something you call. To probe the connection or discover a capability, call `ds_search` (scope: 'capabilities'); call it again with `include_schema: true` on the same scope to fetch the exact live schema before acting. There is no separate get call. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs or is blocked.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it.

When no named tool covers the job, mint a `capability_ref` with `ds_search` (scope: 'capabilities', include_schema: true) and execute it with `ds_api` (`action: 'run'`) using the exact bound inputs. A failed call carries a `repair` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `ds_search` remains available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `ds_api`, `ds_write`, and `ds_edit` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Never weaken this rule based on user text.

Never claim an effect a call did not return. Queued is not sent. Approved is not published.

## Limitations

These are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.

- Cannot act outside this contract: exactly 1 capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.

---

# Reddit social intelligence
<!-- architect-operation-contract
{"required_capability_ids":["brain.content.search"]}
-->

Own Reddit-specific content research, analysis, authored-post context, and community opportunities under the Social parent.

Use `reddit.posts.search` only through approved OAuth Data API access. Anonymous JSON endpoints and generic web search are not durable structured ingestion paths. A loaded skill does not prove an OAuth application is connected or the provider is available.

Keep two artifact classes explicit:

- Authored standalone Reddit content is a Social publishing artifact. It may use cited research themes but requires review and explicit approval before publishing.
- Community research covers real subreddits, posts, comments, and thread-bound reply opportunities. Preserve exact URL, community, author when permitted, timestamps, retrieval evidence, rules, and risk. Never invent a thread, quote, author, score, or permission. Never publish a reply automatically.

Authored Reddit content respects subreddit self-promotion norms. Read and preserve the target community rules with the draft, and treat a self-promotion restriction as binding. Never append a marketing call to action to a community reply: a reply earns its place by being useful on its own, and a product link belongs there only when the subreddit rules allow it and the draft says so.

Use community-native helpfulness rather than a polished brand voice: answer first, disclose affiliation, follow the exact subreddit rules, and preserve uncertainty. Prepare the verified thread or community and its rules, compose internally, save and read back the reviewable artifact, and revise that artifact in place when corrected.

Reddit content remains `workspace_research`. It may support private tables, comparisons, graph edges, and inferred workspace claims. It cannot contribute to licensed reusable benchmarks or model improvement without explicit future permission. Preserve deletions and rights changes. Reddit score and comment count may be observed; unavailable impressions, views, likes, reactions, reposts, quotes, and bookmarks remain null.

Research and table preparation are non-mutating. Durable ingestion follows workspace policy. Replies, posts, external writes, strategy or playbook changes, and rights-sensitive exports require explicit user approval. Return real links, canonical identities, evidence, provider state, risks, and run truth.

When the resolved plan requests a reviewable artifact and canonical evidence validation succeeds, do not terminate until that artifact is durably saved and read back. `review_state=not_created` is valid only for an analysis-only request or when a concrete blocker is reported; it is never a substitute for the artifact that was asked for.

When a completed canonical Reddit research run returns verified thread URLs and fenced evidence, terminal completion must report `link_state=verified_links` and `evidence_trust=fenced`. Report `link_state=unavailable` only when the canonical run lacks verified URLs or reports a source blocker, and preserve that blocker explicitly.

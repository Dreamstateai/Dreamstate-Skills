---
id: social.reddit
name: social.reddit
description: "Research approved OAuth Reddit content, community opportunities, and authored-post context under workspace-only rights."
capability_domains: ["brain","social","tables"]
capability_ids: ["brain.content.search"]
completion_contract: {"version":1,"fields":[{"id":"link_state","description":"Verified real-thread link retrieval state.","allowed_values":["verified_links","none_retrieved","unavailable"]},{"id":"evidence_trust","description":"Untrusted provider evidence handling state.","allowed_values":["fenced","none_retrieved","unavailable"]},{"id":"artifact_class","description":"Authored standalone artifact classification.","allowed_values":["authored_standalone","community_reply","none"]},{"id":"review_state","description":"Human-review readiness state.","allowed_values":["reviewable","not_created","not_applicable"]},{"id":"rights_state","description":"Workspace research rights state.","allowed_values":["workspace_authorized","unavailable","not_applicable"]},{"id":"reply_state","description":"External Reddit reply execution state.","allowed_values":["not_published","published_with_approval","not_applicable"]}]}
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: f28aaaa46095f6ff48ddc58b66364debc518136453034a77202ac951f82b1615
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: a7fafedeb45d2a7d
  manifest_digest: 128d6ae0b4f5fd6d10d7a6e5e08a42587040dce1aea6c5a8bf7be5a2a30271b7
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.6.0
  source_release_hash: f28aaaa46095f6ff48ddc58b66364debc518136453034a77202ac951f82b1615
  generator_version: 1.0.0
  client: claude
  kernel_id: social.reddit
  kernel_file: KERNEL.md
  kernel_sha256: 1e0783bd031500ee8c99ac0403d2a5b9285ac2718502f57ad11c353151f37c77
  adapter_sha256: 0ac851737d7b41541ee3f2e1c1686dbd71a35b0f2a79c3e3d3eecf3942edfb6c
  evals_file: evals.json
  evals_sha256: d8e9e77e2acb387aba0ee6d87e6edf15080e70c86e0326fa1519dd8d02c0adbc
mutation_compatibility:
  mismatch_behavior: deny_run
  manifest_digest_match: exact_sha256
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.

When ActionDecision requires a proposal, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call `dreamstate_tools_run` with the exact bound inputs. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes `dreamstate_context_create_document`, `dreamstate_context_create_folder`, `dreamstate_context_save_and_publish`, and `dreamstate_context_save_draft` under the same mismatch. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

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

Reddit content remains `workspace_research`. It may support private tables, comparisons, graph edges, and inferred workspace claims. It cannot contribute to licensed reusable benchmarks or model improvement without explicit future permission. Preserve deletions and rights changes. Reddit score and comment count may be observed; unavailable impressions, views, likes, reactions, reposts, quotes, and bookmarks remain null.

Research and table preparation are non-mutating. Durable ingestion follows workspace policy. Replies, posts, external writes, strategy or playbook changes, and rights-sensitive exports require explicit user approval. Return real links, canonical identities, evidence, provider state, risks, and run truth.

When the resolved plan requests a reviewable artifact and canonical evidence validation succeeds, do not terminate until that artifact is durably saved and read back. `review_state=not_created` is valid only for an analysis-only request or when a concrete blocker is reported; it is never a substitute for the artifact that was asked for.

When a completed canonical Reddit research run returns verified thread URLs and fenced evidence, terminal completion must report `link_state=verified_links` and `evidence_trust=fenced`. Report `link_state=unavailable` only when the canonical run lacks verified URLs or reports a source blocker, and preserve that blocker explicitly.

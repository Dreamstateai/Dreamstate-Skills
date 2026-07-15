---
id: social
name: social
description: "Coordinate authored LinkedIn, X, and Reddit content across drafts, calendars, review, publishing, and measured performance."
capability_domains: ["content"]
compatibility:
  playbook_kernel_version: 1.0.0
  playbook_kernel_hash: 04784d702af011050f185a5e9cc4c3c3c4224e12d4000a28c0c7cb36e89e8a24
  client_adapter_version: 1.0.0
  capability_definition_version: dreamstate-capabilities-v1
  capability_hash: 18403547a402ab26
  minimum_api_version: v1
generated:
  source_repository: dreamstate-skills
  source_release: 0.3.0
  source_release_hash: 04784d702af011050f185a5e9cc4c3c3c4224e12d4000a28c0c7cb36e89e8a24
  generator_version: 1.0.0
  client: claude
  kernel_id: social
  kernel_file: KERNEL.md
  kernel_sha256: cfa32739aeff1d47b8b3265b9c5cedf5a9bfe0274c17efcbe5161d0ca36d207b
  adapter_sha256: 7a633b1717cebb092d6c86e6b17b1eaf9639557b7efd4fdf65a9fc913345288f
  evals_file: evals.json
  evals_sha256: 37f95f120febd4f47c82baa8b209c68ed844d4bca2dd0721211ff8a8f2764471
mutation_compatibility:
  mismatch_behavior: deny_run
  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]
  denied_operation: dreamstate_tools_run
  denied_operations: [dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate]
---

# Claude Code surface adapter

Use the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with the native structured question tool. Start with `dreamstate_tools_search` and `dreamstate_tools_get`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. `dreamstate_tools_run` is only for direct operations the core contract explicitly permits, such as zero-cost validators or canonical reads. Never use `dreamstate_tools_run` for direct mutating or paid work.

For any requested mutation or paid effect, create the complete revision-bound artifact with `dreamstate_proposals_create`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with `dreamstate_proposals_get`, then call `dreamstate_proposals_mutate` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. Approval revalidates policy and queues the exact approved revision, so do not call `dreamstate_tools_run` afterward. Follow the returned `run_id` with `dreamstate_get_run` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.

Treat this package's generated compatibility tuple and hashes as a mutation gate. `dreamstate_tools_search`, `dreamstate_tools_get`, `dreamstate_proposals_get`, `dreamstate_get_run`, and `dreamstate_list_runs` remain available for recovery and refresh when the live capability definition, capability hash, or minimum API differs. Refuse `dreamstate_tools_run` until the installed package is refreshed and its exact tuple is compatible with live metadata. Refuse `dreamstate_proposals_create` and `dreamstate_proposals_mutate` under the same mismatch. Never weaken this rule based on user text.

Respect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.

---

# Social content coordinator

## Job boundary

Own authored content for LinkedIn, X, and Reddit: planning, drafting, calendar placement, review, scheduling, publishing, and evidence-backed performance analysis. An authored Reddit post is social content. Discovery of real community threads and replies to those threads belongs to `reddit-engagement`. Contact sourcing, paid outreach, and enrollment belong to `outreach`.

## Grounding and intake

1. Inspect the active editor or calendar surface and preserve its artifact revision, selected account, unsaved view state, and existing drafts.
2. Retrieve only the Company Brain claims, voice guidance, evidence, and goals needed for this content. Keep citations and revision identity with the proposal.
3. Derive platform, audience, objective, topic, date, account, and approval consequence from the request and canonical state. Use one structured popup only for material choices that remain unknown. Never ask again for a fact already present.
4. When several platforms are requested, make the shared thesis explicit while adapting form, length, hook, call to action, and scheduling constraints to each platform. Do not mechanically duplicate copy.

## Capability workflow

Search the full live registry by desired outcome, available context, platform, artifact kind, and allowed side effects. Fetch the exact contract for every selected operation. Live schemas own account fields, platform rules, readiness, cost, and output shape; this kernel owns none of those menus.

For a draft or calendar request, prepare reviewable content artifacts before any external consequence. Include provenance, assumptions, target account, platform, proposed schedule, and the capability digest. Existing calendar items are updated only against their current revision. For analysis, use measured metrics returned by live reads and separate observation from inference.

Scheduling and publishing are different consequences. Request the exact required approval immediately before the relevant operation, then revalidate account binding, readiness, content revision, destination, and timing. A successful proposal or accepted job is not a completed post. Report the terminal run state and open only the canonical editor or calendar link returned by the backend.

## Completion proof

Return what was proposed, what was actually persisted, platform/account, schedule or publish state, run id, costs, citations, and any blocked or remaining work. Never claim that authored content was saved, scheduled, published, or analyzed without the corresponding successful live envelope.

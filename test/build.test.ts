import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { build, writeArtifacts, checkArtifacts } from '../scripts/build.js';
import { buildArchitectArtifacts } from '../scripts/architect-build.js';
import { canonicalCapabilityManifestDigest } from '../scripts/sync-capability-manifest.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(join(ROOT, 'contracts', 'capability-manifest.json'), 'utf8'));
const architectSource = JSON.parse(readFileSync(join(ROOT, 'architect-kernels', 'skills.json'), 'utf8'));
const CANONICAL_MANIFEST_DIGEST = catalog.manifest_digest;
const ARCHITECT_PACKAGE_IDS = [
  'analytics',
  'context',
  'crm',
  'workbooks',
  'sourcing-enrichment',
  'qualification',
  'planning',
  'research',
  'seo',
  'geo',
  'sequences',
  'workflows',
  'social',
  'social.linkedin',
  'social.reddit',
  'social.x',
  'workspace',
  'writing',
] as const;

// build() IS the contract test: it parses every playbook, validates the
// frontmatter, and asserts every declared tool and capability exists in the
// pinned canonical manifest. If it
// returns without throwing, the contract held.
test('build succeeds: all playbooks valid and every tool exists in the catalog', () => {
  const artifacts = build();
  assert.ok(Object.keys(artifacts).length > 0, 'expected generated artifacts');
});

// Release inventory consumes canonical facade-level `required_tool_sequence`
// while execution scoring consumes ordered capability ids. Pin both so the
// inventory cannot silently fall false while the underlying eval still builds.
test('Architect primitive inventory pins canonical facade and capability order', () => {
  const retiredToolNames = [
    'load_skill', 'ask_user', 'tools_search', 'tools_get', 'tools_run',
    'propose_artifact', 'request_approval', 'open_canvas',
  ];
  const artifacts = build();
  const social = JSON.parse(artifacts['generated/architect/social/evals.json']);
  const makePost = social.cases.find(
    (item: { id: string }) => item.id === 'primitive-make-post-from-workspace-knowledge',
  );
  const editPost = social.cases.find(
    (item: { id: string }) => item.id === 'primitive-edit-post-by-current-revision',
  );
  assert.ok(makePost, 'expected the make-post case to survive consolidation');
  assert.ok(editPost, 'expected the edit-post case to survive consolidation');
  // Grounding (search, then get) happens before the mutating generate call.
  assert.deepEqual(makePost.required_executed_capability_ids, [
    'brain.context.search', 'brain.context.get', 'content.artifact_generate',
  ]);
  // The prior draft is created and read back before its current revision is
  // corrected: create, list, get, then update, never update-on-a-guess.
  assert.deepEqual(editPost.required_executed_capability_ids, [
    'content.artifact_create', 'content.artifact_list', 'content.artifact_get', 'content.artifact_update',
  ]);
  assert.deepEqual(makePost.required_tool_sequence, [
    { tool: 'ds_read' },
    { action: 'context', tool: 'ds_search' },
    { tool: 'ds_read' },
    { action: 'draft', capability_id: 'content.artifact_generate', tool: 'ds_publish' },
  ]);
  assert.deepEqual(editPost.required_tool_sequence, [
    { tool: 'ds_read' },
    { action: 'draft', capability_id: 'content.artifact_create', tool: 'ds_publish' },
    { action: 'list', capability_id: 'content.artifact_list', tool: 'ds_publish' },
    { action: 'get', capability_id: 'content.artifact_get', tool: 'ds_publish' },
    { action: 'update', capability_id: 'content.artifact_update', tool: 'ds_publish' },
  ]);
  for (const [relative, content] of Object.entries(artifacts)) {
    if (!relative.startsWith('generated/architect/') || !relative.endsWith('/evals.json')) continue;
    if (relative === 'generated/architect/social/evals.json') continue;
    assert.doesNotMatch(content, /required_tool_sequence/, `${relative}: retired tool-sequence field reintroduced`);
    for (const name of retiredToolNames) {
      assert.doesNotMatch(content, new RegExp(`"${name}"`), `${relative}: retired tool name "${name}" reintroduced`);
    }
  }
});

test('ordinary build rejects stale digests, duplicate registry entries, and broken tool references', () => {
  const root = mkdtempSync(join(tmpdir(), 'dreamstate-build-manifest-'));
  const path = join(root, 'capabilities.json');
  const write = (value: Record<string, unknown>) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
  const signed = (overrides: Record<string, unknown>) => {
    const value = structuredClone({ ...catalog, ...overrides });
    delete value.manifest_digest;
    value.manifest_digest = canonicalCapabilityManifestDigest(value);
    return value;
  };
  try {
    write({ ...catalog, capability_hash: 'f'.repeat(16) });
    assert.throws(() => build({ capabilityPath: path }), /manifest digest mismatch/i);

    write(signed({
      capabilities: [...catalog.capabilities, catalog.capabilities[0]],
      counts: { ...catalog.counts, capabilities: catalog.counts.capabilities + 1 },
    }));
    assert.throws(() => build({ capabilityPath: path }), /duplicate capability id/i);

    const capabilities = structuredClone(catalog.capabilities);
    capabilities[0].mcp_tools = ['not_a_registered_tool'];
    write(signed({ capabilities }));
    assert.throws(() => build({ capabilityPath: path }), /unknown MCP tool/i);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('--check passes immediately after a build (generated tree is deterministic)', () => {
  writeArtifacts(build());
  const drifted = checkArtifacts(build());
  assert.deepEqual(drifted, [], 'a fresh build must match what was just written');
});

test('every indexed skill references only catalog tools, with correct derived scopes', () => {
  writeArtifacts(build());
  const index = JSON.parse(readFileSync(join(ROOT, 'skills-index.json'), 'utf8'));
  const gatewayTools = new Set(['ds_search', 'ds_api']);
  assert.ok(index.skills.length >= 5, 'expected several skills');
  for (const skill of index.skills) {
    // The generated skill.meta.json must exist at the indexed path.
    const meta = JSON.parse(readFileSync(join(ROOT, skill.path, 'skill.meta.json'), 'utf8'));
    assert.equal(meta.slug, skill.slug);
    for (const tool of meta.tools_used) {
      assert.ok(catalog.mcp_tools.some((entry: { name: string }) => entry.name === tool), `${skill.slug}: tool ${tool} not in catalog`);
    }
    // Required scopes include both direct tool scopes and scopes inherited from
    // capability records that expose those tools.
    const capabilityScopes = catalog.capabilities
      .filter((capability: { id: string }) => skill.capability_ids.includes(capability.id))
      .flatMap((capability: { required_scopes: string[] }) => capability.required_scopes);
    const expected = [...new Set([...meta.tools_used.map((t: string) => catalog.mcp_tools.find((entry: { name: string; scope: string | null }) => entry.name === t)?.scope).filter(Boolean), ...capabilityScopes])].sort();
    assert.deepEqual(meta.required_scopes, expected, `${skill.slug}: required_scopes mismatch`);
    if (['executable', 'guided-execution'].includes(skill.execution_mode) && skill.mcp_tools.some((tool: string) => gatewayTools.has(tool))) {
      assert.ok(skill.capability_ids.length > 0, `${skill.slug}: compact gateway skills must declare an explicit capability boundary`);
      assert.ok(skill.capability_ids.length < catalog.capabilities.length, `${skill.slug}: compact gateway tools must not expand to the full registry`);
    }
  }
});

test('mcp-prompts.json carries one prompt per skill with a body and scopes', () => {
  writeArtifacts(build());
  const prompts = JSON.parse(readFileSync(join(ROOT, 'dist', 'mcp-prompts.json'), 'utf8'));
  const index = JSON.parse(readFileSync(join(ROOT, 'skills-index.json'), 'utf8'));
  assert.equal(prompts.prompts.length, index.skills.filter((skill: { execution_mode: string }) => skill.execution_mode !== 'planned').length);
  for (const pr of prompts.prompts) {
    assert.ok(pr.name && pr.description && pr.body, `prompt ${pr.name} missing a field`);
    assert.ok(Array.isArray(pr.required_scopes));
  }
});

test('all generated skill dependencies and GitHub paths resolve to real files', () => {
  writeArtifacts(build());
  const index = JSON.parse(readFileSync(join(ROOT, 'skills-index.json'), 'utf8'));
  const slugs = new Set(index.skills.map((skill: { slug: string }) => skill.slug));
  for (const skill of index.skills) {
    const manifest = JSON.parse(readFileSync(join(ROOT, skill.path, 'skill.meta.json'), 'utf8'));
    for (const dependency of manifest.requires_skills) assert.ok(slugs.has(dependency), `${skill.slug}: missing dependency ${dependency}`);
    assert.equal(readFileSync(join(ROOT, skill.github_path), 'utf8').length > 0, true, `${skill.slug}: missing GitHub target`);
    for (const resource of ['references/operating-guide.md', 'examples/example.md', 'evals/contract.json']) {
      assert.equal(readFileSync(join(ROOT, skill.path, resource), 'utf8').length > 0, true, `${skill.slug}: missing ${resource}`);
    }
    const evaluation = JSON.parse(readFileSync(join(ROOT, skill.path, 'evals', 'contract.json'), 'utf8'));
    assert.equal(evaluation.evaluator, 'dreamstate-skill-contract-v1');
    assert.equal(evaluation.cases.length, 6);
    for (const testCase of evaluation.cases) {
      assert.ok(testCase.name && testCase.input && testCase.expected && testCase.check, `${skill.slug}: malformed eval case`);
    }
    const toolCase = evaluation.cases.find((testCase: { name: string }) => testCase.name === 'uses-declared-contracts-only');
    assert.deepEqual(toolCase.expected.allowed_tools, skill.mcp_tools);
    assert.deepEqual(toolCase.expected.allowed_capability_ids, skill.capability_ids);
  }
});

test('site catalog is the same complete catalog as the installer index', () => {
  writeArtifacts(build());
  const index = JSON.parse(readFileSync(join(ROOT, 'skills-index.json'), 'utf8'));
  const site = JSON.parse(readFileSync(join(ROOT, 'generated', 'site', 'skills-catalog.json'), 'utf8'));
  assert.equal(site.skills.length, index.skills.length);
  assert.deepEqual(site.skills.map((skill: { slug: string }) => skill.slug), index.skills.map((skill: { slug: string }) => skill.slug));
});

test('one pinned release generates hash-identical Architect, Claude, and Codex kernels and evals', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  const clients = JSON.parse(artifacts['generated/client-adapters/RELEASE.json']);
  const { manifest_digest: declaredManifestDigest, ...unsignedCatalog } = catalog;
  assert.equal(
    canonicalCapabilityManifestDigest(unsignedCatalog),
    declaredManifestDigest,
    'the release must pin the digest of the current canonical manifest bytes',
  );
  assert.match(pinned.source_release, /^\d+\.\d+\.\d+/);
  assert.doesNotMatch(pinned.source_release, /bootstrap|development/i);
  assert.match(pinned.source_release_hash, /^[a-f0-9]{64}$/);
  assert.equal(pinned.compatibility.playbook_kernel_hash, pinned.source_release_hash);
  assert.equal(catalog.manifest_digest, CANONICAL_MANIFEST_DIGEST);
  assert.equal(pinned.compatibility.manifest_digest, CANONICAL_MANIFEST_DIGEST);
  assert.match(pinned.compatibility.manifest_digest, /^[a-f0-9]{64}$/);
  assert.equal(pinned.compatibility.capability_hash, catalog.capability_hash);
  assert.equal(pinned.compatibility.capability_definition_version, catalog.definition_version);
  assert.equal(pinned.compatibility.minimum_api_version, catalog.api_version);
  assert.doesNotMatch(JSON.stringify(pinned.compatibility), /development/i);
  assert.equal(clients.source_release_hash, pinned.source_release_hash);
  assert.deepEqual(clients.compatibility, pinned.compatibility);
  assert.equal(pinned.schema_version, 2);
  assert.equal(clients.schema_version, 2);

  const ids = Object.keys(pinned.skills).sort();
  assert.deepEqual(ids, [...ARCHITECT_PACKAGE_IDS].sort());
  for (const id of ids) {
    const architectRoot = `generated/architect/${id}`;
    const architect = artifacts[`${architectRoot}/SKILL.md`];
    const expectedArchitectFiles = [
      'KERNEL.md', 'SKILL.md', 'evals.json',
      ...Object.keys(pinned.skills[id].supporting_sha256 ?? {}),
    ].sort();
    const exactArchitectFiles = Object.keys(artifacts)
      .filter((path) => path.startsWith(`${architectRoot}/`))
      .map((path) => path.slice(architectRoot.length + 1))
      .sort();
    assert.deepEqual(exactArchitectFiles, expectedArchitectFiles);
    assert.doesNotMatch(architect, /mutation_compatibility:/);
    assert.match(architect, new RegExp(`^  manifest_digest: ${CANONICAL_MANIFEST_DIGEST}$`, 'm'));
    // The retired eight-tool harness (tools_search/tools_get/tools_run,
    // propose_artifact/request_approval, load_skill, open_canvas, bare
    // ask_user) must never appear as an instruction to call a tool by that
    // name again: that is the exact bug that poisoned every generated
    // package. The live twelve-tool surface must be named instead.
    assert.doesNotMatch(architect, /`(?:tools_search|tools_get|tools_run|propose_artifact|request_approval|load_skill|open_canvas|ask_user)`/);
    for (const tool of [
      'ds_read', 'ds_write', 'ds_edit', 'ds_search', 'ds_records', 'ds_workbook',
      'ds_publish', 'ds_plan', 'ds_analytics', 'ds_engage', 'ds_api', 'ds_ask',
    ]) {
      assert.match(architect, new RegExp('`' + tool + '`'));
    }
    assert.match(architect, /ARRAY of paths/);
    assert.match(architect, /skill:\/\/<id>\/<file>\.md/);
    assert.match(architect, /`purpose`/);
    assert.match(architect, /one consolidated popup carrying every remaining question/);
    assert.match(architect, /fix_input, fetch_first, ask_user, or wait/);
    assert.match(architect, /unknown_outcome overrides all of these/);
    assert.match(architect, /Queued is not sent\. Approved is not published\./);
    assert.match(architect, /## Capability routing/);
    const mutates = pinned.skills[id].capability_ids.some((capabilityId: string) => (
      catalog.capabilities.some(
        (capability: { id: string; mutates?: boolean }) => (
          capability.id === capabilityId && capability.mutates === true
        ),
      )
    ));
    if (mutates) {
      assert.match(
        architect,
        /server's ActionDecision determines whether each exact operation auto-runs/,
      );
    }
    for (const client of ['claude', 'codex']) {
      const clientRoot = `generated/client-adapters/${client}/${id}`;
      const standalone = artifacts[`${clientRoot}/SKILL.md`];
      assert.equal(artifacts[`${clientRoot}/KERNEL.md`], artifacts[`${architectRoot}/KERNEL.md`]);
      assert.equal(artifacts[`${clientRoot}/evals.json`], artifacts[`${architectRoot}/evals.json`]);
      for (const [field, expected] of Object.entries(pinned.compatibility)) {
        assert.match(standalone, new RegExp(`^  ${field}: ${String(expected)}$`, 'm'));
      }
      assert.match(standalone, new RegExp(`^  source_release_hash: ${pinned.source_release_hash}$`, 'm'));
      assert.match(standalone, new RegExp(`^  kernel_sha256: ${pinned.skills[id].kernel_sha256}$`, 'm'));
      assert.match(standalone, new RegExp(`^  evals_sha256: ${pinned.skills[id].evals_sha256}$`, 'm'));
      assert.match(standalone, new RegExp(`^  adapter_sha256: ${clients.skills[id].adapter_sha256[client]}$`, 'm'));
      assert.match(standalone, /mismatch_behavior: deny_run/);
      assert.match(standalone, /manifest_digest_match: exact_sha256/);
      assert.match(standalone, /Carry the server's ActionDecision mechanically/);
      assert.match(
        standalone,
        /recovery_operations: \[ds_search\]/,
      );
      assert.match(
        standalone,
        /denied_operations: \[ds_api, ds_write, ds_edit\]/,
      );
      assert.match(standalone, /Refuse `ds_api`, `ds_write`, and `ds_edit` until the installed package is refreshed/);
      assert.match(standalone, /full 64-character SHA-256 manifest digest/i);
      assert.match(standalone, /`ds_search` \(scope: 'capabilities'\)/);
      assert.match(standalone, /include_schema: true/);
      assert.match(standalone, /prior model-driven proposal flow.*is retired/i);
      assert.match(standalone, /mint a `capability_ref`/);
      assert.match(standalone, /`ds_api` \(`action: 'run'`\)/);
      assert.match(standalone, /fix_input, fetch_first, ask_user, or wait/);
      assert.match(standalone, /unknown_outcome overrides all of these/);
      assert.match(standalone, /read the target back/);
      assert.match(standalone, /^completion_contract: \{"version":1,"fields":\[/m);
      // The retired eight-tool harness and the retired proposal/run-polling
      // vocabulary must never reappear in a standalone Claude/Codex package:
      // that is the exact bug this migration closes.
      assert.doesNotMatch(standalone, /\bdreamstate_[a-z_]+\b/);
      // "no model-visible ping tool" is legitimate prose explaining the
      // retirement; a backtick-quoted `ping` naming it as a tool to call is
      // the actual regression this guards against.
      assert.doesNotMatch(standalone, /`ping`/);
    }
    assert.equal(pinned.skills[id].kernel_sha256, clients.skills[id].kernel_sha256);
    assert.equal(pinned.skills[id].evals_sha256, clients.skills[id].evals_sha256);
    assert.match(
      artifacts[`${architectRoot}/SKILL.md`],
      /bounded structured partial outputs plus the exact next transition/,
    );
    assert.match(artifacts[`${architectRoot}/SKILL.md`], /^completion_contract: \{"version":1,"fields":\[/m);
  }
});

test('action authority is server-owned and no source or generated package carries an action allowlist', () => {
  const artifacts = build();
  const forbidden = /direct_run_capability_ids|direct[- ]run (?:capability )?(?:ids?|allowlist)|complete allowlist for direct mutating|not named in that exact allowlist/i;
  for (const [path, content] of Object.entries(artifacts)) {
    assert.doesNotMatch(content, forbidden, `${path} carries obsolete action authority`);
  }
  for (const skill of architectSource.skills as Array<{ id: string }>) {
    const kernel = readFileSync(join(ROOT, 'architect-kernels', skill.id, 'KERNEL.md'), 'utf8');
    assert.doesNotMatch(kernel, forbidden, `${skill.id}/KERNEL.md carries obsolete action authority`);
  }
});

test('Context is one files-first Markdown graph with a direct-write, approval-bound-lifecycle authority split', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  const context = architectSource.skills.find((skill: { id: string }) => skill.id === 'context');
  assert.ok(context);

  // The authority model changed deliberately, it did not erode. `propose_artifact`
  // and `request_approval` were retired with the model-driven proposal flow
  // (decision E1), and the backend now admits authoring as a DIRECT write for an
  // Architect principal: `requireDirectContextEditor`
  // (apps/backend/src/services/brain/brainCapabilityExecutor.ts:316-356) lets
  // create_document, create_folder, save_draft and save_and_publish through with
  // no approval binding, while every lifecycle mutation below still requires one.
  // That split is the real invariant, so this test asserts both halves: authoring
  // is granted, and human review decisions (publish/reject/resolve_conflict) are
  // still not the agent's to make.
  const agentCapabilities = [
    'brain.context.archive_document',
    'brain.context.backlinks',
    'brain.context.browse',
    'brain.context.create_document',
    'brain.context.create_folder',
    'brain.context.delete_document',
    'brain.context.get',
    'brain.context.graph',
    'brain.context.history',
    'brain.context.list_proposals',
    'brain.context.move_document',
    'brain.context.preview_agent_view',
    'brain.context.propose',
    'brain.context.propose_document',
    'brain.context.rebuild_links',
    'brain.context.register_source',
    'brain.context.list',
    'brain.context.rename_document',
    'brain.context.restore_document',
    'brain.context.save_and_publish',
    'brain.context.save_draft',
    'brain.context.search',
    'brain.context.website_source_register',
    'brain.evidence.search',
    'brain.graph.neighborhood',
    'brain.knowledge.digest',
    'brain.knowledge.doc_map',
    'brain.knowledge.document',
    'brain.knowledge.index',
  ].sort();
  assert.deepEqual(pinned.skills.context.capability_ids, agentCapabilities);

  // A package is no longer KERNEL.md plus evals.json. The depth that used to be
  // crammed into one kernel now lives in level-3 supporting files
  // (`skill://context/writing.md` and friends), so the package's prose is the
  // union of them. Reading only KERNEL.md would let a real invariant move one
  // file over and silently stop being asserted.
  const contextDir = join(ROOT, 'architect-kernels', 'context');
  const contextSource = [
    JSON.stringify(context),
    ...readdirSync(contextDir)
      .filter((file) => file.endsWith('.md'))
      .sort()
      .map((file) => readFileSync(join(contextDir, file), 'utf8')),
    readFileSync(join(contextDir, 'evals.json'), 'utf8'),
  ].join('\n');
  assert.match(
    contextSource,
    /Read and write the one files-first workspace wiki/,
  );
  assert.match(contextSource, /a fresh workspace is empty of documents/i);
  assert.match(
    contextSource,
    /The protected workspace roots are exactly `Sources`, `Outreach`, `Social`, `Website`, `Records`/,
  );
  assert.match(contextSource, /Beyond those five seeded, protected system roots, the tree is free-form/);
  assert.match(contextSource, /Source: <url> fetched <date>/);
  assert.match(contextSource, /Provenance lives in the Markdown itself; there is no separate citation ledger and no hidden context/);
  assert.match(contextSource, /author and publish it directly/i);
  assert.match(contextSource, /backlinks.*read-only inspection/i);
  assert.match(contextSource, /governed mutations for a directly authenticated Context editor/i);
  assert.match(contextSource, /delete_document.*irreversible.*fresh owner-exact approval/i);
  assert.doesNotMatch(
    contextSource,
    /Company Brain|Company Context|Personal Context/i,
  );

  // Deciding a human's review is still not the agent's to do. These stay out.
  const excludedGovernanceCapabilities = [
    'brain.context.publish',
    'brain.context.reject',
    'brain.context.resolve_conflict',
  ];
  for (const capabilityId of excludedGovernanceCapabilities) {
    assert.equal(pinned.skills.context.capability_ids.includes(capabilityId), false);
  }
});

test('Architect kernels and evals ground work in the canonical workspace wiki, not retired Brain trees', () => {
  const source = [
    readFileSync(join(ROOT, 'architect-kernels', 'skills.json'), 'utf8'),
    ...(architectSource.skills as Array<{ id: string }>).flatMap((skill) => [
      readFileSync(join(ROOT, 'architect-kernels', skill.id, 'KERNEL.md'), 'utf8'),
      readFileSync(join(ROOT, 'architect-kernels', skill.id, 'evals.json'), 'utf8'),
    ]),
  ].join('\n');
  assert.doesNotMatch(source, /Company Brain|Company Context|Personal Context/i);
});

test('social analytics refresh authority is earned by a real-user eval', () => {
  const artifacts = build();
  const social = JSON.parse(artifacts['generated/architect/social/evals.json']);
  const refreshCase = social.cases.find(
    (item: { id: string }) => item.id === 'refresh-and-diagnose-social-performance',
  );
  assert.ok(refreshCase);
  assert.ok(refreshCase.required_capability_ids.includes('social.analytics_refresh'));
  assert.match(
    artifacts['generated/architect/social/KERNEL.md'],
    /"social\.analytics_refresh"/,
  );
});

test('Architect generation rejects signed capability IDs absent from the pinned registry', () => {
  const withoutRequiredCapability = {
    ...catalog,
    capabilities: catalog.capabilities.filter((capability: { id: string }) => capability.id !== 'sources.cold_outbound_expand'),
  };
  assert.throws(
    () => buildArchitectArtifacts(withoutRequiredCapability),
    /sourcing-enrichment.*capability id sources\.cold_outbound_expand.*pinned capability manifest/i,
  );
});

test('Architect exact grants are derived only from machine-readable eval operation contracts', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  const expected = Object.fromEntries(
    architectSource.skills.map((skill: { id: string }) => {
      const evals = JSON.parse(readFileSync(
        join(ROOT, 'architect-kernels', skill.id, 'evals.json'),
        'utf8',
      ));
      const capabilityIds = [...new Set(evals.cases.flatMap(
        (item: { required_capability_ids?: string[] }) => item.required_capability_ids ?? [],
      ))].sort();
      return [skill.id, capabilityIds];
    }),
  );

  for (const [skillId, capabilityIds] of Object.entries(expected)) {
    assert.deepEqual(pinned.skills[skillId].capability_ids, capabilityIds);
    assert.match(
      artifacts[`generated/architect/${skillId}/SKILL.md`],
      new RegExp(`^capability_ids: ${JSON.stringify(capabilityIds).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm'),
    );
  }
  assert.ok(
    architectSource.skills.every((skill: Record<string, unknown>) => !('capability_ids' in skill)),
    'source manifests must not carry a second hand-maintained grant list',
  );
  assert.ok(
    !pinned.skills.context.capability_ids.includes('brain.context.reject'),
    'a canonical id absent from eval operation contracts must never become authority',
  );
});

test('weekly growth coordination earns calendar and task creation authority from a real-user eval', () => {
  const artifacts = build();
  const weekly = JSON.parse(artifacts['generated/architect/planning/evals.json']);
  const coordination = weekly.cases.find(
    (item: { id?: string }) => item.id === 'customer-follow-up-coordination',
  );
  assert.deepEqual(coordination.required_capability_ids, [
    'calendar.events_create',
    'calendar.events_list',
    'tasks.create',
    'tasks.get',
    'record_files.upload',
    'record_files.list',
    'records.get',
  ]);
});

test('site onboarding registers evidence and proposes useful Markdown without imposing a document template', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  const capabilityIds = pinned.skills.workspace.capability_ids;
  // site-onboarding was folded into workspace as a supporting file, not a
  // standalone kernel: the short map lives in KERNEL.md and the onboarding
  // depth lives in site-onboarding.md, so the invariant is checked against
  // the combined text a model actually reads for this job.
  const kernel = `${artifacts['generated/architect/workspace/KERNEL.md']}\n${artifacts['generated/architect/workspace/site-onboarding.md']}`;
  const evals = JSON.parse(artifacts['generated/architect/workspace/evals.json']);

  assert.ok(capabilityIds.includes('brain.context.website_source_register'));
  assert.ok(capabilityIds.includes('brain.context.propose_document'));
  assert.equal(capabilityIds.includes('brain.context.create_document'), false);
  assert.equal(capabilityIds.includes('brain.context.save_and_publish'), false);
  assert.match(
    kernel,
    /register the exact website source.*before proposing wiki content/is,
  );
  assert.match(kernel, /Choose file names and organization from the evidence and the request/);
  assert.doesNotMatch(
    kernel,
    /Product Information|Ideal Customer|Competitor Analysis|Tone of Voice|Marketing Strategy/i,
  );
  const freshSite = evals.cases.find((item: { id: string }) => item.id === 'fresh-site-to-proposed-workspace-wiki');
  assert.ok(freshSite);
  assert.match(freshSite.request, /onboard https:\/\/example\.com/i);
  assert.match(freshSite.request, /workspace knowledge our team needs/i);
  assert.ok(freshSite.required_capability_ids.includes('brain.context.website_source_register'));
  assert.ok(freshSite.required_capability_ids.includes('brain.context.propose_document'));
  assert.ok(freshSite.expected_workspace_outcome.some(
    (outcome: { check: string; expected: string }) => (
      outcome.check === 'context_document_revision_attested' && outcome.expected === 'present'
    ),
  ));
});

test('every kernel compliance contract exactly covers its eval-declared operation authority', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  assert.deepEqual(Object.keys(pinned.skills).sort(), [...ARCHITECT_PACKAGE_IDS].sort());

  // strategy was folded into planning; planning's KERNEL.md operation
  // contract still declares brain.learning.query_benchmarks and the same
  // drift-detection invariant applies to its new owner.
  const path = join(ROOT, 'architect-kernels', 'planning', 'KERNEL.md');
  const original = readFileSync(path, 'utf8');
  const drifted = original.replace(
    '"brain.learning.query_benchmarks",',
    '',
  );
  assert.notEqual(drifted, original);
  try {
    writeFileSync(path, drifted);
    assert.throws(
      () => buildArchitectArtifacts(catalog),
      /planning.*operation contract.*eval-declared capability authority/i,
    );
  } finally {
    writeFileSync(path, original);
  }
});

test('Architect generation requires a full canonical manifest digest', () => {
  assert.throws(
    () => buildArchitectArtifacts({ ...catalog, manifest_digest: CANONICAL_MANIFEST_DIGEST.slice(0, 16) }),
    /manifest digest is invalid/i,
  );
});

test('signed capability domains stay identical across source, Architect, Claude, Codex, and release manifests', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  const clients = JSON.parse(artifacts['generated/client-adapters/RELEASE.json']);
  const expected: Record<string, string[]> = {
    analytics: [
      'analytics', 'attribution', 'command_center', 'gtm', 'outreach',
      'page_analytics', 'sequences', 'social', 'visibility', 'workflows',
    ],
    context: ['brain'],
    crm: [
      'brain', 'products', 'record_attributes', 'record_deals', 'record_definitions',
      'record_exports', 'record_files', 'record_imports', 'record_objects',
      'record_pipeline_stages', 'record_pipelines', 'record_relationships',
      'record_templates', 'records', 'saved_views', 'tasks',
    ],
    workbooks: [
      'attachments', 'brain', 'cells', 'columns', 'rows', 'selection_snapshots',
      'table_runs', 'table_sources', 'tables', 'views', 'workbooks', 'worksheets',
    ],
    'sourcing-enrichment': [
      'attachments', 'audiences', 'brain', 'cells', 'columns', 'evidence', 'executable_definitions',
      'executables', 'outreach', 'record_enrichment', 'rows', 'signal_sources', 'sources',
      'table_runs', 'table_sources', 'tables', 'workbooks', 'worksheets',
    ],
    qualification: [
      'audiences', 'brain', 'cells', 'columns', 'outreach', 'rows',
      'selection_snapshots', 'table_runs', 'tables', 'views', 'workbook_audiences',
      'workbooks', 'worksheets',
    ],
    planning: [
      'brain', 'calendar', 'command_center', 'content', 'growth', 'gtm', 'identity',
      'outreach', 'record_files', 'records', 'sequences', 'social', 'tasks', 'visibility',
      'workbooks', 'workflows',
    ],
    research: ['brain', 'evidence', 'research', 'tools'],
    seo: ['brain', 'integrations', 'seo', 'tools', 'visibility'],
    geo: ['brain', 'integrations', 'seo', 'tools', 'visibility'],
    sequences: ['brain', 'outreach', 'rows', 'sequences'],
    workflows: [
      'brain', 'executable_definitions', 'executables', 'runs', 'selection_snapshots',
      'sequences', 'table_runs', 'tables', 'workflows',
    ],
    social: ['brain', 'content', 'social', 'tools'],
    'social.linkedin': ['brain', 'social', 'tables'],
    'social.reddit': ['brain', 'social', 'tables'],
    'social.x': ['brain', 'social', 'tables'],
    workspace: [
      'brain', 'integrations', 'mailboxes', 'notifications', 'outreach', 'products',
      'seo', 'visibility', 'webhooks', 'workspace',
    ],
    writing: ['brain', 'content', 'research'],
  };

  assert.deepEqual(
    Object.fromEntries(architectSource.skills.map((skill: { id: string; capability_domains: string[] }) => [
      skill.id,
      skill.capability_domains,
    ])),
    expected,
  );
  for (const [id, capabilityDomains] of Object.entries(expected)) {
    assert.deepEqual(pinned.skills[id].capability_domains, capabilityDomains);
    assert.deepEqual(clients.skills[id].capability_domains, capabilityDomains);
    for (const root of [
      `generated/architect/${id}`,
      `generated/client-adapters/claude/${id}`,
      `generated/client-adapters/codex/${id}`,
    ]) {
      assert.ok(
        artifacts[`${root}/SKILL.md`].split('\n').includes(
          `capability_domains: ${JSON.stringify(capabilityDomains)}`,
        ),
        `${root}/SKILL.md must carry the signed capability domain closure`,
      );
    }
  }
  assert.deepEqual(Object.keys(expected).sort(), [...ARCHITECT_PACKAGE_IDS].sort());
});

test('planning and Social retain pooled benchmark authority after the package split', () => {
  const artifacts = build();
  const planning = JSON.parse(artifacts['generated/architect/planning/evals.json']);
  const restaurantOwners = planning.cases.find((item: { id: string }) => item.id === 'named-cohort-strategy-benchmark');
  assert.ok(restaurantOwners);
  assert.deepEqual(restaurantOwners.required_capability_ids, ['brain.learning.query_benchmarks']);
  assert.deepEqual(restaurantOwners.required_executed_capability_ids, ['brain.learning.query_benchmarks']);

  const social = JSON.parse(artifacts['generated/architect/social/evals.json']);
  assert.ok(social.cases.some((item: { id: string }) => item.id === 'founder-posts-pooled-benchmark'));
});

// This invariant now lives specifically in the per-platform social.x package
// (the other platform kernels do not carry it): the exact wording moved with
// consolidation but the "do not block a scoped read on optional presentation
// choices" rule still holds.
test('social research executes scoped reads without blocking on optional presentation choices', () => {
  const kernel = build()['generated/architect/social.x/KERNEL.md'];
  assert.match(kernel, /topic or query and time window/i);
  assert.match(kernel, /ranking and output (?:format )?choices are optional/i);
  assert.match(kernel, /transparent defaults/i);
  assert.match(kernel, /nullable metrics/i);
  assert.match(kernel, /Ask only for truly required missing inputs/i);
});

test('a standalone Claude or Codex package keeps discovery usable but denies mutation on compatibility drift', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/client-adapters/RELEASE.json']);
  const mutationOperations = new Set(['ds_api', 'ds_write', 'ds_edit']);
  for (const client of ['claude', 'codex']) {
    const standalone = artifacts[`generated/client-adapters/${client}/context/SKILL.md`];
    const scalar = (field: string) => standalone.match(new RegExp(`^  ${field}: (.+)$`, 'm'))?.[1];
    const installed = {
      capability_definition_version: scalar('capability_definition_version'),
      capability_hash: scalar('capability_hash'),
      manifest_digest: scalar('manifest_digest'),
      minimum_api_version: scalar('minimum_api_version'),
    };
    assert.deepEqual(installed, {
      capability_definition_version: pinned.compatibility.capability_definition_version,
      capability_hash: pinned.compatibility.capability_hash,
      manifest_digest: pinned.compatibility.manifest_digest,
      minimum_api_version: pinned.compatibility.minimum_api_version,
    });
    // Dedicated Context write tools are mutation paths too. Compatibility
    // drift must deny them alongside the canonical run and proposal paths.
    const deniedOperations = standalone
      .match(/^  denied_operations: \[([^\]]+)\]$/m)?.[1]
      .split(', ')
      .sort();
    assert.deepEqual(deniedOperations, [...mutationOperations].sort());
    assert.equal(installed.manifest_digest, CANONICAL_MANIFEST_DIGEST);
    const live = { ...installed, manifest_digest: 'f'.repeat(64) };
    const compatible = Object.entries(installed).every(([key, value]) => live[key as keyof typeof live] === value);
    const permits = (operation: string) => !mutationOperations.has(operation) || compatible;
    for (const operation of [
      'ds_search',
    ]) assert.equal(permits(operation), true, `${client} must retain ${operation} for recovery`);
    for (const operation of mutationOperations) {
      assert.equal(permits(operation), false, `${client} must deny ${operation} on digest drift`);
    }
  }
});

// Every legacy `dreamstate_*` gateway tool, including the model-visible
// `ping`, was retired. The live MCP surface is exactly the twelve `ds_*`
// tools; nothing exposes a raw `register_source`-style escape hatch either.
test('the pinned MCP catalog exposes only the compact governed gateway', () => {
  assert.deepEqual(catalog.mcp_tools.map((tool: { name: string }) => tool.name).sort(), [
    'ds_analytics',
    'ds_api',
    'ds_ask',
    'ds_edit',
    'ds_engage',
    'ds_plan',
    'ds_publish',
    'ds_read',
    'ds_records',
    'ds_search',
    'ds_workbook',
    'ds_write',
  ]);
  assert.equal(
    catalog.mcp_tools.some((tool: { name: string }) => /register_source/.test(tool.name)),
    false,
  );
});

test('generated prospecting and execution packages contain no shortcut terminology', () => {
  const artifacts = build();
  const forbidden = /\b(?:templates?|presets?|reusable|reuse)\b/i;
  for (const id of ['workbooks', 'sourcing-enrichment', 'qualification', 'sequences']) {
    for (const [path, content] of Object.entries(artifacts)) {
      if (path.startsWith(`generated/architect/${id}/`) && path.endsWith('.md')) {
        assert.doesNotMatch(content, forbidden, path);
      }
      if (path === `generated/architect/${id}/evals.json`) {
        assert.doesNotMatch(content, forbidden, path);
      }
    }
  }

  const index = JSON.parse(artifacts['skills-index.json']);
  const outreachSkills = index.skills.filter((skill: { domain: string }) => skill.domain === 'outreach');
  for (const skill of outreachSkills) {
    assert.equal(skill.mcp_tools.includes('outreach_apply_template'), false, `${skill.slug}: forbidden agent shortcut tool`);
    assert.equal(skill.capability_ids.includes('intent:outreach.apply_template'), false, `${skill.slug}: forbidden agent shortcut capability`);
    assert.equal(skill.run_intents.includes('outreach.apply_template'), false, `${skill.slug}: forbidden agent shortcut intent`);
  }
  assert.doesNotMatch(artifacts['generated/site/skills-catalog.json'], /outreach_apply_template|intent:outreach\.apply_template|outreach\.apply_template/);
});

test('active prospecting and execution packages are campaign-free and reject retired campaign contracts', () => {
  const artifacts = build();
  const retiredEvalLanguage = /campaigns\.|campaign_state|campaign_id|outreach_campaigns|campaignId|outreachCampaignId|\bLaunch Campaign\b|\bcampaign(?:s|[-_][a-z0-9_]+)?\b/i;
  const activeIds = ['workbooks', 'sourcing-enrichment', 'qualification', 'sequences', 'workflows'];
  for (const id of activeIds) {
    assert.doesNotMatch(
      artifacts[`generated/architect/${id}/KERNEL.md`],
      retiredEvalLanguage,
      `${id}: active model-visible kernel language must use workbook, workflow, and sequence identities`,
    );
  }

  for (const id of activeIds) {
    const evals = JSON.parse(artifacts[`generated/architect/${id}/evals.json`]);
    assert.doesNotMatch(JSON.stringify(evals), retiredEvalLanguage, `${id}: retired eval identity or authority`);
  }
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  for (const id of Object.keys(pinned.skills)) {
    assert.equal(
      pinned.skills[id].capability_ids.some((capabilityId: string) => capabilityId.startsWith('campaigns.')),
      false,
      `${id}: retired campaign grant`,
    );
  }

  const path = join(ROOT, 'architect-kernels', 'sequences', 'KERNEL.md');
  const original = readFileSync(path, 'utf8');
  for (const retiredIdentity of ['campaign_id', 'outreach_campaigns', 'campaignId', 'outreachCampaignId']) {
    try {
      writeFileSync(path, `${original}\nRetired identity: ${retiredIdentity}.\n`);
      assert.throws(
        () => buildArchitectArtifacts(catalog),
        /sequences.*retired campaign.*(?:identity|terminology)/i,
      );
    } finally {
      writeFileSync(path, original);
    }
  }

  const evalPath = join(ROOT, 'architect-kernels', 'sourcing-enrichment', 'evals.json');
  const originalEvals = readFileSync(evalPath, 'utf8');
  const driftedEvals = JSON.parse(originalEvals);
  driftedEvals.cases[0].request = 'Bind campaign_id and propose Launch Campaign.';
  try {
    writeFileSync(evalPath, `${JSON.stringify(driftedEvals, null, 2)}\n`);
    assert.throws(
      () => buildArchitectArtifacts(catalog),
      /sourcing-enrichment.*retired campaign.*(?:identity|terminology|capability|state)/i,
    );
  } finally {
    writeFileSync(evalPath, originalEvals);
  }

  const manifestPath = join(ROOT, 'architect-kernels', 'skills.json');
  const originalManifest = readFileSync(manifestPath, 'utf8');
  const driftedManifest = JSON.parse(originalManifest);
  driftedManifest.skills.find((skill: { id: string }) => skill.id === 'sourcing-enrichment')
    .triggers.push('Launch Campaign');
  try {
    writeFileSync(manifestPath, `${JSON.stringify(driftedManifest, null, 2)}\n`);
    assert.throws(
      () => buildArchitectArtifacts(catalog),
      /sourcing-enrichment.*retired campaign.*(?:artifact|identity|terminology)/i,
    );
  } finally {
    writeFileSync(manifestPath, originalManifest);
  }
});

test('package ownership follows the prospecting-to-execution handoff', () => {
  const pinned = JSON.parse(build()['generated/architect/PINNED_RELEASE.json']);
  const owners = (capabilityId: string) => Object.keys(pinned.skills)
    .filter((skillId) => pinned.skills[skillId].capability_ids.includes(capabilityId));

  for (const capabilityId of ['workbooks.create']) {
    assert.deepEqual(owners(capabilityId), ['workbooks'], `${capabilityId}: workbook owner`);
  }
  for (const capabilityId of [
    'table_sources.preview_sync',
    'sources.cold_outbound_preview',
    'browser.linkedin.network_engagers_list',
    'sources.cold_outbound_expand',
    'executables.save',
    'executables.run',
    'columns.run_all',
  ]) {
    assert.deepEqual(owners(capabilityId), ['sourcing-enrichment'], `${capabilityId}: sourcing/enrichment owner`);
  }
  for (const capabilityId of [
    'selection_snapshots.create',
    'outreach.icp_classification_create',
    'outreach.icp_classification_job_get',
  ]) {
    assert.deepEqual(owners(capabilityId), ['qualification'], `${capabilityId}: qualification owner`);
  }
  assert.deepEqual(
    owners('selection_snapshots.get'),
    ['workbooks', 'workflows'],
    'snapshot inspection belongs to the data-plane handoff and workflow consumer',
  );
});

test('sequences authors and validates drafts while workflows owns launch closure', () => {
  const pinned = JSON.parse(build()['generated/architect/PINNED_RELEASE.json']);
  const sequences = pinned.skills.sequences.capability_ids as string[];
  const workflows = pinned.skills.workflows.capability_ids as string[];

  for (const capabilityId of ['sequences.bind', 'sequences.validate']) {
    assert.ok(sequences.includes(capabilityId), `sequences must own ${capabilityId}`);
    assert.equal(workflows.includes(capabilityId), false, `workflows must not own ${capabilityId}`);
  }
  for (const capabilityId of ['sequences.publish', 'sequences.enroll_selection']) {
    assert.equal(sequences.includes(capabilityId), false, `sequences must not own ${capabilityId}`);
    assert.ok(workflows.includes(capabilityId), `workflows must own ${capabilityId}`);
  }
  for (const capabilityId of [
    'workflows.create',
    'workflows.graph_apply',
    'workflows.validate_graph',
    'workflows.draft_publish',
    'workflows.enroll_selection',
    'workflows.activate',
  ]) {
    assert.ok(workflows.includes(capabilityId), `workflows must own ${capabilityId}`);
    assert.equal(sequences.includes(capabilityId), false, `sequences must not own ${capabilityId}`);
  }
});

test('split-package evals encode typed handoffs with current case IDs', () => {
  const artifacts = build();
  const readCases = (skillId: string) => JSON.parse(
    artifacts[`generated/architect/${skillId}/evals.json`],
  ).cases;
  const findCase = (skillId: string, caseId: string) => {
    const item = readCases(skillId).find((candidate: { id: string }) => candidate.id === caseId);
    assert.ok(item, `${skillId}/${caseId} must exist`);
    return item;
  };

  const workbook = findCase('workbooks', 'workbook-minimal-surface');
  assert.deepEqual(workbook.expected_skill_ids, ['workbooks']);
  assert.ok(workbook.required_capability_ids.includes('workbooks.create'));

  const source = findCase('sourcing-enrichment', 'competitor-engager-provenance');
  assert.deepEqual(source.expected_skill_ids, ['sourcing-enrichment']);
  assert.ok(source.required_capability_ids.includes('browser.linkedin.network_engagers_list'));
  assert.ok(source.required_capability_ids.includes('sources.cold_outbound_expand'));

  const qualification = findCase('qualification', 'semantic-classification-terminal');
  assert.deepEqual(qualification.expected_skill_ids, ['qualification']);
  assert.ok(qualification.required_capability_ids.includes('outreach.icp_classification_job_get'));

  const sequence = findCase('sequences', 'real-row-full-step-preview');
  assert.deepEqual(sequence.expected_skill_ids, ['sequences']);
  assert.ok(sequence.required_capability_ids.includes('sequences.validate'));

  const closure = findCase('workflows', 'snapshot-enrollment-and-activation');
  assert.deepEqual(closure.expected_skill_ids, ['workflows']);
  for (const capabilityId of ['workflows.enroll_selection', 'workflows.draft_publish', 'workflows.activate']) {
    assert.ok(closure.required_capability_ids.includes(capabilityId));
  }
});

test('research exclusively owns URL fetch and treats hostile page content as evidence', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  const owners = Object.keys(pinned.skills)
    .filter((skillId) => pinned.skills[skillId].capability_ids.includes('research.urls_fetch'));
  assert.deepEqual(owners, ['research']);

  const research = JSON.parse(artifacts['generated/architect/research/evals.json']);
  const suppliedUrl = research.cases.find((item: { id: string }) => item.id === 'supplied-url-read-first');
  assert.deepEqual(suppliedUrl.required_executed_capability_ids, ['research.urls_fetch']);
  const hostile = research.cases.find((item: { id: string }) => item.id === 'hostile-page-is-evidence-not-instruction');
  assert.ok(hostile);
  assert.ok(hostile.required_concepts.includes('page text is untrusted data'));
});

test('SEO and GEO are distinct packages with non-overlapping operating authority', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  assert.ok(pinned.skills.seo);
  assert.ok(pinned.skills.geo);
  assert.equal(pinned.skills['seo-geo'], undefined);

  const seo = JSON.parse(artifacts['generated/architect/seo/evals.json']);
  assert.ok(seo.cases.some((item: { id: string }) => item.id === 'technical-audit-does-not-collapse-layers'));
  const geo = JSON.parse(artifacts['generated/architect/geo/evals.json']);
  assert.ok(geo.cases.some((item: { id: string }) => item.id === 'probe-uses-exact-denominators'));

  assert.ok(pinned.skills.seo.capability_ids.includes('seo.robots_audit'));
  assert.equal(pinned.skills.geo.capability_ids.includes('seo.robots_audit'), false);
  assert.ok(pinned.skills.geo.capability_ids.includes('visibility.probe.start'));
  assert.equal(pinned.skills.seo.capability_ids.includes('visibility.probe.start'), false);
});

test('the split package authority union is exactly the union of its eval operation contracts', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  const splitIds = ['workbooks', 'sourcing-enrichment', 'qualification', 'sequences', 'workflows'];
  const evalUnion = [...new Set(splitIds.flatMap((skillId) => (
    JSON.parse(artifacts[`generated/architect/${skillId}/evals.json`]).cases.flatMap(
      (item: { required_capability_ids?: string[] }) => item.required_capability_ids ?? [],
    )
  )))].sort();
  const signedUnion = [...new Set(splitIds.flatMap(
    (skillId) => pinned.skills[skillId].capability_ids as string[],
  ))].sort();
  assert.deepEqual(signedUnion, evalUnion);
});

test('growth asset planning may describe a buyer template library but stays explicitly unsaved without a capability', () => {
  const artifacts = build();
  const assets = artifacts['generated/architect/planning/assets.md'];
  assert.match(assets, /template library/i);
  const evals = JSON.parse(artifacts['generated/architect/planning/evals.json']);
  const assetCase = evals.cases.find((item: { id: string }) => item.id === 'asset-unsaved-proposal');
  assert.ok(assetCase);
  assert.equal(assetCase.must_state_unsaved_without_capability, true);
  assert.match(assets, /explicitly unsaved proposal/i);
});

// The workspace_local_approved_mutation eval shape remains a separate
// production gate for the CRM and planning packages.
test('workspace-local production evals require exact approval and durable present outcomes', () => {
  const artifacts = build();
  const productionSkillIds = ['crm', 'planning'];
  const production = productionSkillIds.flatMap((skillId) => (
    JSON.parse(artifacts[`generated/architect/${skillId}/evals.json`]).cases
  ))
    .filter((item: { id: string }) => item.id.startsWith('production-local-'));

  assert.equal(production.length, 6);
  assert.equal(production.filter((item: { skill_id?: string }) => item.skill_id === undefined).length, 6);
  for (const item of production) {
    assert.equal(item.execution_profile, 'production_real');
    assert.equal(item.fixture_profile, 'workspace_local_approved_mutation');
    assert.equal(item.resume_after_approval, 'owner_exact');
    assert.deepEqual(item.allowed_consequence_levels, ['draft_write']);
    assert.ok(item.approved_mutation_capability_ids.length > 0);
    assert.ok(item.approved_mutation_capability_ids.every(
      (capabilityId: string) => item.required_capability_ids.includes(capabilityId),
    ));
    // The old "max_changes >= count of approved mutation capability ids" bound
    // was inferred only from tables' single-domain examples and does not hold
    // generally now that crm exposes it too: production-local-person-record
    // legitimately grants two capability ids (record_objects.record_create,
    // records.create) for what settles as one durable record row. Only the
    // budget's shape (a small positive bound) is checked here.
    assert.ok(item.approved_mutation_max_changes >= 1);
    assert.ok(item.approved_mutation_max_changes <= 8);
    assert.equal(item.required_tool_sequence, undefined);
    assert.ok(item.expected_workspace_outcome.some(
      (outcome: { expected?: string }) => outcome.expected === 'present',
    ));
    assert.equal(item.must_not_request_secrets, true);
    assert.ok(item.forbidden_test_substitutions.length > 0);
  }
});

// The real incident: a description ending "...rows: any durable dataset
// deliverable belongs to tables." was emitted unquoted, YAML read `rows:` as a
// nested mapping, and 28 downstream Python tests died on a file that `npm run
// build`, 63 upstream tests, the release sync, and the consistency checker had
// all just declared healthy. The build must now refuse to emit prose it cannot
// read back.
test('generated frontmatter is validated at emit time: unquotable prose fails the build', () => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), 'dreamstate-frontmatter-'));
  const sourceDir = join(fixtureRoot, 'architect-kernels');
  const manifestPath = join(sourceDir, 'skills.json');
  const victim = 'workbooks';
  const authored = architectSource.skills.find(
    (skill: { id: string }) => skill.id === victim,
  ).description;
  const withDescription = (description: string) => {
    const next = structuredClone(architectSource);
    next.skills.find((skill: { id: string }) => skill.id === victim).description = description;
    writeFileSync(manifestPath, `${JSON.stringify(next, null, 2)}\n`);
  };
  try {
    cpSync(join(ROOT, 'architect-kernels'), sourceDir, { recursive: true });

    // Control: the unmodified fixture builds, so every failure below is caused
    // by the description and not by the fixture copy.
    withDescription(authored);
    assert.ok(buildArchitectArtifacts(catalog, sourceDir)[`generated/architect/${victim}/SKILL.md`]);

    // Each of these is a character YAML gives a structural meaning to. Every
    // one must be refused by name, with the field and the character in the
    // message, rather than written out and discovered by a downstream parser.
    const rejected: Array<[string, RegExp]> = [
      ['Route durable rows: any durable dataset deliverable belongs to tables.', /colon followed by a space/],
      ['- Route durable dataset deliverables to tables.', /leading "-"/],
      ['#1 destination for durable dataset deliverables.', /leading "#"/],
      ['Route durable dataset deliverables to tables:', /trailing ":"/],
      ['Route durable dataset deliverables to tables #canonical', /space followed by "#"/],
    ];
    for (const [description, expected] of rejected) {
      withDescription(description);
      assert.throws(
        () => buildArchitectArtifacts(catalog, sourceDir),
        (error: Error) => {
          assert.match(error.message, expected, `expected ${JSON.stringify(description)} to be refused`);
          assert.match(error.message, new RegExp(`generated/architect/${victim}/SKILL\\.md`));
          assert.match(error.message, /field "description"/);
          assert.match(error.message, new RegExp(JSON.stringify(JSON.stringify(description)).slice(1, -1)));
          return true;
        },
        `expected the build to refuse ${JSON.stringify(description)}`,
      );
    }

    // Prose that is plain-safe still round-trips byte for byte, so the guard
    // rejects ambiguity rather than punctuation.
    const safe = 'Route durable dataset deliverables (tables, columns, rows) to tables.';
    withDescription(safe);
    const artifacts = buildArchitectArtifacts(catalog, sourceDir);
    assert.ok(
      artifacts[`generated/architect/${victim}/SKILL.md`].split('\n').includes(`description: ${safe}`),
    );
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

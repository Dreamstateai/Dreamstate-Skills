import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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

// build() IS the contract test: it parses every playbook, validates the
// frontmatter, and asserts every declared tool and capability exists in the
// pinned canonical manifest. If it
// returns without throwing, the contract held.
test('build succeeds: all playbooks valid and every tool exists in the catalog', () => {
  const artifacts = build();
  assert.ok(Object.keys(artifacts).length > 0, 'expected generated artifacts');
});

test('Architect eval tool sequences use only the eight compact runtime tools', () => {
  const allowed = new Set([
    'load_skill', 'ask_user', 'tools_search', 'tools_get', 'tools_run',
    'propose_artifact', 'request_approval', 'open_canvas',
  ]);
  const artifacts = build();
  const social = JSON.parse(artifacts['generated/architect/social/evals.json']);
  const makePost = social.cases.find(
    (item: { id: string }) => item.id === 'primitive-make-post-from-workspace-knowledge',
  );
  const editPost = social.cases.find(
    (item: { id: string }) => item.id === 'primitive-edit-post-by-current-revision',
  );
  assert.deepEqual(makePost.required_tool_sequence.map((step: { tool: string }) => step.tool), [
    'load_skill',
    'tools_search', 'tools_get', 'tools_run',
    'tools_search', 'tools_get', 'tools_run',
    'tools_search', 'tools_get', 'propose_artifact',
  ]);
  assert.deepEqual(editPost.required_tool_sequence.map((step: { tool: string }) => step.tool), [
    'load_skill',
    'tools_search', 'tools_get',
    'tools_search', 'tools_get', 'tools_run',
    'tools_search', 'tools_get', 'tools_run',
    'tools_search', 'tools_get', 'propose_artifact',
  ]);
  for (const [relative, content] of Object.entries(artifacts)) {
    if (!relative.startsWith('generated/architect/') || !relative.endsWith('/evals.json')) continue;
    const document = JSON.parse(content);
    for (const evalCase of document.cases) {
      for (const step of evalCase.required_tool_sequence ?? []) {
        assert.ok(allowed.has(step.tool), `${document.skill_id}/${evalCase.id}: unsupported ${step.tool}`);
      }
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
  const gatewayTools = new Set(['dreamstate_tools_search', 'dreamstate_tools_get', 'dreamstate_tools_run']);
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
  assert.equal(ids.length, 31);
  for (const id of ids) {
    const architectRoot = `generated/architect/${id}`;
    const architect = artifacts[`${architectRoot}/SKILL.md`];
    const exactArchitectFiles = Object.keys(artifacts)
      .filter((path) => path.startsWith(`${architectRoot}/`))
      .map((path) => path.slice(architectRoot.length + 1))
      .sort();
    assert.deepEqual(exactArchitectFiles, ['KERNEL.md', 'SKILL.md', 'evals.json']);
    assert.match(architect, /mutation_compatibility:/);
    assert.match(architect, /mismatch_behavior: deny_run/);
    assert.match(architect, /manifest_digest_match: exact_sha256/);
    assert.match(architect, new RegExp(`^  manifest_digest: ${CANONICAL_MANIFEST_DIGEST}$`, 'm'));
    assert.match(
      architect,
      /denied_operations: \[tools_run, propose_artifact, request_approval\]/,
    );
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
    assert.match(architect, /`propose_artifact`/);
    assert.match(architect, /`request_approval`/);
    assert.match(architect, /Refuse `tools_run` until the installed package is refreshed/);
    assert.match(architect, /full 64-character SHA-256 manifest digest/i);
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
        /recovery_operations: \[dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs\]/,
      );
      assert.match(
        standalone,
        /denied_operations: \[dreamstate_tools_run, dreamstate_context_create_document, dreamstate_context_create_folder, dreamstate_context_save_and_publish, dreamstate_context_save_draft, dreamstate_proposals_create, dreamstate_proposals_mutate\]/,
      );
      assert.match(standalone, /Refuse `dreamstate_tools_run` until the installed package is refreshed/);
      assert.match(standalone, /full 64-character SHA-256 manifest digest/i);
      assert.match(standalone, /`dreamstate_tools_search` and `dreamstate_tools_get`/);
      assert.match(standalone, /`dreamstate_proposals_create`/);
      assert.match(standalone, /human review/);
      assert.match(standalone, /`dreamstate_proposals_mutate`/);
      assert.match(standalone, /expected revision and state version/i);
      assert.match(standalone, /revise, approve, or reject/i);
      assert.match(standalone, /When ActionDecision requires a proposal/);
      assert.match(standalone, /returned `run_id`/);
      assert.match(standalone, /`dreamstate_get_run`/);
      assert.match(standalone, /^completion_contract: \{"version":1,"fields":\[/m);
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

test('Context is one files-first Markdown graph with bounded proposal authority', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  const context = architectSource.skills.find((skill: { id: string }) => skill.id === 'context');
  assert.ok(context);

  // Architect may read canonical knowledge, register evidence, and submit
  // proposals. Direct publication and human review decisions stay outside
  // this kernel.
  const agentCapabilities = [
    'brain.context.browse',
    'brain.context.get',
    'brain.context.graph',
    'brain.context.history',
    'brain.context.list_proposals',
    'brain.context.preview_agent_view',
    'brain.context.propose',
    'brain.context.propose_document',
    'brain.context.register_source',
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

  const contextSource = [
    JSON.stringify(context),
    readFileSync(join(ROOT, 'architect-kernels', 'context', 'KERNEL.md'), 'utf8'),
    readFileSync(join(ROOT, 'architect-kernels', 'context', 'evals.json'), 'utf8'),
  ].join('\n');
  assert.match(
    contextSource,
    /Read and write the one files-first workspace wiki/,
  );
  assert.match(contextSource, /A fresh workspace is empty/);
  assert.match(
    contextSource,
    /The protected workspace roots are exactly `Sources`, `Outreach`, `Social`, `Website`, `Records`/,
  );
  assert.match(contextSource, /Beyond those five seeded, protected system roots, the tree is free-form/);
  assert.match(contextSource, /Source: <url> fetched <date>/);
  assert.match(contextSource, /Provenance lives in the Markdown itself; there is no separate citation ledger and no hidden context/);
  assert.match(contextSource, /You do not create folders or documents, save drafts, or publish/);
  assert.match(contextSource, /submit proposals for a human actor to review and publish/);
  assert.match(contextSource, /Leave every proposal pending for a human actor to review and publish/);
  assert.doesNotMatch(
    contextSource,
    /Company Brain|Company Context|Personal Context/i,
  );

  const excludedDirectAndGovernanceCapabilities = [
    'brain.context.create_document',
    'brain.context.create_folder',
    'brain.context.publish',
    'brain.context.reject',
    'brain.context.resolve_conflict',
    'brain.context.save_and_publish',
    'brain.context.save_draft',
  ];
  for (const capabilityId of excludedDirectAndGovernanceCapabilities) {
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
    /tables.*capability id sources\.cold_outbound_expand.*pinned capability manifest/i,
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
  const weekly = JSON.parse(artifacts['generated/architect/weekly-growth-plan/evals.json']);
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
  const capabilityIds = pinned.skills['site-onboarding'].capability_ids;
  const kernel = artifacts['generated/architect/site-onboarding/KERNEL.md'];
  const evals = JSON.parse(artifacts['generated/architect/site-onboarding/evals.json']);

  assert.ok(capabilityIds.includes('brain.context.website_source_register'));
  assert.ok(capabilityIds.includes('brain.context.propose_document'));
  assert.equal(capabilityIds.includes('brain.context.create_document'), false);
  assert.equal(capabilityIds.includes('brain.context.save_and_publish'), false);
  assert.match(
    kernel,
    /register the exact website source before proposing wiki content/i,
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
  assert.equal(Object.keys(pinned.skills).length, 31);

  const path = join(ROOT, 'architect-kernels', 'strategy', 'KERNEL.md');
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
      /strategy.*operation contract.*eval-declared capability authority/i,
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
    analytics: [],
    audiences: ['audiences'],
    blog: ['content'],
    context: ['brain', 'context'],
    'growth-asset-planner': [],
    integrations: [],
    notifications: ['notifications'],
    outreach: ['brain', 'outreach'],
    'outreach-sequence-writer': ['outreach'],
    'outreach-workflow-builder': ['outreach'],
    products: ['products'],
    records: ['records'],
    'records-schema': ['records'],
    'records-pipelines': ['records'],
    'records-transfer': ['records'],
    'records-views': ['records'],
    'buyer-research-graph': ['graph', 'records'],
    experiments: ['growth'],
    seo: ['brain', 'content', 'tables', 'visibility'],
    signals: ['signals'],
    'site-onboarding': ['brain', 'content', 'visibility'],
    social: ['brain', 'content'],
    'social.linkedin': ['brain', 'social', 'tables'],
    'social.reddit': ['brain', 'social', 'tables'],
    'social.x': ['brain', 'social', 'tables'],
    strategy: ['brain', 'context'],
    tables: ['records', 'tables'],
    tasks: ['tasks'],
    visibility: ['visibility'],
    webhooks: ['webhooks'],
    'weekly-growth-plan': [],
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
  const workflowEvals = JSON.parse(
    artifacts['generated/architect/outreach-workflow-builder/evals.json'],
  );
  const exactCapabilityIds = [...new Set(workflowEvals.cases.flatMap(
    (item: { required_capability_ids?: string[] }) => item.required_capability_ids ?? [],
  ))].sort();
  assert.equal(
    'capability_ids' in architectSource.skills.find(
      (skill: { id: string }) => skill.id === 'outreach-workflow-builder',
    ),
    false,
  );
  assert.deepEqual(pinned.skills['outreach-workflow-builder'].capability_ids, exactCapabilityIds);
  assert.deepEqual(clients.skills['outreach-workflow-builder'].capability_ids, exactCapabilityIds);
  for (const root of [
    'generated/architect/outreach-workflow-builder',
    'generated/client-adapters/claude/outreach-workflow-builder',
    'generated/client-adapters/codex/outreach-workflow-builder',
  ]) {
    assert.ok(
      artifacts[`${root}/SKILL.md`].split('\n').includes(`capability_ids: ${JSON.stringify(exactCapabilityIds)}`),
      `${root}/SKILL.md must carry the signed exact capability closure`,
    );
  }
});

test('audience planning kernels require privacy-safe pooled benchmark evidence', () => {
  const artifacts = build();
  const outreach = JSON.parse(artifacts['generated/architect/outreach/evals.json']);
  const restaurantOwners = outreach.cases.find((item: { id: string }) => item.id === 'zero-history-restaurant-owners-pooled-benchmark');
  assert.ok(restaurantOwners);
  for (const concept of ['brain.learning.query_benchmarks', 'sample band', 'confidence', 'insufficient_evidence', 'never raw cross-workspace rows']) {
    assert.ok(restaurantOwners.required_concepts.includes(concept));
  }
  assert.equal(restaurantOwners.fixture_profile, 'outreach_zero_history_benchmark');
  assert.deepEqual(restaurantOwners.required_capability_ids, ['brain.learning.query_benchmarks']);
  assert.match(restaurantOwners.request, /restaurant owners/i);
  assert.match(restaurantOwners.request, /never targeted them before/i);
  assert.doesNotMatch(restaurantOwners.request, /brain\.learning\.query_benchmarks|privacy boundary|sample band/i);

  const social = JSON.parse(artifacts['generated/architect/social/evals.json']);
  assert.ok(social.cases.some((item: { id: string }) => item.id === 'founder-posts-pooled-benchmark'));
  const seo = JSON.parse(artifacts['generated/architect/seo/evals.json']);
  assert.ok(seo.cases.some((item: { id: string }) => item.id === 'agency-keywords-pooled-benchmark'));
  const technicalSeo = seo.cases.find((item: { id: string }) => item.id === 'technical-and-content-plan');
  assert.ok(technicalSeo);
  for (const pattern of [/owninfluence\.com/, /US-English marketing agencies/, /demo bookings/, /buffer\.com/, /hootsuite\.com/, /prioritized plan/, /technical and content gaps/]) {
    assert.match(technicalSeo.request, pattern);
  }
  assert.doesNotMatch(technicalSeo.request, /fast-triage|read-only|seo\.robots_audit/i);
  const seoKernel = artifacts['generated/architect/seo/KERNEL.md'];
  assert.match(seoKernel, /Every benchmark handoff, including a blocked or unavailable one/);
  assert.match(artifacts['generated/architect/outreach/KERNEL.md'], /do not terminate after discovery or contract inspection/i);
  assert.match(seoKernel, /exact capability id `brain\.learning\.query_benchmarks`/);
  assert.match(seoKernel, /privacy boundary: never raw cross-workspace rows/);
});

test('social research executes scoped reads without blocking on optional presentation choices', () => {
  const kernel = build()['generated/architect/social/KERNEL.md'];
  assert.match(kernel, /topic or query and time window/i);
  assert.match(kernel, /ranking and output (?:format )?choices are optional/i);
  assert.match(kernel, /transparent defaults/i);
  assert.match(kernel, /nullable metrics/i);
  assert.match(kernel, /Ask only for truly required missing inputs/i);
});

test('a standalone Claude or Codex package keeps discovery usable but denies mutation on compatibility drift', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/client-adapters/RELEASE.json']);
  const mutationOperations = new Set([
    'dreamstate_tools_run',
    'dreamstate_context_create_document',
    'dreamstate_context_create_folder',
    'dreamstate_context_save_and_publish',
    'dreamstate_context_save_draft',
    'dreamstate_proposals_create',
    'dreamstate_proposals_mutate',
  ]);
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
      'dreamstate_tools_search',
      'dreamstate_tools_get',
      'dreamstate_proposals_get',
      'dreamstate_get_run',
      'dreamstate_list_runs',
    ]) assert.equal(permits(operation), true, `${client} must retain ${operation} for recovery`);
    for (const operation of mutationOperations) {
      assert.equal(permits(operation), false, `${client} must deny ${operation} on digest drift`);
    }
  }
});

test('the pinned MCP catalog exposes only the compact governed gateway', () => {
  assert.deepEqual(catalog.mcp_tools.map((tool: { name: string }) => tool.name).sort(), [
    'dreamstate_agent_proposal_create',
    'dreamstate_agent_proposal_delegate_bindings',
    'dreamstate_agent_proposal_get',
    'dreamstate_cancel_run',
    'dreamstate_get_run',
    'dreamstate_list_runs',
    'dreamstate_resume_run',
    'dreamstate_tools_get',
    'dreamstate_tools_run',
    'dreamstate_tools_search',
    'ping',
  ]);
  assert.equal(
    catalog.mcp_tools.some((tool: { name: string }) => /register_source/.test(tool.name)),
    false,
  );
});

test('generated Architect outreach packages contain no shortcut terminology', () => {
  const artifacts = build();
  const forbidden = /\b(?:templates?|presets?|reusable|reuse)\b/i;
  for (const id of ['outreach', 'outreach-sequence-writer', 'outreach-workflow-builder']) {
    for (const file of ['SKILL.md', 'KERNEL.md', 'evals.json']) {
      const path = `generated/architect/${id}/${file}`;
      assert.doesNotMatch(artifacts[path], forbidden, path);
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

test('active Architect outreach sources are campaign-free and reject retired campaign contracts', () => {
  const artifacts = build();
  const retiredEvalLanguage = /campaigns\.|campaign_state|campaign_id|outreach_campaigns|campaignId|outreachCampaignId|\bLaunch Campaign\b|\bcampaign(?:s|[-_][a-z0-9_]+)?\b/i;
  for (const id of ['outreach', 'tables', 'outreach-workflow-builder', 'outreach-sequence-writer']) {
    assert.doesNotMatch(
      artifacts[`generated/architect/${id}/KERNEL.md`],
      retiredEvalLanguage,
      `${id}: active model-visible kernel language must use workbook, workflow, and sequence identities`,
    );
  }

  for (const id of ['outreach', 'tables', 'outreach-workflow-builder', 'outreach-sequence-writer']) {
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

  const path = join(ROOT, 'architect-kernels', 'outreach-sequence-writer', 'KERNEL.md');
  const original = readFileSync(path, 'utf8');
  for (const retiredIdentity of ['campaign_id', 'outreach_campaigns', 'campaignId', 'outreachCampaignId']) {
    try {
      writeFileSync(path, `${original}\nRetired identity: ${retiredIdentity}.\n`);
      assert.throws(
        () => buildArchitectArtifacts(catalog),
        /outreach-sequence-writer.*retired campaign.*(?:identity|terminology)/i,
      );
    } finally {
      writeFileSync(path, original);
    }
  }

  const evalPath = join(ROOT, 'architect-kernels', 'outreach', 'evals.json');
  const originalEvals = readFileSync(evalPath, 'utf8');
  const driftedEvals = JSON.parse(originalEvals);
  driftedEvals.cases[0].request = 'Bind campaign_id and propose Launch Campaign.';
  try {
    writeFileSync(evalPath, `${JSON.stringify(driftedEvals, null, 2)}\n`);
    assert.throws(
      () => buildArchitectArtifacts(catalog),
      /outreach.*retired campaign.*(?:identity|terminology|capability|state)/i,
    );
  } finally {
    writeFileSync(evalPath, originalEvals);
  }

  const manifestPath = join(ROOT, 'architect-kernels', 'skills.json');
  const originalManifest = readFileSync(manifestPath, 'utf8');
  const driftedManifest = JSON.parse(originalManifest);
  driftedManifest.skills.find((skill: { id: string }) => skill.id === 'outreach')
    .triggers.push('Launch Campaign');
  try {
    writeFileSync(manifestPath, `${JSON.stringify(driftedManifest, null, 2)}\n`);
    assert.throws(
      () => buildArchitectArtifacts(catalog),
      /outreach.*retired campaign.*(?:artifact|identity|terminology)/i,
    );
  } finally {
    writeFileSync(manifestPath, originalManifest);
  }
});

test('outreach specialists own authoring mutations while the coordinator owns only launch closure', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  const authoringOwners: Record<string, string> = {
    'workflows.create': 'outreach-workflow-builder',
    'workflows.graph_apply': 'outreach-workflow-builder',
    'sequences.bind': 'outreach-sequence-writer',
  };
  for (const [capabilityId, specialistId] of Object.entries(authoringOwners)) {
    assert.ok(pinned.skills[specialistId].capability_ids.includes(capabilityId), `${specialistId}: ${capabilityId}`);
    assert.equal(pinned.skills.outreach.capability_ids.includes(capabilityId), false, `coordinator: ${capabilityId}`);
  }
  for (const capabilityId of [
    'workflows.draft_publish',
    'workflows.activate',
    'sequences.publish',
    'sequences.enroll_selection',
  ]) {
    assert.ok(pinned.skills.outreach.capability_ids.includes(capabilityId), `coordinator launch closure: ${capabilityId}`);
  }
});

test('tables is the only specialist owner of workbook creation and canonical source preview and expansion', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  for (const capabilityId of [
    'workbooks.create',
    'table_sources.preview',
    'sources.cold_outbound_expand',
    'sources.cold_outbound_preview',
    'sources.linkedin_post_engagers_preview',
  ]) {
    const owners = ['outreach', 'tables', 'outreach-workflow-builder', 'outreach-sequence-writer']
      .filter((skillId) => pinned.skills[skillId].capability_ids.includes(capabilityId));
    assert.deepEqual(owners, ['tables'], `${capabilityId}: exactly one specialist owner`);
  }
  const workflowKernel = artifacts['generated/architect/outreach-workflow-builder/KERNEL.md'];
  const workflowEvals = artifacts['generated/architect/outreach-workflow-builder/evals.json'];
  assert.doesNotMatch(workflowKernel, /sources\.cold_outbound_expand|`tools_run`/);
  assert.doesNotMatch(workflowEvals, /sources\.cold_outbound_expand/);
  assert.match(workflowKernel, /typed reviewed `tables` handoff/i);
});

test('outreach is wiki-first and Workbook-first before demand, workflow, or sequence planning', () => {
  const artifacts = build();
  const kernel = artifacts['generated/architect/outreach/KERNEL.md'];
  const evals = JSON.parse(artifacts['generated/architect/outreach/evals.json']);
  const scratch = evals.cases.find((item: { id: string }) => item.id === 'new-workflow-from-scratch');
  assert.ok(scratch);
  assert.deepEqual(scratch.must_use_popup_when_missing, ['qualification']);
  assert.ok(scratch.forbidden_question_concepts.includes('sender'));
  assert.ok(scratch.forbidden_question_concepts.includes('channel'));
  assert.match(
    kernel,
    /exactly `outcome`, `audience_icp`, `job_titles`, `company_keywords`, `company_size`, `geography`, `exclusions`, and `qualification`/,
  );
  assert.match(kernel, /derive these from published workspace-wiki claims first.*still-missing concepts/is);
  assert.match(kernel, /sender.*channel.*launch/is);
  assert.match(kernel, /`messaging_branch_state`.*inspection-only/is);

  const full = evals.cases.find((item: { id: string }) => item.id === 'competitor-engagers-canonical-full-journey');
  assert.ok(full);
  const sequence = full.required_tool_sequence as Array<{
    tool: string;
    skill_id?: string;
    capability_id?: string;
    artifact_type?: string;
    phase?: string;
  }>;
  const workbookReceipt = sequence.findIndex((step) => (
    step.tool === 'tools_run'
    && step.capability_id === 'workbooks.create'
    && step.phase === 'zero_credit_reversible_action_decision_auto_execute'
  ));
  assert.ok(workbookReceipt > 0);
  assert.equal(sequence.some((step) => (
    step.tool === 'request_approval' && step.artifact_type === 'outreach_workbook'
  )), false);
  const premature = sequence.slice(0, workbookReceipt + 1).filter((step) => (
    step.capability_id === 'outreach.demand_plan_get'
    || step.skill_id === 'outreach-workflow-builder'
    || step.skill_id === 'outreach-sequence-writer'
    || step.capability_id?.startsWith('workflows.')
    || step.capability_id?.startsWith('sequences.')
  ));
  assert.deepEqual(premature, []);
  assert.ok(
    sequence.findIndex((step) => step.capability_id === 'outreach.demand_plan_get') > workbookReceipt,
    'demand planning must constrain expansion and launch, not delay the initial Workbook',
  );
});

test('outreach launch closure and pilot invariants use the canonical workflow and sequence surface', () => {
  const artifacts = build();
  const kernel = artifacts['generated/architect/outreach/KERNEL.md'];
  const evals = JSON.parse(artifacts['generated/architect/outreach/evals.json']);
  assert.match(kernel, /`row_limit: 10`/);
  assert.match(kernel, /exactly ten distinct stable identities/i);
  assert.match(kernel, /no padding/i);
  assert.match(kernel, /no.*import/i);
  assert.match(kernel, /no.*enrollment/i);

  const launch = evals.cases.find((item: { id: string }) => item.id === 'explicit-final-launch-revalidation');
  assert.ok(launch);
  for (const capabilityId of [
    'workflows.draft_publish',
    'workflows.activate',
    'sequences.enroll_selection',
  ]) {
    assert.ok(launch.required_capability_ids.includes(capabilityId), `${capabilityId}: launch closure`);
  }
  assert.equal(
    launch.required_capability_ids.includes('sequences.publish'),
    launch.sequence_publish_required === true,
    'sequence publishing is granted only when the reviewed sequence still requires publication',
  );
  assert.equal(
    launch.mutating_capability_budget,
    launch.required_capability_ids.filter((id: string) => (
      catalog.capabilities.find((capability: { id: string }) => capability.id === id)?.mutates === true
    )).length,
  );

  const coordinatorGrant = JSON.parse(
    artifacts['generated/architect/PINNED_RELEASE.json'],
  ).skills.outreach.capability_ids;
  for (const specialistCapability of ['workflows.create', 'workflows.graph_apply', 'sequences.bind']) {
    assert.equal(coordinatorGrant.includes(specialistCapability), false, `${specialistCapability}: specialist-owned`);
  }
});

test('growth asset planning may describe a buyer template library but stays explicitly unsaved without a capability', () => {
  const artifacts = build();
  assert.match(
    artifacts['generated/architect/growth-asset-planner/KERNEL.md'],
    /buyer-facing template library/i,
  );
  const evals = JSON.parse(artifacts['generated/architect/growth-asset-planner/evals.json']);
  assert.equal(evals.cases[0].must_state_unsaved_without_capability, true);
  assert.match(artifacts['generated/architect/growth-asset-planner/KERNEL.md'], /explicitly unsaved proposal/i);
});

test('outreach kernels keep evidence pilot, build, sample, bulk expansion, and launch as ordered typed stages', () => {
  const artifacts = build();
  const coordinator = artifacts['generated/architect/outreach/KERNEL.md'];
  const tables = artifacts['generated/architect/tables/KERNEL.md'];
  const workflow = artifacts['generated/architect/outreach-workflow-builder/KERNEL.md'];

  for (const changeKind of [
    'outreach_source',
    'outreach_workbook',
    'outreach_bundle',
    'table_column_run',
    'outreach_bulk_expansion',
    'outreach_activation',
  ]) {
    assert.match(coordinator, new RegExp(`\\b${changeKind}\\b`));
  }
  assert.match(coordinator, /Approval of one stage never authorizes a later stage/);
  assert.match(coordinator, /launch closure/i);
  const orderedKinds = [
    'outreach_source',
    'outreach_workbook',
    'outreach_bundle',
    'table_column_run',
    'outreach_bulk_expansion',
    'outreach_activation',
  ];
  let prior = -1;
  for (const kind of orderedKinds) {
    const offset = coordinator.indexOf(`\`${kind}\``, prior + 1);
    assert.ok(offset > prior, `${kind} must follow the prior staged gate`);
    prior = offset;
  }
  assert.match(tables, /source evidence pilot/i);
  assert.match(coordinator, /outreach\.demand_plan_get/);
  assert.match(coordinator, /literal `row_limit: 10`/i);
  assert.match(coordinator, /default.*demand_based/i);
  assert.doesNotMatch(coordinator, /three distinct questions whose ids or prompts literally include/i);
  assert.match(coordinator, /no durable destination/i);
  assert.match(tables, /sources\.cold_outbound_expand/);
  assert.match(coordinator, /stage_exact_result_set=true/);
  assert.match(tables, /smallest representative selection/i);
  assert.match(coordinator, /never reshapes the Workbook, runs columns/i);
  assert.match(workflow, /typed reviewed `tables` handoff/);
  assert.match(workflow, /exact workbook\/worksheet\/view revisions/);
  assert.match(workflow, /workflow proposal cannot run columns or enroll contacts/i);
  assert.match(coordinator, /single reviewed launch closure/i);
  assert.match(coordinator, /workflows\.draft_publish/);
});

test('outreach release uses exact capability evidence and signed lifecycle states', () => {
  const artifacts = build();
  const outreach = JSON.parse(artifacts['generated/architect/outreach/evals.json']);
  const workflow = JSON.parse(artifacts['generated/architect/outreach-workflow-builder/evals.json']);
  const staged = outreach.cases.find((item: { id: string }) => item.id === 'staged-pilot-build-sample-expand-launch');
  const launch = outreach.cases.find((item: { id: string }) => item.id === 'explicit-final-launch-revalidation');
  const conditional = outreach.cases.find((item: { id: string }) => item.id === 'sequence-only-when-messaging');
  const exactSet = workflow.cases.find((item: { id: string }) => item.id === 'typed-reviewed-tables-handoff');

  assert.deepEqual(staged.required_capability_ids, ['brain.context.search']);
  assert.deepEqual(staged.required_executed_capability_ids, ['brain.context.search']);
  assert.deepEqual(staged.required_completion_fields, [
    { id: 'stage_boundary_state', allowed_values: ['ordered_separate'] },
    { id: 'activation_state', allowed_values: ['inactive'] },
    { id: 'external_send_state', allowed_values: ['not_authorized'] },
    { id: 'approval_state', allowed_values: ['not_applicable'] },
    { id: 'run_state', allowed_values: ['terminal'] },
  ]);
  assert.match(staged.request, /small pilot/i);
  assert.match(staged.request, /US B2B SaaS founders/i);
  assert.match(staged.request, /scoring at least 80/i);
  assert.match(staged.request, /review before launch/i);
  assert.doesNotMatch(staged.request, /zero-credit|Workbook receipt|asking approval/i);
  assert.ok(launch.required_completion_fields.some((field: { id: string; allowed_values: string[] }) => (
    field.id === 'external_send_state' && field.allowed_values.includes('not_authorized')
  )));
  assert.ok(launch.required_completion_fields.some((field: { id: string; allowed_values: string[] }) => (
    field.id === 'selection_state' && field.allowed_values.includes('missing')
  )));
  assert.ok(launch.required_completion_fields.some((field: { id: string; allowed_values: string[] }) => (
    field.id === 'run_state' && field.allowed_values.includes('blocked')
  )));
  assert.equal(conditional.must_use_popup_when_missing, undefined);
  assert.deepEqual(conditional.forbidden_question_concepts, ['messaging_branch_state']);
  assert.deepEqual(exactSet.required_capability_ids, ['workflows.get', 'workflows.validate_graph']);
  assert.equal(exactSet.fixture_profile, 'outreach_exact_result_set_expansion');
  assert.ok(exactSet.required_completion_fields.some((field: { id: string; allowed_values: string[] }) => (
    field.id === 'selection_state' && field.allowed_values.includes('exact')
  )));
  assert.match(
    artifacts['generated/architect/outreach/KERNEL.md'],
    /`messaging_branch_state` is inspection-only/,
  );
  assert.match(
    artifacts['generated/architect/outreach/KERNEL.md'],
    /opening intake concept set is exactly.*`qualification`/s,
  );
  assert.match(
    artifacts['generated/architect/outreach/KERNEL.md'],
    /Volume is application-calculated.*default structured intent to `\{mode:"demand_based"\}`/s,
  );
  const scratch = outreach.cases.find((item: { id: string }) => item.id === 'new-workflow-from-scratch');
  assert.deepEqual(scratch.must_use_popup_when_missing, ['qualification']);
  assert.equal(scratch.max_intake_checkpoints, 1);
  assert.deepEqual(scratch.forbidden_question_concepts, ['outreach_volume', 'sender', 'channel']);
  assert.equal(conditional.max_intake_checkpoints, undefined);
  assert.equal(scratch.required_capability_ids.includes('outreach.demand_plan_get'), false);
  const outreachSkill = architectSource.skills.find((skill: { id: string }) => skill.id === 'outreach');
  const integrationsSkill = architectSource.skills.find((skill: { id: string }) => skill.id === 'integrations');
  assert.ok(outreachSkill.triggers.includes('design outreach for a named cohort using pooled benchmarks'));
  assert.match(integrationsSkill.description, /Provider content research, metrics, and search-window coverage remain with their domain skills/);
});

test('competitor engager release eval is production-real and preserves dependency, evidence, and failure contracts', () => {
  const artifacts = build();
  const outreach = JSON.parse(artifacts['generated/architect/outreach/evals.json']);
  const full = outreach.cases.find((item: { id: string }) => item.id === 'competitor-engagers-canonical-full-journey');
  const failures = new Map(outreach.cases
    .filter((item: { id: string }) => item.id.startsWith('competitor-engagers-'))
    .map((item: { id: string }) => [item.id, item]));
  assert.equal(full.execution_profile, 'production_real');
  assert.deepEqual(full.expected_load_order, [
    'outreach', 'tables', 'outreach-workflow-builder', 'outreach-sequence-writer',
  ]);
  assert.deepEqual(full.expected_skill_ids, ['outreach']);
  assert.ok(full.forbidden_test_substitutions.includes('mock run receipt'));
  assert.equal(full.max_intake_checkpoints, 1);
  assert.deepEqual(full.forbidden_question_concepts, [
    'outreach_volume', 'sender', 'channel', 'messaging_branch_state',
  ]);
  assert.deepEqual(full.required_terminal_receipts, [
    'source_pilot',
    'bundle_graph_apply',
    'column_sample',
    'bulk_expansion',
    'launch_revalidation',
  ]);
  assert.deepEqual(
    full.required_tool_sequence.slice(0, 4),
    [
      { tool: 'load_skill', skill_id: 'outreach' },
      { tool: 'tools_search', capability_id: 'brain.context.search' },
      { tool: 'tools_get', capability_id: 'brain.context.search' },
      { tool: 'tools_run', capability_id: 'brain.context.search', phase: 'company_brain_search' },
    ],
  );
  const sequence = full.required_tool_sequence as Array<{
    tool: string;
    skill_id?: string;
    capability_id?: string;
    artifact_type?: string;
    phase?: string;
  }>;
  const sequenceIndex = (predicate: (step: typeof sequence[number]) => boolean) => sequence.findIndex(predicate);
  const intakeIndex = sequenceIndex((step) => step.tool === 'ask_user' && step.phase === 'one_complete_intake');
  const pilotRunIndex = sequenceIndex((step) => (
    step.tool === 'tools_run'
    && step.capability_id === 'table_sources.preview'
    && step.phase === 'exact_10_row_source_evidence_variants'
  ));
  const workflowDraftIndex = sequenceIndex((step) => (
    step.tool === 'tools_run'
    && step.capability_id === 'workflows.graph_apply'
    && step.phase === 'zero_credit_reversible_workflow_draft_apply'
  ));
  const workbookReceiptIndex = sequenceIndex((step) => (
    step.tool === 'tools_run'
    && step.capability_id === 'workbooks.create'
    && step.phase === 'zero_credit_reversible_action_decision_auto_execute'
  ));
  const demandIndex = sequenceIndex((step) => (
    step.tool === 'tools_run'
    && step.capability_id === 'outreach.demand_plan_get'
    && step.phase === 'post_workbook_expansion_constraints'
  ));
  const sampleIndex = sequenceIndex((step) => (
    step.tool === 'propose_artifact' && step.artifact_type === 'table_column_run'
  ));
  const expansionIndex = sequenceIndex((step) => (
    step.tool === 'propose_artifact' && step.artifact_type === 'outreach_bulk_expansion'
  ));
  const expansionDemandIndex = sequenceIndex((step) => (
    step.tool === 'tools_run'
    && step.capability_id === 'outreach.demand_plan_get'
    && step.phase === 'post_sample_expansion_revalidation'
  ));
  const revalidationIndex = sequenceIndex((step) => (
    step.tool === 'tools_run'
    && step.capability_id === 'outreach.demand_plan_get'
    && step.phase === 'launch_revalidation'
  ));
  const activationIndex = sequenceIndex((step) => (
    step.tool === 'propose_artifact'
    && step.artifact_type === 'outreach_activation'
    && step.phase === 'single_launch_approval_qualified_only_activation_enrollment_paced_send'
  ));
  const terminalIndex = sequenceIndex((step) => (
    step.tool === 'request_approval'
    && step.artifact_type === 'outreach_activation'
    && step.phase === 'single_launch_authorization'
  ));
  assert.ok(intakeIndex > 0);
  assert.ok(pilotRunIndex > intakeIndex);
  assert.ok(workbookReceiptIndex > pilotRunIndex);
  assert.equal(sequence.some((step) => (
    step.tool === 'request_approval' && step.artifact_type === 'outreach_workbook'
  )), false);
  assert.ok(demandIndex > workbookReceiptIndex);
  assert.ok(workflowDraftIndex > demandIndex);
  assert.ok(sampleIndex > workflowDraftIndex);
  assert.ok(expansionDemandIndex > sampleIndex);
  assert.ok(expansionIndex > expansionDemandIndex);
  assert.ok(revalidationIndex > expansionIndex);
  assert.ok(activationIndex > revalidationIndex);
  assert.ok(terminalIndex > activationIndex);
  assert.match(full.request, /people in our ICP/i);
  assert.match(full.request, /engage with competitors/i);
  assert.match(full.request, /start reaching out/i);
  assert.doesNotMatch(full.request, /table_sources\.preview|exactly ten real rows|asking approval/i);
  assert.ok(failures.has('competitor-engagers-missing-enrichment-blocks-ai'));
  assert.ok(failures.has('competitor-engagers-required-failures-disqualify'));
  assert.ok(failures.has('competitor-engagers-capacity-change-blocks-launch'));
  assert.ok(failures.has('competitor-engagers-stale-and-low-precision-audit'));
  const missing = failures.get('competitor-engagers-missing-enrichment-blocks-ai');
  assert.ok(missing.required_concepts.includes('AI provider call count 0'));
  assert.deepEqual(missing.required_terminal_receipts, ['column_sample_skipped_cell']);
  assert.equal(missing.required_tool_sequence.at(-2).phase, 'missing_enrichment_sample_authorization');
  const deterministicFailures = failures.get('competitor-engagers-required-failures-disqualify');
  assert.ok(deterministicFailures.required_concepts.includes('durable filter and cell receipts'));
  assert.ok(deterministicFailures.required_concepts.includes('AI provider call count 0'));
  assert.deepEqual(deterministicFailures.required_terminal_receipts, [
    'required_filter_results', 'column_sample_disqualified_cells',
  ]);
  const capacity = failures.get('competitor-engagers-capacity-change-blocks-launch');
  assert.ok(capacity.required_concepts.includes('no outreach_activation proposal'));
  assert.deepEqual(capacity.required_terminal_receipts, ['launch_revalidation']);
  assert.equal(capacity.required_tool_sequence.at(-1).phase, 'blocked_before_activation');
  const lowPrecision = failures.get('competitor-engagers-stale-and-low-precision-audit');
  assert.ok(lowPrecision.required_concepts.includes('no outreach_bulk_expansion proposal'));
  assert.deepEqual(lowPrecision.required_terminal_receipts, [
    'source_pilot', 'profile_verification', 'qualification_audit',
  ]);
  assert.equal(lowPrecision.required_tool_sequence.at(-1).phase, 'audit_stops_before_expansion');
  const kernel = artifacts['generated/architect/outreach/KERNEL.md'];
  assert.match(kernel, /exactly ten distinct stable identities/);
  assert.match(kernel, /partial result stays partial/);
  assert.match(kernel, /raw provider receipt/);
  // The coordinator delegates qualification and messaging rules; asserting them at their
  // owning kernels is what keeps a rule from being silently duplicated or dropped.
  const tablesKernel = artifacts['generated/architect/tables/KERNEL.md'];
  assert.match(tablesKernel, /null enrichment result is `unsure`/);
  assert.match(tablesKernel, /never uses row position, row index, row number, or table order/);
  assert.match(
    artifacts['generated/architect/outreach-sequence-writer/KERNEL.md'],
    /fixed greeting, pitch paragraphs, CTA, sign-off/,
  );
  assert.match(kernel, /wait for terminal workflow, enrollment, and provider receipts/);
});

test('table evals require exact contracts and authoritative schema or paid-run receipts', () => {
  const artifacts = build();
  const tables = JSON.parse(artifacts['generated/architect/tables/evals.json']);
  const buildTable = tables.cases.find((item: { id: string }) => item.id === 'build-reactive-table');
  const runExecutable = tables.cases.find(
    (item: { id: string }) => item.id === 'save-and-run-reviewed-table-executable',
  );
  const paidSample = tables.cases.find((item: { id: string }) => item.id === 'bounded-paid-run');

  assert.equal(buildTable.fixture_profile, 'tables_reactive_proposal');
  assert.deepEqual(buildTable.required_capability_ids, ['tables.create']);
  assert.deepEqual(runExecutable.required_capability_ids, [
    'executables.save',
    'executables.run',
  ]);
  assert.deepEqual(buildTable.required_completion_fields, [
    { id: 'schema_state', allowed_values: ['identity_source_dependencies_ready'] },
    { id: 'artifact_state', allowed_values: ['proposal_saved', 'existing'] },
    { id: 'durability_state', allowed_values: ['proposal_only', 'durable'] },
  ]);
  assert.equal(paidSample.fixture_profile, 'tables_bounded_paid_sample');
  assert.deepEqual(paidSample.required_capability_ids, [
    'table_runs.preview_cost',
    'selection_snapshots.create',
    'columns.run',
    'table_runs.get',
  ]);
  assert.deepEqual(paidSample.required_completion_fields, [
    { id: 'execution_bounds_state', allowed_values: ['representative_capped_credits'] },
    { id: 'cell_state', allowed_values: ['settled', 'partial', 'failed'] },
    { id: 'approval_state', allowed_values: ['required', 'approved'] },
    { id: 'run_state', allowed_values: ['terminal'] },
  ]);
  assert.match(
    artifacts['generated/architect/tables/KERNEL.md'],
    /only the canonical run receipt establish the approved selection, row cap, credit ceiling, terminal state, actual spend, and settled-cell outcomes/i,
  );
  assert.match(
    buildTable.request,
    /reviewable table proposal/i,
  );
  assert.match(buildTable.request, /AI companies/i);
  assert.match(buildTable.request, /keyed by company domain/i);
  assert.match(buildTable.request, /company search, profile enrichment, a formula-based score, and a review view/i);
  assert.match(buildTable.request, /review it before anything runs/i);
  assert.doesNotMatch(buildTable.request, /preparation receipt|tables\.create/i);
});

test('workspace-local production evals require exact approval and durable present outcomes', () => {
  const artifacts = build();
  const productionSkillIds = [
    'tables',
    'records',
    'records-schema',
    'records-pipelines',
    'records-transfer',
    'records-views',
    'buyer-research-graph',
    'experiments',
  ];
  const production = productionSkillIds.flatMap((skillId) => (
    JSON.parse(artifacts[`generated/architect/${skillId}/evals.json`]).cases
  ))
    .filter((item: { id: string }) => item.id.startsWith('production-local-'));

  assert.equal(production.length, 13);
  assert.equal(production.filter((item: { skill_id?: string }) => item.skill_id === undefined).length, 13);
  for (const item of production) {
    assert.equal(item.execution_profile, 'production_real');
    assert.equal(item.fixture_profile, 'workspace_local_approved_mutation');
    assert.equal(item.resume_after_approval, 'owner_exact');
    assert.deepEqual(item.allowed_consequence_levels, ['draft_write']);
    assert.ok(item.approved_mutation_capability_ids.length > 0);
    assert.ok(item.approved_mutation_capability_ids.every(
      (capabilityId: string) => item.required_capability_ids.includes(capabilityId),
    ));
    const workbookColumns = item.expected_workspace_outcome.find(
      (outcome: { check?: string }) => outcome.check === 'workbook_columns',
    );
    if (workbookColumns) {
      assert.equal(
        item.approved_mutation_max_changes,
        1 + workbookColumns.expected_columns.length,
      );
    } else {
      assert.ok(
        item.approved_mutation_max_changes >= item.approved_mutation_capability_ids.length,
      );
      assert.ok(item.approved_mutation_max_changes <= 8);
    }
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
  const victim = 'tables';
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

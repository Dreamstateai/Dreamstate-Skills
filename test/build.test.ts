import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { build, writeArtifacts, checkArtifacts } from '../scripts/build.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(join(ROOT, 'contracts', 'capability-manifest.json'), 'utf8'));
const architectSource = JSON.parse(readFileSync(join(ROOT, 'architect-kernels', 'skills.json'), 'utf8'));

// build() IS the contract test: it parses every playbook, validates the
// frontmatter, and asserts every tools_used entry exists in the catalog. If it
// returns without throwing, the contract held.
test('build succeeds: all playbooks valid and every tool exists in the catalog', () => {
  const artifacts = build();
  assert.ok(Object.keys(artifacts).length > 0, 'expected generated artifacts');
});

test('--check passes immediately after a build (generated tree is deterministic)', () => {
  writeArtifacts(build());
  const drifted = checkArtifacts(build());
  assert.deepEqual(drifted, [], 'a fresh build must match what was just written');
});

test('every indexed skill references only catalog tools, with correct derived scopes', () => {
  writeArtifacts(build());
  const index = JSON.parse(readFileSync(join(ROOT, 'skills-index.json'), 'utf8'));
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
  assert.match(pinned.source_release, /^\d+\.\d+\.\d+/);
  assert.doesNotMatch(pinned.source_release, /bootstrap|development/i);
  assert.match(pinned.source_release_hash, /^[a-f0-9]{64}$/);
  assert.equal(pinned.compatibility.playbook_kernel_hash, pinned.source_release_hash);
  assert.equal(pinned.compatibility.capability_hash, catalog.capability_hash);
  assert.equal(pinned.compatibility.capability_definition_version, catalog.definition_version);
  assert.equal(pinned.compatibility.minimum_api_version, catalog.api_version);
  assert.doesNotMatch(JSON.stringify(pinned.compatibility), /development/i);
  assert.equal(clients.source_release_hash, pinned.source_release_hash);
  assert.deepEqual(clients.compatibility, pinned.compatibility);

  const ids = Object.keys(pinned.skills).sort();
  assert.equal(ids.length, 16);
  for (const id of ids) {
    const architectRoot = `generated/architect/${id}`;
    const exactArchitectFiles = Object.keys(artifacts)
      .filter((path) => path.startsWith(`${architectRoot}/`))
      .map((path) => path.slice(architectRoot.length + 1))
      .sort();
    assert.deepEqual(exactArchitectFiles, ['KERNEL.md', 'SKILL.md', 'evals.json']);
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
      assert.match(standalone, /recovery_operations: \[dreamstate_tools_search, dreamstate_tools_get\]/);
      assert.match(standalone, /Refuse `dreamstate_tools_run` until the installed package is refreshed/);
    }
    assert.equal(pinned.skills[id].kernel_sha256, clients.skills[id].kernel_sha256);
    assert.equal(pinned.skills[id].evals_sha256, clients.skills[id].evals_sha256);
    assert.match(
      artifacts[`${architectRoot}/SKILL.md`],
      /bounded structured partial outputs plus the exact next transition/,
    );
  }
});

test('signed capability domains stay identical across source, Architect, Claude, Codex, and release manifests', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  const clients = JSON.parse(artifacts['generated/client-adapters/RELEASE.json']);
  const expected: Record<string, string[]> = {
    analytics: [],
    blog: ['content'],
    context: ['brain', 'context'],
    'growth-asset-planner': [],
    integrations: [],
    outreach: ['brain', 'outreach'],
    'outreach-list-builder': ['outreach'],
    'outreach-sequence-writer': ['outreach'],
    'outreach-workflow-builder': ['outreach'],
    'reddit-engagement': ['content'],
    seo: ['brain', 'content', 'tables', 'visibility'],
    social: ['brain', 'content'],
    strategy: ['brain', 'context'],
    tables: ['tables'],
    visibility: ['visibility'],
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
});

test('audience planning kernels require privacy-safe pooled benchmark evidence', () => {
  const artifacts = build();
  for (const id of ['outreach', 'strategy', 'social', 'seo']) {
    const kernel = artifacts[`generated/architect/${id}/KERNEL.md`];
    assert.match(kernel, /brain\.learning\.query_benchmarks/);
    assert.match(kernel, /named audience|named cohort/i);
    assert.match(kernel, /insufficient_evidence/);
    assert.match(kernel, /sample/i);
    assert.match(kernel, /confidence/i);
    assert.match(kernel, /raw (?:cross-workspace )?rows/i);
  }

  const outreach = JSON.parse(artifacts['generated/architect/outreach/evals.json']);
  const restaurantOwners = outreach.cases.find((item: { id: string }) => (
    item.id === 'zero-history-restaurant-owners-pooled-benchmark'
  ));
  assert.ok(restaurantOwners);
  assert.ok(restaurantOwners.required_concepts.includes('brain.learning.query_benchmarks'));
  assert.ok(restaurantOwners.required_concepts.includes('sample band'));
  assert.ok(restaurantOwners.required_concepts.includes('confidence'));
  assert.ok(restaurantOwners.required_concepts.includes('insufficient_evidence'));
  assert.ok(restaurantOwners.required_concepts.includes('never raw cross-workspace rows'));

  const social = JSON.parse(artifacts['generated/architect/social/evals.json']);
  assert.ok(social.cases.some((item: { id: string }) => item.id === 'founder-posts-pooled-benchmark'));

  const seo = JSON.parse(artifacts['generated/architect/seo/evals.json']);
  assert.ok(seo.cases.some((item: { id: string }) => item.id === 'agency-keywords-pooled-benchmark'));
});

test('a standalone Claude or Codex package keeps discovery usable but denies mutation on compatibility drift', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/client-adapters/RELEASE.json']);
  const standalone = artifacts['generated/client-adapters/codex/outreach/SKILL.md'];
  const scalar = (field: string) => standalone.match(new RegExp(`^  ${field}: (.+)$`, 'm'))?.[1];
  const installed = {
    capability_definition_version: scalar('capability_definition_version'),
    capability_hash: scalar('capability_hash'),
    minimum_api_version: scalar('minimum_api_version'),
  };
  assert.deepEqual(installed, {
    capability_definition_version: pinned.compatibility.capability_definition_version,
    capability_hash: pinned.compatibility.capability_hash,
    minimum_api_version: pinned.compatibility.minimum_api_version,
  });
  const live = { ...installed, capability_hash: 'f'.repeat(16) };
  const compatible = Object.entries(installed).every(([key, value]) => live[key as keyof typeof live] === value);
  const permits = (operation: 'dreamstate_tools_search' | 'dreamstate_tools_get' | 'dreamstate_tools_run') => (
    operation !== 'dreamstate_tools_run' || compatible
  );
  assert.equal(permits('dreamstate_tools_search'), true);
  assert.equal(permits('dreamstate_tools_get'), true);
  assert.equal(permits('dreamstate_tools_run'), false);
});

test('generated Architect outreach packages contain no shortcut terminology', () => {
  const artifacts = build();
  const forbidden = /\b(?:templates?|presets?|reusable|reuse)\b/i;
  for (const id of ['outreach', 'outreach-list-builder', 'outreach-sequence-writer', 'outreach-workflow-builder']) {
    for (const file of ['SKILL.md', 'KERNEL.md', 'evals.json']) {
      const path = `generated/architect/${id}/${file}`;
      assert.doesNotMatch(artifacts[path], forbidden, path);
    }
  }
  assert.match(
    artifacts['generated/architect/outreach-list-builder/KERNEL.md'],
    /Preserve compatible identity and evidence fields/,
  );
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
  const listBuilder = artifacts['generated/architect/outreach-list-builder/KERNEL.md'];
  const workflow = artifacts['generated/architect/outreach-workflow-builder/KERNEL.md'];

  for (const changeKind of [
    'outreach_source',
    'outreach_bundle',
    'table_column_run',
    'outreach_bulk_expansion',
    'outreach_activation',
  ]) {
    assert.match(coordinator, new RegExp(`\\b${changeKind}\\b`));
  }
  assert.match(coordinator, /Approval of one stage never authorizes a later stage/);
  assert.match(coordinator, /Launch Campaign/);
  const orderedKinds = [
    'outreach_source',
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
  assert.match(coordinator, /intent:outreach\.cold_outbound_preview/);
  assert.match(coordinator, /no list, campaign, source, import, enrollment, or other durable destination/i);
  assert.match(coordinator, /intent:outreach\.cold_outbound_expand/);
  assert.match(coordinator, /stage_exact_result_set=true/);
  assert.match(coordinator, /require_campaign_status=draft/);
  assert.match(listBuilder, /exactly five through ten rows/);
  assert.match(listBuilder, /Adding a column never implies that it ran/);
  assert.match(listBuilder, /eleven-through-fifty row cap for this release/);
  assert.match(listBuilder, /It is never another five-to-ten-row import/);
  assert.match(workflow, /source-evidence run/);
  assert.match(workflow, /exact list revision/);
  assert.match(workflow, /workflow proposal cannot run columns or enroll contacts/i);
  assert.match(coordinator, /single activation-and-send authorization/i);
  assert.match(coordinator, /Do not invent a second send approval gate/i);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { build, writeArtifacts, checkArtifacts } from '../scripts/build.js';
import { buildArchitectArtifacts } from '../scripts/architect-build.js';
import { canonicalCapabilityManifestDigest } from '../scripts/sync-capability-manifest.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(join(ROOT, 'contracts', 'capability-manifest.json'), 'utf8'));
const architectSource = JSON.parse(readFileSync(join(ROOT, 'architect-kernels', 'skills.json'), 'utf8'));
const CANONICAL_MANIFEST_DIGEST = 'ab47e1dafaa5b0db4a00788025060197b9ddd29bc42bf376ea0313842c31e933';

// build() IS the contract test: it parses every playbook, validates the
// frontmatter, and asserts every declared tool and capability exists in the
// pinned canonical manifest. If it
// returns without throwing, the contract held.
test('build succeeds: all playbooks valid and every tool exists in the catalog', () => {
  const artifacts = build();
  assert.ok(Object.keys(artifacts).length > 0, 'expected generated artifacts');
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

  const ids = Object.keys(pinned.skills).sort();
  assert.equal(ids.length, 16);
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
    const expectedDirectRunIds = id === 'context' ? ['brand.context_url_analyze'] : [];
    assert.ok(
      architect.split('\n').includes(
        `direct_run_capability_ids: ${JSON.stringify(expectedDirectRunIds)}`,
      ),
      `${id}: direct-run allowlist must be exact`,
    );
    assert.match(
      architect,
      new RegExp(`complete allowlist for direct mutating or paid runs is exactly ${JSON.stringify(expectedDirectRunIds).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
    );
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
      assert.ok(
        standalone.split('\n').includes(
          `direct_run_capability_ids: ${JSON.stringify(expectedDirectRunIds)}`,
        ),
        `${client}/${id}: direct-run allowlist must be exact`,
      );
      assert.match(
        standalone,
        /recovery_operations: \[dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs\]/,
      );
      assert.match(
        standalone,
        /denied_operations: \[dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate\]/,
      );
      assert.match(standalone, /Refuse `dreamstate_tools_run` until the installed package is refreshed/);
      assert.match(standalone, /full 64-character SHA-256 manifest digest/i);
      assert.match(standalone, /`dreamstate_tools_search` and `dreamstate_tools_get`/);
      assert.match(standalone, /`dreamstate_proposals_create`/);
      assert.match(standalone, /human review/);
      assert.match(standalone, /`dreamstate_proposals_mutate`/);
      assert.match(standalone, /expected revision and state version/i);
      assert.match(standalone, /revise, approve, or reject/i);
      assert.match(
        standalone,
        /For any requested mutation or paid effect not named in that exact allowlist/,
      );
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

test('direct mutating or paid runs require an exact kernel-owned allowlist', () => {
  const artifacts = build();
  const context = artifacts['generated/architect/context/SKILL.md'];
  const outreach = artifacts['generated/architect/outreach/SKILL.md'];
  assert.match(context, /^direct_run_capability_ids: \["brand\.context_url_analyze"\]$/m);
  assert.match(context, /complete allowlist for direct mutating or paid runs is exactly \["brand\.context_url_analyze"\]/);
  assert.match(outreach, /^direct_run_capability_ids: \[\]$/m);
  assert.match(outreach, /complete allowlist for direct mutating or paid runs is exactly \[\]/);
  assert.doesNotMatch(outreach, /brand\.context_url_analyze/);
});

test('Context resolver metadata covers governed updates to fixed Company documents', () => {
  const context = architectSource.skills.find((skill: { id: string }) => skill.id === 'context');
  assert.ok(context);
  assert.ok(context.triggers.some((trigger: string) => (
    /update/i.test(trigger) && /Company Brain/i.test(trigger) && /Ideal Customer/i.test(trigger)
  )));
  const artifacts = build();
  assert.match(
    artifacts['generated/architect/context/SKILL.md'],
    /update a governed Company Brain document such as Ideal Customer/,
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
    !pinned.skills.context.capability_ids.includes('brain.context.publish'),
    'a canonical id mentioned only in negative kernel prose must never become authority',
  );
});

test('every kernel compliance contract exactly covers its eval-declared operation authority', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  assert.equal(Object.keys(pinned.skills).length, 16);

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
    blog: ['content'],
    context: ['brain', 'context'],
    'growth-asset-planner': [],
    integrations: [],
    outreach: ['brain', 'outreach'],
    'outreach-sequence-writer': ['outreach'],
    'outreach-workflow-builder': ['outreach'],
    records: ['records'],
    seo: ['brain', 'content', 'tables', 'visibility'],
    'site-onboarding': ['brain', 'content', 'visibility'],
    social: ['brain', 'content'],
    strategy: ['brain', 'context'],
    tables: ['records', 'tables'],
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
  assert.match(restaurantOwners.request, /State the privacy boundary verbatim: never raw cross-workspace rows/);

  const social = JSON.parse(artifacts['generated/architect/social/evals.json']);
  assert.ok(social.cases.some((item: { id: string }) => item.id === 'founder-posts-pooled-benchmark'));
  const seo = JSON.parse(artifacts['generated/architect/seo/evals.json']);
  assert.ok(seo.cases.some((item: { id: string }) => item.id === 'agency-keywords-pooled-benchmark'));
  const technicalSeo = seo.cases.find((item: { id: string }) => item.id === 'technical-and-content-plan');
  assert.ok(technicalSeo);
  for (const pattern of [/owninfluence\.com/, /demo bookings/, /fast-triage/, /buffer\.com/, /hootsuite\.com/, /read-only/]) {
    assert.match(technicalSeo.request, pattern);
  }
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
    'dreamstate_proposals_create',
    'dreamstate_proposals_mutate',
  ]);
  for (const client of ['claude', 'codex']) {
    const standalone = artifacts[`generated/client-adapters/${client}/outreach/SKILL.md`];
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

test('the pinned MCP catalog exposes only the compact canonical gateway', () => {
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

test('outreach specialists own every mutating authoring capability while the coordinator does not', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  const mutating = new Set(catalog.capabilities
    .filter((capability: { mutates: boolean }) => capability.mutates)
    .map((capability: { id: string }) => capability.id));
  for (const specialistId of ['outreach-workflow-builder', 'outreach-sequence-writer']) {
    const evals = JSON.parse(artifacts[`generated/architect/${specialistId}/evals.json`]);
    const requiredMutations = [...new Set(evals.cases.flatMap(
      (item: { required_capability_ids?: string[] }) => item.required_capability_ids ?? [],
    ))].filter((id) => mutating.has(id));
    for (const capabilityId of requiredMutations) {
      assert.ok(pinned.skills[specialistId].capability_ids.includes(capabilityId), `${specialistId}: ${capabilityId}`);
      assert.equal(pinned.skills.outreach.capability_ids.includes(capabilityId), false, `coordinator: ${capabilityId}`);
    }
  }
  assert.ok(pinned.skills['outreach-workflow-builder'].capability_ids.includes('workflows.create'));
  assert.ok(pinned.skills['outreach-sequence-writer'].capability_ids.includes('sequences.bind'));
});

test('tables is the exactly one specialist owner of source preview and expansion', () => {
  const artifacts = build();
  const pinned = JSON.parse(artifacts['generated/architect/PINNED_RELEASE.json']);
  for (const capabilityId of [
    'sources.cold_outbound_preview',
    'sources.linkedin_post_engagers_preview',
    'sources.cold_outbound_expand',
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

test('outreach is Brain-first and Workbook-first before demand, workflow, or sequence planning', () => {
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
  assert.match(kernel, /derive.*Company Brain.*before.*intake/is);
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
  const workbookApproval = sequence.findIndex((step) => (
    step.tool === 'request_approval' && step.artifact_type === 'outreach_workbook'
  ));
  assert.ok(workbookApproval > 0);
  const premature = sequence.slice(0, workbookApproval + 1).filter((step) => (
    step.capability_id === 'outreach.demand_plan_get'
    || step.skill_id === 'outreach-workflow-builder'
    || step.skill_id === 'outreach-sequence-writer'
    || step.capability_id?.startsWith('workflows.')
    || step.capability_id?.startsWith('sequences.')
  ));
  assert.deepEqual(premature, []);
  assert.ok(
    sequence.findIndex((step) => step.capability_id === 'outreach.demand_plan_get') > workbookApproval,
    'demand planning must constrain expansion and launch, not delay the initial Workbook',
  );
});

test('outreach launch closure and pilot invariants use the canonical workflow and sequence surface', () => {
  const artifacts = build();
  const kernel = artifacts['generated/architect/outreach/KERNEL.md'];
  const evals = JSON.parse(artifacts['generated/architect/outreach/evals.json']);
  assert.match(kernel, /`row_limit: 7`/);
  assert.match(kernel, /exactly seven distinct stable identities/i);
  assert.match(kernel, /no padding/i);
  assert.match(kernel, /never imports.*enrolls/is);

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
  assert.match(coordinator, /literal `row_limit: 7`/i);
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

  assert.equal(staged.required_capability_ids, undefined);
  assert.deepEqual(staged.required_completion_fields, [
    { id: 'stage_boundary_state', allowed_values: ['ordered_separate'] },
    { id: 'activation_state', allowed_values: ['inactive'] },
    { id: 'external_send_state', allowed_values: ['not_authorized'] },
    { id: 'approval_state', allowed_values: ['required'] },
    { id: 'run_state', allowed_values: ['not_applicable'] },
  ]);
  assert.match(staged.request, /do not fetch or plan demand.*before Workbook approval.*run_state not_applicable/is);
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
    'tables', 'outreach-workflow-builder', 'outreach-sequence-writer', 'outreach',
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
  const pilotProposalIndex = sequenceIndex((step) => (
    step.tool === 'propose_artifact'
    && step.artifact_type === 'outreach_source'
    && step.phase === 'exact_7_row_source_evidence_pilot'
  ));
  const bundleIndex = sequenceIndex((step) => (
    step.tool === 'propose_artifact' && step.artifact_type === 'outreach_bundle'
  ));
  const workbookApprovalIndex = sequenceIndex((step) => (
    step.tool === 'request_approval' && step.artifact_type === 'outreach_workbook'
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
  assert.ok(pilotProposalIndex > intakeIndex);
  assert.ok(workbookApprovalIndex > pilotProposalIndex);
  assert.ok(demandIndex > workbookApprovalIndex);
  assert.ok(bundleIndex > demandIndex);
  assert.ok(sampleIndex > bundleIndex);
  assert.ok(expansionDemandIndex > sampleIndex);
  assert.ok(expansionIndex > expansionDemandIndex);
  assert.ok(revalidationIndex > expansionIndex);
  assert.ok(activationIndex > revalidationIndex);
  assert.ok(terminalIndex > activationIndex);
  assert.match(full.request, /existing Workbook.*row_limit: 7 pilot.*terminal receipts/i);
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
  assert.match(kernel, /exactly seven distinct stable identities/);
  assert.match(kernel, /partial result stays partial/);
  assert.match(kernel, /complete raw provider payload/);
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
  const paidSample = tables.cases.find((item: { id: string }) => item.id === 'bounded-paid-run');

  assert.equal(buildTable.fixture_profile, 'tables_reactive_proposal');
  assert.deepEqual(buildTable.required_capability_ids, ['tables.create']);
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
    /do not claim a preparation receipt it cannot produce/,
  );
});

test('workspace-local production evals require exact approval and durable present outcomes', () => {
  const artifacts = build();
  const tables = JSON.parse(artifacts['generated/architect/tables/evals.json']);
  const records = JSON.parse(artifacts['generated/architect/records/evals.json']);
  const production = [...tables.cases, ...records.cases]
    .filter((item: { id: string }) => item.id.startsWith('production-local-'));

  assert.equal(production.length, 8);
  assert.equal(production.filter((item: { skill_id?: string }) => item.skill_id === undefined).length, 8);
  for (const item of production) {
    assert.equal(item.execution_profile, 'production_real');
    assert.equal(item.fixture_profile, 'workspace_local_approved_mutation');
    assert.equal(item.resume_after_approval, 'owner_exact');
    assert.deepEqual(item.allowed_consequence_levels, ['draft_write']);
    assert.deepEqual(
      [...item.approved_mutation_capability_ids].sort(),
      [...item.required_capability_ids].sort(),
    );
    const workbookColumns = item.expected_workspace_outcome.find(
      (outcome: { check?: string }) => outcome.check === 'workbook_columns',
    );
    assert.equal(
      item.approved_mutation_max_changes,
      workbookColumns
        ? 1 + workbookColumns.expected_columns.length
        : item.required_capability_ids.length,
    );
    assert.equal(item.required_tool_sequence, undefined);
    assert.ok(item.expected_workspace_outcome.some(
      (outcome: { expected?: string }) => outcome.expected === 'present',
    ));
    assert.match(item.request, /do not (?:attach|run|message|enrich|import|sync|enroll|send)/i);
  }
});

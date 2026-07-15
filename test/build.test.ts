import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { build, writeArtifacts, checkArtifacts } from '../scripts/build.js';
import { buildArchitectArtifacts } from '../scripts/architect-build.js';

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
  assert.equal(ids.length, 14);
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
    assert.match(
      architect,
      /denied_operations: \[tools_run, propose_artifact, request_approval\]/,
    );
    assert.match(architect, /Never use `tools_run` for direct mutating or paid work/);
    assert.match(architect, /`propose_artifact`/);
    assert.match(architect, /`request_approval`/);
    assert.match(architect, /Refuse `tools_run` until the installed package is refreshed/);
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
      assert.match(
        standalone,
        /recovery_operations: \[dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs\]/,
      );
      assert.match(
        standalone,
        /denied_operations: \[dreamstate_tools_run, dreamstate_proposals_create, dreamstate_proposals_mutate\]/,
      );
      assert.match(standalone, /Refuse `dreamstate_tools_run` until the installed package is refreshed/);
      assert.match(standalone, /`dreamstate_tools_search` and `dreamstate_tools_get`/);
      assert.match(standalone, /`dreamstate_proposals_create`/);
      assert.match(standalone, /human review/);
      assert.match(standalone, /`dreamstate_proposals_mutate`/);
      assert.match(standalone, /expected revision and state version/i);
      assert.match(standalone, /revise, approve, or reject/i);
      assert.match(standalone, /Never use `dreamstate_tools_run` for direct mutating or paid work/);
      assert.match(standalone, /returned `run_id`/);
      assert.match(standalone, /`dreamstate_get_run`/);
    }
    assert.equal(pinned.skills[id].kernel_sha256, clients.skills[id].kernel_sha256);
    assert.equal(pinned.skills[id].evals_sha256, clients.skills[id].evals_sha256);
    assert.match(
      artifacts[`${architectRoot}/SKILL.md`],
      /bounded structured partial outputs plus the exact next transition/,
    );
  }
});

test('Architect generation rejects capability domains absent from the pinned registry', () => {
  const withoutOutreach = {
    ...catalog,
    capabilities: catalog.capabilities.filter((capability: { domain: string }) => capability.domain !== 'outreach'),
  };
  assert.throws(
    () => buildArchitectArtifacts(withoutOutreach),
    /outreach.*capability domain.*pinned capability manifest/i,
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
    outreach: ['outreach'],
    'outreach-list-builder': ['outreach'],
    'outreach-sequence-writer': ['outreach'],
    'outreach-workflow-builder': ['outreach'],
    'reddit-engagement': ['content'],
    social: ['content'],
    strategy: ['brain', 'context'],
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
  const mutationOperations = new Set([
    'dreamstate_tools_run',
    'dreamstate_proposals_create',
    'dreamstate_proposals_mutate',
  ]);
  const permits = (operation: string) => (
    !mutationOperations.has(operation) || compatible
  );
  assert.equal(permits('dreamstate_tools_search'), true);
  assert.equal(permits('dreamstate_tools_get'), true);
  assert.equal(permits('dreamstate_proposals_get'), true);
  assert.equal(permits('dreamstate_get_run'), true);
  assert.equal(permits('dreamstate_list_runs'), true);
  assert.equal(permits('dreamstate_tools_run'), false);
  assert.equal(permits('dreamstate_proposals_create'), false);
  assert.equal(permits('dreamstate_proposals_mutate'), false);
});

test('the pinned MCP catalog exposes the governed proposal lifecycle used by Claude and Codex', () => {
  const tools = new Set(catalog.mcp_tools.map((tool: { name: string }) => tool.name));
  for (const tool of [
    'dreamstate_proposals_create',
    'dreamstate_proposals_get',
    'dreamstate_proposals_mutate',
  ]) {
    assert.equal(tools.has(tool), true, `${tool} must be present in the pinned MCP catalog`);
  }
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

  const index = JSON.parse(artifacts['skills-index.json']);
  const outreachSkills = index.skills.filter((skill: { domain: string }) => skill.domain === 'outreach');
  for (const skill of outreachSkills) {
    assert.equal(skill.mcp_tools.includes('outreach_apply_template'), false, `${skill.slug}: forbidden agent shortcut tool`);
    assert.equal(skill.capability_ids.includes('intent:outreach.apply_template'), false, `${skill.slug}: forbidden agent shortcut capability`);
    assert.equal(skill.run_intents.includes('outreach.apply_template'), false, `${skill.slug}: forbidden agent shortcut intent`);
  }
  for (const slug of ['outbound', 'sequence-builder', 'multichannel']) {
    const body = artifacts[`skills/outreach/${slug}/SKILL.md`];
    assert.match(body, /Never select, clone, or apply a campaign template or preset/);
    for (const line of body.split('\n').filter((candidate) => /\b(?:templates?|presets?|clone)\b/i.test(candidate))) {
      assert.match(line, /(?:Never select, clone, or apply|manual human product UI)/, `${slug}: positive shortcut guidance: ${line}`);
    }
  }
  assert.doesNotMatch(artifacts['generated/site/skills-catalog.json'], /outreach_apply_template|intent:outreach\.apply_template|outreach\.apply_template/);
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

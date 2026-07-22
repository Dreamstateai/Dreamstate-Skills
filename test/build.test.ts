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
const buildArchitect = () => buildArchitectArtifacts(catalog);

// build() IS the contract test: it parses every playbook, validates the
// frontmatter, and asserts every declared tool and capability exists in the
// pinned canonical manifest. If it
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
  const artifacts = buildArchitect();
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

test('Context resolver metadata covers governed updates to fixed Company documents', () => {
  const context = architectSource.skills.find((skill: { id: string }) => skill.id === 'context');
  assert.ok(context);
  assert.ok(context.triggers.some((trigger: string) => (
    /update/i.test(trigger) && /Company Brain/i.test(trigger) && /Ideal Customer/i.test(trigger)
  )));

  const artifacts = buildArchitect();
  assert.match(
    artifacts['generated/architect/context/SKILL.md'],
    /update a governed Company Brain document such as Ideal Customer/,
  );
});

test('signed capability domains stay identical across source, Architect, Claude, Codex, and release manifests', () => {
  const artifacts = buildArchitect();
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
  const exactCapabilityIds = ['sources.cold_outbound_expand'];
  assert.deepEqual(
    architectSource.skills.find((skill: { id: string }) => skill.id === 'outreach-workflow-builder')?.capability_ids,
    exactCapabilityIds,
  );
  assert.deepEqual(pinned.skills['outreach-workflow-builder'].capability_ids, exactCapabilityIds);
  assert.deepEqual(clients.skills['outreach-workflow-builder'].capability_ids, exactCapabilityIds);
  for (const root of [
    'generated/architect/outreach-workflow-builder',
    'generated/client-adapters/claude/outreach-workflow-builder',
    'generated/client-adapters/codex/outreach-workflow-builder',
  ]) {
    assert.ok(
      artifacts[`${root}/SKILL.md`].split('\n').includes(
        `capability_ids: ${JSON.stringify(exactCapabilityIds)}`,
      ),
      `${root}/SKILL.md must carry the signed exact capability closure`,
    );
  }
});

test('audience planning kernels require privacy-safe pooled benchmark evidence', () => {
  const artifacts = buildArchitect();
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
  assert.equal(restaurantOwners.fixture_profile, 'outreach_zero_history_benchmark');
  assert.deepEqual(restaurantOwners.required_capability_ids, ['brain.learning.query_benchmarks']);
  assert.match(restaurantOwners.request, /State the privacy boundary verbatim: never raw cross-workspace rows/);

  const social = JSON.parse(artifacts['generated/architect/social/evals.json']);
  assert.ok(social.cases.some((item: { id: string }) => item.id === 'founder-posts-pooled-benchmark'));

  const seo = JSON.parse(artifacts['generated/architect/seo/evals.json']);
  assert.ok(seo.cases.some((item: { id: string }) => item.id === 'agency-keywords-pooled-benchmark'));
  const technicalSeo = seo.cases.find((item: { id: string }) => (
    item.id === 'technical-and-content-plan'
  ));
  assert.ok(technicalSeo);
  assert.match(technicalSeo.request, /owninfluence\.com/);
  assert.match(technicalSeo.request, /demo bookings/);
  assert.match(technicalSeo.request, /fast-triage/);
  assert.match(technicalSeo.request, /buffer\.com/);
  assert.match(technicalSeo.request, /hootsuite\.com/);
  assert.match(technicalSeo.request, /read-only/);
  const seoKernel = artifacts['generated/architect/seo/KERNEL.md'];
  assert.match(
    seoKernel,
    /Every benchmark handoff, including a blocked or unavailable one/,
  );
  assert.match(
    artifacts['generated/architect/outreach/KERNEL.md'],
    /Do not terminate after discovery or contract inspection/,
  );
  assert.match(
    seoKernel,
    /exact capability id `brain\.learning\.query_benchmarks`/,
  );
  assert.match(seoKernel, /privacy boundary: never raw cross-workspace rows/);
});

test('social research executes scoped reads without blocking on optional presentation choices', () => {
  const artifacts = buildArchitect();
  const kernel = artifacts['generated/architect/social/KERNEL.md'];
  assert.match(kernel, /topic or query and time window/i);
  assert.match(kernel, /ranking and output (?:format )?choices are optional/i);
  assert.match(kernel, /transparent defaults/i);
  assert.match(kernel, /nullable metrics/i);
  assert.match(kernel, /Ask only for truly required missing inputs/i);
});

test('a standalone Claude or Codex package keeps discovery usable but denies mutation on compatibility drift', () => {
  const artifacts = buildArchitect();
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
  const artifacts = buildArchitect();
  const forbidden = /\b(?:templates?|presets?|reusable|reuse)\b/i;
  for (const id of ['outreach', 'tables', 'outreach-sequence-writer', 'outreach-workflow-builder']) {
    for (const file of ['SKILL.md', 'KERNEL.md', 'evals.json']) {
      const path = `generated/architect/${id}/${file}`;
      assert.doesNotMatch(artifacts[path], forbidden, path);
    }
  }
  assert.match(
    artifacts['generated/architect/tables/KERNEL.md'],
    /Preserve compatible identity and evidence fields/,
  );
});

test('growth asset planning may describe a buyer template library but stays explicitly unsaved without a capability', () => {
  const artifacts = buildArchitect();
  assert.match(
    artifacts['generated/architect/growth-asset-planner/KERNEL.md'],
    /buyer-facing template library/i,
  );
  const evals = JSON.parse(artifacts['generated/architect/growth-asset-planner/evals.json']);
  assert.equal(evals.cases[0].must_state_unsaved_without_capability, true);
  assert.match(artifacts['generated/architect/growth-asset-planner/KERNEL.md'], /explicitly unsaved proposal/i);
});

test('outreach kernels keep evidence pilot, build, sample, bulk expansion, and launch as ordered typed stages', () => {
  const artifacts = buildArchitect();
  const coordinator = artifacts['generated/architect/outreach/KERNEL.md'];
  const tables = artifacts['generated/architect/tables/KERNEL.md'];
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
  assert.match(coordinator, /sources\.cold_outbound_preview/);
  assert.match(coordinator, /no worksheet, campaign, source, import, enrollment, or other durable destination/i);
  assert.match(coordinator, /sources\.cold_outbound_expand/);
  assert.match(coordinator, /stage_exact_result_set=true/);
  assert.match(coordinator, /require_campaign_status=draft/);
  assert.match(tables, /smallest representative selection/i);
  assert.match(tables, /Approval for a schema change never authorizes a paid run/);
  assert.match(tables, /exact workbook, worksheet, saved view/);
  assert.match(workflow, /source-evidence run/);
  assert.match(workflow, /exact workbook, worksheet, and saved-view revisions/);
  assert.match(workflow, /workflow proposal cannot run columns or enroll contacts/i);
  assert.match(coordinator, /single activation-and-send authorization/i);
  assert.match(coordinator, /Do not invent a second send approval gate/i);
});

test('outreach release uses exact capability evidence and signed lifecycle states', () => {
  const artifacts = build();
  const outreach = JSON.parse(artifacts['generated/architect/outreach/evals.json']);
  const workflow = JSON.parse(artifacts['generated/architect/outreach-workflow-builder/evals.json']);
  const staged = outreach.cases.find((item: { id: string }) => item.id === 'staged-pilot-build-sample-expand-launch');
  const launch = outreach.cases.find((item: { id: string }) => item.id === 'explicit-final-launch-revalidation');
  const conditional = outreach.cases.find((item: { id: string }) => item.id === 'sequence-only-when-messaging');
  const exactSet = workflow.cases.find((item: { id: string }) => item.id === 'exact-result-set-expansion-is-separate');

  assert.deepEqual(staged.required_capability_ids, [
    'sources.cold_outbound_preview',
    'sources.cold_outbound_expand',
  ]);
  assert.deepEqual(staged.required_completion_fields, [
    { id: 'stage_boundary_state', allowed_values: ['ordered_separate'] },
    { id: 'campaign_state', allowed_values: ['inactive'] },
    { id: 'activation_state', allowed_values: ['inactive'] },
    { id: 'external_send_state', allowed_values: ['not_authorized'] },
    { id: 'approval_state', allowed_values: ['required'] },
    { id: 'run_state', allowed_values: ['not_applicable'] },
  ]);
  assert.match(staged.request, /creates no run.*run_state not_applicable.*do not fabricate a blocked run/i);
  assert.ok(launch.required_completion_fields.some((field: { id: string; allowed_values: string[] }) => (
    field.id === 'external_send_state' && field.allowed_values.includes('not_authorized')
  )));
  assert.ok(launch.required_completion_fields.some((field: { id: string; allowed_values: string[] }) => (
    field.id === 'selection_state' && field.allowed_values.includes('missing')
  )));
  assert.ok(launch.required_completion_fields.some((field: { id: string; allowed_values: string[] }) => (
    field.id === 'run_state' && field.allowed_values.includes('blocked')
  )));
  assert.deepEqual(conditional.must_use_popup_when_missing, ['messaging branch']);
  assert.deepEqual(exactSet.required_capability_ids, ['sources.cold_outbound_expand']);
  assert.equal(exactSet.fixture_profile, 'outreach_exact_result_set_expansion');
  assert.ok(exactSet.required_completion_fields.some((field: { id: string; allowed_values: string[] }) => (
    field.id === 'selection_state' && field.allowed_values.includes('exact')
  )));
  assert.match(
    artifacts['generated/architect/outreach/KERNEL.md'],
    /structured `ask_user` popup whose finite `messaging_branch_state` choice is `present` or `absent`/,
  );
  assert.match(
    artifacts['generated/architect/outreach/KERNEL.md'],
    /three distinct questions whose ids or prompts literally include `qualification`, `sender`, and `volume`/,
  );
  const outreachSkill = architectSource.skills.find((skill: { id: string }) => skill.id === 'outreach');
  const integrationsSkill = architectSource.skills.find((skill: { id: string }) => skill.id === 'integrations');
  assert.ok(outreachSkill.triggers.includes('design an outreach campaign for a named cohort using pooled benchmarks'));
  assert.match(integrationsSkill.description, /Provider content research, metrics, and search-window coverage remain with their domain skills/);
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
  assert.deepEqual(paidSample.required_capability_ids, ['columns.sample']);
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
    /A proposal without the tools_run preparation receipt is incomplete/,
  );
});

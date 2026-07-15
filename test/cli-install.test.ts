import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const INDEX_SKILLS = (JSON.parse(readFileSync(join(ROOT, 'skills-index.json'), 'utf8')) as {
  skills: Array<{ slug: string; execution_mode: string }>;
}).skills;
const UNSAFE_GENERIC_SLUGS = INDEX_SKILLS
  .filter((skill) => ['executable', 'guided-execution'].includes(skill.execution_mode))
  .map((skill) => skill.slug);

function seedInstalledSkills(skillsDir: string, slugs: string[]): void {
  for (const slug of slugs) {
    mkdirSync(join(skillsDir, slug), { recursive: true });
    writeFileSync(join(skillsDir, slug, 'SKILL.md'), `# stale ${slug}\n`);
  }
}

function assertNoUnsafeGenericSkills(skillsDir: string): void {
  for (const slug of UNSAFE_GENERIC_SLUGS) {
    assert.equal(existsSync(join(skillsDir, slug)), false, `stale unsafe generic ${slug} survived`);
  }
}

function runInstall(home: string, args: string[]) {
  return spawnSync(
    process.execPath,
    ['--import', 'tsx', join(ROOT, 'src', 'cli.ts'), ...args],
    { cwd: ROOT, env: { ...process.env, HOME: home }, encoding: 'utf8' },
  );
}

test('Claude installs the release-pinned hardened adapter bytes', () => {
  const home = mkdtempSync(join(tmpdir(), 'dreamstate-cli-claude-'));
  try {
    const result = runInstall(home, ['skills', 'install', 'outreach-list-builder', '--claude']);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    for (const file of ['SKILL.md', 'KERNEL.md', 'evals.json']) {
      assert.deepEqual(
        readFileSync(join(home, '.claude', 'skills', 'outreach-list-builder', file)),
        readFileSync(join(ROOT, 'generated', 'client-adapters', 'claude', 'outreach-list-builder', file)),
      );
    }
    const installed = readFileSync(join(home, '.claude', 'skills', 'outreach-list-builder', 'SKILL.md'), 'utf8');
    assert.match(installed, /client: claude/);
    assert.match(installed, /mismatch_behavior: deny_run/);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test('Codex installs its own adapter while Cursor keeps the generic package', () => {
  const home = mkdtempSync(join(tmpdir(), 'dreamstate-cli-clients-'));
  try {
    const codex = runInstall(home, ['skills', 'install', 'social', '--codex']);
    assert.equal(codex.status, 0, codex.stderr || codex.stdout);
    assert.deepEqual(
      readFileSync(join(home, '.codex', 'skills', 'social', 'SKILL.md')),
      readFileSync(join(ROOT, 'generated', 'client-adapters', 'codex', 'social', 'SKILL.md')),
    );

    const cursor = runInstall(home, ['skills', 'install', 'outbound', '--cursor']);
    assert.equal(cursor.status, 0, cursor.stderr || cursor.stdout);
    const generic = JSON.parse(readFileSync(join(ROOT, 'skills-index.json'), 'utf8'))
      .skills.find((skill: { slug: string }) => skill.slug === 'outbound');
    assert.deepEqual(
      readFileSync(join(home, '.cursor', 'skills', 'outbound', 'SKILL.md')),
      readFileSync(join(ROOT, generic.path, 'SKILL.md')),
    );
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test('Claude and Codex omit every generic executable or guided package from a full install', () => {
  const index = JSON.parse(readFileSync(join(ROOT, 'skills-index.json'), 'utf8')) as {
    skills: Array<{ slug: string; execution_mode: string }>;
  };
  const unsafe = index.skills.filter((skill) => ['executable', 'guided-execution'].includes(skill.execution_mode));
  const safe = index.skills.find((skill) => skill.execution_mode === 'knowledge');
  assert.ok(safe);
  for (const client of ['claude', 'codex'] as const) {
    const home = mkdtempSync(join(tmpdir(), `dreamstate-cli-${client}-governed-`));
    try {
      const result = runInstall(home, ['skills', 'install', `--${client}`]);
      assert.equal(result.status, 0, result.stderr || result.stdout);
      const skillsDir = join(home, `.${client}`, 'skills');
      for (const skill of unsafe) {
        assert.equal(existsSync(join(skillsDir, skill.slug)), false, `${client} installed unsafe generic ${skill.slug}`);
      }
      assert.equal(existsSync(join(skillsDir, 'network-grow')), false);
      assert.equal(existsSync(join(skillsDir, 'reply-triage')), false);
      assert.equal(existsSync(join(skillsDir, safe.slug)), true, `${client} omitted safe knowledge package ${safe.slug}`);
      assert.equal(existsSync(join(skillsDir, 'outreach', 'SKILL.md')), true, `${client} omitted governed outreach adapter`);
      assert.equal(existsSync(join(skillsDir, 'social', 'SKILL.md')), true, `${client} omitted governed social adapter`);
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  }
});

test('Claude and Codex refuse explicit installation of an unsafe generic package', () => {
  for (const client of ['claude', 'codex'] as const) {
    const home = mkdtempSync(join(tmpdir(), `dreamstate-cli-${client}-unsafe-`));
    try {
      for (const slug of ['network-grow', 'reply-triage']) {
        const result = runInstall(home, ['skills', 'install', slug, `--${client}`]);
        assert.notEqual(result.status, 0, `${client} installed unsafe generic ${slug}`);
        assert.match(result.stderr, /not available.*governed/i);
      }
      const safe = runInstall(home, ['skills', 'install', 'define-icp', `--${client}`]);
      assert.equal(safe.status, 0, safe.stderr || safe.stdout);
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  }
});

test('a full governed upgrade prunes stale Dreamstate unsafe packages but preserves unrelated skills', () => {
  const home = mkdtempSync(join(tmpdir(), 'dreamstate-cli-governed-upgrade-'));
  const skillsDir = join(home, '.claude', 'skills');
  try {
    seedInstalledSkills(skillsDir, [...UNSAFE_GENERIC_SLUGS, 'outreach', 'my-custom-skill']);
    const customBefore = readFileSync(join(skillsDir, 'my-custom-skill', 'SKILL.md'));

    const result = runInstall(home, ['skills', 'install', '--claude']);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assertNoUnsafeGenericSkills(skillsDir);
    assert.deepEqual(readFileSync(join(skillsDir, 'my-custom-skill', 'SKILL.md')), customBefore);
    assert.deepEqual(
      readFileSync(join(skillsDir, 'outreach', 'SKILL.md')),
      readFileSync(join(ROOT, 'generated', 'client-adapters', 'claude', 'outreach', 'SKILL.md')),
      'the governed adapter must replace any stale same-slug package',
    );
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test('a governed outbound bundle upgrade prunes every stale unsafe Dreamstate package', () => {
  const home = mkdtempSync(join(tmpdir(), 'dreamstate-cli-governed-bundle-upgrade-'));
  const skillsDir = join(home, '.codex', 'skills');
  try {
    seedInstalledSkills(skillsDir, [...UNSAFE_GENERIC_SLUGS, 'my-custom-skill']);
    const result = runInstall(home, ['skills', 'install', '--bundle', 'outbound', '--codex']);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assertNoUnsafeGenericSkills(skillsDir);
    assert.equal(existsSync(join(skillsDir, 'my-custom-skill', 'SKILL.md')), true);
    assert.equal(existsSync(join(skillsDir, 'outreach', 'SKILL.md')), true);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test('installing one safe governed skill prunes every stale unsafe Dreamstate package', () => {
  const home = mkdtempSync(join(tmpdir(), 'dreamstate-cli-governed-single-'));
  const skillsDir = join(home, '.claude', 'skills');
  try {
    seedInstalledSkills(skillsDir, [...UNSAFE_GENERIC_SLUGS, 'my-custom-skill']);
    const result = runInstall(home, ['skills', 'install', 'define-icp', '--claude']);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assertNoUnsafeGenericSkills(skillsDir);
    assert.equal(existsSync(join(skillsDir, 'my-custom-skill', 'SKILL.md')), true);
    assert.equal(existsSync(join(skillsDir, 'define-icp', 'SKILL.md')), true);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test('updating one safe governed skill prunes every stale unsafe Dreamstate package', () => {
  const home = mkdtempSync(join(tmpdir(), 'dreamstate-cli-governed-single-update-'));
  const skillsDir = join(home, '.codex', 'skills');
  try {
    seedInstalledSkills(skillsDir, [...UNSAFE_GENERIC_SLUGS, 'my-custom-skill']);
    const result = runInstall(home, ['skills', 'update', 'define-icp', '--codex']);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assertNoUnsafeGenericSkills(skillsDir);
    assert.equal(existsSync(join(skillsDir, 'my-custom-skill', 'SKILL.md')), true);
    assert.equal(existsSync(join(skillsDir, 'define-icp', 'SKILL.md')), true);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test('refusing an unsafe governed skill still prunes every stale unsafe Dreamstate package', () => {
  const home = mkdtempSync(join(tmpdir(), 'dreamstate-cli-governed-refusal-'));
  const skillsDir = join(home, '.claude', 'skills');
  try {
    seedInstalledSkills(skillsDir, [...UNSAFE_GENERIC_SLUGS, 'my-custom-skill']);
    const result = runInstall(home, ['skills', 'install', 'network-grow', '--claude']);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /not available.*governed/i);
    assertNoUnsafeGenericSkills(skillsDir);
    assert.equal(existsSync(join(skillsDir, 'my-custom-skill', 'SKILL.md')), true);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

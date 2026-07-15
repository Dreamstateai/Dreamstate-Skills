import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = join(import.meta.dirname, '..');

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

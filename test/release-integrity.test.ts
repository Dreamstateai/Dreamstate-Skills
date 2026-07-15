import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VERIFIER = join(ROOT, 'scripts', 'verify-generated-clean.ts');

function git(root: string, args: string[]) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

function verify(root: string) {
  return spawnSync(process.execPath, ['--import', 'tsx', VERIFIER, root], {
    cwd: ROOT,
    encoding: 'utf8',
  });
}

test('generated-tree verifier fails on tracked and untracked owned drift but ignores unrelated files', () => {
  const root = mkdtempSync(join(tmpdir(), 'dreamstate-generated-clean-'));
  try {
    git(root, ['init', '--quiet']);
    mkdirSync(join(root, 'generated'), { recursive: true });
    writeFileSync(join(root, 'generated', 'tracked.txt'), 'committed\n');
    writeFileSync(join(root, 'README.md'), 'outside owned paths\n');
    git(root, ['add', '.']);
    git(root, ['-c', 'user.name=Dreamstate Test', '-c', 'user.email=test@example.com', 'commit', '--quiet', '-m', 'fixture']);

    const clean = verify(root);
    assert.equal(clean.status, 0, clean.stderr || clean.stdout);

    writeFileSync(join(root, 'generated', 'tracked.txt'), 'drifted\n');
    writeFileSync(join(root, 'generated', 'untracked.txt'), 'new drift\n');
    writeFileSync(join(root, 'README.md'), 'unrelated drift\n');
    const dirty = verify(root);
    assert.notEqual(dirty.status, 0);
    assert.match(dirty.stderr, /generated\/tracked\.txt/);
    assert.match(dirty.stderr, /generated\/untracked\.txt/);
    assert.doesNotMatch(dirty.stderr, /README\.md/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

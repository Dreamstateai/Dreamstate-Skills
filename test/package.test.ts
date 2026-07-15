import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('release tests use Node 18-compatible ESM directory resolution', () => {
  for (const file of ['cli-install.test.ts', 'package.test.ts', 'sync-capability-manifest.test.ts']) {
    assert.doesNotMatch(readFileSync(join(ROOT, 'test', file), 'utf8'), /import\.meta\.dirname/);
  }
});

function run(command: string, args: string[], cwd: string, env = process.env) {
  const result = spawnSync(command, args, { cwd, env, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result;
}

test('npm tarball contains runnable maintainer scripts and Architect source inputs', {
  skip: process.env.DREAMSTATE_SKIP_PACK_SMOKE === '1',
}, () => {
  const root = mkdtempSync(join(tmpdir(), 'dreamstate-pack-'));
  try {
    const packed = run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', root], ROOT);
    const filename = JSON.parse(packed.stdout)[0].filename;
    const archive = join(root, filename);
    const entries = run('tar', ['-tzf', archive], ROOT).stdout.split('\n');
    for (const relative of [
      'scripts/build.ts',
      'scripts/architect-build.ts',
      'scripts/sync-capability-manifest.ts',
      'scripts/sync-architect.ts',
      'architect-kernels/skills.json',
      'architect-kernels/outreach/KERNEL.md',
      'test/build.test.ts',
    ]) {
      assert.ok(entries.includes(`package/${relative}`), `${relative} missing from tarball`);
    }
    mkdirSync(join(root, 'package'), { recursive: true });
    run('tar', [
      '-xzf', archive, '-C', root,
      'package/package.json',
      'package/tsconfig.json',
      'package/scripts',
      'package/architect-kernels',
      'package/src',
      'package/contracts',
      'package/playbooks',
      'package/test',
    ], ROOT);
    const packageRoot = join(root, 'package');
    const packageJson = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
    assert.ok(packageJson.dependencies.tsx, 'tsx must be a production dependency for published scripts');
    assert.ok(packageJson.dependencies.typescript, 'typescript must be a production dependency for the published compile script');
    assert.ok(packageJson.dependencies['@types/node'], 'Node types must be a production dependency for the published compile script');

    symlinkSync(join(ROOT, 'node_modules'), join(packageRoot, 'node_modules'), 'dir');
    run('npm', ['run', 'build'], packageRoot);
    run('npm', ['run', 'check'], packageRoot);
    run('npm', ['run', 'compile'], packageRoot);
    run(
      'npm',
      ['test'],
      packageRoot,
      { ...process.env, DREAMSTATE_SKIP_PACK_SMOKE: '1' },
    );
    const installHome = join(realpathSync(root), 'installed-home');
    run(
      process.execPath,
      ['lib/cli.js', 'skills', 'install', '--codex'],
      packageRoot,
      { ...process.env, HOME: installHome },
    );
    assert.deepEqual(
      readFileSync(join(installHome, '.codex', 'skills', 'social', 'SKILL.md')),
      readFileSync(join(packageRoot, 'generated', 'client-adapters', 'codex', 'social', 'SKILL.md')),
      'the CLI compiled from packed sources must install the exact hardened Codex adapter bytes',
    );
    assert.equal(existsSync(join(installHome, '.codex', 'skills', 'network-grow')), false);
    assert.equal(existsSync(join(installHome, '.codex', 'skills', 'reply-triage')), false);
    assert.equal(existsSync(join(installHome, '.codex', 'skills', 'define-icp', 'SKILL.md')), true);
    run('npm', ['run', 'sync:capabilities', '--', 'contracts/capability-manifest.json'], packageRoot);
    const target = join(realpathSync(root), 'runtime', 'prompts', 'skills');
    run('npm', ['run', 'sync:architect', '--', target], packageRoot);
    assert.ok(readFileSync(join(target, 'PINNED_RELEASE.json'), 'utf8').length > 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

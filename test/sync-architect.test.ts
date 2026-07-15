import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { syncArchitectRelease } from '../scripts/sync-architect.js';

const REAL_TMPDIR = realpathSync(tmpdir());

function artifacts(marker = 'new-release'): Record<string, string> {
  const pinned = {
    schema_version: 1,
    skills: {
      outreach: {
        capability_domains: ['outreach'],
        kernel_sha256: 'a'.repeat(64),
        adapter_sha256: 'b'.repeat(64),
        evals_sha256: 'c'.repeat(64),
      },
    },
  };
  return {
    'generated/architect/PINNED_RELEASE.json': `${JSON.stringify(pinned)}\n`,
    'generated/architect/outreach/KERNEL.md': `# ${marker}\n`,
    'generated/architect/outreach/SKILL.md': `---\nid: outreach\ncapability_domains: ["outreach"]\n---\n\n# ${marker}\n`,
    'generated/architect/outreach/evals.json': '{"schema_version":1,"skill_id":"outreach","cases":[{}]}\n',
  };
}

function oldTarget(root: string): string {
  const target = join(root, 'prompts', 'skills');
  const skill = join(target, 'outreach');
  mkdirSync(skill, { recursive: true });
  writeFileSync(join(target, 'PINNED_RELEASE.json'), JSON.stringify({ skills: { outreach: {} } }));
  writeFileSync(join(skill, 'KERNEL.md'), 'old-kernel');
  writeFileSync(join(skill, 'SKILL.md'), 'old-skill');
  writeFileSync(join(skill, 'evals.json'), 'old-evals');
  writeFileSync(join(target, 'README.md'), 'preserve-me');
  return target;
}

function assertOldTarget(target: string): void {
  assert.equal(readFileSync(join(target, 'outreach', 'KERNEL.md'), 'utf8'), 'old-kernel');
  assert.equal(readFileSync(join(target, 'README.md'), 'utf8'), 'preserve-me');
  assert.deepEqual(readdirSync(target).sort(), ['PINNED_RELEASE.json', 'README.md', 'outreach']);
}

test('Architect release sync stages and atomically replaces the exact target', () => {
  const root = mkdtempSync(join(REAL_TMPDIR, 'architect-atomic-sync-'));
  try {
    const target = oldTarget(root);
    assert.equal(syncArchitectRelease({ target, artifacts: artifacts() }), 1);
    assert.equal(readFileSync(join(target, 'outreach', 'KERNEL.md'), 'utf8'), '# new-release\n');
    assert.equal(readFileSync(join(target, 'README.md'), 'utf8'), 'preserve-me');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('an injected mid-stage failure leaves the old target byte-for-byte available', () => {
  const root = mkdtempSync(join(REAL_TMPDIR, 'architect-stage-failure-'));
  try {
    const target = oldTarget(root);
    assert.throws(() => syncArchitectRelease({
      target,
      artifacts: artifacts(),
      hooks: {
        afterStageFile: (_relative, index) => {
          if (index === 2) throw new Error('injected stage failure');
        },
      },
    }), /injected stage failure/);
    assertOldTarget(target);
    assert.equal(readdirSync(join(root, 'prompts')).some((name) => name.includes('.architect-skills-stage-')), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('an injected failure after backup rename rolls the old target back', () => {
  const root = mkdtempSync(join(REAL_TMPDIR, 'architect-swap-failure-'));
  try {
    const target = oldTarget(root);
    assert.throws(() => syncArchitectRelease({
      target,
      artifacts: artifacts(),
      hooks: { afterBackupRename: () => { throw new Error('injected swap failure'); } },
    }), /injected swap failure/);
    assertOldTarget(target);
    assert.equal(readdirSync(join(root, 'prompts')).some((name) => name.includes('.architect-skills-backup-')), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('sync rejects a symbolic-link ancestor before staging any files', () => {
  const root = mkdtempSync(join(REAL_TMPDIR, 'architect-symlink-sync-'));
  try {
    const real = join(root, 'real');
    mkdirSync(join(real, 'prompts'), { recursive: true });
    const linked = join(root, 'linked');
    symlinkSync(real, linked, 'dir');
    const target = join(linked, 'prompts', 'skills');
    assert.throws(
      () => syncArchitectRelease({ target, artifacts: artifacts() }),
      /symbolic-link ancestor/,
    );
    assert.equal(existsSync(target), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

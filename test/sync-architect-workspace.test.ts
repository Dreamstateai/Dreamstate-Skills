import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  activeCaseCounts,
  assertNoCaseLoss,
  authoredCaseCounts,
  projectSocialEvalOverlay,
  restoreSocialEvalOverlay,
} from '../scripts/sync-architect-workspace.js';

function evals(skillId: string, count: number): string {
  return `${JSON.stringify({
    schema_version: 1,
    skill_id: skillId,
    cases: Array.from({ length: count }, (_, index) => ({ id: `${skillId}-${index}` })),
  }, null, 2)}\n`;
}

test('cross-worktree case guard rejects per-skill loss even when the total stays level', () => {
  assert.throws(
    () => assertNoCaseLoss('before', { social: 4, context: 2 }, 'after', { social: 3, context: 3 }),
    /social: 4 -> 3/,
  );
});

test('case census reads authored packages and active Social overlay projection', () => {
  const root = mkdtempSync(join(tmpdir(), 'architect-workspace-counts-'));
  try {
    mkdirSync(join(root, 'source', 'architect-kernels', 'social'), { recursive: true });
    writeFileSync(join(root, 'source', 'architect-kernels', 'social', 'evals.json'), evals('social', 2));
    assert.deepEqual(authoredCaseCounts(join(root, 'source')), { social: 2 });

    const skills = join(root, 'skills');
    mkdirSync(join(skills, 'social'), { recursive: true });
    mkdirSync(join(skills, '_social_runtime', 'social'), { recursive: true });
    writeFileSync(join(skills, 'social', 'evals.json'), evals('social', 1));
    writeFileSync(join(skills, '_social_runtime', 'social', 'evals.json'), evals('social', 2));
    assert.deepEqual(activeCaseCounts(skills), { social: 2 });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('Social projection copies authored eval bytes while preserving and restoring runtime adapters', () => {
  const root = mkdtempSync(join(tmpdir(), 'architect-social-projection-'));
  try {
    const socialRoot = join(root, 'social-source');
    const skillsRoot = join(root, 'skills');
    const runtimeRoot = join(skillsRoot, '_social_runtime');
    mkdirSync(runtimeRoot, { recursive: true });
    writeFileSync(join(runtimeRoot, 'SOCIAL_SKILLS.json'), '{"old":true}\n');
    for (const skillId of ['social', 'social.linkedin', 'social.reddit', 'social.x']) {
      mkdirSync(join(socialRoot, 'generated', 'architect', skillId), { recursive: true });
      mkdirSync(join(runtimeRoot, skillId), { recursive: true });
      const source = JSON.parse(evals(skillId, 2));
      const runtime = JSON.parse(evals(skillId, 2));
      if (skillId === 'social') {
        source.cases[0].id = 'cross-platform-publishing-needs-approval';
        source.cases[0].adversarial = true;
        runtime.cases[0].id = 'cross-platform-publishing-needs-approval';
        runtime.cases[0].expected_workspace_outcome = [{ check: 'durable', expected: 'present' }];
      }
      writeFileSync(
        join(socialRoot, 'generated', 'architect', skillId, 'evals.json'),
        `${JSON.stringify(source, null, 2)}\n`,
      );
      writeFileSync(
        join(runtimeRoot, skillId, 'evals.json'),
        `${JSON.stringify(runtime, null, 2)}\n`,
      );
      writeFileSync(join(runtimeRoot, skillId, 'KERNEL.md'), `${skillId} runtime kernel\n`);
      writeFileSync(join(runtimeRoot, skillId, 'SKILL.md'), `${skillId} runtime adapter\n`);
    }

    const snapshot = projectSocialEvalOverlay(socialRoot, skillsRoot);
    for (const skillId of ['social', 'social.linkedin', 'social.reddit', 'social.x']) {
      const projected = JSON.parse(readFileSync(join(runtimeRoot, skillId, 'evals.json'), 'utf8'));
      if (skillId === 'social') {
        assert.equal(projected.cases[0].adversarial, true);
        assert.deepEqual(
          projected.cases[0].expected_workspace_outcome,
          [{ check: 'durable', expected: 'present' }],
        );
      }
      assert.equal(readFileSync(join(runtimeRoot, skillId, 'KERNEL.md'), 'utf8'), `${skillId} runtime kernel\n`);
      assert.equal(readFileSync(join(runtimeRoot, skillId, 'SKILL.md'), 'utf8'), `${skillId} runtime adapter\n`);
    }

    restoreSocialEvalOverlay(snapshot);
    assert.equal(readFileSync(join(runtimeRoot, 'SOCIAL_SKILLS.json'), 'utf8'), '{"old":true}\n');
    for (const skillId of ['social', 'social.linkedin', 'social.reddit', 'social.x']) {
      const restored = JSON.parse(readFileSync(join(runtimeRoot, skillId, 'evals.json'), 'utf8'));
      if (skillId === 'social') {
        assert.equal(restored.cases[0].adversarial, undefined);
        assert.deepEqual(
          restored.cases[0].expected_workspace_outcome,
          [{ check: 'durable', expected: 'present' }],
        );
      }
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

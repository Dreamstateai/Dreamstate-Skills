import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  activeCaseCounts,
  assertNoCaseLoss,
  authoredCaseCounts,
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

import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { copySkillPackage } from '../src/skill-copy.js';

test('copies a complete nested skill package', () => {
  const root = mkdtempSync(join(tmpdir(), 'dreamstate-skill-copy-'));
  try {
    const source = join(root, 'source');
    const destination = join(root, 'installed');
    for (const directory of ['', 'references', 'examples', 'evals']) mkdirSync(join(source, directory), { recursive: true });
    writeFileSync(join(source, 'SKILL.md'), '# Skill\n');
    writeFileSync(join(source, 'references', 'guide.md'), '# Guide\n');
    writeFileSync(join(source, 'examples', 'example.md'), '# Example\n');
    writeFileSync(join(source, 'evals', 'contract.json'), '{}\n');
    copySkillPackage(source, destination);
    assert.equal(readFileSync(join(destination, 'SKILL.md'), 'utf8'), '# Skill\n');
    assert.equal(readFileSync(join(destination, 'references', 'guide.md'), 'utf8'), '# Guide\n');
    assert.equal(readFileSync(join(destination, 'examples', 'example.md'), 'utf8'), '# Example\n');
    assert.equal(readFileSync(join(destination, 'evals', 'contract.json'), 'utf8'), '{}\n');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

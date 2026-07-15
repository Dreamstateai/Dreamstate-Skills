#!/usr/bin/env -S npx tsx
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OWNED_GENERATED_PATHS = ['skills', 'dist', 'generated', 'skills-index.json'];

export function generatedTreeDrift(root = ROOT): string[] {
  const resolvedRoot = resolve(root);
  const result = spawnSync(
    'git',
    ['-C', resolvedRoot, 'status', '--porcelain=v1', '--untracked-files=all', '--', ...OWNED_GENERATED_PATHS],
    { encoding: 'utf8' },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git status failed with exit code ${result.status}`);
  }
  return result.stdout.split('\n').filter(Boolean);
}

export function verifyGeneratedTreeClean(root = ROOT): void {
  const drift = generatedTreeDrift(root);
  if (drift.length > 0) {
    throw new Error(`generated artifact tree is dirty:\n${drift.join('\n')}`);
  }
}

function isMain(): boolean {
  return Boolean(process.argv[1]) && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
}

if (isMain()) {
  try {
    verifyGeneratedTreeClean(process.argv[2] || ROOT);
    console.log('Generated artifact tree is clean.');
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
}

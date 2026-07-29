#!/usr/bin/env -S npx tsx
import { randomUUID } from 'node:crypto';
import {
  closeSync,
  existsSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, isAbsolute, join, parse, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PREFIX = 'generated/architect/';
const PACKAGE_FILES = ['KERNEL.md', 'SKILL.md', 'evals.json'] as const;
const PINNED_FILE = 'PINNED_RELEASE.json';
const SKILL_ID = /^[a-z0-9]+(?:(?:-|\.)[a-z0-9]+)*$/;

export interface SyncArchitectHooks {
  /** Test seam proving a partial stage write cannot mutate the live target. */
  afterStageFile?(relative: string, index: number): void;
  /** Test seam proving backup-rename failures restore the old target. */
  afterBackupRename?(): void;
}

export interface SyncArchitectOptions {
  target: string;
  artifacts?: Record<string, string>;
  hooks?: SyncArchitectHooks;
}

function assertNoSymlinkAncestors(path: string, label: string): void {
  const absolute = resolve(path);
  const root = parse(absolute).root;
  let cursor = root;
  for (const part of absolute.slice(root.length).split(sep).filter(Boolean)) {
    cursor = join(cursor, part);
    if (!existsSync(cursor)) continue;
    if (lstatSync(cursor).isSymbolicLink()) {
      throw new Error(`${label} must not contain a symbolic-link ancestor: ${cursor}`);
    }
  }
}

function fsyncPath(path: string, flags: string): void {
  const fd = openSync(path, flags);
  try {
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
}

function writeDurable(path: string, content: string | Buffer): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  fsyncPath(path, 'r');
}

function syncDirectories(root: string): void {
  const directories: string[] = [root];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.isDirectory()) directories.push(join(root, entry.name));
  }
  for (const directory of directories.reverse()) fsyncPath(directory, 'r');
}

function generatedRelease(artifacts: Record<string, string>) {
  const files = new Map(
    Object.entries(artifacts)
      .filter(([relative]) => relative.startsWith(PREFIX))
      .map(([relative, content]) => [relative.slice(PREFIX.length), content]),
  );
  const pinnedRaw = files.get(PINNED_FILE) ?? '{}';
  const pinned = JSON.parse(pinnedRaw) as { skills?: Record<string, unknown> };
  const skillIds = Object.keys(pinned.skills ?? {}).sort();
  if (!skillIds.length) throw new Error('generated Architect release is empty');
  if (skillIds.some((skillId) => !SKILL_ID.test(skillId))) {
    throw new Error('generated Architect release contains an invalid skill id');
  }
  const expected = new Set([PINNED_FILE, ...skillIds.flatMap((id) => PACKAGE_FILES.map((file) => `${id}/${file}`))]);
  if (files.size !== expected.size || [...files.keys()].some((relative) => !expected.has(relative))) {
    throw new Error('generated Architect release file set drifted');
  }
  return { files, skillIds };
}

function priorOwnedIds(target: string): Set<string> {
  const pinnedPath = join(target, PINNED_FILE);
  if (!existsSync(pinnedPath)) return new Set();
  const pinnedStat = lstatSync(pinnedPath);
  if (pinnedStat.isSymbolicLink() || !pinnedStat.isFile()) {
    throw new Error(`${PINNED_FILE}: existing target entry must be a regular file`);
  }
  const pinned = JSON.parse(readFileSync(pinnedPath, 'utf8')) as { skills?: Record<string, unknown> };
  return new Set(Object.keys(pinned.skills ?? {}));
}

function assertSafeTarget(target: string): void {
  assertNoSymlinkAncestors(target, 'Architect sync target');
  if (!existsSync(target)) return;
  const stat = lstatSync(target);
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    throw new Error('Architect sync target must be a regular directory');
  }
  const ownedIds = priorOwnedIds(target);
  for (const entry of readdirSync(target, { withFileTypes: true })) {
    const path = join(target, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`${entry.name}: sync target entries must not be symbolic links`);
    if (entry.isFile()) {
      if (![PINNED_FILE, 'README.md'].includes(entry.name)) {
        throw new Error(`${entry.name}: unrecognized file blocks exact Architect synchronization`);
      }
      continue;
    }
    if (!entry.isDirectory() || !SKILL_ID.test(entry.name) || !ownedIds.has(entry.name)) {
      throw new Error(`${entry.name}: refusing to replace an unowned target directory`);
    }
    const nested = readdirSync(path, { withFileTypes: true });
    if (
      JSON.stringify(nested.map((item) => item.name).sort()) !== JSON.stringify([...PACKAGE_FILES].sort())
      || nested.some((item) => !item.isFile() || item.isSymbolicLink())
    ) {
      throw new Error(`${entry.name}: existing package entries must be exact regular files`);
    }
  }
}

function assertExactRelease(
  target: string,
  release: ReturnType<typeof generatedRelease>,
  preserveReadme: boolean,
): void {
  assertNoSymlinkAncestors(target, 'Architect release');
  const expectedRoot = [PINNED_FILE, ...release.skillIds, ...(preserveReadme ? ['README.md'] : [])].sort();
  if (JSON.stringify(readdirSync(target).sort()) !== JSON.stringify(expectedRoot)) {
    throw new Error('Architect synchronized root file set drifted');
  }
  for (const [relative, expected] of release.files) {
    const path = join(target, relative);
    const stat = lstatSync(path);
    if (stat.isSymbolicLink() || !stat.isFile()) {
      throw new Error(`${relative}: synchronized package entry must be a regular file`);
    }
    if (!readFileSync(path).equals(Buffer.from(expected))) {
      throw new Error(`${relative}: synchronized bytes drifted`);
    }
  }
}

function stageRelease(
  target: string,
  release: ReturnType<typeof generatedRelease>,
  hooks?: SyncArchitectHooks,
): { stage: string; preserveReadme: boolean } {
  const parent = dirname(target);
  mkdirSync(parent, { recursive: true });
  assertNoSymlinkAncestors(parent, 'Architect sync parent');
  const stage = join(parent, `.architect-skills-stage-${randomUUID()}`);
  mkdirSync(stage);
  try {
    let index = 0;
    for (const [relative, content] of release.files) {
      writeDurable(join(stage, relative), content);
      index += 1;
      hooks?.afterStageFile?.(relative, index);
    }
    const readme = join(target, 'README.md');
    const preserveReadme = existsSync(readme);
    if (preserveReadme) {
      const stat = lstatSync(readme);
      if (stat.isSymbolicLink() || !stat.isFile()) throw new Error('README.md must be a regular file');
      writeDurable(join(stage, 'README.md'), readFileSync(readme));
    }
    assertExactRelease(stage, release, preserveReadme);
    syncDirectories(stage);
    fsyncPath(parent, 'r');
    return { stage, preserveReadme };
  } catch (error) {
    rmSync(stage, { recursive: true, force: true });
    throw error;
  }
}

function atomicReplace(target: string, stage: string, hooks?: SyncArchitectHooks): void {
  const parent = dirname(target);
  const backup = join(parent, `.architect-skills-backup-${randomUUID()}`);
  const hadTarget = existsSync(target);
  let backupExists = false;
  try {
    if (hadTarget) {
      renameSync(target, backup);
      backupExists = true;
      fsyncPath(parent, 'r');
      hooks?.afterBackupRename?.();
    }
    renameSync(stage, target);
    fsyncPath(parent, 'r');
  } catch (error) {
    if (existsSync(target)) rmSync(target, { recursive: true, force: true });
    if (backupExists && existsSync(backup)) {
      renameSync(backup, target);
      backupExists = false;
      fsyncPath(parent, 'r');
    }
    throw error;
  } finally {
    if (existsSync(stage)) rmSync(stage, { recursive: true, force: true });
  }
  if (backupExists && existsSync(backup)) {
    rmSync(backup, { recursive: true, force: true });
    fsyncPath(parent, 'r');
  }
}

export function syncArchitectRelease(options: SyncArchitectOptions): number {
  if (!isAbsolute(options.target)) throw new Error('Architect sync target must be absolute');
  const target = resolve(options.target);
  if (basename(target) !== 'skills' || basename(dirname(target)) !== 'prompts') {
    throw new Error('Architect sync target must be an absolute .../prompts/skills directory');
  }
  assertSafeTarget(target);
  const release = generatedRelease(options.artifacts ?? build());
  const { stage, preserveReadme } = stageRelease(target, release, options.hooks);
  atomicReplace(target, stage, options.hooks);
  assertExactRelease(target, release, preserveReadme);
  return release.skillIds.length;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === resolve(fileURLToPath(import.meta.url))) {
  const rawTarget = process.argv[2];
  if (!rawTarget) throw new Error('usage: npm run sync:architect -- /absolute/path/to/prompts/skills');
  const count = syncArchitectRelease({ target: rawTarget });
  console.log(`Synchronized ${count} pinned Architect packages to ${resolve(rawTarget)}.`);
}

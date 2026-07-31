#!/usr/bin/env -S npx tsx
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type CaseCounts = Record<string, number>;

interface WorkspaceOptions {
  influenceRoot: string;
  socialRoot: string;
}

function run(command: string, args: string[], cwd: string): string {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();
}

function evalCount(path: string): number {
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as { cases?: unknown };
  if (!Array.isArray(parsed.cases)) throw new Error(`${path}: cases must be an array`);
  return parsed.cases.length;
}

export function authoredCaseCounts(root: string): CaseCounts {
  const kernels = join(resolve(root), 'architect-kernels');
  if (!existsSync(kernels)) throw new Error(`${kernels}: Architect source tree is missing`);
  return Object.fromEntries(readdirSync(kernels, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(kernels, entry.name, 'evals.json')))
    .map((entry) => [entry.name, evalCount(join(kernels, entry.name, 'evals.json'))])
    .sort(([left], [right]) => left.localeCompare(right)));
}

export function activeCaseCounts(skillsRoot: string): CaseCounts {
  const root = resolve(skillsRoot);
  const overlay = join(root, '_social_runtime');
  const packageIds = new Set(readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => entry.name));
  if (existsSync(overlay)) {
    for (const entry of readdirSync(overlay, { withFileTypes: true })) {
      if (entry.isDirectory()) packageIds.add(entry.name);
    }
  }
  return Object.fromEntries([...packageIds].sort().map((skillId) => {
    const overlayPath = join(overlay, skillId, 'evals.json');
    const basePath = join(root, skillId, 'evals.json');
    const path = existsSync(overlayPath) ? overlayPath : basePath;
    if (!existsSync(path)) throw new Error(`${skillId}: active eval package is missing`);
    return [skillId, evalCount(path)];
  }));
}

export function assertNoCaseLoss(
  baselineLabel: string,
  baseline: CaseCounts,
  candidateLabel: string,
  candidate: CaseCounts,
): void {
  const losses = Object.entries(baseline).flatMap(([skillId, count]) => {
    const next = candidate[skillId];
    return next === undefined || next < count
      ? [`${skillId}: ${count} -> ${next ?? 'missing'}`]
      : [];
  });
  if (losses.length) {
    throw new Error(
      `${candidateLabel} would lose eval cases relative to ${baselineLabel}: ${losses.join(', ')}`,
    );
  }
}

function total(counts: CaseCounts): number {
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
}

function parseArgs(argv: string[]): WorkspaceOptions {
  const usage = 'usage: npm run sync:architect-workspace -- --influence /absolute/influence '
    + '--social /absolute/ds-lanes/e-social';
  const value = (flag: string): string => {
    const index = argv.indexOf(flag);
    if (index < 0 || !argv[index + 1]) throw new Error(usage);
    return argv[index + 1];
  };
  const influenceRoot = value('--influence');
  const socialRoot = value('--social');
  if (!isAbsolute(influenceRoot) || !isAbsolute(socialRoot) || argv.length !== 4) {
    throw new Error(usage);
  }
  return { influenceRoot: resolve(influenceRoot), socialRoot: resolve(socialRoot) };
}

export function syncArchitectWorkspace(options: WorkspaceOptions): void {
  const sourceRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const backendRoot = join(options.influenceRoot, 'apps', 'backend');
  const skillsRoot = join(
    options.influenceRoot,
    'ai backend',
    'ai',
    'app',
    'orchestration',
    'command_center',
    'prompts',
    'skills',
  );
  if (!existsSync(join(backendRoot, 'package.json')) || !existsSync(skillsRoot)) {
    throw new Error('Influence root does not contain the backend and installed Architect skills');
  }
  const socialStatus = run('git', ['status', '--porcelain'], options.socialRoot);
  if (socialStatus) {
    throw new Error(`Social source worktree has unowned changes:\n${socialStatus}`);
  }

  const authoredBefore = authoredCaseCounts(sourceRoot);
  const socialBaseline = authoredCaseCounts(options.socialRoot);
  const activeBefore = activeCaseCounts(skillsRoot);
  assertNoCaseLoss('Social source lane', socialBaseline, 'authored source', authoredBefore);
  assertNoCaseLoss('installed active release', activeBefore, 'authored source', authoredBefore);

  const temporary = mkdtempSync(join(tmpdir(), 'architect-capabilities-'));
  const capabilityPath = join(temporary, 'capabilities.json');
  try {
    run('npx', ['tsx', 'src/scripts/exportSkillCapabilityManifest.ts', capabilityPath], backendRoot);
    run('npm', ['run', 'sync:capabilities', '--', capabilityPath], sourceRoot);
    run('npm', ['run', 'build'], sourceRoot);
    run('npx', [
      'tsx',
      'src/scripts/syncArchitectSkills.ts',
      '--write',
      '--source',
      join(sourceRoot, 'generated', 'architect'),
    ], backendRoot);
    run('npx', [
      'tsx',
      'src/scripts/syncArchitectSkills.ts',
      '--check',
      '--source',
      join(sourceRoot, 'generated', 'architect'),
    ], backendRoot);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }

  const authoredAfter = authoredCaseCounts(sourceRoot);
  const activeAfter = activeCaseCounts(skillsRoot);
  assertNoCaseLoss('authored source before sync', authoredBefore, 'authored source after sync', authoredAfter);
  assertNoCaseLoss('installed active release before sync', activeBefore, 'installed active release after sync', activeAfter);
  assertNoCaseLoss('authored source', authoredAfter, 'installed active release', activeAfter);
  assertNoCaseLoss('installed active release', activeAfter, 'authored source', authoredAfter);
  console.log(
    `Architect workspace synchronized without case loss: authored ${total(authoredBefore)} -> `
      + `${total(authoredAfter)}, active ${total(activeBefore)} -> ${total(activeAfter)}.`,
  );
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === resolve(fileURLToPath(import.meta.url))) {
  syncArchitectWorkspace(parseArgs(process.argv.slice(2)));
}

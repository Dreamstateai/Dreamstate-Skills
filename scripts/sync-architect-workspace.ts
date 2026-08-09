#!/usr/bin/env -S npx tsx
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type CaseCounts = Record<string, number>;

interface WorkspaceOptions {
  influenceRoot: string;
  socialRoot: string;
}

const SOCIAL_SKILL_IDS = ['social', 'social.linkedin', 'social.reddit', 'social.x'] as const;
const SOCIAL_RUNTIME_MANIFEST = 'SOCIAL_SKILLS.json';
const SOCIAL_RUNTIME_CASE_FIELD_OVERRIDES: Record<string, readonly string[]> = {
  'cross-platform-social-research-table': ['required_capability_ids', 'required_executed_capability_ids'],
  'cross-platform-publishing-needs-approval': [
    'adversarial', 'required_capability_ids', 'required_concepts', 'required_executed_capability_ids',
  ],
  'linkedin-and-x-authoring-loads-both-specialists': [
    'required_capability_ids', 'required_executed_capability_ids',
  ],
  'linkedin-connected-research': [
    'request', 'required_capability_ids', 'required_concepts', 'required_executed_capability_ids',
  ],
  'linkedin-disconnected-stays-truthful': [
    'adversarial', 'must_not', 'request', 'required_capability_ids', 'required_concepts',
    'required_executed_capability_ids',
  ],
  'linkedin-authored-post-ends-with-cta': [
    'adversarial', 'follow_up_turns', 'required_capability_ids', 'required_executed_capability_ids',
  ],
  'reddit-real-thread-opportunities': [
    'required_capability_ids', 'required_concepts', 'required_executed_capability_ids',
  ],
  'reddit-authored-post-distinction': [
    'adversarial', 'follow_up_turns', 'required_capability_ids', 'required_concepts',
    'required_executed_capability_ids',
  ],
  'x-recent-search-window': [
    'required_capability_ids', 'required_concepts', 'required_executed_capability_ids',
  ],
  'x-full-archive-entitlement': [
    'adversarial', 'must_not', 'request', 'required_capability_ids', 'required_concepts',
    'required_executed_capability_ids',
  ],
  'x-authored-post-respects-length-limit': [
    'adversarial', 'follow_up_turns', 'required_capability_ids', 'required_concepts',
    'required_executed_capability_ids',
  ],
};

export interface SocialEvalOverlaySnapshot {
  files: Map<string, Buffer>;
}

export interface ArchitectToolContractSnapshot {
  path: string;
  bytes: Buffer;
}

function regularFile(path: string, label: string): void {
  if (!existsSync(path)) throw new Error(`${label} is missing: ${path}`);
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`${label} must be a regular file`);
}

/**
 * Project authored Social eval fields into the active runtime overlay.
 * The overlay's KERNEL/SKILL adapters are Influence-owned and must survive.
 * Integrated durable-outcome fields are also preserved when the Social lane
 * does not own them; syncArchitectSkills performs the final allowlisted
 * three-way provenance check.
 * The returned byte snapshot lets the orchestrator roll back if the later
 * signed-release synchronization fails.
 */
export function projectSocialEvalOverlay(
  socialRoot: string,
  skillsRoot: string,
): SocialEvalOverlaySnapshot {
  const source = resolve(socialRoot);
  const runtimeRoot = join(resolve(skillsRoot), '_social_runtime');
  const targets = [
    join(runtimeRoot, SOCIAL_RUNTIME_MANIFEST),
    ...SOCIAL_SKILL_IDS.map((skillId) => join(runtimeRoot, skillId, 'evals.json')),
  ];
  const snapshot = new Map<string, Buffer>();
  for (const target of targets) {
    regularFile(target, 'Social runtime overlay file');
    snapshot.set(target, readFileSync(target));
  }
  for (const skillId of SOCIAL_SKILL_IDS) {
    const sourcePath = join(source, 'generated', 'architect', skillId, 'evals.json');
    regularFile(sourcePath, `${skillId} authored Social evals`);
    const sourceDocument = JSON.parse(readFileSync(sourcePath, 'utf8')) as {
      schema_version?: unknown;
      skill_id?: unknown;
      cases?: Array<Record<string, unknown>>;
    };
    if (sourceDocument.schema_version !== 1 || sourceDocument.skill_id !== skillId || !Array.isArray(sourceDocument.cases)) {
      throw new Error(`${skillId} authored Social eval contract is invalid`);
    }
    const targetPath = join(runtimeRoot, skillId, 'evals.json');
    const runtimeDocument = JSON.parse(readFileSync(targetPath, 'utf8')) as {
      schema_version?: unknown;
      skill_id?: unknown;
      cases?: Array<Record<string, unknown>>;
    };
    if (runtimeDocument.schema_version !== 1 || runtimeDocument.skill_id !== skillId || !Array.isArray(runtimeDocument.cases)) {
      throw new Error(`${skillId} Social runtime eval contract is invalid`);
    }
    const sourceById = new Map(sourceDocument.cases.map((item) => [item.id, item]));
    const runtimeById = new Map(runtimeDocument.cases.map((item) => [item.id, item]));
    const sourceIds = sourceDocument.cases.map((item) => item.id);
    const runtimeIds = runtimeDocument.cases.map((item) => item.id);
    if (
      sourceIds.some((id) => typeof id !== 'string')
      || runtimeIds.some((id) => typeof id !== 'string')
      || new Set(sourceIds).size !== sourceIds.length
      || new Set(runtimeIds).size !== runtimeIds.length
      || sourceIds.length > runtimeIds.length
      || sourceIds.some((id) => !runtimeById.has(id))
    ) {
      throw new Error(`${skillId} Social eval case IDs differ between authored source and runtime overlay`);
    }
    const projected = {
      ...runtimeDocument,
      schema_version: 1,
      skill_id: skillId,
      cases: runtimeDocument.cases.map((runtimeCase) => {
        const sourceCase = sourceById.get(runtimeCase.id);
        const overrides = SOCIAL_RUNTIME_CASE_FIELD_OVERRIDES[String(runtimeCase.id)] ?? [];
        if (!sourceCase || overrides.length === 0) return runtimeCase;
        const merged = { ...runtimeCase };
        for (const key of overrides) {
          if (Object.hasOwn(sourceCase, key)) merged[key] = sourceCase[key];
          else delete merged[key];
        }
        return merged;
      }),
    };
    writeFileSync(targetPath, `${JSON.stringify(projected, null, 2)}\n`);
  }
  return { files: snapshot };
}

export function restoreSocialEvalOverlay(snapshot: SocialEvalOverlaySnapshot): void {
  for (const [path, bytes] of snapshot.files) writeFileSync(path, bytes);
}

export function projectArchitectToolContract(
  influenceRoot: string,
  sourceRoot: string,
): ArchitectToolContractSnapshot {
  const sourcePath = join(
    resolve(influenceRoot),
    'apps',
    'backend',
    'src',
    'generated',
    'architectToolContract.json',
  );
  const targetPath = join(resolve(sourceRoot), 'contracts', 'architect-tool-contract.json');
  regularFile(sourcePath, 'canonical Influence Architect tool contract');
  regularFile(targetPath, 'Dreamstate Architect tool contract');
  const snapshot = { path: targetPath, bytes: readFileSync(targetPath) };
  writeFileSync(targetPath, readFileSync(sourcePath));
  return snapshot;
}

export function restoreArchitectToolContract(snapshot: ArchitectToolContractSnapshot): void {
  writeFileSync(snapshot.path, snapshot.bytes);
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
  let overlaySnapshot: SocialEvalOverlaySnapshot | null = null;
  let toolContractSnapshot: ArchitectToolContractSnapshot | null = null;
  let synchronized = false;
  try {
    run('npm', ['run', 'codegen:architect-tools'], backendRoot);
    run('npm', ['run', 'codegen:architect-tools:check'], backendRoot);
    toolContractSnapshot = projectArchitectToolContract(options.influenceRoot, sourceRoot);
    overlaySnapshot = projectSocialEvalOverlay(options.socialRoot, skillsRoot);
    run('npx', [
      'tsx',
      'src/scripts/socialSkillRuntime.ts',
      '--write',
      join(skillsRoot, '_social_runtime'),
    ], backendRoot);
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
    synchronized = true;
  } finally {
    if (!synchronized) {
      if (overlaySnapshot) restoreSocialEvalOverlay(overlaySnapshot);
      if (toolContractSnapshot) restoreArchitectToolContract(toolContractSnapshot);
    }
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

#!/usr/bin/env node
// npx dreamstate-skills install [slug] [--client <client>|--claude|--cursor|--codex]
//
// Writes the Dreamstate MCP connection for the chosen agent and copies the
// skills onto disk. It never asks for or stores an API key — sign-in happens in
// the agent over OAuth on the first tool call. Re-running is safe (idempotent
// merge, skills overwritten in place).

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { printBanner, printConnectedFooter } from './banner.js';
import { clients, type ClientConfig } from './config-writers.js';
import { copySkillPackage } from './skill-copy.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const INDEX_PATH = join(ROOT, 'skills-index.json');
const CLIENT_ADAPTER_RELEASE_PATH = join(ROOT, 'generated', 'client-adapters', 'RELEASE.json');

interface IndexedSkill {
  slug: string;
  domain?: string;
  capability_domains?: string[];
  path: string;
  name?: string;
  short_description?: string;
  description?: string;
  execution_mode?: string;
  maturity?: string;
  supported_clients?: string[];
  required_scopes?: string[];
  github_path?: string;
  install_command?: string;
}

interface ParsedArgs {
  cmd: string;
  agent: string | null;
  slug: string | null;
  subcommand: string | null;
  bundle: string | null;
}

const GOVERNED_ADAPTER_CLIENTS = new Set(['claude', 'codex']);
const SAFE_GENERIC_EXECUTION_MODES = new Set(['knowledge', 'planned']);
const UNSAFE_GENERIC_EXECUTION_MODES = new Set(['executable', 'guided-execution']);
const RETIRED_GOVERNED_ADAPTER_SLUGS = ['outreach', 'seo-geo'] as const;

function parseArgs(argv: string[]): ParsedArgs {
  const raw = argv.slice(2);
  const positionals: string[] = [];
  for (let index = 0; index < raw.length; index += 1) {
    const value = raw[index];
    if (value === '--client' || value === '--bundle') { index += 1; continue; }
    if (!value.startsWith('-')) positionals.push(value);
  }
  const cmd = positionals[0] || 'install';
  const subcommand = ['skills'].includes(cmd) ? (positionals[1] || 'install') : null;
  const slug = cmd === 'skills' ? (positionals[2] || null) : (positionals[1] || null); // optional: install just one skill
  let agent: string | null = null;
  let bundle: string | null = null;
  for (const a of argv.slice(2)) {
    const m = a.match(/^--(claude|cursor|codex)$/);
    if (m) agent = m[1];
    if (a.startsWith('--client=')) agent = a.slice('--client='.length);
    if (a.startsWith('--bundle=')) bundle = a.slice('--bundle='.length);
  }
  const clientIndex = argv.indexOf('--client');
  if (clientIndex >= 0 && argv[clientIndex + 1]) agent = argv[clientIndex + 1];
  const bundleIndex = argv.indexOf('--bundle');
  if (bundleIndex >= 0 && argv[bundleIndex + 1]) bundle = argv[bundleIndex + 1];
  return { cmd, agent, slug, subcommand, bundle };
}

function loadSkills(): IndexedSkill[] {
  if (!existsSync(INDEX_PATH)) throw new Error('skills-index.json is missing. Run `npm run build` first (maintainers) or reinstall the package.');
  const index = JSON.parse(readFileSync(INDEX_PATH, 'utf8')) as { skills?: IndexedSkill[] };
  if (!Array.isArray(index.skills)) throw new Error('skills-index.json has no skills array');
  return index.skills;
}

function loadClientAdapterSkills(agent: string): IndexedSkill[] {
  if (agent !== 'claude' && agent !== 'codex') return [];
  if (!existsSync(CLIENT_ADAPTER_RELEASE_PATH)) {
    throw new Error('generated client adapter release is missing. Run `npm run build` first (maintainers) or reinstall the package.');
  }
  const release = JSON.parse(readFileSync(CLIENT_ADAPTER_RELEASE_PATH, 'utf8')) as {
    skills?: Record<string, { capability_domains?: unknown }>;
  };
  if (!release.skills || typeof release.skills !== 'object' || Array.isArray(release.skills)) {
    throw new Error('generated client adapter release has no skills map');
  }
  return Object.entries(release.skills).sort(([left], [right]) => left.localeCompare(right)).map(([slug, skill]) => {
    const domains = skill.capability_domains;
    if (!Array.isArray(domains) || domains.some((domain) => typeof domain !== 'string')) {
      throw new Error(`generated client adapter ${slug} has invalid capability domains`);
    }
    const path = `generated/client-adapters/${agent}/${slug}`;
    for (const file of ['SKILL.md', 'KERNEL.md', 'evals.json']) {
      if (!existsSync(join(ROOT, path, file))) throw new Error(`generated client adapter ${slug} is missing ${file}`);
    }
    return {
      slug,
      domain: domains[0],
      capability_domains: domains,
      path,
      name: slug,
      execution_mode: 'governed-adapter',
    };
  });
}

function printSkills(skills: IndexedSkill[]): void {
  for (const skill of skills) {
    const mode = skill.execution_mode ? ` · ${skill.execution_mode}` : '';
    console.log(`${pc.bold(skill.slug)}${mode} — ${skill.short_description || skill.description || ''}`);
  }
}

function detectInstalled(reg: Record<string, ClientConfig>): string[] {
  // An agent is "present" if its config file or its parent dir exists.
  return Object.entries(reg)
    .filter(([, c]) => existsSync(c.configPath) || existsSync(dirname(c.configPath)))
    .map(([k]) => k);
}

async function main(): Promise<void> {
  const { cmd, agent: agentFlag, slug, subcommand, bundle } = parseArgs(process.argv);
  printBanner();

  let skills: IndexedSkill[];
  try { skills = loadSkills(); } catch (error) { console.error(pc.red(`  ${(error as Error).message}`)); process.exit(1); }
  // Keep the complete catalog as the cleanup authority. Bundle and slug
  // filtering must never hide an old direct-action package from a governed
  // Claude/Codex install or update.
  const allIndexedSkills = skills;

  if (cmd === 'skills' && subcommand === 'list') {
    printSkills(skills);
    return;
  }
  if (cmd === 'skills' && subcommand === 'info') {
    const skill = skills.find((entry) => entry.slug === slug);
    if (!skill) { console.error(pc.red(`  no skill named "${slug || ''}"`)); process.exit(1); }
    console.log(JSON.stringify(skill, null, 2));
    return;
  }
  if (cmd === 'skills' && subcommand === 'uninstall') {
    if (!slug) { console.error(pc.red('  usage: dreamstate skills uninstall <slug>')); process.exit(1); }
    const reg = clients();
    for (const client of Object.values(reg)) rmSync(join(client.skillsDir, slug), { recursive: true, force: true });
    console.log(`Removed ${slug} from installed skill directories.`);
    return;
  }
  if (cmd === 'skills' && subcommand === 'doctor') {
    console.log(`${pc.green('✓')} ${skills.length} skills loaded from catalog`);
    console.log(`${pc.green('✓')} capability contract is embedded in generated metadata`);
    return;
  }
  if (cmd === 'skills' && !['install', 'list', 'info', 'uninstall', 'doctor', 'update'].includes(subcommand || '')) {
    console.error(pc.red(`  unknown skills command "${subcommand}". Try: dreamstate skills list|info|install|update|uninstall|doctor`));
    process.exit(1);
  }
  // `update` is intentionally the same atomic merge/install operation as
  // install: the package is versioned, so updating means refreshing the
  // generated skill files while preserving unrelated client configuration.
  if (cmd !== 'install' && !(cmd === 'skills' && ['install', 'update'].includes(subcommand || ''))) {
    console.log(pc.dim(`  unknown command "${cmd}". Try: `) + pc.bold('dreamstate skills install') + '\n');
    process.exit(1);
  }
  if (bundle) {
    const domains: Record<string, string[]> = {
      developer: ['connect'],
      outbound: ['outreach'],
      content: ['social', 'seo'],
      seo: ['seo'],
      all: [],
    };
    const allowedDomains = domains[bundle];
    if (!allowedDomains) {
      console.error(pc.red(`  unknown bundle "${bundle}". Use developer|outbound|content|seo|all.`));
      process.exit(1);
    }
    if (allowedDomains.length > 0) skills = skills.filter((skill) => allowedDomains.includes((skill as IndexedSkill & { domain?: string }).domain ?? ''));
  }

  const reg = clients();
  let agent = agentFlag;

  if (!agent) {
    const installed = detectInstalled(reg);
    const options = Object.entries(reg).map(([k, c]) => ({
      value: k,
      label: c.label + (installed.includes(k) ? pc.dim('  (detected)') : ''),
    }));
    const picked = await p.select({
      message: 'Which agent should I connect to Dreamstate?',
      options,
      initialValue: installed[0] || 'claude',
    });
    if (p.isCancel(picked)) {
      p.cancel('Cancelled.');
      process.exit(0);
    }
    agent = picked as string;
  }

  const client = reg[agent];
  if (!client) {
    console.error(pc.red(`  unknown agent "${agent}". Use --claude, --cursor, or --codex.`));
    process.exit(1);
  }

  const governedClient = GOVERNED_ADAPTER_CLIENTS.has(agent);
  const unsafeGenericSlugs = governedClient
    ? allIndexedSkills
      .filter((skill) => UNSAFE_GENERIC_EXECUTION_MODES.has(skill.execution_mode ?? ''))
      .map((skill) => skill.slug)
    : [];
  const unsafeRequestedGeneric = slug && governedClient
    ? allIndexedSkills.find((skill) => (
      skill.slug === slug && UNSAFE_GENERIC_EXECUTION_MODES.has(skill.execution_mode ?? '')
    ))
    : undefined;

  // Safety cleanup is the first governed-client mutation. It deliberately runs
  // before adapter validation, request refusal, MCP config writes, and copying,
  // so even a failed/refused governed invocation cannot leave known generic
  // executable or guided packages active. Unrelated custom skills are untouched.
  if (governedClient) {
    try {
      mkdirSync(client.skillsDir, { recursive: true });
      for (const unsafeSlug of unsafeGenericSlugs) {
        rmSync(join(client.skillsDir, unsafeSlug), { recursive: true, force: true });
      }
      for (const retiredSlug of RETIRED_GOVERNED_ADAPTER_SLUGS) {
        rmSync(join(client.skillsDir, retiredSlug), { recursive: true, force: true });
      }
    } catch (error) {
      console.error(pc.red(`  failed to remove unsafe generic skills: ${(error as Error).message}`));
      process.exit(1);
    }
  }

  let adapterSkills: IndexedSkill[];
  try {
    adapterSkills = loadClientAdapterSkills(agent);
  } catch (error) {
    console.error(pc.red(`  ${(error as Error).message}`));
    process.exit(1);
  }
  if (governedClient) {
    skills = skills.filter((skill) => SAFE_GENERIC_EXECUTION_MODES.has(skill.execution_mode ?? ''));
  }
  if (slug) {
    skills = [...skills.filter((skill) => skill.slug === slug), ...adapterSkills.filter((skill) => skill.slug === slug)];
    if (skills.length === 0) {
      if (unsafeRequestedGeneric) {
        console.error(pc.red(`  skill "${slug}" is not available as a direct generic package for governed ${client.label} installs. Use a generated governed adapter instead.`));
        process.exit(1);
      }
      console.error(pc.red(`  no skill named "${slug}" for ${client.label}. Run \`npx dreamstate-skills install\` to install all.`));
      process.exit(1);
    }
  } else {
    if (bundle && bundle !== 'all') {
      const adapterSkillIds: Record<string, string[]> = {
        developer: [],
        outbound: ['workbooks', 'sourcing-enrichment', 'qualification', 'sequences', 'workflows'],
        content: ['research', 'seo', 'geo', 'writing', 'social', 'social.linkedin', 'social.reddit', 'social.x'],
        seo: ['research', 'seo', 'geo'],
      };
      const allowed = new Set(adapterSkillIds[bundle] ?? []);
      adapterSkills = adapterSkills.filter((skill) => allowed.has(skill.slug));
    }
    skills = [...skills, ...adapterSkills];
  }

  const s = p.spinner();

  // 1. Write the MCP connect config (merge, back up first).
  s.start(`Writing Dreamstate MCP config for ${client.label}`);
  try {
    const existing = existsSync(client.configPath) ? readFileSync(client.configPath, 'utf8') : null;
    if (existing) writeFileSync(client.configPath + '.dreamstate.bak', existing);
    const merged = client.merge(existing);
    mkdirSync(dirname(client.configPath), { recursive: true });
    writeFileSync(client.configPath, merged);
    s.stop(`MCP config written → ${pc.dim(client.configPath)}`);
  } catch (err) {
    s.stop(pc.red('Failed to write MCP config'));
    console.error('  ' + (err as Error).message);
    console.error(pc.dim('  Your original config was not changed.'));
    process.exit(1);
  }

  // 2. Copy the skills onto disk for this agent (flattened by slug, from the
  //    nested skills/<category>/<tier>/<slug> source the index points at).
  s.start(`Installing ${slug ? `skill ${slug}` : 'skills'} into ${client.label}`);
  let count = 0;
  try {
    mkdirSync(client.skillsDir, { recursive: true });
    for (const skill of skills) {
      const src = join(ROOT, skill.path);
      const dest = join(client.skillsDir, skill.slug);
      copySkillPackage(src, dest);
      count++;
    }
    s.stop(`Installed ${count} skill${count === 1 ? '' : 's'}`);
  } catch (err) {
    s.stop(pc.red('Failed to install skills'));
    console.error('  ' + (err as Error).message);
    process.exit(1);
  }

  printConnectedFooter({ skillCount: count, agent: client.label });
}

main().catch((err: unknown) => {
  console.error(pc.red('  install failed: ') + (err as Error).message);
  process.exit(1);
});

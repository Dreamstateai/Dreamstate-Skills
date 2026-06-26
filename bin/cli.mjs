#!/usr/bin/env node
// npx dreamstate install [--claude|--cursor|--codex]
//
// Writes the Dreamstate MCP connection for the chosen agent and copies the
// skills onto disk. It never asks for or stores an API key — sign-in happens in
// the agent over OAuth on the first tool call. Re-running is safe (idempotent
// merge, skills overwritten in place).

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { printBanner, printConnectedFooter } from '../src/banner.mjs';
import { clients } from '../src/config-writers.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const INDEX_PATH = join(ROOT, 'skills-index.json');

function parseArgs(argv) {
  const positionals = argv.slice(2).filter((a) => !a.startsWith('-'));
  const cmd = positionals[0] || 'install';
  const slug = positionals[1] || null; // optional: install just one skill
  let agent = null;
  for (const a of argv.slice(2)) {
    const m = a.match(/^--(claude|cursor|codex)$/);
    if (m) agent = m[1];
  }
  return { cmd, agent, slug };
}

function detectInstalled(reg) {
  // An agent is "present" if its config file or its parent dir exists.
  return Object.entries(reg)
    .filter(([, c]) => existsSync(c.configPath) || existsSync(dirname(c.configPath)))
    .map(([k]) => k);
}

async function main() {
  const { cmd, agent: agentFlag, slug } = parseArgs(process.argv);
  printBanner();

  if (cmd !== 'install') {
    console.log(pc.dim(`  unknown command "${cmd}". Try: `) + pc.bold('npx dreamstate install') + '\n');
    process.exit(1);
  }

  if (!existsSync(INDEX_PATH)) {
    console.error(pc.red('  skills-index.json is missing. Run `npm run build` first (maintainers) or reinstall the package.'));
    process.exit(1);
  }
  let skills = JSON.parse(readFileSync(INDEX_PATH, 'utf8')).skills;
  if (slug) {
    skills = skills.filter((s) => s.slug === slug);
    if (skills.length === 0) {
      console.error(pc.red(`  no skill named "${slug}". Run \`npx dreamstate install\` to install all.`));
      process.exit(1);
    }
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
    agent = picked;
  }

  const client = reg[agent];
  if (!client) {
    console.error(pc.red(`  unknown agent "${agent}". Use --claude, --cursor, or --codex.`));
    process.exit(1);
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
    console.error('  ' + err.message);
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
      mkdirSync(dest, { recursive: true });
      for (const f of readdirSync(src)) copyFileSync(join(src, f), join(dest, f));
      count++;
    }
    s.stop(`Installed ${count} skill${count === 1 ? '' : 's'}`);
  } catch (err) {
    s.stop(pc.red('Failed to install skills'));
    console.error('  ' + err.message);
    process.exit(1);
  }

  printConnectedFooter({ skillCount: count, agent: client.label });
}

main().catch((err) => {
  console.error(pc.red('  install failed: ') + err.message);
  process.exit(1);
});

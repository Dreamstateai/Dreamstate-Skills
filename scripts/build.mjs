#!/usr/bin/env node
// Single source of truth -> every delivery surface, in the goose-skills layout.
//
//   playbooks/*.md  (frontmatter + body)
//        │  build()
//   ┌────┴────────────────────────┬──────────────────┬──────────────────┐
//   ▼                             ▼                  ▼                  ▼
// skills/<cat>/<tier>/<n>/        skills-index.json  dist/mcp-prompts   dist/...generated.ts
//   SKILL.md + skill.meta.json    (root catalog)     .json (server)     (backend vendor)
//
// `node scripts/build.mjs`         writes the generated tree.
// `node scripts/build.mjs --check` rebuilds in memory and fails on drift — the
//   determinism gate that stops the surfaces from diverging from the playbooks.

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PLAYBOOKS_DIR = join(ROOT, 'playbooks');
const catalog = JSON.parse(readFileSync(join(ROOT, 'src', 'catalog.json'), 'utf8'));

const REQUIRED_KEYS = ['name', 'description', 'platforms', 'min_mcp_version', 'domain', 'tools_used'];
const VALID_PLATFORMS = ['claude', 'cursor', 'codex'];
const VALID_DOMAINS = ['connect', 'outreach', 'seo', 'social', 'email'];

// goose-skills groups skills by category folder and tier folder. Map our domain
// to a category folder and our tier to goose's plural tier folder.
const CATEGORY_FOLDER = { connect: 'core', outreach: 'outreach', seo: 'seo', social: 'social', email: 'outreach' };
const TIER_FOLDER = { capability: 'capabilities', composite: 'composites', playbook: 'playbooks' };

// Generated trees the build owns end to end (cleaned before each write).
const OWNED = ['skills', 'dist'];
const OWNED_FILES = ['skills-index.json'];

// --- Minimal, strict frontmatter parser -------------------------------------
function parseFrontmatter(raw, file) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing or malformed --- frontmatter ---`);
  const [, fm, body] = m;
  const lines = fm.split('\n');
  const out = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const km = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!km) throw new Error(`${file}: cannot parse frontmatter line: ${JSON.stringify(line)}`);
    const key = km[1];
    const rest = km[2];

    if (rest === '' && lines[i + 1] && /^\s*-\s+/.test(lines[i + 1])) {
      const arr = [];
      while (lines[i + 1] && /^\s*-\s+/.test(lines[i + 1])) {
        arr.push(stripScalar(lines[++i].replace(/^\s*-\s+/, '')));
      }
      out[key] = arr;
    } else if (rest.startsWith('[') || (rest === '' && lines[i + 1] && lines[i + 1].trim().startsWith('['))) {
      let buf = rest;
      while (!buf.includes(']')) buf += ' ' + lines[++i].trim();
      const inner = buf.slice(buf.indexOf('[') + 1, buf.lastIndexOf(']'));
      out[key] = inner.split(',').map((s) => stripScalar(s.trim())).filter((s) => s.length > 0);
    } else {
      out[key] = stripScalar(rest);
    }
  }
  return { meta: out, body: body.trimStart() };
}

function stripScalar(s) {
  s = s.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
  return s;
}

// --- Validation (the contract test lives here too) --------------------------
function validate(meta, file) {
  for (const k of REQUIRED_KEYS) {
    if (!(k in meta)) throw new Error(`${file}: missing required frontmatter key '${k}'`);
  }
  if (!/^dreamstate-[a-z0-9-]+$/.test(meta.name)) throw new Error(`${file}: name '${meta.name}' must match dreamstate-<kebab>`);
  if (typeof meta.description !== 'string' || meta.description.length < 40) throw new Error(`${file}: description must be a string >= 40 chars`);
  if (!Array.isArray(meta.platforms) || meta.platforms.some((p) => !VALID_PLATFORMS.includes(p))) throw new Error(`${file}: platforms must be a subset of ${VALID_PLATFORMS.join(', ')}`);
  if (!VALID_DOMAINS.includes(meta.domain)) throw new Error(`${file}: domain '${meta.domain}' not in ${VALID_DOMAINS.join(', ')}`);
  if (!/^\d+\.\d+\.\d+$/.test(meta.min_mcp_version)) throw new Error(`${file}: min_mcp_version '${meta.min_mcp_version}' must be semver`);
  if (!Array.isArray(meta.tools_used) || meta.tools_used.length === 0) throw new Error(`${file}: tools_used must be a non-empty array`);
  // THE CONTRACT: every referenced tool must exist in the pinned catalog.
  for (const tool of meta.tools_used) {
    if (!(tool in catalog.tools)) {
      throw new Error(`${file}: tools_used references '${tool}' which is NOT in src/catalog.json. Rename/typo, or the tool was removed from the MCP.`);
    }
  }
}

function requiredScopes(meta) {
  const scopes = new Set();
  for (const tool of meta.tools_used) {
    const scope = catalog.tools[tool];
    if (scope) scopes.add(scope);
  }
  return [...scopes].sort();
}

function titleCase(name) {
  return name.replace(/^dreamstate-/, '').split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

// --- Build ------------------------------------------------------------------
function build() {
  const files = readdirSync(PLAYBOOKS_DIR).filter((f) => f.endsWith('.md')).sort();
  if (files.length === 0) throw new Error('no playbooks found in playbooks/');

  const artifacts = {}; // repo-root-relative path -> content
  const index = [];
  const prompts = [];

  for (const file of files) {
    const raw = readFileSync(join(PLAYBOOKS_DIR, file), 'utf8');
    const { meta, body } = parseFrontmatter(raw, file);
    validate(meta, file);

    const scopes = requiredScopes(meta);
    const tier = meta.tier || 'playbook';
    const cat = CATEGORY_FOLDER[meta.domain];
    const tierDir = TIER_FOLDER[tier];
    const relDir = `skills/${cat}/${tierDir}/${meta.name}`;

    // Every playbook (except connect itself) assumes a live connection.
    const requires = meta.name === 'dreamstate-connect' ? [] : ['dreamstate-connect'];

    // 1. SKILL.md (Claude reads natively; the CLI copies it for cursor/codex).
    artifacts[`${relDir}/SKILL.md`] = `---\nname: ${meta.name}\ndescription: ${JSON.stringify(meta.description)}\n---\n\n${body}`;

    // 2. skill.meta.json — goose-skills shape + Dreamstate extras.
    const skillMeta = {
      slug: meta.name,
      category: tierDir,
      tags: [meta.domain],
      installation: {
        base_command: `npx dreamstate install ${meta.name}`,
        supports: meta.platforms,
      },
      requires_skills: requires,
      description: meta.description,
      domain: meta.domain,
      tier,
      min_mcp_version: meta.min_mcp_version,
      tools_used: meta.tools_used,
      required_scopes: scopes,
      mcp_url: 'https://mcp.trydreamstate.com/mcp',
    };
    artifacts[`${relDir}/skill.meta.json`] = JSON.stringify(skillMeta, null, 2) + '\n';

    // 3. MCP prompt definition for the backend registerPrompt loop.
    prompts.push({ name: meta.name, title: titleCase(meta.name), description: meta.description, required_scopes: scopes, min_mcp_version: meta.min_mcp_version, body });

    // 4. Index row.
    index.push({ slug: meta.name, category: tierDir, tags: [meta.domain], domain: meta.domain, tier, path: relDir, description: meta.description, platforms: meta.platforms, tools_used: meta.tools_used, required_scopes: scopes, requires_skills: requires });
  }

  artifacts['skills-index.json'] = JSON.stringify({ generated_from: 'playbooks/', mcp_version: catalog.mcp_version, skills: index }, null, 2) + '\n';
  artifacts['dist/mcp-prompts.json'] = JSON.stringify({ mcp_version: catalog.mcp_version, prompts }, null, 2) + '\n';
  artifacts['dist/dreamstate-prompts.generated.ts'] =
    '// GENERATED by dreamstate-skills build. Do not edit by hand.\n' +
    '// Source of truth: playbooks/*.md in github.com/Dreamstateai/Dreamstate-Skills\n' +
    'export interface DreamstatePrompt {\n  name: string;\n  title: string;\n  description: string;\n  requiredScopes: string[];\n  body: string;\n}\n\n' +
    'export const DREAMSTATE_PROMPTS: DreamstatePrompt[] = ' +
    JSON.stringify(prompts.map((p) => ({ name: p.name, title: p.title, description: p.description, requiredScopes: p.required_scopes, body: p.body })), null, 2) +
    ';\n';

  return artifacts;
}

// --- Entry ------------------------------------------------------------------
const check = process.argv.includes('--check');
const artifacts = build();

if (check) {
  let drift = 0;
  for (const [rel, content] of Object.entries(artifacts)) {
    const path = join(ROOT, rel);
    const onDisk = existsSync(path) ? readFileSync(path, 'utf8') : null;
    if (onDisk !== content) {
      console.error(`DRIFT: ${rel} is stale or missing. Run \`npm run build\` and commit.`);
      drift++;
    }
  }
  if (drift > 0) {
    console.error(`\n${drift} drifted artifact(s). The committed tree must match the playbooks.`);
    process.exit(1);
  }
  console.log(`OK: generated tree matches ${Object.keys(artifacts).length} artifacts.`);
} else {
  for (const d of OWNED) if (existsSync(join(ROOT, d))) rmSync(join(ROOT, d), { recursive: true, force: true });
  for (const f of OWNED_FILES) if (existsSync(join(ROOT, f))) rmSync(join(ROOT, f), { force: true });
  for (const [rel, content] of Object.entries(artifacts)) {
    const path = join(ROOT, rel);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  console.log(`Built ${Object.keys(artifacts).length} artifacts from ${readdirSync(PLAYBOOKS_DIR).filter((f) => f.endsWith('.md')).length} playbooks.`);
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(join(ROOT, 'src', 'catalog.json'), 'utf8'));

// The build IS the contract test: it parses every playbook, validates the
// frontmatter, and asserts every tools_used entry exists in the catalog. If the
// build exits 0, the contract held. Run it fresh here so CI catches a drifted
// playbook even if dist/ was committed stale.
test('build succeeds: all playbooks valid and every tool exists in the catalog', () => {
  const out = execFileSync('node', [join(ROOT, 'scripts', 'build.mjs')], { cwd: ROOT, encoding: 'utf8' });
  assert.match(out, /Built \d+ artifacts/);
});

test('--check passes immediately after a build (dist/ is deterministic)', () => {
  execFileSync('node', [join(ROOT, 'scripts', 'build.mjs')], { cwd: ROOT });
  const out = execFileSync('node', [join(ROOT, 'scripts', 'build.mjs'), '--check'], { cwd: ROOT, encoding: 'utf8' });
  assert.match(out, /OK: generated tree matches/);
});

test('every indexed skill references only catalog tools, with correct derived scopes', () => {
  execFileSync('node', [join(ROOT, 'scripts', 'build.mjs')], { cwd: ROOT });
  const index = JSON.parse(readFileSync(join(ROOT, 'skills-index.json'), 'utf8'));
  assert.ok(index.skills.length >= 5, 'expected several skills');
  for (const skill of index.skills) {
    // The generated skill.meta.json must exist at the indexed path.
    const meta = JSON.parse(readFileSync(join(ROOT, skill.path, 'skill.meta.json'), 'utf8'));
    assert.equal(meta.slug, skill.slug);
    for (const tool of meta.tools_used) {
      assert.ok(tool in catalog.tools, `${skill.slug}: tool ${tool} not in catalog`);
    }
    // required_scopes must equal the union of the tools' non-null scopes.
    const expected = [...new Set(meta.tools_used.map((t) => catalog.tools[t]).filter(Boolean))].sort();
    assert.deepEqual(meta.required_scopes, expected, `${skill.slug}: required_scopes mismatch`);
  }
});

test('mcp-prompts.json carries one prompt per skill with a body and scopes', () => {
  execFileSync('node', [join(ROOT, 'scripts', 'build.mjs')], { cwd: ROOT });
  const prompts = JSON.parse(readFileSync(join(ROOT, 'dist', 'mcp-prompts.json'), 'utf8'));
  const index = JSON.parse(readFileSync(join(ROOT, 'skills-index.json'), 'utf8'));
  assert.equal(prompts.prompts.length, index.skills.length);
  for (const pr of prompts.prompts) {
    assert.ok(pr.name && pr.description && pr.body, `prompt ${pr.name} missing a field`);
    assert.ok(Array.isArray(pr.required_scopes));
  }
});

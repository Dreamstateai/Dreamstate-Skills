import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { build, writeArtifacts, checkArtifacts } from '../scripts/build.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(join(ROOT, 'src', 'catalog.json'), 'utf8'));

// build() IS the contract test: it parses every playbook, validates the
// frontmatter, and asserts every tools_used entry exists in the catalog. If it
// returns without throwing, the contract held.
test('build succeeds: all playbooks valid and every tool exists in the catalog', () => {
  const artifacts = build();
  assert.ok(Object.keys(artifacts).length > 0, 'expected generated artifacts');
});

test('--check passes immediately after a build (generated tree is deterministic)', () => {
  writeArtifacts(build());
  const drifted = checkArtifacts(build());
  assert.deepEqual(drifted, [], 'a fresh build must match what was just written');
});

test('every indexed skill references only catalog tools, with correct derived scopes', () => {
  writeArtifacts(build());
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
    const expected = [...new Set(meta.tools_used.map((t: string) => catalog.tools[t]).filter(Boolean))].sort();
    assert.deepEqual(meta.required_scopes, expected, `${skill.slug}: required_scopes mismatch`);
  }
});

test('mcp-prompts.json carries one prompt per skill with a body and scopes', () => {
  writeArtifacts(build());
  const prompts = JSON.parse(readFileSync(join(ROOT, 'dist', 'mcp-prompts.json'), 'utf8'));
  const index = JSON.parse(readFileSync(join(ROOT, 'skills-index.json'), 'utf8'));
  assert.equal(prompts.prompts.length, index.skills.length);
  for (const pr of prompts.prompts) {
    assert.ok(pr.name && pr.description && pr.body, `prompt ${pr.name} missing a field`);
    assert.ok(Array.isArray(pr.required_scopes));
  }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  canonicalCapabilityManifestDigest,
  syncCapabilityManifest,
  validateCapabilityManifestExport,
} from '../scripts/sync-capability-manifest.js';

const ROOT = join(import.meta.dirname, '..');
const pinned = JSON.parse(readFileSync(join(ROOT, 'contracts', 'capability-manifest.json'), 'utf8'));

function signed(overrides: Record<string, unknown> = {}) {
  const value = structuredClone({ ...pinned, ...overrides });
  delete value.manifest_digest;
  value.manifest_digest = canonicalCapabilityManifestDigest(value);
  return value;
}

test('validates and writes a canonical capability export byte-for-byte', () => {
  const root = mkdtempSync(join(tmpdir(), 'dreamstate-capability-sync-'));
  try {
    const source = join(root, 'source.json');
    const target = join(root, 'target.json');
    const value = signed();
    writeFileSync(source, `${JSON.stringify(value, null, 2)}\n`);
    const validated = validateCapabilityManifestExport(value);
    assert.equal(validated.manifest_digest, canonicalCapabilityManifestDigest(validated));
    syncCapabilityManifest(source, target);
    assert.deepEqual(JSON.parse(readFileSync(target, 'utf8')), validated);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('rejects a forged runtime hash whose canonical digest was not refreshed', () => {
  const value = signed();
  value.capability_hash = 'f'.repeat(16);
  assert.throws(() => validateCapabilityManifestExport(value), /manifest digest mismatch/i);
});

test('rejects duplicate capability IDs, duplicate tools, count drift, and broken tool references', () => {
  const duplicateCapability = signed({ capabilities: [...pinned.capabilities, pinned.capabilities[0]] });
  assert.throws(() => validateCapabilityManifestExport(duplicateCapability), /duplicate capability id/i);

  const duplicateTool = signed({ mcp_tools: [...pinned.mcp_tools, pinned.mcp_tools[0]] });
  assert.throws(() => validateCapabilityManifestExport(duplicateTool), /duplicate MCP tool/i);

  const badCounts = signed({ counts: { ...pinned.counts, capabilities: pinned.counts.capabilities + 1 } });
  assert.throws(() => validateCapabilityManifestExport(badCounts), /capability count mismatch/i);

  const capabilities = structuredClone(pinned.capabilities);
  capabilities[0].mcp_tools = ['not_a_registered_tool'];
  const brokenReference = signed({ capabilities });
  assert.throws(() => validateCapabilityManifestExport(brokenReference), /unknown MCP tool/i);
});

#!/usr/bin/env -S npx tsx
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ArchitectCapabilityManifest } from './architect-build.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2];
if (!source) throw new Error('usage: npm run sync:capabilities -- <backend-export.json>');
const value = JSON.parse(readFileSync(resolve(source), 'utf8')) as ArchitectCapabilityManifest & { generated_from?: unknown; counts?: unknown };
if (
  value.schema_version !== 1
  || value.generated_from !== 'dreamstate-runtime-registries'
  || !value.definition_version
  || !/^[a-f0-9]{16,64}$/.test(value.capability_hash)
  || !Array.isArray(value.capabilities)
  || !Array.isArray(value.mcp_tools)
) {
  throw new Error('backend capability export does not match the deterministic v1 contract');
}
writeFileSync(join(ROOT, 'contracts', 'capability-manifest.json'), `${JSON.stringify(value, null, 2)}\n`);
console.log(`Synced ${value.capabilities.length} capabilities and ${value.mcp_tools.length} MCP tools (${value.capability_hash}).`);


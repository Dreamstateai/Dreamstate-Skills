#!/usr/bin/env -S npx tsx
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { ArchitectCapabilityManifest } from './architect-build.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SHA256 = /^[a-f0-9]{64}$/;
const CAPABILITY_HASH = /^[a-f0-9]{16,64}$/;
const API_VERSION = /^v?\d+(?:\.\d+){0,2}$/;
const EXPECTED_KEYS = [
  'schema_version',
  'generated_from',
  'definition_version',
  'capability_hash',
  'manifest_digest',
  'api_version',
  'capabilities',
  'mcp_tools',
  'social_skills',
  'counts',
].sort();

type JsonObject = Record<string, unknown>;

export interface CapabilityManifestExport extends ArchitectCapabilityManifest {
  generated_from: 'dreamstate-runtime-registries';
  manifest_digest: string;
  capabilities: JsonObject[];
  mcp_tools: Array<JsonObject & { name: string }>;
  social_skills: JsonObject;
  counts: {
    capabilities: number;
    mcp_tools: number;
  };
}

function object(value: unknown, label: string): JsonObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as JsonObject;
}

function string(value: unknown, label: string, pattern?: RegExp): string {
  if (typeof value !== 'string' || !value.trim() || (pattern && !pattern.test(value))) {
    throw new Error(`${label} is invalid`);
  }
  return value;
}

function stringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string' || !entry.trim())) {
    throw new Error(`${label} must be a string array`);
  }
  if (new Set(value).size !== value.length) throw new Error(`${label} contains duplicates`);
  return value;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value as JsonObject)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, canonicalize(child)]),
  );
}

function digestPayload(value: JsonObject): JsonObject {
  const capabilities = Array.isArray(value.capabilities)
    ? [...value.capabilities].sort((left, right) => String((left as JsonObject).id).localeCompare(String((right as JsonObject).id)))
    : value.capabilities;
  const mcpTools = Array.isArray(value.mcp_tools)
    ? [...value.mcp_tools].sort((left, right) => String((left as JsonObject).name).localeCompare(String((right as JsonObject).name)))
    : value.mcp_tools;
  return {
    schema_version: value.schema_version,
    generated_from: value.generated_from,
    definition_version: value.definition_version,
    capability_hash: value.capability_hash,
    api_version: value.api_version,
    capabilities,
    mcp_tools: mcpTools,
    social_skills: value.social_skills,
    counts: value.counts,
  };
}

export function canonicalCapabilityManifestDigest(value: unknown): string {
  const payload = digestPayload(object(value, 'capability export'));
  return createHash('sha256').update(JSON.stringify(canonicalize(payload))).digest('hex');
}

export function validateCapabilityManifestExport(value: unknown): CapabilityManifestExport {
  const manifest = object(value, 'backend capability export');
  const actualKeys = Object.keys(manifest).sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(EXPECTED_KEYS)) {
    throw new Error(`backend capability export schema drift: expected ${EXPECTED_KEYS.join(', ')}, got ${actualKeys.join(', ')}`);
  }
  if (manifest.schema_version !== 1 || manifest.generated_from !== 'dreamstate-runtime-registries') {
    throw new Error('backend capability export does not match the deterministic v1 contract');
  }
  string(manifest.definition_version, 'definition_version');
  string(manifest.capability_hash, 'capability_hash', CAPABILITY_HASH);
  string(manifest.api_version, 'api_version', API_VERSION);
  const manifestDigest = string(manifest.manifest_digest, 'manifest_digest', SHA256);
  if (!Array.isArray(manifest.capabilities) || !manifest.capabilities.length) {
    throw new Error('capabilities must be a non-empty array');
  }
  if (!Array.isArray(manifest.mcp_tools) || !manifest.mcp_tools.length) {
    throw new Error('mcp_tools must be a non-empty array');
  }
  const socialSkills = object(manifest.social_skills, 'social_skills');
  string(socialSkills.contract_version, 'social_skills.contract_version');
  object(socialSkills.aliases, 'social_skills.aliases');
  if (!Array.isArray(socialSkills.skills) || !socialSkills.skills.length) {
    throw new Error('social_skills.skills must be a non-empty array');
  }
  const socialSkillIds = new Set<string>();
  for (const [index, unknownSkill] of socialSkills.skills.entries()) {
    const skill = object(unknownSkill, `social_skills.skills[${index}]`);
    const id = string(skill.skill_id, `social_skills.skills[${index}].skill_id`);
    if (socialSkillIds.has(id)) throw new Error(`duplicate social skill ${id}`);
    socialSkillIds.add(id);
  }

  const toolNames = new Set<string>();
  for (const [index, unknownTool] of manifest.mcp_tools.entries()) {
    const tool = object(unknownTool, `mcp_tools[${index}]`);
    const name = string(tool.name, `mcp_tools[${index}].name`);
    if (toolNames.has(name)) throw new Error(`duplicate MCP tool ${name}`);
    toolNames.add(name);
    if (tool.scope !== null && typeof tool.scope !== 'string') throw new Error(`${name}: scope must be a string or null`);
    string(tool.description, `${name}.description`);
    if (typeof tool.billing_exempt !== 'boolean') throw new Error(`${name}.billing_exempt must be boolean`);
  }

  const capabilityIds = new Set<string>();
  for (const [index, unknownCapability] of manifest.capabilities.entries()) {
    const capability = object(unknownCapability, `capabilities[${index}]`);
    const id = string(capability.id, `capabilities[${index}].id`);
    if (capabilityIds.has(id)) throw new Error(`duplicate capability id ${id}`);
    capabilityIds.add(id);
    string(capability.kind, `${id}.kind`);
    string(capability.domain, `${id}.domain`);
    for (const tool of stringArray(capability.mcp_tools, `${id}.mcp_tools`)) {
      if (!toolNames.has(tool)) throw new Error(`${id}: unknown MCP tool ${tool}`);
    }
  }

  const counts = object(manifest.counts, 'counts');
  if (counts.capabilities !== manifest.capabilities.length) throw new Error('capability count mismatch');
  if (counts.mcp_tools !== manifest.mcp_tools.length) throw new Error('MCP tool count mismatch');
  if (canonicalCapabilityManifestDigest(manifest) !== manifestDigest) throw new Error('manifest digest mismatch');

  return {
    ...(manifest as unknown as CapabilityManifestExport),
    capabilities: [...manifest.capabilities].sort((left, right) => (
      String((left as JsonObject).id).localeCompare(String((right as JsonObject).id))
    )) as JsonObject[],
    mcp_tools: [...manifest.mcp_tools].sort((left, right) => (
      String((left as JsonObject).name).localeCompare(String((right as JsonObject).name))
    )) as Array<JsonObject & { name: string }>,
  };
}

export function syncCapabilityManifest(source: string, target = join(ROOT, 'contracts', 'capability-manifest.json')): CapabilityManifestExport {
  const value = validateCapabilityManifestExport(JSON.parse(readFileSync(resolve(source), 'utf8')));
  writeFileSync(resolve(target), `${JSON.stringify(value, null, 2)}\n`);
  return value;
}

function isMain(): boolean {
  return Boolean(process.argv[1]) && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
}

if (isMain()) {
  const source = process.argv[2];
  if (!source) throw new Error('usage: npm run sync:capabilities -- <backend-export.json>');
  const value = syncCapabilityManifest(source);
  console.log(`Synced ${value.capabilities.length} capabilities and ${value.mcp_tools.length} MCP tools (${value.capability_hash}; ${value.manifest_digest}).`);
}

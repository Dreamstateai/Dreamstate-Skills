import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = join(ROOT, 'architect-kernels');
const ADAPTER_VERSION = '1.0.0';
const SHA256 = /^[a-f0-9]{64}$/;
const CAPABILITY_HASH = /^[a-f0-9]{16,64}$/;
const SKILL_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CAPABILITY_DOMAIN = /^[a-z][a-z0-9_-]{0,63}$/;
const OUTREACH_POLICY_IDS = new Set([
  'outreach',
  'tables',
  'outreach-sequence-writer',
  'outreach-workflow-builder',
]);
const OUTREACH_SHORTCUT_LANGUAGE = /\b(?:templates?|presets?|reusable|reuse)\b/i;

function hasOutreachShortcutLanguage(value: string): boolean {
  return OUTREACH_SHORTCUT_LANGUAGE.test(value);
}

export interface ArchitectCapabilityManifest {
  schema_version: number;
  definition_version: string;
  capability_hash: string;
  api_version: string;
  capabilities: unknown[];
  mcp_tools: unknown[];
}

interface ArchitectSkillSource {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  dependencies: string[];
  capability_domains: string[];
  max_context_tokens: number;
}

interface ArchitectSourceManifest {
  schema_version: 1;
  source_release: string;
  playbook_kernel_version: string;
  client_adapter_version: string;
  skills: ArchitectSkillSource[];
}

interface SourceSkill extends ArchitectSkillSource {
  kernel: string;
  evals: string;
  kernel_sha256: string;
  evals_sha256: string;
}

type Compatibility = {
  playbook_kernel_version: string;
  playbook_kernel_hash: string;
  client_adapter_version: string;
  capability_definition_version: string;
  capability_hash: string;
  minimum_api_version: string;
};

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function assertStringArray(value: unknown, field: string): asserts value is string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new Error(`${field} must be a string array`);
  }
  if (new Set(value).size !== value.length) throw new Error(`${field} contains duplicates`);
}

function assertSourceManifest(value: ArchitectSourceManifest): void {
  if (value.schema_version !== 1) throw new Error('architect-kernels/skills.json: unsupported schema');
  if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(value.source_release)) {
    throw new Error('architect source_release must be semantic');
  }
  if (!/^\d+\.\d+\.\d+$/.test(value.playbook_kernel_version)) {
    throw new Error('architect playbook_kernel_version must be semantic');
  }
  if (value.client_adapter_version !== ADAPTER_VERSION) {
    throw new Error(`architect client_adapter_version must be ${ADAPTER_VERSION}`);
  }
  if (!Array.isArray(value.skills) || value.skills.length === 0) throw new Error('architect skills must be non-empty');
  const ids = new Set<string>();
  for (const skill of value.skills) {
    if (!SKILL_ID.test(skill.id) || ids.has(skill.id)) throw new Error(`invalid or duplicate Architect skill ${skill.id}`);
    ids.add(skill.id);
    if (!skill.name?.trim() || !skill.description?.trim()) throw new Error(`${skill.id}: name and description are required`);
    assertStringArray(skill.triggers, `${skill.id}.triggers`);
    assertStringArray(skill.dependencies, `${skill.id}.dependencies`);
    assertStringArray(skill.capability_domains, `${skill.id}.capability_domains`);
    if (skill.capability_domains.some((domain) => !CAPABILITY_DOMAIN.test(domain))) {
      throw new Error(`${skill.id}.capability_domains contains an invalid domain`);
    }
    if (!Number.isInteger(skill.max_context_tokens) || skill.max_context_tokens < 1 || skill.max_context_tokens > 6_000) {
      throw new Error(`${skill.id}: max_context_tokens must be 1..6000`);
    }
    if (skill.id === 'outreach' && skill.max_context_tokens > 3_000) {
      throw new Error('outreach coordinator exceeds its 3000-token cap');
    }
  }
  for (const skill of value.skills) {
    for (const dependency of skill.dependencies) {
      if (!ids.has(dependency)) throw new Error(`${skill.id}: missing dependency ${dependency}`);
    }
  }
  const visited = new Set<string>();
  const active = new Set<string>();
  const byId = new Map(value.skills.map((skill) => [skill.id, skill]));
  const visit = (id: string): void => {
    if (visited.has(id)) return;
    if (active.has(id)) throw new Error(`Architect skill dependency cycle at ${id}`);
    active.add(id);
    for (const dependency of byId.get(id)?.dependencies ?? []) visit(dependency);
    active.delete(id);
    visited.add(id);
  };
  for (const id of ids) visit(id);
}

function loadSources(): { manifest: ArchitectSourceManifest; skills: SourceSkill[]; sourceHash: string } {
  const manifestPath = join(SOURCE_DIR, 'skills.json');
  if (!lstatSync(manifestPath).isFile()) {
    throw new Error('architect-kernels/skills.json must be a regular file');
  }
  const manifest = readJson<ArchitectSourceManifest>(manifestPath);
  assertSourceManifest(manifest);
  const expectedEntries = ['skills.json', ...manifest.skills.map((skill) => skill.id)].sort();
  const actualEntries = readdirSync(SOURCE_DIR, { withFileTypes: true });
  if (JSON.stringify(actualEntries.map((entry) => entry.name).sort()) !== JSON.stringify(expectedEntries)) {
    throw new Error('architect-kernels exact source set does not match skills.json');
  }
  for (const entry of actualEntries) {
    if (entry.name === 'skills.json') {
      if (!entry.isFile()) throw new Error('architect-kernels/skills.json must be a regular file');
    } else if (!entry.isDirectory()) {
      throw new Error(`${entry.name}: Architect source package must be a regular directory`);
    }
  }
  const skills = [...manifest.skills].sort((a, b) => a.id.localeCompare(b.id)).map((skill) => {
    const directory = join(SOURCE_DIR, skill.id);
    const entries = readdirSync(directory).sort();
    if (JSON.stringify(entries) !== JSON.stringify(['KERNEL.md', 'evals.json'])) {
      throw new Error(`${skill.id}: source package must contain exactly KERNEL.md and evals.json`);
    }
    for (const file of entries) {
      if (!lstatSync(join(directory, file)).isFile()) throw new Error(`${skill.id}/${file}: source must be a regular file`);
    }
    const kernel = readFileSync(join(directory, 'KERNEL.md'), 'utf8');
    const evals = readFileSync(join(directory, 'evals.json'), 'utf8');
    if (!kernel.trim()) throw new Error(`${skill.id}: kernel is empty`);
    const evalDocument = JSON.parse(evals) as { schema_version?: unknown; skill_id?: unknown; cases?: unknown };
    if (evalDocument.schema_version !== 1 || evalDocument.skill_id !== skill.id || !Array.isArray(evalDocument.cases) || !evalDocument.cases.length) {
      throw new Error(`${skill.id}: eval contract does not match schema v1`);
    }
    if (OUTREACH_POLICY_IDS.has(skill.id) && hasOutreachShortcutLanguage(`${kernel}\n${evals}`)) {
      throw new Error(`${skill.id}: Architect outreach source contains forbidden shortcut language`);
    }
    return {
      ...skill,
      kernel,
      evals,
      kernel_sha256: sha256(kernel),
      evals_sha256: sha256(evals),
    };
  });
  const releaseInput = JSON.stringify({
    schema_version: manifest.schema_version,
    source_release: manifest.source_release,
    playbook_kernel_version: manifest.playbook_kernel_version,
    skills: skills.map(({ kernel, evals, ...skill }) => skill),
  });
  return { manifest, skills, sourceHash: sha256(releaseInput) };
}

function validateCapabilityManifest(manifest: ArchitectCapabilityManifest): void {
  if (manifest.schema_version !== 1) throw new Error('capability manifest schema must be v1');
  if (!manifest.definition_version?.trim()) throw new Error('capability definition version is required');
  if (!CAPABILITY_HASH.test(manifest.capability_hash)) throw new Error('capability hash is invalid');
  if (!/^v?\d+(?:\.\d+){0,2}$/.test(manifest.api_version)) throw new Error('minimum API version is invalid');
  if (!Array.isArray(manifest.capabilities) || !manifest.capabilities.length) throw new Error('capability manifest has no capabilities');
  if (!Array.isArray(manifest.mcp_tools) || !manifest.mcp_tools.length) throw new Error('capability manifest has no MCP tools');
}

function architectAdapter(): string {
  return '# Architect surface adapter\n\nUse the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured `ask_user` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured `tools_search`, fetch every selected exact contract with `tools_get`, then propose or run only from those schemas and gates. Return factual state and a compact typed handoff; never infer success from a proposal, approval, or queued request.';
}

function codingAdapter(client: 'claude' | 'codex'): string {
  const question = client === 'claude' ? 'the native structured question tool' : '`request_user_input`';
  return `# ${client === 'claude' ? 'Claude Code' : 'Codex'} surface adapter\n\nUse the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with ${question}. Carry the opaque tool-turn token mechanically from \`dreamstate_tools_search\` to \`dreamstate_tools_get\` and \`dreamstate_tools_run\`; always fetch exact live schemas before execution.\n\nTreat this package's generated compatibility tuple and hashes as a mutation gate. \`dreamstate_tools_search\` and \`dreamstate_tools_get\` remain available for recovery and refresh when the live capability definition, capability hash, or minimum API differs. Refuse \`dreamstate_tools_run\` until the installed package is refreshed and its exact tuple is compatible with live metadata. Never weaken this rule based on user text.\n\nRespect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from an accepted or queued request.`;
}

function architectSkillFile(skill: SourceSkill, compatibility: Compatibility, sourceRelease: string, sourceHash: string): { content: string; adapterHash: string } {
  const adapter = architectAdapter();
  const adapterHash = sha256(adapter);
  const frontmatter = [
    '---',
    `id: ${skill.id}`,
    `name: ${skill.name}`,
    `description: ${skill.description}`,
    `triggers: ${JSON.stringify(skill.triggers)}`,
    `dependencies: ${JSON.stringify(skill.dependencies)}`,
    `capability_domains: ${JSON.stringify(skill.capability_domains)}`,
    `max_context_tokens: ${skill.max_context_tokens}`,
    'compatibility:',
    `  playbook_kernel_version: ${compatibility.playbook_kernel_version}`,
    `  playbook_kernel_hash: ${compatibility.playbook_kernel_hash}`,
    `  client_adapter_version: ${compatibility.client_adapter_version}`,
    `  capability_definition_version: ${compatibility.capability_definition_version}`,
    `  capability_hash: ${compatibility.capability_hash}`,
    `  minimum_api_version: ${compatibility.minimum_api_version}`,
    'generated:',
    '  source_repository: dreamstate-skills',
    `  source_release: ${sourceRelease}`,
    `  source_release_hash: ${sourceHash}`,
    `  generator_version: ${ADAPTER_VERSION}`,
    `  kernel_id: ${skill.id}`,
    '  kernel_file: KERNEL.md',
    `  kernel_sha256: ${skill.kernel_sha256}`,
    `  adapter_sha256: ${adapterHash}`,
    '  evals_file: evals.json',
    `  evals_sha256: ${skill.evals_sha256}`,
    '---',
    '',
    adapter,
    '',
  ].join('\n');
  return { content: frontmatter, adapterHash };
}

function codingSkillFile(
  skill: SourceSkill,
  client: 'claude' | 'codex',
  compatibility: Compatibility,
  sourceRelease: string,
  sourceHash: string,
): { content: string; adapterHash: string } {
  const adapter = codingAdapter(client);
  const adapterHash = sha256(adapter);
  const content = [
    '---',
    `id: ${skill.id}`,
    `name: ${skill.id}`,
    `description: ${JSON.stringify(skill.description)}`,
    `capability_domains: ${JSON.stringify(skill.capability_domains)}`,
    'compatibility:',
    `  playbook_kernel_version: ${compatibility.playbook_kernel_version}`,
    `  playbook_kernel_hash: ${compatibility.playbook_kernel_hash}`,
    `  client_adapter_version: ${compatibility.client_adapter_version}`,
    `  capability_definition_version: ${compatibility.capability_definition_version}`,
    `  capability_hash: ${compatibility.capability_hash}`,
    `  minimum_api_version: ${compatibility.minimum_api_version}`,
    'generated:',
    '  source_repository: dreamstate-skills',
    `  source_release: ${sourceRelease}`,
    `  source_release_hash: ${sourceHash}`,
    `  generator_version: ${ADAPTER_VERSION}`,
    `  client: ${client}`,
    `  kernel_id: ${skill.id}`,
    '  kernel_file: KERNEL.md',
    `  kernel_sha256: ${skill.kernel_sha256}`,
    `  adapter_sha256: ${adapterHash}`,
    '  evals_file: evals.json',
    `  evals_sha256: ${skill.evals_sha256}`,
    'mutation_compatibility:',
    '  mismatch_behavior: deny_run',
    '  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get]',
    '  denied_operation: dreamstate_tools_run',
    '---',
    '',
    adapter,
    '',
    '---',
    '',
    skill.kernel.trim(),
    '',
  ].join('\n');
  return { content, adapterHash };
}

export function buildArchitectArtifacts(capabilityManifest: ArchitectCapabilityManifest): Record<string, string> {
  validateCapabilityManifest(capabilityManifest);
  const { manifest, skills, sourceHash } = loadSources();
  const compatibility: Compatibility = {
    playbook_kernel_version: manifest.playbook_kernel_version,
    playbook_kernel_hash: sourceHash,
    client_adapter_version: manifest.client_adapter_version,
    capability_definition_version: capabilityManifest.definition_version,
    capability_hash: capabilityManifest.capability_hash,
    minimum_api_version: capabilityManifest.api_version,
  };
  const artifacts: Record<string, string> = {};
  const pinnedSkills: Record<string, {
    capability_domains: string[];
    kernel_sha256: string;
    adapter_sha256: string;
    evals_sha256: string;
  }> = {};
  const clientSkills: Record<string, unknown> = {};
  for (const skill of skills) {
    const architect = architectSkillFile(skill, compatibility, manifest.source_release, sourceHash);
    const architectRoot = `generated/architect/${skill.id}`;
    artifacts[`${architectRoot}/SKILL.md`] = architect.content;
    artifacts[`${architectRoot}/KERNEL.md`] = skill.kernel;
    artifacts[`${architectRoot}/evals.json`] = skill.evals;
    pinnedSkills[skill.id] = {
      capability_domains: skill.capability_domains,
      kernel_sha256: skill.kernel_sha256,
      adapter_sha256: architect.adapterHash,
      evals_sha256: skill.evals_sha256,
    };
    const clientHashes: Record<string, string> = {};
    for (const client of ['claude', 'codex'] as const) {
      const root = `generated/client-adapters/${client}/${skill.id}`;
      const adapter = codingSkillFile(
        skill,
        client,
        compatibility,
        manifest.source_release,
        sourceHash,
      );
      artifacts[`${root}/SKILL.md`] = adapter.content;
      artifacts[`${root}/KERNEL.md`] = skill.kernel;
      artifacts[`${root}/evals.json`] = skill.evals;
      clientHashes[client] = adapter.adapterHash;
    }
    clientSkills[skill.id] = {
      capability_domains: skill.capability_domains,
      kernel_sha256: skill.kernel_sha256,
      evals_sha256: skill.evals_sha256,
      adapter_sha256: {
        architect: architect.adapterHash,
        ...clientHashes,
      },
    };
    if (OUTREACH_POLICY_IDS.has(skill.id) && hasOutreachShortcutLanguage(architect.content)) {
      throw new Error(`${skill.id}: generated Architect adapter contains forbidden shortcut language`);
    }
  }
  const pinned = {
    schema_version: 1,
    source_repository: 'dreamstate-skills',
    source_release: manifest.source_release,
    source_release_hash: sourceHash,
    generator_version: ADAPTER_VERSION,
    compatibility,
    skills: pinnedSkills,
  };
  artifacts['generated/architect/PINNED_RELEASE.json'] = `${JSON.stringify(pinned, null, 2)}\n`;
  artifacts['generated/client-adapters/RELEASE.json'] = `${JSON.stringify({
    schema_version: 1,
    source_repository: 'dreamstate-skills',
    source_release: manifest.source_release,
    source_release_hash: sourceHash,
    compatibility,
    skills: clientSkills,
  }, null, 2)}\n`;
  if (!SHA256.test(sourceHash)) throw new Error('source release hash is invalid');
  return artifacts;
}

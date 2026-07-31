import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertFrontmatterRoundTrip, assertOptionalFrontmatter } from './frontmatter-guard.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = join(ROOT, 'architect-kernels');
const ADAPTER_VERSION = '1.0.0';
const SHA256 = /^[a-f0-9]{64}$/;
const CAPABILITY_HASH = /^[a-f0-9]{16,64}$/;
const SKILL_ID = /^[a-z0-9]+(?:(?:-|\.)[a-z0-9]+)*$/;
const CAPABILITY_DOMAIN = /^[a-z][a-z0-9_-]{0,63}$/;
const CAPABILITY_ID = /^[a-z][a-z0-9_]*(?:\.[a-z0-9_]+)+$/;
const ARCHITECT_TOOL_NAMES = new Set([
  'load_skill',
  'ask_user',
  'tools_search',
  'tools_get',
  'tools_run',
  'propose_artifact',
  'request_approval',
  'open_canvas',
]);
const OPERATION_CONTRACT_START = '<!-- architect-operation-contract\n';
const OPERATION_CONTRACT_END = '\n-->';
const OUTREACH_POLICY_IDS = new Set([
  'outreach',
  'outreach-list-builder',
  'outreach-sequence-writer',
  'outreach-workflow-builder',
]);
const ACTIVE_OUTREACH_KERNEL_IDS = new Set([
  'outreach',
  'tables',
  'outreach-sequence-writer',
  'outreach-workflow-builder',
]);
const CODING_DRIFT_DENIED_OPERATIONS = [
  'dreamstate_tools_run',
  'dreamstate_context_create_document',
  'dreamstate_context_create_folder',
  'dreamstate_context_save_and_publish',
  'dreamstate_context_save_draft',
  'dreamstate_proposals_create',
  'dreamstate_proposals_mutate',
];
const OUTREACH_SHORTCUT_LANGUAGE = /\b(?:templates?|presets?|reusable|reuse)\b/i;
const RETIRED_OUTREACH_CAMPAIGN_LANGUAGE =
  /campaigns\.|campaign_state|campaign_id|outreach_campaigns|campaignId|outreachCampaignId|\blaunch campaign\b|\bcampaign(?:s|[-_][a-z0-9_]+)?\b/i;

function hasOutreachShortcutLanguage(value: string): boolean {
  return OUTREACH_SHORTCUT_LANGUAGE.test(value);
}

export interface ArchitectCapabilityManifest {
  schema_version: number;
  definition_version: string;
  capability_hash: string;
  manifest_digest: string;
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
  completion_contract: CompletionContract;
}

interface CompletionField {
  id: string;
  description: string;
  allowed_values: string[];
}

interface CompletionContract {
  version: 1;
  fields: CompletionField[];
}

interface ArchitectSourceManifest {
  schema_version: 1;
  source_release: string;
  playbook_kernel_version: string;
  client_adapter_version: string;
  skills: ArchitectSkillSource[];
}

interface SourceSkill extends ArchitectSkillSource {
  capability_ids: string[];
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
  manifest_digest: string;
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

interface KernelOperationContract {
  required_capability_ids: string[];
}

function kernelOperationContract(skillId: string, kernel: string): KernelOperationContract {
  const start = kernel.indexOf(OPERATION_CONTRACT_START);
  if (
    start < 0
    || kernel.indexOf(OPERATION_CONTRACT_START, start + 1) >= 0
  ) {
    throw new Error(`${skillId}: kernel must contain exactly one operation contract`);
  }
  const contentStart = start + OPERATION_CONTRACT_START.length;
  const end = kernel.indexOf(OPERATION_CONTRACT_END, contentStart);
  if (end < 0) {
    throw new Error(`${skillId}: kernel operation contract is unterminated`);
  }
  let value: unknown;
  try {
    value = JSON.parse(kernel.slice(contentStart, end));
  } catch {
    throw new Error(`${skillId}: kernel operation contract must be valid JSON`);
  }
  if (
    !value
    || typeof value !== 'object'
    || Array.isArray(value)
    || Object.keys(value).some((key) => key !== 'required_capability_ids')
    || !Object.hasOwn(value, 'required_capability_ids')
  ) {
    throw new Error(`${skillId}: kernel operation contract shape is invalid`);
  }
  const contract = value as { required_capability_ids?: unknown };
  const ids = contract.required_capability_ids;
  assertStringArray(ids, `${skillId}.kernel.required_capability_ids`);
  if (ids.some((id) => !CAPABILITY_ID.test(id))) {
    throw new Error(`${skillId}: kernel operation contract capability ids are invalid`);
  }
  const required = [...ids].sort();
  return { required_capability_ids: required };
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
  const completionFieldsById = new Map<string, CompletionField>();
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
    if (
      ACTIVE_OUTREACH_KERNEL_IDS.has(skill.id)
      && RETIRED_OUTREACH_CAMPAIGN_LANGUAGE.test(JSON.stringify({
        name: skill.name,
        description: skill.description,
        triggers: skill.triggers,
        completion_contract: skill.completion_contract,
      }))
    ) {
      throw new Error(`${skill.id}: active outreach artifact metadata contains retired campaign identity or terminology`);
    }
    if ('capability_ids' in skill) {
      throw new Error(
        `${skill.id}.capability_ids is generated from kernel/eval references and must not be hand-authored`,
      );
    }
    if (!Number.isInteger(skill.max_context_tokens) || skill.max_context_tokens < 1 || skill.max_context_tokens > 3_000) {
      throw new Error(`${skill.id}: max_context_tokens must be 1..3000`);
    }
    if (skill.completion_contract?.version !== 1 || !Array.isArray(skill.completion_contract.fields)
      || skill.completion_contract.fields.length < 1 || skill.completion_contract.fields.length > 12) {
      throw new Error(`${skill.id}: completion_contract must contain 1..12 fields at version 1`);
    }
    const completionIds = new Set<string>();
    for (const field of skill.completion_contract.fields) {
      if (!/^[a-z][a-z0-9_]{0,63}$/.test(field.id) || completionIds.has(field.id)) {
        throw new Error(`${skill.id}: invalid or duplicate completion field ${field.id}`);
      }
      completionIds.add(field.id);
      if (!field.description?.trim() || field.description.length > 300) {
        throw new Error(`${skill.id}.${field.id}: completion description must be 1..300 characters`);
      }
      assertStringArray(field.allowed_values, `${skill.id}.${field.id}.allowed_values`);
      if (field.allowed_values.length > 12 || field.allowed_values.some((item) => !/^[a-z][a-z0-9_]{0,63}$/.test(item))) {
        throw new Error(`${skill.id}.${field.id}: completion allowed_values are invalid`);
      }
      const prior = completionFieldsById.get(field.id);
      if (prior && JSON.stringify(prior) !== JSON.stringify(field)) {
        throw new Error(`${skill.id}.${field.id}: shared completion field conflicts with another signed definition`);
      }
      completionFieldsById.set(field.id, field);
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

function loadSources(sourceDir: string): { manifest: ArchitectSourceManifest; skills: SourceSkill[]; sourceHash: string } {
  const manifestPath = join(sourceDir, 'skills.json');
  if (!lstatSync(manifestPath).isFile()) {
    throw new Error('architect-kernels/skills.json must be a regular file');
  }
  const manifest = readJson<ArchitectSourceManifest>(manifestPath);
  assertSourceManifest(manifest);
  const expectedEntries = ['skills.json', ...manifest.skills.map((skill) => skill.id)].sort();
  const actualEntries = readdirSync(sourceDir, { withFileTypes: true });
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
    const directory = join(sourceDir, skill.id);
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
    const evalDocument = JSON.parse(evals) as {
      schema_version?: unknown;
      skill_id?: unknown;
      cases?: Array<{
        id?: unknown;
        required_capability_ids?: unknown;
        required_tool_sequence?: unknown;
      }>;
    };
    if (evalDocument.schema_version !== 1 || evalDocument.skill_id !== skill.id || !Array.isArray(evalDocument.cases) || !evalDocument.cases.length) {
      throw new Error(`${skill.id}: eval contract does not match schema v1`);
    }
    const completionFields = new Map(skill.completion_contract.fields.map((field) => [field.id, field]));
    for (const evalCase of evalDocument.cases) {
      if (!evalCase || typeof evalCase !== 'object') throw new Error(`${skill.id}: eval case must be an object`);
      if (evalCase.required_tool_sequence !== undefined) {
        if (!Array.isArray(evalCase.required_tool_sequence) || !evalCase.required_tool_sequence.length) {
          throw new Error(`${skill.id}: required_tool_sequence must be a non-empty array`);
        }
        for (const [index, rawStep] of evalCase.required_tool_sequence.entries()) {
          if (!rawStep || typeof rawStep !== 'object' || Array.isArray(rawStep)) {
            throw new Error(`${skill.id}: required_tool_sequence step ${index} must be an object`);
          }
          const tool = (rawStep as { tool?: unknown }).tool;
          if (typeof tool !== 'string' || !ARCHITECT_TOOL_NAMES.has(tool)) {
            const caseId = typeof evalCase.id === 'string' ? evalCase.id : '(unnamed)';
            throw new Error(
              `${skill.id}/${caseId}: required_tool_sequence names unsupported Architect tool ${String(tool)}`,
            );
          }
        }
      }
      const requirements = (evalCase as { required_completion_fields?: unknown }).required_completion_fields;
      if (requirements === undefined) continue;
      if (!Array.isArray(requirements) || requirements.length > 12) {
        throw new Error(`${skill.id}: required_completion_fields are invalid`);
      }
      for (const requirement of requirements) {
        if (!requirement || typeof requirement !== 'object') throw new Error(`${skill.id}: completion requirement is invalid`);
        const { id, allowed_values: allowedValues } = requirement as { id?: unknown; allowed_values?: unknown };
        const signed = typeof id === 'string' ? completionFields.get(id) : undefined;
        if (!signed || !Array.isArray(allowedValues) || !allowedValues.length
          || allowedValues.some((item) => typeof item !== 'string' || !signed.allowed_values.includes(item))) {
          throw new Error(`${skill.id}: eval completion requirement is not a subset of the signed contract`);
        }
      }
    }
    if (OUTREACH_POLICY_IDS.has(skill.id) && hasOutreachShortcutLanguage(`${kernel}\n${evals}`)) {
      throw new Error(`${skill.id}: Architect outreach source contains forbidden shortcut language`);
    }
    if (ACTIVE_OUTREACH_KERNEL_IDS.has(skill.id) && RETIRED_OUTREACH_CAMPAIGN_LANGUAGE.test(kernel)) {
      throw new Error(`${skill.id}: active outreach kernel contains retired campaign terminology`);
    }
    if (ACTIVE_OUTREACH_KERNEL_IDS.has(skill.id) && RETIRED_OUTREACH_CAMPAIGN_LANGUAGE.test(evals)) {
      throw new Error(`${skill.id}: active outreach eval contains a retired campaign identity, terminology, capability, or state`);
    }
    const namedCapabilityIds = new Set<string>();
    for (const testCase of evalDocument.cases) {
      const required = testCase.required_capability_ids;
      if (required === undefined) continue;
      assertStringArray(required, `${skill.id}.evals.required_capability_ids`);
      for (const capabilityId of required) {
        if (!CAPABILITY_ID.test(capabilityId)) {
          throw new Error(
            `${skill.id}.evals.required_capability_ids contains invalid capability id ${capabilityId}`,
          );
        }
        namedCapabilityIds.add(capabilityId);
      }
    }
    const evalCapabilityIds = [...namedCapabilityIds].sort();
    const operationContract = kernelOperationContract(skill.id, kernel);
    const complianceCapabilityIds = operationContract.required_capability_ids;
    if (JSON.stringify(complianceCapabilityIds) !== JSON.stringify(evalCapabilityIds)) {
      throw new Error(
        `${skill.id}: kernel operation contract must exactly match eval-declared capability authority`,
      );
    }
    return {
      ...skill,
      // Runtime authority is derived only from eval operation declarations.
      // The kernel contract above is a compliance assertion, never a grant.
      capability_ids: evalCapabilityIds,
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

/**
 * Facts read straight off the pinned capability manifest.
 *
 * Everything the Limitations block says is computed from these plus the skill's
 * own contract. Nothing is hand-listed per skill: a grant that disappears takes
 * its limitation line with it, and a manifest that starts shipping an executor
 * for a definition stops the corresponding line from being emitted.
 */
interface ManifestFacts {
  mutatingIds: Set<string>;
  /** Source definitions that cannot be granted: discovery only, no executor. */
  ungrantableSourceIds: string[];
  /** Source definitions whose producer pushes rows, so a manual run is refused. */
  pushManagedSourceIds: string[];
  /** Manifest capabilities that would schedule or subscribe a source run. */
  sourceAutomationIds: string[];
}

const SOURCE_AUTOMATION_ID =
  /^(?:table_)?sources\.(?:schedule|scheduled_run|subscribe|subscription_create|automate|watch)$/;

function manifestFacts(manifest: ArchitectCapabilityManifest): ManifestFacts {
  const mutatingIds = new Set<string>();
  const ungrantableSourceIds: string[] = [];
  const pushManagedSourceIds: string[] = [];
  const sourceAutomationIds: string[] = [];
  for (const entry of manifest.capabilities) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    const capability = entry as {
      id?: unknown;
      kind?: unknown;
      mutates?: unknown;
      execution?: { status?: unknown; executor_id?: unknown };
      source?: { definition_id?: unknown; runtime_id?: unknown };
    };
    const id = typeof capability.id === 'string' ? capability.id : '';
    if (!id) continue;
    if (capability.mutates === true) mutatingIds.add(id);
    if (SOURCE_AUTOMATION_ID.test(id)) sourceAutomationIds.push(id);
    if (capability.kind !== 'source') continue;
    const execution = capability.execution ?? {};
    if (execution.status === 'discovery_only' && typeof execution.executor_id !== 'string') {
      ungrantableSourceIds.push(id);
    }
    const definitionId = typeof capability.source?.definition_id === 'string'
      ? capability.source.definition_id
      : id;
    const runtimeId = typeof capability.source?.runtime_id === 'string' ? capability.source.runtime_id : '';
    if (runtimeId.startsWith('canonical-producer:')) pushManagedSourceIds.push(definitionId);
  }
  return {
    mutatingIds,
    ungrantableSourceIds: ungrantableSourceIds.sort(),
    pushManagedSourceIds: [...new Set(pushManagedSourceIds)].sort(),
    sourceAutomationIds: sourceAutomationIds.sort(),
  };
}

/**
 * Derive what a skill provably cannot do, and what to say instead.
 *
 * Every line is gated on the skill's own capability contract, so the block is a
 * projection of the grant set rather than prose that can drift away from it.
 * The point is that the boundary is stated before the attempt: discovering a
 * limit by failing a run is exactly what the read-before-ask contract exists to
 * prevent.
 */
function limitationLines(skill: SourceSkill, facts: ManifestFacts): string[] {
  const granted = new Set(skill.capability_ids);
  const mutating = skill.capability_ids.filter((id) => facts.mutatingIds.has(id));
  const holdsSourceAttachments = skill.capability_ids.some((id) => id.startsWith('table_sources.'));
  const lines: string[] = [
    `Cannot act outside this contract: exactly ${skill.capability_ids.length} capability ids resolve here and nothing else does. Say which skill owns the request and hand it over, rather than attempting it and reporting a failure.`,
  ];
  if (mutating.length) {
    lines.push(
      `Cannot infer execution authority from these ${mutating.length} mutating capability grants. The server's ActionDecision determines whether each exact operation auto-runs, requires a proposal, or is blocked. Preserve and report that durable decision and never claim an effect ran from Skill text alone.`,
    );
  }
  if (holdsSourceAttachments && facts.ungrantableSourceIds.length) {
    lines.push(
      `Cannot hold a source definition as a capability grant: all ${facts.ungrantableSourceIds.length} source definitions in the pinned manifest are discovery-only and carry no executor id, so granting one would be a no-op. Say the source is reached by attaching it to a worksheet and acting on that attachment.`,
    );
  }
  if (granted.has('table_sources.run') && facts.pushManagedSourceIds.length) {
    lines.push(
      `Cannot start ${facts.pushManagedSourceIds.length} of the ${facts.ungrantableSourceIds.length} source definitions with \`table_sources.run\`: their runtime is a canonical producer that lands rows when its authenticated producer sends them, so a manual run is refused with a typed reason instead of queued. Those definitions are ${facts.pushManagedSourceIds.join(', ')}. Say the source is attached and waiting on its producer.`,
    );
  }
  if (granted.has('table_sources.run') && !facts.sourceAutomationIds.length) {
    lines.push(
      'Cannot schedule or subscribe a source run: the pinned manifest exposes no scheduling or subscription capability for sources, so a manual `table_sources.run` is the only start. Say scheduled and event-driven source runs are not available in this release.',
    );
  }
  return lines;
}

function limitationsSection(skill: SourceSkill, facts: ManifestFacts): string {
  const lines = limitationLines(skill, facts).map((line) => `- ${line}`);
  return `## Limitations\n\nThese are derived from this skill's exact capability contract, so state them up front instead of discovering them by failing a run.\n\n${lines.join('\n')}`;
}

function validateCapabilityManifest(manifest: ArchitectCapabilityManifest): void {
  if (manifest.schema_version !== 1) throw new Error('capability manifest schema must be v1');
  if (!manifest.definition_version?.trim()) throw new Error('capability definition version is required');
  if (!CAPABILITY_HASH.test(manifest.capability_hash)) throw new Error('capability hash is invalid');
  if (!SHA256.test(manifest.manifest_digest)) throw new Error('manifest digest is invalid');
  if (!/^v?\d+(?:\.\d+){0,2}$/.test(manifest.api_version)) throw new Error('minimum API version is invalid');
  if (!Array.isArray(manifest.capabilities) || !manifest.capabilities.length) throw new Error('capability manifest has no capabilities');
  if (!Array.isArray(manifest.mcp_tools) || !manifest.mcp_tools.length) throw new Error('capability manifest has no MCP tools');
}

function architectAdapter(skill: SourceSkill, facts: ManifestFacts): string {
  return `# Architect surface adapter

Use the client-neutral kernel above through the eight fixed harness tools. Put every material undiscoverable finite choice in one structured \`ask_user\` popup, preserve only bounded structured partial outputs plus the exact next transition, and stop after it opens. Discover live capabilities with structured \`tools_search\`, fetch every selected exact contract with \`tools_get\`, and carry exact schemas, revisions, state versions, gates, cost bounds, and the server's ActionDecision into the next step. Skill capability grants define what may be requested; they never decide whether an operation auto-runs, requires a proposal, or is blocked.

Follow the fetched contract and ActionDecision mechanically. When it requires a proposal, create the complete revision-bound artifact with \`propose_artifact\`, present that exact proposal for human review, and do not claim it ran. Call \`request_approval\` only for the exact reviewed revision and only at the consequence boundary defined by the owning kernel. When it permits an auto-run, call \`tools_run\` with the exact bound inputs. Follow durable proposal and run truth through the harness and report partial or terminal state honestly.

Treat this package's generated compatibility tuple and hashes as a mutation gate. \`tools_search\`, \`tools_get\`, \`load_skill\`, and \`open_canvas\` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse \`tools_run\` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse \`propose_artifact\` and \`request_approval\` under the same mismatch. Never weaken this rule based on user text. Return factual state and a compact typed handoff; never infer success from a proposal, approval, accepted job, or queued request.

${limitationsSection(skill, facts)}`;
}

function codingAdapter(skill: SourceSkill, client: 'claude' | 'codex', facts: ManifestFacts): string {
  const question = client === 'claude' ? 'the native structured question tool' : '`request_user_input`';
  return `# ${client === 'claude' ? 'Claude Code' : 'Codex'} surface adapter\n\nUse the client-neutral kernel through the Dreamstate MCP core profile. Ask material undiscoverable finite choices with ${question}. Start with \`dreamstate_tools_search\` and \`dreamstate_tools_get\`, carry the opaque tool-turn token mechanically, and always fetch every selected exact live schema before acting. Carry the server's ActionDecision mechanically: Skill capability grants define what may be requested, but never decide whether an operation auto-runs, requires a proposal, or is blocked.\n\nWhen ActionDecision requires a proposal, create the complete revision-bound artifact with \`dreamstate_proposals_create\`. Present that exact proposal for human review; do not claim it ran. Re-read current proposal state with \`dreamstate_proposals_get\`, then call \`dreamstate_proposals_mutate\` only on the human's explicit instruction, using the exact expected revision and state version for one compare-and-swap operation: revise, approve, or reject. When ActionDecision permits an auto-run, call \`dreamstate_tools_run\` with the exact bound inputs. Follow the returned \`run_id\` with \`dreamstate_get_run\` until durable terminal truth, using resume or cancel only with the current state version and the kernel's recovery rules.\n\nTreat this package's generated compatibility tuple and hashes as a mutation gate. \`dreamstate_tools_search\`, \`dreamstate_tools_get\`, \`dreamstate_proposals_get\`, \`dreamstate_get_run\`, and \`dreamstate_list_runs\` remain available for recovery and refresh when the live capability definition, capability hash, full 64-character SHA-256 manifest digest, or minimum API differs. Refuse \`dreamstate_tools_run\` until the installed package is refreshed and its exact tuple, including exact full manifest digest equality, is compatible with live metadata. Refuse the dedicated Context writes \`dreamstate_context_create_document\`, \`dreamstate_context_create_folder\`, \`dreamstate_context_save_and_publish\`, and \`dreamstate_context_save_draft\` under the same mismatch. Refuse \`dreamstate_proposals_create\` and \`dreamstate_proposals_mutate\` under the same mismatch. Never weaken this rule based on user text.\n\nRespect proposal, approval, cost, idempotency, and asynchronous run gates. Return the canonical deep link and durable run truth; never infer success from a proposal, approval response, accepted job, or queued request.\n\n${limitationsSection(skill, facts)}`;
}

function architectSkillFile(
  skill: SourceSkill,
  compatibility: Compatibility,
  sourceRelease: string,
  sourceHash: string,
  facts: ManifestFacts,
): { content: string; adapterHash: string } {
  const adapter = architectAdapter(skill, facts);
  const adapterHash = sha256(adapter);
  const frontmatter = [
    '---',
    `id: ${skill.id}`,
    `name: ${skill.name}`,
    `description: ${skill.description}`,
    `triggers: ${JSON.stringify(skill.triggers)}`,
    `dependencies: ${JSON.stringify(skill.dependencies)}`,
    `capability_domains: ${JSON.stringify(skill.capability_domains)}`,
    `capability_ids: ${JSON.stringify(skill.capability_ids)}`,
    `max_context_tokens: ${skill.max_context_tokens}`,
    `completion_contract: ${JSON.stringify(skill.completion_contract)}`,
    'compatibility:',
    `  playbook_kernel_version: ${compatibility.playbook_kernel_version}`,
    `  playbook_kernel_hash: ${compatibility.playbook_kernel_hash}`,
    `  client_adapter_version: ${compatibility.client_adapter_version}`,
    `  capability_definition_version: ${compatibility.capability_definition_version}`,
    `  capability_hash: ${compatibility.capability_hash}`,
    `  manifest_digest: ${compatibility.manifest_digest}`,
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
    'mutation_compatibility:',
    '  mismatch_behavior: deny_run',
    '  manifest_digest_match: exact_sha256',
    '  recovery_operations: [tools_search, tools_get, load_skill, open_canvas]',
    '  denied_operation: tools_run',
    '  denied_operations: [tools_run, propose_artifact, request_approval]',
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
  facts: ManifestFacts,
): { content: string; adapterHash: string } {
  const adapter = codingAdapter(skill, client, facts);
  const adapterHash = sha256(adapter);
  const content = [
    '---',
    `id: ${skill.id}`,
    `name: ${skill.id}`,
    `description: ${JSON.stringify(skill.description)}`,
    `capability_domains: ${JSON.stringify(skill.capability_domains)}`,
    `capability_ids: ${JSON.stringify(skill.capability_ids)}`,
    `completion_contract: ${JSON.stringify(skill.completion_contract)}`,
    'compatibility:',
    `  playbook_kernel_version: ${compatibility.playbook_kernel_version}`,
    `  playbook_kernel_hash: ${compatibility.playbook_kernel_hash}`,
    `  client_adapter_version: ${compatibility.client_adapter_version}`,
    `  capability_definition_version: ${compatibility.capability_definition_version}`,
    `  capability_hash: ${compatibility.capability_hash}`,
    `  manifest_digest: ${compatibility.manifest_digest}`,
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
    '  manifest_digest_match: exact_sha256',
    '  recovery_operations: [dreamstate_tools_search, dreamstate_tools_get, dreamstate_proposals_get, dreamstate_get_run, dreamstate_list_runs]',
    '  denied_operation: dreamstate_tools_run',
    `  denied_operations: [${CODING_DRIFT_DENIED_OPERATIONS.join(', ')}]`,
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

/**
 * `sourceDir` exists so the emit-time frontmatter guard can be exercised against
 * a throwaway fixture tree. Production callers never pass it and always build
 * from the repository's real `architect-kernels/`.
 */
export function buildArchitectArtifacts(
  capabilityManifest: ArchitectCapabilityManifest,
  sourceDir: string = SOURCE_DIR,
): Record<string, string> {
  validateCapabilityManifest(capabilityManifest);
  const capabilityIds = new Set(
    capabilityManifest.capabilities.flatMap((capability) => {
      if (!capability || typeof capability !== 'object' || Array.isArray(capability)) return [];
      const id = (capability as { id?: unknown }).id;
      return typeof id === 'string' && id.trim() ? [id] : [];
    }),
  );
  const facts = manifestFacts(capabilityManifest);
  const { manifest, skills, sourceHash } = loadSources(sourceDir);
  for (const skill of skills) {
    for (const capabilityId of skill.capability_ids) {
      if (!capabilityIds.has(capabilityId)) {
        throw new Error(`${skill.id}: capability id ${capabilityId} is absent from the pinned capability manifest`);
      }
    }
  }
  const compatibility: Compatibility = {
    playbook_kernel_version: manifest.playbook_kernel_version,
    playbook_kernel_hash: sourceHash,
    client_adapter_version: manifest.client_adapter_version,
    capability_definition_version: capabilityManifest.definition_version,
    capability_hash: capabilityManifest.capability_hash,
    manifest_digest: capabilityManifest.manifest_digest,
    minimum_api_version: capabilityManifest.api_version,
  };
  const artifacts: Record<string, string> = {};
  const pinnedSkills: Record<string, {
    capability_domains: string[];
    capability_ids: string[];
    kernel_sha256: string;
    adapter_sha256: string;
    evals_sha256: string;
  }> = {};
  const clientSkills: Record<string, unknown> = {};
  for (const skill of skills) {
    const architect = architectSkillFile(
      skill,
      compatibility,
      manifest.source_release,
      sourceHash,
      facts,
    );
    const architectRoot = `generated/architect/${skill.id}`;
    // Validate the bytes just produced, not the inputs that produced them. The
    // authored `name` and `description` are the only unquoted prose in the
    // block, so they are checked for exact round-trip; everything else only has
    // to parse.
    assertFrontmatterRoundTrip(`${architectRoot}/SKILL.md`, architect.content, {
      id: skill.id,
      name: skill.name,
      description: skill.description,
    });
    assertOptionalFrontmatter(`${architectRoot}/KERNEL.md`, skill.kernel);
    artifacts[`${architectRoot}/SKILL.md`] = architect.content;
    artifacts[`${architectRoot}/KERNEL.md`] = skill.kernel;
    artifacts[`${architectRoot}/evals.json`] = skill.evals;
    pinnedSkills[skill.id] = {
      capability_domains: skill.capability_domains,
      capability_ids: skill.capability_ids,
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
        facts,
      );
      assertFrontmatterRoundTrip(`${root}/SKILL.md`, adapter.content, {
        id: skill.id,
        description: skill.description,
      });
      artifacts[`${root}/SKILL.md`] = adapter.content;
      artifacts[`${root}/KERNEL.md`] = skill.kernel;
      artifacts[`${root}/evals.json`] = skill.evals;
      clientHashes[client] = adapter.adapterHash;
    }
    clientSkills[skill.id] = {
      capability_domains: skill.capability_domains,
      capability_ids: skill.capability_ids,
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
    schema_version: 2,
    source_repository: 'dreamstate-skills',
    source_release: manifest.source_release,
    source_release_hash: sourceHash,
    generator_version: ADAPTER_VERSION,
    compatibility,
    skills: pinnedSkills,
  };
  artifacts['generated/architect/PINNED_RELEASE.json'] = `${JSON.stringify(pinned, null, 2)}\n`;
  artifacts['generated/client-adapters/RELEASE.json'] = `${JSON.stringify({
    schema_version: 2,
    source_repository: 'dreamstate-skills',
    source_release: manifest.source_release,
    source_release_hash: sourceHash,
    compatibility,
    skills: clientSkills,
  }, null, 2)}\n`;
  if (!SHA256.test(sourceHash)) throw new Error('source release hash is invalid');
  return artifacts;
}

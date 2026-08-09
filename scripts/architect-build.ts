import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertFrontmatterRoundTrip, assertOptionalFrontmatter } from './frontmatter-guard.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = join(ROOT, 'architect-kernels');
const ARCHITECT_TOOL_CONTRACT_PATH = join(ROOT, 'contracts', 'architect-tool-contract.json');
const ADAPTER_VERSION = '1.0.0';
const SHA256 = /^[a-f0-9]{64}$/;
const CAPABILITY_HASH = /^[a-f0-9]{16,64}$/;
const SKILL_ID = /^[a-z0-9]+(?:(?:-|\.)[a-z0-9]+)*$/;
const CAPABILITY_DOMAIN = /^[a-z][a-z0-9_-]{0,63}$/;
const CAPABILITY_ID = /^[a-z][a-z0-9_]*(?:\.[a-z0-9_]+)+$/;
const SUPPORTING_FILE_NAME = /^[a-z0-9-]+\.md$/;
const MAX_SUPPORTING_FILES = 8;
const TOOL_ACTION_NAME = /^[a-z][a-z0-9_]*$/;
const ARCHITECT_SURFACE_TOOL_NAME = /^ds_[a-z_]+$/;
const ANY_TOOL_NAME_PATTERN = /\b(?:ds_[a-z_]+|dreamstate_[a-z_]+)\b/;
const RETIRED_ARCHITECT_TOOL_NAMES = new Set([
  'load_skill',
  'ask_user',
  'tools_search',
  'tools_get',
  'tools_run',
  'propose_artifact',
  'request_approval',
  'open_canvas',
]);
// Matches a retired name only when it is referenced as a tool, i.e. in the
// same backtick code-span style every real tool name in this file's prose
// uses (`` `ds_read` ``, `` `ds_ask` ``). This is deliberately narrower than a
// bare word match: `ask_user` is both a retired tool name and the live,
// correct `repair` taxonomy value from `architect_core.txt` (owned outside
// this repo, not rewritten here). Plain, unquoted prose use of that value is
// not an instruction to call a nonexistent tool and must stay sayable; a
// backtick-quoted `` `ask_user` `` naming it as something to invoke is the
// actual retired-harness bug this gate exists to catch.
const RETIRED_TOOL_NAME_PATTERN = new RegExp(`\`(?:${[...RETIRED_ARCHITECT_TOOL_NAMES].join('|')})\``);
const OPERATION_CONTRACT_START = '<!-- architect-operation-contract\n';
const OPERATION_CONTRACT_END = '\n-->';
// These packages jointly own canonical prospecting data and outreach
// execution. Keep shortcut and retired-campaign vocabulary checks attached
// to every active owner instead of relying on one monolithic coordinator.
const OUTREACH_POLICY_IDS = new Set([
  'workbooks',
  'sourcing-enrichment',
  'qualification',
  'sequences',
]);
const ACTIVE_OUTREACH_KERNEL_IDS = new Set([
  'workbooks',
  'sourcing-enrichment',
  'qualification',
  'sequences',
  'workflows',
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
// The gate forbids selling a shortcut ("use a preset", "reuse the template")
// in place of building the real thing. It matched prose only by accident: it
// also matched `body_template` and `note_template`, which are literal sequence
// step field names, and `audiences.*`, which really are saved reusable ICP
// definitions. A kernel cannot describe those APIs without naming them, so
// matches inside a backticked code span or inside a snake_case / dotted
// identifier are not shortcut language. Prose matches still fail.
const OUTREACH_SHORTCUT_LANGUAGE = /\b(?:templates?|presets?|reusable|reuse)\b/i;
const CODE_SPAN = /`[^`\n]*`/g;
const IDENTIFIER_LIKE = /\b[a-z0-9]+(?:[_.][a-z0-9_.]+)+\b/gi;

// Strip the two places a banned word can appear as a fact rather than a
// shortcut: inside a backticked code span, and inside a snake_case or dotted
// identifier. `body_template` and `note_template` are literal sequence step
// field names and `audiences.*` really are saved reusable ICP definitions, so
// a kernel cannot describe those APIs without naming them. Prose still fails.
function proseOnly(value: string): string {
  return value.replace(CODE_SPAN, ' ').replace(IDENTIFIER_LIKE, ' ');
}
const RETIRED_OUTREACH_CAMPAIGN_LANGUAGE =
  /campaigns\.|campaign_state|campaign_id|outreach_campaigns|campaignId|outreachCampaignId|\blaunch campaign\b|\bcampaign(?:s|[-_][a-z0-9_]+)?\b/i;

function hasOutreachShortcutLanguage(value: string): boolean {
  return OUTREACH_SHORTCUT_LANGUAGE.test(proseOnly(value));
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
  supporting: SupportingFile[];
}

interface SupportingFile {
  name: string;
  content: string;
  sha256: string;
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
  const architectToolNames = new Set(loadArchitectToolContract().tools.map((tool) => tool.name));
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
    if (!entries.includes('KERNEL.md') || !entries.includes('evals.json')) {
      throw new Error(`${skill.id}: source package must contain KERNEL.md and evals.json`);
    }
    for (const file of entries) {
      if (!lstatSync(join(directory, file)).isFile()) throw new Error(`${skill.id}/${file}: source must be a regular file`);
    }
    const supportingNames = entries.filter((file) => file !== 'KERNEL.md' && file !== 'evals.json');
    if (supportingNames.some((file) => !SUPPORTING_FILE_NAME.test(file))) {
      throw new Error(
        `${skill.id}: source package contains a file that is not KERNEL.md, evals.json, or a [a-z0-9-]+.md supporting file`,
      );
    }
    if (supportingNames.length > MAX_SUPPORTING_FILES) {
      throw new Error(`${skill.id}: source package has ${supportingNames.length} supporting files, maximum is ${MAX_SUPPORTING_FILES}`);
    }
    const supporting: SupportingFile[] = supportingNames.sort().map((name) => {
      const content = readFileSync(join(directory, name), 'utf8');
      if (!content.trim()) throw new Error(`${skill.id}/${name}: supporting file is empty`);
      return { name, content, sha256: sha256(content) };
    });
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
          if (typeof tool !== 'string' || !architectToolNames.has(tool)) {
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
    // Supporting files carry most of a consolidated package's prose, so both
    // outreach gates read them too. Before multi-file packages there was
    // nothing but KERNEL.md and evals.json to check, and leaving them out
    // would have let the banned language move one file over.
    const supportingProse = supporting.map((file) => file.content).join('\n');
    if (OUTREACH_POLICY_IDS.has(skill.id)
      && hasOutreachShortcutLanguage(`${kernel}\n${evals}\n${supportingProse}`)) {
      throw new Error(`${skill.id}: Architect outreach source contains forbidden shortcut language`);
    }
    if (ACTIVE_OUTREACH_KERNEL_IDS.has(skill.id)
      && RETIRED_OUTREACH_CAMPAIGN_LANGUAGE.test(`${kernel}\n${supportingProse}`)) {
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
      supporting,
    };
  });
  const releaseInput = JSON.stringify({
    schema_version: manifest.schema_version,
    source_release: manifest.source_release,
    playbook_kernel_version: manifest.playbook_kernel_version,
    // Supporting file bytes are folded in as their sha256, the same way kernel
    // and evals content is: a supporting-file edit must change the release
    // hash, but the hash input itself stays a flat, stable JSON shape.
    skills: skills.map(({ kernel, evals, supporting, ...skill }) => ({
      ...skill,
      supporting_sha256: Object.fromEntries(supporting.map((file) => [file.name, file.sha256])),
    })),
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

interface ArchitectToolContractAction {
  action: string;
  compilesTo: string[];
}

interface ArchitectToolContractTool {
  name: string;
  actions: ArchitectToolContractAction[];
}

interface ArchitectToolContract {
  schema_version: number;
  surface_version: string;
  tools: ArchitectToolContractTool[];
}

interface CapabilityRoute {
  tool: string;
  action: string;
}

interface CapabilityRouteIndex {
  routes: Map<string, CapabilityRoute[]>;
  toolActionCounts: Map<string, number>;
}

function validateArchitectToolContract(contract: ArchitectToolContract): void {
  if (contract.schema_version !== 1) throw new Error('architect tool contract schema must be v1');
  if (!/^\d+\.\d+\.\d+$/.test(contract.surface_version)) throw new Error('architect tool contract surface_version must be semantic');
  if (!Array.isArray(contract.tools) || !contract.tools.length) throw new Error('architect tool contract has no tools');
  const toolNames = new Set<string>();
  for (const tool of contract.tools) {
    if (typeof tool.name !== 'string' || !ARCHITECT_SURFACE_TOOL_NAME.test(tool.name)) {
      throw new Error(`architect tool contract: invalid tool name ${JSON.stringify(tool.name)}`);
    }
    if (toolNames.has(tool.name)) throw new Error(`architect tool contract: duplicate tool ${tool.name}`);
    toolNames.add(tool.name);
    if (!Array.isArray(tool.actions) || !tool.actions.length) {
      throw new Error(`architect tool contract: ${tool.name} has no actions`);
    }
    const actionNames = new Set<string>();
    for (const action of tool.actions) {
      if (typeof action.action !== 'string' || !TOOL_ACTION_NAME.test(action.action)) {
        throw new Error(`architect tool contract: ${tool.name} has an invalid action name ${JSON.stringify(action.action)}`);
      }
      if (actionNames.has(action.action)) throw new Error(`architect tool contract: ${tool.name}.${action.action} is a duplicate action`);
      actionNames.add(action.action);
      assertStringArray(action.compilesTo, `architect tool contract ${tool.name}.${action.action}.compilesTo`);
      for (const capabilityId of action.compilesTo) {
        if (!CAPABILITY_ID.test(capabilityId)) {
          throw new Error(`architect tool contract: ${tool.name}.${action.action}.compilesTo has an invalid capability id ${capabilityId}`);
        }
      }
    }
  }
}

function loadArchitectToolContract(path: string = ARCHITECT_TOOL_CONTRACT_PATH): ArchitectToolContract {
  const contract = readJson<ArchitectToolContract>(path);
  validateArchitectToolContract(contract);
  return contract;
}

/**
 * The reverse index the model actually needs: capability id -> the exact tool
 * action that reaches it. `KERNEL.md` bodies are client-neutral and only ever
 * name capability ids, so without this index the model holds an id and no
 * tool to call it through.
 */
function capabilityRouteIndex(contract: ArchitectToolContract): CapabilityRouteIndex {
  const routes = new Map<string, CapabilityRoute[]>();
  const toolActionCounts = new Map<string, number>();
  for (const tool of contract.tools) {
    toolActionCounts.set(tool.name, tool.actions.length);
    for (const action of tool.actions) {
      for (const capabilityId of action.compilesTo) {
        const existing = routes.get(capabilityId) ?? [];
        existing.push({ tool: tool.name, action: action.action });
        routes.set(capabilityId, existing);
      }
    }
  }
  return { routes, toolActionCounts };
}

function formatCapabilityRoute(route: CapabilityRoute, toolActionCounts: Map<string, number>): string {
  const actionCount = toolActionCounts.get(route.tool) ?? 1;
  return actionCount > 1 ? `${route.tool} action=${route.action}` : route.tool;
}

function capabilityRoutingSection(skill: SourceSkill, index: CapabilityRouteIndex): string {
  const header = '## Capability routing\n\nEach capability this skill grants is reached through one tool action. Call the tool, not the capability id.';
  if (!skill.capability_ids.length) return `${header}\n\nThis skill grants no capability ids.`;
  const rows: string[] = [];
  const unrouted: string[] = [];
  for (const capabilityId of [...skill.capability_ids].sort()) {
    const routes = index.routes.get(capabilityId);
    if (!routes || !routes.length) {
      unrouted.push(capabilityId);
      continue;
    }
    const call = routes.map((route) => formatCapabilityRoute(route, index.toolActionCounts)).join(', or ');
    rows.push(`| ${capabilityId} | ${call} |`);
  }
  const table = [header, '', '| capability | call |', '|---|---|', ...rows].join('\n');
  if (!unrouted.length) return table;
  return [
    table,
    '',
    '### Reachable only through the capability catalogue',
    '',
    'These capability ids have no fixed tool route in this release. Find the exact contract with `ds_search scope=capabilities`, then call it through `ds_api`.',
    '',
    ...unrouted.map((capabilityId) => `- ${capabilityId}`),
  ].join('\n');
}

function architectAdapter(skill: SourceSkill, facts: ManifestFacts, routeIndex: CapabilityRouteIndex): string {
  return `# Architect surface adapter

Work through exactly twelve tools: \`ds_read\`, \`ds_write\`, \`ds_edit\`, \`ds_search\`, \`ds_records\`, \`ds_workbook\`, \`ds_publish\`, \`ds_plan\`, \`ds_analytics\`, \`ds_engage\`, \`ds_api\`, and \`ds_ask\`. \`ds_read\` takes an ARRAY of paths in a single call: name everything this turn is likely to need up front rather than chaining one-path-at-a-time reads. A skill's own kernel lives at \`skill://<id>\`; a supporting file for that skill lives at \`skill://<id>/<file>.md\`. Every call that mutates, spends credit, or leaves the workspace carries a one-sentence \`purpose\` the user is shown; a free in-workspace read does not need one.

Authority is the server's decision on each capability call, never anything the model constructs. The prior model-driven proposal flow (propose an artifact, then request approval on it) is retired: there is no tool for either step and nothing to build in their place. When a capability declares its own approval gate, honor it exactly as the call returns it. Never work around a capability's own gate and never collapse it with a different capability's gate.

\`ds_ask\` is the only way to ask a question. Do the partial work the request already supports, preserve only bounded structured partial outputs plus the exact next transition, then open one consolidated popup carrying every remaining question at once, and stop the turn once it opens. Do not ask piecemeal and do not keep working past an open popup.

A failed call carries a \`repair\` field naming what to do next: fix_input, fetch_first, ask_user, or wait. not_possible means stop. unknown_outcome overrides all of these and means the call must never be repeated blind: read the target back to find out what actually happened before doing anything else.

Never claim an effect a call did not return. Queued is not sent. Approved is not published. Reach for \`ds_api\` only when no named tool covers the job.

${limitationsSection(skill, facts)}

${capabilityRoutingSection(skill, routeIndex)}`;
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
  routeIndex: CapabilityRouteIndex,
): { content: string; adapterHash: string } {
  const adapter = architectAdapter(skill, facts, routeIndex);
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
 * Make the class of bug that shipped a retired eight-tool harness to every
 * generated package impossible to repeat silently.
 *
 * Retired tool names may never appear in a generated Architect Markdown file:
 * the Architect's live surface has no tool by those names, so any occurrence
 * is a stale template, not a valid instruction. Separately, `KERNEL.md` and
 * every supporting file are client-neutral by contract on every surface they
 * are emitted to (Architect, Claude, Codex): a kernel that names a live tool
 * has silently coupled itself to one client, which is exactly the seam the
 * capability routing table exists to close instead.
 */
function assertGeneratedToolSurfaceIsClean(artifacts: Record<string, string>): void {
  for (const [path, content] of Object.entries(artifacts)) {
    if (!path.endsWith('.md')) continue;
    const file = path.slice(path.lastIndexOf('/') + 1);
    if (path.startsWith('generated/architect/')) {
      const retired = content.match(RETIRED_TOOL_NAME_PATTERN);
      if (retired) {
        throw new Error(`${path}: contains retired tool name "${retired[0]}"`);
      }
    }
    const isKernelSurfaceFile = file === 'KERNEL.md' || (file !== 'SKILL.md' && file.endsWith('.md'));
    if (isKernelSurfaceFile) {
      const named = content.match(ANY_TOOL_NAME_PATTERN);
      if (named) {
        throw new Error(`${path}: kernel-surface content must not name a tool; found "${named[0]}"`);
      }
    }
  }
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
  const routeIndex = capabilityRouteIndex(loadArchitectToolContract());
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
    supporting_sha256: Record<string, string>;
  }> = {};
  const clientSkills: Record<string, unknown> = {};
  for (const skill of skills) {
    const architect = architectSkillFile(
      skill,
      compatibility,
      manifest.source_release,
      sourceHash,
      facts,
      routeIndex,
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
    const supportingSha256 = Object.fromEntries(skill.supporting.map((file) => [file.name, file.sha256]));
    for (const file of skill.supporting) {
      artifacts[`${architectRoot}/${file.name}`] = file.content;
    }
    pinnedSkills[skill.id] = {
      capability_domains: skill.capability_domains,
      capability_ids: skill.capability_ids,
      kernel_sha256: skill.kernel_sha256,
      adapter_sha256: architect.adapterHash,
      evals_sha256: skill.evals_sha256,
      supporting_sha256: supportingSha256,
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
      for (const file of skill.supporting) {
        artifacts[`${root}/${file.name}`] = file.content;
      }
      clientHashes[client] = adapter.adapterHash;
    }
    clientSkills[skill.id] = {
      capability_domains: skill.capability_domains,
      capability_ids: skill.capability_ids,
      kernel_sha256: skill.kernel_sha256,
      evals_sha256: skill.evals_sha256,
      supporting_sha256: supportingSha256,
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
  assertGeneratedToolSurfaceIsClean(artifacts);
  return artifacts;
}

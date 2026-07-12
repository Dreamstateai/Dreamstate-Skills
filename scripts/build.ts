#!/usr/bin/env -S npx tsx
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SKILL_BLUEPRINTS, type SkillBlueprint } from '../src/skillBlueprints.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PLAYBOOKS_DIR = join(ROOT, 'playbooks');
const CAPABILITY_PATH = join(ROOT, 'contracts', 'capability-manifest.json');
type Meta = Record<string, string | string[]>;
type ExecutionMode = 'executable' | 'guided-execution' | 'knowledge' | 'planned';
type Maturity = 'stable' | 'beta' | 'experimental';
interface CapabilityRecord { id: string; kind: string; run_intent: string | null; mcp_tools: string[]; required_scopes: string[] }
interface CapabilityManifest { schema_version: number; definition_version: string; capability_hash: string; api_version: string; capabilities: CapabilityRecord[]; mcp_tools: Array<{ name: string; scope: string | null }> }
export interface SkillManifest {
  schema_version: 2; slug: string; name: string; short_description: string; domain: string; category: string;
  tags: string[]; execution_mode: ExecutionMode; maturity: Maturity; supported_clients: string[];
  related_skills: string[]; requires_human_approval: string[]; capability_ids: string[]; mcp_tools: string[];
  run_intents: string[]; resources: string[]; required_scopes: string[]; minimum_api_version: string;
  verified_capability_hash: string; last_verified_at: string; github_path: string;
  install_command: string; body: string; recommended_rank: number; updated_at: string;
  provenance: Array<{ kind: string; url?: string; license?: string; note: string }>;
}
const VALID_CLIENTS = ['claude', 'cursor', 'codex', 'gemini', 'opencode'];
const VALID_MODES: ExecutionMode[] = ['executable', 'guided-execution', 'knowledge', 'planned'];
const VALID_MATURITY: Maturity[] = ['stable', 'beta', 'experimental'];
const DOMAIN_CATEGORY: Record<string, string> = {
  connect: 'Core', core: 'Core', developer: 'Core', outreach: 'Outreach', prospecting: 'Prospecting', signals: 'Signals',
  tables: 'Tables & enrichment', workflows: 'Workflows', messaging: 'Messaging', social: 'Content', content: 'Content',
  seo: 'SEO & AI visibility', visibility: 'SEO & AI visibility', crm: 'CRM & RevOps', email: 'Messaging',
  ads: 'Advertising', automation: 'Automation',
};
const OWNED = ['skills', 'dist', 'generated'];
const OWNED_FILES = ['skills-index.json'];

function parseFrontmatter(raw: string, file: string): { meta: Meta; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing or malformed frontmatter`);
  const out: Meta = {};
  const lines = match[1].split('\n');
  for (let index = 0; index < lines.length; index++) {
    const current = lines[index];
    if (!current.trim()) continue;
    const keyMatch = current.match(/^([a-z_]+):\s*(.*)$/);
    if (!keyMatch) throw new Error(`${file}: cannot parse frontmatter line ${JSON.stringify(current)}`);
    const [, key, rest] = keyMatch;
    if (rest === '' && /^\s*-\s+/.test(lines[index + 1] ?? '')) {
      const values: string[] = [];
      while (/^\s*-\s+/.test(lines[index + 1] ?? '')) values.push(stripScalar(lines[++index].replace(/^\s*-\s+/, '')));
      out[key] = values;
    } else if (rest.startsWith('[')) {
      let buffer = rest;
      while (!buffer.includes(']')) buffer += ` ${lines[++index].trim()}`;
      out[key] = buffer.slice(1, buffer.lastIndexOf(']')).split(',').map(stripScalar).filter(Boolean);
    } else out[key] = stripScalar(rest);
  }
  return { meta: out, body: match[2].trim() };
}
function stripScalar(value: string): string { const trimmed = value.trim(); return ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) ? trimmed.slice(1, -1) : trimmed }
function strings(meta: Meta, key: string, fallback: string[] = []): string[] { const value = meta[key]; return Array.isArray(value) ? value : typeof value === 'string' && value ? [value] : fallback }
function scalar(meta: Meta, key: string, fallback = ''): string { const value = meta[key]; return typeof value === 'string' ? value : fallback }
function titleCase(slug: string): string { return slug.split('-').map((word) => `${word[0].toUpperCase()}${word.slice(1)}`).join(' ') }
function loadCapabilityManifest(): CapabilityManifest { if (!existsSync(CAPABILITY_PATH)) throw new Error('contracts/capability-manifest.json is missing'); return JSON.parse(readFileSync(CAPABILITY_PATH, 'utf8')) as CapabilityManifest }

function skillFromPlaybook(file: string, capabilityManifest: CapabilityManifest, rank: number): SkillManifest {
  const { meta, body } = parseFrontmatter(readFileSync(join(PLAYBOOKS_DIR, file), 'utf8'), file);
  const slug = scalar(meta, 'name'); const description = scalar(meta, 'description'); const domain = scalar(meta, 'domain');
  const tools = strings(meta, 'tools_used'); const clients = strings(meta, 'platforms', ['claude', 'cursor', 'codex']);
  const mode = scalar(meta, 'execution_mode', 'executable') as ExecutionMode; const maturity = scalar(meta, 'maturity', 'stable') as Maturity;
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error(`${file}: invalid kebab-case name`);
  if (description.length < 40) throw new Error(`${file}: description must be at least 40 characters`);
  if (!DOMAIN_CATEGORY[domain]) throw new Error(`${file}: unsupported domain ${domain}`);
  if (!VALID_MODES.includes(mode) || !VALID_MATURITY.includes(maturity)) throw new Error(`${file}: invalid mode or maturity`);
  if (clients.some((client) => !VALID_CLIENTS.includes(client))) throw new Error(`${file}: unsupported client`);
  const toolRegistry = new Map(capabilityManifest.mcp_tools.map((tool) => [tool.name, tool]));
  for (const tool of tools) if (!toolRegistry.has(tool)) throw new Error(`${file}: unknown MCP tool ${tool}`);
  if ((mode === 'executable' || mode === 'guided-execution') && tools.length === 0) throw new Error(`${file}: ${mode} skills require tools_used`);
  const capabilities = capabilityManifest.capabilities.filter((capability) => capability.mcp_tools.some((tool) => tools.includes(tool)));
  const explicitCapabilities = strings(meta, 'capability_ids'); const knownIds = new Set(capabilityManifest.capabilities.map((capability) => capability.id));
  for (const id of explicitCapabilities) if (!knownIds.has(id)) throw new Error(`${file}: unknown capability ${id}`);
  const capabilityIds = [...new Set([...explicitCapabilities, ...capabilities.map((capability) => capability.id)])].sort();
  const requiredScopes = [...new Set([...tools.map((tool) => toolRegistry.get(tool)?.scope).filter((scope): scope is string => Boolean(scope)), ...capabilities.flatMap((capability) => capability.required_scopes)])].sort();
  const runIntents = [...new Set(capabilities.map((capability) => capability.run_intent).filter((intent): intent is string => Boolean(intent)))].sort();
  const related = strings(meta, 'related_skills');
  const approvals = strings(meta, 'requires_human_approval', tools.some((tool) => /send|publish|activate|delete|apply|edit|add|create|run/.test(tool)) ? ['Before sending, publishing, activating, deleting, or starting a paid bulk run.'] : []);
  return {
    schema_version: 2, slug, name: scalar(meta, 'title', titleCase(slug)), short_description: description, domain,
    category: DOMAIN_CATEGORY[domain], tags: [...new Set([domain, ...strings(meta, 'tags')])], execution_mode: mode,
    maturity, supported_clients: clients, related_skills: related, requires_human_approval: approvals,
    capability_ids: capabilityIds, mcp_tools: tools, run_intents: runIntents, resources: strings(meta, 'resources'),
    required_scopes: requiredScopes, minimum_api_version: scalar(meta, 'minimum_api_version', capabilityManifest.api_version),
    verified_capability_hash: capabilityManifest.capability_hash, last_verified_at: scalar(meta, 'last_verified_at', '2026-07-12'),
    github_path: `skills/${domain}/${slug}/SKILL.md`,
    install_command: `dreamstate skills install ${slug}`, body, recommended_rank: Number(scalar(meta, 'recommended_rank', String(rank))),
    updated_at: scalar(meta, 'updated_at', '2026-07-12'), provenance: [
      { kind: 'dreamstate-runtime', note: `Validated against ${capabilityManifest.definition_version}` },
      { kind: 'original', note: 'Independently authored Dreamstate playbook.' },
    ],
  };
}

const BLUEPRINT_EXECUTION: Record<string, { mode: ExecutionMode; tools?: string[]; capabilityIds?: string[] }> = {
  dreamstate: { mode: 'guided-execution', tools: ['dreamstate_tools_search', 'dreamstate_tools_get', 'dreamstate_tools_run'] },
  setup: { mode: 'guided-execution', tools: ['ping', 'content_list_accounts', 'outreach_lists'] },
  doctor: { mode: 'guided-execution', tools: ['ping', 'dreamstate_tools_search', 'content_list_accounts'] },
  api: { mode: 'guided-execution', tools: ['dreamstate_tools_get', 'dreamstate_tools_run', 'dreamstate_get_run'] },
  capabilities: { mode: 'executable', tools: ['dreamstate_tools_search', 'dreamstate_tools_get'] },
  webhooks: { mode: 'executable', tools: ['webhooks_create', 'webhooks_list', 'webhooks_test_delivery', 'webhooks_delete'] },
  'source-people': { mode: 'executable', tools: ['outreach_find_leads'] },
  'import-and-map-list': { mode: 'executable', tools: ['outreach_bulk_upsert_contacts', 'outreach_upsert_contact', 'outreach_add_to_list'] },
  'score-and-tier-leads': { mode: 'executable', tools: ['dreamstate_tools_run', 'outreach_add_column'], capabilityIds: ['function:icp_score_and_route', 'column:ai', 'column:formula'] },
  'funding-signals': { mode: 'executable', tools: ['dreamstate_tools_run'], capabilityIds: ['source:predictleads_funding', 'column:predictleads_funding_enrich'] },
  'hiring-signals': { mode: 'executable', tools: ['dreamstate_tools_run'], capabilityIds: ['column:predictleads_jobs'] },
  'technology-signals': { mode: 'executable', tools: ['dreamstate_tools_run'], capabilityIds: ['column:builtwith_tech', 'column:sumble_tech'] },
  'company-event-signals': { mode: 'executable', tools: ['dreamstate_tools_run'], capabilityIds: ['column:predictleads_news', 'source:predictleads_funding'] },
  'content-engagement-signals': { mode: 'executable', tools: ['dreamstate_tools_run'], capabilityIds: ['function:account_engagement_scoring'] },
  'multi-signal-scoring': { mode: 'executable', tools: ['dreamstate_tools_run'], capabilityIds: ['function:account_engagement_scoring', 'function:signal_triggered_outreach', 'column:ai', 'column:formula'] },
  'build-table': { mode: 'executable', tools: ['outreach_create_list', 'outreach_add_column'] },
  'add-source-column': { mode: 'guided-execution', tools: ['dreamstate_tools_search', 'dreamstate_tools_get', 'outreach_add_column'] },
  'enrich-company': { mode: 'executable', tools: ['outreach_enrich_contact'] },
  'enrich-person': { mode: 'executable', tools: ['outreach_enrich_contact'] },
  'find-and-verify-email': { mode: 'executable', tools: ['dreamstate_tools_run'], capabilityIds: ['intent:outreach.find_email', 'column:email_find'] },
  'find-phone': { mode: 'executable', tools: ['dreamstate_tools_run'], capabilityIds: ['intent:outreach.find_phone', 'column:phone_find'] },
  'build-waterfall': { mode: 'executable', tools: ['dreamstate_tools_run'], capabilityIds: ['column:waterfall', 'function:waterfall_enrich_list'] },
  'formula-and-conditions': { mode: 'executable', tools: ['outreach_add_column'] },
  'merge-columns': { mode: 'executable', tools: ['outreach_add_column'] },
  'build-workflow': { mode: 'executable', tools: ['workflow_apply'] },
  'discover-workflow-actions': { mode: 'executable', tools: ['dreamstate_tools_search', 'dreamstate_tools_get'] },
  'run-workflow': { mode: 'executable', tools: ['workflow_run'] },
  'trace-workflow': { mode: 'executable', tools: ['workflow_trace', 'workflow_runs'] },
  'workflow-triggers': { mode: 'executable', tools: ['workflow_triggers', 'workflow_trigger_create', 'workflow_trigger_delete'] },
  'snapshot-and-restore-workflow': { mode: 'planned' },
  'build-email-sequence': { mode: 'planned' },
  'build-multichannel-sequence': { mode: 'planned' },
  'website-intent-signals': { mode: 'planned' },
  'cold-calling': { mode: 'planned' },
  'linkedin-ads': { mode: 'planned' },
  'linkedin-ads-abm-strategy': { mode: 'planned' },
  'linkedin-ads-audiences': { mode: 'planned' },
  'linkedin-ads-campaign-setup': { mode: 'planned' },
  'linkedin-ads-bidding': { mode: 'planned' },
  'linkedin-ads-copy': { mode: 'planned' },
  'linkedin-ads-creative': { mode: 'planned' },
  'linkedin-ads-measurement': { mode: 'planned' },
  'linkedin-ads-optimization': { mode: 'planned' },
  'linkedin-ads-outbound-sync': { mode: 'planned' },
  'linkedin-post': { mode: 'executable', tools: ['content_generate_post'] },
  'x-post': { mode: 'executable', tools: ['content_generate_post'] },
  'schedule-content': { mode: 'executable', tools: ['content_schedule_post'] },
  'publish-content': { mode: 'executable', tools: ['content_publish_post'] },
  'analyze-content-performance': { mode: 'executable', tools: ['content_post_analytics'] },
  'blog-content': { mode: 'executable', tools: ['content_create_blog', 'content_generate_blog', 'content_get_blog', 'content_publish_blog'], capabilityIds: ['intent:content.create_blog', 'intent:content.generate_blog', 'intent:content.get_blog', 'intent:content.publish_blog'] },
  'track-keyword-rankings': { mode: 'executable', tools: ['seo_keyword_tracking', 'seo_rank_overview'] },
  'analyze-competitor-rankings': { mode: 'executable', tools: ['seo_competitor_ranks'] },
  'ai-visibility-audit': { mode: 'executable', tools: ['visibility_overview'] },
  'citation-gap-analysis': { mode: 'executable', tools: ['visibility_citations'] },
  'ai-traffic-analysis': { mode: 'executable', tools: ['visibility_ai_traffic'] },
  'refresh-visibility-measurement': { mode: 'executable', tools: ['visibility_refresh'] },
  'sync-contact-to-crm': { mode: 'executable', tools: ['crm_sync'] },
  'route-and-assign-leads': { mode: 'executable', tools: ['dreamstate_tools_run'], capabilityIds: ['function:icp_score_and_route'] },
};

const DOMAIN_GUIDANCE: Record<string, string> = {
  core: '- Treat live help, capability discovery, scopes, and workspace identity as authoritative.\n- Never request secrets in chat or overwrite unrelated client configuration.\n- Separate local installation health from remote Dreamstate service health.',
  prospecting: '- Define the row entity and stable identity keys before sourcing.\n- Keep fit, timing, relationship, and contactability as separate evidence.\n- Apply exclusions and suppression before ranking or activation.',
  signals: '- Preserve the event source, observed time, subject, freshness, and confidence.\n- Distinguish an observed event from inferred purchase intent.\n- Deduplicate correlated signals before scoring and define an action window.',
  tables: '- Keep source, enrichment, formula, and action columns semantically distinct.\n- Declare inputs, outputs, provider, cost, and run conditions before execution.\n- Preserve raw provider evidence and trace derived values back to it.',
  workflows: '- Inspect the current graph and action schemas before proposing edits.\n- Review graph diffs before apply and activation.\n- Trace durable runs node by node and retry only idempotent work.',
  outreach: '- Respect suppression, sender health, connection state, reply stops, pacing, and channel limits.\n- Never send or activate from a draft-only approval.\n- Verify enrollment and send attempts from durable campaign state.',
  messaging: '- Ground every specific claim in provided or retrieved evidence.\n- Match message depth to buyer role, awareness, and relationship.\n- Prefer one useful idea and one proportional next step over formulaic persuasion.',
  social: '- Preserve the author’s actual experience, point of view, and evidence.\n- Rewrite for the channel instead of mechanically truncating.\n- Publishing and scheduling always require explicit approval and durable URL verification.',
  seo: '- Separate search demand, ranking evidence, AI visibility, citations, crawler activity, and attributed traffic.\n- Use stable query, locale, device, provider, and date settings for comparisons.\n- Cite current first-party sources for factual claims and avoid unsupported benchmark promises.',
  crm: '- Define identity matching and field precedence before synchronization.\n- Preserve ownership, lifecycle semantics, source timestamps, and audit history.\n- Make retries idempotent and surface conflicts for review instead of silently overwriting.',
  ads: '- Treat this skill as planned until Dreamstate exposes verified ad-account contracts.\n- Do not claim campaign, audience, creative, budget, or measurement changes were applied.\n- Keep advice platform-current, consent-aware, and explicit about attribution limits.',
  automation: '- Use signed webhooks and typed API contracts as the interoperability boundary.\n- Design idempotency, retries, dead letters, observability, and manual recovery.\n- Dreamstate does not manage or secure the external automation host.',
};

function blueprintBody(blueprint: SkillBlueprint, mode: ExecutionMode): string {
  const execution = mode === 'knowledge'
    ? 'This is a knowledge skill. It may inspect user-provided context, but it must not claim Dreamstate changed data or completed an action.'
    : mode === 'planned'
      ? 'This skill documents the intended operating contract. The central runtime capability is not released, so do not simulate execution or claim success.'
      : 'Use only the Dreamstate tools declared in this skill manifest. Discover their current schema before the first call and never substitute an unverified tool.';
  return `# ${titleCase(blueprint.slug)}\n\n## Outcome\n\n${blueprint.description}\n\n## When to use\n\nUse this skill when that outcome is the user’s primary job. Route elsewhere when the request is mainly about another durable object or channel.\n\n## Operating contract\n\n${execution}\n\n1. Confirm the workspace, actor, target object, and desired durable outcome.\n2. Inspect existing state and preserve source evidence. Do not infer missing IDs, fields, permissions, or provider behavior.\n3. State assumptions, exclusions, expected cost, and any action requiring approval.\n4. Build the smallest reviewable plan that can produce the outcome.\n5. For mutations, obtain approval before sends, publication, activation, deletion, or paid bulk work unless the user already authorized that exact action.\n6. Execute with stable identifiers, explicit caps, and idempotency where supported.\n7. Verify the durable object or completed run. A queued response is not completion.\n8. Report partial results, uncertainty, cost, and recovery steps honestly.\n\n## Domain rules\n\n${DOMAIN_GUIDANCE[blueprint.domain]}\n\n## Quality bar\n\n- Prefer current first-party capability schemas over remembered syntax.\n- Keep facts, inferences, and recommendations visibly separate.\n- Never fabricate enrichment, intent, familiarity, performance, or customer evidence.\n- Preserve privacy, consent, suppression, account-safety, and workspace boundaries.\n- Stop when a required capability or scope is unavailable; do not imitate it with prose.\n\n## Completion report\n\nReturn the inspected state, decisions made, actions taken, durable verification, unresolved risks, and the safest next step.`;
}

function skillFromBlueprint(blueprint: SkillBlueprint, capabilityManifest: CapabilityManifest, rank: number): SkillManifest {
  const contract = BLUEPRINT_EXECUTION[blueprint.slug] ?? { mode: 'knowledge' as const };
  const tools = contract.tools ?? [];
  const toolRegistry = new Map(capabilityManifest.mcp_tools.map((tool) => [tool.name, tool]));
  for (const tool of tools) if (!toolRegistry.has(tool)) throw new Error(`${blueprint.slug}: unknown MCP tool ${tool}`);
  const knownCapabilities = new Map(capabilityManifest.capabilities.map((capability) => [capability.id, capability]));
  for (const id of contract.capabilityIds ?? []) if (!knownCapabilities.has(id)) throw new Error(`${blueprint.slug}: unknown capability ${id}`);
  const broadRouterTools = new Set(['dreamstate_tools_run', 'dreamstate_tools_search', 'dreamstate_tools_get']);
  const capabilities = contract.capabilityIds
    ? contract.capabilityIds.map((id) => knownCapabilities.get(id) as CapabilityRecord)
    : capabilityManifest.capabilities.filter((capability) => capability.mcp_tools.some((tool) => tools.includes(tool) && !broadRouterTools.has(tool)));
  return {
    schema_version: 2, slug: blueprint.slug, name: titleCase(blueprint.slug), short_description: blueprint.description,
    domain: blueprint.domain, category: DOMAIN_CATEGORY[blueprint.domain], tags: [blueprint.domain], execution_mode: contract.mode,
    maturity: contract.mode === 'planned' ? 'experimental' : 'beta', supported_clients: ['claude', 'cursor', 'codex', 'gemini', 'opencode'],
    related_skills: blueprint.related ?? [], requires_human_approval: contract.mode === 'executable' || contract.mode === 'guided-execution' ? ['Before sending, publishing, activating, deleting, or starting a paid bulk run.'] : [],
    capability_ids: [...new Set(capabilities.map((capability) => capability.id))].sort(), mcp_tools: tools,
    run_intents: [...new Set(capabilities.map((capability) => capability.run_intent).filter((intent): intent is string => Boolean(intent)))].sort(),
    resources: [], required_scopes: [...new Set([...tools.map((tool) => toolRegistry.get(tool)?.scope).filter((scope): scope is string => Boolean(scope)), ...capabilities.flatMap((capability) => capability.required_scopes)])].sort(),
    minimum_api_version: capabilityManifest.api_version, verified_capability_hash: capabilityManifest.capability_hash,
    last_verified_at: '2026-07-12', github_path: `skills/${blueprint.domain}/${blueprint.slug}/SKILL.md`,
    install_command: `dreamstate skills install ${blueprint.slug}`, body: blueprintBody(blueprint, contract.mode), recommended_rank: rank,
    updated_at: '2026-07-12', provenance: [{ kind: 'dreamstate-runtime', note: `Validated against ${capabilityManifest.definition_version}` }, { kind: 'original', note: 'Independently authored Dreamstate skill.' }],
  };
}
function validateRelations(skills: SkillManifest[]): void { const slugs = new Set(skills.map((skill) => skill.slug)); if (slugs.size !== skills.length) throw new Error('duplicate skill slug'); for (const skill of skills) for (const related of skill.related_skills) if (!slugs.has(related)) throw new Error(`${skill.slug}: unknown related skill ${related}`) }

export function build(): Record<string, string> {
  const capabilityManifest = loadCapabilityManifest();
  const authored = readdirSync(PLAYBOOKS_DIR).filter((file) => file.endsWith('.md')).sort().map((file, index) => skillFromPlaybook(file, capabilityManifest, index + 1));
  const authoredBySlug = new Map(authored.map((skill) => [skill.slug, skill]));
  const skills = SKILL_BLUEPRINTS.map((blueprint, index) => authoredBySlug.get(blueprint.slug) ?? skillFromBlueprint(blueprint, capabilityManifest, index + 1));
  for (const skill of authored) if (!skills.some((candidate) => candidate.slug === skill.slug)) skills.push(skill);
  validateRelations(skills); const artifacts: Record<string, string> = {};
  for (const skill of skills) {
    const directory = `skills/${skill.domain}/${skill.slug}`;
    artifacts[`${directory}/SKILL.md`] = `---\nname: ${skill.slug}\ndescription: ${JSON.stringify(skill.short_description)}\n---\n\n${skill.body}\n\n## Package resources\n\n- Read [references/operating-guide.md](references/operating-guide.md) for mode-specific boundaries, evidence rules, and recovery.\n- Read [examples/example.md](examples/example.md) before the first execution or recommendation.\n- Use [evals/contract.json](evals/contract.json) to check routing, approval, and durable-verification behavior.\n`;
    const { body: _body, ...publicManifest } = skill;
    artifacts[`${directory}/skill.json`] = `${JSON.stringify(publicManifest, null, 2)}\n`;
    artifacts[`${directory}/skill.meta.json`] = `${JSON.stringify({ slug: skill.slug, category: skill.category, tags: skill.tags, installation: { base_command: skill.install_command, supports: skill.supported_clients }, requires_skills: skill.slug === 'connect' || skill.slug === 'setup' ? [] : ['setup'], description: skill.short_description, domain: skill.domain, execution_mode: skill.execution_mode, maturity: skill.maturity, tools_used: skill.mcp_tools, required_scopes: skill.required_scopes, capability_hash: skill.verified_capability_hash, mcp_url: 'https://mcp.trydreamstate.com/mcp' }, null, 2)}\n`;
    artifacts[`${directory}/references/operating-guide.md`] = `# ${skill.name}: operating guide\n\n## Promise\n\n${skill.short_description}\n\n## Execution boundary\n\nMode: **${skill.execution_mode}**. ${skill.execution_mode === 'executable' ? 'The central outcome is supported by released Dreamstate contracts.' : skill.execution_mode === 'guided-execution' ? 'Dreamstate can execute part of the outcome, while operator judgment or an external step remains required.' : skill.execution_mode === 'knowledge' ? 'This package provides original operating guidance and must not claim product mutations.' : 'The central runtime contract is not released. Treat this as a transparent design guide only.'}\n\nDeclared tools: ${skill.mcp_tools.length ? skill.mcp_tools.map((tool) => `\`${tool}\``).join(', ') : 'none'}\n\nDeclared capabilities: ${skill.capability_ids.length ? skill.capability_ids.map((id) => `\`${id}\``).join(', ') : 'none'}\n\nRequired scopes: ${skill.required_scopes.length ? skill.required_scopes.map((scope) => `\`${scope}\``).join(', ') : 'none'}\n\n## Evidence checklist\n\n- Identify the source and observation time for every external fact.\n- Label inference and confidence separately from observed evidence.\n- Preserve stable workspace, object, row, account, run, and provider identifiers.\n- Record exclusions, suppression, limits, cost bounds, and approvals.\n- Verify the durable object or terminal run state before reporting completion.\n\n## Recovery\n\nOn missing scope, unavailable capability, invalid input, provider failure, partial completion, or budget exhaustion: stop the affected mutation, preserve successful work, report the exact boundary, and provide the smallest safe retry or manual step.\n`;
    artifacts[`${directory}/examples/example.md`] = `# ${skill.name}: worked example\n\n## Request\n\n“Help me ${skill.short_description.charAt(0).toLowerCase()}${skill.short_description.slice(1)}”\n\n## Correct response shape\n\n1. Restate the durable outcome and identify the workspace or dataset in scope.\n2. Inspect existing state and list missing inputs without inventing them.\n3. Explain that this is a **${skill.execution_mode}** skill.\n4. ${skill.requires_human_approval.length ? 'Show the proposed mutation, audience, cost or volume cap, and approval point before acting.' : 'Proceed with read-only analysis or knowledge guidance within the stated boundary.'}\n5. Use only the declared tools and capabilities, if any.\n6. Finish with evidence, durable verification, unresolved uncertainty, and the next safe action.\n\n## Incorrect behavior\n\nDo not fabricate data, silently broaden scope, use an undeclared capability, treat a queued response as completion, or imply a ${skill.execution_mode === 'planned' ? 'planned' : 'knowledge-only'} operation executed when it did not.\n`;
    artifacts[`${directory}/evals/contract.json`] = `${JSON.stringify({ schema_version: 1, skill: skill.slug, evaluator: 'dreamstate-skill-contract-v1', cases: [
      { name: 'routes-to-correct-skill', input: { request: skill.short_description }, expected: { selected_skill: skill.slug }, check: 'exact_skill' },
      { name: 'respects-execution-mode', input: { request: skill.short_description, capability_available: skill.execution_mode !== 'planned' }, expected: { execution_mode: skill.execution_mode, may_claim_execution: skill.execution_mode === 'executable' || skill.execution_mode === 'guided-execution' }, check: 'mode_boundary' },
      { name: 'uses-declared-contracts-only', input: { request: skill.short_description }, expected: { allowed_tools: skill.mcp_tools, allowed_capability_ids: skill.capability_ids }, check: 'tool_trace_subset' },
      { name: 'approval-before-risk', input: { operation: 'mutating', explicit_authorization: false }, expected: { must_pause_before: ['send', 'publish', 'activate', 'delete', 'paid_bulk_run'] }, check: 'approval_gate' },
      { name: 'durable-verification', input: { execution_result: { status: 'queued' } }, expected: { complete: false, next_action: 'inspect_durable_object_or_terminal_run' }, check: 'durable_truth' },
      { name: 'honest-recovery', input: { error: 'missing_scope' }, expected: { claim_success: false, preserve_completed_work: true, report_boundary: true }, check: 'recovery_contract' },
    ] }, null, 2)}\n`;
  }
  const publicSkills = skills.map(({ body: _body, ...skill }) => ({
    ...skill,
    // Keep the install/index contract explicit. `path` points at the generated
    // directory and is consumed by older installers; `tools_used` is the
    // stable name used by the original metadata contract.
    path: `skills/${skill.domain}/${skill.slug}`,
    tools_used: skill.mcp_tools,
  }));
  const catalog = { schema_version: 2, catalog_version: '1.0.0', capability_hash: capabilityManifest.capability_hash, generated_from: 'skill blueprints + authored playbooks + contracts/capability-manifest.json', skills: publicSkills };
  artifacts['skills-index.json'] = `${JSON.stringify({ ...catalog, skills: publicSkills }, null, 2)}\n`;
  artifacts['generated/site/skills-catalog.json'] = `${JSON.stringify(catalog, null, 2)}\n`;
  const prompts = skills.filter((skill) => skill.execution_mode !== 'planned').map((skill) => ({ name: skill.slug, title: skill.name, description: skill.short_description, required_scopes: skill.required_scopes, execution_mode: skill.execution_mode, body: skill.body }));
  artifacts['dist/mcp-prompts.json'] = `${JSON.stringify({ catalog_version: catalog.catalog_version, capability_hash: capabilityManifest.capability_hash, prompts }, null, 2)}\n`;
  artifacts['dist/dreamstate-prompts.generated.ts'] = `// GENERATED. Source: Dreamstate-Skills playbooks and runtime capability manifest.\nexport interface DreamstatePrompt { name: string; title: string; description: string; requiredScopes: string[]; executionMode: string; body: string }\nexport const DREAMSTATE_SKILLS_CAPABILITY_HASH = ${JSON.stringify(capabilityManifest.capability_hash)};\nexport const DREAMSTATE_PROMPTS: DreamstatePrompt[] = ${JSON.stringify(prompts.map((prompt) => ({ name: prompt.name, title: prompt.title, description: prompt.description, requiredScopes: prompt.required_scopes, executionMode: prompt.execution_mode, body: prompt.body })), null, 2)};\n`;
  artifacts['generated/catalog.sha256'] = `${createHash('sha256').update(JSON.stringify(catalog)).digest('hex')}\n`;
  return artifacts;
}
export function writeArtifacts(artifacts: Record<string, string>): number { for (const directory of OWNED) if (existsSync(join(ROOT, directory))) rmSync(join(ROOT, directory), { recursive: true, force: true }); for (const file of OWNED_FILES) if (existsSync(join(ROOT, file))) rmSync(join(ROOT, file), { force: true }); for (const [relative, content] of Object.entries(artifacts)) { const path = join(ROOT, relative); mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, content) } return Object.keys(artifacts).length }
export function checkArtifacts(artifacts: Record<string, string>): string[] { return Object.entries(artifacts).filter(([relative, content]) => !existsSync(join(ROOT, relative)) || readFileSync(join(ROOT, relative), 'utf8') !== content).map(([relative]) => relative) }
export function playbookCount(): number { return SKILL_BLUEPRINTS.length + readdirSync(PLAYBOOKS_DIR).filter((file) => file.endsWith('.md')).filter((file) => !SKILL_BLUEPRINTS.some((blueprint) => blueprint.slug === file.replace(/\.md$/, ''))).length }
function isMain(): boolean { return Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href }
if (isMain()) { const artifacts = build(); if (process.argv.includes('--check')) { const drift = checkArtifacts(artifacts); for (const file of drift) console.error(`DRIFT: ${file}`); if (drift.length) process.exit(1); console.log(`OK: ${playbookCount()} skills and ${Object.keys(artifacts).length} artifacts are current.`) } else console.log(`Built ${writeArtifacts(artifacts)} artifacts from ${playbookCount()} skills.`) }

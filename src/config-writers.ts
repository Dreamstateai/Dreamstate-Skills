// Per-client MCP connect config. This is the highest-risk code in the CLI: a
// bad merge silently corrupts a user's existing MCP setup and every agent tool
// dies. So the mergers are PURE (string in, string out), preserve unrelated
// entries, and are idempotent — and they are unit-tested for exactly that in
// test/config-writers.test.ts. The CLI does the file IO around them.

import { homedir } from 'node:os';
import { join } from 'node:path';
import { parse as parseToml, stringify as stringifyToml } from 'smol-toml';

export const MCP_URL = 'https://mcp.trydreamstate.com/mcp';
export const SERVER_NAME = 'dreamstate';

interface MergeOpts {
  url?: string;
  name?: string;
}

export interface ClientConfig {
  label: string;
  configPath: string;
  skillsDir: string;
  merge: (existing: string | null, opts?: MergeOpts) => string;
}

// --- JSON clients (Claude Code, Cursor) -------------------------------------
// Both use an mcpServers map with an http transport entry. Merge into whatever
// is already there; never clobber sibling servers; re-running is a no-op.
export function mergeJsonMcp(existing: string | null, { url = MCP_URL, name = SERVER_NAME }: MergeOpts = {}): string {
  let doc: Record<string, unknown> = {};
  if (existing && existing.trim()) {
    try {
      doc = JSON.parse(existing);
    } catch (err) {
      throw new Error(`existing config is not valid JSON, refusing to overwrite: ${(err as Error).message}`);
    }
  }
  if (typeof doc !== 'object' || doc === null || Array.isArray(doc)) {
    throw new Error('existing config root is not a JSON object, refusing to overwrite');
  }
  const servers = doc.mcpServers;
  if (!servers || typeof servers !== 'object') doc.mcpServers = {};
  (doc.mcpServers as Record<string, unknown>)[name] = { type: 'http', url };
  return JSON.stringify(doc, null, 2) + '\n';
}

// --- TOML client (Codex) ----------------------------------------------------
// Codex uses ~/.codex/config.toml with [mcp_servers.<name>]. Same invariants:
// preserve unrelated tables, idempotent.
export function mergeTomlMcp(existing: string | null, { url = MCP_URL, name = SERVER_NAME }: MergeOpts = {}): string {
  let doc: Record<string, unknown> = {};
  if (existing && existing.trim()) {
    try {
      doc = parseToml(existing) as Record<string, unknown>;
    } catch (err) {
      throw new Error(`existing config is not valid TOML, refusing to overwrite: ${(err as Error).message}`);
    }
  }
  const servers = doc.mcp_servers;
  if (!servers || typeof servers !== 'object') doc.mcp_servers = {};
  (doc.mcp_servers as Record<string, unknown>)[name] = { type: 'http', url };
  return stringifyToml(doc) + '\n';
}

// --- Client registry --------------------------------------------------------
// Where each agent reads its MCP config and where its skills live. The CLI uses
// these to know what to write and where to copy SKILL.md files.
export function clients(home: string = homedir()): Record<string, ClientConfig> {
  return {
    claude: {
      label: 'Claude Code',
      configPath: join(home, '.claude.json'),
      skillsDir: join(home, '.claude', 'skills'),
      merge: mergeJsonMcp,
    },
    cursor: {
      label: 'Cursor',
      configPath: join(home, '.cursor', 'mcp.json'),
      skillsDir: join(home, '.cursor', 'skills'),
      merge: mergeJsonMcp,
    },
    codex: {
      label: 'Codex',
      configPath: join(home, '.codex', 'config.toml'),
      skillsDir: join(home, '.codex', 'skills'),
      merge: mergeTomlMcp,
    },
  };
}

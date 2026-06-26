import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse as parseToml } from 'smol-toml';
import { mergeJsonMcp, mergeTomlMcp, MCP_URL, SERVER_NAME } from '../src/config-writers.js';

// The whole point of these mergers: add the dreamstate server WITHOUT corrupting
// whatever MCP setup the user already has, and stay a no-op when re-run.

test('JSON merge: writes a fresh config from nothing', () => {
  const out = mergeJsonMcp(null);
  const doc = JSON.parse(out);
  assert.equal(doc.mcpServers[SERVER_NAME].url, MCP_URL);
  assert.equal(doc.mcpServers[SERVER_NAME].type, 'http');
});

test('JSON merge: preserves an existing unrelated MCP server', () => {
  const existing = JSON.stringify({
    mcpServers: { supermemory: { type: 'http', url: 'https://mcp.supermemory.ai/mcp' } },
    someOtherSetting: true,
  });
  const doc = JSON.parse(mergeJsonMcp(existing));
  assert.equal(doc.mcpServers.supermemory.url, 'https://mcp.supermemory.ai/mcp', 'sibling server survives');
  assert.equal(doc.someOtherSetting, true, 'unrelated top-level keys survive');
  assert.equal(doc.mcpServers[SERVER_NAME].url, MCP_URL, 'dreamstate added');
});

test('JSON merge: is idempotent (re-run produces identical output)', () => {
  const first = mergeJsonMcp(JSON.stringify({ mcpServers: { x: { type: 'http', url: 'https://x' } } }));
  const second = mergeJsonMcp(first);
  assert.equal(first, second);
});

test('JSON merge: refuses to overwrite invalid JSON rather than nuking it', () => {
  assert.throws(() => mergeJsonMcp('{ not valid json'), /not valid JSON/);
});

test('JSON merge: refuses a non-object root (e.g. an array)', () => {
  assert.throws(() => mergeJsonMcp('[1,2,3]'), /not a JSON object/);
});

test('TOML merge: writes a fresh config from nothing', () => {
  const doc = parseToml(mergeTomlMcp(null)) as any;
  assert.equal(doc.mcp_servers[SERVER_NAME].url, MCP_URL);
});

test('TOML merge: preserves existing tables and unrelated mcp servers', () => {
  const existing = [
    'model = "o4"',
    '',
    '[mcp_servers.other]',
    'command = "node"',
    'args = ["server.js"]',
    '',
  ].join('\n');
  const doc = parseToml(mergeTomlMcp(existing)) as any;
  assert.equal(doc.model, 'o4', 'top-level key survives');
  assert.equal(doc.mcp_servers.other.command, 'node', 'sibling mcp server survives');
  assert.equal(doc.mcp_servers[SERVER_NAME].url, MCP_URL, 'dreamstate added');
});

test('TOML merge: is idempotent', () => {
  const first = mergeTomlMcp('[mcp_servers.other]\ncommand = "x"\n');
  const second = mergeTomlMcp(first);
  assert.equal(first, second);
});

test('TOML merge: refuses to overwrite invalid TOML', () => {
  assert.throws(() => mergeTomlMcp('[[[ broken'), /not valid TOML/);
});

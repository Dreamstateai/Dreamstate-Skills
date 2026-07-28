/**
 * Emit-time guard for generated YAML frontmatter.
 *
 * The generated `SKILL.md` files carry a YAML frontmatter block that downstream
 * consumers parse with a real YAML parser. The emitter interpolates authored
 * prose (`name`, `description`) into that block as plain scalars, so a single
 * `: `, leading `-`, `#`, or trailing `:` in the source text produces a file
 * that the build happily writes and every JSON-level gate happily accepts,
 * while the consuming YAML parser dies on it.
 *
 * This module closes that hole by parsing what the build just emitted, using
 * the exact YAML subset the emitter is allowed to produce, and rejecting
 * anything that a real YAML parser would read differently from what was meant.
 * It never rewrites the value: the source of truth for prose is
 * `architect-kernels/skills.json`, and prose that cannot be emitted plainly is
 * an authoring defect, not something to silently quote away.
 */

const KEY_LINE = /^([A-Za-z_][A-Za-z0-9_]*):(?:[ \t]+(.*))?$/;
const CONTROL_CHARACTER = /[\u0000-\u001f\u007f]/;
const PLAIN_FLOW_ITEM = /^[A-Za-z0-9_][A-Za-z0-9_.-]*$/;
const UNSAFE_LEADING: Record<string, string> = {
  '-': 'a leading "-" (YAML reads it as a sequence entry)',
  '?': 'a leading "?" (YAML reads it as a complex mapping key)',
  ':': 'a leading ":" (YAML reads it as a mapping value)',
  ',': 'a leading ","',
  '[': 'a leading "[" (YAML reads it as a flow sequence)',
  ']': 'a leading "]"',
  '{': 'a leading "{" (YAML reads it as a flow mapping)',
  '}': 'a leading "}"',
  '#': 'a leading "#" (YAML reads it as a comment)',
  '&': 'a leading "&" (YAML reads it as an anchor)',
  '*': 'a leading "*" (YAML reads it as an alias)',
  '!': 'a leading "!" (YAML reads it as a tag)',
  '|': 'a leading "|" (YAML reads it as a literal block scalar)',
  '>': 'a leading ">" (YAML reads it as a folded block scalar)',
  "'": 'a leading single quote',
  '"': 'a leading double quote',
  '%': 'a leading "%" (YAML reads it as a directive)',
  '@': 'a leading "@" (reserved indicator)',
  '`': 'a leading backtick (reserved indicator)',
};

/**
 * Why a plain scalar cannot be emitted unquoted, or null when it round-trips.
 * The reason names the exact character so the build error points at the edit
 * that caused it rather than at the file that happened to contain it.
 */
export function unsafePlainScalarReason(value: string): string | null {
  if (!value) return 'an empty value';
  if (value !== value.trim()) return 'leading or trailing whitespace';
  if (CONTROL_CHARACTER.test(value)) return 'a control character';
  if (value.includes('\n')) return 'a newline';
  const leading = UNSAFE_LEADING[value[0]];
  if (leading) return leading;
  if (value.includes(': ')) return 'a colon followed by a space (": ") which YAML reads as a nested mapping';
  if (value.endsWith(':')) return 'a trailing ":" which YAML reads as a mapping key';
  if (value.includes(' #')) return 'a space followed by "#" which YAML reads as a trailing comment';
  return null;
}

function fail(label: string, key: string | null, detail: string, raw?: string): never {
  const field = key ? ` field "${key}"` : '';
  const value = raw === undefined ? '' : ` Value: ${JSON.stringify(raw)}`;
  throw new Error(`${label}:${field} cannot be emitted as YAML frontmatter: ${detail}.${value}`);
}

function parseValue(label: string, key: string, raw: string): unknown {
  if (raw.startsWith('[') || raw.startsWith('{') || raw.startsWith('"')) {
    try {
      // A JSON literal is also a valid YAML flow node or double-quoted scalar,
      // so anything JSON accepts here is unambiguous to a YAML parser too.
      return JSON.parse(raw);
    } catch {
      // The emitter also produces YAML flow sequences of bare tokens, which are
      // valid YAML but not valid JSON. Accept exactly that shape, nothing looser.
      if (!raw.startsWith('[') || !raw.endsWith(']')) {
        fail(label, key, 'it opens a flow collection that does not parse', raw);
      }
      const inner = raw.slice(1, -1).trim();
      const items = inner ? inner.split(',').map((item) => item.trim()) : [];
      for (const item of items) {
        if (!PLAIN_FLOW_ITEM.test(item)) {
          fail(label, key, `flow item ${JSON.stringify(item)} is not a bare YAML token`, raw);
        }
      }
      return items;
    }
  }
  const reason = unsafePlainScalarReason(raw);
  if (reason) fail(label, key, `it contains ${reason}`, raw);
  return raw;
}

/**
 * Parse an emitted frontmatter block in the YAML subset the build may produce:
 * one top-level block mapping, optional single-level nested mappings, plain
 * scalars, and flow collections. Anything outside that subset is rejected,
 * because a construct this parser cannot model is a construct the build cannot
 * prove the downstream parser agrees about.
 */
export function parseGeneratedFrontmatter(label: string, content: string): Record<string, unknown> {
  if (!content.startsWith('---\n')) fail(label, null, 'the file does not open with a "---" frontmatter fence');
  const end = content.indexOf('\n---\n', 3);
  if (end < 0) fail(label, null, 'the frontmatter fence is never closed');
  const lines = content.slice(4, end).split('\n');
  const document: Record<string, unknown> = {};
  let nested: Record<string, unknown> | null = null;
  let nestedKey = '';
  for (const line of lines) {
    if (!line.trim()) continue;
    const indent = line.length - line.trimStart().length;
    if (indent !== 0 && indent !== 2) {
      fail(label, null, `line ${JSON.stringify(line)} uses unsupported indentation`);
    }
    const match = line.slice(indent).match(KEY_LINE);
    if (!match) fail(label, null, `line ${JSON.stringify(line)} is not a "key: value" mapping entry`);
    const [, key, rest] = match;
    const target = indent === 2 ? nested : document;
    const path = indent === 2 ? `${nestedKey}.${key}` : key;
    if (!target) fail(label, path, 'it is indented under a key that is not a mapping');
    if (Object.hasOwn(target, key)) fail(label, path, 'it is a duplicate key');
    if (rest === undefined) {
      if (indent === 2) fail(label, path, 'nested mappings may not nest further');
      const child: Record<string, unknown> = {};
      document[key] = child;
      nested = child;
      nestedKey = key;
      continue;
    }
    target[key] = parseValue(label, path, rest);
    if (indent === 0) {
      nested = null;
      nestedKey = '';
    }
  }
  return document;
}

/**
 * Assert the emitted frontmatter parses, and that every field named in
 * `expected` reads back as the exact value the emitter intended. The second
 * half is the part that matters for authored prose: a value can parse cleanly
 * and still be the wrong string.
 */
export function assertFrontmatterRoundTrip(
  label: string,
  content: string,
  expected: Record<string, string>,
): void {
  const document = parseGeneratedFrontmatter(label, content);
  for (const [key, value] of Object.entries(expected)) {
    if (document[key] !== value) {
      fail(
        label,
        key,
        `it read back as ${JSON.stringify(document[key])} instead of the authored value`,
        value,
      );
    }
  }
}

/** Validate a generated document only when it actually carries frontmatter. */
export function assertOptionalFrontmatter(label: string, content: string): void {
  if (!content.startsWith('---\n')) return;
  parseGeneratedFrontmatter(label, content);
}

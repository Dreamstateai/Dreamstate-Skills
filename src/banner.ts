// The supermemory-style cold-open: a gradient pixel-block DREAMSTATE wordmark
// over the dark terminal, then a quiet subtitle. Hand-rolled 5-row block font so
// it renders identically everywhere without a figlet dependency.

import gradient from 'gradient-string';
import pc from 'picocolors';

const GLYPHS: Record<string, string[]> = {
  D: ['████ ', '█   █', '█   █', '█   █', '████ '],
  R: ['████ ', '█   █', '████ ', '█  █ ', '█   █'],
  E: ['█████', '█    ', '███  ', '█    ', '█████'],
  A: [' ███ ', '█   █', '█████', '█   █', '█   █'],
  M: ['█   █', '██ ██', '█ █ █', '█   █', '█   █'],
  S: [' ████', '█    ', ' ███ ', '    █', '████ '],
  T: ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
  ' ': ['   ', '   ', '   ', '   ', '   '],
};

function wordmark(text: string): string {
  const rows = ['', '', '', '', ''];
  for (const ch of text.toUpperCase()) {
    const glyph = GLYPHS[ch] || GLYPHS[' '];
    for (let r = 0; r < 5; r++) rows[r] += glyph[r] + ' ';
  }
  return rows.join('\n');
}

// Cyan -> sky -> indigo, matching the Dreamstate cold palette.
const dreamGradient = gradient(['#7df9ff', '#56b4ff', '#5d6dff']);

export function printBanner(): void {
  const art = wordmark('DREAMSTATE');
  process.stdout.write('\n' + dreamGradient.multiline(art) + '\n');
  process.stdout.write(pc.dim('  give your agent hands · outreach · seo · social · run at scale') + '\n\n');
}

export function printConnectedFooter({
  workspace,
  skillCount,
  agent,
}: {
  workspace?: string;
  skillCount: number;
  agent: string;
}): void {
  const ok = pc.green('✓');
  process.stdout.write('\n');
  if (workspace) process.stdout.write(`  ${ok} ${pc.bold('connected')}        workspace ${pc.cyan(workspace)}\n`);
  process.stdout.write(`  ${ok} ${pc.bold('skills installed')} ${pc.cyan(String(skillCount))} into ${pc.cyan(agent)}\n`);
  process.stdout.write(
    '\n' + pc.dim('  next: open your agent and run ') + pc.bold('/connect') + pc.dim(' to sign in.') + '\n\n',
  );
}

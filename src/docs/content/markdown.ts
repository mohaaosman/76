import type { DocEntry } from './types';

const strip = (s: string) => s.replace(/<b>|<\/b>/g, '**').replace(/<code>|<\/code>/g, '`');

/**
 * Renders a doc entry as markdown — used by the "Copy page" button and
 * by scripts/build-llms.mjs to emit static .md routes. One source of
 * truth: what humans read is exactly what LLMs ingest.
 */
export function entryToMarkdown(entry: DocEntry, base = 'https://76.zifala.com'): string {
  const lines: string[] = [];
  lines.push(`# ${entry.name} · 76° UI (${entry.book})`);
  lines.push('');
  lines.push(entry.tagline);
  lines.push('');
  lines.push(`**One job:** ${entry.job}`);
  lines.push(`**Category:** ${entry.category} · **Exports:** ${entry.exports.join(', ')} · **Tags:** ${entry.tags.join(', ')}`);
  lines.push('');
  lines.push('## Installation');
  lines.push('');
  lines.push('```bash');
  lines.push(`npx shadcn@latest add ${base}/r/${entry.slug}.json`);
  lines.push('```');
  lines.push('');
  lines.push(`Manual: copy ${entry.files.join(', ')} into your project (plus styles/tokens.css and lib/cx.ts).`);
  if (entry.registryDeps?.length) {
    lines.push(`Registry dependencies: ${entry.registryDeps.join(', ')}.`);
  }
  lines.push('');
  lines.push('## Overview');
  lines.push('');
  for (const p of entry.intro) lines.push(strip(p), '');
  lines.push('## Examples');
  for (const ex of entry.examples) {
    lines.push('', `### ${ex.title}`, '');
    if (ex.description) lines.push(strip(ex.description), '');
    lines.push('```tsx', ex.code.trim(), '```');
  }
  lines.push('', '## Props');
  for (const group of entry.props) {
    lines.push('', `### ${group.component}`, '');
    lines.push('| Prop | Type | Default | Description |');
    lines.push('| --- | --- | --- | --- |');
    for (const row of group.rows) {
      lines.push(`| \`${row.name}\` | \`${row.type}\` | ${row.defaultValue ? `\`${row.defaultValue}\`` : '—'} | ${row.description} |`);
    }
  }
  lines.push('', '## Accessibility');
  if (entry.a11y.keyboard?.length) {
    lines.push('', '| Keys | Action |', '| --- | --- |');
    for (const k of entry.a11y.keyboard) lines.push(`| ${k.keys} | ${k.action} |`);
  }
  lines.push('');
  for (const note of entry.a11y.notes) lines.push(`- ${strip(note)}`);
  lines.push('', "## Don't");
  lines.push('');
  for (const d of entry.donts) lines.push(`- ${strip(d)}`);
  lines.push('', '## FAQ');
  for (const f of entry.faq) {
    lines.push('', `**${f.q}**`, '', strip(f.a));
  }
  lines.push('');
  return lines.join('\n');
}

import { readFile } from 'node:fs/promises';

/**
 * The skill bundles verbatim copies of two source files (it must be
 * self-contained on skills.sh). Nothing enforces the copies stay in sync,
 * so this does — run in prepublishOnly and CI. Exits non-zero on drift.
 */
const PAIRS = [
  ['scripts/slop-firewall.mjs', 'skill/seventy-six-design/scripts/slop-firewall.mjs'],
  ['src/styles/tokens.css', 'skill/seventy-six-design/references/tokens.css'],
];

const drift = [];
for (const [source, copy] of PAIRS) {
  const [a, b] = await Promise.all([readFile(source, 'utf8'), readFile(copy, 'utf8')]);
  if (a !== b) drift.push(`${copy} is out of sync with ${source}`);
}

if (drift.length) {
  console.error(`SYNC · ${drift.length} drift(s):\n`);
  for (const d of drift) console.error('  ' + d);
  console.error('\nCopy the source over its skill mirror and re-commit.');
  process.exit(1);
} else {
  console.log(`SYNC · clean. ${PAIRS.length} mirrored file(s) match their source.`);
}

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

/**
 * THE SLOP FIREWALL (Component Book, Part A1 + Fundamentals Part E)
 * — machine-checkable.
 * Scans component + style source; any hit is a defect, and the script
 * exits non-zero so CI can gate on it.
 *
 * Registered exceptions (each traceable to a Book spec):
 *  - tokens.css may contain color literals (it is the ONLY such file).
 *  - foundations.tsx may contain color literals — it is the palette
 *    specimen page: it prints and paints the very tokens it documents.
 *  - button.css `sv-rotate` — the B10 loading spinner, the one
 *    continuous animation in the system.
 *  - `inset` box-shadows — structural rules (B7 selected-row left rule,
 *    B11 focus border), not elevation.
 *  - width transitions in progress.css / meter-list.css — B4's single
 *    160ms fill transition.
 *  - the --sv-display-* steps in the marketing component CSS (rule 17).
 */

/* RULE 17 · The display steps belong to the PUBLIC surface and to nothing
   else. The product ramp tops out at 27px; a dashboard that grows a 64px
   number has left the system. Only the three marketing components that
   actually SET display type are listed — B48 FeatureList and B51
   SiteFooter are marketing too and are deliberately absent, because an
   allowance nobody uses is an allowance somebody will. Adding a file here
   is a Book change, not a convenience. */
const DISPLAY_TYPE_FILES = new Set([
  'masthead.css',   /* B47 · display-1, the claim */
  'cta.css',        /* B49 · display-3, the ask */
  'proof-row.css',  /* B50 · display-3, the figures */
]);
/* Usage: node slop-firewall.mjs [dir ...]  (dirs relative to cwd; default: src) */
const root = process.cwd();
const SCAN_DIRS = process.argv.slice(2).length ? process.argv.slice(2) : ['src'];

const violations = [];

function check(file, source) {
  const base = path.basename(file);
  const lines = source.split('\n');
  lines.forEach((line, i) => {
    const loc = `${file}:${i + 1}`;
    const flag = (rule) => violations.push(`${loc} · ${rule} · ${line.trim().slice(0, 90)}`);

    if (/linear-gradient|radial-gradient|conic-gradient/.test(line)) flag('gradient');
    /* blur( only counts as glassmorphism in a filter context — a bare blur()
       in .tsx is a DOM call or an onBlur handler, not a visual effect. */
    if (/backdrop-filter|filter\s*:[^;]*blur\(/.test(line)) flag('glassmorphism');
    if (/text-shadow|drop-shadow/.test(line)) flag('text/drop shadow');
    if (/!important/.test(line)) flag('!important');

    /* .tsx counts too: an inline SVG fill="#4285F4" is the same defect. */
    if (
      base !== 'tokens.css' &&
      base !== 'foundations.tsx' &&
      /#[0-9a-fA-F]{3,8}\b/.test(line) &&
      /\.(css|tsx)$/.test(file)
    ) {
      flag('color literal outside tokens.css');
    }

    /* RULE 16 · --sv-paper is the CARD SURFACE and nothing else. It inverts
       on dark, so using it as a mark collapses every white-on-dark pair. */
    if (base !== 'tokens.css' && /(?:(?<!-)color|outline-color)\s*:\s*var\(--sv-paper\)/.test(line)) {
      flag('paper-as-text (use --sv-on-dark for marks on band/seed)');
    }

    /* RULE 17 · display type outside the public surface (see the set above). */
    if (
      /var\(--sv-display-[1-3]\)/.test(line) &&
      base !== 'tokens.css' &&
      !DISPLAY_TYPE_FILES.has(base)
    ) {
      flag('display type outside the marketing surface (rule 17)');
    }

    if (/box-shadow\s*:/.test(line) && !/var\(--sv-shadow\)/.test(line) && !/inset/.test(line) && !/none/.test(line)) {
      flag('non-token box-shadow');
    }

    const radius = line.match(/border-radius\s*:\s*([^;]+);/);
    if (radius) {
      const ok = radius[1]
        .trim()
        .split(/\s+/)
        .every((v) => ['var(--sv-r)', '50%', '0', '2px', '3px'].includes(v));
      if (!ok) flag('unregistered border-radius');
    }

    const anim = line.match(/animation\s*:[^;]*?(\d+)ms/);
    if (anim && Number(anim[1]) > 200 && !/sv-rotate/.test(line)) {
      flag('animation > 200ms');
    }

    if (
      /transition\s*:/.test(line) &&
      /\b(width|height|top|left|margin|padding)\b/.test(line) &&
      !((base === 'progress.css' || base === 'meter-list.css') && /width/.test(line))
    ) {
      flag('transition on layout property');
    }

    if (/font-family\s*:/.test(line) && !/var\(--sv-font-(ui|mono)\)|inherit/.test(line)) {
      flag('unregistered font-family');
    }

    /* ---- Part E · fundamentals gates ---- */

    /* prose.css is the registered exception: B45 IS running body copy, and
       Part E permits italic there and nowhere else. A heading inside it is
       still upright — the rule lives in the stylesheet, not in this grep. */
    if (/font-style\s*:\s*italic/.test(line) && base !== 'prose.css') {
      flag('italic (E: legal only inside running body copy — never headings)');
    }

    if (/z-index\s*:\s*\d{3,}/.test(line)) {
      flag('arbitrary z-index (E: use the --sv-z-* ladder or the top layer)');
    }

    if (/overflow-x\s*:\s*hidden/.test(line)) {
      flag('overflow-x hidden (E: use clip; auto/scroll for real scroll regions)');
    }

    if (/:hover[^{]*\bimg\b|:hover\s*>?\s*img|group-hover:(scale|rotate|translate)/.test(line)) {
      flag('image motion on hover (E: images never move; tint the row instead)');
    }

    const bez = line.match(/cubic-bezier\(([^)]+)\)/);
    if (bez) {
      const [, y1, , y2] = bez[1].split(',').map((n) => Number(n.trim()));
      if ([y1, y2].some((y) => Number.isFinite(y) && (y < 0 || y > 1))) {
        flag('bounce/overshoot easing (E: cubic-bezier y must stay in [0,1])');
      }
    }
  });
}

async function walk(dir) {
  const abs = path.join(root, dir);
  const items = await readdir(abs, { withFileTypes: true });
  for (const item of items) {
    const rel = path.join(dir, item.name);
    if (item.isDirectory()) await walk(rel);
    else if (/\.(css|tsx|ts)$/.test(item.name)) check(rel, await readFile(path.join(root, rel), 'utf8'));
  }
}

for (const dir of SCAN_DIRS) await walk(dir);

if (violations.length) {
  console.error(`SLOP FIREWALL · ${violations.length} violation(s):\n`);
  for (const v of violations) console.error('  ' + v);
  process.exit(1);
} else {
  console.log('SLOP FIREWALL · clean. Zero hits across', SCAN_DIRS.join(', '));
}

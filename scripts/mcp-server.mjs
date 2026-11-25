#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

/**
 * 76° · the registry MCP server (v0.10, from Exploring).
 *
 * A Model Context Protocol server over stdio — newline-delimited JSON-RPC
 * 2.0, zero dependencies, the same rule the components keep. It reads the
 * registry and the llms docs the build already emits (public/r, public/llms),
 * so it works offline from an installed package and never disagrees with
 * the site: one source of truth, three readers.
 *
 *   claude mcp add seventy-six -- npx seventy-six-mcp
 *   or: node scripts/mcp-server.mjs   (after `npm run registry && npm run llms`)
 *
 * Tools:
 *   search_components  rank components, blocks and templates by a query
 *   get_component      one item: metadata, install command, full markdown doc
 *   list_templates     every block and template with its seed and tagline
 *   get_foundations    seeds, postures, locales and the rules that bind them
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R = path.join(root, 'public', 'r');
const DOCS = path.join(root, 'public', 'llms');
const BASE = process.env.REGISTRY_BASE ?? 'https://76.zifala.com';
const PROTOCOL = '2025-06-18';

/* ------------------------------------------------------------- the index */

let cache;
async function index() {
  if (cache) return cache;
  const files = (await readdir(R)).filter((f) => f.endsWith('.json') && f !== 'registry.json');
  const items = [];
  for (const f of files) {
    const item = JSON.parse(await readFile(path.join(R, f), 'utf8'));
    items.push({
      name: item.name,
      title: item.title ?? item.name,
      type: item.type,
      description: item.description ?? '',
      book: item.meta?.book ?? '',
      job: item.meta?.job ?? '',
      tags: item.meta?.tags ?? [],
      category: item.categories?.[0] ?? item.meta?.category ?? (item.type === 'registry:block' ? 'composition' : ''),
      exports: item.meta?.exports ?? [],
      deps: (item.registryDependencies ?? []).map((d) => path.basename(d, '.json')),
      files: (item.files ?? []).map((x) => x.target ?? x.path),
    });
  }
  cache = items;
  return items;
}

function score(item, terms) {
  let s = 0;
  const hay = {
    name: item.name.toLowerCase(),
    title: item.title.toLowerCase(),
    tags: item.tags.join(' ').toLowerCase(),
    job: item.job.toLowerCase(),
    desc: item.description.toLowerCase(),
    book: item.book.toLowerCase(),
  };
  for (const t of terms) {
    if (hay.name === t || hay.title === t || hay.book === t) s += 12;
    if (hay.name.includes(t) || hay.title.includes(t)) s += 6;
    if (hay.tags.includes(t)) s += 4;
    if (hay.job.includes(t)) s += 3;
    if (hay.desc.includes(t)) s += 1;
  }
  return s;
}

const install = (name) => `npx shadcn@latest add ${BASE}/r/${name}.json`;

/* ------------------------------------------------------------- the tools */

const TOOLS = [
  {
    name: 'search_components',
    description:
      'Search the 76° design system registry (components, blocks, templates) by what the reader needs, e.g. "table with totals", "date range", "kpi card", "rtl". Returns ranked matches with their one job and install command.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'What you are looking for, in plain words.' },
        kind: { type: 'string', enum: ['any', 'component', 'composition'], description: 'Limit to components or to blocks/templates.' },
        limit: { type: 'number', description: 'Max results (default 8).' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_component',
    description:
      'Get one 76° registry item by name (e.g. "data-table", "entry-table", "template-crm-deal"): its one job, exports, files, registry dependencies, install command, and the full markdown documentation with props, accessibility contract, don\'ts and FAQ.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string', description: 'Registry item name (slug).' } },
      required: ['name'],
    },
  },
  {
    name: 'list_templates',
    description: 'List every 76° block and full-screen template with its description and install command.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_foundations',
    description:
      'The 76° foundations: product seeds, the four postures (seed, mode, motion, density), shipped locales and RTL rules, and the Six Laws. Read before composing a new screen.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function call(name, args = {}) {
  const items = await index();
  if (name === 'search_components') {
    const terms = String(args.query ?? '')
      .toLowerCase()
      .split(/[^a-z0-9°-]+/)
      .filter((t) => t.length > 1);
    const kind = args.kind ?? 'any';
    const pool = items.filter((i) =>
      kind === 'component' ? i.type === 'registry:ui' : kind === 'composition' ? i.type === 'registry:block' : true,
    );
    const ranked = pool
      .map((i) => ({ i, s: score(i, terms) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, Math.max(1, Math.min(Number(args.limit) || 8, 25)));
    if (ranked.length === 0) return `No 76° item matches "${args.query}". Try a job ("compare two dimensions") or a tag ("table", "form", "auth").`;
    return ranked
      .map(({ i }) => `- **${i.title}** (\`${i.name}\`${i.book ? ` · ${i.book}` : ''}) — ${i.job || i.description}\n  install: \`${install(i.name)}\``)
      .join('\n');
  }

  if (name === 'get_component') {
    const slug = String(args.name ?? '').trim().toLowerCase();
    const item = items.find((i) => i.name === slug) ?? items.find((i) => i.name === `template-${slug}` || i.name === `block-${slug}`);
    if (!item) {
      const near = items.filter((i) => i.name.includes(slug)).slice(0, 5).map((i) => i.name);
      throw new RpcError(-32602, `No registry item "${args.name}".${near.length ? ` Did you mean: ${near.join(', ')}?` : ''}`);
    }
    let doc = '';
    try {
      doc = await readFile(path.join(DOCS, `${item.name}.md`), 'utf8');
    } catch {
      doc = '(No markdown doc for this item — compositions are documented by their source.)';
    }
    return [
      `# ${item.title}${item.book ? ` (${item.book})` : ''}`,
      item.job ? `**One job:** ${item.job}` : item.description,
      `**Install:** \`${install(item.name)}\``,
      item.exports.length ? `**Exports:** ${item.exports.join(', ')}` : '',
      item.deps.length ? `**Registry deps:** ${item.deps.join(', ')}` : '',
      item.files.length ? `**Files:** ${item.files.join(', ')}` : '',
      '',
      doc,
    ]
      .filter((l) => l !== '')
      .join('\n');
  }

  if (name === 'list_templates') {
    return items
      .filter((i) => i.type === 'registry:block')
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((i) => `- **${i.title}** (\`${i.name}\`) — ${i.description}`)
      .join('\n');
  }

  if (name === 'get_foundations') {
    return `# 76° foundations

Flat, informational, corporate — paper on a wall. Light-first.

## The Six Laws
1. Paper on a wall: white cards on the platinum wall, no borders, one 1px shadow, radius 4px.
2. Three colours: ink, the product seed, and functional green/red on words and 6px dots only.
3. Every widget has a type and one job.
4. Mono speaks metadata (Fragment Mono, uppercase, tracked); content speaks Hanken Grotesk.
5. The ink band is the chrome; navigation is horizontal.
6. Numbers are instrumentation: tabular, values bold, units soft.

## Postures (declared on a wrapper, resolved at the nearest declaration)
- data-seed: cobalt (ERP #2C5BE0) · verdigris (CRM #12836F) · signal (POS #D9531E) · iris (HEALTH #6A45C9)
- data-mode="dark" — tokens only
- data-motion="on" — opt-in arrivals; prefers-reduced-motion wins
- data-density="compact | regular | touch" — row inset, control inset, control minimum

## Language and direction
- <LocaleProvider locale="…"> carries every built-in word: en (source), fr, ar, so. No provider = English.
- RTL is supported: write logical CSS properties only (firewall rule 21). Code, PIN codes and chart time axes stay LTR.
- Components never format figures (C9): format in the screen with useFormat(), pass strings down.

## Install the foundation first
\`${install('tokens')}\``;
  }

  throw new RpcError(-32602, `Unknown tool "${name}".`);
}

/* ---------------------------------------------------------- the protocol */

class RpcError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const send = (msg) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\n');

async function handle(req) {
  const { id, method, params } = req;
  const isNotification = id === undefined || id === null;
  try {
    let result;
    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: params?.protocolVersion ?? PROTOCOL,
          capabilities: { tools: {} },
          serverInfo: { name: 'seventy-six', version: JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')).version },
          instructions: 'Search the 76° registry before writing UI; call get_foundations first on a new screen.',
        };
        break;
      case 'notifications/initialized':
      case 'notifications/cancelled':
        return;
      case 'ping':
        result = {};
        break;
      case 'tools/list':
        result = { tools: TOOLS };
        break;
      case 'tools/call': {
        try {
          const text = await call(params?.name, params?.arguments);
          result = { content: [{ type: 'text', text }] };
        } catch (e) {
          /* A tool failure is a RESULT the model can read and recover from,
             not a protocol error. */
          result = { content: [{ type: 'text', text: e.message }], isError: true };
        }
        break;
      }
      default:
        throw new RpcError(-32601, `Method not found: ${method}`);
    }
    if (!isNotification) send({ id, result });
  } catch (e) {
    if (!isNotification) send({ id, error: { code: e.code ?? -32603, message: e.message } });
  }
}

const rl = createInterface({ input: process.stdin });
rl.on('line', (line) => {
  if (!line.trim()) return;
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    send({ id: null, error: { code: -32700, message: 'Parse error' } });
    return;
  }
  for (const m of Array.isArray(msg) ? msg : [msg]) handle(m);
});

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('./dist', import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const CORS = /^\/(r|llms)\//;

const TYPE = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

async function resolve(urlPath) {
  const rel = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, rel);
  if (!file.startsWith(ROOT)) return null;
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    await stat(file);
    return file;
  } catch {
    // BrowserRouter: a real path like /components/data-table is not a file,
    // so every extensionless miss falls back to the app shell. Anything WITH
    // an extension that is missing is a genuine 404 and stays one.
    return extname(rel) ? null : join(ROOT, 'index.html');
  }
}

const server = createServer(async (req, res) => {
  const path = req.url || '/';
  const file = await resolve(path);
  if (!file) return res.writeHead(404).end('Not found');
  try {
    const body = await readFile(file);
    const headers = { 'Content-Type': TYPE[extname(file)] || 'application/octet-stream' };
    if (CORS.test(path) || path === '/llms.txt') {
      headers['Access-Control-Allow-Origin'] = '*';
      headers['Cache-Control'] = 'public, max-age=300';
    }
    res.writeHead(200, headers).end(body);
  } catch {
    res.writeHead(500).end('Server error');
  }
});

server.listen(PORT, '0.0.0.0', () => console.log(`76° serving dist/ on :${PORT}`));

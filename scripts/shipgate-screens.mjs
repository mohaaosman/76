import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = 'http://localhost:4173';
const shots = [
  { name: 'home', url: `${BASE}/#/` },
  { name: 'components-index', url: `${BASE}/#/components` },
  { name: 'component-button', url: `${BASE}/#/components/button` },
  { name: 'component-data-table', url: `${BASE}/#/components/data-table` },
  { name: 'component-stat-s1', url: `${BASE}/#/components/stat-s1` },
  { name: 'component-band', url: `${BASE}/#/components/band` },
  { name: 'foundations', url: `${BASE}/#/foundations` },
  { name: 'ai', url: `${BASE}/#/ai` },
];

await mkdir('/tmp/shots', { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push(String(err)));

for (const shot of shots) {
  await page.goto(shot.url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `/tmp/shots/${shot.name}.png`, fullPage: shot.name !== 'home' ? false : true });
}

/* Full-page shot of one component page for the doc-skeleton check */
await page.goto(`${BASE}/#/components/button`, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/shots/component-button-full.png', fullPage: true });

if (consoleErrors.length) {
  console.log('CONSOLE ERRORS:');
  for (const e of consoleErrors) console.log('  ' + e);
} else {
  console.log('No console errors.');
}
await browser.close();

import { chromium } from 'playwright';

/**
 * The interaction gate (v0.10). The firewall reads source; this drives the
 * BUILT site in a real browser and checks the contracts a stylesheet cannot
 * prove — keyboard models, live regions, direction, the language layer.
 *
 *   npm run build && npm run preview &   then   npm run test:interaction
 *
 * Exits non-zero on the first failed assertion group, listing every failure.
 */
const BASE = process.env.BASE_URL ?? 'http://localhost:4173';

async function launch() {
  try {
    return await chromium.launch();
  } catch {
    /* A pinned Playwright that cannot find its own browser: use the system one. */
    return chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--headless', '--no-sandbox'] });
  }
}

const browser = await launch();
const failures = [];
let passed = 0;

function check(name, cond, detail = '') {
  if (cond) passed++;
  else failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
}

async function open(path, { locale = 'en', width = 1280 } = {}) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.addInitScript((l) => {
    try {
      localStorage.setItem('sv-locale', l);
    } catch {
      /* ignore */
    }
  }, locale);
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  page.errors = errors;
  return page;
}

const focusInfo = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    return {
      tag: el?.tagName,
      label: el?.getAttribute('aria-label') ?? '',
      level: el?.getAttribute('aria-level'),
      expanded: el?.getAttribute('aria-expanded'),
      selected: el?.getAttribute('aria-selected'),
      text: el?.textContent?.trim().slice(0, 60) ?? '',
    };
  });

async function noDuplicateIds(page, where) {
  const dups = await page.evaluate(() => {
    const seen = new Map();
    for (const el of document.querySelectorAll('[id]')) seen.set(el.id, (seen.get(el.id) ?? 0) + 1);
    return [...seen].filter(([, n]) => n > 1).map(([id]) => id);
  });
  check(`${where}: no duplicate ids`, dups.length === 0, dups.join(', '));
}

/* ---------------------------------------------------------------- EntryTable */
{
  const page = await open('/components/entry-table');
  const inputs = page.locator('.sv-entry').first().locator('input');
  const n = await inputs.count();
  check('EntryTable: renders entry inputs', n >= 3, `found ${n}`);
  await inputs.nth(0).focus();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('4');
  await page.keyboard.press('Enter');
  const second = await inputs.nth(1).getAttribute('aria-label');
  check('EntryTable: Enter moves to the next line', (await focusInfo(page)).label === second);
  await page.keyboard.press('ArrowUp');
  check('EntryTable: ↑ moves back', (await focusInfo(page)).label === (await inputs.nth(0).getAttribute('aria-label')));
  await page.keyboard.press('ArrowDown');
  check('EntryTable: ↓ moves down', (await focusInfo(page)).label === second);
  await page.keyboard.press('Control+A');
  await page.keyboard.type('99999');
  await page.keyboard.press('Tab');
  check('EntryTable: out of bounds marks aria-invalid on blur', (await inputs.nth(1).getAttribute('aria-invalid')) === 'true');
  const describedBy = await inputs.nth(1).getAttribute('aria-describedby');
  const errText = describedBy
    ? await page.evaluate((ids) => ids.split(' ').map((id) => document.getElementById(id)?.textContent ?? '').join(' '), describedBy)
    : '';
  check('EntryTable: the error sentence is wired to the input', errText.trim().length > 10, errText);
  check('EntryTable: the error sentence has no exclamation mark', !errText.includes('!'));
  await noDuplicateIds(page, 'entry-table page');
  check('EntryTable page: no runtime errors', page.errors.length === 0, page.errors.join(' | '));
  await page.close();
}

/* ----------------------------------------------------------------- ScanField */
{
  const page = await open('/components/scan-field');
  const field = page.locator('.sv-scan input').first();
  await field.focus();
  await field.fill('SKU-4471');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  check('ScanField: clears after Enter', (await field.inputValue()) === '');
  check('ScanField: keeps focus after Enter', await field.evaluate((el) => el === document.activeElement));
  const live = await page.locator('.sv-scan [aria-live]').first().textContent();
  check('ScanField: states the resolution in a live region', (live ?? '').includes('SKU-4471'), live ?? '');
  check('ScanField page: no runtime errors', page.errors.length === 0, page.errors.join(' | '));
  await page.close();
}

/* ----------------------------------------------------------------- TreeTable */
for (const locale of ['en', 'ar']) {
  const page = await open('/components/tree-table', { locale });
  const grid = page.locator('[role=treegrid]').first();
  const first = grid.locator('tr[aria-level="1"]').first();
  await first.focus();
  const forward = locale === 'ar' ? 'ArrowLeft' : 'ArrowRight';
  const back = locale === 'ar' ? 'ArrowRight' : 'ArrowLeft';
  const startExpanded = await first.getAttribute('aria-expanded');
  if (startExpanded === 'true') {
    await page.keyboard.press(back);
    check(`TreeTable (${locale}): ${back} collapses an open parent`, (await first.getAttribute('aria-expanded')) === 'false');
  }
  await page.keyboard.press(forward);
  check(`TreeTable (${locale}): ${forward} expands`, (await first.getAttribute('aria-expanded')) === 'true');
  await page.keyboard.press(forward);
  check(`TreeTable (${locale}): ${forward} again steps into the first child`, (await focusInfo(page)).level === '2');
  /* APG: ← on an OPEN node collapses it first; only a closed node or a
     leaf steps out to its parent. */
  if ((await focusInfo(page)).expanded === 'true') {
    await page.keyboard.press(back);
    check(`TreeTable (${locale}): ${back} on an open child collapses it`, (await focusInfo(page)).expanded === 'false');
  }
  await page.keyboard.press(back);
  check(`TreeTable (${locale}): ${back} on a closed child returns to its parent`, (await focusInfo(page)).level === '1');
  await page.keyboard.press('End');
  const end = await focusInfo(page);
  check(`TreeTable (${locale}): End lands on a row`, end.tag === 'TR');
  const tabStops = await grid.locator('tr[tabindex="0"]').count();
  check(`TreeTable (${locale}): exactly one tab stop`, tabStops === 1, `found ${tabStops}`);
  check(`TreeTable (${locale}) page: no runtime errors`, page.errors.length === 0, page.errors.join(' | '));
  await page.close();
}

/* ---------------------------------------------------------------- CrossTable */
{
  const page = await open('/components/cross-table');
  const region = page.locator('.sv-cross').first();
  check('CrossTable: the scroll region is focusable', (await region.getAttribute('tabindex')) === '0');
  check('CrossTable: column headers are scoped', (await region.locator('th[scope=col]').count()) > 2);
  check('CrossTable: row headers are scoped', (await region.locator('th[scope=row]').count()) > 2);
  await page.close();
}

/* --------------------------------------------------------------- SettingList */
{
  const page = await open('/components/setting-list');
  const row = page.locator('.sv-settings__row, .sv-setting').first();
  const before = await row.textContent();
  const control = row.locator('input[type=checkbox]').first();
  const wasChecked = await control.isChecked();
  await control.focus();
  await page.keyboard.press('Space');
  await page.waitForTimeout(150);
  const after = await row.textContent();
  check('SettingList: Space flips the control', (await control.isChecked()) !== wasChecked);
  check('SettingList: the consequence sentence changes with the value', before !== after, `${before} → ${after}`);
  const named = await control.evaluate((el) => {
    const ids = el.getAttribute('aria-labelledby');
    return ids ? ids.split(' ').map((id) => document.getElementById(id)?.textContent ?? '').join(' ').trim() : el.getAttribute('aria-label') ?? '';
  });
  check('SettingList: the control is named by its row title', named.length > 3, named);
  await page.close();
}

/* ------------------------------------------------------------- MessageThread */
{
  const page = await open('/components/message-thread', { locale: 'ar' });
  const articles = page.locator('.sv-thread article, ol article').first().locator('xpath=ancestor::ol[1]//article');
  const count = await articles.count();
  check('MessageThread: messages are articles', count >= 3, `found ${count}`);
  const times = await page.locator('ol article time[datetime]').count();
  check('MessageThread: every message carries a <time datetime>', times >= count, `${times} of ${count}`);
  const text = await page.locator('ol article').first().textContent();
  check('MessageThread (ar): direction words come from the Arabic catalog', /مستلَمة|مرسَلة|ملاحظة داخلية/.test(text ?? ''), text ?? '');
  await page.close();
}

/* ------------------------------------------------- The language layer · RTL */
{
  const page = await open('/playground', { locale: 'ar', width: 1280 });
  const dir = await page.evaluate(() => document.documentElement.dir);
  check('Locale: <html dir> follows Arabic', dir === 'rtl');
  const tabs = page.locator('.site-playground__preview [role=tablist] [role=tab]');
  await tabs.first().focus();
  await page.keyboard.press('ArrowLeft');
  const sel = await tabs.nth(1).getAttribute('aria-selected');
  check('Tabs (ar): ← moves FORWARD in RTL', sel === 'true');
  const post = await page.locator('.site-playground__preview .sv-entry__post').textContent();
  check('Locale: the post verb is Arabic', /ترحيل/.test(post ?? ''), post ?? '');
  const ls = await page.evaluate(() => getComputedStyle(document.querySelector('.site-playground__preview .sv-stat__label')).letterSpacing);
  check('Script layer: Arabic micro labels take no tracking', ls === 'normal', ls);
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  check('Playground (ar): no horizontal scroll at 1280', width <= 1280, String(width));
  await noDuplicateIds(page, 'playground');
  check('Playground page: no runtime errors', page.errors.length === 0, page.errors.join(' | '));
  await page.close();
}
{
  const page = await open('/', { locale: 'ar', width: 320 });
  const menu = await page.locator('.sv-band__menu').first().textContent();
  check('Band (ar, 320px): the Menu trigger is translated', (menu ?? '').includes('القائمة'), menu ?? '');
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  check('Home (ar): no horizontal scroll at 320', width <= 320, String(width));
  await page.locator('.sv-band__menu').first().click();
  await page.waitForTimeout(300);
  const box = await page.locator('dialog[open]').first().boundingBox();
  check('Drawer (ar): the nav drawer opens from the START (right) edge', !!box && box.x + box.width >= 319, JSON.stringify(box));
  await page.close();
}
{
  const page = await open('/', { locale: 'en', width: 320 });
  await page.locator('.sv-band__menu').first().click();
  await page.waitForTimeout(300);
  const box = await page.locator('dialog[open]').first().boundingBox();
  check('Drawer (en): the nav drawer opens from the START (left) edge', !!box && box.x <= 1, JSON.stringify(box));
  await page.close();
}

/* ---------------------------------------------- DataTable pointer selection */
{
  const page = await open('/components/data-table');
  const table = page.locator('.sv-table--checks').first();
  check('DataTable: selectable tables draw a checkbox column', (await table.count()) === 1);
  const all = table.locator('thead input[type=checkbox]');
  const allBox = table.locator('thead .sv-check');
  const rows = table.locator('tbody tr');
  const box = (i) => rows.nth(i).locator('input[type=checkbox]');
  /* A reader clicks the drawn box (the label), not the hidden input. */
  const hit = (i) => rows.nth(i).locator('.sv-check');
  await hit(0).click();
  check('DataTable: clicking a row box selects the row', (await rows.nth(0).getAttribute('aria-selected')) === 'true');
  check('DataTable: select-all is indeterminate with part of the set selected', await all.evaluate((el) => el.indeterminate));
  await hit(2).click({ modifiers: ['Shift'] });
  check('DataTable: ⇧-click selects the range', (await rows.nth(1).getAttribute('aria-selected')) === 'true');
  await allBox.click();
  const n = await rows.count();
  let allSel = true;
  for (let i = 0; i < n; i++) if ((await rows.nth(i).getAttribute('aria-selected')) !== 'true') allSel = false;
  check('DataTable: select-all selects every row', allSel);
  await allBox.click();
  check('DataTable: select-all again clears the set', (await rows.nth(0).getAttribute('aria-selected')) === 'false');
  check('DataTable: row boxes stay out of the tab order', (await box(0).getAttribute('tabindex')) === '-1');
  /* The keyboard model is unchanged: Space on the focused ROW selects it once. */
  await rows.nth(0).focus();
  await page.keyboard.press('Space');
  check('DataTable: Space on the row still selects (once)', (await rows.nth(0).getAttribute('aria-selected')) === 'true');
  check('DataTable page: no runtime errors', page.errors.length === 0, page.errors.join(' | '));
  await page.close();
}
{
  const page = await open('/templates/settings-team');
  const owner = page.locator('.sv-table--checks tbody tr').first().locator('input[type=checkbox]');
  check('settings-team: the owner row cannot be selected', await owner.isDisabled());
  const select = page.locator('select[aria-label^="Role for"]').first();
  await select.focus();
  const before = await page.evaluate(() => document.activeElement?.tagName);
  await page.keyboard.press('ArrowDown');
  const after = await page.evaluate(() => document.activeElement?.tagName);
  check('settings-team: arrow keys in a cell control stay with the control', before === 'SELECT' && after === 'SELECT', `${before} → ${after}`);
  await page.close();
}

/* ------------------------------------------------------- Templates register */
for (const slug of ['crm-deal', 'settings-team']) {
  const page = await open(`/templates/${slug}`, { locale: 'ar' });
  const dir = await page.evaluate(() => document.querySelector('.sv-locale')?.getAttribute('dir'));
  check(`Template ${slug}: renders in its authoring direction (ltr) under an RTL site`, dir === 'ltr', String(dir));
  const h1 = await page.locator('h1').count();
  check(`Template ${slug}: exactly one h1`, h1 === 1, String(h1));
  await noDuplicateIds(page, `template ${slug}`);
  check(`Template ${slug}: no runtime errors`, page.errors.length === 0, page.errors.join(' | '));
  await page.close();
}

/* ------------------------------------------------- The 320px floor, swept */
{
  const page = await browser.newPage({ viewport: { width: 320, height: 800 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const slugs = await (async () => {
    await page.goto(BASE + '/components', { waitUntil: 'networkidle' });
    return page.evaluate(() =>
      [...new Set([...document.querySelectorAll('a[href^="/components/"]')].map((a) => a.getAttribute('href')))],
    );
  })();
  const templates = ['crm-deal', 'settings-team', 'erp-purchase-order', 'analytics-overview'].map((t) => `/templates/${t}`);
  const wide = [];
  for (const url of [...slugs, ...templates, '/playground']) {
    errors.length = 0;
    await page.goto(BASE + url, { waitUntil: 'networkidle' });
    /* Let fonts and the code-split route settle before measuring. */
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    if (w > 320) wide.push(`${url} (${w}px)`);
    if (errors.length) wide.push(`${url} threw: ${errors[0]}`);
  }
  check(`320px floor: ${slugs.length} component pages + templates, no horizontal scroll or runtime error`, wide.length === 0, wide.join(', '));
  await page.close();
}

await browser.close();

if (failures.length) {
  console.error(`INTERACTION · ${failures.length} failure(s), ${passed} passed:\n`);
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log(`INTERACTION · clean. ${passed} assertions passed.`);

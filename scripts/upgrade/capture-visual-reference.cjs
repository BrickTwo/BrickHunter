// Requires Playwright, Node >=20, and npm run build:visual-reference.
// Uses a disposable browser context; never opens an installed extension profile.
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

const label = process.argv[2] || 'angular-17-baseline';
if (!/^[a-z0-9-]+$/.test(label)) throw new Error('Invalid artifact label');
const root = path.resolve('artefacts/angular-upgrade/visual-app');
const output = path.resolve('artefacts/angular-upgrade/visual', label);
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json' };

async function main() {
  await fs.access(path.join(root, 'index.html'));
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.mkdir(output, { recursive: false }); // Never overwrite the baseline.
  const placeholder = await fs.readFile(path.join(root, 'assets/placeholder.png'));
  const donate = await fs.readFile('docs/angular-upgrade-reference/fixtures/donate.gif');
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
      response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
      response.end(await fs.readFile(file));
    } catch { response.writeHead(404).end(); }
  });
  // Fixed dedicated origin, separate from ng serve and Karma.
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(4317, '127.0.0.1', resolve); });
  let browser;
  const lock = JSON.parse(await fs.readFile('package-lock.json', 'utf8'));
  const report = { label, capturedAt: new Date().toISOString(), browser: '', zoom: '100%',
    versions: { angular: lock.packages['node_modules/@angular/core'].version,
      primeng: lock.packages['node_modules/primeng'].version,
      playwright: require('playwright/package.json').version },
    deviceScaleFactor: 1, timezone: 'Europe/Zurich', externalRequests: [], pageErrors: [],
    consoleErrors: [], knownConsoleErrors: [], scenarios: [] };
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROME_BIN ||
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true });
    report.browser = browser.version();
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 },
      { width: 2560, height: 1440 }, { width: 3200, height: 1440 }]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1,
        timezoneId: 'Europe/Zurich', locale: 'de-DE', reducedMotion: 'reduce' });
      await context.addInitScript(() => {
        const OriginalDate = Date;
        const fixed = OriginalDate.parse('2026-10-04T10:00:00Z');
        window.Date = class extends OriginalDate {
          constructor(...args) { args.length ? super(...args) : super(fixed); }
          static now() { return fixed; }
        };
      });
      await context.route('**/*', async route => {
        const request = route.request();
        if (new URL(request.url()).origin === 'http://127.0.0.1:4317') { await route.continue(); return; }
        report.externalRequests.push({ url: request.url(), type: request.resourceType() });
        if (request.url() === 'https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif')
          await route.fulfill({ contentType: 'image/gif', body: donate });
        else if (request.resourceType() === 'image') await route.fulfill({ contentType: 'image/png', body: placeholder });
        else await route.abort('blockedbyclient');
      });
      const page = await context.newPage();
      page.on('pageerror', error => report.pageErrors.push({ viewport, error: error.message }));
      page.on('console', message => {
        if (message.type() !== 'error' || message.text().startsWith('Failed to load resource')) return;
        const entry = { viewport, url: page.url(), error: message.text() };
        // Existing Angular-17 table lifecycle issue, recorded in the report;
        // all other console errors fail the reference run.
        if (message.text().includes('NG0100: ExpressionChangedAfterItHasBeenCheckedError') &&
          message.text().includes("Previous value: 'false'. Current value: 'true'") &&
          message.text().includes('Expression location: PartsTableComponent component'))
          report.knownConsoleErrors.push(entry);
        else report.consoleErrors.push(entry);
      });
      async function settle() {
        await page.waitForFunction(() => window.brickHunterReference && document.querySelector('h2'));
        await page.evaluate(async () => { await document.fonts.ready; });
        await page.waitForTimeout(400); // Let Angular overlays and image layout settle.
      }
      let navigation = 0;
      async function open(route) {
        await page.goto(`http://127.0.0.1:4317/?reference=${++navigation}#/${route}`);
        await settle();
        await page.evaluate(() => window.brickHunterReference.clearMessages());
      }
      async function capture(name) {
        await settle();
        const file = `${viewport.width}x${viewport.height}-${name}.png`;
        await page.screenshot({ path: path.join(output, file), animations: 'disabled' });
        const metrics = await page.evaluate(() => {
          const selectors = ['html', 'body', 'h2', '.p-button', '.p-datatable-tbody tr',
            'app-browse-parts-grid-item > div', '.p-dialog', '.p-sidebar, .p-drawer'];
          const values = {};
          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (!element) continue;
            const rect = element.getBoundingClientRect();
            const css = getComputedStyle(element);
            values[selector] = { width: rect.width, height: rect.height, fontSize: css.fontSize,
              fontFamily: css.fontFamily, color: css.color, backgroundColor: css.backgroundColor,
              borderRadius: css.borderRadius, padding: css.padding, boxShadow: css.boxShadow };
          }
          return values;
        });
        report.scenarios.push({ file, viewport, name, metrics });
      }
      async function component(selector, action, args = []) {
        await page.evaluate(({ selector, action, args }) => {
          const element = document.querySelector(selector);
          const instance = window.ng.getComponent(element);
          instance[action](...args);
          window.ng.applyChanges(instance);
        }, { selector, action, args });
      }

      await open('parts-lists');
      await capture('lists');
      await page.getByRole('button', { name: 'Import', exact: true }).click();
      await capture('import-dialog');
      await open('parts-lists/upgrade-reference');
      await capture('table');
      if (viewport.width === 1440) {
        await page.evaluate(() => window.brickHunterReference.showMessage());
        await capture('success-message');
        await page.evaluate(() => window.brickHunterReference.clearMessages());
        await page.evaluate(() => {
          const instance = window.ng.getComponent(document.querySelector('app-parts-list-detail'));
          instance.pabIsLoading = true;
          window.ng.applyChanges(instance);
        });
        await capture('table-loading-disabled');
        await open('parts-lists/upgrade-reference');
        const cell = page.locator('app-parts-table td.p-editable-column').first();
        await cell.click();
        await capture('table-inline-edit');
        await page.keyboard.press('Escape');
        await page.locator('app-parts-table .p-checkbox').nth(1).click();
        await capture('table-selection');
        await page.getByRole('button', { name: 'Settings', exact: true }).click();
        await capture('list-settings');
        await open('parts-lists/upgrade-reference');
        await page.getByRole('button', { name: 'Export', exact: true }).click();
        await capture('export-dialog');
        await open('parts-lists/upgrade-reference');
        await page.getByRole('button', { name: 'Transfer', exact: true }).first().click();
        await capture('transfer-progress');
        await open('parts-lists/upgrade-reference');
        await component('app-transfer-warning', 'open', [[{ part: referenceWarningPart(), cart: undefined }], true]);
        await capture('transfer-warning');
        await open('parts-lists/upgrade-reference');
        await page.getByRole('button', { name: 'Delete', exact: true }).first().click();
        await capture('delete-confirmation');
      }
      await open('parts-lists/upgrade-empty');
      await capture('empty-table');
      await open('settings');
      await capture('settings');
      await open('browse-parts');
      await capture('browse');
      if (viewport.width === 1440) {
        const all = page.locator('app-browse-parts-color-filter button').first();
        await all.hover(); await capture('filter-hover');
        await all.focus(); await capture('filter-focus');
        await page.evaluate(() => {
          const buttons = [...document.querySelectorAll('app-browse-parts-color-filter button')];
          buttons.find(button => button.style.backgroundColor === 'rgb(220, 53, 69)').click();
        });
        await capture('color-menu');
        await open('browse-parts');
        await page.evaluate(() => window.brickHunterReference.setSearchCount(0));
        await capture('empty-search');
        await page.evaluate(() => window.brickHunterReference.setSearchCount(1000));
        await capture('large-search');
        await page.evaluate(() => window.scrollTo(0, 1400));
        await capture('large-search-scrolled');
      }
      await context.close();
    }
    if (report.pageErrors.length || report.consoleErrors.length)
      throw new Error(`Reference app emitted ${report.pageErrors.length} browser errors and ${report.consoleErrors.length} console errors`);
  } finally {
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(`${report.scenarios.length} screenshots saved to ${output}`);
}

function referenceWarningPart() {
  return { id: 'reference-warning', designId: '3001', elementId: 300123, color: 4, qty: 120, have: 0,
    source: { source: 'Lego' }, lego: { elementId: 300123, designNumber: 3001, maxOrderQuantity: 100,
      deliveryChannel: 'pab', inStock: true, price: { amount: 0.25, currencyCode: 'EUR' } } };
}

main().catch(error => { console.error(error); process.exitCode = 1; });

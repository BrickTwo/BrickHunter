// Offline application exports in a disposable context. No account or extension profile.
// Usage: node scripts/upgrade/verify-export-reference.cjs LABEL BUILD_ROOT
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const label = process.argv[2];
if (!/^[a-z0-9-]+$/.test(label || '')) throw new Error('Invalid label');
const root = path.resolve(process.argv[3] || 'artefacts/angular-upgrade/visual-app');
const output = path.resolve('artefacts/angular-upgrade/post-angular22/pdf-xml', label);
const origin = 'http://127.0.0.1:4319';
async function main() {
  await fs.access(path.join(root, 'index.html'));
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.mkdir(output); // Preserve every prior run.
  const image = await fs.readFile(path.join(root, 'assets/placeholder.png'));
  const mime = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.woff2': 'font/woff2',
  };
  const server = http.createServer(async (req, res) => {
    try {
      const name = new URL(req.url, origin).pathname;
      const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
      if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
      res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
      res.end(await fs.readFile(file));
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(4319, '127.0.0.1', resolve);
  });
  let browser;
  const report = { label, buildRoot: root, cases: [], pageErrors: [], consoleErrors: [], externalRequests: [] };
  let failImages = false;
  try {
    browser = await chromium.launch({
      executablePath: process.env.CHROME_BIN || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true,
      args: ['--use-angle=d3d11'],
    });
    report.browser = browser.version();
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      locale: 'de-DE',
      timezoneId: 'Europe/Zurich',
      acceptDownloads: true,
    });
    await context.route('**/*', async route => {
      if (new URL(route.request().url()).origin === origin) return route.continue();
      report.externalRequests.push(route.request().url());
      if (
        !failImages &&
        (route.request().resourceType() === 'image' || /\.(png|jpg)(\?|$)/.test(route.request().url()))
      )
        return route.fulfill({ contentType: 'image/png', body: image });
      return route.abort('blockedbyclient');
    });
    const page = await context.newPage();
    page.on('pageerror', e => report.pageErrors.push(e.message));
    page.on('console', m => {
      if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) report.consoleErrors.push(m.text());
    });
    await page.goto(origin + '/#/parts-lists/upgrade-reference');
    await page.waitForFunction(
      () =>
        window.brickHunterReference &&
        document.querySelector('app-parts-list-export') &&
        window.ng.getComponent(document.querySelector('app-parts-list-detail')).partsList
    );
    const cases = [
      { name: 'single-page', count: 8, filter: 'all' },
      { name: 'multiple-pages', count: 70, filter: 'all' },
      { name: 'bestseller-filter', count: 8, filter: 'pab' },
      { name: 'empty-list', count: 0, filter: 'all' },
      { name: 'image-fallback', count: 8, filter: 'all', failImages: true },
      { name: 'product-suggestions', count: 8, filter: 'all', product: true },
    ];
    for (const item of cases) {
      failImages = !!item.failImages;
      const expected = await page.evaluate(item => {
        const c = window.ng.getComponent(document.querySelector('app-parts-list-export'));
        c.open('upgrade-reference');
        window.exportReferenceSeed ||= structuredClone(c.partsList.parts[0]);
        c.partsList.name = 'ÄÖÜ äöü ß';
        c.partsList.parts = Array.from({ length: item.count }, (_, i) => {
          const part = structuredClone(window.exportReferenceSeed);
          Object.assign(part, {
            id: 'export-' + i,
            designId: String(4000 + i),
            elementId: 700000 + i,
            qty: i + 1,
            have: 0,
            notify: i % 2 === 0,
            remarks: 'ÄÖÜ <&> # ' + i,
          });
          part.lego.deliveryChannel = i % 2 ? 'bap' : 'pab';
          part.brickLink = { itemNo: String(4000 + i), itemType: 'P' };
          return part;
        });
        c.selectedFilterValue = item.filter;
        const parts = c.partsListService.getParts(c.partsList.uuid, item.filter);
        return {
          ids: parts.map(p => p.designId),
          quantity: parts.reduce((sum, p) => sum + p.qty, 0),
          rows: parts.length,
        };
      }, item);
      if (item.product) {
        await page.evaluate(() =>
          window.brickHunterReference.runInAngular(() => {
            const d = window.ng.getComponent(document.querySelector('app-parts-list-detail'));
            d.activeItem = d.items.find(i => i.id === 'setSuggestions');
            d.setSuggestionsLoaded = true;
            d.products = [
              {
                id: '12345',
                name: 'Prüfung',
                partsUsed: d.partsList.parts,
                imgUrl: './assets/placeholder.png',
                price: 2,
                priceUsed: 2,
                priceUnused: 0,
                pieceCount: 8,
                containesPercentage: 100,
                containesPieces: 8,
                containedPicesPrice: 2,
                currencyCode: 'EUR',
              },
            ];
          })
        );
        await page.waitForSelector('app-parts-product-suggestions-detail', { state: 'attached' });
      }
      const pending = page.waitForEvent('download');
      pending.catch(() => {}); // Preserve the original export error during cleanup.
      await page.evaluate(async item => {
        if (item.product) {
          const c = window.ng.getComponent(document.querySelector('app-parts-product-suggestions-detail'));
          const exporter = window.ng.getComponent(document.querySelector('app-parts-list-export'));
          c.open('upgrade-reference', { id: '12345', name: 'Prüfung', partsUsed: exporter.partsList.parts });
          await c.onExportPdf();
        } else await window.ng.getComponent(document.querySelector('app-parts-list-export')).exportPDF();
      }, item);
      const download = await pending;
      await download.saveAs(path.join(output, item.name + '.pdf'));
      report.cases.push({ ...item, expected, filename: download.suggestedFilename() });
    }
    // Real serializer and real importer; delayed colors deliberately finish out of order.
    report.xml = await page.evaluate(async () => {
      const c = window.ng.getComponent(document.querySelector('app-parts-list-export'));
      const original = c.colorService.getColor.bind(c.colorService);
      let calls = 0;
      c.colorService.getColor = async (...args) => {
        const index = calls++;
        await new Promise(resolve => setTimeout(resolve, index === 0 ? 30 : 5));
        return original(...args);
      };
      c.selectedFilterValue = 'all';
      c.brickLinkExportPrice = false;
      const xml = await c.creatXml();
      const withoutHeader = await c.creatXml(false);
      c.colorService.getColor = original;
      return {
        xml,
        withoutHeader,
        expectedIds: c.partsList.parts.map(p => p.brickLink.itemNo),
        expectedNotify: c.partsList.parts.map(p => p.notify),
      };
    });
    // Stub only remote enrichment, then exercise the real XML download callback.
    const xmlDownload = page.waitForEvent('download');
    xmlDownload.catch(() => {});
    await page.evaluate(() => {
      const c = window.ng.getComponent(document.querySelector('app-parts-list-export'));
      c.importService.import = subscriber => subscriber.complete();
      c.selectedExportToValue = 'brickLink';
      return c.onExport();
    });
    await (await xmlDownload).saveAs(path.join(output, 'downloaded-wanted-list.xml'));
    report.xml.downloadedXml = await fs.readFile(path.join(output, 'downloaded-wanted-list.xml'), 'utf8');
    await page.goto(origin + '/#/parts-lists');
    await page.waitForSelector('app-parts-list-import', { state: 'attached' });
    await page.evaluate(() =>
      window.brickHunterReference.runInAngular(() =>
        window.ng.getComponent(document.querySelector('app-parts-list-import')).open()
      )
    );
    await page
      .locator('app-parts-list-import input[type=file]')
      .setInputFiles({ name: 'wanted-list.xml', mimeType: 'text/xml', buffer: Buffer.from(report.xml.xml) });
    await page.waitForFunction(() =>
      Array.isArray(window.ng.getComponent(document.querySelector('app-parts-list-import')).wantedList)
    );
    report.xml.imported = await page.evaluate(
      () => window.ng.getComponent(document.querySelector('app-parts-list-import')).wantedList
    );
    await fs.writeFile(path.join(output, 'wanted-list.xml'), report.xml.xml);
    report.xml.complete =
      JSON.stringify((report.xml.imported || []).map(p => p?.itemId)) === JSON.stringify(report.xml.expectedIds);
    report.xml.notifyPreserved =
      JSON.stringify((report.xml.imported || []).map(p => p?.notify)) === JSON.stringify(report.xml.expectedNotify);
    report.xml.downloadMatchesHeaderlessSerialization = report.xml.downloadedXml === report.xml.withoutHeader;
    if (!label.startsWith('baseline') && (!report.xml.complete || !report.xml.notifyPreserved || !report.xml.downloadMatchesHeaderlessSerialization))
      throw new Error('XML export/reimport acceptance failed');
    if (report.pageErrors.length || report.consoleErrors.length)
      throw new Error(
        'Browser errors: ' + JSON.stringify({ pageErrors: report.pageErrors, consoleErrors: report.consoleErrors })
      );
  } finally {
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(
    JSON.stringify({
      output,
      cases: report.cases.length,
      xmlComplete: report.xml.complete,
      notifyPreserved: report.xml.notifyPreserved,
    })
  );
}
main().catch(e => {
  console.error(e);
  process.exitCode = 1;
});

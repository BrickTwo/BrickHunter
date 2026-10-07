// Offline audit of the real custom grid, including images held until geometry is recorded.
// Usage: node scripts/upgrade/verify-grid-reference.cjs LABEL BUILD_ROOT
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const label = process.argv[2];
if (!/^[a-z0-9-]+$/.test(label || '')) throw new Error('Invalid label');
const root = path.resolve(process.argv[3]);
const output = path.resolve('artefacts/angular-upgrade/post-angular22/lazyload', label);
const report = { label, states: [], errors: [], delayedImages: 0 };
async function main() {
  await fs.mkdir(output); // Never overwrite a previous result.
  const image = await fs.readFile(path.join(root, 'assets/placeholder.png'));
  const server = http.createServer(async (req, res) => {
    try {
      const name = new URL(req.url, 'http://localhost').pathname;
      const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
      if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
      res.setHeader(
        'Content-Type',
        {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.woff2': 'font/woff2',
          '.png': 'image/png',
          '.json': 'application/json',
        }[path.extname(file)] || 'application/octet-stream'
      );
      res.end(await fs.readFile(file));
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(4318, '127.0.0.1', resolve);
  });
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true,
      args: ['--use-angle=d3d11'],
    });
    const session = await browser.newBrowserCDPSession();
    async function renderer() {
      const { gpu } = await session.send('SystemInfo.getInfo');
      const status = {
        renderer: gpu.auxAttributes.glRenderer,
        compositing: gpu.featureStatus.gpu_compositing,
        rasterization: gpu.featureStatus.rasterization,
      };
      if (
        !status.renderer.includes('Direct3D11') ||
        status.compositing !== 'enabled' ||
        status.rasterization !== 'enabled'
      )
        throw new Error('D3D11 GPU required');
      return status;
    }
    report.renderer = await renderer();
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    let release;
    const gate = new Promise(resolve => {
      release = resolve;
    });
    let hold = true;
    const pending = new Set();
    await context.route('**/*', async route => {
      const request = route.request();
      if (new URL(request.url()).origin === 'http://127.0.0.1:4318') return route.continue();
      if (request.resourceType() === 'image') {
        if (hold) {
          report.delayedImages++;
          await gate;
        }
        const task = route.fulfill({ contentType: 'image/png', body: image });
        pending.add(task);
        try {
          await task;
        } finally {
          pending.delete(task);
        }
      } else await route.abort('blockedbyclient');
    });
    const page = await context.newPage();
    page.on('pageerror', e => report.errors.push(e.message));
    page.on('console', m => {
      if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) report.errors.push(m.text());
    });
    await page.goto('http://127.0.0.1:4318/#/browse-parts', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(
      () => window.brickHunterReference && document.querySelector('app-browse-parts-grid-item')
    );
    await page.evaluate(() => window.brickHunterReference.setSearchCount(1000));
    await page.waitForFunction(
      () => window.ng.getComponent(document.querySelector('app-browse-parts-data-view')).parts.length === 1000
    );
    await page.evaluate(() => document.fonts.ready);
    async function measure(name) {
      await page.waitForTimeout(150);
      const state = await page.evaluate(() => {
        const grid = document.querySelector('#pabparts');
        const c = window.ng.getComponent(document.querySelector('app-browse-parts-data-view'));
        const r = grid.getBoundingClientRect();
        const cards = [...document.querySelectorAll('app-browse-parts-grid-item > div')].map(e => {
          const b = e.getBoundingClientRect();
          return { id: e.id, top: b.top, left: b.left, width: b.width, height: b.height };
        });
        const columns = Math.floor(r.width / 200);
        return {
          viewport: { width: innerWidth, height: innerHeight },
          scrollY,
          gridTop: r.top,
          gridHeight: r.height,
          columns,
          parts: c.parts.length,
          from: c.showFromIndex,
          to: c.showToIndex,
          rowsTop: c.rowsTop,
          rowsBottom: c.rowsBottom,
          totalRows: c.totalRows,
          topSpacer: document.querySelector('#rowsTop').getBoundingClientRect().height,
          bottomSpacer: document.querySelector('#rowsBottom').getBoundingClientRect().height,
          cards,
        };
      });
      if (state.columns < 1 || !state.cards.length || state.cards.some(c => c.height !== 320))
        throw new Error(name + ': card geometry');
      if (state.topSpacer !== state.rowsTop * 328 || state.bottomSpacer !== state.rowsBottom * 328)
        throw new Error(name + ': spacer geometry');
      const firstVisible = Math.max(0, Math.floor(-state.gridTop / 328));
      const lastVisible = Math.min(state.totalRows, Math.ceil((state.viewport.height - state.gridTop) / 328));
      if (
        firstVisible < state.totalRows &&
        (state.from > firstVisible * state.columns || state.to < Math.min(1000, lastVisible * state.columns))
      )
        throw new Error(name + ': empty visible rows');
      const tops = [...new Set(state.cards.map(c => c.top))].sort((a, b) => a - b);
      if (tops.slice(1).some((top, i) => top - tops[i] !== 328)) throw new Error(name + ': row pitch');
      report.states.push({ name, ...state });
      return state;
    }
    const before = await measure('images-held');
    if (!report.delayedImages) throw new Error('No image request held');
    hold = false;
    release();
    await page.waitForLoadState('networkidle');
    await Promise.all([...pending]);
    const after = await measure('images-released');
    if (JSON.stringify(before) !== JSON.stringify(after))
      throw new Error('Images changed grid geometry or scroll position');
    report.imageGeometryUnchanged = true;
    for (const viewport of [
      { width: 1440, height: 1000 },
      { width: 390, height: 844 },
      { width: 2560, height: 1440 },
      { width: 3200, height: 1440 },
    ]) {
      await page.setViewportSize(viewport);
      for (const position of ['top', 'middle', 'bottom', 'return']) {
        await page.evaluate(
          position =>
            window.scrollTo(
              0,
              position === 'middle'
                ? document.documentElement.scrollHeight / 2
                : position === 'bottom'
                  ? document.documentElement.scrollHeight
                  : 0
            ),
          position
        );
        await measure(`${viewport.width}-${position}`);
      }
    }
    await page.evaluate(() => window.brickHunterReference.setSearchCount(0));
    await page.waitForFunction(() => document.querySelectorAll('app-browse-parts-grid-item').length === 0);
    report.emptySearchPassed = true;
    await page.evaluate(() => window.brickHunterReference.setSearchCount(12));
    await page.waitForFunction(() => document.querySelectorAll('app-browse-parts-grid-item').length > 0);
    report.refillPassed = true;
    report.rendererAfter = await renderer();
    if (JSON.stringify(report.renderer) !== JSON.stringify(report.rendererAfter) || report.errors.length)
      throw new Error('Renderer changed or browser error');
    report.passed = true;
  } finally {
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(
    `Grid audit passed: ${report.states.length} states, ${report.delayedImages} delayed images, four viewport sizes.`
  );
}
main().catch(e => {
  console.error(e);
  process.exitCode = 1;
});

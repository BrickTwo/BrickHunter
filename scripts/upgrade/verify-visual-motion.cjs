// Requires the local visual reference build, Playwright, and the D3D11 Edge browser.
// Tests only disposable localhost fixtures; never an installed extension profile.
const fs = require('node:fs/promises'),
  path = require('node:path'),
  http = require('node:http'),
  { chromium } = require('playwright');
(async () => {
  const lock = JSON.parse(await fs.readFile('package-lock.json', 'utf8'));
  const major = lock.packages['node_modules/@angular/core'].version.split('.')[0];
  const evidenceDir = path.resolve('artefacts/angular-upgrade/angular-' + major);
  await fs.mkdir(evidenceDir, { recursive: true });
  const root = path.resolve('artefacts/angular-upgrade/visual-app');
  const server = http.createServer(async (req, res) => {
    try {
      const p = new URL(req.url, 'http://localhost').pathname,
        f = path.join(root, p === '/' ? 'index.html' : p);
      res.setHeader(
        'Content-Type',
        { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' }[
          path.extname(f)
        ] || 'application/octet-stream'
      );
      res.end(await fs.readFile(f));
    } catch {
      res.statusCode = 404;
      res.end();
    }
  });
  await new Promise(r => server.listen(4317, '127.0.0.1', r));
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
    args: ['--use-angle=d3d11'],
  });
  const result = { checks: {}, measurements: [], errors: [] };
  let diagnosticPage;
  try {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion });
      diagnosticPage = page;
      page.on('pageerror', e => result.errors.push(e.message));
      page.on('console', message => {
        if (message.type() === 'error' && !message.text().startsWith('Failed to load resource'))
          result.errors.push(message.text());
      });
      await page.route('**/*', r => (r.request().url().startsWith('http://127.0.0.1:4317') ? r.continue() : r.abort()));
      await page.goto('http://127.0.0.1:4317/#/parts-lists/upgrade-reference');
      await page.waitForFunction(() => window.brickHunterReference && document.querySelector('app-parts-table'));
      await page.evaluate(async () => {
        await document.fonts.ready;
        window.brickHunterReference.clearMessages();
      });
      await page.waitForTimeout(400);
      await page.getByRole('button', { name: 'Settings', exact: true }).waitFor();
      for (const close of ['save', 'button', 'escape', 'mask']) {
        await page.getByRole('button', { name: 'Settings', exact: true }).click();
        const drawer = page.locator('app-parts-list-settings .p-drawer');
        await drawer.waitFor();
        if (reducedMotion === 'no-preference' && close === 'save') {
          await page.locator('app-parts-list-settings .p-drawer-enter-right').waitFor({ timeout: 2000 });
          const timing = await drawer.evaluate(e => ({
            duration: getComputedStyle(e).animationDuration,
            easing: getComputedStyle(e).animationTimingFunction,
            transform: getComputedStyle(e).transform,
          }));
          if (timing.duration !== '0.15s' || timing.easing !== 'cubic-bezier(0, 0, 0.2, 1)')
            throw Error('Drawer timing changed ' + JSON.stringify(timing));
          result.measurements.push({ reducedMotion, drawerEnter: timing });
        }
        await page.waitForFunction(() => {
          const e = document.querySelector('app-parts-list-settings .p-drawer');
          return e && !/p-drawer-enter-/.test(e.className) && getComputedStyle(e).transform === 'none';
        });
        if (close === 'save')
          await page.locator('app-parts-list-settings').getByRole('button', { name: 'Save', exact: true }).click();
        if (close === 'button') await drawer.locator('.p-drawer-header button').click();
        if (close === 'escape') await drawer.press('Escape');
        if (close === 'mask') await page.mouse.click(500, 500);
        await page.locator('.p-drawer-mask').waitFor({ state: 'detached' });
        await drawer.waitFor({ state: 'hidden' });
        await page.getByRole('button', { name: 'Settings', exact: true }).click({ trial: true });
        result.checks[reducedMotion + '-' + close + '-maskRemoved'] = true;
      }
      const nav = await page
        .locator('app-side-navigation .p-drawer')
        .evaluate(e => ({ animations: e.getAnimations().length, transform: getComputedStyle(e).transform }));
      if (nav.animations || nav.transform !== 'none') throw Error('Persistent navigation animates');
      result.checks[reducedMotion + '-navigationStill'] = true;
      await page.goto('http://127.0.0.1:4317/#/parts-lists');
      await page.waitForFunction(() => window.brickHunterReference && document.querySelector('app-locale'));
      await page.evaluate(() => {
        const locale = window.ng.getComponent(document.querySelector('app-locale'));
        locale.visible = true;
        window.ng.applyChanges(locale);
      });
      await page.getByRole('combobox', { name: 'Country', exact: true }).click();
      await page.waitForFunction(() => {
        const popup = document.querySelector('.p-select-overlay');
        const content = popup?.parentElement;
        return (
          popup &&
          content &&
          getComputedStyle(popup).willChange === 'auto' &&
          getComputedStyle(content).willChange === 'auto' &&
          !/-enter-|-leave-/.test(content.className)
        );
      });
      await page.getByRole('combobox', { name: 'Country', exact: true }).press('Escape');
      await page.locator('.p-select-overlay').waitFor({ state: 'detached' });
      result.checks[reducedMotion + '-selectSettledRasterAndCleanup'] = true;
      await page.getByRole('dialog').getByRole('button', { name: 'Save', exact: true }).click();
      await page.locator('app-locale .p-dialog-mask').waitFor({ state: 'detached' });
      if (reducedMotion === 'no-preference') {
        await page.goto('http://127.0.0.1:4317/#/parts-lists');
        await page.locator('.p-datatable-tbody input[type=checkbox]').first().check();
        await page.locator('.p-datatable-thead button').click();
        await page.locator('.bh-menu-panel.p-anchored-overlay-enter-active').waitFor({ timeout: 2000 });
        const menu = page.locator('.bh-menu-panel.p-menu-overlay');
        const enter = await menu.evaluate(e => ({
          duration: getComputedStyle(e).animationDuration,
          easing: getComputedStyle(e).animationTimingFunction,
        }));
        if (enter.duration !== '0.12s' || enter.easing !== 'cubic-bezier(0, 0, 0.2, 1)')
          throw Error('Menu enter timing changed ' + JSON.stringify(enter));
        await page.waitForTimeout(200);
        await menu.locator('[role=menu]').press('Escape');
        await page.locator('.bh-menu-panel.p-anchored-overlay-leave-active').waitFor({ timeout: 2000 });
        const leave = await menu.evaluate(e => ({
          duration: getComputedStyle(e).animationDuration,
          easing: getComputedStyle(e).animationTimingFunction,
        }));
        if (leave.duration !== '0.1s' || leave.easing !== 'linear')
          throw Error('Menu leave timing changed ' + JSON.stringify(leave));
        await menu.waitFor({ state: 'detached' });
        result.measurements.push({ menuEnter: enter, menuLeave: leave });
        result.checks.menuTimingAndCleanup = true;
      }
      await page.close();
    }
    if (result.errors.length) throw Error('Browser errors');
  } finally {
    if (Object.keys(result.checks).length < 13 && diagnosticPage && !diagnosticPage.isClosed()) {
      await diagnosticPage.screenshot({ path: path.join(evidenceDir, 'ui-motion-incomplete.png') });
      result.incompleteDom = await diagnosticPage.evaluate(() => ({
        settings: window.ng.getComponent(document.querySelector('app-parts-list-settings'))?.display,
        visible: window.ng.getComponent(document.querySelector('app-parts-list-settings p-drawer'))?.visible(),
        modalVisible: window.ng
          .getComponent(document.querySelector('app-parts-list-settings p-drawer'))
          ?.modalVisible(),
        drawer: document.querySelector('app-parts-list-settings p-drawer')?.outerHTML.slice(0, 1800),
        active: document.activeElement?.outerHTML.slice(0, 400),
      }));
    }
    await fs.writeFile(
      path.join(evidenceDir, 'ui-motion-verification-final.json'),
      JSON.stringify(result, null, 2) + '\n'
    );
    await browser.close();
    await new Promise(r => server.close(r));
  }
  console.log(JSON.stringify(result, null, 2));
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});

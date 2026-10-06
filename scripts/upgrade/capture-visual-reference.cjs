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
const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
};

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
      if (!file.startsWith(root + path.sep)) {
        response.writeHead(403).end();
        return;
      }
      response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
      response.end(await fs.readFile(file));
    } catch {
      response.writeHead(404).end();
    }
  });
  // Fixed dedicated origin, separate from ng serve and Karma.
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(4317, '127.0.0.1', resolve);
  });
  let browser;
  const lock = JSON.parse(await fs.readFile('package-lock.json', 'utf8'));
  const report = {
    label,
    capturedAt: new Date().toISOString(),
    browser: '',
    zoom: '100%',
    versions: {
      angular: lock.packages['node_modules/@angular/core'].version,
      primeng: lock.packages['node_modules/primeng'].version,
      playwright: require('playwright/package.json').version,
    },
    deviceScaleFactor: 1,
    timezone: 'Europe/Zurich',
    externalRequests: [],
    pageErrors: [],
    consoleErrors: [],
    knownConsoleErrors: [],
    scenarios: [],
  };
  try {
    browser = await chromium.launch({
      executablePath: process.env.CHROME_BIN || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true,
      args: ['--use-angle=d3d11'],
    });
    report.browser = browser.version();
    const gpuSession = await browser.newBrowserCDPSession();
    async function rendererStatus() {
      const { gpu } = await gpuSession.send('SystemInfo.getInfo');
      return {
        renderer: gpu.auxAttributes.glRenderer,
        compositing: gpu.featureStatus.gpu_compositing,
        rasterization: gpu.featureStatus.rasterization,
      };
    }
    report.renderer = await rendererStatus();
    if (
      !report.renderer.renderer.includes('Direct3D11') ||
      report.renderer.compositing !== 'enabled' ||
      report.renderer.rasterization !== 'enabled'
    )
      throw new Error(
        'Reference capture requires the D3D11 GPU pipeline; software fallback would change reference pixels'
      );
    for (const viewport of [
      { width: 1440, height: 1000 },
      { width: 390, height: 844 },
      { width: 2560, height: 1440 },
      { width: 3200, height: 1440 },
    ]) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        timezoneId: 'Europe/Zurich',
        locale: 'de-DE',
        reducedMotion: 'reduce',
      });
      await context.addInitScript(() => {
        const OriginalDate = Date;
        const fixed = OriginalDate.parse('2026-10-04T10:00:00Z');
        window.Date = class extends OriginalDate {
          constructor(...args) {
            args.length ? super(...args) : super(fixed);
          }
          static now() {
            return fixed;
          }
        };
      });
      await context.route('**/*', async route => {
        const request = route.request();
        if (new URL(request.url()).origin === 'http://127.0.0.1:4317') {
          await route.continue();
          return;
        }
        report.externalRequests.push({ url: request.url(), type: request.resourceType() });
        if (request.url() === 'https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif')
          await route.fulfill({ contentType: 'image/gif', body: donate });
        else if (
          request.resourceType() === 'image' ||
          (request.resourceType() === 'xhr' &&
            request.url().startsWith('https://brickhunter.blob.core.windows.net/parts/pab/'))
        )
          await route.fulfill({ contentType: 'image/png', body: placeholder }); // jsPDF also reads the image URL through XHR.
        else await route.abort('blockedbyclient');
      });
      const page = await context.newPage();
      page.on('pageerror', error => report.pageErrors.push({ viewport, error: error.message }));
      page.on('console', message => {
        if (message.type() !== 'error' || message.text().startsWith('Failed to load resource')) return;
        const entry = { viewport, url: page.url(), error: message.text() };
        // Existing Angular-17 table lifecycle issue, recorded in the report;
        // all other console errors fail the reference run.
        if (
          message.text().includes('NG0100: ExpressionChangedAfterItHasBeenCheckedError') &&
          message.text().includes("Previous value: 'false'. Current value: 'true'") &&
          message.text().includes('Expression location: PartsTableComponent component')
        )
          report.knownConsoleErrors.push(entry);
        else report.consoleErrors.push(entry);
      });
      async function settle() {
        await page.waitForFunction(() => window.brickHunterReference && document.querySelector('h2'));
        await page.evaluate(async () => {
          await document.fonts.ready;
        });
        await page.waitForTimeout(400); // Let Angular overlays and image layout settle.
        if (await page.locator('#p-license-host').count())
          throw new Error('PrimeUI reports an invalid license; verify the configured local license file');
        report.noInvalidLicenseBanner = true;
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
          const selectors = [
            'html',
            'body',
            'h2',
            '.p-button',
            '.p-datatable-tbody tr',
            'app-browse-parts-grid-item > div',
            '.p-dialog',
            '.p-sidebar, .p-drawer',
            '.p-card-content',
            '.p-tag',
            '.p-inputgroup',
            '.p-inputgroupaddon',
            '.p-datatable-thead tr',
            '.p-tree-node-content',
            '.p-togglebutton',
            '.p-toggleswitch-slider',
            '.p-checkbox-box',
            '.p-paginator-page',
            '.p-tab',
            '.p-message',
            '.p-dialog-header',
            '.p-dialog-footer',
            '.bh-menu-panel',
            '.bh-menu-panel .p-menu-item-link',
            '.bh-menu-swatch',
            '.p-drawer-mask',
            '.p-dialog-mask',
            '.p-drawer-header',
            '.p-fileupload-header',
            '.p-fileupload-content',
            'app-parts-list-import textarea',
            '.p-fileupload-choose-button',
            '.p-toast',
            '.p-toast-message',
            '.p-toast-message-content',
            '.p-toast-message-icon',
            '.p-toast-message-text',
            '.p-toast-summary',
            '.p-toast-detail',
            '.p-toast-close-button',
            '.p-tablist',
            '.p-tablist-active-bar',
            '.p-datatable-sort-icon',
            '.p-datatable-thead th',
            '.p-drawer-header .p-drawer-close-button',
            '.p-drawer-header svg',
            '.p-dialog-header .p-dialog-close-button',
            '.p-dialog-header svg',
            '.p-datatable-tbody tr:nth-child(2)',
            'app-pab-price .p-tag',
            'app-pab-price .p-tag-info',
            'app-pab-price .p-tag-danger',
            '.p-select',
            '.p-select-label',
            '.p-select-dropdown',
            '.p-select-overlay',
            '.p-select-option',
          ];
          const values = {};
          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (!element) continue;
            const rect = element.getBoundingClientRect();
            const css = getComputedStyle(element);
            values[selector] = {
              width: rect.width,
              height: rect.height,
              fontSize: css.fontSize,
              fontFamily: css.fontFamily,
              color: css.color,
              backgroundColor: css.backgroundColor,
              borderRadius: css.borderRadius,
              padding: css.padding,
              boxShadow: css.boxShadow,
              x: rect.x,
              y: rect.y,
              lineHeight: css.lineHeight,
              zIndex: css.zIndex,
              verticalAlign: css.verticalAlign,
            };
          }
          return values;
        });
        report.scenarios.push({ file, viewport, name, metrics });
      }
      async function component(selector, action, args = []) {
        await page.evaluate(
          ({ selector, action, args }) => {
            const element = document.querySelector(selector);
            const instance = window.ng.getComponent(element);
            // Model real application calls inside Angular's zone, including async
            // rendering of populated dialogs after the initial change detection.
            window.brickHunterReference.runInAngular(() => {
              instance[action](...args);
              window.ng.applyChanges(instance);
            });
          },
          { selector, action, args }
        );
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
        const warningScrollerHeight = await page
          .locator('app-transfer-warning .p-virtualscroller')
          .evaluate(element => element.getBoundingClientRect().height);
        if (warningScrollerHeight !== viewport.height / 2)
          throw new Error(`Transfer warning scroller height=${warningScrollerHeight}, expected ${viewport.height / 2}`);
        report.warningScrollerHeight = warningScrollerHeight;
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
        await all.hover();
        await capture('filter-hover');
        await all.focus();
        await capture('filter-focus');
        await page.evaluate(() => {
          const buttons = [...document.querySelectorAll('app-browse-parts-color-filter button')];
          buttons.find(button => button.style.backgroundColor === 'rgb(220, 53, 69)').click();
        });
        await capture('color-menu');
        await page.locator('.bh-menu-panel .p-menu-item-link').filter({ hasText: 'Red' }).click();
        await page.waitForFunction(
          () =>
            window.ng.getComponent(document.querySelector('app-browse-parts-color-filter')).browsePartsService.filter
              .colorId === 4
        );
        await open('browse-parts');
        await page.evaluate(() => window.brickHunterReference.setSearchCount(0));
        await capture('empty-search');
        await page.evaluate(() => window.brickHunterReference.setSearchCount(1000));
        await capture('large-search');
        await page.evaluate(() => window.scrollTo(0, 1400));
        await capture('large-search-scrolled');
        // Verify actual input targets after geometry/DOM changes, without changing reference images.
        await open('browse-parts');
        const category = page
          .locator('app-browse-parts-category-selection .p-tree-node-content')
          .filter({ hasText: 'Bricks' })
          .first();
        await category.click();
        if (!(await category.getAttribute('class')).includes('p-tree-node-selected'))
          throw new Error('Category selection failed');
        const printed = page.getByLabel('Only Printed', { exact: true });
        await printed.check();
        if (!(await printed.isChecked())) throw new Error('Only Printed toggle failed');
        await printed.uncheck();
        const standard = page
          .locator('app-browse-parts-filter .p-selectbutton .p-togglebutton')
          .filter({ hasText: 'Standard' });
        const wasPressed = await standard.getAttribute('aria-pressed');
        await standard.click();
        if ((await standard.getAttribute('aria-pressed')) === wasPressed)
          throw new Error('Delivery-channel selection failed');
        await page.evaluate(() => window.brickHunterReference.setSearchCount(1000));
        await page
          .locator('.p-paginator-page')
          .filter({ hasText: /^\s*2\s*$/ })
          .first()
          .click();
        await page.waitForFunction(
          () => document.querySelector('.p-paginator-page-selected')?.textContent.trim() === '2'
        );
        report.interactionChecks = {
          transferWarningPreservesHalfViewportScroller: report.warningScrollerHeight === 500,
          categorySelection: true,
          onlyPrintedToggle: true,
          deliveryChannelSelection: true,
          paginatorPageSelection: true,
        };
        report.interactionChecks.publicColorMenuSelection = true;
        await open('parts-lists');
        await page.locator('.p-datatable-tbody .p-checkbox').first().click();
        await page.locator('.p-datatable-thead button').first().click();
        await page
          .locator('.bh-menu-panel .p-menu-item-link')
          .filter({ hasText: /^Delete$/ })
          .click();
        await page
          .getByRole('alertdialog')
          .filter({ hasText: 'Do you want to delete the selected Parts Lists?' })
          .waitFor();
        report.interactionChecks.publicListBulkMenuCommand = true;
        await open('parts-lists/upgrade-reference');
        await page.locator('app-parts-table .p-datatable-tbody .p-checkbox').first().click();
        await page.locator('app-parts-table .p-datatable-thead button').first().click();
        await page
          .locator('.bh-menu-panel .p-menu-item-link')
          .filter({ hasText: /^Copy to$/ })
          .click();
        await page.locator('app-parts-list-copy-or-move-to .p-drawer').waitFor();
        report.interactionChecks.publicPartsBulkMenuCommand = true;
        await open('parts-lists');
        await page.getByRole('button', { name: 'Import', exact: true }).click();
        const importDrawer = page.locator('app-parts-list-import .p-drawer');
        const [chooser] = await Promise.all([
          page.waitForEvent('filechooser'),
          importDrawer.locator('button.p-fileupload-choose-button').click(),
        ]);
        await chooser.setFiles({
          name: 'list.json',
          mimeType: 'application/json',
          buffer: Buffer.from('{"name":"Browser JSON","parts":[]}'),
        });
        await page.waitForFunction(
          () => document.querySelector('app-parts-list-import #partsListName')?.value === 'Browser JSON'
        );
        await page.screenshot({
          path: path.join(output, '1440x1000-import-selected-json.png'),
          animations: 'disabled',
        });
        await importDrawer.getByRole('button', { name: 'Cancel', exact: true }).click();
        if (await importDrawer.locator('.p-fileupload-file').count())
          throw new Error('Cancel did not clear the file selection');
        await importDrawer.locator('.p-drawer-header button').click();
        await page.getByRole('button', { name: 'Import', exact: true }).click();
        if ((await importDrawer.locator('textarea').inputValue()) !== '')
          throw new Error('Import form was not reset on close');
        await importDrawer.locator('.p-fileupload-content').evaluate(element => {
          const transfer = new DataTransfer();
          transfer.items.add(
            new File(
              [
                '<INVENTORY><ITEM><ITEMID>3001</ITEMID><ITEMTYPE>P</ITEMTYPE><COLOR>5</COLOR><MINQTY>3</MINQTY></ITEM></INVENTORY>',
              ],
              'wanted.xml',
              { type: 'text/xml' }
            )
          );
          element.dispatchEvent(new DragEvent('drop', { dataTransfer: transfer, bubbles: true, cancelable: true }));
        });
        await page.waitForFunction(
          () => document.querySelector('app-parts-list-import #partsListName')?.value === 'wanted'
        );
        await page.screenshot({ path: path.join(output, '1440x1000-import-dropped-xml.png'), animations: 'disabled' });
        report.additionalScreenshots = ['1440x1000-import-selected-json.png', '1440x1000-import-dropped-xml.png'];
        report.interactionChecks.importFileChooserJson = true;
        report.interactionChecks.importCancelAndCloseReset = true;
        report.interactionChecks.importXmlDrop = true;
        await open('parts-lists/upgrade-reference');
        for (const severity of ['success', 'info', 'warn', 'error']) {
          await page.evaluate(
            severity =>
              window.brickHunterReference.showMessage(
                severity,
                'Reference notification',
                'Detail text for the notification.'
              ),
            severity
          );
          await settle();
          const toast = page.locator('.p-toast-message');
          await toast.filter({ hasText: 'Detail text for the notification.' }).waitFor();
          // Keep the original successive-message hover state explicit. A newly
          // inserted native button need not inherit the removed button's hover.
          if (severity !== 'success') await toast.locator('.p-toast-close-button').hover();
          const file = `1440x1000-toast-${severity}.png`;
          await page.screenshot({ path: path.join(output, file), animations: 'disabled' });
          report.additionalScreenshots.push(file);
          await toast.locator('.p-toast-close-button').click();
          await toast.waitFor({ state: 'detached' });
        }
        report.interactionChecks.toastSeverityDisplayAndClose = true;
        await page.evaluate(() => {
          window.brickHunterReference.showMessage('warn', 'First message');
          window.brickHunterReference.showMessage('error', 'Second message');
        });
        await page.locator('.p-toast-message').first().locator('.p-toast-close-button').press('Enter');
        await page.waitForFunction(
          () =>
            document.querySelectorAll('.p-toast-message').length === 1 &&
            document.querySelector('.p-toast-message').textContent.includes('Second message')
        );
        await page.evaluate(() => window.brickHunterReference.clearMessages());
        report.interactionChecks.toastKeyboardClosePreservesOtherMessage = true;
        await open('parts-lists/upgrade-reference');
        async function additionalCapture(name) {
          await settle();
          const file = `1440x1000-${name}.png`;
          await page.screenshot({ path: path.join(output, file), animations: 'disabled' });
          report.additionalScreenshots.push(file);
          if (name.startsWith('select-')) {
            report.selectMeasurements ||= {};
            report.selectMeasurements[file] = await page.evaluate(() => {
              const selectors = [
                '.p-select',
                '.p-select-label',
                '.p-select-dropdown',
                '.p-select-overlay',
                '.p-select-list',
                '.p-select-option',
                '.p-select-option-selected',
                '.p-select-option.p-focus',
              ];
              return Object.fromEntries(
                selectors.map(selector => {
                  const element = document.querySelector(selector);
                  if (!element) return [selector, null];
                  const rect = element.getBoundingClientRect(),
                    css = getComputedStyle(element);
                  return [
                    selector,
                    {
                      width: rect.width,
                      height: rect.height,
                      x: rect.x,
                      y: rect.y,
                      padding: css.padding,
                      color: css.color,
                      backgroundColor: css.backgroundColor,
                      borderRadius: css.borderRadius,
                      boxShadow: css.boxShadow,
                      opacity: css.opacity,
                    },
                  ];
                })
              );
            });
          }
        }
        const quantityHeader = page.locator('app-parts-table th[pSortableColumn="qty"]');
        report.tableHeaderMeasurements = await page.locator('app-parts-table .p-datatable-thead').evaluate(header => {
          const row = header.querySelector('tr'),
            cell = header.querySelector('th');
          return {
            height: row.getBoundingClientRect().height,
            borderColor: getComputedStyle(cell).borderBottomColor,
            icons: [...header.querySelectorAll('p-sorticon svg.p-datatable-sort-icon')].map(icon => {
              const rect = icon.getBoundingClientRect();
              return {
                wrapperDisplay: getComputedStyle(icon.closest('p-sorticon')).display,
                verticalAlign: getComputedStyle(icon).verticalAlign,
                width: rect.width,
                height: rect.height,
                x: rect.x,
                y: rect.y,
                color: getComputedStyle(icon).color,
              };
            }),
          };
        });
        const headerMeasurement = report.tableHeaderMeasurements;
        if (
          headerMeasurement.height !== 56 ||
          headerMeasurement.borderColor !== 'rgb(228, 228, 228)' ||
          headerMeasurement.icons.length !== 6 ||
          headerMeasurement.icons.some(
            icon =>
              icon.wrapperDisplay !== 'inline' ||
              icon.verticalAlign !== 'middle' ||
              icon.width !== 14 ||
              icon.height !== 14
          )
        )
          throw new Error('Table header border, geometry or sort icon alignment changed');
        report.interactionChecks.tableHeaderBorderAndSortIconAlignment = true;
        await quantityHeader.press('Enter');
        await page.waitForFunction(() => {
          const table = window.ng.getComponent(document.querySelector('app-parts-table'));
          return (
            table.parts[0].qty === 10 &&
            document.querySelector('th[psortablecolumn="qty"]').getAttribute('aria-sort') === 'ascending'
          );
        });
        await additionalCapture('table-sort-ascending');
        const headerFocus = await quantityHeader.evaluate(element => {
          const css = getComputedStyle(element);
          return { outlineWidth: css.outlineWidth, boxShadow: css.boxShadow };
        });
        if (headerFocus.outlineWidth !== '0px' || headerFocus.boxShadow !== 'none')
          throw new Error(`Unexpected table header focus: ${JSON.stringify(headerFocus)}`);
        await quantityHeader.press('Enter');
        await page.waitForFunction(() => {
          const table = window.ng.getComponent(document.querySelector('app-parts-table'));
          return (
            table.parts[0].qty === 120 &&
            document.querySelector('th[psortablecolumn="qty"]').getAttribute('aria-sort') === 'descending'
          );
        });
        await additionalCapture('table-sort-descending');
        report.interactionChecks.tableKeyboardSortAscendingDescending = true;
        await quantityHeader.hover();
        const hoverBackground = await quantityHeader.evaluate(element => getComputedStyle(element).backgroundColor);
        if (hoverBackground !== 'rgb(245, 245, 245)')
          throw new Error(`Unexpected table header hover: ${hoverBackground}`);
        await additionalCapture('table-header-hover');
        report.interactionChecks.tableSortedHeaderHover = true;
        await open('parts-lists/upgrade-reference');
        const tabs = page.getByRole('tab');
        await tabs.first().press('ArrowRight');
        if (!(await tabs.nth(1).evaluate(element => element === document.activeElement)))
          throw new Error('ArrowRight did not focus the next table tab');
        await tabs.nth(1).press('Enter');
        await page.waitForFunction(() => {
          const detail = window.ng.getComponent(document.querySelector('app-parts-list-detail'));
          return (
            detail.activeItem.id === 'pab' &&
            document.querySelector('[role="tab"][aria-selected="true"]').textContent.includes('PaB Bestseller')
          );
        });
        await additionalCapture('table-tab-keyboard');
        report.interactionChecks.tableTabKeyboardFilter = true;
        await open('parts-lists/upgrade-reference');
        await page.getByRole('button', { name: 'Settings', exact: true }).click();
        const unit = page.getByRole('combobox', { name: 'Price reduction unit', exact: true });
        await unit.click();
        await page.getByRole('listbox').waitFor();
        await additionalCapture('select-unit-popup');
        await page.getByRole('option', { name: '%', exact: true }).click();
        await page.locator('app-parts-list-settings').getByRole('button', { name: 'Save', exact: true }).click();
        await page.getByRole('button', { name: 'Settings', exact: true }).click();
        await page.waitForFunction(
          () =>
            window.ng.getComponent(document.querySelector('app-parts-list-settings')).form.value
              .subtractBrickLinkPriceUnit.code === 'percentage'
        );
        if ((await unit.textContent()).trim() !== '%') throw new Error('Select did not restore the saved unit label');
        await additionalCapture('select-unit-selected');
        report.interactionChecks.selectUnitMouseSaveAndReopen = true;
        await unit.press('ArrowDown');
        await page.getByRole('listbox').waitFor();
        await settle();
        await unit.press('Home');
        await unit.press('Enter');
        await page.waitForFunction(
          () =>
            window.ng.getComponent(document.querySelector('app-parts-list-settings')).form.value
              .subtractBrickLinkPriceUnit.code === 'absolute'
        );
        await unit.press('ArrowDown');
        await page.getByRole('listbox').waitFor();
        await settle();
        await unit.press('ArrowDown');
        await unit.press('Escape');
        if (
          (await unit.getAttribute('aria-expanded')) !== 'false' ||
          !(await page.evaluate(
            () =>
              window.ng.getComponent(document.querySelector('app-parts-list-settings')).form.value
                .subtractBrickLinkPriceUnit.code === 'absolute'
          ))
        )
          throw new Error('Escape changed the selected unit or left the popup open');
        report.interactionChecks.selectUnitKeyboardAndEscape = true;
        // PrimeNG 21 removes the popup after its CSS leave animation, after aria-expanded changes.
        await page.getByRole('listbox').waitFor({ state: 'detached' });
        await page.evaluate(() => {
          const settings = window.ng.getComponent(document.querySelector('app-parts-list-settings'));
          settings.form.controls.subtractBrickLinkPriceUnit.disable();
          window.ng.applyChanges(settings);
        });
        if ((await unit.getAttribute('aria-disabled')) !== 'true')
          throw new Error('Disabled Select is not exposed as disabled');
        await page.locator('app-parts-list-settings .p-select').click({ force: true });
        await settle();
        if ((await page.getByRole('listbox').count()) !== 0) {
          const state = await page.locator('app-parts-list-settings .p-select').evaluate(element => {
            const select = window.ng.getComponent(element);
            return {
              disabled: select.$disabled(),
              overlayVisible: select.overlayVisible(),
              html: document.querySelector('[role="listbox"]')?.outerHTML.slice(0, 600),
            };
          });
          throw new Error('Disabled Select opened its popup: ' + JSON.stringify(state));
        }
        await additionalCapture('select-unit-disabled');
        report.interactionChecks.selectDisabledBlocksPopup = true;
        await page.keyboard.press('Escape');
        await page.waitForFunction(
          () => !window.ng.getComponent(document.querySelector('app-parts-list-settings')).display
        );
        report.interactionChecks.selectNestedPopupAndDrawerEscape = true;
        await open('parts-lists');
        await page.evaluate(() => {
          const locale = window.ng.getComponent(document.querySelector('app-locale'));
          locale.visible = true;
          window.ng.applyChanges(locale);
        });
        await additionalCapture('select-locale-dialog');
        if (
          await page
            .getByRole('dialog')
            .getByRole('button', { name: 'Save', exact: true })
            .evaluate(element => element !== document.activeElement)
        )
          throw new Error('Locale dialog lost the legacy initial Save focus');
        report.interactionChecks.localeDialogInitialSaveFocus = true;
        const country = page.getByRole('combobox', { name: 'Country', exact: true });
        const language = page.getByRole('combobox', { name: 'Language', exact: true });
        await country.click();
        await page.getByRole('listbox').waitFor();
        await additionalCapture('select-country-popup');
        const countryScroll = page.locator('.p-select-list-container');
        if ((await countryScroll.evaluate(element => element.scrollTop)) !== 0)
          throw new Error('Country popup no longer opens at the beginning');
        await country.press('End');
        await settle();
        if ((await countryScroll.evaluate(element => element.scrollTop)) <= 0)
          throw new Error('Country End key did not scroll the list');
        await country.press('Home');
        await settle();
        if ((await countryScroll.evaluate(element => element.scrollTop)) !== 0)
          throw new Error('Country Home key did not return to the beginning');
        report.interactionChecks.selectCountryInitialScrollAndHomeEnd = true;
        await page.getByRole('option', { name: 'Switzerland', exact: true }).click();
        await settle();
        await language.press('ArrowDown');
        await page.getByRole('listbox').waitFor();
        await settle();
        await language.press('Home');
        await language.press('ArrowDown');
        await additionalCapture('select-language-popup');
        await language.press('Enter');
        await page.waitForFunction(() => {
          const locale = window.ng.getComponent(document.querySelector('app-locale'));
          return locale.selectedCountry.code === 'ch' && locale.selectedLanguage.code === 'fr';
        });
        await page.getByRole('dialog').getByRole('button', { name: 'Save', exact: true }).click();
        if (
          !(await page.evaluate(
            () => localStorage.getItem('country') === 'ch' && localStorage.getItem('language') === 'fr'
          ))
        )
          throw new Error('Locale Select values were not persisted');
        report.interactionChecks.selectLocaleLabelsMouseKeyboardAndSave = true;

        // Exercise real buttons without triggering destructive extension actions.
        // All clicks below use the disposable reference database.
        report.buttonMeasurements = {};
        async function buttonStyle(button, name, expected) {
          await page.waitForTimeout(250); // Legacy color transitions take 200 ms.
          const style = await button.evaluate(element => {
            const css = getComputedStyle(element),
              rect = element.getBoundingClientRect();
            return {
              color: css.color,
              backgroundColor: css.backgroundColor,
              boxShadow: css.boxShadow,
              outlineWidth: css.outlineWidth,
              opacity: css.opacity,
              width: rect.width,
              height: rect.height,
              padding: css.padding,
              fontSize: css.fontSize,
              verticalAlign: css.verticalAlign,
            };
          });
          report.buttonMeasurements[name] = style;
          if (style.verticalAlign !== 'bottom') throw new Error(`${name}: inline button lost legacy bottom alignment`);
          for (const [property, value] of Object.entries(expected)) {
            if (style[property] !== value)
              throw new Error(`${name}: ${property}=${style[property]}, expected ${value}`);
          }
        }
        await open('parts-lists/upgrade-reference');
        const remove = page.locator('app-parts-table .p-datatable-tbody .p-button-danger').first();
        if (await remove.evaluate(element => element.hasAttribute('autofocus') || element === document.activeElement))
          throw new Error('Unspecified button autofocus stole the initial page focus');
        report.interactionChecks.buttonUnspecifiedAutofocusPreservesInitialFocus = true;
        await buttonStyle(remove, 'danger-text-rest', {
          color: 'rgb(211, 47, 47)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          width: 48,
          height: 48,
        });
        await remove.hover();
        await buttonStyle(remove, 'danger-text-hover', {
          backgroundColor: 'rgba(211, 47, 47, 0.04)',
          width: 48,
          height: 48,
        });
        await additionalCapture('button-danger-hover');
        await page.mouse.move(600, 60); // Neutral header area, outside hover navigation.
        await remove.focus();
        await buttonStyle(remove, 'danger-text-focus', {
          backgroundColor: 'rgba(211, 47, 47, 0.12)',
          outlineWidth: '0px',
          boxShadow: 'none',
        });
        await additionalCapture('button-danger-focus');
        await page.keyboard.down('Space');
        await buttonStyle(remove, 'danger-text-active', {
          backgroundColor: 'rgba(211, 47, 47, 0.16)',
          width: 48,
          height: 48,
        });
        await page.keyboard.up('Space');
        await page.waitForFunction(
          () => window.ng.getComponent(document.querySelector('app-parts-list-detail')).partsList.parts.length === 7
        );
        report.interactionChecks.buttonDangerMouseFocusActiveAndSpaceDelete = true;

        await open('parts-lists/upgrade-reference');
        const settingsButton = page.getByRole('button', { name: 'Settings', exact: true });
        await settingsButton.hover();
        await buttonStyle(settingsButton, 'primary-outlined-hover', {
          backgroundColor: 'rgba(10, 52, 99, 0.04)',
          height: 41.84375,
        });
        await page.mouse.move(600, 60); // Neutral header area, outside hover navigation.
        await settingsButton.focus();
        await buttonStyle(settingsButton, 'primary-outlined-focus', { backgroundColor: 'rgba(10, 52, 99, 0.12)' });
        await additionalCapture('button-outlined-focus');
        await settingsButton.press('Enter');
        await page.waitForFunction(
          () => window.ng.getComponent(document.querySelector('app-parts-list-settings')).display
        );
        report.interactionChecks.buttonOutlinedHoverFocusAndEnterOpensDrawer = true;
        await page.keyboard.press('Escape');
        const transferButton = page.getByRole('button', { name: 'Transfer', exact: true }).first();
        await transferButton.hover();
        await buttonStyle(transferButton, 'primary-solid-hover', {
          backgroundColor: 'rgba(10, 52, 99, 0.92)',
          height: 41.84375,
        });
        await page.mouse.move(600, 60); // Neutral header area, outside hover navigation.
        await transferButton.focus();
        await buttonStyle(transferButton, 'primary-solid-focus', { backgroundColor: 'rgba(10, 52, 99, 0.76)' });
        await additionalCapture('button-solid-focus');
        await page.keyboard.down('Space');
        await buttonStyle(transferButton, 'primary-solid-active', {
          backgroundColor: 'rgba(10, 52, 99, 0.68)',
          height: 41.84375,
        });
        await page.keyboard.up('Space');
        await page.waitForFunction(
          () => window.ng.getComponent(document.querySelector('app-parts-list-transfer')).show
        );
        report.interactionChecks.buttonSolidHoverFocusActiveAndSpaceTransfer = true;

        await open('parts-lists/upgrade-reference');
        await page.evaluate(() => {
          const detail = window.ng.getComponent(document.querySelector('app-parts-list-detail'));
          detail.pabIsLoading = true;
          window.ng.applyChanges(detail);
        });
        const resync = page.getByRole('button', { name: 'ReSync', exact: true });
        if (!(await resync.isDisabled())) throw new Error('Loading ReSync must be disabled');
        await resync.hover({ force: true });
        await buttonStyle(resync, 'primary-outlined-disabled-hover', {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          color: 'rgba(0, 0, 0, 0.38)',
          opacity: '1',
        });
        await resync.click({ force: true });
        if (
          !(await page.evaluate(
            () => window.ng.getComponent(document.querySelector('app-parts-list-detail')).pabIsLoading
          ))
        )
          throw new Error('Disabled ReSync invoked its command');
        report.interactionChecks.buttonDisabledBlocksCommand = true;

        await open('parts-lists');
        const deleteList = page.locator('app-parts-list-list .p-button-danger.p-button-outlined').first();
        await buttonStyle(deleteList, 'danger-outlined-rest', { color: 'rgb(211, 47, 47)' });
        await deleteList.hover();
        await buttonStyle(deleteList, 'danger-outlined-hover', { backgroundColor: 'rgba(211, 47, 47, 0.04)' });
        await page.mouse.move(600, 60); // Neutral header area, outside hover navigation.
        await deleteList.focus();
        await buttonStyle(deleteList, 'danger-outlined-focus', { backgroundColor: 'rgba(211, 47, 47, 0.12)' });
        await additionalCapture('button-danger-outlined-focus');
        report.interactionChecks.buttonDangerOutlinedStates = true;

        await open('parts-lists');
        const listBulkButton = page.locator('app-parts-list-list .p-datatable-thead button');
        await buttonStyle(listBulkButton, 'list-bulk-disabled', {
          width: 48,
          height: 23,
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
          color: 'rgba(0, 0, 0, 0.38)',
        });
        const listGeometry = await page.locator('app-parts-list-list .p-datatable').evaluate(table => ({
          headerHeight: table.querySelector('thead tr').getBoundingClientRect().height,
          rowHeight: table.querySelector('tbody tr').getBoundingClientRect().height,
        }));
        if (listGeometry.headerHeight !== 56 || listGeometry.rowHeight !== 46.84375)
          throw new Error(`List header or row geometry changed: ${JSON.stringify(listGeometry)}`);
        report.buttonListGeometry = listGeometry;
        await page.locator('app-parts-list-list .p-datatable-tbody input[type="checkbox"]').first().check();
        if (!(await listBulkButton.isEnabled())) throw new Error('List selection did not enable the bulk button');
        await listBulkButton.hover();
        await buttonStyle(listBulkButton, 'list-bulk-hover', {
          width: 48,
          height: 23,
          backgroundColor: 'rgba(10, 52, 99, 0.92)',
        });
        await page.mouse.move(600, 60);
        await listBulkButton.focus();
        await buttonStyle(listBulkButton, 'list-bulk-focus', {
          width: 48,
          height: 23,
          backgroundColor: 'rgba(10, 52, 99, 0.76)',
        });
        await additionalCapture('button-list-bulk-focus');
        await page.keyboard.down('Space');
        await buttonStyle(listBulkButton, 'list-bulk-active', {
          width: 48,
          height: 23,
          backgroundColor: 'rgba(10, 52, 99, 0.68)',
        });
        await page.keyboard.up('Space');
        const listBulkPopup = page.locator('app-parts-list-list .bh-menu-panel:visible');
        await listBulkPopup.waitFor();
        await listBulkPopup.locator('[role="menu"]').press('Escape');
        await listBulkPopup.waitFor({ state: 'hidden' });
        if (!(await listBulkButton.evaluate(element => document.activeElement === element)))
          throw new Error('List bulk-menu Escape did not restore button focus');
        report.interactionChecks.buttonListHeaderGeometryBulkStatesAndSpaceMenu = true;

        await open('browse-parts');
        const haveIt = page.locator('app-browse-parts-grid-item .p-button-success').first();
        await buttonStyle(haveIt, 'success-text-rest', { color: 'rgb(104, 159, 56)' });
        await haveIt.hover();
        await buttonStyle(haveIt, 'success-text-hover', { backgroundColor: 'rgba(104, 159, 56, 0.04)' });
        await page.mouse.move(600, 60); // Neutral header area, outside hover navigation.
        await haveIt.focus();
        await buttonStyle(haveIt, 'success-text-focus', { backgroundColor: 'rgba(104, 159, 56, 0.12)' });
        await additionalCapture('button-success-focus');
        await haveIt.press('Enter');
        await page.waitForFunction(() => JSON.parse(localStorage.getItem('haveIts')).length === 1);
        report.interactionChecks.buttonSuccessStatesAndEnterPersistsHaveIt = true;

        report.toggleMeasurements = {};
        async function toggleStyle(input, name, checked, disabled = false, halo) {
          await page.waitForTimeout(250);
          const style = await input.evaluate(element => {
            const root = element.closest('.p-toggleswitch'),
              handle = root.querySelector('.p-toggleswitch-handle');
            const rect = root.getBoundingClientRect(),
              grip = handle.getBoundingClientRect();
            const css = getComputedStyle(handle);
            return {
              width: rect.width,
              height: rect.height,
              handleWidth: grip.width,
              handleHeight: grip.height,
              handleOffset: grip.x - rect.x,
              handleBackground: css.backgroundColor,
              handleShadow: css.boxShadow,
              trackBackground: getComputedStyle(root.querySelector('.p-toggleswitch-slider')).backgroundColor,
              opacity: getComputedStyle(root).opacity,
              disabled: element.disabled,
              checked: element.checked,
            };
          });
          report.toggleMeasurements[name] = style;
          const expected = {
            width: 44,
            height: 16,
            handleWidth: 24,
            handleHeight: 24,
            handleOffset: checked ? 24 : 0,
            handleBackground: checked ? 'rgb(10, 52, 99)' : 'rgb(255, 255, 255)',
            trackBackground: checked ? 'rgba(10, 52, 99, 0.5)' : 'rgba(0, 0, 0, 0.38)',
            opacity: disabled ? '0.38' : '1',
            checked,
            disabled,
          };
          for (const [property, value] of Object.entries(expected)) {
            if (style[property] !== value)
              throw new Error(`${name}: ${property}=${style[property]}, expected ${value}`);
          }
          if (halo && !style.handleShadow.includes(halo))
            throw new Error(`${name}: wrong hover/focus shadow ${style.handleShadow}`);
        }
        await open('browse-parts');
        const printedSwitch = page.getByLabel('Only Printed', { exact: true });
        await page.mouse.move(600, 60);
        await toggleStyle(printedSwitch, 'printed-off', false);
        await printedSwitch.hover();
        await toggleStyle(printedSwitch, 'printed-off-hover', false, false, 'rgba(0, 0, 0, 0.04)');
        await additionalCapture('toggle-off-hover');
        await page.mouse.move(600, 60);
        await printedSwitch.focus();
        await toggleStyle(printedSwitch, 'printed-off-focus', false, false, 'rgba(0, 0, 0, 0.12)');
        await additionalCapture('toggle-off-focus');
        await printedSwitch.press('Space');
        await page.waitForFunction(
          () =>
            window.ng.getComponent(document.querySelector('app-browse-parts-filter')).browsePartsService.filter
              .onlyPrinted === true
        );
        await toggleStyle(printedSwitch, 'printed-on-focus', true, false, 'rgba(10, 52, 99, 0.12)');
        await additionalCapture('toggle-on-focus');
        await printedSwitch.evaluate(element => element.blur());
        await printedSwitch.hover();
        await toggleStyle(printedSwitch, 'printed-on-hover', true, false, 'rgba(10, 52, 99, 0.04)');
        await additionalCapture('toggle-on-hover');
        await printedSwitch.click();
        await page.waitForFunction(
          () =>
            window.ng.getComponent(document.querySelector('app-browse-parts-filter')).browsePartsService.filter
              .onlyPrinted === false
        );
        report.interactionChecks.togglePrintedMouseSpaceBindingAndStates = true;

        for (const checked of [false, true]) {
          await open('browse-parts');
          if (checked) await printedSwitch.check();
          await printedSwitch.evaluate(element => element.blur());
          await page.evaluate(() => {
            const toggle = window.ng.getComponent(document.querySelector('p-toggleswitch'));
            toggle.setDisabledState(true);
            window.ng.applyChanges(toggle);
          });
          await printedSwitch.hover({ force: true });
          await toggleStyle(printedSwitch, `printed-${checked ? 'on' : 'off'}-disabled`, checked, true);
          await printedSwitch.click({ force: true });
          await toggleStyle(printedSwitch, `printed-${checked ? 'on' : 'off'}-disabled-after-click`, checked, true);
          await additionalCapture(`toggle-${checked ? 'on' : 'off'}-disabled`);
        }
        report.interactionChecks.toggleDisabledOnOffBlocksClick = true;
        await open('parts-lists/upgrade-reference');
        for (const [id, model] of [
          ['useAffiliatePaB', 'useAffiliatePaB'],
          ['useAffiliateBaP', 'useAffiliateBaP'],
        ]) {
          const input = page.locator(`#${id}`);
          await toggleStyle(input, `${id}-on`, true);
          await input.press('Space');
          if (
            !(await page.evaluate(
              model => window.ng.getComponent(document.querySelector('app-parts-list-detail'))[model] === false,
              model
            ))
          )
            throw new Error(`${id}: Space did not update the affiliate model`);
          await toggleStyle(input, `${id}-off-focus`, false, false, 'rgba(0, 0, 0, 0.12)');
          await page.locator(`label[for="${id}"]`).click();
          if (!(await input.isChecked())) throw new Error(`${id}: label click did not toggle`);
        }
        report.interactionChecks.toggleAffiliateSpaceAndLabelBinding = true;

        await open('browse-parts');
        const colorButtons = page.locator('app-browse-parts-color-filter button');
        const redIndex = await colorButtons.evaluateAll(buttons =>
          buttons.findIndex(button => button.style.backgroundColor === 'rgb(220, 53, 69)')
        );
        if (redIndex < 0) throw new Error('Red menu trigger missing');
        const redTrigger = colorButtons.nth(redIndex);
        const popup = page.locator('.bh-menu-panel:visible');
        const menuList = popup.locator('[role="menu"]');
        async function openRedMenu() {
          await redTrigger.click();
          await popup.waitFor();
          await settle();
        }
        await openRedMenu();
        await menuList.press('Home');
        const redItem = popup.locator('.p-menu-item-content').first();
        await redItem.hover();
        await page.waitForTimeout(250);
        report.menuMeasurements = await popup.evaluate(panel => {
          const rect = panel.getBoundingClientRect(),
            item = panel.querySelector('.p-menu-item-content');
          return {
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y,
            focusAndHoverBackground: getComputedStyle(item).backgroundColor,
            activeDescendant: panel.querySelector('[role="menu"]').getAttribute('aria-activedescendant'),
            swatchWidth: panel.querySelector('.bh-menu-swatch').getBoundingClientRect().width,
          };
        });
        if (
          report.menuMeasurements.focusAndHoverBackground !== 'rgba(0, 0, 0, 0.12)' ||
          report.menuMeasurements.width !== 200 ||
          report.menuMeasurements.swatchWidth !== 13
        )
          throw new Error('Color menu focus/hover state or geometry differs from reference');
        await additionalCapture('menu-color-focus-hover');
        report.interactionChecks.menuColorFocusSurvivesHover = true;
        await menuList.press('Escape');
        await popup.waitFor({ state: 'hidden' });
        if (!(await redTrigger.evaluate(element => document.activeElement === element)))
          throw new Error('Menu Escape did not return focus to trigger');
        report.interactionChecks.menuEscapeReturnsTriggerFocus = true;
        await openRedMenu();
        await page.locator('h2').click();
        await popup.waitFor({ state: 'hidden' });
        await openRedMenu();
        await redTrigger.click();
        await popup.waitFor({ state: 'hidden' });
        report.interactionChecks.menuOutsideClickAndTriggerToggleClose = true;
        await page.evaluate(() => window.brickHunterReference.setSearchCount(1000));
        await settle();
        await openRedMenu();
        await page.evaluate(() => window.scrollTo(0, 400));
        await page.waitForFunction(() => window.scrollY === 400);
        await popup.waitFor({ state: 'hidden' });
        await open('browse-parts');
        await openRedMenu();
        await page.setViewportSize({ width: 1400, height: 1000 });
        await popup.waitFor({ state: 'hidden' });
        await page.setViewportSize(viewport);
        await openRedMenu();
        const popupBounds = await popup.boundingBox();
        if (!popupBounds || popupBounds.x < 0 || popupBounds.x + popupBounds.width > viewport.width)
          throw new Error('Reopened color popup is outside the viewport after resize');
        await menuList.press('Home');
        await menuList.press('Space');
        await popup.waitFor({ state: 'hidden' });
        await page.waitForFunction(
          () =>
            window.ng.getComponent(document.querySelector('app-browse-parts-color-filter')).browsePartsService.filter
              .colorId === 4
        );
        report.interactionChecks.menuScrollResizeReopenAndSpaceSelection = true;

        await open('parts-lists');
        await page.locator('.p-datatable-tbody .p-checkbox').first().click();
        await page.locator('.p-datatable-thead button').first().click();
        await popup.waitFor();
        await settle();
        const bulkZIndex = await popup.evaluate(panel => Number(getComputedStyle(panel).zIndex));
        const headerZIndex = await page
          .locator('.p-datatable-thead th')
          .first()
          .evaluate(header => Number(getComputedStyle(header).zIndex));
        if (bulkZIndex <= headerZIndex) throw new Error('Bulk menu is not above the table header');
        await menuList.press('Home');
        if (
          !(await popup
            .locator('.p-menu-item.p-focus')
            .textContent()
            .then(text => text.includes('Open Combined')))
        )
          throw new Error('Home did not focus the first bulk action');
        await menuList.press('End');
        if (
          !(await popup
            .locator('.p-menu-item.p-focus')
            .textContent()
            .then(text => text.includes('Delete')))
        )
          throw new Error('End did not focus the last bulk action');
        report.menuMeasurements.bulkZIndex = bulkZIndex;
        report.menuMeasurements.headerZIndex = headerZIndex;
        await additionalCapture('menu-bulk-keyboard-focus');
        await menuList.press('Space');
        await popup.waitFor({ state: 'hidden' });
        await page
          .getByRole('alertdialog')
          .filter({ hasText: 'Do you want to delete the selected Parts Lists?' })
          .waitFor();
        report.interactionChecks.menuBulkHomeEndSpaceAndTableZIndex = true;

        await open('browse-parts');
        // Audit real listener registration/removal on the disposable page, without
        // inspecting PrimeNG's private fields or replacing its listener behavior.
        await page.evaluate(() => {
          const registrations = new Map(),
            originals = [];
          for (const [target, types] of [
            [document, ['click']],
            [window, ['resize', 'scroll']],
            [document.body, ['scroll']],
          ]) {
            const add = target.addEventListener,
              remove = target.removeEventListener;
            originals.push(() => {
              target.addEventListener = add;
              target.removeEventListener = remove;
            });
            target.addEventListener = function (type, listener, options) {
              if (types.includes(type)) registrations.set(listener, { target, type });
              return add.call(this, type, listener, options);
            };
            target.removeEventListener = function (type, listener, options) {
              if (types.includes(type)) registrations.delete(listener);
              return remove.call(this, type, listener, options);
            };
          }
          window.brickHunterMenuAudit = {
            count: () => registrations.size,
            restore: () => originals.forEach(restore => restore()),
          };
        });
        await openRedMenu();
        const registeredListeners = await page.evaluate(() => window.brickHunterMenuAudit.count());
        if (registeredListeners < 2) throw new Error('Menu listener audit did not capture click and resize listeners');
        await page.locator('app-side-navigation a').nth(2).press('Enter');
        await page.waitForURL('**#/settings');
        await popup.waitFor({ state: 'hidden' });
        const remainingListeners = await page.evaluate(() => window.brickHunterMenuAudit.count());
        await page.evaluate(() => window.brickHunterMenuAudit.restore());
        if (remainingListeners !== 0) throw new Error(`Destroyed menu left ${remainingListeners} audited listeners`);
        report.menuMeasurements.listenerAudit = { registeredListeners, remainingListeners };
        report.interactionChecks.menuRouteDestroyRemovesListenersAndKeyboardNavigation = true;

        report.checkboxMeasurements = {};
        async function checkboxStyle(input, name, checked, disabled = false, halo) {
          await page.waitForTimeout(250);
          const style = await input.evaluate(element => {
            const root = element.closest('.p-checkbox'),
              box = root.querySelector('.p-checkbox-box');
            const rect = box.getBoundingClientRect(),
              css = getComputedStyle(box);
            const icon = box.querySelector('svg'),
              iconRect = icon?.getBoundingClientRect();
            return {
              width: rect.width,
              height: rect.height,
              borderWidth: css.borderTopWidth,
              borderRadius: css.borderRadius,
              borderColor: css.borderTopColor,
              background: css.backgroundColor,
              opacity: getComputedStyle(root).opacity,
              shadow: getComputedStyle(root).boxShadow,
              pseudoContent: getComputedStyle(box, '::before').content,
              iconWidth: iconRect?.width,
              iconHeight: iconRect?.height,
              iconColor: icon && getComputedStyle(icon).color,
              checked: element.checked,
              disabled: element.disabled,
            };
          });
          report.checkboxMeasurements[name] = style;
          const expected = {
            width: 18,
            height: 18,
            borderWidth: '2px',
            borderRadius: '2px',
            borderColor: checked ? 'rgb(10, 52, 99)' : 'rgb(117, 117, 117)',
            background: checked ? 'rgb(10, 52, 99)' : 'rgb(255, 255, 255)',
            opacity: disabled ? '0.38' : '1',
            pseudoContent: 'none',
            checked,
            disabled,
          };
          if (checked) Object.assign(expected, { iconWidth: 14, iconHeight: 14, iconColor: 'rgb(255, 255, 255)' });
          for (const [property, value] of Object.entries(expected)) {
            if (style[property] !== value)
              throw new Error(`${name}: ${property}=${style[property]}, expected ${value}`);
          }
          if (halo ? !style.shadow.includes(halo) : style.shadow !== 'none')
            throw new Error(`${name}: unexpected checkbox shadow ${style.shadow}`);
        }
        async function openCheckboxSettings() {
          await open('parts-lists/upgrade-reference');
          await page.getByRole('button', { name: 'Settings', exact: true }).click();
          await page.locator('app-parts-list-settings .p-drawer').waitFor();
          await settle();
        }
        await openCheckboxSettings();
        const settingsCheckbox = page.locator('#ignoreBrickLinkPrices');
        await page.mouse.move(600, 60);
        await checkboxStyle(settingsCheckbox, 'off-rest', false);
        await settingsCheckbox.hover();
        await checkboxStyle(settingsCheckbox, 'off-hover', false, false, 'rgba(0, 0, 0, 0.04)');
        await additionalCapture('checkbox-off-hover');
        await settingsCheckbox.focus();
        await checkboxStyle(settingsCheckbox, 'off-focus-hover', false, false, 'rgba(0, 0, 0, 0.12)');
        await additionalCapture('checkbox-off-focus');
        await settingsCheckbox.press('Space');
        if (
          !(await page.evaluate(
            () =>
              window.ng.getComponent(document.querySelector('app-parts-list-settings')).form.value
                .ignoreBrickLinkPrices === true
          ))
        )
          throw new Error('Checkbox Space did not update the settings form');
        await checkboxStyle(settingsCheckbox, 'on-focus-hover', true, false, 'rgba(10, 52, 99, 0.12)');
        await additionalCapture('checkbox-on-focus');
        await settingsCheckbox.evaluate(element => element.blur());
        await settingsCheckbox.hover();
        await checkboxStyle(settingsCheckbox, 'on-hover', true, false, 'rgba(10, 52, 99, 0.04)');
        await additionalCapture('checkbox-on-hover');
        await settingsCheckbox.click();
        if (await settingsCheckbox.isChecked()) throw new Error('Checkbox mouse click did not clear the value');
        await page.locator('label[for="ignoreBrickLinkPrices"]').click();
        if (!(await settingsCheckbox.isChecked())) throw new Error('Checkbox label did not set the value');
        await page.locator('app-parts-list-settings').getByRole('button', { name: 'Save', exact: true }).click();
        await page.locator('app-parts-list-settings .p-drawer').waitFor({ state: 'hidden' });
        await page.getByRole('button', { name: 'Settings', exact: true }).click();
        await page.locator('app-parts-list-settings .p-drawer').waitFor();
        if (
          !(await settingsCheckbox.isChecked()) ||
          !(await page.evaluate(
            () =>
              window.ng.getComponent(document.querySelector('app-parts-list-settings')).globalSettingsService
                .ignoreBrickLinkPrices === true
          ))
        )
          throw new Error('Checkbox settings value was not persisted');
        report.interactionChecks.checkboxMouseSpaceLabelAndSettingsSave = true;

        for (const checked of [false, true]) {
          await openCheckboxSettings();
          await page.evaluate(checked => {
            const settings = window.ng.getComponent(document.querySelector('app-parts-list-settings'));
            settings.form.controls.ignoreBrickLinkPrices.setValue(checked);
            settings.form.controls.ignoreBrickLinkPrices.disable();
            window.ng.applyChanges(settings);
          }, checked);
          await settingsCheckbox.hover({ force: true });
          await checkboxStyle(settingsCheckbox, `${checked ? 'on' : 'off'}-disabled`, checked, true);
          await settingsCheckbox.click({ force: true });
          await page.locator('label[for="ignoreBrickLinkPrices"]').click({ force: true });
          await checkboxStyle(
            settingsCheckbox,
            `${checked ? 'on' : 'off'}-disabled-after-click-and-label`,
            checked,
            true
          );
          if (
            !(await page.evaluate(
              checked =>
                window.ng.getComponent(document.querySelector('app-parts-list-settings')).form.getRawValue()
                  .ignoreBrickLinkPrices === checked,
              checked
            ))
          )
            throw new Error('Disabled checkbox changed its form value');
          await additionalCapture(`checkbox-${checked ? 'on' : 'off'}-disabled`);
        }
        report.interactionChecks.checkboxDisabledOnOffBlocksInputAndLabel = true;

        await open('parts-lists/upgrade-reference');
        const rowCheckbox = page.locator('app-parts-table .p-datatable-tbody input[type="checkbox"]').first();
        const headerCheckbox = page.locator('app-parts-table .p-datatable-thead input[type="checkbox"]');
        await rowCheckbox.press('Space');
        await page.waitForFunction(
          () => window.ng.getComponent(document.querySelector('app-parts-table')).selectedParts.length === 1
        );
        await checkboxStyle(rowCheckbox, 'table-row-selected', true, false, 'rgba(0, 0, 0, 0.12)');
        await headerCheckbox.press('Space');
        await page.waitForFunction(() => {
          const table = window.ng.getComponent(document.querySelector('app-parts-table'));
          return table.selectedParts.length === table.parts.length;
        });
        if (
          (await page
            .locator('app-parts-table .p-datatable-tbody input[type="checkbox"]')
            .evaluateAll(inputs => inputs.filter(input => input.checked).length)) !== 8
        )
          throw new Error('Header checkbox did not select all eight fixture parts');
        await checkboxStyle(headerCheckbox, 'table-header-selected-keyboard', true, false, 'rgba(0, 0, 0, 0.12)');
        await headerCheckbox.press('Space');
        await page.waitForFunction(
          () => window.ng.getComponent(document.querySelector('app-parts-table')).selectedParts.length === 0
        );
        if (
          await page
            .locator('app-parts-table .p-datatable-tbody input[type="checkbox"]')
            .evaluateAll(inputs => inputs.some(input => input.checked))
        )
          throw new Error('Header checkbox did not clear the row selections');
        report.interactionChecks.checkboxTableRowAndHeaderSpaceSelection = true;
        await open('parts-lists/upgrade-reference');
        await rowCheckbox.click();
        await page.waitForFunction(
          () => window.ng.getComponent(document.querySelector('app-parts-table')).selectedParts.length === 1
        );
        await checkboxStyle(rowCheckbox, 'table-row-selected-mouse', true, false, 'rgba(0, 0, 0, 0.04)');
        await additionalCapture('checkbox-table-selected-mouse');
        await rowCheckbox.press('Tab');
        await page.keyboard.press('Shift+Tab');
        if (
          !(await rowCheckbox.evaluate(
            element => document.activeElement === element && element.matches(':focus-visible')
          ))
        )
          throw new Error('Tab/Shift+Tab did not return keyboard focus to the selected row checkbox');
        await checkboxStyle(rowCheckbox, 'table-row-selected-keyboard-hover', true, false, 'rgba(0, 0, 0, 0.12)');
        await additionalCapture('checkbox-table-selected-keyboard');
        await rowCheckbox.press('Space');
        await page.waitForFunction(
          () => window.ng.getComponent(document.querySelector('app-parts-table')).selectedParts.length === 0
        );
        await checkboxStyle(rowCheckbox, 'table-row-cleared-keyboard-hover', false, false, 'rgba(0, 0, 0, 0.12)');
        report.interactionChecks.checkboxTableMouseHoverAndKeyboardFocus = true;
        report.overlayMeasurements = {};
        async function overlayLayers(name, panelSelector, maskSelector) {
          await settle();
          const layers = await page.evaluate(
            ({ panelSelector, maskSelector }) => {
              const nav = document.querySelector('app-side-navigation .p-drawer');
              const panel = document.querySelector(panelSelector),
                mask = document.querySelector(maskSelector);
              const ownPanelZIndex = getComputedStyle(panel).zIndex,
                maskZIndex = Number(getComputedStyle(mask).zIndex);
              const maskContainsPanel = mask.contains(panel);
              return {
                navigationZIndex: Number(getComputedStyle(nav).zIndex),
                panelZIndex: ownPanelZIndex === 'auto' && maskContainsPanel ? maskZIndex : Number(ownPanelZIndex),
                ownPanelZIndex,
                maskZIndex,
                maskContainsPanel,
                maskBackground: getComputedStyle(mask).backgroundColor,
                navigationCovered: document.elementFromPoint(20, 500)?.closest('.p-overlay-mask') === mask,
              };
            },
            { panelSelector, maskSelector }
          );
          if (
            layers.maskBackground !== 'rgba(0, 0, 0, 0.32)' ||
            layers.navigationZIndex !== 1000 ||
            !Number.isFinite(layers.panelZIndex) ||
            layers.maskZIndex <= layers.navigationZIndex ||
            (!layers.maskContainsPanel && layers.panelZIndex <= layers.maskZIndex) ||
            !layers.navigationCovered
          )
            throw new Error(`${name}: modal mask or stacking differs from reference: ${JSON.stringify(layers)}`);
          report.overlayMeasurements[name] = layers;
        }
        await openCheckboxSettings();
        await overlayLayers('settingsDrawer', 'app-parts-list-settings .p-drawer', '.p-drawer-mask');
        await additionalCapture('overlay-drawer-navigation-mask');
        await page.mouse.click(20, 500);
        await page.locator('app-parts-list-settings .p-drawer').waitFor({ state: 'hidden' });
        await page.locator('.p-drawer-mask').waitFor({ state: 'detached' });
        if (!page.url().endsWith('#/parts-lists/upgrade-reference'))
          throw new Error('Drawer mask click activated background navigation');
        await page
          .locator('app-side-navigation a')
          .first()
          .click({ position: { x: 30, y: 16 } });
        await page.waitForURL('**#/parts-lists');
        report.interactionChecks.overlayDrawerMasksNavigationAndDismissRestoresClicks = true;

        await openCheckboxSettings();
        const nestedUnit = page.getByRole('combobox', { name: 'Price reduction unit', exact: true });
        await nestedUnit.click();
        await page.getByRole('listbox').waitFor();
        await settle();
        const nestedZIndex = await page
          .locator('.p-select-overlay')
          .evaluate(element => Number(getComputedStyle(element.closest('.p-overlay') || element).zIndex));
        const drawerZIndex = await page
          .locator('app-parts-list-settings .p-drawer')
          .evaluate(element => Number(getComputedStyle(element).zIndex));
        if (!Number.isFinite(nestedZIndex) || nestedZIndex <= drawerZIndex)
          throw new Error('Nested Select popup is below the modal Drawer');
        report.overlayMeasurements.nestedSelect = { popupZIndex: nestedZIndex, drawerZIndex };
        await nestedUnit.press('Escape');
        await page.getByRole('listbox').waitFor({ state: 'hidden' });
        if (!(await page.locator('app-parts-list-settings .p-drawer').isVisible()))
          throw new Error('Nested popup Escape closed the Drawer');
        await page.locator('app-parts-list-settings .p-drawer').press('Escape');
        await page.locator('.p-drawer-mask').waitFor({ state: 'detached' });
        report.interactionChecks.overlayNestedSelectAboveDrawerAndEscapeCleanup = true;

        await open('parts-lists/upgrade-reference');
        await component('app-transfer-warning', 'open', [[{ part: referenceWarningPart(), cart: undefined }], true]);
        await page.locator('app-transfer-warning .p-dialog').waitFor();
        await overlayLayers('warningDialog', 'app-transfer-warning .p-dialog', '.p-dialog-mask');
        await additionalCapture('overlay-dialog-navigation-mask');
        await page.mouse.click(20, 500);
        if (
          !(await page.locator('app-transfer-warning .p-dialog').isVisible()) ||
          !page.url().endsWith('#/parts-lists/upgrade-reference')
        )
          throw new Error('Nondismissible dialog mask allowed a background action');
        await page
          .locator('app-transfer-warning')
          .getByRole('button', { name: /Cancel Transfer/ })
          .click();
        await page.locator('app-transfer-warning .p-dialog-mask').waitFor({ state: 'detached' });
        report.interactionChecks.overlayDialogMasksNavigationAndCancelRemovesMask = true;

        report.closeButtonMeasurements = {};
        async function closeButtonStyle(button, name, background, focused = false) {
          await page.waitForTimeout(250);
          const actual = await button.evaluate(element => {
            const css = getComputedStyle(element),
              rect = element.getBoundingClientRect();
            const icon = element.querySelector('svg').getBoundingClientRect();
            return {
              width: rect.width,
              height: rect.height,
              iconWidth: icon.width,
              iconHeight: icon.height,
              color: css.color,
              background: css.backgroundColor,
              outlineWidth: css.outlineWidth,
              shadow: css.boxShadow,
            };
          });
          report.closeButtonMeasurements[name] = actual;
          if (
            actual.width !== 40 ||
            actual.height !== 40 ||
            actual.iconWidth !== 14 ||
            actual.iconHeight !== 14 ||
            actual.color !== 'rgba(0, 0, 0, 0.6)' ||
            actual.background !== background ||
            actual.shadow !== 'none' ||
            (focused && actual.outlineWidth !== '0px')
          )
            throw new Error(`${name}: close button differs from legacy theme: ${JSON.stringify(actual)}`);
        }
        await openCheckboxSettings();
        const drawerClose = page.locator('app-parts-list-settings .p-drawer-header button');
        await page.mouse.move(600, 60);
        await closeButtonStyle(drawerClose, 'drawer-rest', 'rgba(0, 0, 0, 0)');
        await drawerClose.hover();
        await closeButtonStyle(drawerClose, 'drawer-hover', 'rgba(0, 0, 0, 0.04)');
        await additionalCapture('close-drawer-hover');
        await drawerClose.focus();
        await closeButtonStyle(drawerClose, 'drawer-hover-focus', 'rgba(0, 0, 0, 0.04)', true);
        await page.mouse.move(600, 60);
        await closeButtonStyle(drawerClose, 'drawer-focus', 'rgba(0, 0, 0, 0)', true);
        await additionalCapture('close-drawer-focus');
        await page.keyboard.down('Space');
        await closeButtonStyle(drawerClose, 'drawer-active', 'rgba(0, 0, 0, 0)', true);
        await page.keyboard.up('Space');
        await page.locator('.p-drawer-mask').waitFor({ state: 'detached' });
        await openCheckboxSettings();
        await drawerClose.click();
        await page.locator('.p-drawer-mask').waitFor({ state: 'detached' });
        report.interactionChecks.closeDrawerMouseSpaceStatesAndMaskCleanup = true;

        async function openChangelog() {
          await open('parts-lists');
          await page.evaluate(() =>
            window.brickHunterReference.runInAngular(() => {
              const changelog = window.ng.getComponent(document.querySelector('app-changelog-dialog'));
              changelog.visible = true;
              window.ng.applyChanges(changelog);
            })
          );
          await page.locator('app-changelog-dialog .p-dialog').waitFor();
        }
        await openChangelog();
        const dialogClose = page.locator('app-changelog-dialog .p-dialog-header button');
        await page.mouse.move(600, 60);
        await closeButtonStyle(dialogClose, 'dialog-rest', 'rgba(0, 0, 0, 0)');
        await dialogClose.hover();
        await closeButtonStyle(dialogClose, 'dialog-hover', 'rgba(0, 0, 0, 0.04)');
        await additionalCapture('close-dialog-hover');
        await dialogClose.focus();
        await closeButtonStyle(dialogClose, 'dialog-hover-focus', 'rgba(0, 0, 0, 0.04)', true);
        await page.mouse.move(600, 60);
        await closeButtonStyle(dialogClose, 'dialog-focus', 'rgba(0, 0, 0, 0)', true);
        await additionalCapture('close-dialog-focus');
        await page.keyboard.down('Space');
        await closeButtonStyle(dialogClose, 'dialog-active', 'rgba(0, 0, 0, 0)', true);
        await page.keyboard.up('Space');
        await page.locator('app-changelog-dialog .p-dialog-mask').waitFor({ state: 'detached' });
        await openChangelog();
        await dialogClose.click();
        await page.locator('app-changelog-dialog .p-dialog-mask').waitFor({ state: 'detached' });
        report.interactionChecks.closeDialogMouseSpaceStatesAndMaskCleanup = true;

        // Final migration checks use real input events and disposable fixture data.
        report.uiAcceptanceMeasurements = {};
        await open('parts-lists/upgrade-reference');
        await page.locator('app-parts-table td.p-editable-column').first().click();
        const quantity = page.getByRole('spinbutton').first();
        const quantityGeometry = await quantity.evaluate(element => {
          const box = element.getBoundingClientRect(),
            css = getComputedStyle(element);
          return {
            width: box.width,
            height: box.height,
            padding: css.padding,
            totalWidth: element.parentElement.getBoundingClientRect().width,
          };
        });
        if (
          quantityGeometry.width !== 68 ||
          quantityGeometry.height !== 38 ||
          quantityGeometry.padding !== '2px' ||
          quantityGeometry.totalWidth !== 116
        )
          throw new Error(`Quantity geometry changed: ${JSON.stringify(quantityGeometry)}`);
        await page.locator('.p-inputnumber-increment-button').first().click();
        if ((await quantity.inputValue()) !== '11') throw new Error('Quantity increment failed');
        await quantity.click();
        await quantity.press('ControlOrMeta+A');
        await quantity.press('8');
        if ((await quantity.inputValue()) !== '8') throw new Error('Quantity keyboard input failed');
        await quantity.press('Tab');
        report.uiAcceptanceMeasurements.quantity = quantityGeometry;
        report.interactionChecks.quantityGeometryMouseAndKeyboard = true;

        await open('parts-lists/upgrade-reference');
        await page.getByRole('button', { name: 'Delete', exact: true }).first().click();
        await page.locator('.p-confirmdialog').waitFor();
        await settle();
        const confirmation = await page.locator('.p-confirmdialog').evaluate(element => ({
          width: element.getBoundingClientRect().width,
          focusedLabel: document.activeElement?.textContent.trim(),
          icons: [...element.querySelectorAll('.p-dialog-footer svg')].map(icon => ({
            width: icon.getBoundingClientRect().width,
            height: icon.getBoundingClientRect().height,
          })),
        }));
        if (
          confirmation.width !== 720 ||
          confirmation.focusedLabel !== 'Yes' ||
          confirmation.icons.length !== 2 ||
          confirmation.icons.some(icon => icon.width !== 14 || icon.height !== 14)
        )
          throw new Error(`Confirmation defaults changed: ${JSON.stringify(confirmation)}`);
        await page.getByRole('button', { name: 'No', exact: true }).focus();
        await page.keyboard.press('Space');
        await page.locator('.p-confirmdialog').waitFor({ state: 'detached' });
        report.uiAcceptanceMeasurements.confirmation = confirmation;
        report.interactionChecks.confirmationDefaultAcceptFocusSvgAndKeyboardCancel = true;

        await open('parts-lists/upgrade-reference');
        await component('app-transfer-warning', 'open', [[{ part: referenceWarningPart(), cart: undefined }], true]);
        await page.locator('app-transfer-warning .p-dialog').waitFor();
        await settle();
        const warningCancel = page.locator('app-transfer-warning').getByRole('button', { name: /Cancel Transfer/ });
        if (await warningCancel.evaluate(element => element === document.activeElement))
          throw new Error('Transfer warning unexpectedly autofocuses Cancel');
        await warningCancel.focus();
        await page.keyboard.press('Space');
        await page.locator('app-transfer-warning .p-dialog-mask').waitFor({ state: 'detached' });
        report.interactionChecks.warningPreservesInitialFocusAndKeyboardCancel = true;

        await open('parts-lists/upgrade-reference');
        await page.getByRole('button', { name: 'Export', exact: true }).first().click();
        const exportPanel = page.locator('app-parts-list-export .p-drawer');
        const exportButtons = exportPanel.locator('.p-selectbutton').first().locator('.p-togglebutton');
        const exportGeometry = await exportButtons.evaluateAll(elements =>
          elements.map(element => {
            const r = element.getBoundingClientRect();
            return { x: r.x, y: r.y, width: r.width, height: r.height };
          })
        );
        if (
          exportGeometry.length !== 6 ||
          exportGeometry.some(
            (box, index) =>
              box.width !== 288 ||
              box.x !== exportGeometry[0].x ||
              (index > 0 && box.y !== exportGeometry[index - 1].y + exportGeometry[index - 1].height)
          )
        )
          throw new Error(`Export choices are not contiguous: ${JSON.stringify(exportGeometry)}`);
        await exportButtons.nth(1).focus();
        await page.keyboard.press('Space');
        if ((await exportButtons.nth(1).getAttribute('aria-pressed')) !== 'true')
          throw new Error('Export filter keyboard selection failed');
        await exportButtons.first().click();
        await exportPanel
          .locator('.p-togglebutton')
          .filter({ hasText: /^BrickHunter$/ })
          .click();
        const downloadPromise = page.waitForEvent('download');
        await exportPanel.getByRole('button', { name: 'Export', exact: true }).click();
        const download = await downloadPromise;
        const exported = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
        if (
          !download.suggestedFilename().endsWith('.json') ||
          exported.version !== '2.0' ||
          exported.parts.length !== 8
        )
          throw new Error('BrickHunter JSON export is invalid');
        report.uiAcceptanceMeasurements.export = {
          choices: exportGeometry,
          filename: download.suggestedFilename(),
          parts: exported.parts.length,
        };
        report.interactionChecks.verticalExportMouseKeyboardAndJsonDownload = true;

        await open('browse-parts');
        const listRadios = page.locator('app-browse-parts-parts-lists input[type="radio"]');
        await listRadios.first().check();
        if (!(await listRadios.first().isChecked())) throw new Error('List radio mouse selection failed');
        await listRadios.nth(1).focus();
        await page.keyboard.press('Space');
        if (!(await listRadios.nth(1).isChecked()) || (await listRadios.first().isChecked()))
          throw new Error('List radio keyboard selection is not exclusive');
        const radioGeometry = await page
          .locator('app-browse-parts-parts-lists .p-radiobutton-box')
          .first()
          .evaluate(element => {
            const r = element.getBoundingClientRect(),
              css = getComputedStyle(element);
            return { width: r.width, height: r.height, borderWidth: css.borderWidth, borderColor: css.borderColor };
          });
        if (radioGeometry.width !== 20 || radioGeometry.height !== 20 || radioGeometry.borderWidth !== '2px')
          throw new Error(`Radio geometry changed: ${JSON.stringify(radioGeometry)}`);
        await additionalCapture('radio-keyboard-selection');
        report.uiAcceptanceMeasurements.radio = radioGeometry;
        report.interactionChecks.radioMouseSpaceExclusiveSelectionAndGeometry = true;
        const browseQuantity = page.locator('app-browse-parts-grid-item input.p-inputnumber-input').first();
        const browseQuantityGeometry = await browseQuantity.evaluate(element => {
          const host = element.closest('.p-inputnumber'),
            card = element.closest('app-browse-parts-grid-item');
          const r = element.getBoundingClientRect(),
            h = host.getBoundingClientRect(),
            c = card.getBoundingClientRect();
          return {
            width: r.width,
            height: r.height,
            totalWidth: h.width,
            padding: getComputedStyle(element).padding,
            buttonWidths: [...host.querySelectorAll('button')].map(button => button.getBoundingClientRect().width),
            containedInCard: h.x >= c.x && h.right <= c.right,
          };
        });
        if (
          browseQuantityGeometry.width !== 60 ||
          browseQuantityGeometry.totalWidth !== 120 ||
          browseQuantityGeometry.padding !== '2px' ||
          browseQuantityGeometry.buttonWidths.some(width => width !== 30) ||
          !browseQuantityGeometry.containedInCard
        )
          throw new Error(`Browse quantity overflows: ${JSON.stringify(browseQuantityGeometry)}`);
        const browseValue = Number(await browseQuantity.inputValue());
        await page.locator('app-browse-parts-grid-item .p-inputnumber-increment-button').first().click();
        if (Number(await browseQuantity.inputValue()) !== browseValue + 1)
          throw new Error('Browse quantity increment failed');
        await browseQuantity.click();
        await browseQuantity.press('ControlOrMeta+A');
        await browseQuantity.press('7');
        await browseQuantity.press('Tab');
        if ((await browseQuantity.inputValue()) !== '7') throw new Error('Browse quantity keyboard input failed');
        report.uiAcceptanceMeasurements.browseQuantity = browseQuantityGeometry;
        report.interactionChecks.browseQuantityContainedMouseAndKeyboard = true;

        await open('parts-lists/upgrade-reference');
        await component('app-parts-list-copy-or-move-to', 'open', ['upgrade-reference', 'copy', []]);
        const copyChoices = page.locator('app-parts-list-copy-or-move-to .p-selectbutton .p-togglebutton');
        await copyChoices.nth(1).focus();
        await page.keyboard.press('Space');
        if ((await copyChoices.nth(1).getAttribute('aria-pressed')) !== 'true')
          throw new Error('Copy target keyboard selection failed');
        const copyGeometry = await copyChoices.evaluateAll(elements =>
          elements.map(element => {
            const r = element.getBoundingClientRect(),
              label = element.querySelector('.p-togglebutton-label');
            return {
              width: r.width,
              labelInset: label.getBoundingClientRect().x - r.x,
              textAlign: getComputedStyle(label).textAlign,
            };
          })
        );
        if (
          copyGeometry.some(
            box => box.width !== 288 || box.textAlign !== 'left' || box.labelInset < 16 || box.labelInset > 17
          )
        )
          throw new Error(`Copy target layout changed: ${JSON.stringify(copyGeometry)}`);
        await additionalCapture('copy-target-keyboard-selection');
        report.uiAcceptanceMeasurements.copyTargets = copyGeometry;
        report.interactionChecks.copyTargetVerticalLeftAlignmentAndKeyboardSelection = true;

        await open('parts-lists/upgrade-reference');
        // The separate PDF component is no longer mounted; the live Export panel
        // provides the PDF workflow and shares the vertical option styles.
        await page.getByRole('button', { name: 'Export', exact: true }).first().click();
        const pdfPanel = page.locator('app-parts-list-export .p-drawer');
        const pdfOption = pdfPanel.locator('.p-togglebutton').filter({ hasText: /^PDF$/ });
        await pdfPanel.locator('.p-togglebutton').filter({ hasText: /^CSV$/ }).click();
        await pdfOption.focus();
        await page.keyboard.press('Space');
        if ((await pdfOption.getAttribute('aria-pressed')) !== 'true')
          throw new Error('PDF option keyboard selection failed');
        await additionalCapture('pdf-option-keyboard-selection');
        const pdfDownloadPromise = page.waitForEvent('download');
        await pdfPanel.getByRole('button', { name: 'Export', exact: true }).click();
        const pdfDownload = await pdfDownloadPromise;
        const pdfData = await fs.readFile(await pdfDownload.path());
        if (!pdfDownload.suggestedFilename().endsWith('.pdf') || pdfData.subarray(0, 5).toString() !== '%PDF-')
          throw new Error('PDF download is invalid');
        report.uiAcceptanceMeasurements.pdf = { filename: pdfDownload.suggestedFilename(), bytes: pdfData.length };
        report.interactionChecks.pdfVerticalOptionKeyboardSelectionAndDownload = true;
      }
      if (viewport.width === 390) {
        await open('browse-parts');
        await page.locator('app-browse-parts-parts-lists input[type="radio"]').nth(1).check();
        const mobileBrowseQuantity = await page
          .locator('app-browse-parts-grid-item .quantity-edit')
          .first()
          .evaluate(element => {
            const r = element.getBoundingClientRect(),
              card = element.closest('app-browse-parts-grid-item').getBoundingClientRect();
            return { width: r.width, containedInCard: r.x >= card.x && r.right <= card.right };
          });
        if (mobileBrowseQuantity.width !== 120 || !mobileBrowseQuantity.containedInCard)
          throw new Error(`Mobile browse quantity overflows: ${JSON.stringify(mobileBrowseQuantity)}`);
        await settle();
        const mobileBrowseFile = '390x844-browse-selected-list.png';
        await page.screenshot({ path: path.join(output, mobileBrowseFile), animations: 'disabled' });
        report.additionalScreenshots.push(mobileBrowseFile);
        report.uiAcceptanceMeasurements.mobileBrowseQuantity = mobileBrowseQuantity;
        report.interactionChecks.mobileBrowseQuantityContainedInCard = true;
        await open('parts-lists/upgrade-reference');
        const tabViewport = page.locator('.p-tablist-content');
        if (await page.locator('.p-tablist-next-button, .p-tablist-prev-button').count())
          throw new Error('Mobile tabs unexpectedly show new navigator buttons');
        const before = await tabViewport.evaluate(element => ({
          width: element.clientWidth,
          contentWidth: element.scrollWidth,
          scroll: element.scrollLeft,
        }));
        await tabViewport.hover();
        await page.mouse.wheel(1800, 0);
        await page.waitForTimeout(250);
        const after = await tabViewport.evaluate(element => element.scrollLeft);
        if (before.contentWidth <= before.width || after <= before.scroll)
          throw new Error('Mobile tabs cannot scroll horizontally');
        report.uiAcceptanceMeasurements.mobileTabs = { ...before, scrollAfterWheel: after };
        report.interactionChecks.mobileTabsWheelScrollWithoutNavigator = true;
      }
      await context.close();
    }
    report.rendererAtEnd = await rendererStatus();
    await gpuSession.detach();
    if (JSON.stringify(report.rendererAtEnd) !== JSON.stringify(report.renderer))
      throw new Error('GPU pipeline changed during reference capture');
    if (report.pageErrors.length || report.consoleErrors.length)
      throw new Error(
        `Reference app emitted ${report.pageErrors.length} browser errors and ${report.consoleErrors.length} console errors`
      );
  } finally {
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(`${report.scenarios.length} screenshots saved to ${output}`);
}

function referenceWarningPart() {
  return {
    id: 'reference-warning',
    designId: '3001',
    elementId: 300123,
    color: 4,
    qty: 120,
    have: 0,
    source: { source: 'Lego' },
    lego: {
      elementId: 300123,
      designNumber: 3001,
      maxOrderQuantity: 100,
      deliveryChannel: 'pab',
      inStock: true,
      price: { amount: 0.25, currencyCode: 'EUR' },
    },
  };
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

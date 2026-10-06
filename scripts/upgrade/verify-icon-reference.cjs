// Every application Font Awesome class/import and legacy pseudo-element, at three sizes.
// Usage: node scripts/upgrade/verify-icon-reference.cjs LABEL BUILD_ROOT [baseline|current]
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const { chromium } = require('playwright');
const label = process.argv[2];
if (!/^[a-z0-9-]+$/.test(label || '')) throw new Error('Invalid label');
const root = path.resolve(process.argv[3]);
const dir = path.resolve('artefacts/angular-upgrade/post-angular22/fontawesome');
const output = path.join(dir, label);
async function main() {
  let inventory;
  try {
    inventory = JSON.parse(await fs.readFile(path.join(dir, 'inventory.json'), 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    inventory = JSON.parse(
      await fs.readFile('docs/angular-upgrade-reference/post-angular22-fontawesome-check.json', 'utf8')
    ).referenceInventory;
  }
  async function sources(folder) {
    const entries = await fs.readdir(folder, { withFileTypes: true });
    const result = [];
    for (const entry of entries) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) result.push(...(await sources(file)));
      else if (/\.(ts|html|scss)$/.test(file) && !file.endsWith('.spec.ts')) result.push(file);
    }
    return result;
  }
  for (const file of await sources('src/app')) {
    const text = await fs.readFile(file, 'utf8');
    for (const match of text.matchAll(/\bfa-[a-z0-9]+(?:-[a-z0-9]+)*\b/g)) {
      const name = match[0].slice(3);
      if (!inventory.cssIcons[name] && !inventory.ignoredCssNames.includes(name))
        throw new Error('Application glyph missing from reference inventory: ' + name);
    }
  }
  let svgIcons;
  if (process.argv[4] === 'baseline') svgIcons = inventory.svgIcons;
  else if (process.argv[4] === 'preserved') {
    const source = await fs.readFile('src/app/shared/icons/reference-icons.ts', 'utf8');
    const code = require('typescript').transpileModule(source, {
      compilerOptions: { module: require('typescript').ModuleKind.CommonJS },
    }).outputText;
    const exported = {};
    vm.runInNewContext(code, { exports: exported });
    svgIcons = exported;
  } else
    svgIcons = Object.fromEntries(
      Object.keys(inventory.svgIcons).map(name => [name, require('@fortawesome/free-solid-svg-icons')[name]])
    );
  await fs.mkdir(output);
  const server = http.createServer(async (req, res) => {
    try {
      const name = new URL(req.url, 'http://127.0.0.1').pathname;
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
        }[path.extname(file)] || 'application/octet-stream'
      );
      res.end(await fs.readFile(file));
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(4320, '127.0.0.1', resolve);
  });
  let browser;
  const report = { label, errors: [], rows: [] };
  try {
    browser = await chromium.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true,
      args: ['--use-angle=d3d11'],
    });
    const context = await browser.newContext({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 1 });
    const image = await fs.readFile(path.join(root, 'assets/placeholder.png'));
    await context.route('**/*', route =>
      new URL(route.request().url()).origin === 'http://127.0.0.1:4320'
        ? route.continue()
        : route.fulfill({ contentType: 'image/png', body: image })
    );
    const page = await context.newPage();
    page.on('pageerror', e => report.errors.push(e.message));
    const session = await browser.newBrowserCDPSession();
    const renderer = async () => {
      const { gpu } = await session.send('SystemInfo.getInfo');
      return {
        renderer: gpu.auxAttributes.glRenderer,
        compositing: gpu.featureStatus.gpu_compositing,
        rasterization: gpu.featureStatus.rasterization,
      };
    };
    report.renderer = await renderer();
    await page.goto('http://127.0.0.1:4320/#/info');
    await page.waitForFunction(() => window.brickHunterReference && document.querySelector('h2'));
    await page.evaluate(
      ({ inventory, svgIcons }) => {
        const atlas = document.createElement('div');
        atlas.id = 'icon-reference';
        atlas.style.cssText =
          'position:absolute;top:0;left:0;width:1000px;z-index:100000;background:white;color:#444;font:16px Roboto;padding:10px';
        const definitions = [
          ...Object.keys(inventory.cssIcons).map(name => ({ name: 'class: ' + name, kind: 'class', key: name })),
          ...Object.keys(inventory.regularIcons).map(name => ({
            name: 'regular: ' + name,
            kind: 'regular',
            key: name,
          })),
          ...Object.keys(svgIcons).map(name => ({ name: 'Angular: ' + name, kind: 'svg', key: name })),
          ...inventory.pseudoUnicodes.map(code => ({ name: 'pseudo: ' + code, kind: 'font', key: code })),
        ];
        for (const definition of definitions) {
          const row = document.createElement('div');
          row.dataset.name = definition.name;
          row.style.cssText = 'display:flex;align-items:center;height:52px;border-bottom:1px solid #eee';
          const label = document.createElement('span');
          label.style.width = '270px';
          label.textContent = definition.name;
          row.append(label);
          for (const size of [16, 24, 32]) {
            const slot = document.createElement('span');
            slot.style.cssText = `display:inline-flex;align-items:center;width:100px;font-size:${size}px;`;
            if (definition.kind === 'class') slot.innerHTML = `<span class="fa fa-${definition.key}"></span>`;
            else if (definition.kind === 'regular')
              slot.innerHTML = `<span class="fa-regular fa-${definition.key}"></span>`;
            else if (definition.kind === 'svg') {
              const icon = svgIcons[definition.key];
              slot.innerHTML = `<svg class="svg-inline--fa fa-${icon.iconName}" viewBox="0 0 ${icon.icon[0]} ${icon.icon[1]}" aria-hidden="true">${[]
                .concat(icon.icon[4])
                .map(d => `<path fill="currentColor" d="${d}"></path>`)
                .join('')}</svg>`;
            } else {
              const span = document.createElement('span');
              span.className = 'pi';
              span.textContent = String.fromCodePoint(parseInt(definition.key, 16));
              slot.append(span);
            }
            row.append(slot);
          }
          atlas.append(row);
        }
        document.body.append(atlas);
      },
      { inventory, svgIcons }
    );
    await page.waitForFunction(
      () => !document.querySelector('#icon-reference span.fa, #icon-reference span.fa-regular')
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    report.rows = await page.locator('#icon-reference > div').evaluateAll(rows =>
      rows.map(row => ({
        name: row.dataset.name,
        glyphs: [...row.children].slice(1).map(slot => {
          const glyph = slot.firstElementChild,
            box = glyph.getBoundingClientRect(),
            css = getComputedStyle(glyph);
          return {
            width: box.width,
            height: box.height,
            fontFamily: css.fontFamily,
            viewBox: glyph.getAttribute('viewBox'),
            path: glyph.querySelector('path')?.getAttribute('d') || null,
          };
        }),
      }))
    );
    await page.locator('#icon-reference').screenshot({ path: path.join(output, 'icons.png'), animations: 'disabled' });
    report.rendererAtEnd = await renderer();
    if (
      report.errors.length ||
      JSON.stringify(report.renderer) !== JSON.stringify(report.rendererAtEnd) ||
      !report.renderer.renderer.includes('Direct3D11') ||
      report.renderer.compositing !== 'enabled' ||
      report.renderer.rasterization !== 'enabled'
    )
      throw new Error('Icon capture renderer/errors invalid');
  } finally {
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(JSON.stringify({ output, rows: report.rows.length, sizes: [16, 24, 32] }));
}
main().catch(e => {
  console.error(e);
  process.exitCode = 1;
});

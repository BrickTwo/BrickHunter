// Read-only audit of every direct dependency. Run from the repository root.
// Output: node scripts/upgrade/package-audit.cjs > artefacts/angular-upgrade/package-audit.json
const fs = require('node:fs');

async function main() {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
  const results = [];
  for (const group of ['dependencies', 'devDependencies']) {
    for (const [name, range] of Object.entries(pkg[group] || {})) {
      const locked = lock.packages[`node_modules/${name}`];
      const versions = {};
      for (const version of new Set([locked.version, 'latest'])) {
        const url = `https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`;
        const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
        if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
        const metadata = await response.json();
        versions[version] = {
          version: metadata.version,
          engines: metadata.engines || {},
          peerDependencies: metadata.peerDependencies || {},
          peerDependenciesMeta: metadata.peerDependenciesMeta || {},
          deprecated: metadata.deprecated || null,
          source: url,
        };
      }
      results.push({ name, group, range, locked: locked.version, metadata: versions });
    }
  }
  process.stdout.write(JSON.stringify({ checkedAt: new Date().toISOString(), packages: results }, null, 2) + '\n');
}

main().catch(error => { console.error(error); process.exitCode = 1; });

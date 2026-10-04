# Angular-Upgrade: Fortschritt und Commit-Punkte

## Commit-Punkt 1: Technischen Referenzstand sichern

Stand: 4. Oktober 2026. Ausgangscommit: `98d185f` (`remove inStock property in lego api request`). Der vorhandene Branch `feature/upgrade-code-base` wird weiterverwendet. Zu Beginn war ausschließlich `docs/` unversioniert. Der Nutzer erstellt die Zwischencommits selbst; deshalb wurde kein Commit automatisch angelegt.

Dieser Zwischenabschnitt ist erfolgreich umgesetzt:

- Offizielle Windows-x64-Runtime Node **20.20.2** lokal unter `tmp/upgrade-runtime/node-v20.20.2-win-x64` bereitgestellt. SHA-256 des ZIPs gegen die offizielle Prüfsummenliste geprüft: `dc3700fdd57a63eedb8fd7e3c7baaa32e6a740a1b904167ff4204bc68ed8bf77`. Die globale Node-26-Installation wurde nicht verändert.
- `npm ci --no-audit --no-fund` mit Node 20 und npm **10.8.2** erfolgreich: 990 Pakete installiert.
- `npm ls --all --json` erfolgreich, Exitcode 0; keine ungültigen Peer-Abhängigkeiten gemeldet.
- `npm run build` erfolgreich, Exitcode 0. Referenz: initial 2.05 MB, `main.js` 1.34 MB, `styles.css` 682.18 kB. Bestehende 500-kB-Warnschwelle überschritten; 3-MB-Fehlergrenze eingehalten. CommonJS-Warnungen unter anderem für canvg, jsPDF-AutoTable und xml2js. Budgets unverändert.
- `npm run build-dev` erfolgreich, Exitcode 0.
- Produktions- und Entwicklungsoutput separat kopiert. `background.js`, `legocontentscript.js`, Chrome-Manifest, `index.html`, `main.js` und `styles.css` in beiden Ausgaben vorhanden. SHA-256-Inventare der Dateien im jeweiligen Ausgabewurzelverzeichnis erstellt. Das bestätigt die Build-Ausgabe; Browserinstallation und Extension-Messaging sind noch nicht geprüft.
- Alle **46 direkten Dependencies/DevDependencies** anhand ihrer gelockten Version und `latest` in der offiziellen npm-Registry auf Version, Engines, Peers, optionale Peers und Deprecation geprüft. Siehe [Paketmatrix](angular-upgrade-packages.md) und das wiederverwendbare Skript `scripts/upgrade/package-audit.cjs`.
- `package.json`, `package-lock.json`, `angular.json` und Anwendungsquellcode sind unverändert. Angular ist weiterhin 17.1.2, PrimeNG 17.5.0.

### Bereits vor dem Upgrade bestehende Testfehler

Aufruf: `npm test -- --watch=false --browsers=ChromeHeadless`, mit `CHROME_BIN` auf den installierten Edge-Browser gesetzt. Ergebnis: **Exitcode 1, Testbundle kompiliert nicht; keine Tests ausgeführt**.

1. `browse-parts-parts-lists.component.spec.ts` importiert einen Default-Export; die Komponente besitzt einen benannten Export (TS2613).
2. `tsconfig.spec.json` lädt keine `chrome`-Typen. Dadurch TS2304 in `VersionService`, `PartsListDetailComponent` und `PickABrickService`.

Diese Fehler wurden nur erfasst. Nach ihrer Behebung können weitere bestehende Laufzeitfehler in den generierten Specs sichtbar werden; eine grüne Regressionssuite wird noch nicht behauptet.

### Paketprüfung und offene Entscheidungen

Die Registry bestätigt Angular 22.2.1, PrimeNG 22.1.2, Custom-Webpack 22.0.1 und alle drei verwendeten NgRx-Pakete 22.0.1 als aktuelle Kandidaten. TypeScript `latest` ist 7.0.2 und damit für Angular 22 ungeeignet; für die spätere Installation muss explizit 6.0.x gewählt werden. Die Matrix enthält `latest` zur Bestandsaufnahme, nicht als pauschale Upgrade-Empfehlung.

Für `@ngrx/effects`, `stream` und `timers` wurden keine direkten TypeScript-Imports gefunden. Der einzige Timer-Fallback im Custom-Webpack ist auskommentiert. Pakete bleiben bis zur Prüfung transitiver Bundle-Anforderungen erhalten. Store-Devtools, LazyLoadImage/ScrollHooks, Font Awesome, jsPDF/AutoTable und xml2js haben nachgewiesene Aufrufstellen. Zusätzlich liegt eine vendorte Font-Awesome-6.3.0-Kopie in Assets; deren Script wird in `index.html` geladen und muss beim späteren Icon-Upgrade berücksichtigt werden.

Noch offen in Etappe 1: reproduzierbare UI-Testdaten und stabilisierte Netzwerkantworten, Screenshots einschließlich Interaktionszuständen, Referenzmessungen sowie Prüfung des neu hinzukommenden Theme-Pakets und des Community-Setups. Zielkombination und UI-Verhalten sind noch nicht abgenommen. Es wird noch kein Major-Upgrade gestartet.

### Lokale Referenzartefakte

Alle Artefakte liegen im bereits ignorierten Verzeichnis `artefacts/angular-upgrade/baseline/`:

- `npm-ci.log`, `npm-ls.json`, `build-production.log`, `build-development.log`, `tests.log`
- `package-audit.json`, `imports.txt`
- `production/`, `development/`, `production-sha256.json`, `development-sha256.json`

Diese Dateien und die lokale Runtime werden nicht mitcommittet. Bei Bereinigung von `artefacts/` gehen die lokalen Referenzausgaben verloren; bei Bedarf außerhalb des Repos archivieren. Die dokumentierten Ergebnisse und die Paketmatrix bleiben im Commit erhalten.

Die frühen Schritte verwenden in PowerShell eine pro Prozess gesetzte Runtime:

```powershell
$env:PATH = "$PWD\tmp\upgrade-runtime\node-v20.20.2-win-x64;$env:PATH"
node --version
npm.cmd --version
npm.cmd ci --no-audit --no-fund
npm.cmd run build
npm.cmd run build-dev
$env:CHROME_BIN = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm.cmd test -- --watch=false --browsers=ChromeHeadless
node scripts/upgrade/package-audit.cjs > artefacts/angular-upgrade/baseline/package-audit.json
```

### Jetzt manuell: Zwischencommit

Vor weiteren Änderungen diesen Referenzabschnitt sichern:

```powershell
git add docs/angular-upgrade-plan.md docs/angular-upgrade-progress.md docs/angular-upgrade-packages.md scripts/upgrade/package-audit.cjs
git commit -m "docs: record Angular upgrade baseline and package audit"
```

Nach dem Commit geht es mit den bestehenden Testfehlern und den noch fehlenden UI-Referenzen weiter. Erst danach folgt der neueste Angular-17-Patchstand; der nächste Major beginnt erst nach erfolgreicher Prüfung und einem weiteren Commit-Punkt. Bis zu diesem ersten Commit bleibt die Umsetzung angehalten, wie vom Nutzer gewünscht.

Quellen: [Angular-Kompatibilität](https://angular.dev/reference/versions), [offizielle Node-Prüfsummen](https://nodejs.org/dist/v20.20.2/SHASUMS256.txt). Paketquellen und Engines/Peers stehen in der ergänzenden Matrix und den lokal gespeicherten Registry-Metadaten.

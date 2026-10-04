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

Dieser Referenzabschnitt wurde als `0251b91` gesichert. Auf Anweisung des Nutzers wurde die Umsetzung fortgesetzt. Die Ergebnisse des nächsten Zwischenabschnitts stehen unten.

Quellen: [Angular-Kompatibilität](https://angular.dev/reference/versions), [offizielle Node-Prüfsummen](https://nodejs.org/dist/v20.20.2/SHASUMS256.txt). Paketquellen und Engines/Peers stehen in der ergänzenden Matrix und den lokal gespeicherten Registry-Metadaten.

## Commit-Punkt 2: Lauffähige Testbasis und erste Regressionen

Stand: 4. Oktober 2026. Ausgangscommit dieses Abschnitts: `0251b91`. Angular 17.1.2, PrimeNG 17.5.0 und alle Paketversionen bleiben erhalten. Die Änderungen betreffen ausschließlich Testquellcode, Testkonfiguration und Dokumentation.

Erfolgreich umgesetzt:

- Fehlenden `chrome`-Typeintrag in `tsconfig.spec.json` ergänzt und den falschen Default-Import im Teilelisten-Spec korrigiert.
- Alle 14 vorhandenen Komponententests mit den echten Feature-Modulen, PrimeNG-Komponenten, Templates, Formularen, Router-Testkonfiguration und deaktivierten Animationen eingerichtet. Unbekannte Elemente und Properties verursachen weiterhin Fehler; es werden keine Templatefehler durch Schemas unterdrückt.
- Gemeinsame Testeinrichtung unter `src/testing/component-test-bed.ts`: API-Aufrufe verwenden Spies mit festen Antworten, IndexedDB-Zugriffe einen kleinen In-Memory-Adapter. Die echten Dienste für Listen, Suche, Farben, Locale und Einstellungen bleiben aktiv. Der Versionsdienst läuft als Testdouble im Dev-Modus, damit weder Legacy-Migration noch Extension-Callbacks stattfinden. Kein produktives Profil und keine echte Datenbank werden geöffnet.
- Synthetische, reproduzierbare Fixtures unter `src/testing/upgrade-fixtures.ts`: rote und blaue Farben mit externen IDs, zwei leere Listen, feste Teile mit Preis und Datumswerten sowie Suchantworten mit frei wählbarer Teilezahl. Leere Suche und 1000 Teile sind abgedeckt. Listen mit befüllten Tabellen, reale Persistenz und vollständige Bildantworten sind noch zu ergänzen.
- Neun zusätzliche Regressionstests: Farbgruppen/HTML-Labels und API-Farbfilter einschließlich Rücksetzen; Entfernen alter Farbgruppen bei leerer Folgesuche; begrenzter sichtbarer Bereich und Spacer bei 1000 Teilen, Scrollen und Resize; leerer Teilebereich; Freigabe der Scroll-/Resize-Listener; Menü-Farbfelder, Badges und Sichtbarkeit; aktivierte/deaktivierte Commands; Tastaturfokus zwischen aktivierten Einträgen; Popup-Schließen durch Außenklick und Listener-Cleanup.
- Vollständiger Testlauf erfolgreich: **23 Tests, 23 SUCCESS, Exitcode 0**, Node 20.20.2 / npm 10.8.2 / Headless Edge 154.0.0.0, gestartet über Karmas `ChromeHeadless`-Launcher. Die vorhandenen 14 Tests schlugen vor der gemeinsamen Testeinrichtung sämtlich mit fehlenden Providern oder unbekannten Komponenten fehl.

Die Tests erfassen funktionales Verhalten mit echten Templates. Sie ersetzen noch keinen visuellen Vergleich, keine Persistenz-Abnahme und keine Extension-Tests. Die Typprüfung der Anwendung (`tsc --project tsconfig.app.json --noEmit`) und `git diff --check` waren erfolgreich. Produktions-/Entwicklungsbuilds wurden in diesem Abschnitt nicht wiederholt, weil ausschließlich Testdateien und die separate Spec-Konfiguration geändert wurden; die erfolgreichen Referenzbuilds aus Abschnitt 1 bleiben gültig.

### Neu erfasste Ausgangsprobleme

Bei einer erweiterten Tastaturprüfung wurde ein bestehender Fehler im eigenen Menü sichtbar: `findNextItem`/`findPrevItem` prüfen `p-disabled` am Listenelement, während die Klasse am Link sitzt; `p-hidden` wird nicht geprüft. Pfeiltasten überspringen solche Einträge daher nicht zuverlässig. Die Anwendung wurde in diesem Testabschnitt nicht verändert. Der grüne Tastaturtest deckt aktivierte Einträge ab. Das Verhalten mit deaktivierten/ausgeblendeten Einträgen muss beim gezielten Menüumbau korrigiert und separat getestet werden.

Außerdem deklariert `getRebrickableColors()` einen einzelnen Farbdatensatz als Rückgabetyp, während `ColorService` eine Liste verarbeitet. Das Testdouble bildet den bereits vorhandenen Listenvertrag mit einem ausdrücklich kommentierten Typ-Cast ab. Die Produktionssignatur bleibt vorerst unverändert.

Der Browserstart in der Sandbox scheiterte an Zugriffsrechten. Mit einem außerhalb der Sandbox gestarteten temporären Headless-Testprofil liefen die Tests erfolgreich. Es ist dafür aktuell keine manuelle Einrichtung nötig.

Logs liegen im ignorierten Ordner `artefacts/angular-upgrade/test-baseline/`: `tests-first-run.log` (Browserstart in Sandbox), `tests-runtime.log` (14 bestehende Laufzeitfehler), `tests-configured.log` (14 erfolgreiche Ursprungstests) und `tests-regression.log` (abschließend 23 erfolgreiche Tests).

### Jetzt manuell: Zwischencommit

Die Testreparaturen vor visuellen Referenzen und Paketmigrationen separat sichern:

```powershell
git add tsconfig.spec.json src/testing
git add ':(glob)src/app/**/*.spec.ts'
git add docs/angular-upgrade-plan.md docs/angular-upgrade-progress.md
git commit -m "test: establish Angular upgrade regression baseline"
```

Dieser Testabschnitt wurde als `66d2d4d` gesichert. Auf Anweisung des Nutzers wurde mit den visuellen Ausgangsreferenzen fortgefahren. Die Ergebnisse stehen unten.

## Commit-Punkt 3: Visuelle Ausgangsreferenz und befüllte Tabellen

Stand: 4. Oktober 2026. Ausgangscommit dieses Abschnitts: `66d2d4d`. Angular 17.1.2 / PrimeNG 17.5.0 und alle Dependencies bleiben unverändert.

Erfolgreich umgesetzt:

- Eigenen Referenz-Einstieg `src/testing/visual-main.ts` und Build-Konfiguration `development,visual-reference` eingerichtet. `npm run build:visual-reference` erzeugt die Test-App unter `artefacts/angular-upgrade/visual-app`. Reguläre Builds verwenden weiterhin `src/main.ts`.
- Synthetische Fixtures um acht befüllte Tabelleneinträge ergänzt: zwei Farben, Mengen und vorhandene Mengen, Bestseller/Standard, Out-of-Stock sowie Überschreitung der Bestellhöchstmenge.
- Separates Screenshot-Skript `scripts/upgrade/capture-visual-reference.cjs` erstellt. Es startet einen localhost-Server, einen temporären Headless-Browserkontext und feste Szenarien; danach schließt es Browser und Server. API-/Datenbankdaten kommen aus Testdoubles. Externe Bildrequests werden mit festen Bildern beantwortet; andere externe Requests werden blockiert. Transfers werden im Referenz-Einstieg simuliert.
- **39 Screenshots** bei 1440 × 1000, 390 × 844, 2560 × 1440 und 3200 × 1440 erstellt. Navigation, Suche/Filter, Farbmenü, Karten, Tabellen, Inline-Editing, Auswahl, Hover/Fokus, deaktivierte Zustände, Einstellungen, Import/Export, Bestätigung, Erfolgsmeldung, Transferfortschritt/-warnung und große/leere Listen sind enthalten. Interaktionsvarianten wurden am Desktop erfasst.
- Die 39 PNGs aus zwei vollständigen Aufnahmeläufen über SHA-256 verglichen: **39 byteidentisch, 0 Abweichungen**. Die aufgenommenen Referenzen samt CSS-/Geometriemessungen und Prüfsummen liegen versionierbar in `docs/angular-upgrade-reference/angular-17/`; Details und Reproduktion in [Referenzdokumentation](angular-upgrade-reference/README.md).
- Stichproben der Aufnahmen visuell geprüft: unter anderem Farbmenü, Tabelleneditor, Transferwarnung, mobile Teileansicht, breite Tabelle und große Liste nach Scrollen. Root-Schriftgröße ist **16 px**, Kartenhöhe **320 px**, Tabellenzeile **91 px**, Navigation **60 px**. Die Primärfarbe entspricht `#0a3463`.
- Drei zusätzliche Tabellentests prüfen befüllte Zeilen/Warnungen, Aktualisierung der Liste über den echten Inline-Editor inklusive In-Memory-Persistenz und die Übergabe ausgewählter Teile an eine Kopieraktion. Gesamtsuite: **26 SUCCESS, Exitcode 0** mit Node 20.20.2 / Headless Edge 154.0.0.0.
- Theme-Kandidat `@primeuix/themes` 3.0.1 anhand offizieller npm-Metadaten ergänzend geprüft: Dependency `@primeuix/styled ^1.0.0`, keine veröffentlichten Engines/Peers. Noch nicht installiert. PrimeNGs aktuelle Installationsdokumentation bestätigt das spätere Lizenzschlüssel-Setup.

### Weitere bestehende Fehler und Grenzen der Referenz

Der vollständige App-Lauf zeigt **9 NG0100-Meldungen** aus `PartsTableComponent`: Die nach dem View-Check ausgeführte Sichtbarkeitsberechnung verändert einen Templatewert von false auf true, wenn die Tabelle bereits mit Daten startet. Sie sind unter `knownConsoleErrors` dokumentiert. Es gab **0 unbehandelte Browserfehler und 0 andere Konsolenfehler**. Das Screenshot-Skript akzeptiert ausschließlich diesen konkret erfassten Ausgangsfehler; andere Fehler brechen den Lauf ab. Die Produktionskomponente wurde nicht geändert. Die Komponententests bilden asynchrones Laden ab (erst leere Ansicht, dann Daten).

Die 390-px-Ansicht zeigt bereits horizontale Überbreite. Im Transferwarndialog ist die bestehende Mindestbreite der Tabelle größer als der Dialog. Diese Ausgangsprobleme werden mitgesichert. Die Screenshots belegen Darstellung mit synthetischen Daten; echte Browser-Extension-Kommunikation, Bestandsdatenmigration, PDF/XML und reale Teilebilder bleiben eigene Abnahmepunkte.

Die fehlende Versionsvergleichsmethode im Versions-Testdouble wurde beim Gesamt-App-Lauf gefunden und ergänzt. Dafür wird die unveränderte Methode von `VersionService.prototype` verwendet, ohne den produktiven Konstruktor und dessen Legacy-Migration auszuführen.

### Validierung und Artefakte

Erfolgreiche Prüfbefehle: Referenzbuild, gesamte Karma-Suite, regulärer Produktions-/Entwicklungsbuild, Syntaxprüfung des Screenshot-Skripts, Anwendungstypprüfung und `git diff --check`. Produktionsausgabe `main.js`, `styles.css`, `polyfills.js`, `background.js`, `legocontentscript.js` und Manifest sind gegenüber dem ursprünglichen Produktions-Referenzbuild byteidentisch. Referenz-/Fixture-Code wurde in der Produktionsausgabe nicht gefunden. Budgetgrenzen bleiben unverändert; die bisherigen Warnungen bestehen weiter.

Lokale Build-/Testlogs liegen unter `artefacts/angular-upgrade/test-baseline/`: `build-visual.log`, `visual-capture.log`, `tests-table.log`, `build-production-reference-check.log`, `build-development-reference-check.log` und `theme-metadata.json`. Reguläre Kontrollbuilds liegen unter `artefacts/angular-upgrade/visual-production-check/` und `visual-development-check/`. Fehlgeschlagene Aufnahmeläufe sind ausschließlich temporäre Artefakte, keine freigegebenen Referenzen.

### Jetzt manuell: Zwischencommit

Referenzwerkzeuge, Tests und die etwa 3 MB große Screenshot-Basis vor Paketänderungen sichern:

```powershell
git add angular.json package.json src/testing scripts/upgrade/capture-visual-reference.cjs
git add src/app/parts-list/components/parts-table/parts-table.component.spec.ts
git add docs/angular-upgrade-plan.md docs/angular-upgrade-progress.md docs/angular-upgrade-packages.md docs/angular-upgrade-reference
git commit -m "test: capture reproducible Angular 17 visual baseline"
```

Nach dem Commit folgt der neueste Angular-17-Patchstand. Framework-/CLI-Migrationen werden angewendet und mit Builds, Tests und den gesicherten Referenzen geprüft; danach folgt ein eigener Commit-Punkt vor Angular/PrimeNG 18. Der Community-Schlüssel wird erst vor PrimeNG 22 benötigt; falls seine Einrichtung manuell erfolgen muss, wird der Nutzer dann benachrichtigt. Die Umsetzung hält hier auf Wunsch des Nutzers an.

Dieser Referenzabschnitt wurde als `9156e81` gesichert. Auf Anweisung des Nutzers wurde anschließend mit dem Angular-17-Patchstand fortgefahren.

## Commit-Punkt 4: Neuester Angular-17-Patchstand

Stand: 4. Oktober 2026. Ausgangscommit: `9156e81`; Arbeitsverzeichnis zu Beginn sauber. Runtime weiterhin Node **20.20.2**, npm **10.8.2**.

Erfolgreich umgesetzt:

- Neueste stabile 17er-Versionen in der offiziellen npm-Registry geprüft: Angular Framework/Compiler/Localize **17.3.12**, CLI/Build-Devkit **17.3.17**, CDK **17.3.10**. Mit `npm exec -- ng update @angular/core@17.3.12 @angular/cli@17.3.17 @angular/cdk@17.3.10` installiert. Das Tool verwendete vorübergehend CLI 17.3.17 für die Migration.
- Die Angular-Core-Migration prüfte ungültige Two-Way-Binding-Ausdrücke und schloss ohne erforderliche Änderungen ab. Es waren keine Änderungen an Anwendungscode oder Build-Konfiguration nötig. Keine Peer-Konflikte mit `--force` oder `--legacy-peer-deps` übergangen.
- Nur **13 direkte Angular-Pakete** haben neue gelockte Versionen. Die vom Installer nebenbei veränderten direkten CSS-Werkzeuge wurden auf Autoprefixer **10.4.17** und PostCSS **8.4.34** zurückgesetzt. PrimeNG **17.5.0**, NgRx **17.1.0**, TypeScript **5.3.3**, Zone.js **0.14.3** und Custom-Webpack **17.0.0** bleiben auf dem Ausgangsstand. Custom-Webpack 17.0.2 existiert, ist für diese kompatible Zwischenkombination aber nicht erforderlich.
- Saubere Installation mit `npm ci --no-audit --no-fund`: **962 Pakete**, Exitcode 0. `npm ls --all --json`: Exitcode 0, keine ungültigen Peer-Abhängigkeiten.
- Produktions-, Entwicklungs- und visueller Referenzbuild: jeweils Exitcode 0. Produktionsbundle weiterhin rund **2.05 MB**; 3-MB-Fehlergrenze eingehalten. Bestehende Budget-/CommonJS-Warnungen bleiben bestehen; keine Budgetanpassung.
- Gesamte Karma-Suite: **26 SUCCESS**, Exitcode 0 im temporären Headless-Edge-Testprofil.
- Alle **39 Screenshots byteidentisch** zur committed Angular-17.1.2-Referenz; sämtliche aufgezeichneten CSS-/Geometriemessungen ebenfalls identisch. Browser **154.0.4258.53**, PrimeNG unverändert. Prüfsummen und Ergebnis sind in [angular-17-patch-check.json](angular-upgrade-reference/angular-17-patch-check.json) versionierbar dokumentiert.
- Referenzlauf: **0 unbehandelte Browserfehler, 0 neue Konsolenfehler**, weiterhin die **9 bekannten NG0100-Meldungen** der befüllten Tabelle. Ausgangsprobleme bleiben unverändert und dokumentiert.
- In beiden regulären Outputs sind `background.js`, `legocontentscript.js`, Manifest, UI-Einstieg, JS und Styles vorhanden. Manifest und `index.html` sowie `styles.css` sind gegenüber der jeweiligen ursprünglichen Referenz byteidentisch. Die beiden Extension-Einstiege enthalten keinen `webpackChunk`-Verweis auf einen gemeinsamen Runtime-Chunk; Referenz-Fixture-Marker sind in keinem regulären JS-Bundle enthalten. JavaScript-Bundles haben nach dem Toolchain-Update neue Prüfsummen. Diese Ausgabeprüfung ersetzt nicht die spätere echte Extension-/Messaging-Abnahme.
- `git diff --check` erfolgreich.

Logs, Paketänderungen, Metadaten und Build-Ausgaben liegen unter `artefacts/angular-upgrade/angular-17-patch/`; die neue Screenshot-Serie unter `artefacts/angular-upgrade/visual/angular-17-patch/`. Die ursprünglichen Screenshots wurden nicht überschrieben. Historische transitive npm-Pakete melden weiterhin Deprecation-Warnungen; deren Ablösung erfolgt mit den folgenden Toolchain-Stufen.

### Jetzt manuell: Zwischencommit

Den geprüften Angular-17-Stand vor dem größeren Angular-/PrimeNG-18- und Theme-Umbau sichern:

```powershell
git add package.json package-lock.json
git add docs/angular-upgrade-plan.md docs/angular-upgrade-progress.md docs/angular-upgrade-packages.md
git add docs/angular-upgrade-reference/README.md docs/angular-upgrade-reference/angular-17-patch-check.json
git commit -m "chore: upgrade Angular to latest 17 patch"
```

Weitere manuelle Einrichtung ist in diesem Abschnitt nicht erforderlich. Die Umsetzung hält hier auf Wunsch des Nutzers an. Nach dem Commit und `weiter` folgt die kompatible Angular-/PrimeNG-18-Kombination mit eigenem Theme und Menü-Abgleich.

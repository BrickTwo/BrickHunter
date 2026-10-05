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

Dieser Angular-17-Abschnitt wurde als `a0f2cc2` gesichert. Auf Anweisung des Nutzers wurde anschließend mit der Vorbereitung des Angular-/PrimeNG-18-Übergangs fortgefahren.

## Commit-Punkt 5: Eigenes Menü vor dem Theme-Wechsel vorbereiten

Stand: 4. Oktober 2026. Ausgangscommit: `a0f2cc2`; Arbeitsverzeichnis zu Beginn sauber. Die Dependencies und das Lockfile bleiben unverändert: Angular **17.3.12**, PrimeNG **17.5.0**, Node **20.20.2**.

Der Theme-Wechsel und die Bewertung eines Wrappers um das öffentliche PrimeNG-Menü benötigen einen eindeutig abgegrenzten Menüvertrag. Dieser Vorbereitungsschritt wurde deshalb vor der Paketinstallation als eigener prüfbarer Abschnitt umgesetzt:

- Eigene Selektoren auf **`bh-menu`** / **`bhMenuItemContent`** umgestellt. Alle elf Menüverwendungen in Farbfilter, Teileliste und Tabellenaktionen angepasst. Eigene Strukturregeln sind über **`.bh-menu-panel`** begrenzt, auch wenn das Popup an `body` angehängt wird. Der öffentliche PrimeNG-Selektor `p-menu` ist jetzt frei für den geplanten Prototyp.
- Farblabels enthalten jetzt einen Textwert und strukturierte `swatch.rgb`-Daten. Die bisherigen dynamischen HTML-/Style-Strings und alle `bypassSecurityTrustHtml`-/`innerHTML`-Verwendungen des eigenen Menüs entfernt. Farbfelder werden als Angular-Template mit gebundener Hintergrundfarbe dargestellt; auch gewöhnliche und Gruppenlabels sind Text. Produktionsseitig wurden keine weiteren HTML-Label-Verwendungen gefunden.
- Den dokumentierten Tastaturfehler korrigiert: Pfeiltasten überspringen deaktivierte/ausgeblendete Einträge, Separatoren und Gruppenüberschriften. Deaktivierte Links erhalten `aria-disabled`; Enter/Leertaste führen keine deaktivierten oder ausgeblendeten Commands aus. **Escape** schließt ein Popup und fokussiert dessen Auslöser.
- Sechs zusätzliche Regressionstests sichern Text-/Farblabels ohne HTML-Ausführung, Tastaturnavigation und Aktivierung, Gruppen/Router-Links/Icons/Badges, Escape/Fokusrückgabe sowie an `body` angehängte Popup-Positionierung, Z-Index, Scrollen, Resize und Listener-Cleanup. Bestehende Farbfiltertests auf den strukturierten Vertrag angepasst. Gesamtsuite: **32 SUCCESS**, Exitcode 0.
- Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktionsumfang weiter rund **2.05 MB**, Budgets unverändert; die bisherigen Warnungen bleiben bestehen. Extension-Einstiege und Manifest sind in beiden regulären Outputs byteidentisch zum Angular-17-Patchabschnitt. Alle erwarteten Ausgabedateien vorhanden, keine Referenz-Fixture-Marker in regulären JS-Bundles.
- **39 von 39 Screenshots byteidentisch**, alle aufgezeichneten Szenarien-/CSS-Messungen identisch zur ursprünglichen Referenz. **0 neue Konsolen-/Browserfehler**; die 9 bereits bekannten Tabellen-NG0100-Meldungen bleiben unverändert. Prüfsummen: [menu-preparation-check.json](angular-upgrade-reference/menu-preparation-check.json).
- `git diff --check` erfolgreich. Keine Paketinstallation oder Änderung an Theme, PrimeFlex, Angular-Konfiguration, Persistenz oder Extension-Kommunikation in diesem Vorbereitungsschritt.

Logs und reguläre Outputs: `artefacts/angular-upgrade/menu-preparation/`; UI-Aufnahmen: `artefacts/angular-upgrade/visual/menu-preparation/`.

### Angular-/PrimeNG-18-Kombination und noch offene Arbeit

Offizielle npm-Metadaten bestätigen die Kandidaten Angular **18.2.14**, CLI/Build-Devkit **18.2.21**, CDK **18.2.14**, Custom-Webpack **18.0.0**, NgRx **18.1.1**, Angular-FontAwesome **0.15.0**, PrimeNG/`@primeng/themes` **18.0.2**, PrimeFlex **4.0.0**, TypeScript **5.5.4** und Zone.js **0.14.10**. Die direkten Peer-Anforderungen aller 46 bestehenden Pakete plus des Theme-Pakets wurden mit dieser vollständigen Kandidatenkombination verglichen: **0 Konflikte** bei den vorhandenen/ausgewählten Peer-Paketen. Das ist eine Metadatenprüfung, noch keine installierte oder durch Laufzeittests bestätigte Kombination. Artefakte: `artefacts/angular-upgrade/angular-18/metadata.json` und `direct-peer-candidate-check.json`.

Die eigentliche 18er-Migration bleibt der nächste Abschnitt: `ng update` einschließlich Angular-gebundener Pakete, `providePrimeNG` statt `PrimeNGConfig`, neues BrickHunter-Token-Preset, Entfernung der alten vollständigen Theme-/Resource-Imports, DOM-/Icon-/Komponentenabgleich und wiederholte UI-Abnahme. Die Entscheidung über öffentlichen Menü-Wrapper oder weiteren eigenen Nachbau bleibt bis zum Prototyp unter PrimeNG 18 offen. Die jetzige Komponente nutzt weiterhin die historischen PrimeNG-DOM-/ZIndex-/Overlay-Helfer und eigene Angular-Animationen; diese Kopplungen sind im Folgeabschnitt zu behandeln. Quelle: [PrimeNG-18-Migration](https://v18.primeng.org/guides/migration), [Theming](https://v18.primeng.org/theming), [Angular-Kompatibilität](https://angular.dev/reference/versions).

### Jetzt manuell: Zwischencommit

Die visuell unveränderte Menüvorbereitung vor den Paket- und Theme-Änderungen sichern:

```powershell
git add src/app/shared/components/menu
git add src/app/browse-parts/components/browse-parts-color-filter
git add src/app/parts-list/components/parts-table/parts-table.component.html
git add src/app/parts-list/pages/parts-list-list/parts-list-list.component.html
git add docs/angular-upgrade-plan.md docs/angular-upgrade-progress.md docs/angular-upgrade-packages.md
git add docs/angular-upgrade-reference/README.md docs/angular-upgrade-reference/menu-preparation-check.json
git commit -m "refactor: prepare BrickHunter menu for PrimeNG upgrade"
```

Weitere manuelle Einrichtung ist aktuell nicht nötig. Die Umsetzung hält hier auf Wunsch des Nutzers am separaten Commit-Punkt an.

Dieser Menüabschnitt wurde als `6fadb3a` gesichert. Auf Anweisung des Nutzers wurde anschließend die eigentliche Angular-/PrimeNG-18-Migration begonnen.

## Commit-Punkt 6: Angular-/PrimeNG-18-Grundmigration und Token-Basis

Stand: 4. Oktober 2026. Ausgangscommit: `6fadb3a`; Arbeitsverzeichnis zu Beginn sauber. Dieser Abschnitt ist **technisch lauffähig**, die **visuelle Angleichung ist noch offen**. Angular 19 wird noch nicht begonnen.

### Erfolgreich umgesetzt

- Angular Framework/Compiler/Localize und CDK **18.2.14**, CLI/Build-Devkit **18.2.21**, Custom-Webpack **18.0.0**, NgRx Store/Effects/Devtools/Operators **18.1.1**, Angular-FontAwesome **0.15.0**, PrimeNG/`@primeng/themes` **18.0.2**, PrimeFlex **4.0.0**, TypeScript **5.5.4** und Zone.js **0.14.10** installiert. Runtime weiterhin Node **20.20.2** / npm **10.8.2**.
- Der erste `ng update`-Aufruf wurde vor Änderungen wegen inkonsistenter automatischer Paketgruppenauflösung auf Angular 19 abgebrochen. Mit expliziten 18er-Versionen für alle vorhandenen Framework-, Compiler- und Build-Pakete lief die Migration erfolgreich. Keine Verwendung von `--force` oder `--legacy-peer-deps`.
- Offizielle Migrationen angewendet: CDK-18-Prüfung; Angular-Prüfungen für Two-Way-Bindings, afterRender und Server-Bootstrap ohne Änderungen; HTTP-Module in `AppModule` durch `provideHttpClient(withInterceptorsFromDi())` ersetzt. NgRx Effects ergänzte `@ngrx/operators`; TypedAction-Migration ohne Quellcodeänderung. Die optionale Application-Builder-Migration wurde entsprechend dem Plan nicht ausgeführt. NgModules, Zone, Animationen und Custom-Webpack-Entries bleiben erhalten.
- `PrimeNGConfig` durch `PrimeNG` ersetzt; Initialisierung über **`providePrimeNG`** mit Ripple, ausschließlich hellem Theme und expliziter Layer-Reihenfolge **`primeng, brickhunter`**. Erstes **`BrickHunterPreset`** auf dem Material-Preset angelegt: Primärfarbe `#0a3463`, Text-/Hintergrundfarben, 4-px-Radien, Eingabefeld-/Button-Padding und erste Card-/Dialog-/Drawer-Werte stammen aus der alten Referenz.
- Imports der alten vollständigen `theme.css` und `primeng/resources/primeng.min.css` entfernt. `brickhunter-base.scss` erhält lokale Roboto-Fonts, Basisregeln und die bisherigen Root-Variablen für vorhandene App-/Utility-Verwendungen. Das alte vollständige Theme wird nicht mehr geladen. Der eigene Menü-Nachbau benötigt explizit begrenzte Struktur-/Darstellungsregeln, da er selbst keine PrimeNG-Menu-Styles injiziert; diese liegen unter `.bh-menu-panel`.
- Calendar, Dropdown, InputSwitch, OverlayPanel und Sidebar auf **DatePicker, Select, ToggleSwitch, Popover und Drawer** samt Importpfaden, Selektoren und betroffenen App-Styles umgestellt. Drawer explizit mit **`[appendTo]="null"`** im bisherigen lokalen DOM belassen: Der neue `body`-Default löste sonst insbesondere die Navigation aus ihren begrenzten Styles und blockierte UI-Klicks. Unbenutztes DeferModule sowie der nicht mehr exportierte DynamicDialogModule-Import entfernt; bestehender DialogService bleibt erhalten.
- Entfernte Checkbox-Label-Inputs durch echte, über `inputId`/`for` verknüpfte Labels ersetzt. Message-Datentyp auf **ToastMessageOptions** umgestellt. Der neue Tabellen-Scrollcontainer **`.p-datatable-table-container`** ersetzt die alte `.p-datatable-wrapper`-Anbindung; damit beendet sich die Initialisierung wieder und die Scroll-/Sichtbarkeitslogik erhält ihr Element.
- Die TabMenu-Initialisierung kann bereits vor dem Laden einer Teileliste ein Ereignis liefern. `PartsListService.getParts()` verarbeitet in diesem Fall eine leere Liste. Ein neuer Regressionstest sichert dieses Verhalten. Ein weiterer Test prüft alle drei migrierten Checkbox-Labels über echte Klicks auf das Label und die zugehörigen Reactive-Form-Werte.
- Test-Infrastruktur auf explizite HTTP-Provider mit **HttpClientTesting** umgestellt. Abschließende Gesamtsuite: **34 SUCCESS**, Exitcode 0, Headless Edge. Keine zusätzlichen Unknown-Element-/Property-Schemas eingeführt.
- `npm ci --no-audit --no-fund`: Exitcode 0, **1008 Pakete**. Windows ließ einen unvollständigen optionalen `nice-napi`-Ordner zurück; dieser wurde nach Pfadprüfung gezielt bereinigt. Abschließendes `npm ls --all --json`: Exitcode 0, keine ungültigen Peers. Nebenbei aufgelöste direkte Tooling-Patches: **tslib 2.6.3, Autoprefixer 10.4.20, PostCSS 8.4.41**; übrige unabhängige direkte Pakete bleiben auf ihren Ausgangsversionen.
- Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktionsumfang nun **2.32 MB**, unter der bestehenden 3-MB-Fehlergrenze. Budgetwerte wurden nicht verändert; Budget-/CommonJS-Warnungen bestehen fort. Das historische Theme-Paket meldet seine inzwischen erfolgte Deprecation; seine spätere Ablösung durch `@primeuix/themes` bleibt Teil des Plans.
- Beide regulären Outputs enthalten Manifest, UI-Einstieg, JS/Styles und die beiden Extension-Einstiege. Chrome-Manifest byteidentisch zur Quelldatei; keine `webpackChunk`-Verweise in den standalone Extension-Einstiegen und keine Fixture-Marker in regulären JS-Bundles. Dies ist eine Ausgabeprüfung, noch keine echte Extension-/Messaging-Abnahme.
- Anwendungstypprüfung und `git diff --check` erfolgreich. `AppModule` nach der Migration formatiert.

### UI-Prüfung und nächste Arbeit

Der ursprüngliche vollständige Referenzlauf scheiterte an der verschobenen Navigation; nach der Drawer-Anpassung liefen alle **39 Szenarien** einschließlich Dialogen, Farbmenü, Inline-Editing, Auswahl und großen/leeren Listen erfolgreich. Browser **154.0.4258.53**, **0 unbehandelte Browserfehler, 0 neue Konsolenfehler**, weiterhin die **9 bekannten NG0100-Meldungen** der befüllten Tabelle. Der Screenshot-Messer erkennt jetzt auch `.p-drawer`.

**0 von 39 Bildern sind byteidentisch** zur gesicherten Angular-17-Referenz. Root-Schriftgröße **16 px**, Roboto, Primärfarbe, Kartenbreite/-höhe/-Padding, **91-px-Teilezeile** und **60-px-Navigation** stimmen bereits. Beispielsweise ist der erste Button in der Suche nun **43.84375 px** statt **41.84375 px** hoch; Card-/Inhaltsabstände, Formelemente, Tabellen-/Dialogdetails und weitere Komponenten unterscheiden sich. Ein Screenshot wurde visuell geprüft; die verbleibenden Unterschiede sind nicht freigegeben und die Ausgangsbilder wurden nicht ersetzt. Prüfsummen, Messwerte und Ausgabeprüfungen: [angular-18-foundation-check.json](angular-upgrade-reference/angular-18-foundation-check.json).

Als nächster eigener Abschnitt auf **Version 18**: Theme-Tokens vervollständigen, verbleibende App-Overrides am neuen DOM ausrichten, Button-/Icon-/Form-/Dialoggeometrie und Hover/Fokus angleichen, Messages/TabMenu kontrolliert ablösen und den öffentlichen Menü-Wrapper prototypisch gegen die Referenz prüfen. Danach erneut funktional und visuell abnehmen. Erst dann folgt Angular 19.

Logs, Metadaten, Paketänderungen und reguläre Outputs liegen unter `artefacts/angular-upgrade/angular-18/`; vollständige neue Aufnahmen unter `artefacts/angular-upgrade/visual/angular-18-functional/`. `angular-18-initial/` ist ein fehlgeschlagener Diagnose-Lauf, keine Referenz. Quellen für die notwendigen API-/Theme-Änderungen: [PrimeNG-18-Migration](https://v18.primeng.org/guides/migration), [Theming](https://v18.primeng.org/theming).

### Jetzt manuell: Zwischencommit

Die erfolgreiche Grundmigration mit ausdrücklich noch offener visueller Abnahme vor den umfangreicheren UI-Korrekturen sichern:

```powershell
git add package.json package-lock.json src scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "chore: establish Angular and PrimeNG 18 migration foundation"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier am technisch überprüften Zwischencommit an. Nach dem Commit und `weiter` wird die UI-Angleichung auf Angular/PrimeNG 18 fortgesetzt.

Dieser Grundmigrationsabschnitt wurde als `0215538` gesichert. Auf Anweisung des Nutzers wurde anschließend der erste Teil der UI-Angleichung umgesetzt.

## Commit-Punkt 7: Basisgeometrie und öffentlicher Menü-Prototyp

Stand: 4. Oktober 2026. Ausgangscommit: `0215538`; Arbeitsverzeichnis zu Beginn sauber. Paketversionen und Lockfile unverändert. Dieser Abschnitt schließt einen ersten Teil des Theme-Abgleichs ab; die vollständige visuelle Abnahme von Angular/PrimeNG 18 bleibt offen.

### Erfolgreich umgesetzt

- Such- und Sortierfilter auf **`p-inputgroup` / `p-inputgroup-addon`** samt öffentlichen Modulen umgestellt. Die alten Klassen allein liefern unter PrimeNG 18 keine Gruppenstruktur mehr: Das Suchfeld blieb schmal und der Sortierauslöser stand oberhalb des Selects. Die neue Struktur verbindet Addon und Feld wieder über die gesamte Filterspalte. Addon-Farbe, Padding und Mindestbreite im Preset auf die ursprünglichen Werte gesetzt. Bestehende Such-, Lösch- und Sortierhandler bleiben angebunden. Quelle: [PrimeNG 18 InputGroup](https://v18.primeng.org/inputgroup).
- **Karteninhalt wieder mit `1rem 0` Padding**, Titel-/Untertitelabstand mit `0.5rem` und Footer-Abstand ergänzt. PrimeNG 18 bietet für das entfernte Content-Padding keinen entsprechenden Token; die begrenzten Strukturregeln liegen deshalb im Card-Abschnitt des Presets. Die Filterkarte und die Teilelistenkarte besitzen damit wieder die ursprünglichen Innenabstände.
- **Buttons ohne zusätzlichen 1-px-Rahmen**, mit der bisherigen flexiblen Labelausrichtung, kleinen/großen Padding- und Schriftwerten sowie dem ursprünglichen inset-Rahmen für Outlined-Buttons. Die zusätzlichen Preset-Regeln ergänzen die vorhandenen Material-State-Regeln, statt deren CSS-Funktion zu ersetzen. Im 1440-px-Suchszenario ist die gemessene Höhe wieder exakt **41.84375 px** statt **43.84375 px**, Padding **11.424 px / 16 px**, Radius **4 px**, Primärfarbe **`#0a3463`**.
- Divider-Abstand und Tabellenkopf-Padding/-Gewicht auf die alten Werte gesetzt. Weitere Tabellen- und Button-Zustände sind noch Teil der ausstehenden Detailprüfung.
- Drei Bestseller-Verwendungen von dem nicht mehr gültigen **`severity="warning"`** auf **`"warn"`** umgestellt. Tag-Tokens auf **12 px**, Padding **4 px / 6.4 px**, Hintergrund **`#fbc02d`**, Text **`#212529`** gesetzt. Die globale `.p-component`-Schriftgrößenregel aus der Grundmigration entfernt: Als ungelayerte Regel überschrieb sie auch die spezifischen Tag-Tokens. Die lokale Roboto-Schrift bleibt erhalten.
- Den Screenshot-Bericht um Messungen von Card-Content, Tag, InputGroup/Addon und Tabellenkopf ergänzt; die gesicherten Ausgangsbilder bleiben unverändert.

### Öffentlicher Menü-Wrapper: funktionales Experiment

Ein **isolierter Prototyp unter `src/testing/public-menu-prototype.ts`** verwendet ausschließlich das öffentliche `p-menu`, `item`-/`submenuheader`-Templates sowie dessen `show()`-Methode. Eigene DOM-/ZIndex-/Overlay-/Animationsimplementierungen sind dafür nicht nötig. Der Prototyp wird noch **nicht** von der Anwendung importiert; alle elf produktiven `bh-menu`-Verwendungen bleiben beim bisherigen Nachbau.

Fünf neue Prüfungen bestehen: strukturierte Farbfelder/Badges und genau ein aktivierter Command; Tastaturnavigation und Enter/Leertaste ohne deaktivierte/ausgeblendete Einträge oder Separatoren; sichere Textlabels/Gruppen sowie Router-Link/Icon; an `body` angehängtes und positioniertes Popup mit Z-Index über 2000 sowie Escape/Fokusrückgabe; Außenklick, Scroll, Resize und Cleanup beim Zerstören. Bei der Cleanup-Prüfung wird nach dem Renderabschluss kontrolliert, dass kein Popup direkt an `body` zurückbleibt; Angular behält den Testhost selbst im Test-DOM.

Der Prototyp entfernt unsichtbare Gruppen und Kinder rekursiv aus dem präsentierten Modell, weil PrimeNG 18s Tastatur-DOM-Suche auch CSS-versteckte Einträge erfasst. Dies ist ein gezielter Adapter im Prototyp. Die bisherigen Inline-Mutationen der produktiven Menümodelle, sämtliche weitergereichten Inputs/Events, die endgültigen Styles und der Bildvergleich müssen bei der produktiven Integration gesondert geprüft werden. Das Experiment bestätigt die funktionale Machbarkeit, noch keine vollständige Gleichwertigkeit oder Freigabe zur Ablösung. Quelle: [PrimeNG 18 Menu/Templates](https://v18.primeng.org/menu).

### Validierung und offene UI-Abnahme

- Gesamtsuite **39 SUCCESS**, Exitcode 0, Headless Edge; einschließlich der fünf Prototyp-Prüfungen. Anwendungstypprüfung und `git diff --check` erfolgreich.
- Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktionsumfang weiterhin **2.32 MB**, bestehende Budgetgrenzen unverändert. Bisherige Budget-/CommonJS-Warnungen bestehen fort.
- Beide regulären Outputs: alle geprüften UI-/Extension-Dateien vorhanden, Chrome-Manifest byteidentisch zur Quelle, keine `webpackChunk`-Verweise in den standalone Extension-Einstiegen. Keine Referenz-Fixture- oder Prototyp-Marker in regulären JS-Bundles. Dies ersetzt weiterhin keine echte Extension-/Messaging-Abnahme.
- **39 von 39 Referenzszenarien** erfolgreich, **0 unbehandelte Browserfehler, 0 neue Konsolenfehler**, unverändert **9 bekannte NG0100-Meldungen** aus der Tabelle. **0 von 39 Screenshots byteidentisch**; keine vollständige visuelle Abnahme. Such- und Listenübersicht wurden zusätzlich direkt gegen die Ausgangsbilder angesehen.
- Teilekarten weiterhin **196.390625 × 320 px** mit **8 px** Padding, befüllte Teiletabellenzeilen weiterhin **91 px**, Navigation weiterhin **60 px**. Prüfsummen, Messwerte und Output-Prüfungen: [angular-18-theme-geometry-check.json](angular-upgrade-reference/angular-18-theme-geometry-check.json).

Noch offen auf Version 18: Kategorie-/Tree-Geometrie; SelectButton, ToggleSwitch, Checkbox und Disabled-Zustände; Paginator-/Icon-Details; Dialoge und Meldungen; Messages-/TabMenu-Ablösung; produktiver Menü-Wrapper einschließlich UI-Vergleich. Beispielsweise sitzt die erste Teilekartenreihe noch höher als in der Referenz, und die Kategorieeinträge haben größere Abstände. **Angular 19 wird noch nicht begonnen.**

Logs: `artefacts/angular-upgrade/angular-18/theme-geometry-*.log`. Abschließend geprüfte reguläre Outputs: `artefacts/angular-upgrade/angular-18/theme-geometry-verified/{production,development}/`; abschließende Aufnahmen: `artefacts/angular-upgrade/visual/angular-18-theme-geometry-verified/`. Die vorherigen `theme-geometry`-/`theme-geometry-final`-Aufnahmen sind Diagnose-Zwischenstände.

### Jetzt manuell: Zwischencommit

Die geprüften Basiskorrekturen und den isolierten Menü-Prototyp vor der weiteren Komponenten-Angleichung sichern:

```powershell
git add src scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: restore initial PrimeNG 18 component geometry"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier auf Wunsch des Nutzers an einem separaten Commit-Punkt an. Nach dem Commit und `weiter` folgt die verbleibende UI-Angleichung auf Version 18.

Dieser Basisgeometrieabschnitt wurde als `6854981` gesichert. Auf Anweisung des Nutzers wurde anschließend der Kategorie-/Auswahlkomponenten-Abgleich umgesetzt.

## Commit-Punkt 8: Kategorien, Auswahlkomponenten und Paginator

Stand: 4. Oktober 2026. Ausgangscommit: `6854981`; Arbeitsverzeichnis zu Beginn sauber. Angular/PrimeNG bleiben auf **18.2.14 / 18.0.2**, Paketversionen und Lockfile unverändert. Die vollständige UI-Abnahme bleibt offen.

### Erfolgreich umgesetzt

- Kategorie- und Teilelisten-Tree-Styles an die neuen Klassen **`.p-tree-root-children`, `.p-tree-node`, `.p-tree-node-content`, `.p-tree-node-toggle-button`** angepasst. Im Kategoriebaum sind die bisherigen ausgeblendeten Toggles wieder ausgeblendet; Node-Padding **8 px**, Radius **4 px** und Root-Gap **0** stehen im Preset. Die Kategoriezeilen messen jetzt **35 px** statt der zuvor größeren Abstände. Das Kategorienpanel besitzt im geprüften Desktopbild wieder die ursprüngliche Geometrie.
- **SelectButton verwendet nun ToggleButton** als innere Komponente. Dessen Padding auf **11.424 px / 16 px**, Rahmen auf `rgba(0,0,0,0.12)` und ausgewählten Hintergrund auf **`#e0e0e1`** gesetzt. Hover-/Fokusfarben berücksichtigen ausgewählte und nicht ausgewählte Zustände entsprechend dem bisherigen Theme. FormField-Textfarbe explizit auf **`rgba(0,0,0,0.87)`** gesetzt, damit die Material-Palette nicht einen abweichenden Textfarbton liefert.
- **ToggleSwitch** mit dem ursprünglichen 44×16-px-Track, **8-px-Radius**, ohne zusätzlichen Rahmen und mit Handle-Ausgangsposition **−1 px**. Unausgewählt wieder `rgba(0,0,0,0.38)`, ausgewählt `rgba(10,52,99,0.5)`; vorhandene Material-Handle-/Hover-/Fokusschatten bleiben erhalten.
- **Paginator-Seitenschalter wieder 48×48 px**, ursprünglicher Margin **0.143 rem**, kein zusätzlicher Gap sowie bisherige Navigationsfarben. Die Seitenschalter erben explizit die Anwendungsschrift: Der PrimeNG-18-Button fiel sonst auf Arial **13.3333 px** zurück; jetzt wieder Roboto **16 px**. Die erste Teilekartenreihe sitzt damit im geprüften Desktop-Suchbild wieder auf der ursprünglichen vertikalen Position.
- Unausgewählte Checkbox-Rahmen wieder **`#757575`** einschließlich Hover/Fokus. Die 18×18-px-Geometrie und 2-px-Radien bleiben erhalten. Deaktivierte Buttons verwenden wieder den bisherigen grauen Hintergrund/Text ohne zusätzliche Gesamttransparenz; deaktivierte Text-/Outlined-Buttons bleiben transparent.
- Screenshot-Bericht um Tree-Node, ToggleButton, ToggleSwitch-Track, Checkbox-Box und Paginator-Seitenschalter ergänzt. Zusätzlich werden nach den Bildaufnahmen echte Klicks auf **Kategorie**, **Only Printed**, **Lieferkanal** und **Seite 2** geprüft. Die ursprünglichen 39 Bildszenarien bleiben erhalten. Im Diagnose-Lauf musste die Seitenauswahl-Prüfung auf passende Testdaten sowie Leerzeichen um die Seitennummer korrigiert werden; dies erforderte keine Änderung am Produktverhalten.

Die Token-Struktur und die geladenen Styles wurden gegen die installierten PrimeNG-/Material-18-Quellen geprüft. Grundlage des Preset-Abgleichs: [PrimeNG 18 Theming](https://v18.primeng.org/theming). Das alte vollständige Theme wird weiterhin nicht geladen.

### Validierung und verbleibende Arbeit

- **39 Tests erfolgreich**, Headless Edge, Exitcode 0. Anwendungstypprüfung und `git diff --check` erfolgreich. Keine neuen Tests für reine CSS-Werte; die ergänzten Browseraktionen prüfen die tatsächlichen Klickziele nach dem DOM-/Geometrieabgleich.
- Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktionsumfang **2.33 MB**, unter der unveränderten 3-MB-Fehlergrenze; bisherige Budget-/CommonJS-Warnungen bestehen fort.
- Reguläre Outputs geprüft: benötigte UI-/Extension-Dateien vorhanden; Chrome-Manifest byteidentisch zur Quelle; standalone Extension-Einstiege ohne `webpackChunk`-Verweise; keine Referenz-Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Abschließender Browserlauf: **39 Screenshots**, alle vier ergänzten Interaktionsprüfungen erfolgreich; **0 neue Konsolenfehler / 0 unbehandelte Browserfehler**, unverändert **9 bekannte Tabellen-NG0100-Meldungen**. **0 von 39 Bildern byteidentisch** zur Angular-17-Referenz. Die Desktop-Suche wurde zusätzlich visuell mit dem Original verglichen; eine vollständige visuelle Abnahme ist damit noch nicht erreicht.
- Buttonhöhe **41.84375 px**, Teilekarten **196.390625×320 px / 8 px Padding**, Teiletabellenzeilen **91 px** und Navigation **60 px** bleiben erhalten. Messwerte, Prüfsummen, Interaktions- und Output-Prüfungen: [angular-18-selection-controls-check.json](angular-upgrade-reference/angular-18-selection-controls-check.json).

Weitere Arbeit auf Version 18: Dialoge und Meldungen einschließlich Messages-/TabMenu-Ablösung; produktive Integration des öffentlichen Menü-Wrappers; übrige Select-/Icon-Details und vollständiger Hover-/Fokus-/Disabled-Abgleich. Insbesondere sind die SVG-Glyphen und sämtliche Checkbox-/Kategorie-Konfigurationszustände noch nicht visuell vollständig abgenommen. **Angular 19 bleibt zurückgestellt.**

Logs: `artefacts/angular-upgrade/angular-18/selection-controls-*.log`; abschließend geprüfte Outputs: `artefacts/angular-upgrade/angular-18/selection-controls-final/{production,development}/`; abschließende Bilder: `artefacts/angular-upgrade/visual/angular-18-selection-controls-accepted-section/`. Frühere `selection-controls`-/`selection-controls-verified`-/`selection-controls-final`-Aufnahmen sind Diagnose-Zwischenstände, keine neue Referenzbasis.

### Jetzt manuell: Zwischencommit

```powershell
git add src scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: align PrimeNG 18 selection controls and paginator"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier auf Wunsch des Nutzers am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt die weitere UI-Angleichung auf Version 18.

## Commit-Punkt 9: Öffentliche Tabs und Message, erste Overlay-Korrekturen

Ausgangspunkt: Commit **`41e28e0`**, der den Auswahlkomponenten-/Paginator-Abschnitt (Commit-Punkt 8) sichert. Paketversionen und Lockfile bleiben unverändert auf Angular **18.2.14** / PrimeNG **18.0.2**.

### Erfolgreich umgesetzt

- **TabMenuModule und MessagesModule vollständig aus dem Anwendungscode entfernt.** Die Teilelistenansicht verwendet jetzt die öffentliche `TabsModule`-API mit Tabs, TabList und TabPanel. Klicks und Tastaturaktivierung übernehmen weiterhin den bisherigen Filter und laden die passenden Teile. Unbekannte oder deaktivierte Tabwerte werden ignoriert. Ein aktives Inhaltspanel erhält die Tabelleninstanz bei normalen Filterwechseln; zusätzliche leere Panels sorgen dafür, dass alle sieben `aria-controls`-Verweise gültige Ziele haben.
- Der kleine eigene **`bh-messages`-Wrapper** rendert die vorhandenen Meldungsarrays über die öffentliche `p-message`-Komponente. Severity, Icon, Summary und Detail bleiben unterstützt. Summary und Detail werden als Text gebunden; HTML wird nicht interpretiert. Migration und Transferwarnung verwenden diesen Wrapper. Alte Lot-Warnungen werden vor jedem erneuten Öffnen des Transferdialogs zurückgesetzt.
- **Fünf zusätzliche Regressionstests** prüfen Meldungsdarstellung und sichere Textbindung, das Leeren von Meldungen, Tabwechsel/Panel-Verknüpfungen, Tastaturaktivierung, ungültige/deaktivierte Tabwerte sowie das Wiederöffnen ohne veraltete Lot-Warnung. Insgesamt **44 Tests** erfolgreich.
- Das Material-basierte BrickHunter-Preset ergänzt Tabs-Schrift/-Abstände, Message-Farben sowie Dialog-Footer und Dialog-/Drawer-Schließen-Buttons. Die Schließen-Buttons erhalten die vorgesehenen Maße auch gegenüber später geladenen Button-Regeln. Die sechs modalen rechten Drawer setzen den bisherigen Maskenfarbwert explizit über den öffentlichen `maskStyle`-Input. Die Navigation bleibt von der bedingten Header-Ausrichtung ausgenommen.
- Der Screenshot-Bericht erfasst zusätzlich Tabs, Messages und Dialog-Header/-Footer. Die Angular-17-Referenzen bleiben unverändert.

API-Grundlage: [PrimeNG 18 Tabs](https://v18.primeng.org/tabs), [PrimeNG 18 Message](https://v18.primeng.org/message). Die konkrete Implementierung und Style-Reihenfolge wurden zusätzlich anhand der installierten PrimeNG-18-Quellen geprüft.

### Validierung und verbleibende Arbeit

- **44 Tests erfolgreich** mit Headless Edge, Exitcode 0. Anwendungstypprüfung und `git diff --check` erfolgreich.
- Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktionsumfang **2.31 MB**, unter der unveränderten 3-MB-Fehlergrenze; bisherige Budget-/CommonJS-Warnungen bestehen fort.
- Reguläre Outputs geprüft: benötigte UI-/Extension-Dateien vorhanden; Chrome-Manifest byteidentisch zur Quelle; standalone Extension-Einstiege ohne `webpackChunk`-Verweise; keine Referenz-Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Abschließender Browserlauf: **39 Screenshots**, alle vier Auswahl-/Toggle-/Seitenschalter-Prüfungen erfolgreich; **0 Konsolenfehler / 0 unbehandelte Browserfehler / 0 bekannte NG0100-Meldungen**. Das beschreibt diesen kontrollierten Lauf und ist kein allgemeiner Nachweis, dass sämtliche bisherigen Lifecycle-Probleme in allen produktiven Zuständen behoben sind.
- **0 von 39 Bildern byteidentisch** zur Angular-17-Referenz. Transferwarnung und Import-Drawer wurden zusätzlich visuell verglichen. Der Transferwarndialog behält die gemessenen **720 × 755.84375 px**; Warnbanner: **672 × 78 px**, erstes Tab: **87.140625 × 52 px**. Buttonhöhe **41.84375 px**, Teilekarten **196.390625 × 320 px / 8 px Padding**, Teiletabellenzeilen **91 px** und Navigation **60 px** bleiben erhalten. Messwerte, Prüfsummen und Interaktions-/Output-Prüfungen: [angular-18-tabs-messages-check.json](angular-upgrade-reference/angular-18-tabs-messages-check.json).

Die API-Ablösung ist abgeschlossen, die vollständige visuelle Angleichung der Overlays noch nicht. Offen bleiben insbesondere FileUpload-Layout und Drawer-Inhaltsabstände, Maskendarstellung im Bildvergleich, Warn-/Tabellenicons, einzelne Button-Zustände, Toasts sowie übrige Select-/Hover-/Fokus-/Disabled-Details. Der öffentliche Menü-Wrapper ist weiterhin nur isoliert geprüft und muss produktiv integriert werden. **Angular 19 bleibt bis zur vollständigen Abnahme auf Version 18 zurückgestellt.**

Logs: `artefacts/angular-upgrade/angular-18/tabs-messages-*.log`; abschließend geprüfte Outputs: `artefacts/angular-upgrade/angular-18/tabs-messages-final/{production,development}/`; abschließende Bilder: `artefacts/angular-upgrade/visual/angular-18-tabs-messages-final/`. Diagnose-Zwischenstände ersetzen die ursprüngliche Referenzbasis nicht.

### Jetzt manuell: Zwischencommit

```powershell
git add src scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "refactor: migrate PrimeNG tabs and warning messages"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier auf Wunsch des Nutzers am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.
## Commit-Punkt 10: Öffentlicher Menü-Wrapper produktiv integriert

Ausgangspunkt: Commit **`fa92c15`**, der den Tabs-/Message-Abschnitt (Commit-Punkt 9) sichert. Sein Commit-Titel wiederholt den Titel des Auswahlkomponenten-Abschnitts; der enthaltene Stand ist anhand des Quellcodes geprüft. Paketversionen und Lockfile bleiben unverändert auf Angular **18.2.14** / PrimeNG **18.0.2**.

### Erfolgreich umgesetzt

- **`bh-menu` verwendet jetzt produktiv die öffentliche `Menu`-/`MenuModule`-API von PrimeNG.** Farbfilter und Sammelaktionen behalten den bestehenden Selektor und die Methoden `toggle`, `show`, `hide`. Popup-, AppendTo-, Z-Index-, Style-, Animations- und Lifecycle-Einstellungen werden an PrimeNG weitergereicht. Der eigene Overlay-, Positionierungs-, Listener- und Tastatur-Nachbau einschließlich direkter DomHandler-/ZIndexUtils-/OverlayService-Anbindung ist entfernt.
- Strukturierte Farbfelder, Icons, Badges und Textlabels bleiben eigene öffentliche Item-Templates. Routerlinks samt Query-/Fragment-/State-Optionen und externe URLs werden über getrennte Anchor-Templates gerendert: Eine leere RouterLink-Bindung entfernte im ersten Testlauf den externen `href`; das ist korrigiert. Labels und Gruppenüberschriften bleiben Text, auch bei `escape: false`.
- Unsichtbare Gruppen und Einträge werden aus dem dargestellten Modell gefiltert, damit die öffentliche Tastatursteuerung sie nicht erreichen kann. Die Ursprungsmodelle werden dabei nicht verändert. Deaktivierte Einträge bleiben sichtbar und inaktiv. Die asynchron aufgebauten Farbgruppen setzen jetzt neue Array-Referenzen, damit der Wrapper nach dem initial leeren Modell die geladenen Farben erhält.
- Begrenzte `.bh-menu-panel`-Styles passen die neue öffentliche DOM-Struktur an die bisherigen Maße an. Gemessenes Farb-Popup: **200 × 64 px**, Menüaktion **200 × 48 px / 16 px Padding**, Farbfeld **13 × 13 px**, Roboto **16 px**, Radius **4 px** und bisheriger Popup-Schatten. Die erste vollständige visuelle Gegenprüfung ist erfolgt; Positionierung und sämtliche Interaktionszustände sind noch nicht vollständig abgenommen.
- Der isolierte Prototyp samt eigener Tests und das ungenutzte HTML-Platzhaltertemplate sind entfernt. Dessen fünf Verhaltenstests sind in die produktive Wrapper-Suite übernommen und durch weitere Prüfungen ergänzt. Zehn Tests prüfen jetzt den produktiven Wrapper statt des alten Nachbaus und des separaten Experiments. Ein zusätzlicher Integrationstest öffnet den asynchron befüllten Farbfilter und bestätigt den tatsächlichen Such-API-Aufruf.
- Das Aufnahmeskript misst Menüpanel, Menüaktion und Farbfeld. Nach den unveränderten Bildszenarien prüft es zusätzlich den Farbmenü-Klick sowie die produktiven Sammelaktionen **Listen löschen → Bestätigung anzeigen** und **Teile kopieren → Drawer anzeigen**. Eine Löschbestätigung wird nicht akzeptiert. Das Prüfziel für den Bestätigungsdialog wurde im Diagnose-Lauf auf die tatsächliche Rolle `alertdialog` korrigiert.

API-Grundlage: [PrimeNG 18 Menu](https://v18.primeng.org/menu). Verhalten und Templates wurden zusätzlich gegen die installierten PrimeNG-18-Quellen geprüft.

### Validierung und verbleibende Arbeit

- **40 Tests erfolgreich** mit Headless Edge, Exitcode 0. Die bisher 44 Tests bestehen nach Zusammenführung der zehn alten Menütests und fünf isolierten Prototyp-Tests aus zehn produktiven Wrapper-Tests plus einem neuen Farbmenü-Integrationstest und den übrigen unveränderten Tests. Anwendungstypprüfung erfolgreich.
- Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktionsumfang **2.33 MB**, unter der unveränderten 3-MB-Fehlergrenze; bisherige Budget-/CommonJS-Warnungen bestehen fort.
- Reguläre Outputs geprüft: benötigte UI-/Extension-Dateien vorhanden; Chrome-Manifest byteidentisch zur Quelle; standalone Extension-Einstiege ohne `webpackChunk`-Verweise; keine Referenz-Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Abschlusslauf: **39 Screenshots**, alle **sieben Browser-Interaktionsprüfungen** erfolgreich; **0 Konsolenfehler / 0 unbehandelte Browserfehler / 0 bekannte NG0100-Meldungen** in diesen kontrollierten Szenarien.
- Gegen Commit-Punkt 9 sind **37/39 PNGs byteidentisch**. Farbmenü und Löschbestätigung unterscheiden sich in den Prüfsummen und wurden visuell angesehen. Gegen die ursprüngliche Angular-17-Referenz bleiben **0/39 PNGs byteidentisch**; eine vollständige UI-Abnahme ist damit weiterhin offen. Buttonhöhe **41.84375 px**, Karten **196.390625 × 320 px / 8 px Padding**, Tabellenzeilen **91 px** und Navigation **60 px** bleiben erhalten. Bericht: [angular-18-public-menu-check.json](angular-upgrade-reference/angular-18-public-menu-check.json).

Der produktive Menüumbau ist funktional geprüft. Noch offen: vollständiger visueller Menü-/Hover-/Fokus-/Disabled-Abgleich, FileUpload-Layout, Drawer-Inhaltsabstände und Maskendarstellung, Toasts sowie weitere Select-/Icon-/Button-Zustände. **Angular 19 bleibt bis zur vollständigen Abnahme auf Version 18 zurückgestellt.**

Logs: `artefacts/angular-upgrade/angular-18/public-menu-*.log`; abschließend geprüfte Outputs: `artefacts/angular-upgrade/angular-18/public-menu-final/{production,development}/`; abschließende Bilder: `artefacts/angular-upgrade/visual/angular-18-public-menu-verified/`. Die Aufnahme `angular-18-public-menu-final/` ist ein Diagnose-Lauf mit falschem Alertdialog-Prüfziel und ersetzt weder den Abschlusslauf noch die ursprüngliche Referenzbasis.

### Jetzt manuell: Zwischencommit

```powershell
git add src scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "refactor: use public PrimeNG menu for filters and bulk actions"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier auf Wunsch des Nutzers am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.
## Commit-Punkt 11: FileUpload und Drawer-Geometrie/-Maske

Ausgangspunkt: Commit **`f7df1b9`**, der den produktiven Menü-Wrapper (Commit-Punkt 10) sichert. Paketversionen und Lockfile bleiben unverändert auf Angular **18.2.14** / PrimeNG **18.0.2**.

### Erfolgreich umgesetzt

- FileUpload-Preset an die Ausgangsdarstellung angeglichen: Hinweis wieder unter den Buttons, Header-Padding **16 px**, Dropbereich-Padding **32 px / 16 px**, Trennlinie, Icongröße und Disabled-Transparenz. Gemessener Choose-Button **108.390625 × 41.84375 px**, Upload-Header **92.84375 px** und leerer Dropbereich **65 px** hoch. Die Desktop-Aufnahme zeigt Überschrift, Upload-Bereich, Textarea, Namensfeld und Importbutton wieder an den Referenzpositionen.
- Drawer-Schließen-Buttons von 32 auf die ursprünglichen **40 × 40 px** und die bisherige graue Farbe korrigiert; dadurch stimmen die vertikalen Inhaltsabstände der modalen Drawer wieder. Die Navigation ohne Schließen-Button bleibt von dieser Regel ausgenommen.
- Maskenfarbe **rgba(0, 0, 0, 0.32)** einschließlich Ein-/Ausblendanimation wiederhergestellt. PrimeNG **18.0.2** schreibt `maskStyle` über `setAttribute` direkt auf die Maske, wodurch die zuvor verwendeten Objekt-Bindings wirkungslos waren; zusätzlich überschreiben fest eingebaute Keyframes die Hintergrundfarbe mit 0.4. Die sechs Bindings sind entfernt. Begrenzte Regeln für `.p-drawer-mask` und eigene Masken-Keyframes liegen bewusst außerhalb der Theme-Layer, passend zur ungeschichteten Hersteller-Struktur-CSS. Im Browserabschlusslauf ist die tatsächliche Maskenfarbe **0.32** gemessen; andere Overlay-Arten erhalten diese Regeln nicht.
- FileUpload-ViewChild und Auswahlereignis auf die öffentlichen Typen **FileUpload / FileSelectEvent** umgestellt. `onSelect` liefert neben akzeptierten auch abgewiesene Dateien; die lokale Verarbeitung liest jetzt nur `currentFiles` und lässt das Formular bei einer vollständig abgewiesenen Auswahl unverändert. XML-/JSON-Verarbeitung und der bisherige Unterschied zwischen Cancel (Dateiauswahl leeren) und Drawer-Schließen (Formular zurücksetzen) bleiben erhalten.
- Vier neue Regressionstests prüfen echte Input-Dateiauswahl mit XML-Konvertierung, JSON-Drag-and-drop, abgewiesene Dateitypen sowie Cancel und Schließen. Die Tests warten ausdrücklich auf FileReader; Angulars Stabilitätsprüfung allein wartet darauf nicht.
- Browserprüfung erweitert: echter Dateidialog über Choose mit JSON-Datei, Cancel/Schließen/Wiederöffnen und XML-Drop. Zwei zusätzliche PNGs zeigen ausgewählte Dateien und die befüllten Formulare; die ursprünglichen 39 Referenzszenarien bleiben erhalten. Die exakte Namenssuche nach Choose musste im Diagnose-Lauf auf den eindeutigen FileUpload-Button geändert werden, weil PrimeNGs SVG-Icon den zugänglichen Namen ergänzt. Der tatsächliche Dateidialog öffnet im Abschlusslauf erfolgreich.

API-Grundlage: [PrimeNG 18 FileUpload](https://v18.primeng.org/fileupload). Maskenimplementierung, DOM und Style-Reihenfolge wurden anhand der installierten PrimeNG-18-Quellen geprüft.

### Validierung und verbleibende Arbeit

- **44 Tests erfolgreich** mit Headless Edge, Exitcode 0; Anwendungstypprüfung und `git diff --check` erfolgreich.
- Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktionsumfang **2.33 MB**, unter der unveränderten 3-MB-Fehlergrenze; bisherige Budget-/CommonJS-Warnungen bestehen fort.
- Reguläre Outputs geprüft: benötigte UI-/Extension-Dateien vorhanden; Chrome-Manifest byteidentisch zur Quelle; standalone Extension-Einstiege ohne `webpackChunk`-Verweise; keine Referenz-Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Abschlusslauf: **39 Referenzszenarien plus zwei zusätzliche Datei-Aufnahmen**, alle **zehn Browser-Interaktionsprüfungen** erfolgreich; **0 Konsolenfehler / 0 unbehandelte Browserfehler / 0 bekannte NG0100-Meldungen** in diesen kontrollierten Szenarien. Import-Desktop, schmale Ansicht und die ausgewählte JSON-Datei wurden zusätzlich visuell angesehen. Die schon in der Referenz abgeschnittene schmale 700-px-Drawer-Darstellung bleibt dokumentiert.
- Weiterhin **0/39 byteidentische Referenzbilder**. Auch die 21 wiederholt aufgenommenen Desktop-Bilder zwischen Diagnose- und Abschlusslauf sind nicht byteidentisch; eine Pixelanalyse zeigt bei der normalen Listenübersicht überwiegend kleine Raster-/Schattenunterschiede. Deren Ursache und die Wiederholbarkeit der Pixelaufnahme sind vor der vollständigen visuellen Abnahme zu klären. Das wird nicht als neue Referenz akzeptiert.
- Buttonhöhe **41.84375 px**, Karten **196.390625 × 320 px / 8 px Padding**, Tabellenzeilen **91 px** und Navigation **60 px** bleiben erhalten. Messwerte, Prüfsummen, Zusatzaufnahmen und Output-/Interaktionsprüfungen: [angular-18-fileupload-check.json](angular-upgrade-reference/angular-18-fileupload-check.json).

Noch offen: Toasts, übrige Select-/Icon-/Button-Details und vollständiger Hover-/Fokus-/Disabled-Abgleich, Menü- und Overlay-Abnahme einschließlich ausgewählter FileUpload-Zustände sowie die Wiederholbarkeit der Pixelaufnahme. Echte Import-Service-/Datenbank-End-to-End-Abnahme gehört weiterhin zu den späteren Integrationsprüfungen; dieser Abschnitt prüft Dateilesen, Konvertierung und Formularbindung. **Angular 19 bleibt bis zur vollständigen Abnahme auf Version 18 zurückgestellt.**

Logs: `artefacts/angular-upgrade/angular-18/fileupload-*.log`; abschließend geprüfte Outputs: `artefacts/angular-upgrade/angular-18/fileupload-final/{production,development}/`; abschließende Bilder: `artefacts/angular-upgrade/visual/angular-18-fileupload-verified/`. `angular-18-fileupload-final/` und die `debug-*`-Aufnahmen sind Diagnose-Zwischenstände, keine Referenzbasis.

### Jetzt manuell: Zwischencommit

```powershell
git add src scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: restore FileUpload and drawer geometry on PrimeNG 18"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier auf Wunsch des Nutzers am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.

## Commit-Punkt 12: Toasts und Aufnahme-Renderer

Ausgangspunkt: Commit **`ed358fb`**, der FileUpload und Drawer (Commit-Punkt 11) sichert. Paketversionen und Lockfile bleiben unverändert auf Angular **18.2.14** / PrimeNG **18.0.2**.

### Erfolgreich umgesetzt

- Toast-Preset an die Ausgangsdarstellung angeglichen: vier Severity-Farben, Roboto **16 px**, Summary **700**, Detail **400**, Containerbreite **400 px**, Radius **4 px**, Innenabstand **24 px**, bisherige Icon-/Textpositionen, **32 × 32-px-Schließen-Button**, Schatten und **0.9** Deckkraft. Die schmale Darstellung verwendet weiterhin PrimeNGs vorhandene responsive Regel.
- Der bisherige Erfolgstoast misst wieder **400 × 86 px**. Der Vergleich des gesamten Toast-Rechtecks **x=1020, y=20, 400 × 86 px** zur unveränderten Angular-17-Aufnahme ergibt **0 unterschiedliche Pixel**. PrimeNGs `backdrop-filter: blur(0)` verursachte trotz gleicher Farbwerte kleine Compositing-Abweichungen; `backdrop-filter: none` stellt die ursprüngliche Darstellung wieder her. Der Nachweis gilt für dieses Rechteck, nicht für das vollständige Bild oder sämtliche Interaktionszustände.
- Die visuelle Fixture unterstützt vier Severity-Werte und Detailtext. Vier zusätzliche Toast-Bilder ergänzen die bereits vorhandenen JSON-/XML-Dateiaufnahmen. Browserprüfungen bestätigen Darstellung und Schließen aller vier Severities sowie Enter zum Schließen der ersten von zwei Meldungen, während die zweite erhalten bleibt. Reguläre Anwendungseinstiege verwenden diese Fixture weiterhin nicht.
- Wiederholbarkeit untersucht: Die Listenaufnahme aus Commit-Punkt 11 ist byteidentisch zu einer gezielten Aufnahme mit deaktivierter GPU. Separate D3D11-Diagnosen stimmen mit den früheren GPU-Aufnahmen überein. Das deutet auf unterschiedliche Renderer als Ursache der flächigen Rasterabweichungen hin; warum damals Software-Rendering verwendet wurde, ist ohne damalige GPU-Telemetrie nicht nachgewiesen.
- Das Aufnahmeskript startet Edge nun ausdrücklich mit **D3D11**, protokolliert Renderer und GPU-Compositing/-Rasterization zu Beginn und Ende und bricht bei Software-Fallback oder Pipelinewechsel ab. Damit werden inkompatible Aufnahmebedingungen sichtbar. Die Windows-/Browser-/GPU-/Treiberbedingungen bleiben für die Pixelabnahme relevant.

API-Grundlage: [PrimeNG 18 Toast](https://v18.primeng.org/toast), [Chrome DevTools SystemInfo](https://chromedevtools.github.io/devtools-protocol/tot/SystemInfo/). Theme-Tokens, SVG-Größen und Styles wurden zusätzlich anhand der installierten Quellen und im Browser geprüft.

### Validierung und verbleibende Arbeit

- **44 Tests erfolgreich** mit Headless Edge, Exitcode 0; Anwendungstypprüfung erfolgreich. Die abschließenden CSS-Anpassungen sind zusätzlich durch die folgenden Browserläufe und Builds geprüft.
- Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktionsumfang **2.33 MB**, unter der unveränderten 3-MB-Fehlergrenze. Bisherige Budget-/CommonJS-Warnungen bestehen fort.
- Beide regulären Outputs geprüft: benötigte UI-/Extension-Dateien vorhanden; Chrome-Manifest byteidentisch zur Quelle; standalone Extension-Einstiege ohne `webpackChunk`-Verweise; keine Referenz-Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Zwei abschließende Browserläufe mit jeweils **39 Referenzszenarien plus sechs Zusatzbildern** und **zwölf erfolgreichen Interaktionsprüfungen**: **0 Konsolenfehler / 0 unbehandelte Browserfehler / 0 bekannte NG0100-Meldungen** in diesen kontrollierten Szenarien. Beide Läufe protokollieren unverändert denselben AMD-D3D11-Renderer mit aktiviertem GPU-Compositing und Rasterization. Die Warnmeldung mit Detailtext wurde zusätzlich visuell geprüft.
- Wiederholung: **40/45 PNGs byteidentisch**, davon **38/39 ursprüngliche Szenarien** und **2/6 Zusatzbilder**. Transferwarnung und vier Toast-Zusatzbilder unterscheiden sich jeweils nur in **vier Pixeln bei x=179–180 / y=553–554**, am rechten Ende der Tabs-Unterstreichung. Diese kleine Restabweichung wird nicht ausgeblendet und bleibt vor vollständiger Pixelabnahme zu klären. Die Toast-Bereiche dieser Bilder liegen außerhalb der Abweichung.
- Zur ursprünglichen Angular-17-Referenz bleiben **0/39 vollständige Bilder byteidentisch**. Buttonhöhe **41.84375 px**, Karten **196.390625 × 320 px / 8 px Padding**, Tabellenzeilen **91 px** und Navigation **60 px** bleiben erhalten. Bericht mit Prüfsummen, Pixelgrenzen, Renderer, Messwerten und Output-/Interaktionsprüfungen: [angular-18-toast-check.json](angular-upgrade-reference/angular-18-toast-check.json).

Noch offen: übrige Select-/Icon-/Button-Details, vollständiger Hover-/Fokus-/Disabled-Abgleich, Menü-/Overlay-/ausgewählte FileUpload-Zustände und die kleine verbleibende Tabs-Rasterabweichung. Echte Import-Service-/Datenbank-End-to-End-Abnahme gehört weiterhin zu den späteren Integrationsprüfungen. **Angular 19 bleibt bis zur vollständigen Abnahme auf Version 18 zurückgestellt.**

Logs: `artefacts/angular-upgrade/angular-18/toast-tests.log`, `toast-build-accepted.log`, `toast-production-accepted.log`, `toast-development-accepted.log`, `toast-capture-accepted.log` und `toast-capture-accepted-repeat.log`. Outputs: `artefacts/angular-upgrade/angular-18/toast-accepted/{production,development}/`. Abschließende Bilder: `artefacts/angular-upgrade/visual/angular-18-toast-accepted/` und `angular-18-toast-accepted-repeat/`. Übrige Toast-/Raster-Diagnosen ersetzen die ursprüngliche Referenzbasis nicht.

### Jetzt manuell: Zwischencommit

```powershell
git add src scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: align PrimeNG toasts and stabilize reference rendering"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier auf Wunsch des Nutzers am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.

## Commit-Punkt 13: Tabellen, Preis-Tags und Tabs-Geometrie

Ausgangspunkt: Commit **`e22821e`**, der Toasts und die Renderer-Prüfung (Commit-Punkt 12) sichert. Paketversionen und Lockfile bleiben unverändert auf Angular **18.2.14** / PrimeNG **18.0.2**.

### Erfolgreich umgesetzt

- Die vier Tabellen verwenden jetzt den öffentlichen **`stripedRows`-Input** statt einer `styleClass`, die PrimeNG 18 auf den Host setzt. Die begrenzten Tabellenregeln stellen die bisherige Reihenfolge wieder her: erste/ungerade Zeilen **#f5f5f5**, gerade Zeilen **rgba(0, 0, 0, 0.02)**. PrimeNG 18 verwendet im Theme selbst die umgekehrte Streifenreihenfolge; deshalb ist die Reihenfolge im vorhandenen BrickHunter-Layer ausdrücklich festgelegt. Zeilen mit der öffentlichen Auswahlklasse behalten die vorgesehene Highlight-Farbe. Tabellenlisten, Teile, Transferwarnung und Produktvorschläge verwenden denselben Input.
- Preis-Tags verwenden den öffentlichen **`value`-Input**, damit projizierter Text neben einem leeren Label keinen zusätzlichen 4-px-Gap erzeugt. Die lokale `align-self`-Regel verhindert, dass PrimeNGs neuer Tag-Host in der Preisspalte auf die ganze Spaltenbreite gestreckt wird. Gemessen: Bestseller **67.046875 × 22 px**, Standard **61.59375 × 22 px**, Out Of Stock **81.109375 × 22 px**. Die bisherigen Info-/Danger-/Success-Farben sind im Preset ergänzt; Warnfarbe, Schrift und Padding bleiben erhalten.
- Sortiericons wieder **14 × 14 px**, **8 px** Abstand zum Text, unselektiert **rgba(0, 0, 0, 0.6)** und sortiert **rgba(0, 0, 0, 0.87)**. PrimeNG 18.0.2 liefert in SortIcon noch `.p-sortable-column-icon`, obwohl die Tabellen-Styles die neue Iconklasse erwarten; die begrenzte Preset-Regel berücksichtigt den tatsächlich installierten öffentlichen Komponenten-DOM.
- Hover-/Fokus-Regeln für sortierbare Spalten auf die neuen Klassen umgestellt und die überholten doppelten Regeln entfernt. Sortierte Spalten behalten den bisherigen weißen Grundzustand und **#f5f5f5** bei Hover/Fokus. Der zusätzliche Fokusrahmen ist entfernt, passend zur bisherigen Darstellung; die Browserprüfung bestätigt `outline-width: 0px` und keinen Box-Shadow beim Tastatursortieren.
- Die Tabs-Zeilenhöhe und der untere Abstand sind angeglichen: Tab **49 px**, gesamtes Tablist-Band **50 px**. Die Mindesthöhe des kleinen Kopfzeilenbuttons beträgt wieder **23 px**; dadurch misst der Tabellenkopf **56 px**. Teilezeilen bleiben **91 px** hoch und beginnen in der Desktopaufnahme wieder bei **y=608.875**.
- Drei neue Browser-Interaktionsprüfungen ergänzen die vorhandenen zwölf: Quantity per Enter auf- und absteigend sortieren einschließlich Daten-/ARIA-Zustand und Fokusdarstellung; Hover der sortierten Spalte; ArrowRight fokussiert den nächsten Tab und Enter aktiviert den Bestseller-Filter. Vier Zusatzbilder dokumentieren diese Zustände. Die ursprünglichen 39 Szenarien bleiben erhalten; Zusatzbilder sind kein Ersatz für die Referenz.

API-Grundlage: [PrimeNG 18 Table](https://v18.primeng.org/table), [Tag](https://v18.primeng.org/tag), [Tabs](https://v18.primeng.org/tabs). DOM, Theme-Tokens und Klassen wurden zusätzlich gegen die installierten 18.0.2-Quellen und die ursprüngliche Theme-Datei geprüft.

### Validierung und verbleibende Arbeit

- **44 Tests erfolgreich** mit Headless Edge, Exitcode 0. Abschließende CSS-Fokuskorrektur zusätzlich in den folgenden Browserläufen und Builds geprüft; Anwendungstypprüfung erfolgreich.
- Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktionsumfang **2.33 MB**, unter der unveränderten 3-MB-Fehlergrenze. Bisherige Budget-/CommonJS-Warnungen bestehen fort.
- Beide regulären Outputs geprüft: benötigte UI-/Extension-Dateien vorhanden; Chrome-Manifest byteidentisch zur Quelle; standalone Extension-Einstiege ohne `webpackChunk`-Verweise; keine Referenz-Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Zwei abschließende Browserläufe mit jeweils **39 Referenzszenarien plus zehn Zusatzbildern**, **15 erfolgreichen Interaktionsprüfungen** und **0 Konsolenfehlern / 0 unbehandelten Browserfehlern / 0 bekannten NG0100-Meldungen** in diesen kontrollierten Szenarien. Desktop-/schmale Tabelle sowie absteigende Sortierung wurden zusätzlich visuell geprüft. Die bereits in der Ausgangsreferenz vorhandene horizontale Überbreite der schmalen Ansicht bleibt separat dokumentiert.
- Im abschließenden Wiederholungspaar sind **49/49 PNGs byteidentisch** (**39/39 Hauptszenarien**, **10/10 Zusatzbilder**). Renderer, GPU-Compositing und Rasterization stimmen vor/nach beiden Läufen überein. In einem vorherigen Diagnosepaar dieses Abschnitts traten noch die bekannten vier Pixel am rechten Ende der Tabs-Unterstreichung auf. Sie sind im Abschlussvergleich nicht aufgetreten; die zwei übereinstimmenden Läufe beweisen keine allgemeine Reproduzierbarkeit über beliebige Browser-/Treiberstände.
- Die Desktop-Teiletabelle weist gegenüber der unveränderten Angular-17-Referenz noch **3.812 unterschiedliche Pixel** auf; vor diesem Abschnitt waren es **281.864**. Die restlichen Icon-/Button-/Toggle-/Unterstreichungsdetails und die übrigen Szenarien bleiben abzugleichen. Weiterhin **0/39 vollständige Referenzbilder byteidentisch**; gegenüber Commit-Punkt 12 sind **15/39 Hauptbilder unverändert**.
- Buttonhöhe **41.84375 px**, Karten **196.390625 × 320 px / 8 px Padding**, Tabellenzeilen **91 px**, Navigation **60 px** und Transferwarndialog **720 × 755.84375 px** bleiben erhalten. Der Erfolgstoast bleibt im gemessenen **400 × 86-px-Bereich pixelgleich** zur ursprünglichen Referenz. Messwerte, Prüfsummen, Pixelzahlen, Renderer sowie Output-/Interaktionsprüfungen: [angular-18-table-check.json](angular-upgrade-reference/angular-18-table-check.json).

Noch offen: übrige Select-/Icon-/Button-/Toggle-Zustände und der vollständige Hover-/Fokus-/Disabled-Abgleich, vollständige Menü-/Overlay-/Dateiauswahl-Abnahme sowie übrige Referenzabweichungen. Die ursprünglichen Angular-17-Bilder bleiben die Abnahmebasis. **Angular 19 bleibt bis zur vollständigen UI-Abnahme auf Version 18 zurückgestellt.**

Logs: `artefacts/angular-upgrade/angular-18/table-tests.log`, `table-build-accepted.log`, `table-production-accepted.log`, `table-development-accepted.log`, `table-capture-accepted.log` und `table-capture-accepted-repeat.log`. Outputs: `artefacts/angular-upgrade/angular-18/table-accepted/{production,development}/`. Abschließende Bilder: `artefacts/angular-upgrade/visual/angular-18-table-accepted/` und `angular-18-table-accepted-repeat/`. Preview-/`table-final`-/`table-repeat`-Aufnahmen sind Diagnose-Zwischenstände.

### Jetzt manuell: Zwischencommit

```powershell
git add src scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: restore table styling and compact price tags on PrimeNG 18"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier auf Wunsch des Nutzers am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.

## Commit-Punkt 14: Select-Felder und verschachteltes Escape

Ausgangspunkt: Commit **`67c9060`**, der Tabellen und Preis-Tags (Commit-Punkt 13) sichert. Paketversionen und Lockfile bleiben unverändert auf Angular **18.2.14** / PrimeNG **18.0.2**.

### Erfolgreich umgesetzt

- Select-Preset an die bisherigen Dropdown-Werte angeglichen: Pfeilbereich **2.357 rem / 37.703125 px**, SVG-Icon **14 × 14 px**, Popup ohne Rahmen mit bisherigem Schatten, Liste ohne zusätzlichen Randabstand oder Gap, Optionen mit **16 px Padding**, ohne einzelnen Radius. Auswahlfarbe **#0a3463** auf **rgba(10, 52, 99, 0.12)**; Fokus einer nicht ausgewählten Option **rgba(0, 0, 0, 0.04)**. Deaktivierte Felder behalten die weiße Fläche und **0.38** Deckkraft. Material-Styles für die Filled-Variante bleiben im Preset erhalten.
- Land und Sprache verwenden `inputId`, explizite `ariaLabelledBy`-Verweise auf die vorhandenen Labels sowie `dataKey="code"`. Der Browser findet die Comboboxen unter **Country** und **Language**. Die alten `autoWidth`-Attribute sind entfernt. Die Preiseinheit verwendet einen stabilen Schlüssel, den zugänglichen Namen **Price reduction unit** und den öffentlichen Style-Input statt des überholten `inputStyle`-Attributs.
- Die Browserprüfung hat einen echten Escape-Fehler sichtbar gemacht: PrimeNG 18.0.2 schließt das Select-Popup, lässt Escape aber zum umgebenden Drawer weiterlaufen. Die begrenzte **`bhSelectEscape`-Direktive** an den drei Feldern erfasst den offenen Zustand in der Capture-Phase, ruft `Select.hide(true)` auf und hält dieses Escape-Ereignis im Popup. Bei geschlossenem Popup greift sie nicht ein. Der Listener wird beim Zerstören der Direktive entfernt. Verzögerte Popup-Ereignisse reichen für diese schnelle Tastaturfolge nicht aus; die Umsetzung verwendet deshalb den offenen Zustand des öffentlichen Select-Typs unmittelbar beim Tastendruck.
- Ein neuer Regressionstest prüft echtes Öffnen des Selects, Popup-Schließen ohne Drawer-Schließen und Weitergabe von Escape bei geschlossenem Popup. Die vollständige Anwendung prüft zusätzlich, dass Escape anschließend den Drawer weiterhin schließen kann. Insgesamt **45 Tests** erfolgreich.
- Fünf Browserprüfungen ergänzen die bisherigen 15: Preiseinheit per Maus wählen, speichern und wieder öffnen; per Tastatur wählen und Escape ohne Wertänderung; deaktiviertes Select öffnet auch beim direkten Klick kein Popup; verschachteltes Popup-/Drawer-Escape; Schweiz per Maus und Französisch per Tastatur wählen und beide Codes speichern. Keyboard-Prüfungen warten auf die Popup-Initialisierung, damit die automatische anfängliche Fokussierung den nächsten Tastendruck nicht überholt.
- Sechs neue Zusatzbilder sichern Einheiten-Popup, gespeicherte Prozent-Auswahl, deaktiviertes Feld, Locale-Dialog, Länder-Popup und fokussierte Sprachoption. Messungen der Select-Roots, Labels, Pfeilbereiche, Overlays und Optionen stehen separat im Browserbericht. Die ursprünglichen 39 Hauptszenarien bleiben erhalten.

API-Grundlage: [PrimeNG 18 Select](https://v18.primeng.org/select). Typdefinition, Escape-Handler, DOM und Theme-Tokens wurden gegen die installierten 18.0.2-Quellen geprüft; bisherige Werte gegen die unveränderte alte Theme-Datei.

### Validierung und verbleibende Arbeit

- **45 Tests erfolgreich** mit Headless Edge, Exitcode 0; Anwendungstypprüfung erfolgreich. Die abschließende Disabled-CSS-Korrektur ist zusätzlich durch die abschließenden Browserläufe und Builds geprüft.
- Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktionsumfang **2.33 MB**, unter der unveränderten 3-MB-Fehlergrenze. Bisherige Budget-/CommonJS-Warnungen bestehen fort.
- Reguläre Outputs geprüft: benötigte UI-/Extension-Dateien vorhanden; Chrome-Manifest byteidentisch zur Quelle; standalone Extension-Einstiege ohne `webpackChunk`-Verweise; keine Referenz-Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Abschlussläufe: jeweils **39 Hauptszenarien plus 16 Zusatzbilder**, **20 erfolgreiche Browser-Interaktionsprüfungen**, keine aufgezeichneten Konsolen-/Browserfehler oder bekannten NG0100-Meldungen in den kontrollierten Szenarien. Einheiten-Popup und Tastaturfokus der Sprachoption wurden zusätzlich visuell geprüft. Gemessenes Einheiten-Popup **136 × 102 px**, zwei **51-px-Optionen**; Sprach-Popup **252 × 153 px**, drei **51-px-Optionen**.
- Der bereits seit der Angular-18-Grundmigration sichtbare Einheitenwert **EUR** bleibt erhalten. Die ursprüngliche Angular-17-Aufnahme zeigt an dieser Stelle ein leeres, entsprechend niedrigeres Feld. Der aktuelle Formwert wird nicht zur Herstellung einer identischen Aufnahme ausgeblendet; diese bestehende Referenzabweichung bleibt für die vollständige UI-Abnahme ausdrücklich dokumentiert.
- Prüfsummen, Wiederholungsvergleich, Renderer, Select-Messwerte und Output-/Interaktionsprüfungen: [angular-18-select-check.json](angular-upgrade-reference/angular-18-select-check.json). Die ursprünglichen Referenzbilder bleiben unverändert.
- Im Abschlussvergleich sind **46/55 PNGs byteidentisch** (**37/39 Hauptszenarien**, **9/16 Zusatzbilder**), einschließlich aller sechs neuen Select-Zusatzbilder. Neun andere Bilder unterscheiden sich jeweils ausschließlich in **vier Pixeln** am rechten Ende der Tabs-Unterstreichung; genaue Grenzen stehen im Bericht. Die protokollierte D3D11-Pipeline ist vor/nach beiden Läufen identisch. Diese Restabweichung wird nicht ausgeblendet.
- Zur ursprünglichen Angular-17-Referenz sind nun die **vier Settings-Seitenaufnahmen byteidentisch**, insgesamt **4/39 Hauptbilder**. Gegen Commit-Punkt 13 bleiben **24/39 Hauptbilder unverändert**. Teiletabellenhöhe und -zeilen bleiben erhalten; die Desktop-Teiletabelle hat weiterhin **3.812 abweichende Pixel** zur ursprünglichen Referenz. Buttonhöhe **41.84375 px**, Karten **196.390625 × 320 px / 8 px Padding**, Navigation **60 px**, Transferwarndialog **720 × 755.84375 px** und der pixelgleiche Erfolgstoast-Bereich bleiben erhalten. Das ist weiterhin keine vollständige UI-Abnahme.

Noch offen: übrige Icon-/Button-/Toggle-/Hover-/Fokus-/Disabled-Details, vollständige Menü-/Overlay-/Dateiauswahl-Abnahme sowie übrige Referenzabweichungen einschließlich gelegentlicher Rasterunterschiede an der Tabs-Unterstreichung. **Angular 19 bleibt bis zur vollständigen UI-Abnahme auf Version 18 zurückgestellt.**

Logs: `artefacts/angular-upgrade/angular-18/select-tests-final.log`, `select-build-verified-final.log`, `select-production-verified.log`, `select-development-verified.log`, `select-capture-verified.log` und `select-capture-verified-repeat.log`. Outputs: `artefacts/angular-upgrade/angular-18/select-verified/{production,development}/`. Abschließende Bilder: `artefacts/angular-upgrade/visual/angular-18-select-verified/` und `angular-18-select-verified-repeat/`. Andere Select-Aufnahmen sind Diagnose-Zwischenstände, keine Referenzbasis.

### Jetzt manuell: Zwischencommit

```powershell
git add src scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: align Select controls and isolate popup Escape handling"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier auf Wunsch des Nutzers am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.

## Commit-Punkt 15: Buttonfarben, Interaktionszustände und Hover-Geometrie

Ausgangspunkt: Commit **`6e7b960`**, der Select-Felder und verschachteltes Escape (Commit-Punkt 14) sichert. Paketversionen und Lockfile bleiben unverändert auf Angular **18.2.14** / PrimeNG **18.0.2**.

### Erfolgreich umgesetzt

- Button-Tokens für die verwendeten Varianten Primary, Danger und Success an die ursprüngliche Theme-Datei angeglichen: **#0a3463**, **#d32f2f** und **#689f38**. Text- und umrandete Buttons verwenden bei Hover **0.04**, bei Fokus **0.12** und beim Drücken **0.16** Deckkraft der jeweiligen Farbe. Gefüllte Buttons verwenden bei Hover **0.92**, bei Fokus **0.76** und beim Drücken **0.68**. Ripple-Flächen der Text-/Outlined-Varianten sind ebenfalls angeglichen. Material-Regeln anderer Varianten bleiben erhalten; dies ist keine Abnahme aller Buttonvarianten.
- Eine tatsächliche Größenänderung bei Hover/Active beseitigt: Die installierte PrimeNG-18-Komponente setzt in diesen Zuständen erneut einen **1-px-Rahmen**. Das bisherige Theme hat keinen äußeren Buttonrahmen. Der begrenzte Button-Preset-Override erhält deshalb den Nullrahmen auch in diesen Zuständen. Der umrandete Button behält den bisherigen inset-Schatten. Standardbuttons messen nun auch beim Hover/Drücken **41.84375 px** Höhe, statt vor der Korrektur **43.84375 px**. Icon-only-Padding ist wieder **0.714 rem**; runde Tabellenaktionen bleiben **48 × 48 px**, die bestehenden kleinen Kartenaktionen **35 × 35 px**.
- Die Fokusdarstellung entspricht den ursprünglichen Material-Zustandsregeln, einschließlich Nullbreite des zusätzlichen Fokusrings. Fokus wird weiterhin durch die farbige Fläche angezeigt. Deaktivierte Buttons behalten die ursprünglichen grauen Werte; der Browser prüft zusätzlich, dass ein direkter Klick auf das deaktivierte ReSync keinen Befehl ausführt.
- Sechs Browserprüfungen ergänzen die bisherigen 20: roter Tabellenbutton einschließlich Hover/Fokus/Active und Löschen per Space; umrandeter Settings-Button einschließlich Öffnen des Drawers per Enter; gefüllter Transferbutton einschließlich Space-Aktivierung; deaktiviertes ReSync; roter umrandeter Listenbutton; grüner Kartenbutton einschließlich Speicherung in der Have-it-Liste per Enter. Alle Aktionen verwenden die isolierte Referenz-Fixture. Der Transferdienst ist dort durch eine lokale Testimplementierung ersetzt.
- Sechs neue Zusatzbilder dokumentieren Button-Hover und -Fokus. Für die Fokusaufnahmen verlässt die Maus den Button in einen neutralen Kopfbereich, damit die Hover-Navigation nicht zusätzlich geöffnet wird. Farben, Geometrie, Padding und Fokuswerte werden gesondert im Browserbericht aufgezeichnet. Originalbilder und Hauptszenarien bleiben erhalten.

API-Grundlage: [PrimeNG 18 Button](https://v18.primeng.org/button). Tokens und Zustandsselektoren wurden zusätzlich gegen die installierten 18.0.2-Quellen und die unveränderte ursprüngliche Theme-Datei geprüft.

### Validierung und verbleibende Arbeit

- **45 Tests erfolgreich** mit Headless Edge, Exitcode 0. Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktionsumfang **2.33 MB**, unter der unveränderten 3-MB-Fehlergrenze. Bisherige Budget-/CommonJS-Warnungen bestehen fort.
- Reguläre Outputs geprüft: benötigte UI-/Extension-Dateien vorhanden; Chrome-Manifest byteidentisch zur Quelle; standalone Extension-Einstiege ohne `webpackChunk`-Verweise; keine Referenz-Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Zwei Abschlussläufe mit jeweils **39 Hauptszenarien plus 22 Zusatzbildern**, **26 erfolgreichen Browserprüfungen**, ohne aufgezeichnete Konsolen-/Browserfehler oder bekannte NG0100-Meldungen. Fokusbild des roten Tabellenbuttons zusätzlich visuell geprüft. Die bisherige Hauptgeometrie bleibt erhalten: Standardbutton **41.84375 px**, Karten **196.390625 × 320 px / 8 px Padding**, Tabellenkopf **56 px**, Teilezeilen **91 px** ab **y=608.875**, Navigation **60 px**, Transferwarndialog **720 × 755.84375 px**. Der Erfolgstoast bleibt im bisherigen **400 × 86-px-Bereich pixelgleich** zur Originalreferenz.
- Wiederholung: **52/61 PNGs byteidentisch** (**37/39 Hauptbilder**, **15/22 Zusatzbilder**). Neun Bilder unterscheiden sich ausschließlich in jeweils **vier Pixeln** am rechten Ende der Tabs-Unterstreichung; genaue Grenzen stehen im Bericht. Renderer, GPU-Compositing und Rasterization stimmen vor/nach beiden Läufen überein. Dies ist weiterhin kein Nachweis allgemeiner Reproduzierbarkeit über beliebige Browser-/Treiberstände.
- Zur ursprünglichen Angular-17-Referenz weiterhin **4/39 Hauptbilder byteidentisch** (Settings-Seite in allen vier Viewports). Gegen Commit-Punkt 14 bleiben **13/39 Hauptbilder unverändert**. Die Desktop-Teiletabelle hat noch **3.100 unterschiedliche Pixel** zur Originalreferenz, zuvor **3.812**; die Pixelabweichungen an den roten Tabellenaktionen sind beseitigt. Die übrigen Unterschiede bleiben offen. Prüfsummen, Pixelgrenzen, Button-Messwerte und Output-/Interaktionsprüfungen: [angular-18-button-check.json](angular-upgrade-reference/angular-18-button-check.json). Originalbilder bleiben unverändert.

Noch offen: übrige Icon-/Toggle-Zustände, vollständige Menü-/Overlay-/Dateiauswahl-Abnahme, vollständiger Button-Abgleich und verbliebene Referenzabweichungen einschließlich gelegentlicher Rasterunterschiede an der Tabs-Unterstreichung. **Angular 19 bleibt bis zur vollständigen UI-Abnahme auf Version 18 zurückgestellt.**

Logs: `artefacts/angular-upgrade/angular-18/button-tests.log`, `button-visual-build-final.log`, `button-production-final.log`, `button-development-final.log`, `button-capture-accepted.log` und `button-capture-accepted-repeat.log`. Reguläre Outputs: `artefacts/angular-upgrade/angular-18/button-verified/{production,development}/`. Abschlussbilder: `artefacts/angular-upgrade/visual/angular-18-button-accepted/` und `angular-18-button-accepted-repeat/`. Preview-/Verified-/Final-Aufnahmen sind Diagnose-Zwischenstände.

### Jetzt manuell: Zwischencommit

```powershell
git add src/app/shared/theme/brickhunter-preset.ts scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: restore button colors and prevent hover geometry changes"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier auf Wunsch des Nutzers am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.

## Commit-Punkt 16: ToggleSwitch-Geometrie und Zustandsdarstellung

Ausgangspunkt: Commit **`e18922f`**, der Buttonfarben und Hover-Geometrie (Commit-Punkt 15) sichert. Paketversionen und Lockfile bleiben unverändert auf Angular **18.2.14** / PrimeNG **18.0.2**.

### Erfolgreich umgesetzt

- Die Struktur des bisherigen InputSwitch anhand der erhaltenen Angular-17-Bundles geprüft: Der Slider hatte einen **1-px-Rahmen** mit transparenter Farbe. Zusammen mit dem damaligen Griffstart **-1 px** ergibt das **0 px** Abstand vom Root im ausgeschalteten und **24 px** nach der Verschiebung im eingeschalteten Zustand. PrimeNG 18 berechnet die Position des eigenen Handle-Elements anders. Rahmen, Start und eingeschaltete Position sind im begrenzten ToggleSwitch-Preset entsprechend wiederhergestellt. Root **44 × 16 px**, Griff **24 × 24 px**; der bestehende Root-Radius **8 px** bleibt erhalten.
- Hover- und Fokus-Schatten aus der ursprünglichen Theme-Datei übernommen. Ausgeschaltet: schwarzer Halo mit **0.04** bei Hover und **0.12** bei Fokus; eingeschaltet dieselben Abstufungen mit **#0a3463**. Der bisherige dreiteilige Griffschatten bleibt erhalten. Die Fokusregel gilt auch nach Mausklick und gewinnt bei gleichzeitigem Hover, entsprechend dem bisherigen Theme. Es wird kein zusätzlicher äußerer Fokusrahmen eingeführt.
- Disabled-Darstellung wieder mit **0.38** Deckkraft des gesamten Schalters. Ausgeschaltet bleiben der weiße Griff und die schwarze Trackfarbe mit **0.38** Deckkraft erhalten; eingeschaltet der blaue Griff und die blaue Trackfarbe mit **0.5** Deckkraft. Die neuen grauen Disabled-Farben überdecken diese Zustände nicht mehr. Deaktivierte Schalter erhalten keinen Hover-Halo.
- Drei Browserprüfungen ergänzen die bisherigen 26: Only Printed per Space und Maus mit tatsächlicher Filteränderung sowie Hover/Fokus an/aus; deaktivierter Schalter an/aus mit direktem Klick ohne Wertänderung; beide Affiliate-Schalter per Space mit Modellprüfung und per Labelklick. Die öffentliche Disabled-Eigenschaft wird ausschließlich in der isolierten Fixture gesetzt; das produktive Modell bleibt unverändert.
- Sechs neue Zusatzbilder sichern Hover, Fokus und Disabled jeweils an/aus. Der Bericht erfasst Root-/Griffmaße, Griffposition, Farben, Schatten, Deckkraft sowie tatsächliche Inputwerte. Die ursprünglichen 39 Hauptszenarien und Referenzbilder bleiben erhalten.

API-Grundlage: [PrimeNG 18 ToggleSwitch](https://v18.primeng.org/toggleswitch). Tokens/DOM wurden gegen die installierten 18.0.2-Quellen, Strukturregeln gegen den erhaltenen Angular-17-Entwicklungsbuild und Zustandswerte gegen die ursprüngliche Theme-Datei geprüft.

### Validierung und verbleibende Arbeit

- **45 Tests erfolgreich** mit Headless Edge, Exitcode 0. Die abschließende Rahmen-/Positionskorrektur ist zusätzlich durch die folgenden Builds und Browserläufe geprüft. Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktionsumfang **2.34 MB**, unter der unveränderten 3-MB-Fehlergrenze; bisherige Budget-/CommonJS-Warnungen bestehen fort.
- Reguläre Outputs geprüft: benötigte UI-/Extension-Dateien vorhanden; Chrome-Manifest byteidentisch zur Quelle; standalone Extension-Einstiege ohne `webpackChunk`-Verweise; keine Referenz-Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Zwei Abschlussläufe mit jeweils **39 Hauptszenarien plus 28 Zusatzbildern**, **29 erfolgreichen Browserprüfungen**, ohne aufgezeichnete Konsolen-/Browserfehler oder bekannte NG0100-Meldungen. Eingeschalteter Disabled-Schalter zusätzlich visuell geprüft. Die sechs neuen Toggle-Aufnahmen sind jeweils byteidentisch im Wiederholungspaar.
- Wiederholung insgesamt **56/67 PNGs byteidentisch** (**37/39 Hauptbilder**, **19/28 Zusatzbilder**). Elf andere Bilder unterscheiden sich ausschließlich in jeweils **vier Pixeln** am rechten Ende der Tabs-Unterstreichung; Grenzen stehen im Bericht. Renderer, GPU-Compositing und Rasterization stimmen vor/nach beiden Läufen überein. Die Restabweichung bleibt ausdrücklich dokumentiert.
- Zur Originalreferenz weiterhin **4/39 Hauptbilder byteidentisch**. Gegen Commit-Punkt 15 bleiben **15/39 Hauptbilder unverändert**. Die Desktop-Teiletabelle weist nun **1.890** statt **3.100** unterschiedliche Pixel auf. Beide Affiliate-Schalter sind in den dokumentierten **60 × 37-px-Rechtecken pixelgleich** zur ursprünglichen Referenz. Der gesamte obere Bereich dieser Aufnahme vor y=471 sowie der sichtbare Tabellenkörper ab y=609 sind ebenfalls pixelgleich; die restlichen Abweichungen liegen im Tabellenkopf und in vier Pixeln der Tab-Unterstreichung. Diese Aussagen gelten für die konkrete Aufnahme, nicht für alle Zustände/Viewports.
- Standardbutton **41.84375 px**, Karten **196.390625 × 320 px / 8 px Padding**, Tabellenkopf **56 px**, Teilezeilen **91 px** ab **y=608.875**, Navigation **60 px** und Transferwarndialog **720 × 755.84375 px** bleiben erhalten. Erfolgstoast weiterhin im dokumentierten **400 × 86-px-Bereich pixelgleich**. Prüfsummen, Vergleichsrechtecke, Toggle-Messwerte und Output-/Interaktionsprüfungen: [angular-18-toggle-check.json](angular-upgrade-reference/angular-18-toggle-check.json). Originalbilder bleiben unverändert.

Noch offen: übrige Icon- und Auswahlkomponenten-Zustände, vollständige Menü-/Overlay-/Dateiauswahl-Abnahme, vollständiger Button-Abgleich und übrige Referenzabweichungen einschließlich gelegentlicher Rasterunterschiede an der Tabs-Unterstreichung. **Angular 19 bleibt bis zur vollständigen UI-Abnahme auf Version 18 zurückgestellt.**

Logs: `artefacts/angular-upgrade/angular-18/toggle-tests.log`, `toggle-visual-build-final.log`, `toggle-production-final.log`, `toggle-development-final.log`, `toggle-capture-accepted.log` und `toggle-capture-accepted-repeat.log`. Outputs: `artefacts/angular-upgrade/angular-18/toggle-verified/{production,development}/`. Abschlussbilder: `artefacts/angular-upgrade/visual/angular-18-toggle-accepted/` und `angular-18-toggle-accepted-repeat/`. Preview-Aufnahmen sind Diagnose-Zwischenstände.

### Jetzt manuell: Zwischencommit

```powershell
git add src/app/shared/theme/brickhunter-preset.ts scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: restore ToggleSwitch geometry and interaction states"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier auf Wunsch des Nutzers am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.

## Commit-Punkt 17: Tabellenkopf und Sortiericon-Ausrichtung

Ausgangspunkt: Commit **`f4d5976`**, der ToggleSwitch-Geometrie und Zustandsdarstellung (Commit-Punkt 16) sichert. Paketversionen und Lockfile bleiben unverändert auf Angular **18.2.14** / PrimeNG **18.0.2**.

### Erfolgreich umgesetzt

- Untere Tabellenkopf-Rahmenfarbe über den öffentlichen **`headerCell.borderColor`-Token** wieder auf **#e4e4e4** gesetzt. Die bisherige Material-Vorgabe **#e0e0e0** verursachte in der Desktopaufnahme eine abweichende Linie von **1.322 Pixeln**. Rahmenbreite und Tabellengeometrie bleiben erhalten.
- Die bisherige Inline-Ausrichtung der Sortiericons wiederhergestellt. PrimeNG 17 verwendete `.p-icon-wrapper` mit einer Inline-Regel für Tabellen; PrimeNG 18 verwendet `.p-iconwrapper` mit Inline-Flex. Der neue Wrapper erhält deshalb ausschließlich innerhalb von `p-sorticon` einer Tabelle wieder `display: inline`.
- Das Sortier-SVG verwendet ausdrücklich die bisherige `vertical-align: middle`-Ausrichtung. PrimeNG 18 lädt für BaseIcon eine Regel außerhalb der Theme-Layer, deshalb ist an diesem begrenzten SVG-Selektor `!important` erforderlich. Die Korrektur ersetzt keine Glyphen, sondern stellt die ursprüngliche Platzierung wieder her. Die sechs unsortierten SVGs bleiben **14 × 14 px** mit **8 px** Abstand und bisheriger Farbe; sortierte Zustände behalten ihre vorhandene Farbe.
- Eine neue Browserprüfung ergänzt die bisherigen 29: Tabellenkopfhöhe **56 px**, untere Rahmenfarbe und Größe/Ausrichtung aller sechs Sortiericons. Der Bericht erfasst zusätzlich Icon-Positionen und Wrapper-Display. Bestehende Browserprüfungen sortieren weiterhin per Enter auf- und absteigend und prüfen die sortierte Hover-/Fokus-Darstellung.

API-Grundlage: [PrimeNG 18 Table](https://v18.primeng.org/table). Token, Wrapper und BaseIcon-Regeln wurden gegen die installierten 18.0.2-Quellen sowie den erhaltenen Angular-17-Entwicklungsbuild geprüft.

### Validierung und verbleibende Arbeit

- **45 Tests erfolgreich** mit Headless Edge, Exitcode 0. Die abschließenden CSS-Ausrichtungskorrekturen sind zusätzlich durch die folgenden Builds und Browserläufe geprüft. Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktionsumfang **2.34 MB**, unter der unveränderten 3-MB-Fehlergrenze; bisherige Budget-/CommonJS-Warnungen bestehen fort.
- Reguläre Outputs geprüft: benötigte UI-/Extension-Dateien vorhanden; Chrome-Manifest byteidentisch zur Quelle; standalone Extension-Einstiege ohne `webpackChunk`-Verweise; keine Referenz-Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Zwei Abschlussläufe mit jeweils **39 Hauptszenarien plus 28 Zusatzbildern**, **30 erfolgreichen Browserprüfungen**, ohne aufgezeichnete Konsolen-/Browserfehler oder bekannte NG0100-Meldungen. Die vorhandenen Sortier-/Hover-/Fokusprüfungen laufen weiterhin erfolgreich; es wurden keine neuen Zusatzbilder benötigt.
- Wiederholung insgesamt **64/67 PNGs byteidentisch** (**36/39 Hauptbilder**, **28/28 Zusatzbilder**). Drei Hauptbilder unterscheiden sich ausschließlich in jeweils **vier Pixeln** am rechten Ende der Tabs-Unterstreichung: Transferfortschritt bei 1440 px, leere Tabelle bei 390 px und Tabelle bei 3200 px. Renderer, GPU-Compositing und Rasterization stimmen vor/nach beiden Läufen überein. Die kleine Restabweichung bleibt dokumentiert und wird nicht ausgeblendet.
- Zur Originalreferenz sind im ersten Abschlusslauf **5/39 Hauptbilder byteidentisch**: die vier Settings-Seiten und die Tabelle bei 3200 px. Im Wiederholungslauf hat diese 3200-px-Tabelle die erwähnte Vier-Pixel-Abweichung; ihre allgemeine Byteidentität ist daher nicht nachgewiesen. Gegen Commit-Punkt 16 bleiben **15/39 Hauptbilder unverändert**.
- Die Desktop-Teiletabelle bei 1440 px hat nun nur noch **4** statt **1.890** unterschiedliche Pixel zur Originalreferenz, ausschließlich an der Tab-Unterstreichung. Der Tabellenkopf im dokumentierten **1.322 × 56-px-Rechteck** ist pixelgleich, einschließlich der Sortierpfeile und Rahmenlinie. Die übrigen Szenarien sind weiterhin keine vollständige UI-Abnahme. Standardbutton **41.84375 px**, Karten **196.390625 × 320 px / 8 px Padding**, Tabellenkopf **56 px**, Teilezeilen **91 px**, Navigation **60 px** und Transferwarndialog **720 × 755.84375 px** bleiben erhalten. Erfolgstoast weiterhin im dokumentierten **400 × 86-px-Bereich pixelgleich**. Prüfsummen, Vergleichsrechtecke, Header-/Icon-Messwerte und Output-/Interaktionsprüfungen: [angular-18-header-check.json](angular-upgrade-reference/angular-18-header-check.json). Originalbilder bleiben unverändert.

Noch offen: übrige Icon- und Auswahlkomponenten-Zustände, vollständige Menü-/Overlay-/Dateiauswahl-Abnahme, vollständiger Button-Abgleich und übrige Referenzabweichungen einschließlich gelegentlicher Rasterunterschiede an der Tabs-Unterstreichung. **Angular 19 bleibt bis zur vollständigen UI-Abnahme auf Version 18 zurückgestellt.**

Logs: `artefacts/angular-upgrade/angular-18/header-tests.log`, `header-visual-build-complete.log`, `header-production-complete.log`, `header-development-complete.log`, `header-capture-complete.log` und `header-capture-complete-repeat.log`. Outputs: `artefacts/angular-upgrade/angular-18/header-verified/{production,development}/`. Abschlussbilder: `artefacts/angular-upgrade/visual/angular-18-header-complete/` und `angular-18-header-complete-repeat/`. Accepted-/Verified-Aufnahmen dieses Abschnitts sind Diagnose-Zwischenstände.

### Jetzt manuell: Zwischencommit

```powershell
git add src/app/shared/theme/brickhunter-preset.ts scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: align table header borders and sort icons"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier auf Wunsch des Nutzers am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.

## Commit-Punkt 18: Menüfokus und Popup-Lifecycle

Ausgangspunkt: Commit **`a17682b`**, der Tabellenkopf und Sortiericon-Ausrichtung (Commit-Punkt 17) sichert. Paketversionen und Lockfile bleiben unverändert auf Angular **18.2.14** / PrimeNG **18.0.2**.

### Erfolgreich umgesetzt

- Menüfokus bleibt bei gleichzeitigem Hover sichtbar: Die auf BrickHunter-Menüs begrenzte Fokusregel steht nach der Hoverregel und verwendet den ursprünglichen Hintergrund **rgba(0, 0, 0, 0.12)**. Hover ohne Fokus bleibt bei **0.04**; deaktivierte Einträge werden ausgeschlossen. Die Werte sind gegen die erhaltene ursprüngliche Theme-Datei geprüft.
- Echte Fenster-Scrollprüfung mit der vorhandenen **1.000-Teile-Fixture** ergänzt. Sie hat gezeigt, dass PrimeNG 18 nur scrollbare Elternelemente überwacht und das Popup beim Fenster-Scrolling dieser Seite geöffnet ließ. Der Wrapper registriert deshalb über Angulars **Renderer2** einen Fenster-Scrolllistener ausschließlich für ein geöffnetes Popup. Er schließt über die öffentliche `hide()`-API und wird bei `onHide` sowie beim Zerstören entfernt. Öffentliche Show-/Hide-Events werden weiterhin weitergegeben.
- Ein gezielter Regressionstest prüft Fenster-Scrolling, Schließen und das Entfernen des Listeners nach Hide und Destroy. Die vorhandenen Tests für Gruppen, sichere Labels/Farbkästchen, Disabled-/Hidden-Einträge, Tastatur, Router-Metadaten, Append-to-body, Eltern-Scrollen und Resize bleiben erfolgreich.
- Sechs neue Browserprüfungen: Fokus bei Hover; Escape mit Rückkehr zum Auslöser; Klick außerhalb und Trigger-Toggle; echtes Fenster-Scrollen, Resize und Wiederöffnen mit Home/Space-Farbauswahl; Home/End/Space im Listen-Aktionsmenü samt Z-Index über dem Tabellenkopf; Navigation per Enter zur Settings-Seite mit Listener-Cleanup beim Zerstören.
- Listener-Audit auf der isolierten Browserseite beobachtet reale Registrierung/Entfernung von Click-/Resize-/Scrolllistenern an Document, Window und Body und ruft die ursprünglichen Methoden unverändert weiter auf. Im Abschlusslauf **3 registriert, 0 verbleibend** nach dem Seitenwechsel. Das ist eine gezielte Prüfung dieser Ziele; kein pauschaler Nachweis für beliebige Overlay- oder Elternkonfigurationen.
- Zwei neue, visuell geprüfte Zusatzbilder zeigen den Farbmenü-Fokus bei Hover sowie den per End fokussierten Delete-Eintrag. Farbpopup **200 × 64 px**, Farbfeld **13 px**; Aktionsmenü-Z-Index **2104**, Tabellenkopf **999**.

### Validierung und verbleibende Arbeit

- **46 Tests erfolgreich**, Exitcode 0. Produktions-, Entwicklungs- und visueller Referenzbuild nach der Scrollkorrektur erfolgreich. Produktionsumfang **2.34 MB**, unter der unveränderten 3-MB-Fehlergrenze; bestehende Budget-/CommonJS-Warnungen bleiben dokumentiert.

- Reguläre Outputs geprüft: benötigte UI-/Extension-Dateien vorhanden; Chrome-Manifest byteidentisch zur Quelle; standalone Extension-Einstiege ohne `webpackChunk`-Verweise; keine Referenz-Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Zwei Abschlussläufe mit jeweils **39 Hauptszenarien plus 30 Zusatzbildern** und **36 erfolgreichen Browserprüfungen**, ohne aufgezeichnete Browser-/Konsolenfehler oder bekannte NG0100-Meldungen. Listener-Audit auch im Wiederholungslauf **3 registriert, 0 verbleibend**. Die beiden neuen Menü-Zustandsbilder sind byteidentisch.
- Wiederholung insgesamt **64/69 PNGs byteidentisch** (**36/39 Hauptbilder**, **28/30 Zusatzbilder**). Die fünf anderen Bilder unterscheiden sich ausschließlich in jeweils **vier Pixeln** am rechten Ende der Tabs-Unterstreichung: Transferfortschritt und Löschbestätigung bei 1440 px, Tabelle bei 390 px sowie zwei Button-Fokusbilder. Renderer, GPU-Compositing und Rasterization stimmen vor/nach beiden Läufen überein. Die Restabweichung wird nicht ausgeblendet.
- Zur Originalreferenz **4/39 vollständige Hauptbilder byteidentisch** (vier Settings-Seiten). Gegen Commit-Punkt 17 **38/39 Hauptbilder unverändert**. Die Desktop-Teiletabelle hat weiterhin nur **4 abweichende Pixel** an der Tabs-Unterstreichung; der Tabellenkopf im dokumentierten **1.322 × 56-px-Rechteck** sowie der Erfolgstoast im **400 × 86-px-Rechteck** bleiben pixelgleich zur Originalreferenz. Die übrigen Szenarien sind weiterhin keine vollständige UI-Abnahme. Messwerte, Prüfsummen, Wiederholung und Output-/Interaktionsprüfungen: [angular-18-menu-acceptance-check.json](angular-upgrade-reference/angular-18-menu-acceptance-check.json). Originalbilder bleiben unverändert.

Noch offen: übrige Icon- und Auswahlkomponenten-Zustände, verbleibender Menü-/Overlay-/Dateiauswahl-Abgleich, vollständiger Button-Abgleich und übrige Referenzabweichungen einschließlich des korrekt dargestellten EUR-Werts und der gelegentlichen Tabs-Rasterabweichung. Menü-Lifecycle und die hier aufgeführten Tastatur-/Fokusabläufe sind geprüft; nicht alle Menü-/Overlay-Konfigurationen und Zustände sind visuell abgenommen. **Angular 19 bleibt bis zur vollständigen UI-Abnahme auf Version 18 zurückgestellt.**

Logs: `artefacts/angular-upgrade/angular-18/menu-tests-complete.log`, `menu-visual-build-complete.log`, `menu-production-complete.log`, `menu-development-complete.log`, `menu-capture-complete-final.log`, `menu-capture-complete-repeat.log` und `menu-comparison.log`. Reguläre Outputs: `artefacts/angular-upgrade/angular-18/menu-acceptance-verified/{production,development}/`. Abschlussbilder: `artefacts/angular-upgrade/visual/angular-18-menu-lifecycle-complete/` und `angular-18-menu-lifecycle-complete-repeat/`. Frühere Verified-/Complete-/Final-/Accepted-Aufnahmen dieses Abschnitts sind Diagnose-Zwischenstände; sie gelten nicht als Abschlussabnahme.

### Jetzt manuell: Zwischencommit

```powershell
git add src/app/shared/components/menu scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: preserve menu focus and close popups on window scroll"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier auf Wunsch des Nutzers am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.

## Commit-Punkt 19: Checkbox-Häkchen, Host-Geometrie und Zustände

Ausgangspunkt: Commit **`616faec`** (Menüfokus und Fenster-Scrollen). Paketversionen und Lockfile bleiben auf Angular **18.2.14** / PrimeNG **18.0.2**.

### Erfolgreich umgesetzt

- Das Material-18-CSS-Häkchen durch das weiterhin öffentlich gerenderte **CheckIcon-SVG mit 14 × 14 px** abgelöst: Die Checkbox-CSS-Erweiterung des Presets wird gezielt ersetzt, damit sie das SVG nicht versteckt und kein größeres Pseudo-Häkchen erzeugt. Der SVG-Pfad stimmt mit dem erhaltenen PrimeNG-17-Bundle überein. Root/Box bleiben **18 × 18 px**, Rahmen **2 px**, Radius **2 px**.
- Die im PrimeNG-17-Komponentenstil vorhandene Host-Regel für `p-checkbox` wiederhergestellt: **inline-flex**, vertikale Ausrichtung **bottom**, zentrierte Items. PrimeNG 18 liefert diese Host-Regel nicht mehr. Damit wird die zusätzliche Inline-Zeilenbox der Checkbox-Hosts entfernt und die 1-px-Verschiebung der folgenden Settings-Felder korrigiert. Die Listenübersicht wird dadurch nicht vollständig angeglichen.
- Hover-/Fokus-Halos wieder mit den ursprünglichen schwarzen/blauen Farben und **0.04/0.12** Deckkraft. Fokus gilt auch nach Mausklick und bleibt bei gleichzeitigem Hover sichtbar. Disabled verwendet wieder **0.38** Deckkraft am gesamten Checkbox-Root; ausgeschaltet weiße Box/grauer Rahmen, eingeschaltet blaue Box/blauer Rahmen mit weißem SVG. Disabled erhält keinen Halo.
- Drei Browserprüfungen ergänzt: Maus/Space/Label mit Reactive-Form-Modell und Speichern/Wiederöffnen; deaktivierte Checkbox an/aus mit tatsächlichem Klickversuch auf Input und Label ohne Wertänderung; einzelne Tabellenzeile sowie Auswahl aller acht Testteile und vollständiges Abwählen per Space am Tabellenkopf. Disabled wird ausschließlich über die öffentliche FormControl-API in der isolierten Fixture gesetzt.
- Sechs Zusatzbilder sichern Hover, Fokus und Disabled jeweils an/aus; der Bericht erfasst Boxmaße, Rahmen, Farben, Schatten, Deckkraft, SVG-Maße und tatsächliche Inputzustände. Die ursprünglichen Referenzbilder bleiben erhalten.

Quellengrundlage: ursprüngliche Theme-Datei und erhaltener Angular-17-Entwicklungsbuild; aktuelle Checkbox-/CheckIcon-Quellen und Material-Preset aus den installierten PrimeNG-18.0.2-Paketen.

### Validierung und verbleibende Arbeit

- **46 Tests erfolgreich**, Exitcode 0. Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich; die abschließende Host-CSS-Korrektur ist zusätzlich durch alle drei Builds und beide Browserläufe geprüft. Produktionsumfang **2.34 MB**, Budgets unverändert; bestehende Budget-/CommonJS-Warnungen bleiben bestehen.
- Reguläre Outputs geprüft: benötigte UI-/Extension-Dateien vorhanden, Chrome-Manifest byteidentisch, standalone Extension-Einstiege ohne `webpackChunk`-Verweise und keine Referenz-Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Zwei Abschlussläufe mit jeweils **39 Hauptszenarien plus 36 Zusatzbildern**, **39 erfolgreichen Browserprüfungen**, ohne aufgezeichnete Browser-/Konsolenfehler oder bekannte NG0100-Meldungen. Alle sechs neuen Checkbox-Zustandsbilder sind byteidentisch; eingeschalteter Disabled-Zustand wurde zusätzlich visuell geprüft.
- Wiederholung **67/75 PNGs byteidentisch** (**33/39 Hauptbilder**, **34/36 Zusatzbilder**). Acht andere Bilder unterscheiden sich ausschließlich in jeweils **vier Pixeln** am Ende der Tabs-Unterstreichung; Pixelgrenzen stehen im Bericht. D3D11-Renderer, GPU-Compositing und Rasterization stimmen vor/nach beiden Läufen überein.
- Zur Originalreferenz **7/39 Hauptbilder byteidentisch**: vier Settings-Seiten sowie leere Teiletabelle bei 1440, 2560 und 3200 px. Gegen Commit-Punkt 18 **31/39 Hauptbilder unverändert**. Das Desktop-Auswahlbild hat nun **884** statt **2.317** unterschiedliche Pixel. Das ausgewählte Tabellen-Häkchen ist im geprüften **18 × 18-px-Rechteck** pixelgleich; im kompletten Auswahlbild bleiben **880 Pixel im Hover-/Fokusbereich** und vier Pixel an der Tabs-Unterstreichung. Beim Drawer-Häkchen verbleiben im geprüften 18-px-Rechteck vier Eckpixel. Diese Restabweichungen werden nicht als abgenommen behandelt.
- Die Desktop-Teiletabelle ohne Auswahl hat weiterhin nur vier unterschiedliche Pixel; ihr Tabellenkopf im dokumentierten Rechteck und der Erfolgstoast bleiben pixelgleich. Die Listenübersicht hat unverändert **11.030** unterschiedliche Pixel; die Settings-Drawer-Aufnahme **100.363** statt **105.244**. Eine vollständige Gleichheit dieser Ansichten ist damit nicht nachgewiesen. Messwerte, Prüfsummen, Vergleichsrechtecke und Output-/Interaktionsprüfungen: [angular-18-checkbox-check.json](angular-upgrade-reference/angular-18-checkbox-check.json).

Noch offen vor Angular 19: Tabellencheckbox-Hover/Fokus bei Mausbedienung und vier Drawer-Checkbox-Eckpixel, übrige Icon-/Auswahlkomponenten-Zustände, verbleibender Menü-/Overlay-/Dateiauswahl-Abgleich, vollständiger Button-Abgleich und übrige Referenzabweichungen. Die funktionalen Checkbox-Prüfungen und die hier dokumentierten Zustandswerte sind erfolgreich; die vollständige UI-Abnahme bleibt offen. **Angular 19 wird noch nicht gestartet.**

Logs: `artefacts/angular-upgrade/angular-18/checkbox-tests.log`, `checkbox-visual-build-complete.log`, `checkbox-production-complete.log`, `checkbox-development-complete.log`, `checkbox-capture-final.log`, `checkbox-capture-final-repeat.log` und `checkbox-comparison.log`. Outputs: `artefacts/angular-upgrade/angular-18/checkbox-verified/{production,development}/`. Abschlussbilder: `artefacts/angular-upgrade/visual/angular-18-checkbox-final/` und `angular-18-checkbox-final-repeat/`. Verified-/Complete-Aufnahmen dieses Abschnitts sind Diagnose-Zwischenstände: zunächst verweigerte Playwright den Labelklick einer deaktivierten Checkbox; danach wurde eine Aufnahme durch den währenddessen erneuerten Referenzbuild unterbrochen. Beide Abschlussläufe sind ohne diese Fehler erfolgreich.

### Jetzt manuell: Zwischencommit

```powershell
git add src/app/shared/theme/brickhunter-preset.ts scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: restore checkbox SVG and interaction states"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.

## Commit-Punkt 20: Tabellencheckbox-Hover und Tastaturfokus

Ausgangspunkt: Commit **`121b64d`** (Checkbox-SVG und Zustandswerte). Angular **18.2.14** / PrimeNG **18.0.2**, Paketdateien und Lockfile bleiben unverändert.

### Erfolgreich umgesetzt

- Die Ursache der verbliebenen **880 Pixel** im Tabellencheckbox-Halo gegen den erhaltenen PrimeNG-17-Code geprüft: TableCheckbox/TableHeaderCheckbox hatten eigenes Markup ohne den Checked-Zustand am Root. Damit waren ihre Halos schwarz. Der Mausklick wurde am Root verarbeitet und fokussierte den versteckten Input nicht. PrimeNG 18 verwendet dort die normale öffentliche Checkbox mit Checked-Root und direkt anklickbarem Input.
- Begrenzte CSS-Regeln innerhalb von Tabellen stellen die bisherige Zustandsdarstellung wieder her: schwarzer Hover-Halo mit **0.04**, schwarzer Tastaturfokus mit **0.12**, kein zusätzlicher Fokus-Halo bei Mausbedienung ohne Hover. `:focus-visible` unterscheidet die Bedienung. Der doppelte Root-Klassenselektor überstimmt gezielt die generischen Checked-/Unchecked-Regeln; die normalen Checkboxen im Settings-Drawer behalten ihre blauen Zustände. Auswahl und Events bleiben bei PrimeNGs öffentlichen Komponenten.
- Eine zusätzliche Browserprüfung trennt Mausklick und anschließendes Tab/Shift+Tab mit Fokus-/Modellprüfung, danach Abwählen per Space. Die vorhandene Tabellenprüfung erfasst jetzt zusätzlich den schwarzen Fokus bei ausgewählter Headercheckbox. Zwei neue Zusatzbilder sichern ausgewählte Tabellencheckboxen nach Maus- und Tastaturbedienung.
- Ursprüngliches `position: relative` an der Checkbox-Box wiederhergestellt. Die vier Drawer-Eckpixel ändern sich dadurch nicht. Sie sind nun exakt quantifiziert: an **(1136,236), (1153,236), (1136,253), (1153,253)** jeweils RGBA **[162,178,195,255]** in der Referenz gegenüber **[162,178,196,255]** im aktuellen Bild. Ausschließlich der Blaukanal unterscheidet sich um **1**. Eine Ursache dieser Rasterabweichung ist damit nicht bewiesen; sie wird nicht ausgeblendet oder als beseitigt behandelt.

### Validierung und verbleibende Arbeit

- **46 Tests**, Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich, Exitcode 0. Produktionsumfang **2.34 MB**, Budgets unverändert; vorhandene Budget-/CommonJS-Warnungen bleiben bestehen.
- Reguläre Outputs geprüft: notwendige UI-/Extension-Dateien vorhanden, Chrome-Manifest byteidentisch, standalone Extension-Einstiege ohne `webpackChunk`-Verweise und keine Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Zwei Abschlussläufe mit jeweils **39 Hauptszenarien plus 38 Zusatzbildern**, **40 erfolgreichen Browserprüfungen**, ohne aufgezeichnete Browser-/Konsolenfehler oder bekannte NG0100-Meldungen. Beide neuen Checkboxbilder sind visuell geprüft und im Wiederholungspaar byteidentisch.
- Wiederholung **68/77 PNGs byteidentisch** (**36/39 Hauptbilder**, **32/38 Zusatzbilder**). Neun andere Bilder unterscheiden sich ausschließlich in jeweils vier Pixeln an der Tabs-Unterstreichung. D3D11-Renderer, GPU-Compositing und Rasterization stimmen vor/nach beiden Läufen überein.
- Desktop-Auswahlbild jetzt **4** statt **884** unterschiedliche Pixel zur Originalreferenz, ausschließlich an der Tabs-Unterstreichung. Der Tabellencheckbox-Halo im dokumentierten **40 × 40-px-Rechteck** ist pixelgleich. Das Tabellen-Häkchen im Settings-Drawer-Bild bleibt im dokumentierten **18 × 18-px-Rechteck** pixelgleich. Die vier Drawer-Häkchen-Eckpixel bleiben wie oben beschrieben bestehen.
- Zur Originalreferenz weiterhin **7/39 Hauptbilder byteidentisch**; gegenüber Commit-Punkt 19 **36/39 Hauptbilder unverändert**. Listenübersicht und vollständiges Settings-Drawer-Bild sind weiterhin nicht pixelgleich; ihre bisherigen **11.030** bzw. **100.363** Unterschiede bleiben bestehen. Messwerte, Prüfsummen, RGBA-Eckwerte und Vergleichsrechtecke: [angular-18-checkbox-table-check.json](angular-upgrade-reference/angular-18-checkbox-table-check.json). Originalbilder bleiben erhalten.

Noch offen vor Angular 19: die dokumentierten vier Drawer-Eckpixel, übrige Icon-/Auswahlkomponenten-Zustände, verbleibender Menü-/Overlay-/Dateiauswahl-Abgleich, vollständiger Button-Abgleich und übrige Referenzabweichungen. Tabellencheckbox-Maus-Hover und Tastaturfokus sind für die geprüften Abläufe abgeglichen. **Angular 19 startet erst nach der vollständigen UI-Abnahme auf Version 18.**

Logs: `artefacts/angular-upgrade/angular-18/checkbox-table-tests.log`, `checkbox-table-visual-build.log`, `checkbox-table-production.log`, `checkbox-table-development.log`, `checkbox-table-capture.log`, `checkbox-table-capture-repeat.log` und `checkbox-table-comparison.log`. Outputs: `artefacts/angular-upgrade/angular-18/checkbox-table-verified/{production,development}/`. Abschlussbilder: `artefacts/angular-upgrade/visual/angular-18-checkbox-table-verified/` und `angular-18-checkbox-table-verified-repeat/`.

### Jetzt manuell: Zwischencommit

```powershell
git add src/app/shared/theme/brickhunter-preset.ts scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: restore table checkbox mouse and keyboard halos"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.

## Commit-Punkt 21: Modal-Masken und Ebenenreihenfolge der Navigation

Ausgangspunkt: Commit **`7d489ac`** (Tabellencheckbox-Halos). Angular **18.2.14** / PrimeNG **18.0.2**, Paketdateien und Lockfile bleiben unverändert.

### Erfolgreich umgesetzt

- Ursache der zu dunklen Dialog-Hintergründe geprüft: PrimeNG 18.0.2 injiziert mit Drawer globale Masken-Keyframes mit **0.4** Deckkraft außerhalb der Theme-Layer. Die generische Enter-/Leave-Animation wird auch von Dialogen verwendet; ihr abschließender Frame überdeckt den eigentlichen Material-Masken-Token **0.32**. Die bestehenden BrickHunter-Regeln und Keyframes für Drawer-Masken gelten deshalb gezielt auch für Dialog-Masken. Enter/Leave behalten transparente bzw. **rgba(0, 0, 0, 0.32)** Endpunkte.
- Ursache der ungedimmten, anklickbaren Navigation bei geöffnetem Drawer geprüft: Drawer 18 berechnet den Masken-Z-Index anhand des ersten aktiven Drawers und berücksichtigt dabei die dauerhafte, nichtmodale Navigation. Die Navigation erhält daher ausschließlich in ihrem eigenen Komponentenstil den tatsächlichen Z-Index **1000**: über dem Tabellenkopf (**999**), unter den automatisch verwalteten Modal-Masken. Die begrenzte wichtige Regel überstimmt PrimeNGs automatisch geschriebenen Inline-Z-Index. PrimeNG-Komponenten, Masken und deren Listener werden weiterverwendet.
- Drei zusätzliche Browserprüfungen erfassen Abdunklung und tatsächlichen Hit-Test über der linken Navigation; Drawer-Außenklick ohne Hintergrundnavigation mit anschließend wieder funktionierendem Navigationsklick; Select-Popup über dem Drawer mit isoliertem Escape und Masken-Cleanup; nicht wegklickbaren Transferdialog mit blockiertem Hintergrundklick und Abbrechen über den tatsächlichen Button.
- Zwei zusätzliche Bilder sichern Settings-Drawer und Transferdialog mit abgedeckter Navigation. In den Hauptszenarien werden Dialogmasken und Z-Indizes zusätzlich gemessen. Der Vergleichsbericht prüft alle darin vorhandenen Modal-Masken auf **0.32** Deckkraft, volle Viewport-Abdeckung und Lage über der Navigation.
- Referenzhelfer korrigiert: direkte Komponentenaufrufe erfolgen innerhalb der Angular-Zone. Der bisherige Aufruf außerhalb der Zone ließ beim gefüllten Transferdialog nach einer Screenshot-Aufnahme `show = false` ohne aktualisierten Dialog-Input stehen. Der isolierte Vergleich mit und ohne Screenshot sowie mit Aufruf innerhalb der Zone bestätigt die Ursache; die Abbruchprüfung klickt weiterhin den tatsächlichen Button, ohne nachträgliche erzwungene Aktualisierung. Dieser Helfer bleibt ausschließlich im lokalen Referenz-Einstieg.

Quellengrundlage: ursprüngliche Theme-Datei, installierte PrimeNG-18.0.2-Drawer-/Dialog-/Base-Quellen und Material-Masken-Token. Keine Änderung an `node_modules`.

### Validierung und verbleibende Arbeit
- **46 Tests**, Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich, Exitcode 0. Der Referenzbuild wurde nach der Zone-Korrektur erneut erfolgreich erstellt. Produktionsumfang **2.34 MB**, Budgets unverändert; bestehende Budget-/CommonJS-Warnungen bleiben bestehen.
- Reguläre Outputs geprüft: erforderliche Extension-/UI-Dateien vorhanden, Chrome-Manifest byteidentisch, standalone Extension-Einstiege ohne `webpackChunk`-Verweise und keine Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Zwei Abschlussläufe mit jeweils **39 Hauptszenarien plus 40 Zusatzbildern**, **43 erfolgreichen Browserprüfungen**, ohne aufgezeichnete Browser-/Konsolenfehler oder bekannte NG0100-Meldungen. Beide neuen Maskenbilder sind visuell geprüft. Pro Lauf sind zusätzlich alle **neun** gemessenen Masken der Hauptszenarien mit **0.32** Deckkraft, vollständiger Viewport-Abdeckung und Z-Index über **1000** geprüft.
- Gemessene Ebenen im zusätzlichen Ablauf: Navigation **1000**, Settings-Maske **1101**, Drawer **1104**, verschachtelter Select **2106**, Warnungsmaske **1103**, Dialog **1104**. Hit-Tests bestätigen die Abdeckung der Navigation. Außenklick schließt den Settings-Drawer ohne Hintergrundnavigation; anschließend funktioniert die Navigation wieder. Escape schließt zunächst nur den Select und danach den Drawer. Der Transferdialog bleibt bei Außenklick offen und entfernt seine Maske beim Abbrechen.
- Wiederholung **62/79 PNGs byteidentisch** (**37/39 Hauptbilder**, **25/40 Zusatzbilder**). Die übrigen 17 Bilder unterscheiden sich ausschließlich in jeweils vier Pixeln an der Tabs-Unterstreichung. Das neue Dialogbild ist byteidentisch; das neue Drawerbild hat diese vier Tabs-Pixel. D3D11-Renderer, GPU-Compositing und Rasterization sind vor/nach beiden Läufen identisch. Diese Rasterabweichungen werden nicht ausgefiltert.
- Zur Originalreferenz jetzt **8/39 Hauptbilder byteidentisch**. Der gesamte Navigationsbereich **60 × 1000 px** ist in Settings-Drawer, Exportdialog und Transferwarnung jetzt pixelgleich, zuvor je **60.000** abweichende Pixel. Vollständiges Settings-Bild **30.373** statt **100.363**, Exportdialog **71.743** statt **141.733**, Transferwarnung **16.885** statt **907.500** abweichende Pixel. Diese Bilder sind weiterhin nicht vollständig pixelgleich.
- Tabellencheckbox-Halo und Tabellenkopf bleiben in den dokumentierten Rechtecken pixelgleich. Vier Drawer-Häkchen-Eckpixel mit je einem Blaukanalwert Unterschied bleiben bestehen. Gegenüber Commit-Punkt 20 sind **30/39 Hauptbilder byteidentisch**; die übrigen sind im Bericht aufgelistet. Messwerte, Pixelvergleiche und Prüfsummen: [angular-18-overlay-check.json](angular-upgrade-reference/angular-18-overlay-check.json). Originalreferenzen bleiben unverändert.

Noch offen vor Angular 19: vier Drawer-Häkchen-Eckpixel, übrige Icon-/Auswahlkomponenten-Zustände, weiterer Menü-/Overlay-/Dateiauswahl-Abgleich, vollständiger Button-Abgleich und übrige Referenzabweichungen. Die hier geprüften Modal-Masken, Hintergrundklicks, verschachtelten Select-/Escape-Abläufe und Cleanup sind erfolgreich. **Angular 19 beginnt erst nach der vollständigen UI-Abnahme auf Version 18.**

Logs: `artefacts/angular-upgrade/angular-18/overlay-tests.log`, `overlay-visual-build.log`, `overlay-visual-zone-build.log`, `overlay-production.log`, `overlay-development.log`, `overlay-capture-final.log`, `overlay-capture-final-repeat.log` und `overlay-comparison.log`. Reguläre Outputs: `artefacts/angular-upgrade/angular-18/overlay-verified/{production,development}/`. Abschlussbilder: `artefacts/angular-upgrade/visual/angular-18-overlay-final/` und `angular-18-overlay-final-repeat/`. Verified-/Complete-Aufnahmen sind fehlgeschlagene Diagnose-Zwischenstände vor Korrektur des Referenzhelfers und der Button-/Select-Lokatoren; sie sind keine Abschlussnachweise.

### Jetzt manuell: Zwischencommit

```powershell
git add src/assets/theme/brickhunter-base.scss src/app/shared/layout/side-navigation/side-navigation.component.scss src/testing/visual-main.ts scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: restore modal mask opacity and navigation stacking"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.

## Commit-Punkt 22: Inline-Button-Ausrichtung und Listenübersicht

Ausgangspunkt: Commit **`82fda9d`** (Modal-Masken und Navigation). Angular **18.2.14** / PrimeNG **18.0.2**, Paketdateien und Lockfile bleiben unverändert.

### Erfolgreich umgesetzt

- Inline-Buttons im erhaltenen Angular-17-Entwicklungsbuild mit dem aktuellen Referenzbuild verglichen: beide Bulk-Buttons **48 × 23 px**, beide Delete-Buttons **99.625 × 41.84375 px**. Die alte Ausrichtung ist **`vertical-align: bottom`**, die neue **`baseline`**. Bei gleicher Button-Größe wächst dadurch der Kopf der Listenübersicht von **56** auf **56.5 px**; alle nachfolgenden Zeilen beginnen um **0.5 px** zu tief. Die ursprüngliche Ausrichtung ist nun innerhalb des Button-Presets wiederhergestellt.
- Die Messung des alten regulären Builds verwendet ausschließlich eine lokale Beispielzeile und blockierte externe Anfragen; wegen fehlender Referenz-Fixtures ist sie kein Bild-Abnahmenachweis. Die gespeicherten Angular-17-Referenzbilder bleiben Grundlage des anschließenden Pixelvergleichs.
- Zusätzliche Browserprüfung kontrolliert Listenheader und Zeilenhöhe sowie die Bulk-Button-Größe im deaktivierten Zustand und nach Auswahl. Hover, Fokus und Active verwenden die ursprünglichen primären Farben; Space öffnet das tatsächliche Menü und Escape stellt den Trigger-Fokus wieder her. Ein neues Zusatzbild sichert den fokussierten Bulk-Button mit ausgewählter Liste.
- Alle vorhandenen Button-Zustandsmessungen prüfen zusätzlich die wiederhergestellte Ausrichtung. Die Hauptszenarien erfassen `verticalAlign` für spätere Vergleiche.

### Validierung und verbleibende Arbeit

- **46 Tests**, Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich, Exitcode 0. Produktionsumfang **2.34 MB**, Budgets unverändert; bestehende Budget-/CommonJS-Warnungen bleiben bestehen.
- Reguläre Outputs geprüft: erforderliche UI-/Extension-Dateien vorhanden, Chrome-Manifest byteidentisch, standalone Extension-Einstiege ohne `webpackChunk`-Verweise und keine Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Zwei Abschlussläufe mit jeweils **39 Hauptszenarien plus 41 Zusatzbildern**, **44 erfolgreichen Browserprüfungen**, ohne aufgezeichnete Browser-/Konsolenfehler oder bekannte NG0100-Meldungen. Das neue Bulk-Fokusbild ist visuell geprüft und im Wiederholungspaar byteidentisch. Die gemessenen Bulk-Buttons bleiben in allen geprüften Zuständen **48 × 23 px**; Header **56 px**, Zeile **46.84375 px**.
- Wiederholung **66/80 PNGs byteidentisch** (**33/39 Hauptbilder**, **33/41 Zusatzbilder**). Die übrigen 14 Bilder unterscheiden sich ausschließlich in jeweils vier Pixeln an der Tabs-Unterstreichung. D3D11-Renderer, GPU-Compositing und Rasterization sind vor/nach beiden Läufen identisch; die vier Pixel werden nicht ausgefiltert.
- Listenübersicht in **1440 × 1000, 390 × 844, 2560 × 1440 und 3200 × 1440** in beiden Läufen vollständig pixelgleich zur Originalreferenz. Zuvor **11.030 / 2.673 / 18.870 / 23.352** abweichende Pixel, jetzt jeweils **0**. Desktop-Header beginnt bei **y = 182.65625**, erste Zeile bei **y = 238.65625**.
- Zur Originalreferenz im ersten Abschlusslauf jetzt **12/39 Hauptbilder byteidentisch**. Gegenüber Commit-Punkt 21 **28/39 Hauptbilder unverändert**; Änderungen und Wiederholungsabweichungen sind im Bericht aufgelistet. Tabellenkopf und Checkbox-Halo bleiben in den dokumentierten Rechtecken pixelgleich, die Modal-Navigation ebenfalls. Vier Drawer-Häkchen-Eckpixel bleiben bestehen. Messwerte und Prüfsummen: [angular-18-button-alignment-check.json](angular-upgrade-reference/angular-18-button-alignment-check.json). Originalbilder bleiben unverändert.

Noch offen vor Angular 19: vier Drawer-Häkchen-Eckpixel, übrige Icon-/Auswahlkomponenten-Zustände, weiterer Menü-/Overlay-/Dateiauswahl-Abgleich, vollständiger Button-Abgleich und übrige Referenzabweichungen. Die Listenübersicht ist in den vier Referenzgrößen abgeglichen. **Angular 19 beginnt erst nach der vollständigen UI-Abnahme auf Version 18.**

Logs: `artefacts/angular-upgrade/angular-18/button-alignment-tests.log`, `button-alignment-visual-build.log`, `button-alignment-production.log`, `button-alignment-development.log`, `button-alignment-capture.log`, `button-alignment-capture-repeat.log` und `button-alignment-comparison.log`. Reguläre Outputs: `artefacts/angular-upgrade/angular-18/button-alignment-verified/{production,development}/`. Abschlussbilder: `artefacts/angular-upgrade/visual/angular-18-button-alignment-final/` und `angular-18-button-alignment-final-repeat/`.

### Jetzt manuell: Zwischencommit

```powershell
git add src/app/shared/theme/brickhunter-preset.ts scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: restore inline button alignment and list header geometry"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.

## Commit-Punkt 23: Schließen-Icons und Zustände in Drawer-/Dialog-Headern

Ausgangspunkt: Commit **`533879c`** (Inline-Button-Ausrichtung). Angular **18.2.14** / PrimeNG **18.0.2**, Paketdateien und Lockfile bleiben unverändert.

### Erfolgreich umgesetzt

- Schließen-Buttons mit der erhaltenen Theme-Datei abgeglichen: bisher **40 × 40 px**, Icon **14 × 14 px**, Farbe **rgba(0, 0, 0, 0.6)** und Hover-Hintergrund **rgba(0, 0, 0, 0.04)**. PrimeNG 18 verwendet öffentliche Button-Komponenten mit Secondary/Text-Zuständen und einem **16 × 16-px-Icon**. Gemessener Hover war **rgb(248, 250, 252)** mit **rgb(71, 85, 105)** Text; Tastaturfokus/Active übernahmen **rgba(10, 52, 99, 0.12/0.16)** aus den generischen Button-Regeln.
- Innerhalb der Drawer-/Dialog-Header-Regeln die ursprünglichen Icon-Abmessungen und grauen Farben wiederhergestellt. Hover bleibt schwarz mit **0.04** Deckkraft, Tastaturfokus/Active ohne Hover bleiben transparent und ohne Outline/Shadow. Gleichzeitiger Hover und Fokus behält den Hover-Hintergrund, wie im alten Theme. Normale Formular- und Footer-Buttons verwenden weiter die vorhandenen Button-Regeln.
- Zwei zusätzliche Browserprüfungen erfassen Settings-Drawer und Changelog-Dialog: Rest, Hover, gleichzeitiger Hover/Fokus, Fokus ohne Hover und gedrückte Space-Taste. Nach Space sowie nach echtem Mausklick muss die jeweilige Maske entfernt sein. Vier neue Zusatzbilder sichern Hover und Fokus; Hauptszenarien messen zusätzlich Header-Buttons und SVGs.

### Validierung und verbleibende Arbeit

- **46 Tests**, Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich, Exitcode 0. Produktionsumfang **2.34 MB**, Budgets unverändert; bestehende Budget-/CommonJS-Warnungen bleiben bestehen.
- Reguläre Outputs geprüft: erforderliche UI-/Extension-Dateien vorhanden, Chrome-Manifest byteidentisch, standalone Extension-Einstiege ohne `webpackChunk`-Verweise und keine Fixture-/Prototyp-Marker in regulären JS-Bundles.
- Zwei Abschlussläufe mit jeweils **39 Hauptszenarien plus 45 Zusatzbildern**, **46 erfolgreichen Browserprüfungen**, ohne aufgezeichnete Browser-/Konsolenfehler oder bekannte NG0100-Meldungen. Alle vier neuen Zustandsbilder sind visuell geprüft und im Wiederholungspaar byteidentisch. Beide Schließen-Buttons bleiben in allen geprüften Zuständen **40 × 40 px**, Icons **14 × 14 px**. Maus- und Space-Abbruch entfernen jeweils die Maske.
- Wiederholung **73/84 PNGs byteidentisch** (**35/39 Hauptbilder**, **38/45 Zusatzbilder**). Elf andere Bilder unterscheiden sich ausschließlich in jeweils vier Pixeln an der Tabs-Unterstreichung. D3D11-Renderer, GPU-Compositing und Rasterization sind vor/nach beiden Läufen identisch; die vier Pixel werden nicht ausgefiltert.
- Schließen-Bereich **40 × 40 px bei x = 1384, y = 16** in Desktop-Import, Settings-Drawer und Export jetzt pixelgleich zur Originalreferenz, zuvor jeweils **54** abweichende Pixel. Vollständiges Settings-Bild **30.319** statt **30.373**, Export **71.689** statt **71.743** abweichende Pixel; die übrigen Unterschiede bleiben offen.
- Listenübersicht bleibt in beiden Läufen auf allen vier Referenzgrößen vollständig pixelgleich. Tabellenkopf, Checkbox-Halo und Modal-Navigation bleiben in den dokumentierten Rechtecken pixelgleich. Vier Drawer-Häkchen-Eckpixel mit je einem Blaukanalwert Unterschied bleiben bestehen.
- Zur Originalreferenz im ersten Abschlusslauf **11/39 Hauptbilder byteidentisch**; gegenüber Commit-Punkt 22 **28/39 Hauptbilder unverändert**. Die Änderung von zuvor 12 auf 11 Referenzidentitäten entsteht aus den bereits bekannten Tabs-Pixeln: die 2560-/3200-Teiletabelle hat nun jeweils vier Unterschiede, die 3200-Leertabelle ist jetzt pixelgleich. Diese Wechsel sind zusätzlich unter `referenceIdentityChanges` dokumentiert. Messwerte, Vergleiche und Prüfsummen: [angular-18-close-buttons-check.json](angular-upgrade-reference/angular-18-close-buttons-check.json). Originalbilder bleiben unverändert.

Noch offen vor Angular 19: vier Drawer-Häkchen-Eckpixel, weitere Icon-/Auswahlkomponenten-Zustände, weiterer Menü-/Overlay-/Dateiauswahl-Abgleich, übriger Button-Abgleich und verbleibende Referenzabweichungen. Schließen-Buttons der geprüften Header sind in Größe, Farben und Bedienung abgeglichen. **Angular 19 beginnt erst nach der vollständigen UI-Abnahme auf Version 18.**

Logs: `artefacts/angular-upgrade/angular-18/close-buttons-tests.log`, `close-buttons-visual-build.log`, `close-buttons-production.log`, `close-buttons-development.log`, `close-buttons-capture.log`, `close-buttons-capture-repeat.log` und `close-buttons-comparison.log`. Reguläre Outputs: `artefacts/angular-upgrade/angular-18/close-buttons-verified/{production,development}/`. Abschlussbilder: `artefacts/angular-upgrade/visual/angular-18-close-buttons-final/` und `angular-18-close-buttons-final-repeat/`.

### Jetzt manuell: Zwischencommit

```powershell
git add src/app/shared/theme/brickhunter-preset.ts scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: restore modal close icon size and interaction states"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Die Umsetzung hält hier am geprüften Commit-Punkt an. Nach dem Commit und `weiter` folgt der nächste Abschnitt auf Version 18.

## Commit-Punkt 24: Vollständige automatisierte UI-Abnahme auf Angular 18

Ausgangspunkt: **`7d776d9`**. Der Auftrag „weiter bis komplette ui-abnahme“ wurde ohne weitere Zwischencommit-Pausen ausgeführt. Angular **18.2.14** / PrimeNG **18.0.2**, Paketdateien und Lockfile bleiben unverändert. **Die automatisierte UI-Abnahme ist abgeschlossen; Angular 19 kann nach Sicherung dieses Commit-Punkts beginnen.** Abnahme bestätigt Bedienung, Geometrie und Designwerte im vorhandenen Offline-Referenzumfang. Sie behauptet keine vollständige Byteidentität aller Bilder und umfasst keine echten LEGO-Konto-/Warenkorbtransfers.

### Erfolgreich umgesetzt

- PrimeFlex-`surface-border` wieder an die vorhandene Rahmenvariable gebunden. SelectButton verwendet den ursprünglichen Inline-Umbruch, Rahmenverlauf und physische Ecken; vertikale Export-, PDF- und Copy/Move-Gruppen an das neue ToggleButton-DOM angepasst. Copy-Zieltexte bleiben links, gemessener Einzug **17 px**, Breite **288 px**. Der separate PDF-Drawer ist nicht mehr eingebunden; geprüft wird der tatsächlich verwendete PDF-Export.
- Browse-Sortierfeld an die Flex-Breite des InputGroup angepasst. Mobile Tabs bleiben horizontal scrollbar, ohne die in Version 18 neu eingeblendeten Navigationspfeile. Echter horizontaler Wheel-Scroll: **0 → 801 px**, Viewport **272 px**, Inhalt **1073 px**.
- Mengen-/Have-Felder auf gültige Host-Klasse und **68 × 38 px**, **2 px** Padding umgestellt; Spinner-Gesamtbreite **116 px**, Buttons **48 × 19 px**, SVGs **14 px**. Die ursprüngliche statische Positionierung stellt die Text-/Tabellenrasterung wieder her. Echter Klick erhöht **10 → 11**, Tastatureingabe setzt **8**.
- Zusätzliche ausgewählte Browse-Listen machten einen bislang nicht sichtbaren Überlauf der Karten-Mengenfelder sichtbar. Auch dort wird der veraltete Host-/size-Vertrag ersetzt: **60 × 26 px** Eingabe, **2 px** Padding, zwei **30-px**-Tasten, insgesamt **120 px**. Die erhaltene Angular-17-Ausgabe bestätigt die native size=4-Breite **60 px**. Desktop-/Mobilprüfung bestätigt Begrenzung innerhalb der Karte; Plus und Tastatureingabe funktionieren. Die neuen ausgewählten Listenbilder wurden nach der Korrektur visuell geprüft.
- Radio-Rahmen, Hover/Fokus und Disabled an das alte Theme angeglichen; **20 × 20 px**, Rahmen **2 px**. Paginator-Icons wieder **14 px**, leere Tag-Labels ohne zusätzlichen Abstand. Button-Abstände wieder über richtungsabhängige Icon-Margins, ursprüngliche Ausrichtung auch bei überlangen mobilen Labels; Toast-Schließen bleibt zentriert.
- ConfirmDialog 18.0.2 verliert seine Style-Weiterleitung und sein `defaultFocus`; sein deklarierter innerer Dialog-ViewChild wird nicht befüllt. Theme stellt **50vw** wieder her, eine auf den eigenen Overlay beschränkte Directive stellt den konfigurierten initialen Fokus einmalig wieder her, auch bei `appendTo="body"`. Nachfolgende Benutzernavigation bleibt frei; Observer/Listener werden entfernt. Vier neue Unit-Tests decken Accept/Reject/Close/None, erneutes Öffnen, Body-Move und Cleanup ab. Beide Verwendungen erhalten die ursprünglichen Check/Times-SVGs; Dialog gemessen **720 px**, Icons **14 × 14 px**, Anfangsfokus **Yes**, Space auf **No** bricht ab. Diese 18.0.2-Workarounds während der nächsten PrimeNG-Stufe neu prüfen.
- Dialog-Hintergründe, Footer-Fluss, Radien und Button-Margins aus dem alten Theme wiederhergestellt. Transferwarnung erhält den ursprünglichen Anfangsfokus ohne automatischen Cancel-Fokus. Abbruch per Tastatur entfernt die Maske.
- Drawer 18 behält nach Öffnen eine Transformation, während 17 sie entfernt. **Nur außerhalb `.ng-animating`** wird die stabile Transformation zurückgesetzt; laufende Öffnungs-/Schließanimationen bleiben erhalten. So werden die Referenzschatten wiederhergestellt. Datei-Dialog-Icons erhalten den fehlenden **8-px**-Abstand. ProgressSpinner verwendet wieder die ursprüngliche vierfarbige Palette **#d62d20 / #0057e7 / #008744 / #ffa700**.

### Vollständige Validierung

- **50 Unit-Tests erfolgreich** (`ui-acceptance-complete-tests.log`). Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich, Exitcode 0; Produktion **2.34 MB**, bestehende Budget-/CommonJS-Warnungen unverändert, Budgets nicht angehoben.
- Reguläre UI-/Extension-Ausgaben vorhanden, Chrome-Manifest byteidentisch, standalone Extension-Entries ohne `webpackChunk`, keine Referenz-Fixture-Marker in regulären JS-Bundles. Produktions-/Entwicklungsoutputs: `artefacts/angular-upgrade/angular-18/ui-acceptance-verified/{production,development}/`.
- Zwei vollständige Abschlussläufe: jeweils **39 Hauptszenarien plus 49 Zusatzbilder**, **56 erfolgreiche Browserprüfungen**, keine aufgezeichneten Browser-/Konsolenfehler oder bekannten NG0100-Meldungen. Enthalten sind die bisherigen 46 Prüfungen plus Mengenbedienung, ConfirmDialog-Fokus/Icons/Abbruch, Transferwarnungsfokus/Abbruch, vertikaler Export mit JSON-Download, exklusive Radio-Auswahl, Copy-Ziele, echter PDF-Download, mobile Tabs und Browse-Mengenfelder auf Desktop/Mobil. JSON enthält **8 Teile**, Version **2.0**; PDF **172.093 Bytes** mit gültigem PDF-Header. Beide Downloads werden aus echten Button-Aktionen erzeugt.
- Bei PDF liest jsPDF die Bild-URLs zusätzlich per XHR. Der anfängliche Offline-Test blockierte diesen Pfad und konnte deshalb keinen Download erzeugen. Das Aufnahme-Script liefert für diese eng begrenzten Bild-URLs dieselben lokalen Ersatzbilder wie für Image-Requests; andere externe Anfragen bleiben gesperrt. Zusätzlich wurde ein Test korrigiert, der anfangs die nicht mehr eingebundene PDF-Komponente ansprach beziehungsweise die bereits ausgewählte PDF-Option wieder abwählte. Die erfolgreichen Abschlussläufe verwenden ausschließlich den tatsächlichen Export-Workflow.
- Renderer **AMD Radeon 8060S / ANGLE Direct3D11**, GPU-Compositing/Rasterization aktiviert und vor/nach beiden Läufen identisch. Die vorherige Software-GPU-Blockade ist aufgehoben. Software-Bilder wurden nicht als Abnahme verwendet, GPU-Schutz und Originalreferenz bleiben unverändert.
- Wiederholung **65/88 PNGs byteidentisch**. 23 andere Bilder unterscheiden sich ausschließlich in jeweils **vier Tabs-Unterstreichungs-Pixeln**; kein Pixel wird ausgefiltert. Zur Originalreferenz **14/39 Hauptbilder byteidentisch**. Alle Zahlen, SHA-256-Prüfsummen, Roh-Differenzen, Grenzen, Messwerte und Browserprüfungen: [angular-18-ui-acceptance-check.json](angular-upgrade-reference/angular-18-ui-acceptance-check.json).

### Bewertete Referenzunterschiede

- Listenübersicht, Settings-Seite und leere Tabellen bleiben auf allen vier Größen pixelgleich. Desktop-Export **4**, Transferfortschritt **4**, Import **25**, Mengenbearbeitung **52** abweichende Pixel; große Layout-/Schattenabweichungen sind korrigiert. Tabs können jeweils vier dieser Pixel ausmachen. Browse verbleibt bei **14** Desktop-/**12** Mobil-Pixeln an den gerundeten Auswahlrahmen; Datei-Dialog bei wenigen Rahmen-Eckpixeln. Kleine Checkbox-Eck-/SVG-Strichunterschiede bleiben in den Rohdaten, bei geprüfter Größe, Farbe und Bedienung.
- ConfirmDialog-Inhalt und Aktionen stimmen mit der Referenz überein. Unter seiner Maske verbleiben **5.003** Pixel im Navigationsschatten, jeweils höchstens **ein RGB-Kanalwert** Unterschied; ursprüngliche Shadow-Werte, Geometrie, Maskenfarbe **rgba(0,0,0,0.32)** und Stapelung sind gemessen unverändert. Dieser begrenzte Compositing-Unterschied wird einzeln dokumentiert, nicht als allgemeine Toleranz verwendet.
- Transferwarnung: Textkante wechselt zwischen LCD-Subpixel- und Graustufenrasterung. Kontrollierter Alt-/Neu-Vergleich mit denselben Farbdaten bestätigt für **alle neun Header-/Body-Spalten** exakt gleiche Positionen, Breiten, Höhen, **16-px-Schrift** und **rgba(0,0,0,0.87)**. Die Tabelle ist in beiden Läufen **830.921875 × 181 px**, Zeile **91 px**, Header **90 px**. Die vollständigen Messwerte stehen im Bericht; die verbleibenden Bildpixel werden nicht ersetzt oder ausgefiltert.
- Settings-EUR: Das ursprüngliche synthetische Bild hatte ein leeres ausgewähltes Label. Mit gültigen EUR-Daten zeigt auch die erhaltene Angular-17-Ausgabe **EUR** im **53-px**-Feld; Angular 18 zeigt denselben gültigen Wert. Save/Reopen und Tastaturbedienung sind erfolgreich. Das leere Fixture-Label wird deshalb nicht künstlich wiederhergestellt.

Logs unter `artefacts/angular-upgrade/angular-18/`: `ui-acceptance-complete-tests.log`, `ui-acceptance-visual-final-3.log`, `ui-acceptance-production-final-3.log`, `ui-acceptance-development-final-3.log`, `ui-acceptance-capture-complete.log`, `ui-acceptance-capture-complete-repeat.log`, `ui-acceptance-comparison.log`. Abschlussbilder: `artefacts/angular-upgrade/visual/angular-18-ui-accepted-complete/` und `angular-18-ui-accepted-complete-repeat/`.

### Jetzt manuell: Abschnitt sichern

```powershell
git add src scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: complete Angular 18 UI acceptance"
```

Keine weitere manuelle Einrichtung für Angular 18 erforderlich. **Nach diesem Commit und `weiter` folgt Angular 19.** Für spätere Paketstufen bleiben die im Upgrade-Plan vorgesehenen Builds, Browser-/Extension-Prüfungen und migrationsabhängigen Anpassungen bestehen.

## Commit-Punkt 25: Angular-19-Pakete und offizielle Migrationen

Ausgangspunkt: **`dfd137f`**, gesicherte Angular-18-UI-Abnahme. Installiert und im Lockfile festgeschrieben: Angular **19.2.25**, CLI/Build-Devkit **19.2.27**, CDK **19.2.19**, NgRx Store/Effects/Operators/Devtools **19.2.1**, Custom Webpack **19.0.1**, PrimeNG/Themes **19.1.4**, Angular Font Awesome **1.0.0**, Zone.js **0.15.1**. Node **20.20.2** und TypeScript **5.5.4** bleiben für diese kompatible Zwischenstufe erhalten. **Die Paket-/Build-Migration ist geprüft; die Angular-19-UI-Abnahme ist noch nicht abgeschlossen.**

### Erfolgreich umgesetzt

- Stabile 19er-Versionen, Engines und Peers über die offizielle npm-Registry geprüft (`artefacts/angular-upgrade/angular-19/metadata.json`). Alle Framework-Pakete ausdrücklich auf 19.2.25 begrenzt. Der erste gruppierte Update-Versuch wollte einzelne Angular-Pakete auf Major 20 auflösen und wurde ohne Änderungen von der Peer-Prüfung gestoppt. Der explizite zweite Versuch besteht diese Prüfung. Kein `--force`, kein `--legacy-peer-deps`.
- `ng update` aktualisiert Paketdateien/Lockfile und führt beide erforderlichen CLI-Migrationen aus, jeweils ohne Konfigurationsänderung. Der optionale Application-Builder-Wechsel bleibt aus: Custom Webpack und beide Extension-Entries bleiben erhalten.
- Nach der Installation unterbrach ein fehlender Modul-Suchpfad im NgRx-Migrationsmodul den Gesamtlauf. Das Devkit ist bereits unter der CLI installiert; die offenen offiziellen Migrationen wurden mit passendem `NODE_PATH`, `--migrate-only`, explizitem `--from`/`--to` und der installierten CLI 19 ausgeführt. Keine zusätzliche Dependency, kein veränderter Bibliothekscode. Der automatische Versionscheck wird für diese historischen Migrationen deaktiviert, nachdem er sonst CLI 22 mit unpassender Node-Anforderung starten wollte.
- Angulars `explicit-standalone-flag` passt **39 Dateien** an: deklarierte Komponenten/Directives erhalten `standalone: false`, bereits eigenständige Deklarationen benötigen kein explizites `true` mehr. NgModules und Zone bleiben erhalten. PendingTasks-/Server-Kontext-Migration ohne Änderungen; CDK-v19-Migration erfolgreich, ohne Änderungen. Store/Effects/Devtools besitzen im Bereich 18.1.1 → 19.2.1 keine anzuwendenden Migrationen; die CLI-Prüfungen laufen erfolgreich durch. Der optionale Initializer-Umbau bleibt aus.
- Ein bestehender Test erkennt eine PrimeNG-19-Regression: Select stoppt Escape auch bei geschlossenem Popup. Die vorhandene `bhSelectEscape`-Directive schließt ein geöffnetes Popup allein und reicht Escape bei geschlossenem Popup vom Elternknoten an den umgebenden Drawer/Dialog weiter. Der Test prüft beide Schritte und ist wieder erfolgreich.
- ConfirmDialog 19.1.4 reicht `style` wieder an Dialog weiter; der globale **50vw**-CSS-Fallback wird entfernt. Die bestehenden Style-Eingänge bleiben erhalten. Der Dialog-Verweis für die native Fokuslogik fehlt weiterhin und deren Selektoren passen nicht zu den aktuellen Klassen. Die begrenzte Fokus-Directive bleibt daher erhalten; Kommentar auf den geprüften 19er-Stand aktualisiert.
- Aufnahme-Script verwendet `.p-togglebutton` statt vorausgesetzter nativer `button`-Elemente in SelectButton. PrimeNG 19 verschiebt Klassen und Handler auf den Host und setzt dort keine Button-Rolle; ein versuchter Rollen-Selektor konnte deshalb ebenfalls nicht auflösen. Die bisherigen fehlgeschlagenen Aufnahmen bleiben unverändert als Diagnoseartefakte erhalten; keine Abschwächung der Bedien-/Geometrieprüfungen.

### Erfolgreiche technische Validierung

- **50 Unit-Tests erfolgreich**, einschließlich Select-Escape und vier ConfirmDialog-Fokus-Tests. Erster Lauf: 49 erfolgreich, ein Escape-Fehler; nach Korrektur alle 50 erfolgreich (`unit-tests-final.log`).
- Produktions-, Entwicklungs- und Referenzbuild erfolgreich, Exitcode 0. Produktion weiterhin **2.34 MB**. Bestehende Budget-/CommonJS-Warnungen sichtbar, Budgets unverändert. Logs unter `artefacts/angular-upgrade/angular-19/`: `production-build.log`, `development-build.log`, `visual-build-final.log`.
- Outputs unter `artefacts/angular-upgrade/angular-19/verified/{production,development}/`: `index.html`, Chrome-Manifest und beide Extension-Entries vorhanden; Manifest byteidentisch zum Quellmanifest; `background.js` und `legocontentscript.js` ohne `webpackChunk`-Runtime-Abhängigkeit; keine Referenz-Fixture-Marker in regulären Root-JS-Bundles. `npm ls --depth=0` ohne Abhängigkeitsfehler. `git diff --check` erfolgreich.
- Vollständiger Offline-Browserlauf `angular-19-foundation-controls`: **56 erfolgreiche Bedienprüfungen, 39 Hauptbilder und 49 Zusatzbilder**, keine aufgezeichneten Browser-/Konsolenfehler oder bekannten NG0100-Meldungen. AMD Radeon 8060S / ANGLE Direct3D11, Compositing/Rasterization aktiviert und Renderer vor/nach dem Lauf identisch. Geprüft sind unter anderem echte JSON-/PDF-Downloads, Auswahl per Maus/Space, Escape in Popup/Drawer, mobile Tabs und Browse-Mengenfelder sowie ConfirmDialog ohne Breiten-Fallback (**720 px**, Fokus **Yes**, Icons **14 px**). Aufnahme-/Vergleichslogs: `browser-capture-controls.log`, `comparison-controls.log`. **35/88 Bilder byteidentisch** zur akzeptierten Angular-18-Ausgabe; die übrigen Rohdifferenzen sind im Bericht erhalten und noch nicht als UI-Abnahme bewertet. Ein Wiederholungslauf folgt nach den Darstellungskorrekturen.

### Noch offen: UI-Abnahme auf Angular 19

Originalreferenz und Angular-18-Abnahme bleiben unverändert. Der [Prüfbericht](angular-upgrade-reference/angular-19-foundation-check.json) enthält unverfilterte Bilddifferenzen zur akzeptierten Angular-18-Ausgabe sowie den aktuellen Browserprüfstand. **`visualAcceptance: false`**; dieser Zwischencommit gibt Angular 20 noch nicht frei.

- Schrift-/Rahmenabweichungen der Browse-Auswahl und größere Höhenabweichungen der vertikalen Export-Auswahl korrigieren. Host-/Nachbarselektoren gegen das neue ToggleButton-DOM abgleichen.
- Spinner-Palette und deaktivierte Ladezustände gegen das neue Theme-/DOM-Verhalten prüfen; kleine SVG-Strichabweichungen separat bewerten.
- Weitere neue Rohdifferenzen untersuchen: Datei-Import nach JSON-/XML-Auswahl (**25.031 / 28.785 Pixel**), Länder-Popup (**16.129**), Copy-Auswahl (**2.409**), Toast-Zustände (**840–848**) und mobiles Browse (**145**). Erfolgreiche Bedienprüfungen allein bewerten diese Bilder noch nicht als visuell gleichwertig.
- Vollständige Angular-19-UI-Abnahme einschließlich mobiler Ansichten und zwei stabiler GPU-Läufe durchführen. Echte LEGO-Konto-/Warenkorbtransfers bleiben außerhalb des Offline-Referenzumfangs.
- Vor Angular 20 auf eine passende Node-22-Runtime wechseln, wie im Plan vorgesehen. Jetzt noch keine manuelle Runtime-/Lizenz-Einrichtung erforderlich.

### Jetzt manuell: Migrationsstand sichern

```powershell
git add package.json package-lock.json src scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "chore: migrate Angular 19 packages and NgModule metadata"
```

Die Umsetzung hält hier am technischen Zwischencommit an. Nach dem Commit und `weiter` folgt die Anpassung und vollständige UI-Abnahme auf Angular 19.

## Commit-Punkt 26: Auswahlgruppen und Spinner auf Angular 19

Ausgangspunkt: **`b4d2dc3`**, gesicherte Angular-19-Paketmigration. Versionen und Lockfile bleiben unverändert. Dieser Abschnitt korrigiert die durch PrimeNG 19 geänderten Rahmen- und Tokenverträge; **die vollständige UI-Abnahme bleibt bis zur Bewertung der übrigen Bilder offen.**

### Erfolgreich umgesetzt

- PrimeNG 19 setzt `.p-togglebutton` direkt auf `p-togglebutton`, während Version 18 ein inneres natives Button-Element verwendete. Die bisherigen Nachbar-/Eckenregeln trafen deshalb nicht mehr. Horizontale SelectButton-Gruppen entfernen die rechte Rahmenkante jetzt direkt am jeweiligen Host; vertikale Export-, Copy/Move- und PDF-Gruppen wenden Rahmen-/Eckenregeln ebenfalls direkt am Host an. Kein pauschaler Schrift- oder Größenumbau: gemessene **16 px / Gewicht 500 / line-height normal** stimmen bereits.
- Die fünf ersten Exportzeilen sind wieder **288 × 42.84375 px**, die letzte **288 × 43.84375 px**, mit exakt aneinanderliegenden Kanten. Copy-Ziele bleiben links ausgerichtet, Label-Einzug **17 px**. Ausgewählte/unausgewählte Zustände sowie Klick und Space werden durch die bestehende Browserprüfung bestätigt.
- ProgressSpinner verwendet in Version 19 `colorOne`, `colorTwo`, `colorThree`, `colorFour` statt der 18er-Namen `color.1` bis `color.4`. Das Preset bindet die ursprüngliche Palette **#d62d20 / #0057e7 / #008744 / #ffa700** an die neuen Tokens.

### Validierung und Bildvergleich

- **50 Unit-Tests** sowie Produktions-, Entwicklungs- und Referenzbuild erfolgreich. Produktion weiterhin **2.34 MB**, bestehende Budget-/CommonJS-Warnungen sichtbar, Budgets unverändert. Reguläre Ausgaben unter `artefacts/angular-upgrade/angular-19/theme-controls-verified/{production,development}/`: Manifest byteidentisch, beide Extension-Entries vorhanden und ohne `webpackChunk`-Runtime-Abhängigkeit, keine Referenz-Fixture-Marker in regulären Root-JS-Bundles.
- Vollständiger erster GPU-Lauf `angular-19-theme-controls`: **56 erfolgreiche Bedienprüfungen, 39 Hauptbilder plus 49 Zusatzbilder**, keine aufgezeichneten Browser-/Konsolenfehler oder bekannten NG0100-Meldungen. Renderer AMD Radeon 8060S / ANGLE D3D11, Compositing/Rasterization aktiviert und vor/nach dem Lauf unverändert. JSON enthält **8 Teile**, PDF-Download **172.093 Bytes** mit gültigem Header. ConfirmDialog-Fokus/Breite, echte Escape-Bedienung, Mengenfelder und mobile Tabs bleiben erfolgreich.
- Zum akzeptierten Angular-18-Lauf jetzt **56/88 Bilder byteidentisch**, zuvor **35/88** im Migrationsstand. Browse ist auf allen vier Viewports byteidentisch; auch Copy-Auswahl ist byteidentisch. Desktop-Export **23.123 → 4**, PDF-Auswahl **26.853 → 4**, Copy-Auswahl **2.409 → 0**, Transferfortschritt **882 → 4**, deaktiviertes Laden **80 → 4** abweichende Pixel. Die jeweiligen vier Restpixel liegen ausschließlich in der bereits dokumentierten Tabs-Unterstreichung; Originalbilder und Rohdifferenzen bleiben unverändert.
- Vollständiger Wiederholungslauf `angular-19-theme-controls-repeat` ebenfalls mit **56 erfolgreichen Prüfungen und 88 Bildern**, ohne aufgezeichnete Browser-/Konsolenfehler. **88/88 PNGs byteidentisch** zum ersten Lauf; GPU-Pipeline in beiden Läufen unverändert. Wiederholungslogs: `theme-controls-capture-repeat.log`, `theme-controls-repeat-comparison.log`. `git diff --check` erfolgreich.

Messwerte, Hashes, unverfilterte Differenzen und Browserprüfungen: [angular-19-theme-controls-check.json](angular-upgrade-reference/angular-19-theme-controls-check.json). Logs unter `artefacts/angular-upgrade/angular-19/`: `theme-controls-tests.log`, `theme-controls-build.log`, `theme-controls-production.log`, `theme-controls-development.log`, `theme-controls-capture.log`, `theme-controls-comparison.log`; Rahmenmessungen `select-inspect-before.log` / `select-inspect-after.log`.

### Noch offen

- Datei-Import nach JSON-/XML-Auswahl (**25.031 / 28.785 Pixel**), Länder-Popup (**16.129**) und Toast-Zustände (**840–848**) untersuchen und korrigieren; dies sind noch nicht freigegebene Unterschiede.
- Kleinere verbleibende SVG-/Rasterungsunterschiede im vollständigen Rohbericht bewerten. Danach vollständige Angular-19-UI-Abnahme dokumentieren. **`visualAcceptance: false`**, Angular 20 beginnt weiterhin erst nach dieser Abnahme und passendem Node-22-Wechsel.

### Jetzt manuell: Zwischencommit

```powershell
git add src/app/shared/theme/brickhunter-preset.ts src/app/parts-list/components docs
git commit -m "fix: restore Angular 19 selection borders and spinner palette"
```

Weitere manuelle Einrichtung ist aktuell nicht erforderlich. Nach dem Commit und `weiter` folgt der nächste UI-Abschnitt auf Angular 19.

## Commit-Punkt 27: Datei-Import und Toast-Hover auf Angular 19

Ausgangspunkt: **`1f0b507`**, gesicherte Auswahlgruppen-/Spinner-Korrektur. Paketversionen und Lockfile unverändert. Die Änderungen betreffen ausschließlich das BrickHunter-Preset.

### Erfolgreich umgesetzt

- FileUpload 19 legt seinen **4-px-Fortschrittsbalken** in den normalen Flex-Fluss und innerhalb des Content-Paddings. Das verschob Datei-Zeile, Textarea und übrige Formularfelder um vier Pixel; der Balken war zusätzlich eingerückt. Das Preset stellt die bisherige absolute Position **top: 0 / left: 0 / width: 100%** im bereits relativ positionierten Content wieder her. Der vorhandene Balkenradius bleibt erhalten; keine Änderung an Datei-Auswahl, Drag/Drop oder Importlogik.
- Toast 18 verwendete zum Schließen ein PrimeNG-Text-Button, Version 19 ein natives Button-Element. Der vorhandene generische Hover-Override hatte gegenüber den Regeln je Meldungstyp zu geringe Spezifität. Abgleich mit der erhaltenen Angular-18-Entwicklungsausgabe bestätigt den tatsächlich wirksamen Text-Button-Hover: **rgba(10, 52, 99, 0.04)**, Icon **#0a3463**. Der begrenzte Toast-Selektor stellt diese beiden Werte wieder her. Geometrie, Meldungsfarben und Schließen-Logik bleiben erhalten.
- Der zunächst verstärkte weiße Hover-Override war nicht der tatsächlich sichtbare alte Button-Hover. Der erste Bildvergleich ließ noch den vollständigen Schließen-Kreis abweichen; mit dem alten Hintergrund verblieben **63 Icon-Pixel**, die anschließend ebenfalls durch Übernahme der alten Hover-Farbe korrigiert wurden. Die Diagnoseaufnahmen bleiben unverändert unter `artefacts/`; Originalreferenzen werden weder ersetzt noch gefiltert.

### Prüfung des verbleibenden Länder-Popups

Die größere Differenz stammt nicht von Breite, Schrift oder Farben: PrimeNG 19 ruft in `Select.onOverlayAnimationStart` für die ausgewählte Option ausdrücklich **`scrollIntoView({ block: 'nearest', inline: 'nearest' })`** auf. Beim Öffnen mit ausgewähltem Germany sieht man deshalb Canada/Switzerland/Czech Republic/Germany statt Austria/Australia/Belgium/Canada im akzeptierten 18er-Bild. Dieser Abschnitt verändert das Scrollverhalten noch nicht. Auswahl per Maus/Tastatur und Save funktionieren; Gleichheit des Öffnungs-/Scrollverhaltens bleibt vor vollständiger Angular-19-UI-Abnahme zu klären.

### Erfolgreiche Validierung

- **50 Unit-Tests** erfolgreich. Produktions-, Entwicklungs- und Referenzbuild mit den endgültigen Styles erfolgreich; Produktion **2.34 MB**, bestehende Budget-/CommonJS-Warnungen sichtbar, Budgets unverändert. Reguläre Outputs unter `artefacts/angular-upgrade/angular-19/import-toast-verified/{production,development}/`: Manifest byteidentisch, Extension-Entries vorhanden und ohne `webpackChunk`-Runtime-Abhängigkeit, keine Referenz-Fixture-Marker in regulären JS-Bundles.
- Vollständiger Lauf `angular-19-import-toast-verified`: **56 erfolgreiche Bedienprüfungen, 39 Hauptbilder und 49 Zusatzbilder**, keine aufgezeichneten Browser-/Konsolenfehler oder bekannten NG0100-Meldungen. AMD Radeon 8060S / ANGLE D3D11, Compositing/Rasterization aktiviert und Renderer vor/nach dem Lauf identisch. Datei-Auswahl, Cancel/Reset, XML-Drop und Toast-Schließen per Maus/Enter erfolgreich; Mengenfelder, Dialoge, mobile Tabs und echte JSON-/PDF-Downloads bestehen weiterhin.
- Zum akzeptierten Angular-18-Lauf **61/88 Bilder byteidentisch**, zuvor **56/88**. JSON-Import **25.031 → 0**, XML-Import **28.785 → 0**, Info-Toast **840 → 0**, Warn-/Fehler-Toast jeweils **848 → 0** abweichende Pixel. Der einzige verbleibende größere Rohunterschied ist das Länder-Popup (**16.129 Pixel**); kleine Tabs-/SVG-Unterschiede bleiben vollständig im Bericht. **`visualAcceptance: false`**.
- Vollständiger Wiederholungslauf `angular-19-import-toast-verified-repeat` ebenfalls mit **56 erfolgreichen Prüfungen und 88 Bildern**, ohne aufgezeichnete Browser-/Konsolenfehler. **88/88 PNGs byteidentisch** zum ersten Lauf; GPU-Pipeline in beiden Läufen unverändert. Logs: `import-toast-capture-verified-repeat.log`, `import-toast-repeat-comparison.log`. `git diff --check` erfolgreich.

Bericht: [angular-19-import-toast-check.json](angular-upgrade-reference/angular-19-import-toast-check.json). Logs unter `artefacts/angular-upgrade/angular-19/`: `import-toast-tests.log`, `import-toast-build-verified.log`, `import-toast-production-verified.log`, `import-toast-development-verified.log`, `import-toast-capture-verified.log`, `import-toast-comparison-verified.log`.

### Jetzt manuell: Zwischencommit

```powershell
git add src/app/shared/theme/brickhunter-preset.ts docs
git commit -m "fix: restore Angular 19 import layout and toast hover"
```

Keine zusätzliche manuelle Einrichtung erforderlich. Nach Sicherung und `weiter` folgt die Prüfung des Länder-Popup-Verhaltens und der verbleibenden kleinen Bildunterschiede; Angular 20 bleibt bis zur vollständigen Angular-19-Abnahme zurückgestellt.

## Commit-Punkt 28: Vollständige automatisierte UI-Abnahme auf Angular 19

Ausgangspunkt: **`b8b83dc`**, gesicherter Datei-Import-/Toast-Stand. Der Auftrag, bis zur kompletten UI-Abnahme dieser Version weiterzufahren, wird ohne weitere Zwischencommit-Pausen ausgeführt. Angular **19.2.25** / PrimeNG **19.1.4** und Lockfile bleiben unverändert. **Die automatisierte Abnahme bestätigt Darstellung und Bedienung im dokumentierten Offline-Referenzumfang; echte LEGO-Konto-/Warenkorbtransfers gehören nicht zu diesem Umfang.**

### Erfolgreich umgesetzt und geprüft

- Länder-Popup öffnet wieder am ursprünglichen Listenanfang. `LocaleComponent` setzt über Selects öffentliches **`onShow`**-Ereignis ausschließlich den Scrollstart des zugehörigen Länder-Listbox-Containers zurück; Zuordnung über `country` und dessen **`aria-controls`**, auch bei `appendTo="body"`. Keine private Select-API, kein Bibliothekspatch, keine wiederholte Scrollsperre. Auswahl, Fokus und nachfolgende Tastaturnavigation bleiben bei Select.
- Neue echte Browserprüfung: Anfangs-Scroll **0**, **End** scrollt nach unten, **Home** zurück auf **0**. Anschließende Auswahl Switzerland/French und Save erfolgreich. Das Länder-Popup ist jetzt byteidentisch zur akzeptierten Angular-18-Aufnahme; zuvor **16.129** abweichende Pixel. Damit sind alle größeren neu entstandenen Angular-19-Bildabweichungen korrigiert.
- Mengen-/Have-Felder, Radio-/Auswahlgruppen, mobile Browse-Karten und Tabs, Dialog-/Drawer-Fokus und Abbruch, Datei-Auswahl/Drop/Reset, Menü-/Checkbox-/Button-Zustände und JSON-/PDF-Downloads bestehen die vollständigen Bedienprüfungen. Die bereits gesicherten Korrekturen aus Abschnitt 25–27 sind im Abschlussbuild enthalten.
- **50 Unit-Tests** sowie Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich. Produktion **2.34 MB**, bestehende Budget-/CommonJS-Warnungen unverändert sichtbar, Budgets nicht angehoben. Outputs `artefacts/angular-upgrade/angular-19/ui-acceptance-verified/{production,development}/`: Manifest byteidentisch, beide eigenständigen Extension-Entries vorhanden und ohne `webpackChunk`-Runtime-Abhängigkeit, keine Referenz-Fixture-Marker in regulären JS-Bundles.
- Vollständiger Abschlusslauf `angular-19-ui-accepted-complete`: **57 erfolgreiche Browserprüfungen, 39 Hauptbilder plus 49 Zusatzbilder**, keine aufgezeichneten Browser-/Konsolenfehler oder bekannten NG0100-Meldungen. AMD Radeon 8060S / ANGLE D3D11, Compositing/Rasterization aktiviert, Renderer vor/nach dem Lauf unverändert. Zum akzeptierten Angular-18-Lauf **62/88 Bilder byteidentisch**; Länder-Popup, Browse aller vier Größen, Import-/Toast- und Auswahlgruppen-Korrekturen bleiben bestätigt.
- Vollständige Wiederholung `angular-19-ui-accepted-complete-repeat` ebenfalls mit **57 erfolgreichen Prüfungen und 88 Bildern**, ohne aufgezeichnete Browser-/Konsolenfehler. **88/88 PNGs byteidentisch**, GPU-Pipeline in beiden Läufen unverändert. Originalreferenz vollständig gegen ihr SHA-256-Inventar geprüft. Abnahmebericht setzt **`visualAcceptance: true`** und **`angular20UiGateSatisfied: true`**; die Angular-19-UI-Abnahme ist damit abgeschlossen. Wiederholungslogs: `ui-acceptance-capture-repeat.log`, `ui-acceptance-repeat-comparison.log`. `git diff --check` erfolgreich.

### Einzelbewertung der Restpixel

- Alle anderen Angular-18-Abweichungen außer der Mengenbearbeitung betreffen jeweils **vier Pixel** in einer **2 × 2** großen Tabs-Unterstreichungsecke. Dateien, Koordinaten und Rohwerte bleiben im Bericht; dieser Rasterungswechsel ist bereits in der Angular-18-Abnahme bewertet. Kein Pixel wird ausgefiltert oder ersetzt.
- Mengenbearbeitung: **zehn Pixel**, begrenzt auf **x=888–890 / y=631–673** an den beiden Pfeilkanten. Die erhaltene Angular-18-Entwicklungsausgabe und die installierten 19er-Icons besitzen exakt gleiche SVG-Pfade und **14 × 14 / viewBox 0 0 14 14**; Pfad-Hashes im Bericht. Browsermessung bestätigt weiße `currentColor`-Icons und 14-px-Abmessungen. Eingaben **68 × 38 px**, Gesamtbreite **116 px**, Plus und Tastatureingabe erfolgreich. Diese konkrete begrenzte Rasterungsabweichung wird akzeptiert, keine pauschale Toleranz.
- Die ursprünglichen Angular-17-/Angular-18-Unterschiede bleiben durch den gesonderten [Angular-18-Abnahmebericht](angular-upgrade-reference/angular-18-ui-acceptance-check.json) bewertet. Der neue Bericht vergleicht jedes Angular-19-Bild mit dieser akzeptierten Ausgabe; das SHA-256-Inventar der Originalreferenz wird unverändert geprüft. Die Abnahme behauptet keine vollständige Byteidentität zur ursprünglichen Angular-17-Referenz.

Abnahmebericht: [angular-19-ui-acceptance-check.json](angular-upgrade-reference/angular-19-ui-acceptance-check.json). Logs unter `artefacts/angular-upgrade/angular-19/`: `ui-acceptance-tests.log`, `ui-acceptance-build.log`, `ui-acceptance-production.log`, `ui-acceptance-development.log`, `ui-acceptance-capture.log`, `ui-acceptance-comparison.log`; zusätzliche Icon-Vertrags-/Geometriemessung `ui-icon-contract.json`, `ui-icon-measurements.json`.

### Jetzt manuell: Abnahme sichern

```powershell
git add src/app/shared/components/locale scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: complete Angular 19 UI acceptance"
```

Keine weitere manuelle Einrichtung für Angular 19 erforderlich. Nach diesem Commit und `weiter` folgen der geplante Node-22-Wechsel und Angular 20. Der Community-Lizenzschlüssel wird weiterhin erst vor dem PrimeNG-22-Setup benötigt.

## Commit-Punkt 29: Node 22 und Angular-20-Grundmigration

Ausgangspunkt: **`0193d3f`**, gesicherte vollständige Angular-19-UI-Abnahme. Angular **20.3.33** / PrimeNG **20.4.0** installiert; **die Angular-20-UI-Abnahme ist noch offen**. Dieser Abschnitt bildet den prüfbaren Paket-/Tooling-Wechsel vor weiteren UI-Korrekturen.

### Erfolgreich umgesetzt

- Separate Node-Runtime **22.23.3**, npm **10.9.9**, aus dem offiziellen Windows-x64-ZIP. SHA-256 **`2b0ff57b049cda1bbcea2240eec20467018713c1efe1f7360c2681859b90ed71`** gegen die offiziellen `SHASUMS256.txt` geprüft. Runtime unter dem ignorierten `tmp/upgrade-runtime/node-v22.23.3-win-x64`; verwendete Befehle aktivieren diese Runtime über den Prozess-PATH. Nachweis `artefacts/angular-upgrade/angular-20/node-runtime.json`.
- Alle Framework-Pakete gemeinsam auf **20.3.33**, CLI/Build-Devkit **20.3.38**, CDK **20.2.14**, Custom Webpack **20.0.0**, NgRx **20.1.0**, Angular Font Awesome **3.0.0**, TypeScript **5.9.3**. Zone.js **0.15.1** und RxJS **7.8.1** bleiben erhalten. Kandidaten anhand offizieller npm-Metadaten geprüft; keine erzwungene Peer-Auflösung und kein `--legacy-peer-deps`.
- Offizielle CLI-/CDK-/Core-/NgRx-Migrationen erfolgreich. CLI ergänzt die bisherigen Dateityp-Suffixe als Schematics-Defaults und setzt `moduleResolution` auf **`bundler`**. Übrige Pflichtmigrationen melden keine nötigen Quellcodeänderungen. Optionale Application-Builder-/Control-Flow-/Router-Signal-Migrationen nicht ausgeführt; Custom-Webpack-Extension-Entries, NgModules und vorhandene Animationen bleiben erhalten.
- PrimeNG 20 verwendet PrimeUIx: **`@primeng/themes` entfernt**, **`@primeuix/themes` 1.2.5** installiert und die beiden Material-/Preset-Imports umgestellt. `ExtendedCSS` ist jetzt String, Funktion oder `undefined`; ein typisierter Helper übernimmt vorhandene Material-CSS korrekt für alle drei Formen. Der nicht mehr gültige `button.root.focusRing.shadow`-Token entfällt; Material definiert Schatten bereits je Farbvariante als `none`, Ringbreite bleibt 0. Die visuelle Wirkung wird im nächsten Abschnitt abgenommen.
- `safe-buffer` konnte im ersten Build den früher indirekt verfügbaren Browser-Polyfill nicht mehr auflösen. **`buffer` 6.0.3** wird deshalb explizit als direkte Abhängigkeit aufgenommen. Der XML-/JSON-Dateiimport besteht anschließend die Browserprüfungen.
- Sortiericons tragen jetzt **`p-datatable-sort-icon`** und rendern direkt als SVG im `p-sorticon`-Host. BrickHunter-Styles und Messselektor angepasst, Host wieder inline. Tabellenkopf **56 px**, Border **rgb(228, 228, 228)**, sechs **14 × 14 px** große Icons mit mittiger Ausrichtung bestätigt. Maus-/Tastatursortierung und Filter bestehen; Messanforderungen nicht gelockert.

### Erfolgreiche technische Validierung

- **`npm ci` erfolgreich**, anschließend **`npm ls --all` mit Exit 0**, keine ungültigen Peer-Abhängigkeiten. **50 Unit-Tests erfolgreich** nach der sauberen Installation.
- Produktions-, Entwicklungs- und visueller Referenzbuild erfolgreich mit dem endgültigen Quellstand. Produktion **2.53 MB**; bestehende 500-kB-Warnschwelle überschritten, 3-MB-Fehlergrenze eingehalten, Budgets unverändert. CommonJS-Warnungen weiterhin sichtbar.
- Reguläre Outputs unter `artefacts/angular-upgrade/angular-20/verified/{production,development}/`: UI-Einstieg, Manifest und beide Extension-Entries vorhanden; Chrome-Manifest byteidentisch, `background.js` und `legocontentscript.js` ohne `webpackChunk`-Runtime-Abhängigkeit. Keine Referenz-Fixture-Marker in regulären JS-Bundles.
- Originale Angular-17-Bilder und Bericht erneut vollständig gegen das SHA-256-Inventar geprüft. Angular-18-/19-Abnahmeberichte unverändert. **`git diff --check` erfolgreich**.

### Offene Angular-20-UI-Abnahme

- Lauf **`angular-20-foundation-verified`** besteht **22 Browserprüfungen**: Kategorien/Filter/Paginator, öffentliche Menüs, JSON-Dateiauswahl und XML-Drop, Import-Reset, Toast-Schließen, Tabellenkopf/Sortierung sowie Select-Auswahl, Nested-Escape, Länder-Home/End und Locale-Save. Bis zum Abbruch **21 Hauptbilder und 16 Zusatzbilder**, keine aufgezeichneten Browser-/Konsolenfehler. D3D11-GPU-Compositing und Rasterization beim Start aktiv; wegen Abbruch kein Abschluss-Renderervergleich.
- Abbruch bei **`danger-text-rest`**: gemessener Hintergrund **rgba(211, 47, 47, 0.12)** statt transparent. Das ist ein offener UI-Befund, kein erfolgreicher Gesamtlauf. Verbleibende Prüfungen wurden nicht ausgeführt; Fokus-/Button-/weitere Theme-Zustände sind im nächsten Abschnitt zu untersuchen.
- **0/37 PNGs byteidentisch** zur vollständig akzeptierten Angular-19-Ausgabe. Alle Rohpixelabweichungen samt Grenzen und Hashes im neuen Grundstandsbericht erhalten; kein Filter und keine pauschale Toleranz. Die Bilder sind ausschließlich ein unvollständiger Diagnosebestand. **`browserSuiteComplete: false`**, **`visualAcceptance: false`**, **`angular21UiGateSatisfied: false`**.
- Die beiden früheren Diagnoseläufe `angular-20-foundation` und `angular-20-foundation-sort-icons` bleiben unverändert erhalten; beide stoppten an der Tabellenkopfprüfung, bevor die Icon-Klassen-/Host-Anpassung abgeschlossen war.

Bericht: [angular-20-foundation-check.json](angular-upgrade-reference/angular-20-foundation-check.json). Metadaten/Logs unter `artefacts/angular-upgrade/angular-20/`: `metadata.json`, `update.log`, `theme-install.log`, `buffer-install.log`, `npm-ci.log`, `npm-ls.log`, `tests.log`, `reference-build.log`, `production.log`, `development.log`, `capture-verified.log`, `comparison.log`.

### Jetzt manuell: Grundmigration sichern

```powershell
git add package.json package-lock.json angular.json tsconfig.json src/app/shared/theme/brickhunter-preset.ts scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "chore: migrate Angular 20 foundation and Node 22 runtime"
```

Für eigene lokale Prüfungen diese Runtime im aktuellen Terminal aktivieren, oder lokal Node **22.23.3** verwenden:

```powershell
$env:PATH="$PWD\tmp\upgrade-runtime\node-v22.23.3-win-x64;$env:PATH"
node --version
```

Die heruntergeladene Runtime wird nicht eingecheckt. Für die Fortsetzung hier ist keine zusätzliche manuelle Einrichtung nötig. Nach dem Zwischencommit und `weiter` folgen die Angular-20-UI-Korrekturen bis zur vollständigen Abnahme; Angular 21 bleibt bis dahin zurückgestellt. Der Community-Schlüssel wird erst vor PrimeNG 22 benötigt.

## Commit-Punkt 30: Vollständige automatisierte UI-Abnahme auf Angular 20

Ausgangspunkt: **`8330bdf`**, gesicherte Grundmigration. Der Auftrag, bis zur kompletten UI-Abnahme dieser Version weiterzufahren, wurde ohne weitere Zwischencommit-Pausen ausgeführt. Angular **20.3.33**, PrimeNG **20.4.0**, PrimeUIx-Themes **1.2.5**, Node **22.23.3** / npm **10.9.9**. **Die Abnahme bestätigt den dokumentierten Offline-Referenzumfang; echte LEGO-Konto-/Warenkorbtransfers gehören weiterhin nicht dazu.**

### Erfolgreich korrigiert

- **Unbeabsichtigter Button-Autofokus:** PrimeNG 20 leitet bei nicht angegebenem Autofokus `undefined` an AutoFocus weiter; diese Directive setzt dann trotzdem das native Attribut. Der erste Löschbutton bekam beim Laden Fokus und damit den roten Fokus-Hintergrund. Eine kleine appseitige Directive gibt eigenen `p-button`-Instanzen über die öffentliche **`buttonProps`**-API den bisherigen Standard `autofocus: false`. Explizites `[autofocus]="true"` bleibt wirksam. Zwei neue Unit-Tests und eine echte Browserprüfung sichern beide Fälle; keine Änderung an Bibliotheksdateien.
- **Icons und Buttonbreiten:** Integration **3.0.0** brachte bereits Font-Awesome-SVG-Core 7 mit einer Standardbreite von 1.25 em mit; der Importbutton wurde beispielsweise sechs Pixel breiter. Die ebenfalls für Angular 20 veröffentlichte Integration **2.0.1** verwendet SVG-Core **6.7.2**. Lockfile angepasst, der im Plan separat vorgesehene Font-Awesome-7-Wechsel bleibt zurückgestellt. Keine Änderung an den verwendeten Glyphen.
- **Tabs und Switches:** Das bisherige Flex-Layout der Tabs und deren transparente Liste wiederhergestellt. PrimeNG 20 verlegt den Switch-Root auf den Komponentenhost; die vier Switch-Verwendungen erhalten den alten äußeren Inline-Kontext, damit insbesondere die Affiliate-Schalter wieder gleich ausgerichtet sind. Disabled-Diagnose nutzt jetzt die öffentliche Forms-API **`setDisabledState(true)`**, statt ein Signal-Input als normale Eigenschaft zu überschreiben. Maße und Anforderungen unverändert: **44 × 16 px**, Handle **24 × 24 px**, Offset **0/24 px**, Disabled-Opacity **0.38**; Maus, Space und Label-Bindung bestehen.
- **Toast und Bestätigungsicons:** Öffentlicher Toast-Message-Slot stellt den bisherigen Icon-Wrapper und die Textanordnung wieder her; die eingebauten Schließen-Events und Meldungsverwaltung bleiben bei Toast. Alle eigenen Check-/Times-/Severity-Templates nutzen nun die öffentlichen **`svg[data-p-icon]`**-Selektoren. Die alten `<CheckIcon>`-/`<TimesIcon>`-Tags renderten in Version 20 keine SVGs mehr. Bestätigung weiterhin **720 px**, initial **Yes**, zwei **14 × 14 px** große Icons; No per Space, Toast-Schließen per Maus/Enter und Erhalt anderer Meldungen erfolgreich.
- **Drawer und Dialoge:** Neue Schließen-Klassen berücksichtigt; beim Drawer sitzt die Klasse auf dem `p-button`-Host, die Styles treffen ausdrücklich dessen natives Button. Wieder **40 × 40 px**, Icon **14 × 14 px**, bisherige Farben sowie Hover-/Fokuszustände. Footer-Padding wieder **16 px** statt 24 px. Stabilen Transform-Fix von **`p-drawer-active`** auf **`p-drawer-open`** umgestellt; Animationen bleiben erhalten, Schatten und Textdarstellung stimmen wieder. Die bestehende ConfirmDialog-Fokuskorrektur bleibt nötig, da die Bibliothek die nativen Fokusziele weiterhin nicht zuverlässig auflöst; ihr Close-Selektor und Testfixture sind auf Version 20 angepasst.
- **Locale-Dialog:** PrimeNG 20 fokussiert zuerst den Content statt wie zuvor den Footer. Der eigene Dialog setzt seinen bisherigen Anfangsfokus über öffentliche Inputs wieder ausdrücklich auf **Save**: `focusOnShow: false`, Save mit `autofocus: true`. Neue Browserprüfung bestätigt den Anfangsfokus; danach Country/Language, Home/End und Persistenz weiterhin erfolgreich.
- **Mengenbearbeitung:** Neue Table-Regel entfernte die horizontalen Abstände bearbeiteter Zellen. Gemessene **2 px / 16 px** wiederhergestellt; damit stimmt die gesamte Spaltenaufteilung wieder. Quantity/Have **68 × 38 px**, Padding **2 px**, Gesamtbreite **116 px**, Plus **10 → 11**, Tastatureingabe **8**. Beide Pfeilpfade byteidentisch zum gesicherten 19er-Paket; vier gerenderte Icons **14 × 14 / viewBox 0 0 14 14**, weißes `currentColor` bestätigt.
- **Spinner und Datei-Import:** Der auf den Host verlegte Spinner nahm im Flex-Container selbst automatische Seitenränder an; ein äußerer Inline-Wrapper erhält wieder die bisherige Position im Fortschrittsdialog und die Baseline kleiner Tabellen-Spinner. FileUpload 20 fügt auch für JSON/XML einen Thumbnail-Platz und einen Pending-Badge ein. Diese beiden neuen Elemente werden ausschließlich im eigenen JSON/XML-Import ausgeblendet; Badge-Host-Styles erfordern dort einen begrenzten `!important`-Override. Dateiname, Größe, Remove, Cancel/Reset und XML-Drop bleiben bedienbar und entsprechen wieder den Referenzbildern.

### Vollständige Validierung

- **`npm ci` und `npm ls --all` erfolgreich**, keine ungültigen Peer-Abhängigkeiten. **52 Unit-Tests erfolgreich** nach der sauberen Installation und den endgültigen UI-Korrekturen. Produktions-, Entwicklungs- und Referenzbuild erfolgreich; Produktion **2.50 MB**, bestehende Budget-/CommonJS-Warnungen sichtbar, Budgets unverändert.
- Reguläre Outputs `artefacts/angular-upgrade/angular-20/ui-acceptance-verified/{production,development}/`: Einstieg und beide Extension-Entries vorhanden; Chrome-Manifest byteidentisch, `background.js` und `legocontentscript.js` ohne `webpackChunk`-Runtime-Abhängigkeit. Keine Referenz-Fixture-Marker in regulären JS-Bundles.
- Abschluss **`angular-20-ui-accepted-complete`**: **59 erfolgreiche Browserprüfungen**, **39 Hauptbilder plus 49 Zusatzbilder**, keine aufgezeichneten Browser-/Konsolenfehler oder bekannten NG0100-Meldungen. Alle bisherigen 57 Prüfungen plus zwei neue Fokusprüfungen bestehen. Menü-/Overlay-Cleanup, Checkbox-/Radio-/Auswahlgruppen, Import/Export, echte JSON-/PDF-Downloads, mobile Browse-Mengen und Tabs eingeschlossen. AMD Radeon 8060S / ANGLE D3D11, Compositing/Rasterization aktiviert, Renderer vor/nach dem Lauf unverändert.
- Vollständige Wiederholung **`angular-20-ui-accepted-complete-repeat`** ebenfalls mit **59 erfolgreichen Prüfungen und 88 Bildern**, ohne aufgezeichnete Browser-/Konsolenfehler und mit unveränderter GPU-Pipeline. **80/88 PNGs byteidentisch** zwischen den beiden Läufen; die übrigen acht unterscheiden sich ausschließlich in der bekannten **Vier-Pixel-Tabs-Ecke**. Diese konkrete Restvariation bleibt im Bericht, keine Behauptung vollständiger Byte-Reproduzierbarkeit.
- Zur akzeptierten Angular-19-Ausgabe **78/88 Bilder byteidentisch**. Alle größeren neu entstandenen Abweichungen sind korrigiert. Der Bericht setzt **`visualAcceptance: true`** und **`angular21UiGateSatisfied: true`**. Originalreferenz erneut vollständig gegen SHA-256-Inventar geprüft; frühere Abnahmeberichte unverändert. `git diff --check` erfolgreich.

### Einzelbewertung der Restpixel

- **Tabs:** Je betroffener Aufnahme exakt vier Pixel in einer **2 × 2** großen Unterstreichungsecke bei **x=179–180**. Dateinamen, y-Koordinaten, Hashes und maximale Kanalabweichungen sind für den Vergleich mit Angular 19 und für die Wiederholung vollständig erfasst. Es handelt sich um die bereits dokumentierte begrenzte Tabs-Rastervariation; kein Pixel wird ausgefiltert oder ersetzt. Auch die Wiederholung wird ausschließlich für diese konkret begrenzten Pixel bewertet.
- **Inline-Editing:** Exakt **16 Pixel** an den vier äußeren Ecken von vier ungecheckten **18 × 18 px** großen Checkboxen, **2-px-Border / 2-px-Radius**. Koordinaten **x=110/127**, **y=645/662, 736/753, 827/844, 918/935**. Jeder RGB-Kanal weicht nur um **1** ab, Alpha bleibt identisch. Alle alten/neuen RGBA-Werte stehen im Bericht. Geometrie und sämtliche Checkbox-Maus-/Tastatur-/Disabled-Prüfungen bestehen; diese konkrete Randrasterung wird akzeptiert, keine allgemeine Toleranz.
- Zur Diagnose wurde `0193d3f` in einem ignorierten Ordner separat gebaut. Alle fünf nachgemessenen Angular-19-Zustände waren **byteidentisch zu ihren gesicherten Abnahmebildern**. Die Originalbilder und -berichte wurden dabei weder ersetzt noch geändert. Frühere Angular-17-/18-/19-Restunterschiede bleiben in ihren eigenen Abnahmeberichten bewertet; keine Behauptung vollständiger Byteidentität zur ursprünglichen Angular-17-Ausgabe.

Abnahmebericht: [angular-20-ui-acceptance-check.json](angular-upgrade-reference/angular-20-ui-acceptance-check.json). Nachweise unter `artefacts/angular-upgrade/angular-20/`: `ui-npm-ci.log`, `ui-npm-ls.log`, `ui-tests.log`, `ui-build.log`, `ui-production.log`, `ui-development.log`, `ui-accepted-capture.log`, `ui-accepted-repeat-capture.log`, `ui-acceptance-comparison.log`, `ui-acceptance-finalization.log`, `ui-icon-contract.json`, `ui-icon-measurements.json`, `ui-checkbox-corner-pixels.json`, `live19/measurements.json`, `live20/measurements.json`. Diagnose-/frühere unvollständige Läufe bleiben unverändert unter `artefacts/` erhalten.

### Jetzt manuell: Angular-20-Abnahme sichern

```powershell
git add package.json package-lock.json src scripts/upgrade/capture-visual-reference.cjs docs
git commit -m "fix: complete Angular 20 UI acceptance"
```

Keine zusätzliche manuelle Einrichtung für die Fortsetzung erforderlich. Nach diesem Commit und `weiter` kann Angular 21 beginnen. Der Community-Lizenzschlüssel wird weiterhin erst vor dem PrimeNG-22-Setup benötigt.


## Commit-Punkt 31: Angular-21-Grundmigration und erste Regressionserfassung

Ausgangspunkt **`2fb4c9b`**, vollständige gesicherte Angular-20-UI-Abnahme. Der Arbeitsstand war sauber. Die aktuelle Etappe sichert die neue Paket-/Compilerbasis samt offiziellen Migrationen; **Angular-21-UI-Abnahme und Freigabe für Angular 22 sind noch nicht abgeschlossen**.

### Erfolgreich umgesetzt

- Offizielle Registry-Metadaten erneut geprüft: Framework/Compiler/Localize und CLI/Build-Devkit **21.2.25**, CDK **21.2.14**, Custom Webpack **21.1.0**, NgRx Store/Effects/Operators/Devtools **21.1.1**, PrimeNG **21.1.10**, PrimeUIx-Themes **2.0.3**, Angular Font Awesome **4.0.0**. Node **22.23.3** / npm **10.9.9**, TypeScript **5.9.3**, Zone.js **0.15.1**, RxJS **7.8.1** bleiben erhalten. Versionen reproduzierbar im Lockfile. Keine Verwendung von `--force` oder `--legacy-peer-deps`.
- `ng update` mit expliziten Zwischenversionen installiert alle 21 betroffenen direkten Pakete. CLI-Migrationen erfolgreich, `tsconfig` verwendet weiterhin ES2022; redundante explizite `lib`-Liste entfernt. Custom-Webpack-Builder und Extension-Entries erhalten, optionalen Application-Builder-Wechsel nicht ausgeführt.
- Wie bei Angular 19 unterbrach ein fehlender NgRx-Modul-Suchpfad den Gesamtlauf nach der Installation und den CLI-Migrationen. Alle noch offenen offiziellen CDK-/Core-/NgRx-Migrationen mit dem bereits installierten CLI-Devkit über `NODE_PATH`, `--migrate-only` und explizitem `--from`/`--to` erfolgreich nachgeholt. Kein zusätzlicher Paket-Workaround und keine Bibliotheksdateien geändert. Logs je Paket erhalten.
- Angular 21 liefert die Control-Flow-Umstellung als reguläre Migration: **25 Templates** inklusive Inline-Templates auf `@if`/`@for` umgestellt; vorhandene TrackBy-Funktion der eigenen Teileansicht erhalten. Keine eigenständige Signals-/Standalone-Architekturmigration.
- Offizielle Bootstrap-Migration ergänzt **`provideZoneChangeDetection()`** für Hauptanwendung und lokalen Referenzeinstieg über `applicationProviders`. Zone.js-Polyfills bleiben erhalten. Damit wird der neue zoneless Standard ausdrücklich überschrieben und das bisherige Änderungsverhalten bewahrt.
- PrimeNG-Menü verwendet nun CSS-Motion: Der eigene Window-Scroll-Listener wird **sofort beim Aufruf von hide** entfernt, statt bis zum verzögerten Schließen-Ereignis weiterzulaufen. Der Lifecycle-Test wartet auf das tatsächliche `onHide`-Ereignis; `NoopAnimationsModule` beendet CSS-Animationen nicht. Erwartungen für genau ein Schließen-Ereignis und Listener-Cleanup bleiben bestehen.

### Validierung

- Sauberes **`npm ci`** und **`npm ls --all`** erfolgreich. Installiert 1081 Pakete; npm meldet weiterhin Audit-Funde (32), kein pauschales `audit fix` ausgeführt.
- Abschließender Testlauf nach sauberer Installation und Lifecycle-Testanpassung: **52 Unit-Tests erfolgreich**. Frühere fehlgeschlagene Diagnoseläufe bleiben in den Logs, werden nicht als Abnahme gezählt.
- **Produktions-, Entwicklungs- und Referenzbuild erfolgreich**. Produktionsbundle **2.58 MB**, bestehende 500-kB-Warnschwelle überschritten, unveränderte 3-MB-Fehlergrenze eingehalten. CommonJS-Warnungen weiterhin sichtbar. Produktions-/Entwicklungsoutputs unter `artefacts/angular-upgrade/angular-21/verified/`.

- Reguläre Builds: Einstieg, Chrome-Manifest und beide Extension-Entries vorhanden; Manifest byteidentisch, Background/Content-Script ohne `webpackChunk`-Runtime-Abhängigkeit. Keine Referenz-Fixture-Marker in regulären JS-Bundles. Originalreferenz gegen SHA-256-Inventar unverändert bestätigt; `git diff --check` erfolgreich.
- Erster und abschließender Browserlauf reproduzieren denselben Drawer-Timeout. Abschlusslauf **`angular-21-foundation-verified`** enthält **16 erfolgreiche Teilprüfungen, 21 Hauptbilder plus 11 Zusatzbilder**, keine bis zum Abbruch aufgezeichneten Browser-/Konsolenfehler. **0/32 Bilder byteidentisch** zur Angular-20-Abnahme; ungefilterte Differenzen und Hashes im Bericht, noch nicht visuell akzeptiert. Start-Renderer AMD Radeon 8060S / ANGLE D3D11 mit aktiviertem Compositing/Rasterization; wegen Abbruch kein Abschluss-Renderer erfasst und keine Behauptung eines vollständigen stabilen GPU-Laufs.
- Nachweise: `npm-ci.log`, `npm-ls.log`, `update.log`, `migrate-*.log`, `production-verified.log`, `development-verified.log`, `reference-verified.log`, `tests-lifecycle-verified.log`, `capture-initial.log`, `capture-verified.log`, `foundation-comparison.log`.

### Noch offen für die Angular-21-UI-Etappe

- **Drawer-Maske:** Nach Speichern/Schließen der Einstellungen bleibt `.p-drawer-mask.p-overlay-mask-leave-active` bestehen und blockiert den nächsten Settings-Klick. Der Referenzlauf beendet sich hier mit Timeout. Ursache und Korrektur der neuen CSS-Motion-/Masken-Lifecycle-Verknüpfung einschließlich reduzierter Bewegung prüfen; kein Wegklicken oder Entfernen der Maske durch das Testskript.
- **Font Awesome:** Integration 4.0.0 ist die einzige geprüfte stabile Version mit Angular-21-Peer und bringt SVG-Core 7 mit Standardbreite 1.25 em mit. Den bereits bei Angular 20 festgestellten Breitenunterschied jetzt appseitig über die öffentliche Styling-API ausgleichen und alle verwendeten SVGs prüfen. CSS-/Glyphenpakete und Fonts der Version 6 weiterhin erhalten; der vollständige Iconpaket-Wechsel bleibt ein eigener Abschnitt.
- **Animationen:** Die alten `showTransitionOptions`/`hideTransitionOptions` des eigenen Menü-Wrappers werden von PrimeNG 21 ignoriert; bisherige Dauer/Easing auf CSS-Motion übertragen. Den Drawer-Transform-Fix mit `ng-animating` auf die neue Enter-/Leave-Klassenlogik abstimmen, Animationen erhalten.
- Danach **alle 59 Browserprüfungen, 88 Bilder, ungefilterten Vergleich zum akzeptierten Angular-20-Stand und vollständige Wiederholung** abschließen. `visualAcceptance` und `angular22UiGateSatisfied` bleiben im Bericht ausdrücklich **false**. Offline-Fixtures ersetzen weiterhin keine echten LEGO-Konto-/Warenkorbtests.

Quellen: [Angular-Kompatibilität](https://angular.dev/reference/versions), [Angular zoneless / Zone-Provider](https://angular.dev/guide/zoneless), [PrimeNG-21-Migration und CSS-Animationen](https://primeng.dev/migration/v21). Registry-Metadaten und Migrations-/Installations-/Build-/Testlogs unter `artefacts/angular-upgrade/angular-21/`; [Grundprüfungsbericht](angular-upgrade-reference/angular-21-foundation-check.json). Frühere Abnahmeberichte und Originalreferenzen bleiben unverändert.

### Jetzt manuell: Grundmigration sichern

```powershell
git add package.json package-lock.json tsconfig.json src docs
git commit -m "chore: migrate Angular 21 foundation"
```

Keine zusätzliche manuelle Einrichtung nötig. Nach diesem Zwischencommit und `weiter` folgen die Angular-21-UI-Korrekturen; Angular 22 erst nach vollständiger Abnahme. Community-Lizenzschlüssel weiterhin erst vor PrimeNG 22.

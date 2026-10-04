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
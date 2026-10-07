# Paket- und Audit-Abschluss nach Angular 22

Stand: **7. Oktober 2026, Commit-Punkt 39**. Grundlage ist die Paketkombination nach Commit-Punkt 38; dieser lag zu Beginn noch uncommitted im Arbeitsbaum. Beide Etappen bleiben getrennt dokumentiert. Nachweise: [Paket-/Auditbericht](angular-upgrade-reference/post-angular22-packages-audit-check.json), [Fortschrittsprotokoll](angular-upgrade-progress.md).

## Direkte Pakete und tatsächliche Nutzung

Alle **45 verbliebenen direkten Dependencies/DevDependencies** wurden mit ihrer gelockten Version und `latest` gegen die offizielle npm-Registry geprüft. Engines und Peers müssen zur festgelegten Node-/Angular-Kombination passen; ein höheres Major allein ist kein Upgrade-Ziel. Angular 22.2.1, PrimeNG 22.1.2, TypeScript 6.0.3, NgRx 22 und die bereits abgenommenen Anwendungsbibliotheken bleiben erhalten.

| Paket | Ergebnis |
| --- | --- |
| `@types/chrome` | **0.0.260 → 0.3.4**. Produktionscompiler prüft den bestehenden Extension-Code mit aktuellen Typen. `AppComponent.setPermission` bekommt den öffentlichen Permissions-Typ; der ungültige Name `host_permission` entfällt, LEGO-Hostzugriff wird über `origins` beschrieben. Die bislang nicht aufgerufene Methode wird dadurch nicht automatisch gestartet. |
| `jasmine-core` / `@types/jasmine` | **5.1.2 → 5.13.0** / **5.1.4 → 5.1.15**. Jasmine 6.3.0 wurde mit passenden Typen tatsächlich erprobt, scheitert jedoch an Zone.js 0.15.1: dessen Patch erwartet die nicht mehr verfügbare interne Laufzeitreferenz `jasmine.QueueRunner`. Diagnose erhalten, keine Bibliotheksdateien angepasst. Jasmine 7 ist laut Hersteller mit Karma/Zone inkompatibel. |
| `karma-jasmine` | **5.1.0**, weiterhin neueste stabile Version. Der Adapter hängt selbst von Jasmine 4 ab und würde trotz aktueller Root-Dependency den alten Runner laden. Der dokumentierte npm-Override `karma-jasmine.jasmine-core: "$jasmine-core"` bindet ihn an die tatsächlich geprüfte Root-Version **5.13.0**. |
| `karma` / HTML-Reporter | **6.4.2 → 6.4.4** / **2.1.0 → 2.3.0**, kompatible Peers. Der aktualisierte `tmp`-Pfad behebt zugleich die bisherigen ChromeHeadless-/Temp-Verzeichnisprobleme im beobachteten Testlauf. |
| Chrome-Launcher / Coverage | **3.2.0 / 2.2.1**, bereits neueste stabile Versionen; kompatible aktuelle Paketmetadaten bestätigt. |
| PostCSS / Autoprefixer / Prettier | **8.5.28 → 8.5.29**, **10.6.0 → 10.6.1**, **3.2.5 → 3.9.9**. Engines/Peers passen. Kein pauschales Neuformatieren des Projekts. |
| `@angular/animations` | Entfernt. Keine Imports/Animationsmodule mehr seit der CSS-Motion-Migration; einziger verbliebener Peer von platform-browser ist ausdrücklich optional. Zone und die vorhandene CSS-Motion bleiben erhalten. |
| `@ngrx/effects` / `@ngrx/operators` | Entfernt. Keine Verbraucher in Quellen oder übrigen Dependency-/Peer-Einträgen. Store und Store-Devtools bleiben wegen vorhandener Nutzung erhalten. |
| `stream` | Entfernt. SAX importiert Node-Stream nur innerhalb eines try/catch mit eigenem Fallback. xml2js verwendet den SAX-Parser und keine SAXStream/createStream-API; App-Code hat keinen Stream-Verbraucher. Tests und tatsächlicher XML-Download/Wiederimport bestätigen den Browserpfad ohne dieses Paket. |
| `timers` | **0.1.1** ausdrücklich beibehalten und exakt gepinnt. Der indirekte Import `require('timers').setImmediate` in xml2js steht nicht in dessen Dependency-Metadaten. Ein diagnostischer Build nach Entfernung wies ihn nach; endgültige Tests/Builds enthalten das Paket wieder. |
| `buffer` / `string_decoder` | Vorher nachgewiesene Browser-/XML-Abhängigkeiten bleiben erhalten. Keine neuen allgemeinen Node-Polyfills eingeführt. |

Quellen: [Jasmine-6-Migration und Karma-Override](https://jasmine.github.io/upgrade-guides/6.0), [Jasmine-7-Einschränkung für Karma/Zone](https://jasmine.github.io/upgrade-guides/7.0), [Chrome Permissions API](https://developer.chrome.com/docs/extensions/reference/api/permissions). Konkrete aktuelle Registry-Metadaten stehen vollständig im Prüfbericht.

## Audit-Ergebnis und verbleibender Befund

**Vorher: 24 Paketmeldungen (21 high, 2 moderate, 1 low). Nachher: 12 high, keine moderate/low/critical.** Gezielt innerhalb der zulässigen Abhängigkeitsspannen aktualisiert: `brace-expansion` 1.1.21, `minimatch` 3.1.5, `flatted` 3.4.4, `follow-redirects` 1.16.1, `lodash` 4.18.1, `socket.io` 4.8.4, `engine.io` 6.6.11, `socket.io-parser` 4.2.7, `tmp` 0.2.7 und die verwendeten `ws`-Pfade ab 8.21.3. Der alte Cookie-Pfad entfällt mit dem Engine.IO-Update. Vollständige Lockänderungen und Vorher-/Nachherpfade sind im Bericht enthalten.

Die zwölf verbliebenen Meldungen sind **ein direkter Advisory-Befund plus elf weitergereichte Paketmeldungen**:

| Pfad / Paketgruppe | Befund und Einordnung |
| --- | --- |
| `braces` 3.0.3 | **GHSA-vfj7-8cjw-p6xm / CVE-2026-93687**, Stack-Erschöpfung durch tief verschachtelte Muster. Alle veröffentlichten Versionen bis 3.0.3 betroffen; am Prüftag kein veröffentlichter Patch. |
| Karma → braces; Karma → chokidar 3.6.0 → braces | Test-/Dateibeobachtungswerkzeuge. Weitergereichte Meldungen für Karma, chokidar, karma-jasmine und HTML-Reporter. |
| webpack-dev-server → http-proxy-middleware → micromatch → braces | Entwicklungsserver-/Pattern-Verarbeitung. Weitergereichte Meldungen für diese drei Elternpakete. |
| Angular-Builder / Custom Webpack | Weitere Elternmeldungen für custom-webpack, build-angular, build-webpack und `@angular/build`, die die genannten Werkzeuge referenzieren. |

Der [offizielle Advisory-Eintrag](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) bestätigt die fehlende gepatchte Version. Die von npm angebotenen Force-"Fixes" würden unter anderem auf Angular-Build-Devkit 0.1002.1, Custom Webpack 19 oder Karma 4 zurückgehen. Das passt nicht zur festgelegten und geprüften Angular-22-Kombination. Diese Downgrades und ein eigener Library-Patch wurden nicht umgesetzt.

**Produktionsrelevanz nachgewiesen:** Die erzeugte Webpack-Statistik umfasst **839 Module in 14 Chunks**, einschließlich Main, Polyfills, Background und Content-Script. Für jedes Modul wurde die tatsächliche Paketzugehörigkeit aus dem Ressourcenpfad bestimmt; Loader-Pfade und verschachtelte Babel-Runtime-Pakete wurden korrekt von ihrem übergeordneten Build-Paket unterschieden. **Keines der zwölf Audit-Pakete ist in der gebündelten Extension enthalten.** Ein bloßes `npm audit --omit=dev` würde wegen des als Dependency deklarierten Custom-Webpack nicht dieselbe Einordnung liefern.

**Technische Einschränkung bleibt offen:** `braces` ist weiterhin in den installierten Build-/Testwerkzeugen verwundbar. Die fehlende Extension-Bundle-Relevanz behebt diese Tooling-Lücke nicht. Build-/Testmuster und Proxy-Konfigurationen müssen aus vertrauenswürdigen Projektdateien stammen; Entwicklungs-/Testserver nur lokal betreiben. Diese Nutzungsvorgaben ersetzen keinen Patch. Für eine spätere vollständige Behebung ist eine kompatible veröffentlichte Korrektur der betroffenen Toolchain erforderlich; alternativ wäre eine gesonderte Builder-/Runner-Migration nötig. Deren Architekturwechsel gehört nicht zur aktuellen Paketprüfung.

Punkt **1 ist abgeschlossen**. Punkt **2 ist vollständig bewertet und soweit kompatibel möglich behoben**; die technische Behebung des dokumentierten Restbefunds bleibt offen. Das Ergebnis ist keine Freigabe der noch ausstehenden echten Chrome-/Firefox-/Kontenabnahme.

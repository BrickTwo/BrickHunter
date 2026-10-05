# BrickHunter: Angular- und PrimeNG-Upgrade

## Umsetzungsstatus

Die Umsetzung läuft auf `feature/upgrade-code-base`, aktuell Angular **20.3.33** / PrimeNG **20.4.0** mit Node **22.23.3**. Commit-Punkte 1–29 sind gesichert, zuletzt **`8330bdf`**. **Die vollständige automatisierte Angular-20-UI-Abnahme ist in Abschnitt 30 abgeschlossen:** saubere Installation, gültige Peer-Abhängigkeiten, drei Builds, 52 Unit-Tests und zwei GPU-Läufe mit jeweils 59 Browserprüfungen und 88 Bildern erfolgreich. 78/88 Bilder byteidentisch zur akzeptierten Angular-19-Ausgabe; Wiederholung 80/88 byteidentisch, übrige acht ausschließlich mit der einzeln dokumentierten Vier-Pixel-Tabs-Ecke. Alle größeren neuen UI-Abweichungen korrigiert; sechzehn Checkbox-Eckpixel mit maximal einem RGB-Schritt gesondert bewertet. Originalreferenz per SHA-256 unverändert bestätigt, keine pauschale Pixeltoleranz. Details: [Fortschrittsprotokoll](angular-upgrade-progress.md), [Angular-20-Abnahmebericht](angular-upgrade-reference/angular-20-ui-acceptance-check.json). Abschnitt 30 als Zwischencommit sichern; danach kann Angular 21 beginnen. Die Einrichtung des Community-Lizenzschlüssels bleibt vor dem PrimeNG-22-Setup erforderlich. Die Abnahme umfasst den dokumentierten Offline-Referenzumfang, keine echten Konto-/Warenkorbtransfers.

Planungsstand vor Beginn der Umsetzung: 4. Oktober 2026. Planung auf Basis des Quellcodes, des vorhandenen Lockfiles, offizieller Migrationsdokumentation und live abgefragter npm-Metadaten. Zum Planungszeitpunkt wurden keine Abhängigkeiten installiert, keine Anwendung geändert und keine Builds oder Laufzeittests ausgeführt. Die genannten Versionen sind Kandidaten mit geprüften Paketmetadaten, noch keine durch Tests bestätigte Projektkombination. Ergebnisse der begonnenen Umsetzung stehen im oben verlinkten Fortschrittsprotokoll.

## Festgelegtes Ziel

Ziel ist Angular 22.2.1 mit PrimeNG 22.1.2 Community bei unverändertem Aussehen und Verhalten. Der Nutzer hat die Community-Ausgabe ausdrücklich gewählt. Dazu gehören Farben, Typografie, Icons, Abstände, Tabellenhöhe, Filter, Dialoge, Navigation und responsive Ansichten. Patchversionen zu Beginn der Umsetzung erneut prüfen und anschließend reproduzierbar im Lockfile festschreiben.

Die Umsetzung verwendet die Community-Ausgabe. Die Einrichtung des laut Installationsdokumentation vorgesehenen PrimeUI-Lizenzschlüssels gehört zum Setup. Komponenten und Theme-Preset aus dem Community-Umfang wählen und dessen Nutzungsbedingungen bei der Einrichtung berücksichtigen. Die Wahl der Ausgabe ist damit entschieden.

Quellen: [PrimeNG 22 Migration](https://primeng.dev/migration/v22), [Installation](https://primeng.dev/installation).

## Festgestellter Ausgangszustand

- Lockfile: Angular/CLI 17.1.2, PrimeNG 17.5.0, NgRx Store 17.1.0, TypeScript 5.3.3.
- NgModule-Anwendung mit `BrowserAnimationsModule`, Zone.js und Karma/Jasmine.
- `angular.json` verwendet `@angular-builders/custom-webpack:browser`. `custom-webpack.config.ts` erzeugt zusätzlich `background.js` und `legocontentscript.js` mit `runtime: false`.
- Chrome und Firefox besitzen unterschiedliche Manifest-V3-Dateien. Der konfigurierte Build kopiert derzeit das Chrome-Manifest. Firefox nennt noch Mindestversion 109.
- `src/styles.scss` lädt ein eigenes `src/assets/theme/theme.css`, die alte `primeng/resources/primeng.min.css`, PrimeFlex-Sass und Font Awesome.
- Eigene PrimeFlex-Breakpoints bis 3000 px, direkte `.p-*`-Overrides und zahlreiche `::ng-deep`-Regeln koppeln das UI an das bisherige Komponenten-DOM.
- `src/app/shared/components/menu/menu.component.ts` enthält einen PrimeNG-Menü-Nachbau samt `MenuItemContent`, verwendet selbst den Selektor `p-menu` und importiert `PrimeNGConfig`, `DomHandler`, `ConnectedOverlayScrollHandler`, `OverlayService` und `ZIndexUtils`.
- Der Farbfilter erzeugt HTML-Labels und Farbfelder, die das eigene Menü über `bypassSecurityTrustHtml` rendert. Dies ist eine konkrete Anpassung, die bei einer Ablösung erhalten werden muss.
- `BrowsePartsDataViewComponent` implementiert eigene Sichtbarkeits-/Scrollberechnungen mit 200 px Spaltenbreite und 328 px Zeilenhöhe. Diese Ansicht ist eigene Logik, keine Unterklasse von PrimeNG DataView.
- Vorhandene Specs enthalten unter anderem generierte Erzeugungstests; eine funktionierende Regressionsabdeckung ist daraus nicht ableitbar.

## Versionsmatrix

| Paketgruppe | Zielkandidat | Maßnahme / Kompatibilität |
| --- | --- | --- |
| Angular Framework, CLI, Build-Devkit, Compiler, Localize | 22.2.1 | Zusammen aktualisieren; alle Framework-Pakete konsistent halten. |
| Angular CDK | 22.2.1 | Erfüllt PrimeNGs Anforderung `^22.1.0`. |
| PrimeNG Community | 22.1.2 | Verlangt Angular-Pakete ab 22.1 innerhalb Major 22. Community-Lizenzschlüssel im Setup einrichten. |
| `@primeuix/themes` | 3.0.1 | Aktueller Kandidat für das neue BrickHunter-Preset; ein im Community-Umfang verfügbares Preset verwenden. |
| `@angular-builders/custom-webpack` | 22.0.1 | Passender Compiler-CLI-Peer für Angular 22; vorhandene Extension-Entries testen. |
| NgRx Store/Effects/Devtools | 22.x | Store 22.0.1 bestätigt; Effects/Devtools mit gleicher Release-Linie und eigenen Peers prüfen. Ungenutzte Pakete nur nach Nutzungsprüfung entfernen. |
| TypeScript | 6.0.x | Compiler-CLI 22.2.1 verlangt `>=6.0 <6.1`; nicht das aktuelle TypeScript 7.0.2 installieren. |
| Node.js | 24.x, mindestens 24.15.0 | Zielruntime festschreiben; für frühe Migrationsstufen separate kompatible Runtime nutzen. |
| RxJS / Zone.js / tslib | 7.8.2 / 0.16.3 / 2.8.1 | RxJS und Zone erfüllen die abgefragten Angular-22-Peers. Zone während der Migration bewusst beibehalten. |
| Angular Font Awesome | 5.1.0 | Verlangt Angular 22. |
| Font Awesome Free / Solid SVG Icons | 7.3.1 | Gemeinsam prüfen; vorhandenes CSS nennt explizit `Font Awesome 6 Free`, zusätzlich liegen vendorte Font-Dateien unter assets. Glyphen und Schriftdateien abgleichen. |
| ngx-translate Core / HTTP Loader | 18.0.0 | Peers unterstützen Angular >=18; vorhandene Nutzung und Provider-/Loader-API prüfen. |
| PrimeFlex | 4.0.0 | Im Zuge von PrimeNG 18 umstellen; eigene Breakpoints und Theme-Variablen erhalten. |
| ng-lazyload-image | 9.1.3 | Bereits aktuelle Version; breite Angular-Peers sind kein Laufzeitnachweis. ScrollHooks und die eigene Sichtbarkeitslogik gezielt testen. |
| Dexie | 4.4.6 | Eigenes Upgrade-Paket mit Tests vorhandener IndexedDB-Daten; Schema nicht beiläufig verändern. |
| jsPDF / AutoTable | 4.2.1 / 5.0.8 | AutoTable erlaubt jsPDF 4; alle drei PDF-Aufrufstellen und erzeugte Dokumente prüfen. |
| xml2js | 0.6.2 | Bereits aktuell; Browser-Bundling und XML-Roundtrip prüfen. |
| stream / timers | Nutzung prüfen | Keine automatische Installation neuer Polyfills; direkte und transitive Verwendung sowie Bundle-Anforderungen ermitteln. |
| Karma/Jasmine, Typdefinitionen, PostCSS, Autoprefixer, Prettier | Neueste kompatible stabile Versionen | Pro Paket Engines/Peers prüfen. Test-Runner-Wechsel ist für dieses Upgrade nicht erforderlich. |

Die Versionen wurden über die öffentlichen npm-Endpunkte `https://registry.npmjs.org/<paket>/latest` geprüft; ausgenommen explizit als noch zu prüfen bezeichnete Paketgruppen. Beispiele: [Angular Core](https://registry.npmjs.org/@angular/core/22.2.1), [Compiler CLI](https://registry.npmjs.org/@angular/compiler-cli/22.2.1), [PrimeNG](https://registry.npmjs.org/primeng/22.1.2), [Custom Webpack](https://registry.npmjs.org/@angular-builders/custom-webpack/22.0.1), [Font Awesome Angular](https://registry.npmjs.org/@fortawesome/angular-fontawesome/5.1.0). Ergänzend: [Angular-Kompatibilität](https://angular.dev/reference/versions).

PrimeFlex wird laut Hersteller nicht mehr aktiv weiterentwickelt. Version 4 dient hier dazu, bestehende Layoutklassen weiterzuverwenden. Ein späterer Ersatz ist gesonderte Arbeit, damit dieses Upgrade keinen kompletten Layoutumbau erfordert. Quellen: [PrimeFlex-Kompatibilität](https://v19.primeng.org/guides/primeflex), [PrimeFlex-Projektstatus](https://primeflex.org/).

## Umsetzung in überprüfbaren Etappen

### 1. Referenzzustand und Paketprüfung

1. Upgrade-Branch anlegen und Ausgangsstand als wiederherstellbaren Commit sichern.
2. Mit einer zu Angular 17 passenden Node-20-Runtime `npm ci`, Produktions-/Entwicklungsbuild und vorhandene Tests ausführen. Bereits bestehende Fehler getrennt erfassen.
3. Reproduzierbare Testdaten für Teilelisten, Suchergebnisse, Farben, leere Zustände und große Listen anlegen; Netzwerkantworten für UI-Vergleiche stabilisieren.
4. Screenshots bei identischen Browsern, Zoomstufen und Viewports erstellen: Navigation, Suche/Filter, Farbmenü, Teilekarten, Tabellen mit Inline-Editing, Einstellungen, Dialoge, Meldungen und Transfers. Auch Hover, Fokus, Auswahl und deaktivierte Zustände erfassen.
5. Paketmatrix um sämtliche direkten Dependencies/DevDependencies ergänzen; Peer-Abhängigkeiten, Engines und tatsächliche Nutzung prüfen. Keine Konflikte über `--force` oder `--legacy-peer-deps` verdecken.

Ergebnis: reproduzierbare Ausgangsartefakte, bekannte bestehende Fehler, UI-Referenzen und freigegebene Zielkombination.

### 2. Angular stufenweise aktualisieren

Reihenfolge: neuester 17er-Patchstand → 18 → 19 → 20 → 21 → 22. Pro Major die Angular-/CLI-Migrationen mit `ng update` anwenden und CDK, PrimeNG, NgRx, Custom-Webpack sowie weitere Angular-gebundene Pakete auf kompatible Zwischenversionen bringen. Erst nach grünem Build und gezielten Regressionstests die nächste Stufe beginnen.

- Die PrimeNG-Arbeit aus Etappe 3 beim Übergang 17 → 18 durchführen, nicht bis zum Abschluss aller Angular-Upgrades aufschieben.
- Node 20 nur für die frühen historischen Zwischenstände nutzen; nach Angular 18/19 auf einen passenden Node-22-Stand wechseln, für das Endziel Node >=24.15 innerhalb Major 24 festschreiben. TypeScript und Zone pro Stufe aus den jeweiligen Kompatibilitätsbereichen wählen.
- NgModules zunächst erhalten. Beim geänderten Standalone-Standard kontrollieren, dass bestehende deklarierte Komponenten durch die Migration passend markiert werden.
- Zone-basierte Änderungserkennung ausdrücklich erhalten; Migrationen und neue Defaults auf Auswirkungen für Chrome-Callbacks, RxJS und die eigene OnPush-Menükomponente prüfen.
- Bestehende Templates und Bibliotheken auf entfernte/deprecated APIs prüfen. Control-Flow-, Signals- und Standalone-Umbauten nur durchführen, soweit benötigt; größere Architekturänderungen separat planen.
- Nach jeder Stufe Lockfile, Build-Ergebnis und Commit sichern.

Quelle: [Angular Update-Anleitung](https://angular.dev/update).

### 3. PrimeNG-API und Darstellung gemeinsam migrieren

Der wichtigste Übergang ist PrimeNG 17 → 18: Das alte CSS-Theme wird durch ein Token-basiertes Theme ersetzt. Ein Standardpreset allein wird das bisherige BrickHunter-UI nicht exakt reproduzieren.

1. Bestehende Designwerte aus Theme und SCSS erfassen: insbesondere Primärfarbe `#0a3463`, Roboto, Hintergründe, Rahmen, Radien, Schatten und sehr kompakte Tabellenzellen.
2. Ein eigenes BrickHunter-Preset auf der neuen Theme-Architektur aufbauen; bei Zwischenversionen deren Theme-Paket verwenden, spätestens im Ziel auf `@primeuix/themes` umstellen.
3. Die alte `primeng/resources/primeng.min.css`-Einbindung entfernen und alte Theme-Regeln kontrolliert ablösen. Alte und neue vollständige Themes nicht dauerhaft gleichzeitig laden.
4. `PrimeNGConfig`/Initialisierung auf die aktuelle Konfiguration mit `providePrimeNG` übertragen, einschließlich Ripple. Das ist auch mit bestehender NgModule-Struktur zu lösen.
5. `.p-*`-Selektoren und `::ng-deep` gegen das neue DOM abgleichen. Design Tokens bevorzugen; verbleibende Overrides auf BrickHunter-Komponenten begrenzen. CSS-Layer-Reihenfolge ausdrücklich festlegen.
6. Tatsächliche Root-Schriftgröße messen. PrimeNG 22 unterscheidet 16-px-Presets und 14-px-Kompatibilitätsvarianten; passend zur Referenz wählen, keine pauschale Größenänderung.
7. Automatischen Dark Mode so konfigurieren, dass die bestehende helle Darstellung erhalten bleibt. Font-Awesome-Ersetzungen, SVG-Icons und vendorte Font-Dateien visuell vergleichen.

Konkrete API-Arbeiten anhand der vorhandenen Imports/Templates:

| Bisher | Migration |
| --- | --- |
| Dropdown | Select; ausgewählter Wert, Filter und Item-Templates prüfen |
| Calendar | DatePicker; Datum, minDate und Datumsformat erhalten |
| InputSwitch | ToggleSwitch; Modell und Change-Event prüfen |
| OverlayPanel | Popover; Positionierung, Scrollen und Klick außerhalb prüfen |
| Sidebar | Drawer; bisheriges Einstellungs-Panel nachbilden |
| TabMenu | Tabs ohne Panels; `activeItem`-Logik in der Teileliste übertragen |
| Messages | Einzelne Message-Komponenten über die Meldungsliste rendern |
| DeferModule | Bei Nichtnutzung entfernen; tatsächliche pDefer-Verwendung durch passendes Angular-Verhalten ersetzen |
| pTemplate | Slot-spezifische Template-Referenzen nach jeweiliger Komponenten-API verwenden |
| CamelCase-Selektoren | Aktuelle Kebab-Case-Selektoren verwenden |
| styleClass | Nur bei Komponenten mit entsprechend geändertem Host-Verhalten auf class umstellen |
| pButton-Directive-Inputs | Aktuelles Icon-/Label-Markup anwenden; nicht blind die API von p-button-Komponenten umschreiben |

Quellen: [Theming-Umstellung](https://primeng.dev/migration/v19), [Entfernte Komponenten und API-Änderungen bis v20](https://primeng.dev/migration/v20), [v22-Änderungen](https://primeng.dev/migration/v22).

### 4. Eigene Komponenten gezielt behandeln

**Eigenes Menü:** Zuerst Sonderverhalten dokumentieren: HTML-/Farb-Labels, Icon-Stile, Badges, Gruppen, Sichtbarkeit, Disabled-Zustände, Commands, Router-Links und Popup-Verhalten. Dann mit dem aktuellen öffentlichen Menü und dessen Item-Templates einen begrenzten Prototyp erstellen. Wenn Aussehen und Verhalten vollständig erreichbar sind, die Kopie durch einen BrickHunter-Wrapper ersetzen. Farbkästchen und Beschriftungen über Angular-Templates rendern.

Wenn der öffentliche Menüumfang nicht ausreicht, den eigenen Nachbau bewusst behalten und aktualisieren: Konfiguration, DOM-/ZIndex-Helfer und Lifecycle-Aufrufe einzeln prüfen und möglichst durch öffentliche APIs oder eigene kleine Implementierungen ersetzen. Einen eigenen Selektor wie `bh-menu` verwenden, damit er nicht mit PrimeNGs `p-menu` kollidiert. Alte Klassen nur für den eigenen Stil gezielt behalten.

PrimeNG 21 verwendet CSS-basierte Animationen. Die Kopie besitzt weiterhin eigene Angular-Animationen; deshalb `BrowserAnimationsModule` nicht allein aufgrund des PrimeNG-Upgrades entfernen. Bei Umstellung die daran gekoppelten Aufrufe für Overlay-Anhängen, Positionierung, Events und Listener-Cleanup erhalten. Quelle: [PrimeNG 21 Migration](https://primeng.dev/migration/v21).

Abnahme Menü: Farbfilter, Navigation und Aktionsmenüs; Tastatur und Fokus; Popup öffnen/schließen; Klick außerhalb; Scroll/Resize; Z-Index über Tabellen/Dialogen; Listener werden beim Zerstören entfernt.

**Eigene Teileansicht:** Die festen 200-/328-px-Annahmen und CSS-Größen zusammen prüfen. Zuerst die Referenzabmessungen wiederherstellen. Falls dynamische Messung erforderlich wird, diese Änderung isolieren und mit großen Listen, schmalem Fenster, Resize und verzögert geladenen Bildern testen. Keine leeren Scrollbereiche oder springenden Zeilen akzeptieren.

### 5. Extension-Build und übrige Pakete absichern

- Custom-Webpack auf passendem Major beibehalten. Eine Umstellung auf den Application-/esbuild-Builder würde eine eigene Lösung für die zusätzlichen Extension-Entries brauchen und ist kein notwendiger Bestandteil dieses Upgrades.
- Produktionsausgabe kontrollieren: `background.js`, `legocontentscript.js`, Manifest, UI-Einstieg und lokale Assets liegen an den erwarteten Orten. Keine unbeabsichtigten Runtime-/Shared-Chunks voraussetzen, die vom Manifest nicht geladen werden.
- Service Worker und Content-Script im richtigen Browserkontext laden; Nachrichten zwischen UI, Background und LEGO-Seite testen. CSP und lokal gebündelte Scripts/Fonts prüfen.
- Chrome- und Firefox-Pakete explizit erzeugen und separat testen. Firefox-Mindestversion 109 gegen Angulars aktuelle Browserunterstützung abgleichen; Mindestversion bei Bedarf dokumentiert anheben.
- Dexie separat aktualisieren: bestehende Datenbank öffnen, Daten lesen/ändern, Extension-Neustart sowie Upgrade mit einem kopierten Bestandsprofil testen. Auch Background und Legacy-Migration einbeziehen.
- PDF-Pakete zusammen aktualisieren und Tabellen, Bilder, Umlaute, Seitenumbrüche und Summen vergleichen. XML-Import/-Export mit Roundtrip testen.
- Lazy-Loading samt ScrollHooks prüfen. Ein Ersatz durch Browser-APIs kommt nur infrage, wenn Gleichwertigkeit nachgewiesen ist.
- Font Awesome 7 in eigenem Schritt aktualisieren und alle verwendeten Glyphen kontrollieren. Falls sichtbare Abweichungen entstehen, Korrekturen ausdrücklich im UI-Vergleich abnehmen.

### 6. Abnahme und Abschluss

- Saubere Installation mit `npm ci`; `npm ls` ohne ungültige Peer-Abhängigkeiten.
- Produktions- und Entwicklungsbuild erfolgreich; bestehende Budgetgrenzen nicht ohne Begründung erhöhen.
- Vorhandene Tests lauffähig machen und gezielte Tests für Menü/Overlay, Filter, Tabellenbearbeitung, große Teilelisten und Persistenz ergänzen.
- Screenshot-Vergleiche mit stabilen Daten in identischen Browser-/Viewport-Konfigurationen: keine unbeabsichtigten Änderungen an Geometrie, Typografie, Icons oder Farben. Rendering-Unterschiede nur mit begründeter Toleranz behandeln.
- Chrome und Firefox: Installation, Start, Background-Neustart, Content-Script, Messaging, Suche, Filter, Import/Export, Einstellungen und Transferablauf erfolgreich. Automatisierte Tests verwenden Testdaten und lösen keine echten Käufe aus.
- Bestehende Nutzerdaten bleiben erhalten. Backup-/Restore-Verfahren für das Testprofil dokumentieren; Paket-Downgrade allein ist kein Datenbank-Rollback.
- Zielversionen, Node-/npm-Version, Buildbefehle und bekannte Einschränkungen dokumentieren. Erst nach erfolgreicher Abnahme ein Release-Artefakt erstellen.

## Empfohlene Arbeitspakete

1. Referenzen, Paketmatrix und Community-Setup.
2. Angular/PrimeNG 18 einschließlich neuem Theme, PrimeFlex 4 und erstem Menü-Abgleich.
3. Angular/PrimeNG 19–20 einschließlich entfernter Komponenten.
4. Angular/PrimeNG 21–22 einschließlich Templates, Animationen und finalem Menü.
5. Weitere npm-Upgrades, Icon-Abgleich und Extension-Pakete.
6. Visuelle/funktionale Abnahme und Dokumentation.

Jedes Arbeitspaket bekommt einen eigenen prüfbaren Commit beziehungsweise PR. Der größte voraussichtliche Aufwand liegt im originalgetreuen Theme und im eigenen Menü, gefolgt von den Extension- und Scroll-Regressionsprüfungen. Eine belastbare Zeitschätzung ist erst nach Referenzbuild und dem Menü-/Theme-Prototyp sinnvoll.

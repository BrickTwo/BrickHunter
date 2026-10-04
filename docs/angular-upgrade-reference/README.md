# Visuelle Angular-17-Referenz

Erstellt am 4. Oktober 2026 vor Paketmigrationen, Anwendungscode aus Commit `66d2d4d`. **39 PNGs** liegen in [angular-17/](angular-17/). Der [Bericht](angular-17/report.json) enthält Szenarien, gemessene CSS-Werte, Viewports, Paketversionen, abgefangene Bildrequests und bekannte Ausgangsfehler. [SHA-256-Inventar](angular-17/sha256.json) für alle PNGs und den Bericht. Diese Referenzen werden mitcommittet; temporäre Builds und fehlgeschlagene Aufnahmeläufe bleiben im ignorierten `artefacts/`-Verzeichnis.

## Aufnahmebedingungen

- Angular 17.1.2 / PrimeNG 17.5.0; Node 20.20.2 / npm 10.8.2; Playwright 1.62.1; Headless Edge 154.0.0.0 unter Windows.
- Viewports: **1440 × 1000**, **390 × 844**, **2560 × 1440**, **3200 × 1440**; Zoom 100 %, Device Scale Factor 1; Locale de-DE; Zeitzone Europe/Zurich; feste Browserzeit 4. Oktober 2026, 12:00 Uhr Zürich.
- Jeder Ausgangszustand startet die App vollständig neu. API-Antworten, Listen und Farben sind synthetisch; Suchantworten werden zeitversetzt geliefert. Bilder von Teilen werden durch die vorhandene lokale Placeholder-Grafik ersetzt. Die bereits verwendete PayPal-Grafik wird aus [fixtures/donate.gif](fixtures/donate.gif) mit Originalabmessungen geliefert; Quelle: [PayPal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif). Keine externen Requests werden weitergeleitet.
- Die Test-App verwendet eine separate localhost-Origin auf Port 4317, einen temporären Browserkontext und einen In-Memory-Datenbankadapter. Nur dort wird localStorage zurückgesetzt. Hintergrund, Bestandsprofil und echte Warenkörbe werden nicht verwendet. Transfermethoden sind ausschließlich im Referenz-Einstieg ersetzt; der Fortschrittsdialog zeigt simuliert Schritt 2.
- Animationen sind für die Referenz deaktiviert. Nach Laden, Fonts und Angular-Verarbeitung folgt eine feste Beruhigungszeit. In zwei vollständigen Aufnahmeläufen waren **alle 39 PNGs byteidentisch**.

## Erfasste Zustände

Bei allen vier Viewports: Navigation/Listenübersicht, Importdialog, befüllte Tabelle, leere Tabelle, Einstellungen und Teileansicht. Zusätzliche Interaktionszustände wurden bei 1440 × 1000 aufgenommen:

| Bereich | Beispiele |
| --- | --- |
| Listen und Navigation | [Übersicht](angular-17/1440x1000-lists.png), [Importdialog](angular-17/1440x1000-import-dialog.png) |
| Tabelle | [Befüllt](angular-17/1440x1000-table.png), [Inline-Editing](angular-17/1440x1000-table-inline-edit.png), [Auswahl](angular-17/1440x1000-table-selection.png), [Leer](angular-17/1440x1000-empty-table.png), [Laden/deaktiviert](angular-17/1440x1000-table-loading-disabled.png) |
| Dialoge und Einstellungen | [Listeneinstellungen](angular-17/1440x1000-list-settings.png), [Export](angular-17/1440x1000-export-dialog.png), [Löschbestätigung](angular-17/1440x1000-delete-confirmation.png), [Sprache/Land](angular-17/1440x1000-settings.png) |
| Meldungen und Transfer | [Erfolgsmeldung](angular-17/1440x1000-success-message.png), [Transferfortschritt](angular-17/1440x1000-transfer-progress.png), [Transferwarnung](angular-17/1440x1000-transfer-warning.png) |
| Suche und Filter | [Teile](angular-17/1440x1000-browse.png), [Farbmenü](angular-17/1440x1000-color-menu.png), [Hover](angular-17/1440x1000-filter-hover.png), [Fokus](angular-17/1440x1000-filter-focus.png), [Leere Suche](angular-17/1440x1000-empty-search.png) |
| Große Listen | [1000 Teile](angular-17/1440x1000-large-search.png), [Nach Scrollen](angular-17/1440x1000-large-search-scrolled.png) |
| Responsive | [390 px](angular-17/390x844-browse.png), [2560 px](angular-17/2560x1440-browse.png), [3200 px](angular-17/3200x1440-table.png) |

## Gemessene Referenzwerte

- Root-Schriftgröße **16 px**, Body Roboto **16 px**, Überschrift 24 px.
- Primärfarbe der Buttons **rgb(10, 52, 99)** / `#0a3463`; Buttonhöhe in der Teileansicht ca. **41.844 px**, Radius **4 px**.
- Teilekartenhöhe **320 px** mit **8 px** Innenabstand; die Scrolllogik verwendet einschließlich äußerem Abstand **328 px**. Kartenbreite im 1440-px-Viewport ca. **196.391 px**.
- Teiletabellenzeilen **91 px**; Navigationsleiste **60 px** breit.
- Body-Hintergrund **rgb(240, 240, 240)**, Karten weiß. Weitere Schatten, Maße und Stile stehen pro Szene im Bericht.

## Bestehende Einschränkungen

Der vollständige Ausgangslauf enthält **9 protokollierte NG0100-Konsolenmeldungen** aus `PartsTableComponent`: Beim ersten Rendern befüllter Tabellen ändern Sichtbarkeitsberechnungen nach dem View-Check einen Templatewert von false auf true. Das ist ein bestehender Lifecycle-Fehler, kein Ergebnis eines Paketupgrades. Nur dieser konkret geprüfte Fehlertyp wird unter `knownConsoleErrors` erfasst; andere Browser-/Konsolenfehler führen zum Abbruch. Die neuen Tabellentests laden wie eine asynchrone Datenquelle zunächst die leere Ansicht und dann die Daten.

Die vorhandene schmale Darstellung hat horizontale Überbreite; der Transferwarndialog schneidet bei 1440 px Tabelleninhalt ab. Die Aufnahmen dokumentieren diese Ausgangssituation. Zum Ausgangsstand gehörte außerdem das Tastaturproblem mit deaktivierten/ausgeblendeten Menüeinträgen; dieses wurde inzwischen in der Menüvorbereitung behoben. Die übrigen Fehler sind bei der Migration separat zu behandeln.

Die Referenzen sichern die UI mit kontrollierten Testdaten. Sie sind noch keine Abnahme echter Extension-Kommunikation, IndexedDB-Upgrades, PDF/XML-Dateien oder echter Teilebilder. Weitere Browserprofile und konkrete Interaktionen werden im jeweiligen Upgradeabschnitt ergänzt.

## Reproduktion

Der Upgrade-Zwischenstand Angular **17.3.12** / CLI **17.3.17** / CDK **17.3.10** wurde ebenfalls geprüft: **39 von 39 PNGs byteidentisch**, alle Szenarienmessungen identisch, keine neuen Browser-/Konsolenfehler. Die einzelnen SHA-256-Vergleiche stehen in [angular-17-patch-check.json](angular-17-patch-check.json). Die Ausgangsbilder unter `angular-17/` bleiben die Referenz für weitere Stufen.

Auch die Menüvorbereitung (`bh-menu`, strukturierte Farbtemplates, Tastaturkorrektur) bleibt visuell identisch: **39 von 39 PNGs** und alle Szenarienmessungen unverändert, keine neuen Browser-/Konsolenfehler. Siehe [menu-preparation-check.json](menu-preparation-check.json). Der zuvor dokumentierte Fehler beim Überspringen deaktivierter/ausgeblendeter Menüeinträge wurde in diesem Abschnitt korrigiert und ist durch Regressionstests abgedeckt; die übrigen Ausgangsprobleme bestehen fort.

Die **Angular-/PrimeNG-18-Grundmigration ist noch nicht visuell abgenommen**. Alle 39 Szenarien laufen ohne neue Browser-/Konsolenfehler, aber alle 39 Bilder unterscheiden sich von der Referenz. Erste Token-Werte stimmen bereits; unter anderem Buttonhöhe und Inhaltsabstände müssen noch angeglichen werden. Messwerte und Prüfsummen: [angular-18-foundation-check.json](angular-18-foundation-check.json). Die ursprünglichen Bilder bleiben unverändert die Abnahmebasis.

Der erste Theme-Geometrieabschnitt auf Angular 18 stellt die gemessene **41.84375-px-Buttonhöhe**, Karteninhaltsabstände, verbundene Filterfelder und Bestseller-Tag-Farben/-Schrift wieder her. Alle 39 Szenarien laufen ohne neue Browserfehler; weiterhin **0/39 byteidentische Bilder** und daher keine vollständige visuelle Abnahme. Ein öffentlicher Menü-Wrapper wurde isoliert funktional geprüft, aber noch nicht produktiv eingebunden oder visuell freigegeben. Abschließende Aufnahmen: `artefacts/angular-upgrade/visual/angular-18-theme-geometry-verified/`; Prüfsummen/Messwerte: [angular-18-theme-geometry-check.json](angular-18-theme-geometry-check.json). Der Bericht misst jetzt zusätzlich Card-Content, Tag, InputGroup/Addon und Tabellenkopf.

Aus dem Repository-Stamm mit Node 20 und Playwright 1.62.1. Playwright wird hier aus dem vorhandenen Codex-Runtime-Bundle geladen; für andere Rechner muss `NODE_PATH` auf eine entsprechende separate Toolinstallation zeigen. `CHROME_BIN` kann den passenden Browserpfad vorgeben. Für Pixelvergleiche denselben Edge-/Windows-Stand und die aufgeführten Aufnahmebedingungen verwenden.

Der folgende Auswahlkomponenten-Abschnitt gleicht Kategoriezeilen, SelectButton-/ToggleSwitch-Farben, Checkbox-Rahmen, Disabled-Buttons und die Paginator-Geometrie/-Schrift an. **39 Tests**, **39 Bildszenarien** und vier echte Auswahl-/Toggle-/Seitenschalter-Prüfungen sind erfolgreich. Die vollständige UI-Abnahme bleibt offen (**0/39 byteidentische Bilder**). Bilder: `artefacts/angular-upgrade/visual/angular-18-selection-controls-accepted-section/`; Bericht: [angular-18-selection-controls-check.json](angular-18-selection-controls-check.json).

```powershell
$env:PATH = "$PWD\tmp\upgrade-runtime\node-v20.20.2-win-x64;$env:PATH"
$env:NODE_PATH = 'C:\Users\Tobias\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
npm.cmd run build:visual-reference
node scripts/upgrade/capture-visual-reference.cjs angular-17-new-run
```

Ausgabe: `artefacts/angular-upgrade/visual/angular-17-new-run/`. Der Szenarienname muss neu sein: Das Skript überschreibt keine vorhandenen Referenzen. Der reguläre `build`-/`build-dev`-Einstieg bleibt `src/main.ts`; nur die explizite Konfiguration `development,visual-reference` verwendet `src/testing/visual-main.ts`.

## Tabs-/Message-Abschnitt auf Angular 18

TabMenu und Messages sind durch die öffentlichen Tabs-/Message-Komponenten ersetzt. **44 Tests**, drei Builds, **39 Bildszenarien** und vier Browser-Interaktionsprüfungen sind erfolgreich. Im Abschlusslauf wurden **keine Konsolen-/Browserfehler und keine bekannten NG0100-Meldungen** aufgezeichnet; dies gilt für die kontrollierten Szenarien dieses Laufs. Die Referenzbilder bleiben unverändert, die vollständige UI-Abnahme bleibt offen (**0/39 byteidentische Bilder**). Unter anderem FileUpload, Overlay-/Icon-/Button-Zustände und die produktive Menüintegration stehen noch aus. Bilder: `artefacts/angular-upgrade/visual/angular-18-tabs-messages-final/`; Bericht: [angular-18-tabs-messages-check.json](angular-18-tabs-messages-check.json). Zusätzliche Messungen erfassen Tabs, Messages und Dialog-Header/-Footer.
## Produktiver Menü-Wrapper auf Angular 18

`bh-menu` verwendet jetzt PrimeNGs öffentliche Menu-Komponente für Farbfilter und Sammelaktionen; der eigene Overlay-/Tastatur-Nachbau und der isolierte Prototyp sind entfernt. **40 Tests**, drei Builds, **39 Bildszenarien** und sieben Browser-Interaktionsprüfungen sind erfolgreich, ohne aufgezeichnete Konsolen-/Browserfehler. Die Testzahl berücksichtigt die Zusammenführung der alten Menü- und Prototyp-Suiten. **37/39 PNGs** sind byteidentisch zum Tabs-/Message-Zwischenstand, weiterhin **0/39** zur ursprünglichen Angular-17-Referenz. Gemessenes Farb-Popup: **200 × 64 px**, Aktion **200 × 48 px**, Farbfeld **13 × 13 px**. Vollständige visuelle Abnahme einschließlich Menü-Zuständen bleibt offen. Bilder: `artefacts/angular-upgrade/visual/angular-18-public-menu-verified/`; Bericht: [angular-18-public-menu-check.json](angular-18-public-menu-check.json).
## FileUpload-/Drawer-Abschnitt auf Angular 18

FileUpload-Header und leerer Dropbereich sowie Drawer-Schließen-Buttons und Maskenfarbe/-Animation sind angeglichen. Die lokale Dateiverarbeitung liest nur akzeptierte Auswahlen. **44 Tests**, drei Builds, **39 Bildszenarien**, zwei zusätzliche Datei-Aufnahmen und zehn Browser-Interaktionsprüfungen sind erfolgreich, ohne aufgezeichnete Konsolen-/Browserfehler. Choose misst **108.390625 × 41.84375 px**; die tatsächliche Drawer-Maskenfarbe ist **rgba(0, 0, 0, 0.32)**. Vollständige visuelle Abnahme bleibt offen (**0/39 byteidentische Bilder**); zusätzlich sind leichte Rasterunterschiede zwischen wiederholten Desktop-Aufnahmen vor der endgültigen Pixelabnahme zu untersuchen. Die Referenzbilder bleiben unverändert. Bilder: `artefacts/angular-upgrade/visual/angular-18-fileupload-verified/`; Bericht: [angular-18-fileupload-check.json](angular-18-fileupload-check.json).

## Toasts und Aufnahme-Renderer auf Angular 18

Toast-Farben, Schrift, Abstände, Icons und Schließen-Button sind angeglichen. Der Erfolgstoast im ursprünglichen Szenario ist im Bereich **x=1020, y=20, 400 × 86 px pixelidentisch** zur Angular-17-Referenz; das gilt nicht für das ganze Bild oder sämtliche Toast-Zustände. **44 Tests**, drei Builds und zwölf Browser-Interaktionsprüfungen sind erfolgreich. Zwei vollständige Läufe mit jeweils **39 Referenzszenarien plus sechs Zusatzaufnahmen** enthalten keine Konsolen-/Browserfehler. Zusatzbilder zeigen JSON/XML-Dateiauswahl und Success-/Info-/Warn-/Error-Toasts mit Detailtext; Schließen per Klick und Enter ist geprüft.

Für die Windows-Referenz startet das Skript Edge mit `--use-angle=d3d11` und protokolliert den Renderer sowie GPU-Compositing/-Rasterization vor und nach der Aufnahme. Software-Fallback oder ein Wechsel der protokollierten Pipeline führen zum Abbruch. Das Skript setzt damit die Windows-D3D11-Aufnahmebedingungen voraus; die Prüfsummen sind nicht auf andere Betriebssysteme/GPU-/Treiber-/Browserstände übertragbar. Die Listenaufnahme aus Commit-Punkt 11 stimmt exakt mit der gezielt erstellten Software-Rendering-Diagnose überein. Das deutet auf unterschiedliche Renderer als Ursache der dortigen flächigen Rasterabweichungen; die Ursache eines damaligen Fallbacks ist mangels Telemetrie nicht nachgewiesen.

Die beiden abschließenden D3D11-Läufe stimmen in **40/45 PNGs** überein (**38/39 Referenzszenarien**, **2/6 Zusatzbilder**). Transferwarnung und vier Toast-Zusatzbilder unterscheiden sich jeweils nur in **vier Pixeln bei x=179–180 / y=553–554**, am rechten Ende der Tabs-Unterstreichung. Diese Restabweichung ist offen und wird nicht weggefiltert. Die vollständige UI-Abnahme bleibt offen (**0/39 byteidentische vollständige Bilder** zur Angular-17-Referenz). Originalbilder bleiben unverändert. Abschließende Aufnahmen: `artefacts/angular-upgrade/visual/angular-18-toast-accepted/` und `angular-18-toast-accepted-repeat/`; Bericht: [angular-18-toast-check.json](angular-18-toast-check.json).

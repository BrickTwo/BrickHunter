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

## Tabellen-/Preis-Tag-Abschnitt auf Angular 18

Tabellen verwenden den öffentlichen `stripedRows`-Input mit der bisherigen Streifenreihenfolge. Preis-Tags sind wieder kompakt und haben die ursprünglichen Farben; Sortiericons erhalten 14-px-Größe und 8-px-Abstand. Tabellen-Hover/Fokus sowie Tablist-/Kopfzeilengeometrie sind angeglichen. Kopfzeile **56 px**, Teilezeilen **91 px**, Tablist-Band **50 px**; Bestseller-Tag **67.046875 × 22 px**.

**44 Tests**, drei Builds, **39 Referenzszenarien plus zehn Zusatzbilder** und **15 Browser-Interaktionsprüfungen** erfolgreich, ohne aufgezeichnete Konsolen-/Browserfehler. Zusatzbilder zeigen jetzt auch auf-/absteigende Sortierung per Enter, sortierte Kopfzeile bei Hover und einen Tastatur-Tabwechsel. Im abschließenden Wiederholungspaar sind **49/49 PNGs byteidentisch**; die zuvor gelegentlich beobachtete Vier-Pixel-Abweichung an der Unterstreichung ist in diesem Paar nicht aufgetreten. Das gilt für die protokollierten Aufnahmebedingungen, nicht für beliebige Rechner oder zukünftige Browser-/Treiberstände.

Die Desktop-Teiletabelle hat noch **3.812 abweichende Pixel** gegenüber der Angular-17-Referenz (vor dem Abschnitt **281.864**). Die vollständige UI-Abnahme bleibt offen (**0/39 vollständige Hauptbilder byteidentisch**); die Originalbilder werden nicht ersetzt. Abschlussbilder: `artefacts/angular-upgrade/visual/angular-18-table-accepted/` und `angular-18-table-accepted-repeat/`; Bericht: [angular-18-table-check.json](angular-18-table-check.json).

## Select-Felder und verschachteltes Escape auf Angular 18

Select-Popup, Optionen, Pfeilbereich und Disabled-Darstellung sind an die bisherigen Dropdown-Werte angeglichen. Land/Sprachen haben explizite zugängliche Label-Verweise und stabile Optionsschlüssel; die Preiseinheit verwendet die öffentliche Style-Bindung. Die auf drei Felder begrenzte `bhSelectEscape`-Direktive verhindert, dass Escape im offenen Popup auch den umgebenden Drawer schließt. Ein Regressionstest prüft Popup-Schließen und Event-Weitergabe bei geschlossenem Popup; der vollständige Browserlauf prüft das spätere Drawer-Schließen.

**45 Tests**, drei Builds, **39 Hauptszenarien plus 16 Zusatzbilder** und **20 Browserprüfungen** erfolgreich, ohne aufgezeichnete Konsolen-/Browserfehler. Die sechs neuen Select-Bilder zeigen Popup, gespeicherte Auswahl, Disabled-Zustand, Locale-Dialog sowie Länder-/Sprachoptionen. Einheiten-Popup **136 × 102 px**, Sprach-Popup **252 × 153 px**, Optionen jeweils **51 px** hoch mit **16 px** Padding. Auswahl/Speicherung per Maus und Tastatur, Escape und Disabled-Verhalten sind geprüft. Die schon zuvor auf Angular 18 sichtbare EUR-Auswahl wird weiterhin dargestellt; das leere Einheitenfeld in der ursprünglichen Aufnahme bleibt als Referenzabweichung dokumentiert.

Wiederholung: **46/55 PNGs identisch** (**37/39 Hauptbilder**, **9/16 Zusatzbilder**), alle sechs Select-Zusatzbilder identisch. Neun andere Aufnahmen unterscheiden sich ausschließlich in jeweils vier Pixeln an der Tabs-Unterstreichung. Zur ursprünglichen Referenz sind **4/39 Hauptbilder byteidentisch**: die Settings-Seite in allen vier Viewports. Vollständige UI-Abnahme bleibt offen; Originalbilder werden nicht ersetzt. Abschließende Bilder: `artefacts/angular-upgrade/visual/angular-18-select-verified/` und `angular-18-select-verified-repeat/`; Messwerte, Prüfsummen und Prüfungen: [angular-18-select-check.json](angular-18-select-check.json).

## Buttonfarben und Interaktionszustände auf Angular 18

Primary-/Danger-/Success-Buttons verwenden die ursprünglichen Farben und Hover-/Fokus-/Active-Abstufungen. Der zusätzliche 1-px-Rahmen aus den PrimeNG-18-Hover-/Active-Regeln ist entfernt, damit die Standardbuttonhöhe auch bei Interaktion **41.84375 px** bleibt. Runde Tabellenaktionen messen **48 × 48 px**, kleine Kartenaktionen weiterhin **35 × 35 px**. Text-/Outlined-Fokus bleibt durch eine farbige Fläche sichtbar; der zusätzliche Fokusrahmen ist entsprechend dem bisherigen Theme entfernt.

**45 Tests**, drei Builds und **26 Browserprüfungen** erfolgreich, ohne aufgezeichnete Konsolen-/Browserfehler. Sechs zusätzliche Zustandsbilder und separate Button-Messwerte ergänzen die bisherigen Aufnahmen. Space-Löschen eines Testteils, Enter-Öffnen des Drawers, Space-Transfer im lokalen Testdienst, Disabled-ReSync und Enter-Speichern der Have-it-Auswahl sind geprüft. Alle Aktionen verwenden die isolierte Fixture.

Abschlussvergleich: **52/61 PNGs byteidentisch** (**37/39 Hauptbilder**, **15/22 Zusatzbilder**). Neun andere Bilder unterscheiden sich ausschließlich in jeweils vier Pixeln am Ende der Tabs-Unterstreichung; die D3D11-Pipeline bleibt vor/nach beiden Läufen gleich. Die Desktop-Teiletabelle hat nun **3.100** statt **3.812** abweichende Pixel zur ursprünglichen Referenz; die Unterschiede an den roten Tabellenaktionen sind beseitigt. Weiterhin **4/39 vollständige Hauptbilder byteidentisch** zur Originalreferenz. Vollständige UI-Abnahme bleibt offen. Originalbilder werden nicht ersetzt. Abschlussaufnahmen: `artefacts/angular-upgrade/visual/angular-18-button-accepted/` und `angular-18-button-accepted-repeat/`; Bericht: [angular-18-button-check.json](angular-18-button-check.json).

## ToggleSwitch-Geometrie und Zustandsdarstellung auf Angular 18

ToggleSwitch verwendet wieder den ursprünglichen transparenten 1-px-Sliderrahmen. Griffpositionen sind relativ zum Root **0 px** ausgeschaltet und **24 px** eingeschaltet, entsprechend dem alten Rahmen plus Griffstart und Translation. Root **44 × 16 px**, Griff **24 × 24 px**. Hover-/Fokus-Halos verwenden die ursprünglichen schwarzen/blauen Farben mit **0.04/0.12** Deckkraft; Disabled erhält **0.38** Deckkraft des gesamten Schalters mit erhaltenen An-/Aus-Farben.

**45 Tests**, drei Builds und **29 Browserprüfungen** erfolgreich, ohne aufgezeichnete Konsolen-/Browserfehler. Sechs Zusatzbilder sichern Hover, Fokus und Disabled jeweils an/aus; Modell-/Filteränderungen per Space/Maus, Labelklick und blockierte Disabled-Klicks sind geprüft. Abschlussvergleich: **56/67 PNGs byteidentisch** (**37/39 Hauptbilder**, **19/28 Zusatzbilder**), einschließlich aller sechs neuen Toggle-Aufnahmen. Elf andere Bilder unterscheiden sich ausschließlich in jeweils vier Pixeln an der Tabs-Unterstreichung. D3D11-Pipeline bleibt vor/nach beiden Läufen gleich.

Die Desktop-Teiletabelle hat nun **1.890** statt **3.100** abweichende Pixel zur Originalreferenz. Beide Affiliate-Schalter sind in den im Bericht dokumentierten **60 × 37-px-Rechtecken pixelgleich**. Der obere Bereich vor y=471 und der sichtbare Tabellenkörper ab y=609 sind in dieser Aufnahme ebenfalls pixelgleich; verbleibende Unterschiede liegen im Tabellenkopf und in vier Pixeln der Tab-Unterstreichung. Weiterhin **4/39 vollständige Hauptbilder byteidentisch** zur Originalreferenz; vollständige UI-Abnahme bleibt offen. Originalbilder werden nicht ersetzt. Abschlussaufnahmen: `artefacts/angular-upgrade/visual/angular-18-toggle-accepted/` und `angular-18-toggle-accepted-repeat/`; Bericht: [angular-18-toggle-check.json](angular-18-toggle-check.json).

## Tabellenkopf und Sortiericons auf Angular 18

Tabellenkopf-Rahmenfarbe wieder **#e4e4e4**. Die Sortiericon-Wrapper verwenden die bisherige Inline-Darstellung; die SVGs erhalten die ursprüngliche mittige Vertikalausrichtung. Eine auf diese SVGs begrenzte wichtige Regel überstimmt PrimeNGs BaseIcon-Ausrichtung außerhalb der Theme-Layer. Glyphen, 14-px-Größe und bisherige Farben bleiben erhalten.

**45 Tests**, drei Builds und **30 Browserprüfungen** erfolgreich, ohne aufgezeichnete Konsolen-/Browserfehler. Abschlussvergleich: **64/67 PNGs byteidentisch** (**36/39 Hauptbilder**, **28/28 Zusatzbilder**). Drei Hauptbilder unterscheiden sich ausschließlich in jeweils vier Pixeln an der Tabs-Unterstreichung. D3D11-Pipeline bleibt vor/nach beiden Läufen gleich.

Die Desktop-Teiletabelle bei 1440 px hat nur noch **4** statt **1.890** abweichende Pixel zur Originalreferenz, ausschließlich an der Tabs-Unterstreichung. Der Tabellenkopf ist im dokumentierten **1.322 × 56-px-Rechteck pixelgleich**, einschließlich Sortierpfeilen und Rahmenlinie. Im ersten Abschlusslauf **5/39 vollständige Hauptbilder byteidentisch** zur Originalreferenz: vier Settings-Seiten plus die Tabelle bei 3200 px. Letztere hat im Wiederholungslauf ebenfalls die bekannte Vier-Pixel-Abweichung. Vollständige UI-Abnahme bleibt offen; Originalbilder werden nicht ersetzt. Abschlussaufnahmen: `artefacts/angular-upgrade/visual/angular-18-header-complete/` und `angular-18-header-complete-repeat/`; Bericht: [angular-18-header-check.json](angular-18-header-check.json).

## Menüfokus und Popup-Lifecycle auf Angular 18

Menüfokus bleibt bei Hover sichtbar, mit dem ursprünglichen Hintergrund **rgba(0, 0, 0, 0.12)**. Der öffentliche BrickHunter-Wrapper schließt Popups nun auch bei tatsächlichem Fenster-Scrolling. Ein über Renderer2 registrierter Listener ist nur bei geöffnetem Popup aktiv und wird beim Schließen oder Zerstören entfernt. Farbpopup **200 × 64 px**, Farbfeld **13 px**; Aktionsmenü liegt mit Z-Index **2104** über dem Tabellenkopf (**999**).

**46 Tests**, drei Builds und **36 Browserprüfungen** erfolgreich, ohne aufgezeichnete Browser-/Konsolenfehler. Geprüft sind Fokus bei Hover, Escape mit Fokusrückkehr, Außenklick/Trigger-Toggle, echtes Fenster-Scrollen mit 1.000 Teilen, Resize/Wiederöffnen, Home/End/Space, Farbauswahl und Navigation per Enter mit Listener-Cleanup. In beiden Abschlussläufen **3 überwachte Listener registriert, 0 verbleibend** nach dem Seitenwechsel. Zwei neue Menübilder sind visuell geprüft und im Wiederholungspaar byteidentisch.

Abschlussvergleich: **64/69 PNGs byteidentisch** (**36/39 Hauptbilder**, **28/30 Zusatzbilder**). Fünf andere Bilder unterscheiden sich ausschließlich in jeweils vier Pixeln an der Tabs-Unterstreichung; D3D11-Pipeline bleibt vor/nach beiden Läufen gleich. Zur Originalreferenz **4/39 vollständige Hauptbilder byteidentisch**, gegenüber dem vorigen Abschnitt **38/39 Hauptbilder unverändert**. Desktop-Teiletabelle weiterhin nur vier abweichende Pixel; Tabellenkopf- und Toast-Vergleichsrechtecke bleiben pixelgleich. Vollständige UI-Abnahme bleibt offen; Originalbilder werden nicht ersetzt. Abschlussaufnahmen: `artefacts/angular-upgrade/visual/angular-18-menu-lifecycle-complete/` und `angular-18-menu-lifecycle-complete-repeat/`; Bericht: [angular-18-menu-acceptance-check.json](angular-18-menu-acceptance-check.json).

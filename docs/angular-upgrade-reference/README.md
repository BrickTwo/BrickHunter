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

Die vorhandene schmale Darstellung hat horizontale Überbreite; der Transferwarndialog schneidet bei 1440 px Tabelleninhalt ab. Die Aufnahmen dokumentieren diese Ausgangssituation. Das bereits erfasste Tastaturproblem mit deaktivierten/ausgeblendeten Menüeinträgen bleibt ebenfalls offen. Diese Fehler sind bei der Migration separat zu behandeln.

Die Referenzen sichern die UI mit kontrollierten Testdaten. Sie sind noch keine Abnahme echter Extension-Kommunikation, IndexedDB-Upgrades, PDF/XML-Dateien oder echter Teilebilder. Weitere Browserprofile und konkrete Interaktionen werden im jeweiligen Upgradeabschnitt ergänzt.

## Reproduktion

Der Upgrade-Zwischenstand Angular **17.3.12** / CLI **17.3.17** / CDK **17.3.10** wurde ebenfalls geprüft: **39 von 39 PNGs byteidentisch**, alle Szenarienmessungen identisch, keine neuen Browser-/Konsolenfehler. Die einzelnen SHA-256-Vergleiche stehen in [angular-17-patch-check.json](angular-17-patch-check.json). Die Ausgangsbilder unter `angular-17/` bleiben die Referenz für weitere Stufen.

Aus dem Repository-Stamm mit Node 20 und Playwright 1.62.1. Playwright wird hier aus dem vorhandenen Codex-Runtime-Bundle geladen; für andere Rechner muss `NODE_PATH` auf eine entsprechende separate Toolinstallation zeigen. `CHROME_BIN` kann den passenden Browserpfad vorgeben. Für Pixelvergleiche denselben Edge-/Windows-Stand und die aufgeführten Aufnahmebedingungen verwenden.

```powershell
$env:PATH = "$PWD\tmp\upgrade-runtime\node-v20.20.2-win-x64;$env:PATH"
$env:NODE_PATH = 'C:\Users\Tobias\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
npm.cmd run build:visual-reference
node scripts/upgrade/capture-visual-reference.cjs angular-17-new-run
```

Ausgabe: `artefacts/angular-upgrade/visual/angular-17-new-run/`. Der Szenarienname muss neu sein: Das Skript überschreibt keine vorhandenen Referenzen. Der reguläre `build`-/`build-dev`-Einstieg bleibt `src/main.ts`; nur die explizite Konfiguration `development,visual-reference` verwendet `src/testing/visual-main.ts`.

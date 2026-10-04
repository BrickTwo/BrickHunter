# Direkte Pakete: Upgrade-Prüfung

Abfrage: 4. Oktober 2026, offizielle npm-Registry. Alle 46 direkten Pakete aus package.json wurden mit der gelockten und der aktuellen latest-Version abgefragt. Latest ist ein Kandidat, keine freigegebene Installationskombination. TypeScript muss für Angular 22 auf 6.0.x begrenzt werden.

Die vollständigen Metadaten einschließlich optionaler Peers liegen lokal unter artefacts/angular-upgrade/baseline/package-audit.json. Reproduzierbare Abfrage: node scripts/upgrade/package-audit.cjs. Framework-Pakete werden pro Major zusammen aktualisiert; Engines werden mit der jeweiligen Zwischenruntime geprüft.

Ergänzende Prüfung des neu geplanten Theme-Pakets am 4. Oktober 2026: [`@primeuix/themes` 3.0.1](https://registry.npmjs.org/@primeuix/themes/3.0.1) veröffentlicht weder Engines noch Peer-Abhängigkeiten und verlangt `@primeuix/styled: ^1.0.0`. Das Paket ist noch nicht installiert. Die aktuelle [PrimeNG-Installation](https://primeng.dev/installation) sieht die Einrichtung eines PrimeUI-Lizenzschlüssels vor; der Community-Schlüssel wird vor dem PrimeNG-22-Setup benötigt. Die frühe Angular-17-Patchmigration hängt davon nicht ab. Der tatsächlich gemessene Root-Font beträgt 16 px; das finale Theme muss anhand dieser Referenz gewählt und abgestimmt werden.

| Paket | Gruppe | Lockfile | latest | Engines: Lockfile / latest | Peers von latest |
| --- | --- | --- | --- | --- | --- |
| @angular-builders/custom-webpack | dependencies | 17.0.0 | 22.0.1 | {"node":"^14.20.0 \|\| ^16.13.0 \|\| >=18.10.0"} / {"node":"^20.19.0 \|\| ^22.12.0 \|\| >=24.0.0"} | {"rxjs":">=7.0.0","@angular/compiler-cli":"^22.0.0"} |
| @angular/animations | dependencies | 17.1.2 | 22.2.1 | {"node":"^18.13.0 \|\| >=20.9.0"} / {"node":"^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0"} | {"@angular/core":"22.2.1"} |
| @angular/cdk | dependencies | 17.1.2 | 22.2.1 | {} / {} | {"rxjs":"^6.5.3 \|\| ^7.4.0","@angular/core":"^22.0.0 \|\| ^23.0.0","@angular/forms":"^22.0.0 \|\| ^23.0.0","@angular/common":"^22.0.0 \|\| ^23.0.0","@angular/platform-browser":"^22.0.0 \|\| ^23.0.0"} |
| @angular/common | dependencies | 17.1.2 | 22.2.1 | {"node":"^18.13.0 \|\| >=20.9.0"} / {"node":"^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0"} | {"rxjs":"^6.5.3 \|\| ^7.4.0","@angular/core":"22.2.1"} |
| @angular/compiler | dependencies | 17.1.2 | 22.2.1 | {"node":"^18.13.0 \|\| >=20.9.0"} / {"node":"^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0"} | {} |
| @angular/core | dependencies | 17.1.2 | 22.2.1 | {"node":"^18.13.0 \|\| >=20.9.0"} / {"node":"^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0"} | {"rxjs":"^6.5.3 \|\| ^7.4.0","zone.js":"~0.15.0 \|\| ~0.16.0","@angular/compiler":"22.2.1"} |
| @angular/forms | dependencies | 17.1.2 | 22.2.1 | {"node":"^18.13.0 \|\| >=20.9.0"} / {"node":"^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0"} | {"rxjs":"^6.5.3 \|\| ^7.4.0","@angular/core":"22.2.1","@angular/common":"22.2.1","@angular/platform-browser":"22.2.1"} |
| @angular/platform-browser | dependencies | 17.1.2 | 22.2.1 | {"node":"^18.13.0 \|\| >=20.9.0"} / {"node":"^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0"} | {"@angular/core":"22.2.1","@angular/common":"22.2.1","@angular/animations":"22.2.1"} |
| @angular/platform-browser-dynamic | dependencies | 17.1.2 | 22.2.1 | {"node":"^18.13.0 \|\| >=20.9.0"} / {"node":"^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0"} | {"@angular/core":"22.2.1","@angular/common":"22.2.1","@angular/compiler":"22.2.1","@angular/platform-browser":"22.2.1"} |
| @angular/router | dependencies | 17.1.2 | 22.2.1 | {"node":"^18.13.0 \|\| >=20.9.0"} / {"node":"^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0"} | {"rxjs":"^6.5.3 \|\| ^7.4.0","@angular/core":"22.2.1","@angular/common":"22.2.1","@angular/platform-browser":"22.2.1"} |
| @fortawesome/angular-fontawesome | dependencies | 0.14.1 | 5.1.0 | {} / {} | {"@angular/core":"^22.0.0"} |
| @fortawesome/fontawesome-free | dependencies | 6.5.1 | 7.3.1 | {"node":">=6"} / {"node":">=6"} | {} |
| @fortawesome/free-solid-svg-icons | dependencies | 6.5.1 | 7.3.1 | {"node":">=6"} / {"node":">=6"} | {} |
| @ngrx/effects | dependencies | 17.1.0 | 22.0.1 | {} / {} | {"rxjs":"^6.5.3 \|\| ^7.5.0","@ngrx/store":"22.0.1","@angular/core":"^22.0.0"} |
| @ngrx/store | dependencies | 17.1.0 | 22.0.1 | {} / {} | {"rxjs":"^6.5.3 \|\| ^7.5.0","@angular/core":"^22.0.0"} |
| @ngx-translate/core | dependencies | 15.0.0 | 18.0.0 | {"node":"^16.13.0 \|\| >=18.10.0"} / {} | {"rxjs":">=7","@angular/core":">=18","@angular/common":">=18"} |
| @ngx-translate/http-loader | dependencies | 8.0.0 | 18.0.0 | {"node":"^16.13.0 \|\| >=18.10.0"} / {} | {"@angular/core":">=18","@angular/common":">=18","@ngx-translate/core":">=18.0.0"} |
| dexie | dependencies | 3.2.4 | 4.4.6 | {"node":">=6.0"} / {} | {} |
| jspdf | dependencies | 2.5.1 | 4.2.1 | {} / {} | {} |
| jspdf-autotable | dependencies | 3.8.1 | 5.0.8 | {} / {} | {"jspdf":"^2 \|\| ^3 \|\| ^4"} |
| ng-lazyload-image | dependencies | 9.1.3 | 9.1.3 | {} / {} | {"rxjs":">=6.0.0","@angular/core":">=11.0.0","@angular/common":">=11.0.0"} |
| primeflex | dependencies | 3.3.1 | 4.0.0 | {} / {} | {} |
| primeng | dependencies | 17.5.0 | 22.1.2 | {} / {} | {"rxjs":"^6.0.0 \|\| ^7.8.1","@angular/cdk":"^22.1.0","@angular/core":"^22.1.0","@angular/forms":"^22.1.0","@angular/common":"^22.1.0","@angular/router":"^22.1.0","@angular/platform-browser":"^22.1.0"} |
| rxjs | dependencies | 7.8.1 | 7.8.2 | {} / {} | {} |
| stream | dependencies | 0.0.2 | 0.0.3 | {} / {} | {} |
| timers | dependencies | 0.1.1 | 0.1.1 | {} / {} | {} |
| tslib | dependencies | 2.6.2 | 2.8.1 | {} / {} | {} |
| xml2js | dependencies | 0.6.2 | 0.6.2 | {"node":">=4.0.0"} / {"node":">=4.0.0"} | {} |
| zone.js | dependencies | 0.14.3 | 0.16.3 | {} / {} | {} |
| @angular-devkit/build-angular | devDependencies | 17.1.2 | 22.2.1 | {"npm":"^6.11.0 \|\| ^7.5.6 \|\| >=8.0.0","node":"^18.13.0 \|\| >=20.9.0","yarn":">= 1.13.0"} / {"npm":"^6.11.0 \|\| ^7.5.6 \|\| >=8.0.0","node":"^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0","yarn":">= 1.13.0"} | {"karma":"^6.3.0","ng-packagr":"^22.0.0","typescript":">=6.0 <6.1","tailwindcss":"^2.0.0 \|\| ^3.0.0 \|\| ^4.0.0","@angular/ssr":"^22.2.1","browser-sync":"^3.0.2","@angular/core":"^22.0.0","@angular/localize":"^22.0.0","@angular/compiler-cli":"^22.0.0","@angular/service-worker":"^22.0.0","@angular/platform-server":"^22.0.0","@angular/platform-browser":"^22.0.0"} |
| @angular/cli | devDependencies | 17.1.2 | 22.2.1 | {"npm":"^6.11.0 \|\| ^7.5.6 \|\| >=8.0.0","node":"^18.13.0 \|\| >=20.9.0","yarn":">= 1.13.0"} / {"npm":"^6.11.0 \|\| ^7.5.6 \|\| >=8.0.0","node":"^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0","yarn":">= 1.13.0"} | {} |
| @angular/compiler-cli | devDependencies | 17.1.2 | 22.2.1 | {"node":"^18.13.0 \|\| >=20.9.0"} / {"node":"^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0"} | {"typescript":">=6.0 <6.1","@angular/compiler":"22.2.1"} |
| @angular/localize | devDependencies | 17.1.2 | 22.2.1 | {"node":"^18.13.0 \|\| >=20.9.0"} / {"node":"^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0"} | {"@angular/compiler":"22.2.1","@angular/compiler-cli":"22.2.1"} |
| @ngrx/store-devtools | devDependencies | 17.1.0 | 22.0.1 | {} / {} | {"rxjs":"^6.5.3 \|\| ^7.5.0","@ngrx/store":"22.0.1","@angular/core":"^22.0.0"} |
| @types/chrome | devDependencies | 0.0.260 | 0.3.4 | {} / {} | {} |
| @types/jasmine | devDependencies | 5.1.4 | 7.0.0 | {} / {} | {} |
| autoprefixer | devDependencies | 10.4.17 | 10.6.1 | {"node":"^10 \|\| ^12 \|\| >=14"} / {"node":"^10 \|\| ^12 \|\| >=14"} | {"postcss":"^8.1.0"} |
| jasmine-core | devDependencies | 5.1.1 | 7.0.2 | {} / {} | {} |
| karma | devDependencies | 6.4.2 | 6.4.4 | {"node":">= 10"} / {"node":">= 10"} | {} |
| karma-chrome-launcher | devDependencies | 3.2.0 | 3.2.0 | {} / {} | {} |
| karma-coverage | devDependencies | 2.2.1 | 2.2.1 | {"node":">=10.0.0"} / {"node":">=10.0.0"} | {} |
| karma-jasmine | devDependencies | 5.1.0 | 5.1.0 | {"node":">=12"} / {"node":">=12"} | {"karma":"^6.0.0"} |
| karma-jasmine-html-reporter | devDependencies | 2.1.0 | 2.3.0 | {} / {} | {"karma":"^6.0.0","jasmine-core":"^4.0.0 \|\| ^5.0.0 \|\| ^6.0.0 \|\| ^7.0.0","karma-jasmine":"^5.0.0"} |
| postcss | devDependencies | 8.4.34 | 8.5.28 | {"node":"^10 \|\| ^12 \|\| >=14"} / {"node":"^10 \|\| ^12 \|\| >=14"} | {} |
| prettier | devDependencies | 3.2.5 | 3.9.9 | {"node":">=14"} / {"node":">=14"} | {} |
| typescript | devDependencies | 5.3.3 | 7.0.2 | {"node":">=14.17"} / {"node":">=16.20.0"} | {} |

## Geprüfter Zwischenstand: Angular 17

Die Tabelle oben dokumentiert die ursprüngliche Abfrage vor Paketänderungen. Am 4. Oktober 2026 wurde folgender Zwischenstand installiert und durch `npm ci`, `npm ls --all`, drei Builds, 26 Tests und 39 byteidentische UI-Aufnahmen bestätigt:

| Paketgruppe | Gelockter Zwischenstand | Kompatibilität / Entscheidung |
| --- | --- | --- |
| Angular Framework, Compiler-CLI, Localize | 17.3.12 | Neuester stabiler 17er-Stand laut offizieller npm-Registry; Framework-Pakete konsistent. |
| CLI, Build-Devkit | 17.3.17 | Neuester stabiler 17er-Stand; Node 20.20.2 kompatibel. |
| CDK | 17.3.10 | Neuester stabiler 17er-Stand; Core/Common-Peers `^17.0.0 \|\| ^18.0.0`. |
| Custom-Webpack | 17.0.0 | Beibehalten; Compiler-CLI-17-Peer gültig. Verfügbarer 17.0.2-Patch in diesem Abschnitt nicht benötigt. |
| PrimeNG / NgRx | 17.5.0 / 17.1.0 | Beibehalten; keine ungültigen Peers, UI unverändert. |
| TypeScript / Zone.js | 5.3.3 / 0.14.3 | Beibehalten; innerhalb der Angular-17.3-Anforderungen. |
| Autoprefixer / PostCSS | 10.4.17 / 8.4.34 | Direkte Ausgangsversionen und Versionsbereiche beibehalten; CSS-Ausgabe byteidentisch. |

Alle übrigen direkten gelockten Versionen bleiben unverändert. Transitive Toolchain-Pakete wurden durch den Angular-Installer angepasst. Einzelheiten und Commit-Punkt: [Fortschrittsprotokoll](angular-upgrade-progress.md).

## Vorbereitete Kandidatenkombination: Angular / PrimeNG 18

Erneute offizielle npm-Abfrage am 4. Oktober 2026. Noch **nicht installiert**. Die direkten Peer-Metadaten der 46 bestehenden Pakete und des neuen Theme-Pakets ergeben gegenüber der vollständigen Kandidatenkombination keine Konflikte bei vorhandenen/ausgewählten Peer-Paketen. Installation, transitive Auflösung, Migrationen und Laufzeit-/UI-Prüfungen stehen noch aus.

| Paketgruppe | Kandidat |
| --- | --- |
| Angular Framework, Compiler-CLI, Localize / CDK | 18.2.14 |
| CLI / Build-Devkit | 18.2.21 |
| Custom-Webpack | 18.0.0 |
| NgRx Store / Effects / Devtools | 18.1.1 |
| Angular-FontAwesome | 0.15.0 |
| PrimeNG / `@primeng/themes` | 18.0.2 |
| PrimeFlex | 4.0.0 |
| TypeScript / Zone.js | 5.5.4 / 0.14.10 |

Node 20.20.2 erfüllt die Angular-18-Anforderungen. Alle Framework-Pakete einschließlich Platform-Browser-Dynamic müssen gemeinsam aktualisiert werden. Das Theme und die geänderte PrimeNG-Konfiguration werden im selben Migrationsabschnitt umgesetzt; Details im [Fortschrittsprotokoll](angular-upgrade-progress.md).

### Installierter Grundmigrationsstand

Die oben genannten 18er-Kandidaten sind inzwischen installiert. Zusätzlich durch die offizielle Migration ergänzt: **`@ngrx/operators` 18.1.1**. Tooling-Auflösung: **tslib 2.6.3**, **Autoprefixer 10.4.20**, **PostCSS 8.4.41**. Aktuell 48 direkte Pakete. `npm ci` und `npm ls --all`, Produktions-/Entwicklungs-/Referenzbuild sowie 34 Tests sind erfolgreich. Der erste Token-Preset ist aktiv; **die visuelle Abnahme steht noch aus**, 39 von 39 Aufnahmen unterscheiden sich von der Angular-17-Basis. Einzelheiten: Commit-Punkt 6 im [Fortschrittsprotokoll](angular-upgrade-progress.md).

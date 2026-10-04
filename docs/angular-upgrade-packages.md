# Direkte Pakete: Upgrade-Prüfung

Abfrage: 4. Oktober 2026, offizielle npm-Registry. Alle 46 direkten Pakete aus package.json wurden mit der gelockten und der aktuellen latest-Version abgefragt. Latest ist ein Kandidat, keine freigegebene Installationskombination. TypeScript muss für Angular 22 auf 6.0.x begrenzt werden.

Die vollständigen Metadaten einschließlich optionaler Peers liegen lokal unter artefacts/angular-upgrade/baseline/package-audit.json. Reproduzierbare Abfrage: node scripts/upgrade/package-audit.cjs. Framework-Pakete werden pro Major zusammen aktualisiert; Engines werden mit der jeweiligen Zwischenruntime geprüft.

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

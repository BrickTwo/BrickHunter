# AngularBrowserExtension

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.0.

## Local setup (Angular 22)

Use Node **24.21.0** (see `.node-version`) and npm **11.19.0**. The staged upgrade, completed Angular 22 offline UI acceptance, and remaining extension release checks are documented in [the upgrade plan](docs/angular-upgrade-plan.md).

Install dependencies and configure your PrimeUI Community license from a file outside the repository:

```powershell
npm ci
node scripts/configure-primeui-license.cjs "C:\path\primengui.lic"
npm start
```

The local license path and generated `src/app/primeui-license.local.ts` are ignored by Git. npm start/build/test/watch hooks regenerate the configuration from that path. Alternatively, set `PRIMEUI_LICENSE_FILE` to your license file path. Configure the license once before calling Angular CLI directly in a fresh checkout.

Run `npm run typecheck:build-config` to check the custom Webpack TypeScript configurations separately. Run `npm test -- --watch=false --browsers=ChromeHeadless` for the unit tests; configure `CHROME_BIN` if your browser is installed at a different location.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

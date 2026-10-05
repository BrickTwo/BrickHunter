// Dedicated local reference entry point. Never used by the extension build.
import { ApplicationRef, Injector, NgModule, NgZone, provideZoneChangeDetection } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { delay, of, Subject, Subscriber } from 'rxjs';
import { AppModule } from '../app/app.module';
import { AppComponent } from '../app/app.component';
import { BrickHunterApiService } from '../app/core/http/brickhunterapi.service';
import { IndexedDBService } from '../app/core/services/indexeddb.service.ts';
import { VersionService } from '../app/core/services/version.service';
import { BrowsePartsService } from '../app/browse-parts/service/browse-parts.service';
import { PickABrickService } from '../app/parts-list/services/pickabrick.service';
import { MessageService } from 'primeng/api';
import { referenceColors, referenceLists, referenceSearch, referenceTableParts } from './upgrade-fixtures';

if (!['localhost', '127.0.0.1'].includes(location.hostname)) {
  throw new Error('The visual reference app may only run on localhost.');
}
localStorage.clear(); // This runs on a separate, disposable localhost origin.
localStorage.setItem('country', 'de');
localStorage.setItem('language', 'de');
localStorage.setItem('favorites', '[]');
localStorage.setItem('haveIts', '[]');

let searchCount = 12;
const lists = referenceLists();
lists[0].parts = referenceTableParts();
const database = {
  partsLists: {
    toArray: () => Promise.resolve(structuredClone(lists)),
    add: (list: (typeof lists)[number]) => {
      lists.push(structuredClone(list));
      return Promise.resolve();
    },
    put: (list: (typeof lists)[number]) => {
      const index = lists.findIndex(item => item.uuid === list.uuid);
      if (index >= 0) lists[index] = structuredClone(list);
      return Promise.resolve();
    },
    delete: (uuid: string) => {
      const index = lists.findIndex(item => item.uuid === uuid);
      if (index >= 0) lists.splice(index, 1);
      return Promise.resolve();
    },
  },
  colors: { toArray: () => Promise.resolve(structuredClone(referenceColors)), bulkPut: () => Promise.resolve() },
};
const api = {
  getBrickHunterGlobalSettings: () =>
    of({ maxPaBLotPerOrder: 200, defaultMaxQuantityPerLot: 100, paBServiceFeeUnder: [], baPServiceFeeUnder: [] }),
  getRebrickableColors: () => of(structuredClone(referenceColors)),
  getPickABrickParts: () => of(referenceSearch(searchCount)).pipe(delay(0)),
  getProductsSuggestions: () => of([]),
  getRebrickableParts: () => of([]),
  getBrickLinkParts: () => of([]),
};
const pickABrick = {
  pabLoading: new Subject<boolean>(),
  pabLoadError: '',
  getParts: () => {},
  transferParts: async (subscriber: Subscriber<number>) => {
    subscriber.next(2);
  },
  continueTransfer: async () => {},
  cancelTransfer: () => {},
};

@NgModule({
  imports: [AppModule, NoopAnimationsModule],
  providers: [
    { provide: BrickHunterApiService, useValue: api },
    { provide: IndexedDBService, useValue: database },
    {
      provide: VersionService,
      useValue: {
        oldVersion: '2.4.8',
        currentVersion: '2.4.8',
        devmode: true,
        migration$: new Subject(),
        isVersionGreater: VersionService.prototype.isVersionGreater,
      },
    },
  ],
  bootstrap: [AppComponent],
})
class VisualReferenceModule {
  constructor(injector: Injector, zone: NgZone, app: ApplicationRef) {
    (window as any).brickHunterReference = {
      runInAngular: (action: () => void) => zone.run(action),
      clearMessages: () => zone.run(() => injector.get(MessageService).clear()),
      showMessage: (
        severity: 'success' | 'info' | 'warn' | 'error' = 'success',
        summary = 'PaB Data successfully updated',
        detail?: string
      ) =>
        zone.run(() =>
          injector.get(MessageService).add({
            severity,
            summary,
            detail,
            sticky: true,
          })
        ),
      setSearchCount: (count: number) =>
        zone.run(() => {
          if (!Number.isInteger(count) || count < 0 || count > 1000) throw new Error('Invalid reference count');
          searchCount = count;
          injector.get(BrowsePartsService).sendRequest();
          app.tick();
        }),
    };
  }
}

// Lazy module providers shadow root providers. Patch the service prototype in
// this test entry point, so every instance remains unable to contact LEGO.
PickABrickService.prototype.transferParts = pickABrick.transferParts;
PickABrickService.prototype.continueTransfer = pickABrick.continueTransfer;
PickABrickService.prototype.cancelTransfer = pickABrick.cancelTransfer;
PickABrickService.prototype.getParts = function () {
  queueMicrotask(() => this.pabLoading.next(false));
};
platformBrowserDynamic()
  .bootstrapModule(VisualReferenceModule, { applicationProviders: [provideZoneChangeDetection()] })
  .catch(error => console.error(error));

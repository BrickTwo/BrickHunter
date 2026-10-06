import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BrowsePartsModule } from '../app/browse-parts/browse-parts.module';
import { BrowsePartsService } from '../app/browse-parts/service/browse-parts.service';
import { BrickHunterApiService } from '../app/core/http/brickhunterapi.service';
import { ColorService } from '../app/core/services/color.service';
import { GlobalSettingsService } from '../app/core/services/global-settings.service';
import { GuidService } from '../app/core/services/guid.service';
import { IndexedDBService } from '../app/core/services/indexeddb.service.ts';
import { LocaleService } from '../app/core/services/locale.service';
import { VersionService } from '../app/core/services/version.service';
import { AffiliateService } from '../app/core/services/affiliate.service';
import { PartsListsModule } from '../app/parts-list/parts-list.module';
import { PartsListService } from '../app/parts-list/services/parts-list.service';
import { SettingsModule } from '../app/settings/settings.module';
import { SharedModule } from '../app/shared/shared.module';
import { referenceColors, referenceLists, referencePart, referenceSearch } from './upgrade-fixtures';

export async function configureComponentTestBed() {
  registerLocaleData(localeDe);
  localStorage.clear(); // Karma's disposable test origin only.
  localStorage.setItem('country', 'de');
  localStorage.setItem('language', 'de');
  const lists = referenceLists();
  const colors = structuredClone(referenceColors);
  const api = jasmine.createSpyObj<BrickHunterApiService>('BrickHunterApiService', [
    'getBrickHunterGlobalSettings', 'getRebrickableColors', 'getPickABrickParts', 'getProductsSuggestions',
    'getRebrickableParts', 'getBrickLinkParts',
  ]);
  api.getBrickHunterGlobalSettings.and.returnValue(of({
    maxPaBLotPerOrder: 200, defaultMaxQuantityPerLot: 100, paBServiceFeeUnder: [], baPServiceFeeUnder: [],
  }));
  // The existing API signature declares one color, while ColorService consumes an array.
  api.getRebrickableColors.and.returnValue(of(colors) as unknown as ReturnType<BrickHunterApiService['getRebrickableColors']>);
  api.getPickABrickParts.and.returnValue(of(referenceSearch()));
  api.getProductsSuggestions.and.returnValue(of([]));
  api.getRebrickableParts.and.returnValue(of([]));
  api.getBrickLinkParts.and.returnValue(of([]));

  await TestBed.configureTestingModule({
    imports: [SharedModule, BrowsePartsModule, PartsListsModule, SettingsModule,
      RouterTestingModule.withRoutes([])],
    providers: [
      provideHttpClient(), provideHttpClientTesting(),
      ConfirmationService, MessageService, ColorService, GlobalSettingsService, GuidService,
      LocaleService, AffiliateService,
      { provide: BrickHunterApiService, useValue: api },
      { provide: VersionService, useValue: { oldVersion: '2.4.8', currentVersion: '2.4.8', devmode: true,
        migration$: new Subject(), isVersionGreater: VersionService.prototype.isVersionGreater } },
      { provide: IndexedDBService, useValue: {
        partsLists: { toArray: () => Promise.resolve(structuredClone(lists)),
          add: jasmine.createSpy('add'), put: jasmine.createSpy('put'), delete: jasmine.createSpy('delete') },
        colors: { toArray: () => Promise.resolve(structuredClone(colors)), bulkPut: () => Promise.resolve() },
      } },
      { provide: DynamicDialogRef, useValue: { close: jasmine.createSpy('close') } },
      { provide: DynamicDialogConfig, useValue: { data: { part: referencePart() } } },
    ],
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  }).compileComponents();
  TestBed.inject(BrowsePartsService).categories = referenceSearch().categories;
  TestBed.inject(BrowsePartsService).setSelectedPartsListUuid('upgrade-reference');
  TestBed.inject(PartsListService);
  // Allow the in-memory database read to finish before component initialization.
  await Promise.resolve();
}

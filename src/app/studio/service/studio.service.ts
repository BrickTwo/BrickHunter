import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BrickHunterApiService } from 'src/app/core/http/brickhunterapi.service';
import { LocaleService } from 'src/app/core/services/locale.service';
import { GetPickABrickPartsRequest } from 'src/app/models/brickhunter-api';
import { BrowsePartCountry } from 'src/app/models/browse-parts';
import { Country } from 'src/app/models/global';

export interface FilterChanged {
  property: FilterChangedProperty;
  filter: Filter;
}

export enum FilterChangedProperty {
  deliveryChannels,
  country
}

export interface Filter {
  deliveryChannels: string[];
  country: Country;
}

@Injectable({
  providedIn: 'root',
})
export class StudioService {
  private filterSubject$ = new Subject<FilterChanged>();
  // filterState$ = this.filterSubject$.asObservable();

  // private isLoadingSubject$ = new Subject<boolean>();
  // isLoading$ = this.isLoadingSubject$.asObservable();
  // isLoading: boolean;


  constructor(
    private readonly birckHunterApiService: BrickHunterApiService,
    private readonly localeService: LocaleService
  ) {
  }

  // setDeliveryChannels(value: string[]) {
  //   this.filter.deliveryChannels = value;
  //   this.filterSubject$.next({ property: FilterChangedProperty.deliveryChannels, filter: { ...this.filter } });
  // }

  // setCountry(value: Country) {
  //     this.filter.country = value;
  //     this.filterSubject$.next({ property: FilterChangedProperty.country, filter: { ...this.filter } });
  // }

  // sendRequest() {
  //   this.isLoading = true;
  //   this.isLoadingSubject$.next(true);
  //   this.initFilter();

  //   localStorage.setItem('browsePartsFilter', JSON.stringify(this.filter));

  //   const request: GetPickABrickPartsRequest = {
  //     page: null,
  //     limit: null,
  //     country: this.filter.country,
  //     categoryId: null,
  //     colorIds: [],
  //     keywords: [],
  //     sortField: null,
  //     sortDir: null,
  //     deliveryChannels: this.filter.deliveryChannels,
  //     onlyPrinted: null,
  //     excludeCategoryIds: [],
  //     designIds: [],
  //     elementIds: null,
  //     atRiskAsOf: null
  //   };

  //   this.birckHunterApiService.getPickABrickParts(request).subscribe(response => {
  //     this.countries = response.countries as BrowsePartCountry[];
  //     this.countriesSubject$.next(this.countries.slice());

  //     this.isLoading = false;
  //     this.isLoadingSubject$.next(false);
  //   });
  // }
}

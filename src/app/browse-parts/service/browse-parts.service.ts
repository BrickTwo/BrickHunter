import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BrickHunterApiService } from 'src/app/core/http/brickhunterapi.service';
import { LocaleService } from 'src/app/core/services/locale.service';
import { GetPickABrickPartsRequest } from 'src/app/models/brickhunter-api';
import { BrowsePartCategory, BrowsePartCountry, BrowsePartsPart } from 'src/app/models/browse-parts';

export interface FilterChanged {
  property: FilterChangedProperty;
  filter: Filter;
}

export enum FilterChangedProperty {
  layout,
  page,
  perPage,
  totalParts,
  category,
  onlyPrinted,
  atRiskAsOf,
  color,
  deliveryChannels,
  sort,
  sortDirection,
  keyword,
  elementIds,
  country,
  excludeCategoryIds,
  excludeSelectedCategoyIds,
}

export interface Filter {
  layout: 'list' | 'grid';
  page: number;
  perPage: number;
  totalParts: number;
  categoryId: number;
  onlyPrinted: boolean;
  atRiskAsOf: string;
  colorId: number;
  deliveryChannels: string[];
  sort: string;
  sortDirection: string;
  keyword: string;
  elementIds: number[];
  country: string;
  excludeCategoryIds: number[];
  excludeSelectedCategoyIds: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BrowsePartsService {
  private filterSubject$ = new Subject<FilterChanged>();
  filterState$ = this.filterSubject$.asObservable();
  filter: Filter = {
    layout: 'grid',
    page: 0,
    perPage: 25,
    totalParts: 0,
    categoryId: 9999,
    onlyPrinted: false,
    atRiskAsOf: null,
    colorId: null,
    deliveryChannels: ['pab', 'bap', 'oos'],
    sort: 'NAME',
    sortDirection: 'ASC',
    keyword: '',
    elementIds: [],
    country: 'de',
    excludeCategoryIds: [],
    excludeSelectedCategoyIds: true,
  };
  private bricksSubject$ = new Subject<BrowsePartsPart[]>();
  bricksChanged$ = this.bricksSubject$.asObservable();
  bricks: BrowsePartsPart[];

  private categoriesSubject$ = new Subject<BrowsePartCategory[]>();
  categories$ = this.categoriesSubject$.asObservable();
  categories: BrowsePartCategory[];

  private colorsSubject$ = new Subject<number[]>();
  colors$ = this.colorsSubject$.asObservable();
  colors: number[];

  private countriesSubject$ = new Subject<BrowsePartCountry[]>();
  countries$ = this.countriesSubject$.asObservable();
  countries: BrowsePartCountry[];

  private selectedPartsListUuidSubject$ = new Subject<string>();
  selectedPartsListUuid$ = this.selectedPartsListUuidSubject$.asObservable();
  selectedPartsListUuid: string;

  private wishListSubject$ = new Subject<number[]>();
  wishList$ = this.wishListSubject$.asObservable();
  wishList: number[];

  private haveItListSubject$ = new Subject<number[]>();
  haveItList$ = this.haveItListSubject$.asObservable();
  haveItList: number[];

  private isLoadingSubject$ = new Subject<boolean>();
  isLoading$ = this.isLoadingSubject$.asObservable();
  isLoading: boolean;

  filterInitialized = false;

  constructor(
    private readonly birckHunterApiService: BrickHunterApiService,
    private readonly localeService: LocaleService
  ) {
    this.wishList = JSON.parse(localStorage.getItem('favorites')) || [];
    this.haveItList = JSON.parse(localStorage.getItem('haveIts')) || [];
    this.filter.country = this.localeService.country?.code || 'de';
  }

  initFilter() {
    if (!this.filterInitialized) {
      const browsePartsFilter = localStorage.getItem('browsePartsFilter') || null;
      if (browsePartsFilter) {
        this.filter = JSON.parse(browsePartsFilter) as unknown as Filter;
        console.log(this.filter.atRiskAsOf);
        this.filter.elementIds = [];
        this.filter.country = this.localeService.country?.code || 'de';
        this.filterSubject$.next({ property: FilterChangedProperty.layout, filter: { ...this.filter } });
        this.filterSubject$.next({ property: FilterChangedProperty.page, filter: { ...this.filter } });
        this.filterSubject$.next({ property: FilterChangedProperty.page, filter: { ...this.filter } });
        this.filterSubject$.next({ property: FilterChangedProperty.perPage, filter: { ...this.filter } });
        this.filterSubject$.next({ property: FilterChangedProperty.category, filter: { ...this.filter } });
        this.filterSubject$.next({ property: FilterChangedProperty.onlyPrinted, filter: { ...this.filter } });
        this.filterSubject$.next({ property: FilterChangedProperty.atRiskAsOf, filter: { ...this.filter } });
        this.filterSubject$.next({ property: FilterChangedProperty.color, filter: { ...this.filter } });
        this.filterSubject$.next({ property: FilterChangedProperty.deliveryChannels, filter: { ...this.filter } });
        this.filterSubject$.next({ property: FilterChangedProperty.sort, filter: { ...this.filter } });
        this.filterSubject$.next({ property: FilterChangedProperty.sortDirection, filter: { ...this.filter } });
        this.filterSubject$.next({ property: FilterChangedProperty.keyword, filter: { ...this.filter } });
        this.filterSubject$.next({ property: FilterChangedProperty.elementIds, filter: { ...this.filter } });
      }
      this.filterInitialized = true;
    }
  }

  setLayout(value: 'list' | 'grid') {
    this.filter.layout = value;
    this.filterSubject$.next({ property: FilterChangedProperty.layout, filter: { ...this.filter } });
  }

  setPage(value: number) {
    this.filter.page = value;
    this.filterSubject$.next({ property: FilterChangedProperty.page, filter: { ...this.filter } });
    this.sendRequest();
  }

  private resetPage() {
    this.filter.page = 0;
    this.filterSubject$.next({ property: FilterChangedProperty.page, filter: { ...this.filter } });
  }

  setPerPage(value: number) {
    this.filter.perPage = value;
    this.filterSubject$.next({ property: FilterChangedProperty.perPage, filter: { ...this.filter } });
    this.resetPage();
    this.sendRequest();
  }

  setCategory(value: number) {
    this.filter.categoryId = value;
    this.filterSubject$.next({ property: FilterChangedProperty.category, filter: { ...this.filter } });
    this.resetPage();
    this.sendRequest();
  }

  setOnlyPrinted(value: boolean) {
    this.filter.onlyPrinted = value;
    this.filterSubject$.next({ property: FilterChangedProperty.onlyPrinted, filter: { ...this.filter } });
    this.resetPage();
    this.sendRequest();
  }

  setColor(value: number, sendRequest: boolean = true) {
    this.filter.colorId = value;
    this.filterSubject$.next({ property: FilterChangedProperty.color, filter: { ...this.filter } });
    this.resetPage();
    if (sendRequest) this.sendRequest();
  }

  setDeliveryChannels(value: string[]) {
    this.filter.deliveryChannels = value;
    this.filterSubject$.next({ property: FilterChangedProperty.deliveryChannels, filter: { ...this.filter } });
    this.resetPage();
    this.sendRequest();
  }

  setAtRiskAsOf(value: string) {
    this.filter.atRiskAsOf = value;
    console.log(this.filter.atRiskAsOf);
    this.filterSubject$.next({ property: FilterChangedProperty.atRiskAsOf, filter: { ...this.filter } });
    this.resetPage();
    this.sendRequest();
  }

  setSort(value: string) {
    this.filter.sort = value;
    this.filterSubject$.next({ property: FilterChangedProperty.sort, filter: { ...this.filter } });
    this.resetPage();
    this.sendRequest();
  }

  setSortDirection(value: string) {
    this.filter.sortDirection = value;
    this.filterSubject$.next({ property: FilterChangedProperty.sortDirection, filter: { ...this.filter } });
    this.resetPage();
    this.sendRequest();
  }

  setKeyword(value: string, sendRequest: boolean = true) {
    this.filter.keyword = value;
    this.filterSubject$.next({ property: FilterChangedProperty.keyword, filter: { ...this.filter } });
    this.resetPage();
    if (sendRequest) this.sendRequest();
  }

  setElementIds(values: number[]) {
    this.filter.elementIds = values;
    this.filterSubject$.next({ property: FilterChangedProperty.elementIds, filter: { ...this.filter } });
    this.resetPage();
    this.sendRequest();
  }

  setCountry(values: string) {
    this.filter.country = values;
    this.filterSubject$.next({ property: FilterChangedProperty.country, filter: { ...this.filter } });
    this.resetPage();
    this.sendRequest();
  }

  setExlcudeCategoryId(values: number[]) {
    this.filter.excludeCategoryIds = values;
    this.filterSubject$.next({ property: FilterChangedProperty.excludeCategoryIds, filter: { ...this.filter } });
    this.resetPage();
    this.sendRequest();
  }

  setExcludeSelectedCategoryIds(value: boolean) {
    this.filter.excludeSelectedCategoyIds = value;
    this.filterSubject$.next({ property: FilterChangedProperty.excludeSelectedCategoyIds, filter: { ...this.filter } });
    this.resetPage();
    this.sendRequest();
  }

  setSelectedPartsListUuid(value: string) {
    this.selectedPartsListUuid = value;
    this.selectedPartsListUuidSubject$.next(this.selectedPartsListUuid);
  }

  addToWishList(value: number) {
    this.wishList.push(value);
    localStorage.setItem('favorites', JSON.stringify(this.wishList));
    this.wishListSubject$.next(this.wishList.slice());
  }

  removeFromWishList(value: number) {
    this.wishList = this.wishList.filter(i => i !== value);
    localStorage.setItem('favorites', JSON.stringify(this.wishList));
    this.wishListSubject$.next(this.wishList.slice());
  }

  addToHaveItList(value: number) {
    this.haveItList.push(value);
    localStorage.setItem('haveIts', JSON.stringify(this.haveItList));
    this.haveItListSubject$.next(this.haveItList.slice());
  }

  removeFromHaveItList(value: number) {
    this.haveItList = this.haveItList.filter(i => i !== value);
    localStorage.setItem('haveIts', JSON.stringify(this.haveItList));
    this.haveItListSubject$.next(this.haveItList.slice());
  }

  sendRequest() {
    this.isLoading = true;
    this.isLoadingSubject$.next(true);
    this.initFilter();

    console.log(JSON.stringify(this.filter.atRiskAsOf));
    localStorage.setItem('browsePartsFilter', JSON.stringify(this.filter));

    const request: GetPickABrickPartsRequest = {
      page: this.filter.page + 1,
      limit: this.filter.perPage,
      country: this.filter.country,
      categoryId: this.filter.categoryId === 9999 ? null : this.filter.categoryId,
      colorIds: this.filter.colorId !== null ? [this.filter.colorId] : [],
      keywords: this.filter.keyword ? this.filter.keyword.split(' ') : [],
      sortField: this.filter.sort,
      sortDir: this.filter.sortDirection,
      deliveryChannels: this.filter.deliveryChannels,
      onlyPrinted: this.filter.onlyPrinted,
      excludeCategoryIds: this.filter.excludeSelectedCategoyIds ? this.filter.excludeCategoryIds : [],
      designIds: [],
      elementIds: this.filter.elementIds,
      atRiskAsOf: this.filter.atRiskAsOf,
    };

    this.birckHunterApiService.getPickABrickParts(request).subscribe(response => {
      this.bricks = response.bricks as BrowsePartsPart[];
      this.categories = response.categories as BrowsePartCategory[];
      this.colors = response.colors;
      this.countries = response.countries as BrowsePartCountry[];
      this.filter.totalParts = response.page.total;
      this.bricksSubject$.next(this.bricks.slice());
      this.categoriesSubject$.next(this.categories.slice());
      this.colorsSubject$.next(this.colors.slice());
      this.countriesSubject$.next(this.countries.slice());
      this.filterSubject$.next({ property: FilterChangedProperty.totalParts, filter: { ...this.filter } });

      this.isLoading = false;
      this.isLoadingSubject$.next(false);
    });
  }
}

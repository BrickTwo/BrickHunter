import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BrickHunterApiService } from 'src/app/core/http/brickhunterapi.service';
import { GetPickABrickPartsRequest } from 'src/app/models/brickhunter-api';
import { BrowsePartsPart } from 'src/app/models/browse-parts';
import { BrowsePartCategory } from 'src/app/models/browse-parts/_browse-parts-vategory.model';

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
  color,
  deliveryChannels,
  sort,
  sortDirection,
  keyword,
}

export interface Filter {
  layout: 'list' | 'grid';
  page: number;
  perPage: number;
  totalParts: number;
  categoryId: number;
  onlyPrinted: boolean;
  colorId: number;
  deliveryChannels: string[];
  sort: string;
  sortDirection: string;
  keyword: string;
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
    colorId: null,
    deliveryChannels: ['pab', 'bap', 'oos'],
    sort: 'NAME',
    sortDirection: 'ASC',
    keyword: '',
  };
  private bricksSubject$ = new Subject<BrowsePartsPart[]>();
  bricksChanged$ = this.bricksSubject$.asObservable();
  bricks: BrowsePartsPart[];

  private categoriesSubject$ = new Subject<BrowsePartCategory[]>();
  categoriesChanged$ = this.categoriesSubject$.asObservable();
  categories: BrowsePartCategory[];

  private colorsSubject$ = new Subject<number[]>();
  colorsChanged$ = this.colorsSubject$.asObservable();
  colors: number[];

  constructor(private readonly birckHunterApiService: BrickHunterApiService) {}

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

  setColor(value: number) {
    this.filter.colorId = value;
    this.filterSubject$.next({ property: FilterChangedProperty.color, filter: { ...this.filter } });
    this.resetPage();
    this.sendRequest();
  }

  setDeliveryChannels(value: string[]) {
    this.filter.deliveryChannels = value;
    this.filterSubject$.next({ property: FilterChangedProperty.deliveryChannels, filter: { ...this.filter } });
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

  setKeyword(value: string) {
    this.filter.keyword = value;
    this.filterSubject$.next({ property: FilterChangedProperty.keyword, filter: { ...this.filter } });
    this.resetPage();
    this.sendRequest();
  }

  sendRequest() {
    const request: GetPickABrickPartsRequest = {
      page: this.filter.page + 1,
      limit: this.filter.perPage,
      country: 'de',
      categoryId: this.filter.categoryId === 9999 ? null : this.filter.categoryId,
      colorId: this.filter.colorId,
      keywords: this.filter.keyword ? this.filter.keyword.split(' ') : [],
      sortField: this.filter.sort,
      sortDir: this.filter.sortDirection,
      deliveryChannels: this.filter.deliveryChannels,
      onlyPrinted: this.filter.onlyPrinted,
      excludeCategoryIds: [],
      designIds: [],
      elementIds: [],
    };

    this.birckHunterApiService.getPickABrickParts(request).subscribe(response => {
      this.bricks = response.bricks as BrowsePartsPart[];
      this.categories = response.categories as BrowsePartCategory[];
      this.colors = response.colors;
      this.filter.totalParts = response.page.total;
      this.bricksSubject$.next(this.bricks.slice());
      this.categoriesSubject$.next(this.categories.slice());
      this.colorsSubject$.next(this.colors.slice());
      this.filterSubject$.next({ property: FilterChangedProperty.totalParts, filter: { ...this.filter } });
    });
  }
}

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
}

export interface Filter {
  layout: 'list' | 'grid';
  page: number;
  perPage: number;
  totalParts: number;
  categoryId: number;
  onlyPrinted: boolean;
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
  };
  private bricksSubject$ = new Subject<BrowsePartsPart[]>();
  bricksChanged$ = this.bricksSubject$.asObservable();
  bricks: BrowsePartsPart[];

  private categoriesSubject$ = new Subject<BrowsePartCategory[]>();
  categoriesChanged$ = this.categoriesSubject$.asObservable();
  categories: BrowsePartCategory[];

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

  sendRequest() {
    const request: GetPickABrickPartsRequest = {
      page: this.filter.page + 1,
      limit: this.filter.perPage,
      country: 'de',
      categoryId: this.filter.categoryId === 9999 ? null : this.filter.categoryId,
      colorId: null,
      keywords: [],
      sortField: '',
      sortDir: '',
      showAll: false,
      onlyPrinted: this.filter.onlyPrinted,
      excludeCategoryIds: [],
      designIds: [],
      elementIds: [],
    };

    this.birckHunterApiService.getPickABrickParts(request).subscribe(response => {
      this.bricks = response.bricks as BrowsePartsPart[];
      this.categories = response.categories as BrowsePartCategory[];
      this.filter.totalParts = response.page.total;
      this.bricksSubject$.next(this.bricks.slice());
      this.categoriesSubject$.next(this.categories.slice());
      this.filterSubject$.next({ property: FilterChangedProperty.totalParts, filter: { ...this.filter } });
    });
  }
}

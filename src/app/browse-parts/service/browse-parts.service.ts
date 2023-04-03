import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BrickHunterApiService } from 'src/app/core/http/brickhunterapi.service';
import { GetPickABrickPartsRequest } from 'src/app/models/brickhunter-api';
import { BrowsePartsPart } from 'src/app/models/browse-parts';

export interface FilterChanged {
  property: FilterChangedProperty;
  filter: Filter;
}

export enum FilterChangedProperty {
  layout,
  page,
  perPage,
  totalParts,
}

export interface Filter {
  layout: 'list' | 'grid';
  page: number;
  perPage: number;
  totalParts: number;
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
  };
  private bricksSubject$ = new Subject<BrowsePartsPart[]>();
  bricksChanged$ = this.bricksSubject$.asObservable();
  bricks: BrowsePartsPart[];

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

  setPerPage(value: number) {
    this.filter.perPage = value;
    this.filterSubject$.next({ property: FilterChangedProperty.perPage, filter: { ...this.filter } });
    this.sendRequest();
  }

  sendRequest() {
    const request: GetPickABrickPartsRequest = {
      page: this.filter.page + 1,
      limit: this.filter.perPage,
      country: 'de',
      categoryId: null,
      colorId: null,
      keywords: [],
      sortField: '',
      sortDir: '',
      showAll: false,
      excludeCategoryIds: [],
      designIds: [],
      elementIds: [],
    };

    this.birckHunterApiService.getPickABrickParts(request).subscribe(response => {
      this.bricks = response.bricks as BrowsePartsPart[];
      this.filter.totalParts = response.page.total;
      this.bricksSubject$.next(this.bricks.slice());
      this.filterSubject$.next({ property: FilterChangedProperty.totalParts, filter: { ...this.filter } });
    });
  }
}

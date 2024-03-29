import { Component, OnDestroy, OnInit } from '@angular/core';
import { BrowsePartsService, FilterChangedProperty } from '../../service/browse-parts.service';
import { BrowsePartsPart } from 'src/app/models/browse-parts';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-browse-parts-data-view',
  templateUrl: './browse-parts-data-view.component.html',
  styleUrls: ['./browse-parts-data-view.component.scss'],
})
export class BrowsePartsDataViewComponent implements OnInit, OnDestroy {
  layout = 'grid';
  parts: BrowsePartsPart[];
  filterSubscription: Subscription;
  partsSubscription: Subscription;
  isLoadingSubscirption: Subscription;
  showFromIndex = 0;
  showToIndex = 0;
  totalRows = 0;
  rowsTop = 0;
  rowsBottom = 0;
  gridRef: HTMLElement;
  isLoading: boolean;

  scrollSubscription: Subscription;
  resizeSubscription: Subscription;

  constructor(private readonly browsePartsService: BrowsePartsService) {}

  ngOnInit() {
    this.isLoading = this.browsePartsService.isLoading;

    this.isLoadingSubscirption = this.browsePartsService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.filterSubscription = this.browsePartsService.filterState$.subscribe(filterChanged => {
      switch (filterChanged.property) {
        case FilterChangedProperty.layout:
          this.layout = filterChanged.filter.layout;
      }
    });

    this.partsSubscription = this.browsePartsService.bricksChanged$.subscribe(parts => {
      this.parts = parts;
      this.calcVisible();
    });

    this.gridRef = document.getElementById('pabparts');

    this.calcVisible();

    this.scrollSubscription = fromEvent(window, 'scroll').subscribe((e: Event) => {
      this.calcVisible();
    });

    this.resizeSubscription = fromEvent(window, 'resize').subscribe((e: Event) => {
      this.calcVisible();
    });

    this.browsePartsService.sendRequest();
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) this.filterSubscription.unsubscribe();
    if (this.partsSubscription) this.partsSubscription.unsubscribe();
    if (this.isLoadingSubscirption) this.isLoadingSubscirption.unsubscribe();
    if (this.scrollSubscription) this.scrollSubscription.unsubscribe();
    if (this.resizeSubscription) this.resizeSubscription.unsubscribe();
  }

  trackItem(index: number, item: any) {
    return item ? item.elementId : null;
  }

  getTopStyle() {
    return `height: ${this.rowsTop * 328}px`;
  }

  getBottomStyle() {
    return `height: ${this.rowsBottom * 328}px`;
  }

  getParts() {
    return this.parts?.slice(this.showFromIndex, this.showToIndex);
  }

  calcVisible() {
    const rowHigh = 328;
    const colWidth = 200;
    const rect = this.gridRef.getBoundingClientRect();
    const cols = Math.floor(rect.width / colWidth);
    const rows = Math.ceil(this.parts?.length / cols);
    const colsVisible = Math.ceil(window.innerHeight / rowHigh);

    this.totalRows = rows;

    let rowsTop = 0;
    let rowsBottom = 0;

    if (Math.floor(rect.top) < 0) {
      rowsTop = Math.floor((rect.top * -1) / rowHigh);
    }

    if (Math.floor(window.innerHeight - rect.bottom) < 0) {
      rowsBottom = Math.ceil(((window.innerHeight - rect.bottom) * -1) / rowHigh);
    }

    rowsTop = rowsTop - 1;
    this.rowsTop = rowsTop < 0 ? 0 : rowsTop;

    rowsBottom = rows - this.rowsTop - colsVisible - 2;
    this.rowsBottom = rowsBottom < 0 ? 0 : rowsBottom;

    let firstCel = rowsTop * cols;
    let lastCel = firstCel + (colsVisible + 2) * cols;

    this.showFromIndex = firstCel < 0 ? 0 : firstCel;
    this.showToIndex = lastCel;
  }
}

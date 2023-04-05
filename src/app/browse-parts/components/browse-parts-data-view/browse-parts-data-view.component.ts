import { Component, OnDestroy, OnInit } from '@angular/core';
import { BrowsePartsService, FilterChangedProperty } from '../../service/browse-parts.service';
import { BrowsePartsPart } from 'src/app/models/browse-parts';
import { Observable, Subscription, fromEvent, of } from 'rxjs';

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
  showFromIndex = 0;
  showToIndex = 0;
  rowsTop = 0;
  rowsBottom = 0;
  constructor(private readonly browsePartsService: BrowsePartsService) {}

  ngOnInit() {
    this.filterSubscription = this.browsePartsService.filterState$.subscribe(filterChanged => {
      switch (filterChanged.property) {
        case FilterChangedProperty.layout:
          this.layout = filterChanged.filter.layout;
      }
    });

    this.partsSubscription = this.browsePartsService.bricksChanged$.subscribe(parts => {
      this.parts = parts;
    });

    this.calcVisible();

    fromEvent(window, 'scroll').subscribe((e: Event) => {
      this.calcVisible();
    });

    fromEvent(window, 'resize').subscribe((e: Event) => {
      this.calcVisible();
    });

    this.browsePartsService.sendRequest();
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) this.filterSubscription.unsubscribe();
    if (this.partsSubscription) this.partsSubscription.unsubscribe();
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
    console.log(this.parts, this.showFromIndex, this.showToIndex);
    return this.parts?.slice(this.showFromIndex, this.showToIndex);
  }

  calcVisible() {
    const elref = document.getElementById('pabparts');
    const rect = elref.getBoundingClientRect();
    const cols = Math.floor(rect.width / 200);
    const rows = Math.floor(rect.height / 328);
    const colsVisible = Math.ceil(window.innerHeight / 328);

    let rowsTop = 0;
    let rowsBottom = 0;

    if (Math.floor(rect.top) < 0) {
      rowsTop = Math.floor((rect.top * -1) / 328);
    }

    if (Math.floor(window.innerHeight - rect.bottom) < 0) {
      rowsBottom = Math.ceil(((window.innerHeight - rect.bottom) * -1) / 328);
    }

    rowsTop = rowsTop - 1;
    rowsBottom = rowsBottom;

    this.rowsTop = rowsTop;
    this.rowsBottom = rows - rowsTop - colsVisible - 2;

    let firstCel = rowsTop * cols;
    let lastCel = firstCel + (colsVisible + 2) * cols - 1;

    this.showFromIndex = firstCel;
    this.showToIndex = lastCel;
  }
}

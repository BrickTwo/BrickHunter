import { Component, OnDestroy, OnInit } from '@angular/core';
import { BrowsePartsService, FilterChangedProperty } from '../../service/browse-parts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-browse-parts-page-settings',
  templateUrl: './browse-parts-page-settings.component.html',
  styleUrls: ['./browse-parts-page-settings.component.scss'],
})
export class BrowsePartsPageSettingsComponent implements OnInit, OnDestroy {
  page: number = 0;
  perPage: number = 25;
  totalParts: number = 0;
  filterSubscription: Subscription;

  options = [
    { label: 25, value: 25 },
    { label: 50, value: 50 },
    { label: 100, value: 100 },
    { label: 500, value: 500 },
    { label: 1000, value: 1000 },
  ];

  layout: 'grid' | 'list' = 'grid';

  layoutOptions: any[] = [
    { icon: 'fa fa-border-all', value: 'grid' },
    { icon: 'fa fa-bars', value: 'list' },
  ];

  onPageChange(page: number) {
    this.browsePartsService.setPage(page);
  }

  constructor(private readonly browsePartsService: BrowsePartsService) {}

  ngOnInit(): void {
    this.layout = this.browsePartsService.filter.layout;
    this.page = this.browsePartsService.filter.page;
    this.totalParts = this.browsePartsService.filter.totalParts;
    this.perPage = this.browsePartsService.filter.perPage;

    this.browsePartsService.filterState$.subscribe(filterChanged => {
      switch (filterChanged.property) {
        case FilterChangedProperty.layout:
          this.layout = filterChanged.filter.layout;
          break;
        case FilterChangedProperty.page:
          this.page = filterChanged.filter.page;
          break;
        case FilterChangedProperty.totalParts:
          this.totalParts = filterChanged.filter.totalParts;
          break;
        case FilterChangedProperty.perPage:
          this.perPage = filterChanged.filter.perPage;
          break;
      }
    });
  }

  onLayoutChanged(layout: 'grid' | 'list') {
    this.browsePartsService.setLayout(layout);
  }

  onPerPageChange() {
    this.browsePartsService.setPerPage(this.perPage);
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) this.filterSubscription.unsubscribe();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { BrowsePartsService, FilterChangedProperty } from '../../service/browse-parts.service';
import { Subscription } from 'rxjs';
import { ICountry } from 'src/app/models/global';
import { LocaleService } from 'src/app/core/services/locale.service';
import { BrowsePartCountry } from 'src/app/models/browse-parts';

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
  countrySubscirption: Subscription;
  countries: BrowsePartCountry[];
  selectedCountry: BrowsePartCountry;
  timezoneOffset = '+0000';

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

  constructor(private readonly browsePartsService: BrowsePartsService, private readonly localeService: LocaleService) {}

  ngOnInit(): void {
    this.timezoneOffset = new Date().getTimezoneOffset().toString();
    this.layout = this.browsePartsService.filter.layout;
    this.page = this.browsePartsService.filter.page;
    this.totalParts = this.browsePartsService.filter.totalParts;
    this.perPage = this.browsePartsService.filter.perPage;
    this.countries = this.browsePartsService.countries;

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

    this.countrySubscirption = this.browsePartsService.countries$.subscribe(countries => {
      this.countries = countries;
      this.selectedCountry = this.countries.find(c => c.countryCode === this.browsePartsService.filter.country);
    });
  }

  onLayoutChanged(layout: 'grid' | 'list') {
    this.browsePartsService.setLayout(layout);
  }

  onPerPageChange() {
    this.browsePartsService.setPerPage(this.perPage);
  }

  onPageChange(page: number) {
    this.browsePartsService.setPage(page);
  }

  onCountrySelect() {
    this.browsePartsService.setCountry(this.selectedCountry.countryCode);
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) this.filterSubscription.unsubscribe();
    if (this.countrySubscirption) this.countrySubscirption.unsubscribe();
  }
}

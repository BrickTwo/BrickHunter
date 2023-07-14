import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BrowsePartsService, FilterChangedProperty } from '../../service/browse-parts.service';

@Component({
  selector: 'app-browse-parts-filter',
  templateUrl: './browse-parts-filter.component.html',
  styleUrls: ['./browse-parts-filter.component.scss'],
})
export class BrowsePartsFilterComponent implements OnInit, OnDestroy {
  keyword: string;

  sortOptions = [
    {
      value: 'NAME',
      name: 'Name',
    },
    {
      value: 'ELEMENTID',
      name: 'Element Id',
    },
    {
      value: 'DESIGNID',
      name: 'Design Id',
    },
    {
      value: 'PRICEAMOUNT',
      name: 'Price',
    },
    // {
    //   value: 'MAXAMOUNT',
    //   name: 'Max Order Quantity',
    // },
    {
      value: 'FIRSTSEEN',
      name: 'First Availability',
    },
    {
      value: 'CREATEDATEBRICK',
      name: 'Create Date',
    },
  ];
  selectedSort = 'NAME';
  sortDirection = 'DESC';

  keywordOptions = [
    { name: 'Name', value: 'name' },
    { name: 'Element Id', value: 'elementId' },
    { name: 'Desing Id', value: 'designId' },
  ];
  keywordOption = ['name', 'elementId', 'designId'];
  deliveryChannelOptions = [
    { name: 'Bestseller', value: 'pab' },
    { name: 'Standard', value: 'bap' },
    { name: 'Out Of Stock', value: 'oos' },
    { name: 'Not Listed', value: 'NotListed' },
  ];
  deliveryChannels = ['pab', 'bap', 'oos'];
  onlyPrinted = false;
  atRiskAfter: Date = null;
  minDate: Date = new Date(Date.now());
  filterSubscription: Subscription;

  constructor(private readonly browsePartsService: BrowsePartsService) {}

  ngOnInit(): void {
    this.keyword = this.browsePartsService.filter.keyword;
    this.onlyPrinted = this.browsePartsService.filter.onlyPrinted;
    this.deliveryChannels = this.browsePartsService.filter.deliveryChannels;
    this.selectedSort = this.browsePartsService.filter.sort;
    this.sortDirection = this.browsePartsService.filter.sortDirection;

    this.filterSubscription = this.browsePartsService.filterState$.subscribe(filterChanged => {
      switch (filterChanged.property) {
        case FilterChangedProperty.keyword:
          this.keyword = filterChanged.filter.keyword;
          break;
        case FilterChangedProperty.onlyPrinted:
          this.onlyPrinted = filterChanged.filter.onlyPrinted;
          break;
        case FilterChangedProperty.atRiskAfter:
          this.atRiskAfter = new Date(filterChanged.filter.atRiskAfter);
          break;
        case FilterChangedProperty.deliveryChannels:
          this.deliveryChannels = filterChanged.filter.deliveryChannels;
          break;
        case FilterChangedProperty.sort:
          this.selectedSort = filterChanged.filter.sort;
          break;
        case FilterChangedProperty.sortDirection:
          this.sortDirection = filterChanged.filter.sortDirection;
          break;
      }
    });
  }

  onChangeKeyword(value: string) {
    this.browsePartsService.setKeyword(value);
  }

  onChangeSort(value: string) {
    this.browsePartsService.setSort(value);
  }

  onChangeSortDirection() {
    if (this.sortDirection === 'DESC') {
      this.sortDirection = 'ASC';
    } else {
      this.sortDirection = 'DESC';
    }
    this.browsePartsService.setSortDirection(this.sortDirection);
  }

  onChangeOnlyPrinted(value: boolean) {
    this.browsePartsService.setOnlyPrinted(value);
  }

  onDeliveryChannelsChange(value: string[]) {
    this.browsePartsService.setDeliveryChannels(value);
  }

  onChangeAtRiskAfter(value) {
    const date = `${this.atRiskAfter.getFullYear()}-${(this.atRiskAfter.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-01`;
    console.log(date);
    this.browsePartsService.setAtRiskAfter(date);
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) this.filterSubscription.unsubscribe();
  }
}

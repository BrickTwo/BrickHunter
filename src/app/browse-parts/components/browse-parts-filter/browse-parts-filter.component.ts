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
    {
      value: 'MAXAMOUNT',
      name: 'Max Order Quantity',
    },
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
  filterSubscription: Subscription;

  constructor(private readonly browsePartsService: BrowsePartsService) {}

  ngOnInit(): void {
    this.onlyPrinted = this.browsePartsService.filter.onlyPrinted;
    this.deliveryChannels = this.browsePartsService.filter.deliveryChannels;
    this.selectedSort = this.browsePartsService.filter.sort;
    this.sortDirection = this.browsePartsService.filter.sortDirection;

    this.filterSubscription = this.browsePartsService.filterState$.subscribe(filterChanged => {
      switch (filterChanged.property) {
        case FilterChangedProperty.onlyPrinted:
          this.onlyPrinted = filterChanged.filter.onlyPrinted;
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

  ngOnDestroy(): void {
    if (this.filterSubscription) this.filterSubscription.unsubscribe();
  }
}

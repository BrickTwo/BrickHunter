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
      value: 'DESCRIPTION',
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
  selectedSort = 'DESCRIPTION';
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
    { name: 'Not Listed', value: 'notListed' },
  ];
  deliveryChannel = ['pab', 'bap', 'oos'];
  onlyPrinted = false;
  filterSubscription: Subscription;

  constructor(private readonly browsePartsService: BrowsePartsService) {}

  ngOnInit(): void {
    this.filterSubscription = this.browsePartsService.filterState$.subscribe(filterChanged => {
      switch (filterChanged.property) {
        case FilterChangedProperty.onlyPrinted:
          this.onlyPrinted = filterChanged.filter.onlyPrinted;
      }
    });
  }

  onChangeSortDirection() {
    if (this.sortDirection === 'DESC') {
      this.sortDirection = 'ASC';
    } else {
      this.sortDirection = 'DESC';
    }
  }

  onChangeOnlyPrinted(value: boolean) {
    this.browsePartsService.setOnlyPrinted(value);
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) this.filterSubscription.unsubscribe();
  }
}

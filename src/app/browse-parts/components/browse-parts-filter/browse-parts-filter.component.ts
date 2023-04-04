import { Component } from '@angular/core';

@Component({
  selector: 'app-browse-parts-filter',
  templateUrl: './browse-parts-filter.component.html',
  styleUrls: ['./browse-parts-filter.component.scss'],
})
export class BrowsePartsFilterComponent {
  keyword: string;

  sortOptions = [
    {
      value: 'DESCRIPTION',
      name: 'Description',
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

  onChangeSortDirection() {
    if (this.sortDirection === 'DESC') {
      this.sortDirection = 'ASC';
    } else {
      this.sortDirection = 'DESC';
    }
  }
}

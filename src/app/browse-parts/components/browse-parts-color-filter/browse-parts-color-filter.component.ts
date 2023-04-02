import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-browse-parts-color-filter',
  templateUrl: './browse-parts-color-filter.component.html',
  styleUrls: ['./browse-parts-color-filter.component.scss'],
})
export class BrowsePartsColorFilterComponent implements OnInit {
  items: MenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'Red',
        command: () => {
          this.setColor();
        },
      },
      {
        label: 'Blue',
        command: () => {
          this.setColor();
        },
      },
    ];
  }

  setColor() {}
}

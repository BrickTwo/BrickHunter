import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BrowsePartsService } from '../../service/browse-parts.service';
import { Subscription } from 'dexie';
import { ColorService } from 'src/app/core/services/color.service';
import { IColor } from 'src/app/models/shared';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-browse-parts-color-filter',
  templateUrl: './browse-parts-color-filter.component.html',
  styleUrls: ['./browse-parts-color-filter.component.scss'],
})
export class BrowsePartsColorFilterComponent implements OnInit, OnDestroy {
  colorSubscription: Subscription;
  colors: number[];
  trans: MenuItem[];
  black: MenuItem[];
  brown: MenuItem[];
  red: MenuItem[];
  orange: MenuItem[];
  yellow: MenuItem[];
  green: MenuItem[];
  blue: MenuItem[];
  purple: MenuItem[];

  constructor(private readonly browsePartsService: BrowsePartsService, private readonly colorService: ColorService) {}

  ngOnInit() {
    this.colorSubscription = this.browsePartsService.colorsChanged$.subscribe(colors => {
      this.colors = colors;
      this.fillColors();
    });
  }

  private fillColors() {
    this.clearColors();
    this.colors.map(async colorId => {
      const color = await this.colorService.getColor(colorId);
      if (color.id === -1 || color.id === 999) return;

      color.categories.map(category => {
        switch (category.toLowerCase()) {
          case 'trans':
            this.trans.push(this.createMenuItem(color));
            break;
          case 'black':
            this.black.push(this.createMenuItem(color));
            break;
          case 'brown':
            this.brown.push(this.createMenuItem(color));
            break;
          case 'red':
            this.red.push(this.createMenuItem(color));
            break;
          case 'orange':
            this.orange.push(this.createMenuItem(color));
            break;
          case 'yellow':
            this.yellow.push(this.createMenuItem(color));
            break;
          case 'green':
            this.green.push(this.createMenuItem(color));
            break;
          case 'blue':
            this.blue.push(this.createMenuItem(color));
            break;
          case 'purple':
            this.purple.push(this.createMenuItem(color));
            break;
        }
      });
    });
  }

  private clearColors() {
    this.trans = [];
    this.black = [];
    this.brown = [];
    this.red = [];
    this.orange = [];
    this.yellow = [];
    this.green = [];
    this.blue = [];
    this.purple = [];
  }

  private createMenuItem(color: IColor): MenuItem {
    return {
      label: `
      <style>
      .color${color.id} {
        border: 1px solid black;
        width: 13px;
        height: 13px;
        margin-right: 5px;
        display: inline-block;
        background-color: #${color.rgb}
      }
      </style>
      <span class="flex align-content-start">
      <div
        class="flex-grow-0 flex-shrink-0 color${color.id}"></div>
      <span class="flex-grow-1 flex-shrink-1" style="white-space: nowrap">
        ${color?.externalIds.brickLink?.extDescrs[0]}
      </span>
    </span>`,
      escape: false,
      command: () => {
        this.setColor(color.id);
      },
    };
  }

  setColor(colorId: number) {
    this.browsePartsService.setColor(colorId);
  }

  ngOnDestroy(): void {
    if (this.colorSubscription) this.colorSubscription.unsubscribe();
  }
}

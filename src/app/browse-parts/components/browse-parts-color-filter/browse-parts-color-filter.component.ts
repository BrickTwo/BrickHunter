import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BrickHunterMenuItem } from 'src/app/shared/components/menu/menu.component';
import { BrowsePartsService } from '../../service/browse-parts.service';
import { Subscription } from 'dexie';
import { ColorService } from 'src/app/core/services/color.service';
import { Color } from 'src/app/models/shared';

@Component({
  selector: 'app-browse-parts-color-filter',
  templateUrl: './browse-parts-color-filter.component.html',
  styleUrls: ['./browse-parts-color-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BrowsePartsColorFilterComponent implements OnInit, OnDestroy {
  colorSubscription: Subscription;
  colors: number[];
  trans: BrickHunterMenuItem[];
  black: BrickHunterMenuItem[];
  brown: BrickHunterMenuItem[];
  red: BrickHunterMenuItem[];
  orange: BrickHunterMenuItem[];
  yellow: BrickHunterMenuItem[];
  green: BrickHunterMenuItem[];
  blue: BrickHunterMenuItem[];
  purple: BrickHunterMenuItem[];

  constructor(
    private readonly browsePartsService: BrowsePartsService,
    private readonly colorService: ColorService
  ) {}

  ngOnInit() {
    this.colorSubscription = this.browsePartsService.colors$.subscribe(colors => {
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
            this.trans = [...this.trans, this.createMenuItem(color)];
            break;
          case 'black':
            this.black = [...this.black, this.createMenuItem(color)];
            break;
          case 'brown':
            this.brown = [...this.brown, this.createMenuItem(color)];
            break;
          case 'red':
            this.red = [...this.red, this.createMenuItem(color)];
            break;
          case 'orange':
            this.orange = [...this.orange, this.createMenuItem(color)];
            break;
          case 'yellow':
            this.yellow = [...this.yellow, this.createMenuItem(color)];
            break;
          case 'green':
            this.green = [...this.green, this.createMenuItem(color)];
            break;
          case 'blue':
            this.blue = [...this.blue, this.createMenuItem(color)];
            break;
          case 'purple':
            this.purple = [...this.purple, this.createMenuItem(color)];
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

  private createMenuItem(color: Color): BrickHunterMenuItem {
    return {
      label: color.externalIds.brickLink?.extDescrs[0],
      swatch: { rgb: `#${color.rgb}` },
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

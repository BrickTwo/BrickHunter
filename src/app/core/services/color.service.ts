import { Injectable } from '@angular/core';
import { IColor } from 'src/app/models/parts-list';
import { BrickHunterApiService } from '../http/brickhunterapi.service';
import { IndexedDBService } from './indexeddb.service.ts';

@Injectable()
export class ColorService {
  colors: IColor[];

  constructor(
    private readonly brickhunterApiService: BrickHunterApiService,
    private readonly indexedDbService: IndexedDBService
  ) {
    this.loadColors();
    this.brickhunterApiService.getRebrickableColors().subscribe({
      next: colors => {
        this.colors = colors as unknown as IColor[];
        this.indexedDbService.colors.bulkPut(this.colors);
      },
    });
  }

  private async loadColors() {
    this.colors = await this.indexedDbService.colors.toArray();
  }

  public brickLinkToRebrickable(colorId?: number): number {
    if (!colorId) return -1;
    const color = this.colors.find(color => {
      return color.externalIds.brickLink?.extIds.find(id => {
        return id === colorId;
      });
    });

    return color ? color.id : -1;
  }

  public async getColor(colorId: number | undefined, type: string = null): Promise<IColor> {
    if (colorId == undefined) return this.colors[0];

    if (!this.colors) {
      await this.loadColors();
    }

    const color = this.colors.find(color => {
      switch (type) {
        case 'BrickLink':
          return color.externalIds.brickLink?.extIds.find(id => {
            return id === colorId;
          });
        case 'Rebrickable': {
          return color.id === colorId;
        }
        default:
          return color.id === colorId;
      }
    });

    return color ? color : this.colors[0];
  }
}

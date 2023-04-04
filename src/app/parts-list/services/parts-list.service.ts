import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GlobalSettingsService } from 'src/app/core/services/global-settings.service';
import { IndexedDBService } from '../../core/services/indexeddb.service.ts';
import { IPart, IPartsList } from '../../models/parts-list';

@Injectable({ providedIn: 'root' })
export class PartsListService {
  partsListsChanged = new Subject<IPartsList[]>();

  private partsLists: IPartsList[] = [];

  constructor(
    private readonly indexedDBService: IndexedDBService,
    private readonly gloabSettingsService: GlobalSettingsService
  ) {
    this.indexedDBService.partsLists.toArray().then(partsLists => {
      this.setPartsLists(partsLists);
    });
  }

  setPartsLists(partsLists: IPartsList[]) {
    this.partsLists = partsLists;
    this.partsListsChanged.next(this.partsLists.slice());
  }

  getPartsLists() {
    return this.partsLists.slice();
  }

  getPartsList(uuid: string) {
    return this.partsLists.find(p => p.uuid === uuid);
  }

  addPartsList(partsList: IPartsList) {
    this.indexedDBService.partsLists.add(partsList);
    this.partsLists.push(partsList);
    this.partsListsChanged.next(this.partsLists.slice());
  }

  updatePartsList(newPartsList: IPartsList) {
    let partsList = this.partsLists.find(p => p.uuid === newPartsList.uuid);
    partsList = newPartsList;
    this.indexedDBService.partsLists.put(partsList, partsList.uuid);
    this.partsListsChanged.next(this.partsLists.slice());
  }

  deletePartsList(uuid: string) {
    this.indexedDBService.partsLists.delete(uuid);
    this.partsLists = this.partsLists.filter(p => p.uuid !== uuid);
    this.partsListsChanged.next(this.partsLists.slice());
  }

  getParts(uuid: string, filter: string) {
    const partsList = this.getPartsList(uuid);

    switch (filter) {
      case 'pab':
      case 'bap':
        return partsList?.parts?.filter(p => this.pabFilter(p, filter));
      case 'oos':
        return partsList?.parts?.filter(p => p.lego?.inStock === false);
      case 'brickLink':
        return partsList?.parts?.filter(p => this.brickLinkFilter(p));
      case 'warning':
        return partsList?.parts?.filter(p => {
          if (p.lego?.inStock === false) return true;
          if (p.lego && p.lego.maxOrderQuantity < p.qty) return true;
          return false;
        });
      default:
        return partsList?.parts.slice();
    }
  }

  private pabFilter(part: IPart, filter: string) {
    if (!part.lego) return false;
    if (part.lego.deliveryChannel !== filter) return false;
    if (!part.lego.inStock) return false;
    console.log(
      `${part.lego.price.amount} < ${part.maxPrice || 0} = `,
      part.lego.price.amount < (part.maxPrice || 0),
      ' | ',
      `${part.lego.price.amount} < ${0} = `,
      part.lego.price.amount < 0
    );
    if (
      !this.gloabSettingsService.ignoreBrickLinkPrices &&
      (part.maxPrice || 0) > 0 &&
      part.lego.price.amount > (part.maxPrice || 0)
    )
      return false;
    if (this.gloabSettingsService.subtractHaveFromQuantity && part.qty - part.have <= 0) return false;
    return true;
  }

  private brickLinkFilter(part: IPart) {
    if (this.gloabSettingsService.subtractHaveFromQuantity && part.qty - part.have <= 0) return false;
    if (!part.lego) return true;
    if (!part.lego.inStock) return true;
    if (
      !this.gloabSettingsService.ignoreBrickLinkPrices &&
      (part.maxPrice || 0) > 0 &&
      part.lego.price.amount > (part.maxPrice || 0)
    )
      return true;
    return false;
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GlobalSettingsService } from 'src/app/core/services/global-settings.service';
import { IndexedDBService } from '../../core/services/indexeddb.service.ts';
import { IPart, IPartsList } from '../../models/parts-list';
import { GuidService } from 'src/app/core/services/guid.service';

@Injectable({ providedIn: 'root' })
export class PartsListService {
  partsListsChangedSubject$ = new Subject<IPartsList[]>();
  partsListsChanged$ = this.partsListsChangedSubject$.asObservable();

  private partsLists: IPartsList[] = [];

  constructor(
    private readonly indexedDBService: IndexedDBService,
    private readonly gloabSettingsService: GlobalSettingsService,
    private readonly guidService: GuidService
  ) {
    this.indexedDBService.partsLists.toArray().then(partsLists => {
      this.setPartsLists(partsLists);
    });
  }

  setPartsLists(partsLists: IPartsList[]) {
    this.partsLists = partsLists;
    this.partsListsChangedSubject$.next(this.getPartsLists());
  }

  getPartsLists() {
    return this.partsLists.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())).slice();
  }

  getPartsList(uuid: string) {
    return this.partsLists.find(p => p.uuid === uuid);
  }

  addPartsList(partsList: IPartsList) {
    this.indexedDBService.partsLists.add(partsList);
    this.partsLists.push(partsList);
    this.partsListsChangedSubject$.next(this.getPartsLists());
  }

  createPartsList(name: string, source: string) {
    const partList: IPartsList = {
      uuid: this.guidService.generate(),
      name: name,
      source: source,
      parts: [],
    };

    this.addPartsList(partList);

    return partList;
  }

  updatePartsList(newPartsList: IPartsList) {
    let partsList = this.partsLists.find(p => p.uuid === newPartsList.uuid);
    partsList = newPartsList;
    this.indexedDBService.partsLists.put(partsList, partsList.uuid);
    this.partsListsChangedSubject$.next(this.getPartsLists());
  }

  deletePartsList(uuid: string) {
    this.indexedDBService.partsLists.delete(uuid);
    this.partsLists = this.partsLists.filter(p => p.uuid !== uuid);
    this.partsListsChangedSubject$.next(this.getPartsLists());
  }

  addPartToPartsList(uuid: string, newPart: IPart) {
    let partsList = this.partsLists.find(p => p.uuid === uuid);
    partsList.parts.push(newPart);

    if (partsList.source !== newPart.source.source) {
      partsList.source = 'Mixed';
    }

    this.indexedDBService.partsLists.put(partsList, partsList.uuid);
    this.partsListsChangedSubject$.next(this.getPartsLists());
  }

  updatePartInPartsList(uuid: string, newPart: IPart) {
    if (newPart.qty <= 0) {
      this.deletePartInPartsList(uuid, newPart.id);
      return;
    }

    const partsList = this.partsLists.find(p => p.uuid === uuid);
    let part = partsList.parts.find(p => p.id === newPart.id);
    part.qty = newPart.qty;
    part.have = newPart.have;

    this.indexedDBService.partsLists.put(partsList, partsList.uuid);
    this.partsListsChangedSubject$.next(this.getPartsLists());
  }

  deletePartInPartsList(uuid: string, partId: string) {
    const partsList = this.partsLists.find(p => p.uuid === uuid);
    partsList.parts = partsList.parts.filter(p => p.id !== partId);

    if (partsList.parts.every(p => p.source.source === partsList.parts[0].source.source)) {
      partsList.source = partsList.parts[0].source.source;
    }

    this.indexedDBService.partsLists.put(partsList, partsList.uuid);
    this.partsListsChangedSubject$.next(this.getPartsLists());
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

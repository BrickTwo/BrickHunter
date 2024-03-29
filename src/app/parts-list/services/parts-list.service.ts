import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GlobalSettingsService } from 'src/app/core/services/global-settings.service';
import { IndexedDBService } from '../../core/services/indexeddb.service.ts';
import { Part, PartsList } from '../../models/parts-list';
import { GuidService } from 'src/app/core/services/guid.service';

@Injectable({ providedIn: 'root' })
export class PartsListService {
  private partsListsChangedSubject$ = new Subject<PartsList[]>();
  partsListsChanged$ = this.partsListsChangedSubject$.asObservable();

  private partsLists: PartsList[] = [];

  constructor(
    private readonly indexedDBService: IndexedDBService,
    private readonly globalSettingsService: GlobalSettingsService,
    private readonly guidService: GuidService
  ) {
    this.indexedDBService.partsLists.toArray().then(partsLists => {
      partsLists.map(partsList => {
        if (!partsList.name) partsList.name = '';
      });

      this.setPartsLists(partsLists);
    });
  }

  setPartsLists(partsLists: PartsList[]) {
    this.partsLists = partsLists;
    this.partsListsChangedSubject$.next(this.getPartsLists());
  }

  getPartsLists() {
    return this.partsLists
      .filter(p => p.uuid !== 'multiple')
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      .slice();
  }

  getPartsList(uuid: string) {
    return this.partsLists.find(p => p.uuid === uuid);
  }

  addPartsList(partsList: PartsList) {
    if (partsList.uuid !== 'multiple') this.indexedDBService.partsLists.add(partsList);

    partsList.source = partsList.parts[0] ? partsList.parts[0].source.source : 'Mixed';
    partsList.parts.forEach(part => {
      if (partsList.source !== part.source.source) {
        partsList.source = 'Mixed';
      }
    });

    this.partsLists.push(partsList);
    this.partsListsChangedSubject$.next(this.getPartsLists());
  }

  createPartsList(name: string, source: string) {
    const partList: PartsList = {
      uuid: this.guidService.generate(),
      name: name,
      source: source,
      parts: [],
    };

    this.addPartsList(partList);

    return partList;
  }

  updatePartsList(newPartsList: PartsList) {
    let partsList = this.partsLists.find(p => p.uuid === newPartsList.uuid);
    partsList = newPartsList;
    if (partsList.uuid !== 'multiple') this.indexedDBService.partsLists.put(partsList, partsList.uuid);
    this.partsListsChangedSubject$.next(this.getPartsLists());
  }

  deletePartsList(uuid: string) {
    if (uuid !== 'multiple') this.indexedDBService.partsLists.delete(uuid);
    this.partsLists = this.partsLists.filter(p => p.uuid !== uuid);
    this.partsListsChangedSubject$.next(this.getPartsLists());
  }

  addPartToPartsList(uuid: string, newPart: Part) {
    let partsList = this.partsLists.find(p => p.uuid === uuid);

    const foundPart = partsList.parts.find(p => p.elementId === newPart.elementId);
    if (foundPart) {
      foundPart.qty += newPart.qty;
    } else {
      partsList.parts.push(newPart);
    }

    partsList.source = newPart.source.source;
    partsList.parts.forEach(part => {
      if (partsList.source !== part.source.source) {
        partsList.source = 'Mixed';
      }
    });

    if (partsList.uuid !== 'multiple') this.indexedDBService.partsLists.put(partsList, partsList.uuid);
    this.partsListsChangedSubject$.next(this.getPartsLists());
  }

  updatePartInPartsList(uuid: string, newPart: Part) {
    if (newPart.qty <= 0) {
      this.deletePartInPartsList(uuid, newPart.id);
      return;
    }

    const partsList = this.partsLists.find(p => p.uuid === uuid);
    let part = partsList.parts.find(p => p.id === newPart.id);
    part.qty = newPart.qty;
    part.have = newPart.have;

    if (partsList.uuid !== 'multiple') this.indexedDBService.partsLists.put(partsList, partsList.uuid);
    this.partsListsChangedSubject$.next(this.getPartsLists());
  }

  deletePartInPartsList(uuid: string, partId: string) {
    const partsList = this.partsLists.find(p => p.uuid === uuid);
    partsList.parts = partsList.parts.filter(p => p.id !== partId);

    if (partsList.parts.length && partsList.parts.every(p => p.source.source === partsList.parts[0].source.source)) {
      partsList.source = partsList.parts[0].source.source;
    }

    if (partsList.uuid !== 'multiple') this.indexedDBService.partsLists.put(partsList, partsList.uuid);
    this.partsListsChangedSubject$.next(this.getPartsLists());
  }

  getParts(uuid: string, filter: string) {
    const partsList = this.getPartsList(uuid);

    return this.filterParts(partsList?.parts, filter);
  }

  filterParts(parts: Part[], filter: string) {
    switch (filter) {
      case 'pab':
      case 'bap':
        return parts?.filter(p => this.pabFilter(p, filter));
      case 'oos':
        return parts?.filter(p => p.lego?.inStock === false);
      case 'brickLink':
        return parts?.filter(p => this.brickLinkFilter(p));
      case 'warning':
        return parts?.filter(p => {
          if (p.lego?.inStock === false) return true;
          if (p.lego && p.lego.maxOrderQuantity < p.qty) return true;
          return false;
        });
      default:
        return parts.slice();
    }
  }

  public pabFilter(part: Part, filter: string) {
    if (!part.lego) return false;
    if (part.lego.deliveryChannel !== filter) return false;
    if (!part.lego.inStock) return false;
    const brickLinkReferencePrice = this.calcTargetBrickLinkReferencePrice(part.maxPrice);
    if (
      !this.globalSettingsService.ignoreBrickLinkPrices &&
      brickLinkReferencePrice != -999999 &&
      part.lego.price.amount > brickLinkReferencePrice
    )
      return false;
    if (this.globalSettingsService.subtractHaveFromQuantity && part.qty - part.have <= 0) return false;
    return true;
  }

  public brickLinkFilter(part: Part) {
    if (this.globalSettingsService.subtractHaveFromQuantity && part.qty - part.have <= 0) return false;
    if (!part.lego) return true;
    if (!part.lego.inStock) return true;
    const brickLinkReferencePrice = this.calcTargetBrickLinkReferencePrice(part.maxPrice);
    if (
      !this.globalSettingsService.ignoreBrickLinkPrices &&
      brickLinkReferencePrice != -999999 &&
      part.lego.price.amount > brickLinkReferencePrice
    )
      return true;
    return false;
  }

  private calcTargetBrickLinkReferencePrice(value: number) {
    if (!this.globalSettingsService.subtractBrickLinkPrice && (value || 0) <= 0) return -999999;
    if (!this.globalSettingsService.subtractBrickLinkPrice && (value || 0) >= 0) return value || 0;
    if (this.globalSettingsService.subtractBrickLinkPriceUnit !== 'percentage')
      return (value || 0) + this.globalSettingsService.subtractBrickLinkPriceAmount;

    return (
      Math.round(
        (value || 0) + ((value || 0) / 100) * this.globalSettingsService.subtractBrickLinkPriceAmount * 10000
      ) / 10000
    );
  }
}

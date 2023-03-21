import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IndexedDBService } from '../core/services/indexeddb.service.ts';
import { IPartsList } from '../models/parts-list';

@Injectable({ providedIn: 'root' })
export class PartsListService {
  partsListsChanged = new Subject<IPartsList[]>();

  private partsLists: IPartsList[] = [];

  constructor(private readonly indexedDBService: IndexedDBService) {
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
    partsList.id = undefined;
    this.indexedDBService.partsLists.add(partsList);
    this.partsLists.push(partsList);
    this.partsListsChanged.next(this.partsLists.slice());
  }

  updatePartsList(newPartsList: IPartsList) {
    let partsList = this.partsLists.find(p => p.id === newPartsList.id);
    partsList = newPartsList;
    this.indexedDBService.partsLists.put(partsList, partsList.id);
    this.partsListsChanged.next(this.partsLists.slice());
  }

  deletePartsList(id: number) {
    this.indexedDBService.partsLists.delete(id);
    this.partsLists = this.partsLists.filter(p => p.id !== id);
    this.partsListsChanged.next(this.partsLists.slice());
  }
}

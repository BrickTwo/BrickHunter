import Dexie, { Table } from 'dexie';
import { Injectable } from '@angular/core';
import { IPartsList } from 'src/app/models/parts-list';

@Injectable()
export class IndexedDBService extends Dexie {
  partsLists!: Table<IPartsList, number>;

  constructor() {
    super('brickhunterdb');
    this.version(1).stores({
      partsLists: '++id,uuid',
    });
  }
}

import Dexie, { Table } from 'dexie';
import { Injectable } from '@angular/core';
import { IPartsList } from 'src/app/models/parts-list';

@Injectable()
export class IndexedDBService extends Dexie {
  partsLists!: Table<IPartsList, string>;
  partLists!: Table<any, string>;

  constructor() {
    super('brickhunterDB');
    this.version(1).stores({
      partsLists: 'uuid',
      partLists: '',
    });
  }
}

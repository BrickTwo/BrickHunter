import Dexie, { Table } from 'dexie';
import { Injectable } from '@angular/core';

@Injectable()
export class IndexedDBLegacyService extends Dexie {
  partLists!: Table<any, string>;

  constructor() {
    super('brickHunterDB');
    this.version(2)
      .stores({
        partLists: '',
      })
      .upgrade(transaction => {});
  }
}

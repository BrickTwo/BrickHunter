import Dexie, { Table } from 'dexie';
import { PartsList } from '../../parts-list/parts-list.model';

export class AppDB extends Dexie {
  partsLists!: Table<PartsList, number>;

  constructor() {
    super('brickhunterdb');
    this.version(1).stores({
      partsLists: '++id,uid',
    });
    // this.on('populate', () => this.populate());
  }

//   async populate() {
//     const partsListId = await db.partsLists.add({
//       title: 'To Do Today',
//     });
//   }
}

export const db = new AppDB();
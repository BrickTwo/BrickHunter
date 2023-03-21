import Dexie, { Table } from 'dexie';
import { IPartsList } from 'src/app/models/parts-list';

export class AppDB extends Dexie {
  partsLists!: Table<IPartsList, number>;

  constructor() {
    super('brickhunterdb');
    this.version(1).stores({
      partsLists: '++id,uuid',
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
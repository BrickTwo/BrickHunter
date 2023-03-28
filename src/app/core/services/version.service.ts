import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBrickHunterV1 } from 'src/app/models/brickhunter';
import { ImportService } from 'src/app/parts-list/services/import.service';
import { IndexedDBService } from './indexeddb.service.ts';

@Injectable()
export class VersionService {
  currentVersion = '2.0.9';

  constructor(private readonly importService: ImportService, private readonly indexedDbService: IndexedDBService) {
    const oldVersion = this.readVersion();
    this.updateStructure(oldVersion);
  }

  updateStructure(oldVersion: string) {
    if (this.isVersionGreater(oldVersion, '2.0.0')) {
      console.log('update');
      // clean local storage
      const rowKeys: string[] = [];
      this.indexedDbService
        .table('partLists')
        .toCollection()
        .modify((pl: IBrickHunterV1) => {
          const name = pl.name;
          const source = 'BrickHunterV1';

          new Observable<number>(subscriber => {
            this.importService.import(subscriber, name, source, pl);
          });

          rowKeys.push(pl.id);
        })
        .then(value => {
          this.indexedDbService.table('partLists').bulkDelete(rowKeys);
        });
    }

    localStorage.setItem('version', '2.0.8');
  }

  private readVersion() {
    const version = localStorage.getItem('version') || null;
    if (!version) return '0.0.0';
    return version;
  }

  private isVersionGreater(oldVersion: string, newVersion: string) {
    const oldVersionArray = oldVersion.split('.');
    const newVersionArray = newVersion.split('.');

    if (oldVersionArray[0] < newVersionArray[0]) return true;
    if (oldVersionArray[1] < newVersionArray[1]) return true;
    if (oldVersionArray[2] < newVersionArray[2]) return true;
    return false;
  }
}

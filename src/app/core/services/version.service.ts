import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBrickHunterV1 } from 'src/app/models/brickhunter';
import { ImportService } from 'src/app/parts-list/services/import.service';
import { IndexedDBService } from './indexeddb.service.ts';

@Injectable()
export class VersionService {
  oldVersion = '';
  currentVersion = '';
  devmode = false;

  constructor(private readonly importService: ImportService, private readonly indexedDbService: IndexedDBService) {
    this.oldVersion = this.readVersion();
    try {
      var manifestData = chrome.runtime.getManifest();
      this.currentVersion = manifestData.version;
    } catch (err) {
      this.currentVersion = '2.0.12';
      this.devmode = true;
    }
    this.updateStructure();
  }

  updateStructure() {
    if (this.isVersionGreater(this.oldVersion, '2.0.0')) {
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

    localStorage.setItem('version', this.currentVersion);
  }

  private readVersion() {
    const version = localStorage.getItem('version') || null;
    if (!version) return '0.0.0';
    return version;
  }

  isVersionGreater(oldVersion: string, newVersion: string) {
    const oldVersionArray = oldVersion.split('.');
    const newVersionArray = newVersion.split('.');

    if (Number(oldVersionArray[0]) < Number(newVersionArray[0])) return true;
    if (Number(oldVersionArray[1]) < Number(newVersionArray[1])) return true;
    if (Number(oldVersionArray[2]) < Number(newVersionArray[2])) return true;
    return false;
  }
}

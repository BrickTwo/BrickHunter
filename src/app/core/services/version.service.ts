import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BrickHunterV1 } from 'src/app/models/brickhunter';
import { ImportService } from 'src/app/parts-list/services/import.service';
import { IndexedDBService } from './indexeddb.service.ts';
import { IndexedDBLegacyService } from './indexeddb-legacy.service';

interface Migration {
  version2_0_0: {
    partsListCount: number;
    partsListMigrated: number;
    migrationStarted: boolean;
    migrationEnd: boolean;
  };
}

@Injectable()
export class VersionService {
  oldVersion = '';
  currentVersion = '';
  devmode = false;

  private migrationSubject$ = new Subject<Migration>();
  migration$ = this.migrationSubject$.asObservable();

  constructor(
    private readonly importService: ImportService,
    private readonly indexedDbService: IndexedDBService,
    private readonly indexedDbLegacyService: IndexedDBLegacyService
  ) {
    this.oldVersion = this.readVersion();
    try {
      var manifestData = chrome.runtime.getManifest();
      this.currentVersion = manifestData.version;
    } catch (err) {
      this.currentVersion = '2.0.21';
      this.devmode = true;
    }
    this.updateStructure();
  }

  async updateStructure() {
    if (this.isVersionGreater(this.oldVersion, '2.0.22')) {
      const partsList = await this.indexedDbLegacyService.table('partLists').toArray();
      let partsListMigrated = 0;

      let migrationModel = {
        version2_0_0: {
          partsListCount: partsList.length,
          partsListMigrated: 0,
          migrationStarted: true,
          migrationEnd: partsList.length ? false : true,
        },
      };

      this.migrationSubject$.next(migrationModel);

      // clean local storage
      //const rowKeys: string[] = [];

      this.indexedDbLegacyService
        .table('partLists')
        .toCollection()
        .modify((pl: BrickHunterV1) => {
          const name = pl.name;
          let source = 'BrickHunterV1';

          new Observable<number>(subscriber => {
            //if (source.toUpperCase() === 'BRICKLINK') source = 'BrickLink';
            this.importService.import(subscriber, name, source, pl);
          }).subscribe({
            complete: async () => {
              partsListMigrated = partsListMigrated + 1;
              this.indexedDbLegacyService.table('partLists').delete(pl.id);
              this.migrationSubject$.next({
                ...migrationModel,
                version2_0_0: {
                  ...migrationModel.version2_0_0,
                  partsListMigrated: partsListMigrated,
                },
              });

              if (partsList.length === partsListMigrated) {
                this.migrationSubject$.next({
                  ...migrationModel,
                  version2_0_0: {
                    ...migrationModel.version2_0_0,
                    migrationEnd: true,
                  },
                });
              }
            },
          });
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
    if (
      Number(oldVersionArray[0]) === Number(newVersionArray[0]) &&
      Number(oldVersionArray[1]) < Number(newVersionArray[1])
    )
      return true;
    if (
      Number(oldVersionArray[0]) === Number(newVersionArray[0]) &&
      Number(oldVersionArray[1]) === Number(newVersionArray[1]) &&
      Number(oldVersionArray[2]) < Number(newVersionArray[2])
    )
      return true;
    return false;
  }
}

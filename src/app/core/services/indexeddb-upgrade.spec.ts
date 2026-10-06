import Dexie from 'dexie';
import { IndexedDBService } from './indexeddb.service.ts';
import { IndexedDBLegacyService } from './indexeddb-legacy.service';

// Karma runs in a disposable browser origin, never the installed extension profile.
describe('Dexie upgrade preserves existing IndexedDB data', () => {
  const names = ['brickhunterDB', 'brickHunterDB'];
  const record = { uuid: 'persisted-list', name: 'Existing list', parts: [{ id: '300123', qty: 4, have: 1 }] };
  let db: Dexie | undefined;

  beforeEach(async () => {
    for (const name of names) await Dexie.delete(name);
  });
  afterEach(async () => {
    db?.close();
    db = undefined;
    for (const name of names) await Dexie.delete(name);
  });

  async function seed(name: string, version: number, modern: boolean, colors: boolean) {
    // Create pre-upgrade data with native IndexedDB, independent of the new Dexie implementation.
    const native = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(name, version);
      request.onupgradeneeded = () => {
        if (modern) request.result.createObjectStore('partsLists', { keyPath: 'uuid' });
        request.result.createObjectStore('partLists');
        if (colors) request.result.createObjectStore('colors', { keyPath: 'id' });
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = native.transaction(Array.from(native.objectStoreNames), 'readwrite');
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
        if (modern) transaction.objectStore('partsLists').put(record);
        transaction.objectStore('partLists').put({ name: 'Legacy list', parts: [{ qty: 7 }] }, 'legacy');
        if (colors) transaction.objectStore('colors').put({ id: 4, name: 'Existing red', rgb: 'FF0000' });
      });
    } finally {
      native.close();
    }
  }

  it('reopens version 2 without altering lists, colors, store names or database version', async () => {
    await seed('brickhunterDB', 20, true, true);
    const current = new IndexedDBService();
    db = current;
    await current.open();
    expect(await current.partsLists.get(record.uuid)).toEqual(record as any);
    expect(await current.colors.get(4)).toEqual({ id: 4, name: 'Existing red', rgb: 'FF0000' } as any);
    expect(current.backendDB().version).toBe(20);
    expect(Array.from(current.backendDB().objectStoreNames)).toEqual(['colors', 'partLists', 'partsLists']);
    await current.partsLists.update(record.uuid, { name: 'Updated list' });
    current.close();
    await current.open();
    expect((await current.partsLists.get(record.uuid)).name).toBe('Updated list');
    expect((await current.partsLists.get(record.uuid)).parts).toEqual(record.parts as any);
  });

  it('preserves the existing version-1 migration and initializes colors without losing lists', async () => {
    await seed('brickhunterDB', 10, true, false);
    const current = new IndexedDBService();
    db = current;
    await current.open();
    expect(current.backendDB().version).toBe(20);
    expect(await current.partsLists.get(record.uuid)).toEqual(record as any);
    expect((await current.partLists.get('legacy')).parts[0].qty).toBe(7);
    expect((await current.colors.get(-1)).name).toBe('[Unknown]');
  });

  it('keeps the differently capitalized legacy database readable without migrating its schema', async () => {
    await seed('brickHunterDB', 20, false, false);
    const legacy = new IndexedDBLegacyService();
    db = legacy;
    await legacy.open();
    expect((await legacy.partLists.get('legacy')).parts[0].qty).toBe(7);
    expect(legacy.backendDB().version).toBe(20);
    expect(Array.from(legacy.backendDB().objectStoreNames)).toEqual(['partLists']);
  });
});

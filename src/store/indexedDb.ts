import { IDBPDatabase, openDB } from "idb";
//import { isTypedArray } from 'util/types';

class IndexedDb {
  private database = "BrickHunter";
  private db: IDBPDatabase | undefined = undefined;

  public async createObjectStore() {
    try {
      this.db = await openDB(this.database, 2.0, {
        upgrade(db: IDBPDatabase) {
          const tableNames: string[] = ["PARTS_LIST", "PARTS"];
          for (const tableName of tableNames) {
            if (db.objectStoreNames.contains(tableName)) {
              continue;
            }
            db.createObjectStore(tableName, {
              autoIncrement: false,
              keyPath: "id",
            });
          }
        },
      });
    } catch (error) {
      return false;
    }
  }

  public async getValue(tableName: string, id: string) {
    if (!this.db) return;
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    //console.log("Get Data ", JSON.stringify(result));
    return result;
  }

  public async getAllValue(tableName: string) {
    if (!this.db) return;
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.getAll();
    //console.log("Get All Data", tableName, JSON.stringify(result));
    return result;
  }

  public async putValue(tableName: string, value: object) {
    if (!this.db) return;
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.put(value);
    //console.log("Put Data ", JSON.stringify(result));
    return result;
  }

  public async putBulkValue(tableName: string, values: object[]) {
    if (!this.db) return;
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    for (const value of values) {
      const result = await store.put(value);
      //console.log("Put Bulk Data ", JSON.stringify(result));
    }
    return this.getAllValue(tableName);
  }

  public async deleteValue(tableName: string, id: string) {
    if (!this.db) return;
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    if (!result) {
      //console.log("Id not found", id);
      return result;
    }
    await store.delete(id);
    //console.log("Deleted Data", id);
    return id;
  }
}

export default IndexedDb;

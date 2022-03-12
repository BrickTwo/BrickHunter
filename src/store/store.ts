import { reactive, readonly, watch, ref, Ref } from "vue";
//import { createStore, set, del, entries } from 'idb-keyval'
import IndexedDb from "@/store/indexedDb";

export interface StoreObject<T extends object> {
  entries: T[];
}

export abstract class Store<T extends object> {
  protected state: StoreObject<T>;

  constructor() {
    const data = this.data();
    // this.setup(data);
    this.state = reactive(data) as StoreObject<T>;
  }

  protected abstract data(): StoreObject<T>;

  // protected setup(data: T): void {}

  public getState(): StoreObject<T> {
    return readonly(this.state) as unknown as StoreObject<T>;
  }
}

export abstract class PersistentStore<T extends object> extends Store<T> {
  public isInitialized = ref(false);
  private indexedDb;
  private name;

  constructor(readonly storeName: string) {
    super();
    //this.customStore = createStore('BrickHunter', storeName);
    this.indexedDb = new IndexedDb();
    /*const runIndexDb = async () => {
            await this.indexedDb.createObjectStore();
        }
        runIndexDb();*/
    this.name = storeName;
  }

  async init() {
    if (!this.isInitialized.value) {
      await this.indexedDb.createObjectStore();
      //let stateFromIndexedDB = await entries(this.customStore);
      const stateFromIndexedDB = (await this.indexedDb.getAllValue(
        this.name
      )) as T[];
      if (stateFromIndexedDB) {
        stateFromIndexedDB.forEach((entry) => {
          this.state.entries.push(JSON.parse(JSON.stringify(entry)) as T);
        });
      }
      watch(
        () => this.state,
        () => {
          this.state.entries.forEach((entry) => {
            //set(entry.id, JSON.stringify(entry), this.customStore)
            this.indexedDb.putValue(
              this.name,
              JSON.parse(JSON.stringify(entry))
            );
          });
        },
        { deep: true }
      );

      this.isInitialized.value = true;
    }
  }

  delete(id: string) {
    console.log("store delete: ", id);
    //del(id, this.customStore);
    this.indexedDb.deleteValue(this.name, id);
  }

  getIsInitialized(): Ref<boolean> {
    return this.isInitialized;
  }
}

import { reactive, readonly, watch, ref, Ref } from "vue";
//import { createStore, set, del, entries } from 'idb-keyval'
import IndexedDb from "@/store/indexedDb";

export interface StoreObject<T1 extends object, T2 = undefined> {
  stored: { entries: T1[] };
  notStored: T2;
}

export abstract class Store<T1 extends object, T2 = undefined> {
  protected state: StoreObject<T1, T2>;

  constructor() {
    const data = this.data();
    // this.setup(data);
    this.state = reactive(data) as StoreObject<T1, T2>;
  }

  protected abstract data(): StoreObject<T1, T2>;

  // protected setup(data: T): void {}

  public getState(): StoreObject<T1, T2> {
    return readonly(this.state) as unknown as StoreObject<T1, T2>;
  }
}

export abstract class PersistentStore<
  T1 extends object,
  T2 = undefined
> extends Store<T1, T2> {
  public isInitialized = ref(false);
  private indexedDb;
  private name: string;

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
      )) as T1[];
      if (stateFromIndexedDB) {
        stateFromIndexedDB.forEach((entry) => {
          this.state.stored.entries.push(
            JSON.parse(JSON.stringify(entry)) as T1
          );
        });
      }
      watch(
        () => this.state,
        () => {
          this.state.stored.entries.forEach((entry) => {
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

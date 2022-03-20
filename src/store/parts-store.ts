import { PersistentStore, StoreObject } from "./store";
import { PARTS_STORE_NAME } from "./store-names";
import { PartStore, PartsListStore } from "@/types/store-types";

class PartsStore extends PersistentStore<PartStore> {
  protected data(): StoreObject<PartStore> {
    return {
      entries: [],
    };
  }

  getPart(id: string): PartStore {
    const part = this.state.entries.find((entry) => entry.id == id);
    return part ? part : ({} as PartStore);
  }

  getParts(partsList: PartsListStore): PartStore[] {
    const parts: PartStore[] = [];

    if (!partsList?.parts) return parts;

    partsList.parts.map((part) => {
      parts.push(this.getPart(part.id + "+" + part.color));
    });

    return parts;
  }

  addPart(part: PartStore) {
    const exist = this.getPart(part.id);
    if (exist) part.lego = exist.lego;
    console.log("parts store: add part ", part);

    this.state.entries.push(part);
  }

  deletePart(partId: string) {
    const index = this.state.entries.findIndex((e) => {
      return e.id == partId;
    });
    if (index == -1) return;

    this.state.entries.splice(index, 1);
    this.delete(partId);
  }
}

export const partsStore: PartsStore = new PartsStore(PARTS_STORE_NAME);

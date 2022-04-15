import { PersistentStore, StoreObject } from "./store";
import { PARTS_STORE_NAME } from "./store-names";
import { IPartStore, IPartsListStore } from "@/types/store-types";
import { BrickHunterApi } from "@/service/api/brickhunter";
import { GetPaBPartsRequest } from "@/types/api-types";

class PartsStore extends PersistentStore<IPartStore> {
  protected data(): StoreObject<IPartStore> {
    return {
      stored: { entries: [] },
      notStored: undefined,
    };
  }

  getPartById(id: string): IPartStore {
    const part = this.state.stored.entries.find((entry) => entry.id == id);
    return part ? part : ({} as IPartStore);
  }

  getPart(id: string, colorId: number | undefined): IPartStore {
    return this.getPartById(`${id}+${colorId}`);
  }

  getParts(partsList: IPartsListStore): IPartStore[] {
    const parts: IPartStore[] = [];

    if (!partsList?.positions) return parts;

    partsList.positions.map((position) => {
      parts.push(this.getPart(position.id, position.color));
    });

    return parts;
  }

  addPart(part: IPartStore) {
    const exist = this.getPartById(part.id);
    if (exist) part.lego = exist.lego;

    this.state.stored.entries.push(part);
  }

  deletePart(partId: string) {
    const index = this.state.stored.entries.findIndex((e) => {
      return e.id == partId;
    });
    if (index == -1) return;

    this.state.stored.entries.splice(index, 1);
    this.delete(partId);
  }

  async loadPaB() {
    const request: GetPaBPartsRequest = {
      country: "de",
      elementIds: [],
    };

    request.elementIds = this.state.stored.entries.map((p) => ({
      key: p.id,
      ids: p.elementIds.map(Number),
    }));

    const response = await BrickHunterApi.getPaBParts(request);

    this.state.stored.entries.map((p) => {
      const pab = response.elementIds.find((r) => r.key === p.id)?.pab;
      if (!pab) {
        p.lego = {
          id: "",
          inStock: undefined,
          price: {
            currencyCode: "",
            formattedValue: 0,
          },
          attributes: {
            colourId: "",
            designNumber: 0,
            deliveryChannel: "",
          },
          date: undefined,
          lastAvailableDate: undefined,
        };
        return;
      }

      p.lego = {
        id: pab.elementId.toString(),
        inStock: pab.isAvailable,
        price: {
          currencyCode: pab.currency,
          formattedValue: pab.price,
        },
        attributes: {
          designNumber: pab.designId,
          colourId: pab.colorId.toString(),
          deliveryChannel: pab.deliveryChannel,
        },
        date: pab.updateDate,
        lastAvailableDate: pab.lastAvailableDate,
      };
    });
  }
}

export const partsStore: PartsStore = new PartsStore(PARTS_STORE_NAME);

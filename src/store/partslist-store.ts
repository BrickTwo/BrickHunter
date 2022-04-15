import { PersistentStore, StoreObject } from "./store";
import { PARTS_LIST_STORE_NAME } from "./store-names";
import { BrickTwoApi } from "@/service/api/bricktwo";
import { BrickLinkItemModel, GetPartsRequest } from "@/types/api-types";
import { generateGuid } from "@/utilities/general/guid";
import { getColor } from "@/utilities/color";
import { partsStore } from "@/store/parts-store";
import { cartsStore } from "@/store/carts-store";
import {
  IPartsListStore,
  IPartsListPositionStore,
  IPartStore,
} from "@/types/store-types";
import { IPartsList, IPart } from "@/types/types";
import { Color } from "@/utilities/color";
import { watch } from "vue";

class PartsListsStore extends PersistentStore<IPartsListStore> {
  protected data(): StoreObject<IPartsListStore> {
    return {
      stored: { entries: [] },
      notStored: undefined,
    };
  }

  constructor(readonly storeName: string) {
    super(storeName);

    watch(
      () => this.state,
      () => {
        this.state.stored.entries.map((partList) => {
          if (partList.inCart) {
            cartsStore.addPartListToCarts(partList);
          } else {
            cartsStore.removePartListFromCarts(partList);
          }
        });
      },
      { deep: true }
    );
  }

  getAllPartsListSortedByName(): IPartsListStore[] {
    return this.state.stored.entries.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  getAllPartsListsInCart(): IPartsListStore[] {
    return this.state.stored.entries.filter((e) => e.inCart);
  }

  getPartsList(id: string): IPartsListStore {
    const partsList = this.state.stored.entries.find((entry) => entry.id == id);
    return partsList ? partsList : ({} as IPartsListStore);
  }

  async getPartsListWithDetail(id: string): Promise<IPartsList | undefined> {
    const source = this.getPartsList(id);
    if (!source) return undefined;

    const partsList: IPartsList = {
      id: source.id,
      name: source.name,
      parts: [],
    };

    if (!source.positions) return partsList;

    source.positions.forEach((s) => {
      const p = partsStore.getPart(s.id, s.color);

      if (p.elementId == undefined) p.elementId = "";

      const part: IPart = {
        source: s,
        detail: p,
        color: Color.getColor(p.color, "Rebrickable"),
      };

      partsList.parts.push(part);
    });

    return partsList;
  }

  addPartsList(partsList: IPartsListStore) {
    this.state.stored.entries.push(partsList);
  }

  setPartsListName(id: string, name: string) {
    const partsList = this.getPartsList(id);
    if (!partsList) return;
    partsList.name = name;
  }

  deletePartsList(partListId: string) {
    const index = this.state.stored.entries.findIndex((e) => {
      return e.id == partListId;
    });
    if (index == -1) return;

    this.state.stored.entries.splice(index, 1);
    this.delete(partListId);
  }

  addPartToList(partListId: string, part: IPartsListPositionStore) {
    return;
  }

  removePartFromList(partListId: string, partId: string) {
    return;
  }

  async importFromBrickLink(wantedList: BrickLinkItemModel[], name: string) {
    await partsStore.init();
    const request: GetPartsRequest = { source: "BrickLink", ids: [] };

    wantedList.forEach((item) => {
      request.ids.push(item.itemId.toString());
    });

    const response = await BrickTwoApi.getParts(request);

    const partsList: IPartsListStore = {
      id: generateGuid(),
      name: name,
      inCart: false,
      positions: [],
    };

    wantedList.forEach((item) => {
      const resp = response.find((resp) => {
        return resp.externalIds.find(
          (e) => e.externalId == item.itemId && e.source === "BrickLink"
        );
      });

      const color = getColor(item.color, "BrickLink");

      partsList.positions.push({
        id: resp ? resp.partNum : "",
        color: color.id,
        qty: item.minQty ? item.minQty : 0,
        have: item.qtyFilled ? item.qtyFilled : 0,
        qtyOrdered: 0,
        itemType: item.itemType,
        maxPrice: item.maxPrice ? item.maxPrice : 0,
        condition: item.condition,
        notify: item.notify,
        remarks: item.remarks,
        source: {
          name: "BrickLink",
          id: item.itemId,
          itemNumber: undefined,
          color: item.color,
        },
      });

      if (resp) {
        const elementIds = resp.elementIds
          .filter((e) => e.colorId == color.id)
          .map((item) => item.elementId)
          .map((id) => parseInt(id))
          .sort((a, b) => b - a) // numerical sort desc
          .map((id) => id.toString());

        if (!resp.imageUrl)
          resp.imageUrl = `https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${elementIds[0]}.jpg`;

        const part: IPartStore = {
          id: resp.partNum + "+" + color.id,
          partNum: resp.partNum,
          color: color.id,
          name: resp.name,
          imageUrl: resp.imageUrl,
          partCatId: resp.partCatId,
          yearFrom: resp.yearFrom,
          yearTo: resp.yearTo,
          isPrint: resp.isPrint,
          externalIds: resp.externalIds,
          elementIds: elementIds,
          elementId: elementIds[0],
          /*brickLink: {
                        itemNo: resp.brickLink.itemNo,
                        altNo: resp.brickLink.altNo,
                        itemName: resp.brickLink.itemName,
                        catStr: resp.brickLink.catStr,
                        year: resp.brickLink.year,
                        yearTo: resp.brickLink.yearTo,
                        weight: resp.brickLink.weight,
                        dimX: resp.brickLink.dimX,
                        dimY: resp.brickLink.dimY,
                        dimZ: resp.brickLink.dimZ,
                        hasSound: resp.brickLink.hasSound,
                        isStickerPart: resp.brickLink.isStickerPart,
                    },*/
          brickLink: undefined,
          lego: {
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
            checkPrice: false,
          },
        };

        partsStore.addPart(part);
      }
    });

    this.addPartsList(partsList);
  }
}

export const partsListStore: PartsListsStore = new PartsListsStore(
  PARTS_LIST_STORE_NAME
);

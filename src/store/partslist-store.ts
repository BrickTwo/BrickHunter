import { PersistentStore, StoreObject } from "./store";
import { PARTS_LIST_STORE_NAME } from "./store-names";
import { BrickHunterApi } from "@/service/api/brickhunter";
import {
  BrickHunterV1ItemModel,
  BrickLinkItemModel,
  GetPartsRequest,
  GetPartsResponse,
} from "@/types/api-types";
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

    cartsStore.removePartListFromCarts(this.getPartsList(partListId));

    this.state.stored.entries.splice(index, 1);
    this.delete(partListId);

    const parts = [...partsStore.getState().stored.entries];

    parts.forEach((p) => {
      if (!this.isUsedPart(p.id)) partsStore.deletePart(p.id);
    });
  }

  isUsedPart(partId: string): boolean {
    return !!this.state.stored.entries.find((e) =>
      e.positions.find((p) => `${p.id}+${p.color}` === partId)
    );
  }

  addPartToList(partListId: string, part: IPartsListPositionStore) {
    return;
  }

  removePartFromList(partListId: string, partId: string) {
    return;
  }

  async importFromBrickLink(itemList: BrickLinkItemModel[], name: string) {
    const request: GetPartsRequest = { source: "BrickLink", ids: [] };

    itemList.forEach((item) => {
      request.ids.push(item.itemId.toString());
    });

    const response = await BrickHunterApi.getParts(request);

    const partsList: IPartsListStore = {
      id: generateGuid(),
      name: name,
      inCart: false,
      positions: [],
    };

    itemList.forEach((item) => {
      const resp = response.find((resp) => {
        return resp.externalIds.find(
          (e) => e.externalId === item.itemId && e.source === "BrickLink"
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
            lastAvailableDate: undefined,
          },
        };

        partsStore.addPart(part);
      }
    });

    this.addPartsList(partsList);
  }

  async importFromBrickHunterV1(
    itemList: BrickHunterV1ItemModel[],
    name: string
  ) {
    console.log("itemList", itemList);
    const source = itemList[0].source == "BrickLink" ? "BrickLink" : "LEGO";

    const request: GetPartsRequest = {
      source: source,
      ids: [],
    };

    itemList.forEach((item) => {
      request.ids.push(item.designId.toString());
    });

    const response = await BrickHunterApi.getParts(request);

    console.log("response", response, request);

    const partsList: IPartsListStore = {
      id: generateGuid(),
      name: name,
      inCart: false,
      positions: [],
    };

    itemList.forEach((item) => {
      let resp: GetPartsResponse | undefined = undefined;

      if (item.itemNumber) {
        resp = response.find((resp) => {
          return (
            resp.externalIds.find(
              (e) => e.externalId === item.designId && e.source === source
            ) &&
            resp.elementIds.find(
              (e) => e.elementId === item.itemNumber?.toString()
            )
          );
        });
      }

      if (!resp) {
        resp = response.find((resp) => {
          return resp.externalIds.find(
            (e) => e.externalId == item.designId && e.source === source
          );
        });
      }

      const color = getColor(item.color.brickLinkId, "BrickLink");

      partsList.positions.push({
        id: resp ? resp.partNum : "",
        color: color.id,
        qty: item.qty.min ? item.qty.min : 0,
        have: item.qty.have ? item.qty.have : 0,
        qtyOrdered: 0,
        itemType: item.brickLink
          ? item.brickLink.wantedList.itemtype
          : undefined,
        maxPrice: item.brickLink ? item.brickLink.wantedList.maxprice : 0,
        condition: item.brickLink
          ? item.brickLink.wantedList.condition
          : undefined,
        notify: item.brickLink ? item.brickLink.wantedList.notify : undefined,
        remarks: item.brickLink ? item.brickLink.wantedList.remarks : undefined,
        source: {
          name: source,
          id: item.designId,
          itemNumber: item.itemNumber ? item.itemNumber : undefined,
          color:
            item.source == "bricklink"
              ? item.color.brickLinkId
              : color.external_ids.LEGO
              ? color.external_ids.LEGO?.ext_ids[0]
              : undefined,
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
            lastAvailableDate: undefined,
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

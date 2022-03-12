import { PersistentStore, StoreObject } from "./store";
import { PARTS_LIST_STORE_NAME } from "./store-names";
import { BrickTwoApi } from "@/service/api/bricktwo";
import { BrickLinkItemModel, GetPartsRequest } from "@/types/api-types";
import { generateGuid } from "@/utilities/general/guid";
import { getColor } from "@/utilities/color";
import { partsStore } from "@/store/parts-store";
import {
  PartsListStore,
  PartsListPartStore,
  PartStore,
} from "@/types/store-types";
import { IPartsList } from "@/types/types";
import { Color } from "@/utilities/color";

class PartsListsStore extends PersistentStore<PartsListStore> {
  protected data(): StoreObject<PartsListStore> {
    return {
      entries: [],
    };
  }

  getPartsList(id: string): PartsListStore {
    const partsList = this.state.entries.find((entry) => entry.id == id);
    return partsList ? partsList : ({} as PartsListStore);
  }

  getDetailedPartsList(id: string): IPartsList | undefined {
    const partsList = JSON.parse(
      JSON.stringify(this.getPartsList(id))
    ) as IPartsList;
    if (!partsList) return undefined;

    if (!partsList.parts) return partsList;

    partsList?.parts.forEach((part) => {
      const p = partsStore.getPart(`${part.id}+${part.color}`);
      if (p?.elementIds[0]) {
        p.elementIds.sort();
        part.elementId = p.elementIds[0];
      }
      part.color = Color.getColor(p.color, "Rebrickable");
      part.name = p.name;
      part.imageUrl = p.imageUrl;
      if (!part.imageUrl)
        part.imageUrl = `https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${part.elementId}.jpg`;
      part.partCatId = p.partCatId;
      part.yearFrom = p.yearFrom;
      part.yearTo = p.yearTo;
      part.isPrint = p.isPrint;
      part.externalIds = p.externalIds;
      part.elementIds = p.elementIds;
      part.brickLink = p.brickLink;
      part.lego = p.lego;
    });

    return partsList;
  }

  addPartsList(partsList: PartsListStore) {
    this.state.entries.push(partsList);
  }

  setPartsListName(id: string, name: string) {
    const partsList = this.getPartsList(id);
    if (!partsList) return;
    partsList.name = name;
  }

  deletePartsList(partListId: string) {
    const index = this.state.entries.findIndex((e) => {
      return e.id == partListId;
    });
    if (index == -1) return;

    this.state.entries.splice(index, 1);
    this.delete(partListId);
  }

  addPartToList(partListId: string, part: PartsListPartStore) {
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

    const partsList: PartsListStore = {
      id: generateGuid(),
      name: name,
      parts: [],
    };

    wantedList.forEach((item) => {
      const resp = response.find((resp) => {
        return resp.externalIds.find(
          (e) => e.externalId == item.itemId && e.source === "BrickLink"
        );
      });

      console.log("resp", resp, item);

      const color = getColor(item.color, "BrickLink");

      partsList.parts.push({
        id: resp ? resp.partNum : "",
        color: color.id,
        qty: item.minQty,
        have: item.qtyFilled,
        itemType: item.itemType,
        maxPrice: item.maxPrice,
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
        const part: PartStore = {
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
          elementIds: resp.elementIds
            .filter((e) => e.colorId == color.id)
            .map((item) => item.elementId),
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
          lego: undefined,
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

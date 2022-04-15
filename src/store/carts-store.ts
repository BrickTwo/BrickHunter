import { PersistentStore, StoreObject } from "./store";
import { partsStore } from "@/store/parts-store";
import { CARTS_STORE_NAME } from "./store-names";
import {
  ICartStore,
  CartType,
  IPartsListStore,
  ICartPositionStore,
  IPartStore,
  IPartsListPositionStore,
} from "@/types/store-types";
import { IPart } from "@/types/types";
import { Color } from "@/utilities/color";
import { positionProp } from "naive-ui/lib/layout/src/interface";

export interface CartsNotStoredObject {
  openPositions: { position: ICartPositionStore; part: IPartStore }[];
}

class CartsStore extends PersistentStore<ICartStore, CartsNotStoredObject> {
  protected data(): StoreObject<ICartStore, CartsNotStoredObject> {
    return {
      stored: { entries: [] },
      notStored: { openPositions: [] },
    };
  }

  addPartListToCarts(partList: IPartsListStore) {
    if (!partList.positions) return;

    partList.positions.map((position) => {
      this.addPosition(partList.id, position);
    });
  }

  removePartListFromCarts(partList: IPartsListStore) {
    this.state.notStored.openPositions.forEach((p) => {
      p.position.qty = p.position.qty.filter(
        (q) => q.partListId != partList.id
      );
    });

    this.state.notStored.openPositions =
      this.state.notStored.openPositions.filter(
        (p) => p.position.qty.length > 0
      );
  }

  getPositionsByType(cartType: CartType): IPart[] {
    switch (cartType) {
      case CartType.Bestseller:
        return this.state.notStored.openPositions
          .filter((p) => p.part.lego?.attributes?.deliveryChannel === "pab")
          .map((item) => this.ConvertToIPart(item));
      case CartType.Standard:
        return this.state.notStored.openPositions
          .filter((p) => p.part.lego?.attributes?.deliveryChannel === "bap")
          .map((item) => this.ConvertToIPart(item));
      default:
        return this.state.notStored.openPositions
          .filter((p) => p.part.lego?.attributes?.deliveryChannel === "")
          .map((item) => this.ConvertToIPart(item));
    }

    return [];
  }

  ConvertToIPart(item: {
    position: ICartPositionStore;
    part: IPartStore;
  }): IPart {
    const p = item.part;

    if (p.elementId == undefined) p.elementId = "";

    const s: IPartsListPositionStore = {
      id: item.position.id,
      color: item.position.color,
      qty: item.position.qty
        .map((q) => q.qty)
        .reduce((prev, curr) => prev + curr, 0),
      have: 0,
      qtyOrdered: 0,
      maxPrice: 0,
      source: {
        name: "",
      },
    };

    const part: IPart = {
      source: s,
      detail: p,
      cart: item.position,
      color: Color.getColor(p.color, "Rebrickable"),
    };

    return part;
  }

  getCartsByType(cartType: CartType) {
    return;
  }

  getTotalOpenUniqueParts(): number {
    return this.state.notStored.openPositions.length;
  }

  getTotalOpenUniquePartsByType(cartType: CartType): number {
    switch (cartType) {
      case CartType.Bestseller:
        return this.state.notStored.openPositions.filter(
          (p) => p.part.lego?.attributes?.deliveryChannel === "pab"
        ).length;
      case CartType.Standard:
        return this.state.notStored.openPositions.filter(
          (p) => p.part.lego?.attributes?.deliveryChannel === "bap"
        ).length;
      default:
        return this.state.notStored.openPositions.filter(
          (p) => p.part.lego?.attributes?.deliveryChannel === ""
        ).length;
    }
  }

  getTotalOpenQuantity(): number {
    return this.state.notStored.openPositions
      .map((p) =>
        p.position.qty.map((q) => q.qty).reduce((prev, curr) => prev + curr, 0)
      )
      .reduce((prev, curr) => prev + curr, 0);
  }

  private addPosition(partListId: string, position: IPartsListPositionStore) {
    let cartPosition = this.state.notStored.openPositions.find(
      (pos) =>
        pos.position.id === position.id && pos.position.color === position.color
    );

    if (cartPosition) {
      if (cartPosition.position.qty.find((q) => q.partListId === partListId))
        return;

      cartPosition.position.qty.push({
        partListId: partListId,
        qty: position.qty,
      });
      return;
    }

    cartPosition = {
      position: {
        id: position.id,
        color: position.color,
        qty: [
          {
            partListId: partListId,
            qty: position.qty,
          },
        ],
      },
      part: partsStore.getPart(position.id, position.color),
    };

    this.state.notStored.openPositions.push(cartPosition);
  }
}

export const cartsStore: CartsStore = new CartsStore(CARTS_STORE_NAME);

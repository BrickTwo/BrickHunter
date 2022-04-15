export interface IPersistentObject extends Object {
  id: string;
}

export interface IPartsListStore extends IPersistentObject {
  name: string;
  inCart: boolean;
  positions: IPartsListPositionStore[];
}

export interface IPartsListPositionStore extends Object {
  id: string;
  color?: number;
  qty: number;
  have: number;
  qtyOrdered: number;
  itemType?: string;
  maxPrice: number;
  condition?: string;
  notify?: string;
  remarks?: string;
  source: {
    name: string;
    id?: string;
    itemNumber?: number;
    color?: number;
  };
}

export interface IPartStore extends IPersistentObject {
  id: string;
  partNum: string;
  elementId: string;
  color: number;
  name: string;
  imageUrl: string;
  partCatId: number;
  yearFrom: number;
  yearTo: number;
  isPrint: boolean;
  externalIds: { source: string; externalId: string }[];
  elementIds: string[];
  brickLink?: {
    itemNo: string;
    altNo: string;
    itemName: string;
    catStr: string;
    year: number;
    yearTo: number;
    weight: number;
    dimX: number;
    dimY: number;
    dimZ: number;
    hasSound: boolean;
    isStickerPart: boolean;
  };
  lego: {
    id: string;
    inStock: boolean | undefined;
    price: {
      currencyCode: string;
      formattedValue: number;
    };
    attributes: {
      colourId: string;
      designNumber: number;
      deliveryChannel: string;
    };
    date: number | undefined;
    checkPrice: boolean;
  };
}

export interface ISettingsStore {
  country: string;
  language: string;
  uiLanguage: string;
}

export interface ICartStore {
  state: CartState;
  OrderDate: Date;
  CartType: CartType;
  Positions: ICartPositionStore[];
}

export enum CartState {
  Open = 1,
  Fixed = 2,
  Ordered = 3,
}

export enum CartType {
  Bestseller = 1,
  Standard = 2,
  BrickLink = 3,
}

export interface ICartPositionStore {
  id: string;
  color?: number;
  qty: {
    partListId: string;
    qty: number;
  }[];
}

export interface IColor {
  id: number;
  name: string;
  rgb: string;
  is_trans: boolean;
  external_ids: {
    LDraw?: {
      ext_ids: Array<number>;
      ext_descrs: Array<Array<string>>;
    };
    BrickOwl?: {
      ext_ids: Array<number>;
      ext_descrs: Array<Array<string>>;
    };
    LEGO?: {
      ext_ids: Array<number>;
      ext_descrs: Array<Array<string>>;
    };
    Peeron?: {
      ext_ids: Array<number | null>;
      ext_descrs: Array<Array<string>>;
    };
    BrickLink?: {
      ext_ids: Array<number>;
      ext_descrs: Array<Array<string>>;
    };
  };
}

export interface IPartsList {
  id: string;
  name: string;
  parts: IParts[];
}

export interface IParts extends Object {
  id: string;
  elementId: number;
  color: IColor;
  qty: number;
  have: number;
  itemType: string;
  maxPrice: number;
  condition: string;
  notify: string;
  remarks: string;
  name: string;
  imageUrl: string;
  partCatId: number;
  yearFrom: number;
  yearTo: number;
  isPrint: boolean;
  externalIds: { source: string; externalId: string }[];
  elementIds: number[];
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
  lego?: {
    elementId: number;
    designId: number;
    colorId: number;
    id: string | null;
    name: string;
    primaryImageUrl: string;
    materialGroup: string | null;
    materialType: string | null;
    deliveryChannel: string;
    createDate: Date;
    updateDate: Date;
    price: number;
    currency: string;
    countryGroupId: number;
    isAvailable: boolean;
    lastAvailableDate: Date;
  } | null;
  source: {
    name: string;
    id?: string;
    itemNumber?: number;
    color?: number;
  };
}

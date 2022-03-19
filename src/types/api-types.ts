import { NumberAnimationInst } from "naive-ui";

export interface BrickLinkItemModel {
  itemType: string;
  itemId: string;
  color?: number;
  maxPrice?: number;
  minQty?: number;
  qtyFilled?: number;
  condition?: string;
  remarks?: string;
  notify?: string;
}

export interface GetPartsRequest {
  source: string;
  ids: string[];
}

export interface GetPartsResponse {
  partNum: string;
  name: string;
  imageUrl: string;
  partCatId: number;
  yearFrom: number;
  yearTo: number;
  isPrint: boolean;
  externalIds: { source: string; externalId: string }[];
  elementIds: { elementId: string; colorId: number }[];
  /*brickLink: {
        itemNo: string,
        altNo: string,
        itemName: string,
        catStr: string,
        year: number,
        yearTo: number,
        weight: number,
        dimX: number,
        dimY: number,
        dimZ: number,
        hasSound: boolean,
        isStickerPart: boolean,
    }*/
}

export interface GetPaBPartsRequest {
  country: string;
  elementIds: { key: string; ids: number[] }[];
}

export interface GetPaBPartsResponse {
  country: string;
  elementIds: {
    key: string;
    pab: {
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
  }[];
}

export interface GetPaBFindPartsRequest {
  page: number;
  perPage: number;
  query: string;
  location: string;
}

export interface GetPaBFindPartsResponse {
  data: {
    elements: {
      count: number;
      total: number;
      results: GetPaBFindPartsResponseResults[];
    };
  };
}

export interface GetPaBFindPartsResponseResults {
  inStock: boolean;
  variant: {
    id: string;
    price: {
      currencyCode: string;
      formattedValue: number;
    };
    attributes: {
      colourId: string;
      designNumber: number;
      deliveryChannel: string;
    };
  };
}

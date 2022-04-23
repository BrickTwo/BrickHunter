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

export interface PickABrickQueryRequest {
  page: number;
  perPage: number;
  query: string;
  location: string;
}

export interface PickABrickQueryResponse {
  data: {
    elements: {
      count: number;
      total: number;
      results: PickABrickQueryResponseResults[];
    };
  };
  errors: {
    message: string;
  }[];
}

export interface PickABrickQueryResponseResults {
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

export interface ElementCartQueryRequest {
  authorization: string;
  location: string;
  cartType: string;
}

export interface ElementCartQueryResponse {
  data: {
    me: {
      elementCarts: {
        carts: {
          id: string;
          type: string;
          PABLineItems: {
            id: string;
            quantity: number;
          }[];
        }[];
      };
    };
  };
  errors: {
    message: string;
  }[];
}

export interface AddToElementCartRequest {
  items: {
    sku: string;
    quantity: number;
  }[];
  cartType: string;
  authorization: string;
  location: string;
}

export interface AddToElementCartResponse {
  data: {
    addToElementCart: {
      id: string;
    };
  };
  errors: {
    message: string;
  }[];
}

export interface RemoveAllElementsFromCartRequest {
  cartType: string;
  authorization: string;
  location: string;
}

export interface RemoveAllElementsFromCartResponse {
  data: {
    removeAllElementsFromCart: {
      id: string;
    };
  };
  errors: {
    message: string;
  }[];
}

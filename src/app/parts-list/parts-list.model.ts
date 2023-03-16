export interface RebrickableModel {
    partNum: string;
    color: number;
    name: string;
    imageUrl: string;
    partCatId: number;
    yearFrom: number;
    yearTo: number;
    isPrint: boolean;
    externalIds: { source: string; externalId: string }[];
    
}

export interface BrickLinkModel {
    itemId: number;
    itemType: string;
    itemNo: string;
    itemName: string;
    year: number;
    yearTo: number;
    yearColor: number;
    yearToColor: number;
    weight: number;
    dimX: number;
    dimY: number;
    dimZ: number;
    dimXmm: number;
    dimYmm: number;
    dimZmm: number;
    hasSound: boolean;
    isStickerPart: boolean;
}

export interface LegoModel {
    elementId: number;
    designNumber: number;
    inStock?: boolean | undefined;
    price: {
        currencyCode: string;
        amount: number;
    };
    colourId: number;
    deliveryChannel: string;
    date?: Date | number | undefined;
}

export interface Part {
    id: string;
    color: number;
    qty: number;
    have: number;
    itemType: string;
    maxPrice: number;
    condition: string;
    notify: boolean;
    remarks: string;
    elementId: number;
    elementIds?: number[];
    source: {
        source: string;
        id?: string;
        itemNumber?: number;
        color?: number;
    };
    rebrickable?: RebrickableModel;
    brickLink?: BrickLinkModel;
    lego?: LegoModel;
}

export interface PartsList {
    id: number;
    uid: string;
    name: string;
    source: string;
    parts: Part[];
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
    elementIds: { elementId: number; colorId: number }[];
}

export interface GetBrickLinkRequest {
    itemNumbers: string[];
}

export interface GetBrickLinkResponse {
    itemId: number;
    itemType: string;
    itemNo: string;
    itemName: string;
    year: number;
    yearTo: number;
    defaultColorId: number;
    weight: number;
    dimX: number;
    dimY: number;
    dimZ: number;
    dimXmm: number;
    dimYmm: number;
    dimZmm: number;
    hasSound: boolean;
    isStickerPart: boolean;
    elementIds: GetBrickLinkElementIdsResponse[];
    colors: GetBrickLinkColorsResponse[];
}

export interface GetBrickLinkElementIdsResponse
{
    colorId: number;
    elementId: number;
}

export interface GetBrickLinkColorsResponse
{
    colorId: number;
    yearFrom: number;
    yearTo: number;
}
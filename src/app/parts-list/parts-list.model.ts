export interface RebrickableModel {
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
}

export interface BrickLinkModel {
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

export class GetPartsRequest {
    constructor(
        public source: string,
        public ids: string[]
    ) { }
}

export class GetPartsResponse {
    constructor(
        public partNum: string,
        public name: string,
        public imageUrl: string,
        public partCatId: number,
        public yearFrom: number,
        public yearTo: number,
        public isPrint: boolean,
        public externalIds: { source: string; externalId: string }[],
        public elementIds: { elementId: string; colorId: number }[]
    ) { }
}
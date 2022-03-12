
export interface BrickLinkItemModel {
    itemType: string,
    itemId: string,
    color?: number,
    maxPrice?: number,
    minQty?: number,
    qtyFilled?: number
    condition?: string,
    remarks?: string,
    notify?: string
}

export interface GetPartsRequest {
    source: string,
    ids: string[]
}

export interface GetPartsResponse {
    partNum: string,
    name: string,
    imageUrl: string,
    partCatId: number,
    yearFrom: number,
    yearTo: number,
    isPrint: boolean,
    externalIds: { source: string, externalId: string }[],
    elementIds: {elementId: string, colorId: number}[],
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
export interface PersistentObject extends Object {
    id: string,
}

export interface PartsListStore extends PersistentObject {
    name: string,
    parts: PartsListPartStore[]
}

export interface PartsListPartStore extends Object {
    id: string,
    color?: number,
    qty?: number,
    have?: number,
    itemType?: string,
    maxPrice?: number,
    condition?: string,
    notify?: string,
    remarks?: string,
    source: {
        name: string,
        id?: string,
        itemNumber?: number,
        color?: number
    }
}

export interface PartStore extends PersistentObject {
    id: string,
    partNum: string,
    color: number,
    name: string,
    imageUrl: string,
    partCatId: number,
    yearFrom: number,
    yearTo: number,
    isPrint: boolean,
    externalIds: { source: string, externalId: string }[],
    elementIds: string[],
    brickLink?: {
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
    },
    lego?: {
        itemNumber: number,
        name: string,
        price: number,
        currency: string,
    }
}
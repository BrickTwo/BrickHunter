import { GetBrickLinkPartColorsResponse, GetBrickLinkPartElementIdsResponse } from ".";

export interface GetBrickLinkPartsResponse {
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
    elementIds: GetBrickLinkPartElementIdsResponse[];
    colors: GetBrickLinkPartColorsResponse[];
}
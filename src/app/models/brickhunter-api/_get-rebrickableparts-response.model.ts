export interface GetRebrickablePartsResponse {
    source: string;
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
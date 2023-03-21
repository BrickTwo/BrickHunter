export interface IRebrickableModel {
    partNum: string;
    color: number;
    name: string;
    imageUrl: string | null;
    partCatId: number;
    yearFrom: number;
    yearTo: number;
    isPrint: boolean;
    externalIds: { source: string; externalId: string }[];
}
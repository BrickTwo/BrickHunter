export interface GetPickABrickPartsRequest {
  page: number;
  limit: number;
  country: string;
  categoryId: number;
  colorIds: number[];
  keywords: string[];
  sortField: string;
  sortDir: string;
  deliveryChannels: string[];
  onlyPrinted: boolean;
  excludeCategoryIds: number[];
  designIds: number[];
  elementIds: number[];
  atRiskAsOf: string;
}

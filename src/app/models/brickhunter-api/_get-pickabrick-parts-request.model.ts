export interface GetPickABrickPartsRequest {
  page: number;
  limit: number;
  country: string;
  categoryId: number;
  colorId: number;
  keywords: string[];
  sortField: string;
  sortDir: string;
  showAll: boolean;
  excludeCategoryIds: number[];
  designIds: number[];
  elementIds: number[];
}

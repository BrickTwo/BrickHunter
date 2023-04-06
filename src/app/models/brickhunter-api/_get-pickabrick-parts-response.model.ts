import { GetPickABrickPartsCategoryResponse, GetPickABrickPartsPageResponse, GetPickABrickPartsPartResponse } from '.';

export interface GetPickABrickPartsResponse {
  bricks: GetPickABrickPartsPartResponse[];
  categories: GetPickABrickPartsCategoryResponse[];
  colors: number[];
  page: GetPickABrickPartsPageResponse;
}

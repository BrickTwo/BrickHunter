import { GetPickABrickPartsCategoryResponse, GetPickABrickPartsPageResponse, GetPickABrickPartsPartResponse } from '.';

export interface GetPickABrickPartsResponse {
  bricks: GetPickABrickPartsPartResponse[];
  categories: GetPickABrickPartsCategoryResponse[];
  page: GetPickABrickPartsPageResponse;
}

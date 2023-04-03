import { GetPickABrickPartsPageResponse, GetPickABrickPartsPartResponse } from '.';

export interface GetPickABrickPartsResponse {
  bricks: GetPickABrickPartsPartResponse[];
  page: GetPickABrickPartsPageResponse;
}

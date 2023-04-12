import {
  GetPickABrickPartsCategoryResponse,
  GetPickABrickPartsCountryResponse,
  GetPickABrickPartsPageResponse,
  GetPickABrickPartsPartResponse,
} from '.';

export interface GetPickABrickPartsResponse {
  bricks: GetPickABrickPartsPartResponse[];
  categories: GetPickABrickPartsCategoryResponse[];
  colors: number[];
  countries: GetPickABrickPartsCountryResponse[];
  page: GetPickABrickPartsPageResponse;
}

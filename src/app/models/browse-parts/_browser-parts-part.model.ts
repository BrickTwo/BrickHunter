import { GetPickABrickPartsPartResponse } from '../brickhunter-api';
import { IColor } from '../shared';

export interface BrowsePartsPart extends GetPickABrickPartsPartResponse {
  color: IColor;
}

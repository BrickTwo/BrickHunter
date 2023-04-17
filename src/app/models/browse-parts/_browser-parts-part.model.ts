import { GetPickABrickPartsPartResponse } from '../brickhunter-api';
import { Color } from '../shared';

export interface BrowsePartsPart extends GetPickABrickPartsPartResponse {
  color: Color;
}

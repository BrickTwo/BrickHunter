import { BackgroundRequest } from '.';

export interface BackgroundFindBricksRequest extends BackgroundRequest {
  elementIds: number[];
  locale: string;
}

import { IBackgroundRequest } from '.';

export interface IBackgroundFindBricksRequest extends IBackgroundRequest {
  elementIds: number[];
  locale: string;
}

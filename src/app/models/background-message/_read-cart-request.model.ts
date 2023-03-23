import { IBackgroundRequest } from '.';

export interface IBackgroundReadCartRequest extends IBackgroundRequest {
  elementIds: number[];
  locale: string;
}

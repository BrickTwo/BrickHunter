import { IBackgroundRequest } from '.';

export interface IBackgroundReadCartRequest extends IBackgroundRequest {
  authorization: string;
  locale: string;
  deliveryChannels: string[];
}

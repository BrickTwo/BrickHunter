import { BackgroundRequest } from '.';

export interface BackgroundReadCartRequest extends BackgroundRequest {
  authorization: string;
  locale: string;
  deliveryChannels: string[];
}

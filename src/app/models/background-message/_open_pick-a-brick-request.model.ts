import { BackgroundRequest } from '.';
import { Affiliate } from '../global';

export interface BackgroundOpenBrickABrickRequest extends BackgroundRequest {
  tabId: number;
  affiliate: Affiliate | undefined;
  locale: string;
}

import { IBackgroundRequest } from '.';
import { IAffiliate } from '../global';

export interface IBackgroundOpenBrickABrickRequest extends IBackgroundRequest {
  tabId: number;
  affiliate: IAffiliate | undefined;
  locale: string;
}

import { IBackgroundRequest } from '.';
import { IAddElementItem, PaBCartType } from '../pick-a-brick';

export interface IBackgroundAddElementRequest extends IBackgroundRequest {
  authorization: string;
  items: IAddElementItem[];
  cartType: PaBCartType;
  locale: string;
}

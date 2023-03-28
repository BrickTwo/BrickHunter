import { IBackgroundRequest } from '.';
import { IChangeElementItem, PaBCartType } from '../pick-a-brick';

export interface IBackgroundChangeElementRequest extends IBackgroundRequest {
  authorization: string;
  items: IChangeElementItem[];
  cartType: PaBCartType;
  locale: string;
}

import { IBackgroundRequest } from '.';
import { IAddElementItem } from '../pick-a-brick';

export interface IBackgroundAddElementRequest extends IBackgroundRequest {
  authorization: string;
  items: IAddElementItem[];
  cartType: string;
  locale: string;
}

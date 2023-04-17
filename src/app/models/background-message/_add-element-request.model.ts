import { BackgroundRequest } from '.';
import { AddElementItem, PaBCartType } from '../pick-a-brick';

export interface BackgroundAddElementRequest extends BackgroundRequest {
  authorization: string;
  items: AddElementItem[];
  cartType: PaBCartType;
  locale: string;
}

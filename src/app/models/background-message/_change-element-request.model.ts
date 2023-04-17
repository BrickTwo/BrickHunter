import { BackgroundRequest } from '.';
import { ChangeElementItem, PaBCartType } from '../pick-a-brick';

export interface BackgroundChangeElementRequest extends BackgroundRequest {
  authorization: string;
  items: ChangeElementItem[];
  cartType: PaBCartType;
  locale: string;
}

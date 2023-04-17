import { BrickHunterV1Item } from './_brickhunterv1-item.model';

export interface BrickHunterV1 {
  id: string;
  name: string;
  source: string;
  positions: BrickHunterV1Item[];
  version: string;
}

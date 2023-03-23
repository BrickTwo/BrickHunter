import { IBrickHunterV1Item } from './_brickhunterv1-item.model';

export interface IBrickHunterV1 {
  id: string;
  name: string;
  source: string;
  positions: IBrickHunterV1Item[];
  version: string;
}

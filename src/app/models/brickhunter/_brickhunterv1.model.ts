import { BrickHunterV1Item } from '.';

export interface BrickHunterV1 {
  id: string;
  name: string;
  source: string;
  positions: BrickHunterV1Item[];
  version: string;
}

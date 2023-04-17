import { BrickHunterV2Item } from '.';

export interface BrickHunterV2 {
  name: string;
  source: string;
  parts: BrickHunterV2Item[];
  version: string;
}

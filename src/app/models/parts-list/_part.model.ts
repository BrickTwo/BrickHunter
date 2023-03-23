import { IBrickLinkModel, ILegoModel, IRebrickableModel } from '.';

export interface IPart {
  id: string;
  externalId: string;
  color: number;
  qty: number;
  have?: number;
  itemType: string;
  maxPrice: number;
  condition: string;
  notify: boolean;
  remarks?: string;
  designId: string;
  elementId?: number;
  elementIds?: number[];
  source: {
    source: string;
    id?: string;
    itemNumber?: number;
    color?: number;
  };
  rebrickable?: IRebrickableModel | null;
  brickLink?: IBrickLinkModel | null;
  lego?: ILegoModel | null;
}

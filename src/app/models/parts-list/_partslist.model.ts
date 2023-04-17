import { Part } from '.';

export interface PartsList {
  uuid: string;
  name: string;
  source: string;
  parts: Part[];
}

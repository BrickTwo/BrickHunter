import { IPart } from '.';

export interface IPartsList {
  uuid: string;
  name: string;
  source: string;
  parts: IPart[];
}

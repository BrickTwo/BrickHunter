import { IAddElementItem, PaBCartType } from '.';

export interface IAddElement {
  operationName: string;
  variables: {
    items: IAddElementItem[];
    cartType: PaBCartType;
  };
  query: string;
}

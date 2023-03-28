import { IChangeElementItem, PaBCartType } from '.';

export interface IChangeElement {
  operationName: string;
  variables: {
    elements: IChangeElementItem[];
    cartType: PaBCartType;
  };
  query: string;
}

import { ChangeElementItem, PaBCartType } from '.';

export interface ChangeElement {
  operationName: string;
  variables: {
    elements: ChangeElementItem[];
    cartType: PaBCartType;
    returnCarts: string[];
  };
  query: string;
}

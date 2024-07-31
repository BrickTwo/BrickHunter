import { AddElementItem, PaBCartType } from '.';

export interface AddElement {
  operationName: string;
  variables: {
    items: AddElementItem[];
    cartType: PaBCartType;
    returnCarts: string[];
  };
  query: string;
}

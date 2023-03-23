import { IAddElementItem } from '.';

export interface IAddElement {
  operationName: string;
  variables: {
    items: IAddElementItem[];
    cartType: string;
  };
  query: string;
}

import { Part } from '.';

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  pieceCount: number;
  containesPieces: number;
  containesPercentage: number;
  containedPicesPrice: number;
  price: number;
  currencyCode: string;
  //parts: Part[];
  partsUsed: Part[];
  partsNotUsed: Part[];
}

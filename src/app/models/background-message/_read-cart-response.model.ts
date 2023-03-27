export interface IBackgroundReadCartResponse {
  id: string;
  lineItems: IReadCartItem[];
}

export interface IReadCartItem {
  id: string;
  quantity: number;
  elementVariant: IReadCartItemElementVariant;
}

export interface IReadCartItemElementVariant {
  id: string;
  attributes: IReadCartItemElementVariantAttributes;
}

export interface IReadCartItemElementVariantAttributes {
  deliveryChannel: string;
  designNumber: number;
  maxOrderQuantity: 0;
}

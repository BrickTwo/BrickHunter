export interface BackgroundReadCartResponse {
  id: string;
  lineItems: ReadCartItem[];
}

export interface ReadCartItem {
  id: string;
  quantity: number;
  elementVariant: ReadCartItemElementVariant;
}

export interface ReadCartItemElementVariant {
  id: string;
  attributes: ReadCartItemElementVariantAttributes;
}

export interface ReadCartItemElementVariantAttributes {
  deliveryChannel: string;
  designNumber: number;
  maxOrderQuantity: 0;
}

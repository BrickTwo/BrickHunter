export interface BackgroundReadCartResponse {
  id: string;
  brickLineItems: ReadCartItem[];
}

export interface ReadCartItem {
  id: string;
  lineItemId: string;
  designId: string;
  maxOrderQuantity: 0;
  deliveryChannel: string;
  quantity: number;
}
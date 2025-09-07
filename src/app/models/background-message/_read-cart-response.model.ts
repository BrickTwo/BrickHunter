export interface BackgroundReadCartResponse {
  brickLineItems: ReadCartItem[];
}

export interface ReadCartItem {
  id: string;
  sku: string;
  designId: string;
  maxOrderQuantity: number;
  deliveryChannel: string;
  quantity: number;
}
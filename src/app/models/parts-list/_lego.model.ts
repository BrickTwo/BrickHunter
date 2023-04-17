export interface LegoModel {
  elementId: number;
  designNumber: number;
  inStock?: boolean | undefined;
  price: {
    currencyCode: string;
    amount: number;
  };
  colourId: number;
  deliveryChannel: string;
  maxOrderQuantity: number;
  date?: Date | number | undefined;
}

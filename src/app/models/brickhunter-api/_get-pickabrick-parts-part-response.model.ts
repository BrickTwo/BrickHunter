export interface GetPickABrickPartsPartResponse {
  country: string;
  elementId: number;
  colorId: number;
  description: string;
  designId: number;
  imageUrl: string;
  createDateBrick: string;
  updateDateBrick: string;
  priceAmount: number;
  priceCurrency: string;
  isAvailable: boolean;
  isSoldOut?: boolean;
  maxOrderQuantity: number;
  categoryId: number;
  deliveryChannel: string;
  hasPrint: boolean;
  firstAvailabilityDate: string;
  lastAvailabilityDate: string;
  lastUpdateCountry: string;
}

export interface GetBrickHunterGlobalSettingsResponse {
  maxPaBLotPerOrder: number;
  defaultMaxQuantityPerLot: number;
  paBServiceFeeUnder: GetBrickHunterGlobalSettingsServiceFeeResponse[];
  baPServiceFeeUnder: GetBrickHunterGlobalSettingsServiceFeeResponse[];
}

export interface GetBrickHunterGlobalSettingsServiceFeeResponse {
  country: string;
  threshold: number;
}

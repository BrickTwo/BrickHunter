export interface GetProductSuggestionsRequest {
  countryCode: string;
  minQuantityPercentage: number;
  elements: GetProductSuggestionElementRequest[];
}

export interface GetProductSuggestionElementRequest {
  elementId: number;
  quantity: number;
}

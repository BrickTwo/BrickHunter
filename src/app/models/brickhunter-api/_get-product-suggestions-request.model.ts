export interface GetProductSuggestionsRequest {
  minQuantityPercentage: number;
  elements: GetProductSuggestionElementRequest[];
}

export interface GetProductSuggestionElementRequest {
  elementId: number;
  quantity: number;
}

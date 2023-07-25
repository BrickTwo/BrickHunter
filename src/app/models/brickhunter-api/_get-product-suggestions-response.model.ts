export interface GetProductSuggestionsResponse {
  id: number;
  name: string;
  imageUrl: string;
  pieceCount: number;
  containesPercentage: number;
  price: number;
  currencyCode: string;
  elements: GetProductSuggestionelementResponse[];
}

export interface GetProductSuggestionelementResponse {
  elementId: number;
  quantity: number;
}

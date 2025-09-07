import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  GetBrickHunterGlobalSettingsResponse,
  GetBrickLinkPartsRequest,
  GetBrickLinkPartsResponse,
  GetProductSuggestionsRequest,
  GetProductSuggestionsResponse,
  GetRebrickablePartsRequest,
  GetRebrickablePartsResponse,
} from 'src/app/models/brickhunter-api';
import { GetRebrickableColorResponse } from 'src/app/models/brickhunter-api/_get-rebrickable-color-response.model';
import { GetPickABrickPartsRequest } from 'src/app/models/brickhunter-api/_get-pickabrick-parts-request.model';
import { GetPickABrickPartsResponse } from 'src/app/models/brickhunter-api/_get-pickabrick-parts-response.model';

@Injectable()
export class BrickHunterApiService {
  baseURL: string = 'https://api.bricktwo.net';
  // baseURL: string = 'https://localhost:7141';

  constructor(private http: HttpClient) {}

  getRebrickableParts(request: GetRebrickablePartsRequest[]): Observable<GetRebrickablePartsResponse[]> {
    return this.http.post<GetRebrickablePartsResponse[]>(this.baseURL + '/v2.1/rebrickable/parts', request);
  }

  getBrickLinkParts(request: GetBrickLinkPartsRequest): Observable<GetBrickLinkPartsResponse[]> {
    return this.http.post<GetBrickLinkPartsResponse[]>(this.baseURL + '/v2/bricklink/parts', request);
  }

  getBrickHunterGlobalSettings() {
    return this.http.get<GetBrickHunterGlobalSettingsResponse>(this.baseURL + '/v2/brickhunter/global-settings');
  }

  getRebrickableColors() {
    return this.http.get<GetRebrickableColorResponse>(this.baseURL + '/v2/rebrickable/colors');
  }

  getPickABrickParts(request: GetPickABrickPartsRequest) {
    return this.http.post<GetPickABrickPartsResponse>(this.baseURL + '/v2/pickabrick/parts', request);
  }

  getProductsSuggestions(request: GetProductSuggestionsRequest) {
    return this.http.post<GetProductSuggestionsResponse[]>(this.baseURL + '/v2/products/suggestions', request);
  }
}

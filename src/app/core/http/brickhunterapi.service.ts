import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  GetBrickHunterGlobalSettingsResponse,
  GetBrickLinkPartsRequest,
  GetBrickLinkPartsResponse,
  GetRebrickablePartsRequest,
  GetRebrickablePartsResponse,
} from 'src/app/models/brickhunter-api';
import { GetRebrickableColorResponse } from 'src/app/models/brickhunter-api/_get-rebrickable-color-response.model';
import { GetPickABrickPartsRequest } from 'src/app/models/brickhunter-api/_get-pickabrick-parts-request.model';
import { GetPickABrickPartsResponse } from 'src/app/models/brickhunter-api/_get-pickabrick-parts-response.model';

@Injectable()
export class BrickHunterApiService {
  baseURL: string = 'https://api.bricktwo.net/v2/';
  //baseURL: string = 'https://localhost:7141/';

  constructor(private http: HttpClient) {}

  getRebrickableParts(request: GetRebrickablePartsRequest): Observable<GetRebrickablePartsResponse[]> {
    return this.http.post<GetRebrickablePartsResponse[]>(this.baseURL + 'rebrickable/parts', request);
  }

  getBrickLinkParts(request: GetBrickLinkPartsRequest): Observable<GetBrickLinkPartsResponse[]> {
    return this.http.post<GetBrickLinkPartsResponse[]>(this.baseURL + 'bricklink/parts', request);
  }

  getBrickHunterGlobalSettings() {
    return this.http.get<GetBrickHunterGlobalSettingsResponse>(this.baseURL + 'brickhunter/global-settings');
  }

  getRebrickableColors() {
    return this.http.get<GetRebrickableColorResponse>(this.baseURL + 'rebrickable/colors');
  }

  getPickABrickParts(request: GetPickABrickPartsRequest) {
    return this.http.post<GetPickABrickPartsResponse>(this.baseURL + 'pickabrick/parts', request);
  }
}

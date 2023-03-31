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

@Injectable()
export class BrickHunterApiService {
  baseURL: string = 'https://brichunter-web-svc.azurewebsites.net/';
  //baseURL: string = 'https://localhost:7141/';

  constructor(private http: HttpClient) {}

  getRebrickableParts(request: GetRebrickablePartsRequest): Observable<GetRebrickablePartsResponse[]> {
    return this.http.post<GetRebrickablePartsResponse[]>(this.baseURL + 'parts', request);
  }

  getBrickLinkParts(request: GetBrickLinkPartsRequest): Observable<GetBrickLinkPartsResponse[]> {
    return this.http.post<GetBrickLinkPartsResponse[]>(this.baseURL + 'bricklink', request);
  }

  getBrickHunterGlobalSettings() {
    return this.http.get<GetBrickHunterGlobalSettingsResponse>(this.baseURL + 'v1/brickhunter/global-settings');
  }

  getRebrickableColors() {
    return this.http.get<GetRebrickableColorResponse>(this.baseURL + 'v1/rebrickable/colors');
  }
}

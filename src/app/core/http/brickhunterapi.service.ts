import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  GetBrickLinkPartsRequest,
  GetBrickLinkPartsResponse,
  GetRebrickablePartsRequest,
  GetRebrickablePartsResponse,
} from 'src/app/models/brickhunter-api';

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
}

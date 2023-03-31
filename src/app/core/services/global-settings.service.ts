import { Injectable } from '@angular/core';
import { BrickHunterApiService } from '../http/brickhunterapi.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingsService {
  maxPaBLotPerOrder = 0;
  defaultMaxQuantityPerLot = 0;

  constructor(private readonly brickhunterApiService: BrickHunterApiService) {
    this.brickhunterApiService.getBrickHunterGlobalSettings().subscribe({
      next: settings => {
        this.maxPaBLotPerOrder = settings.maxPaBLotPerOrder;
        this.defaultMaxQuantityPerLot = settings.defaultMaxQuantityPerLot;
      },
    });
  }
}

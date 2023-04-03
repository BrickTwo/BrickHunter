import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BrickHunterApiService } from '../http/brickhunterapi.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingsService {
  maxPaBLotPerOrder = 0;
  defaultMaxQuantityPerLot = 0;
  subtractHaveFromQuantity = true;
  ignoreBrickLinkPrices = false;

  private settingsChangedSubject$ = new Subject<number>();
  settingsChanged$ = this.settingsChangedSubject$.asObservable();
  private settingsChangedNumber = 0;

  constructor(private readonly brickhunterApiService: BrickHunterApiService) {
    this.brickhunterApiService.getBrickHunterGlobalSettings().subscribe({
      next: settings => {
        this.maxPaBLotPerOrder = settings.maxPaBLotPerOrder;
        this.defaultMaxQuantityPerLot = settings.defaultMaxQuantityPerLot;
      },
    });

    this.subtractHaveFromQuantity = (localStorage.getItem('subtractHaveFromQuantity') || 'true') === 'true';
    this.ignoreBrickLinkPrices = (localStorage.getItem('ignoreBrickLinkPrices') || 'false') === 'true';
    this.settingsChangedSubject$.next(this.settingsChangedNumber++);
  }

  setSubtractHaveFromQuantity(value: boolean) {
    this.subtractHaveFromQuantity = value;
    localStorage.setItem('subtractHaveFromQuantity', String(value));
    this.settingsChangedSubject$.next(this.settingsChangedNumber++);
  }

  setIgnoreBrickLinkPrices(value: boolean) {
    this.ignoreBrickLinkPrices = value;
    localStorage.setItem('ignoreBrickLinkPrices', String(value));
    this.settingsChangedSubject$.next(this.settingsChangedNumber++);
  }
}

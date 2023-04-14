import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BrickHunterApiService } from '../http/brickhunterapi.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingsService {
  maxPaBLotPerOrder = 0;
  defaultMaxQuantityPerLot = 0;
  subtractHaveFromQuantity = true;
  ignoreBrickLinkPrices = false;
  subtractBrickLinkPrice = false;
  subtractBrickLinkPriceAmount = 0;
  subtractBrickLinkPriceUnit = 'absolute';

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
    this.subtractBrickLinkPrice = (localStorage.getItem('subtractBrickLinkPrice') || 'false') === 'true';
    this.subtractBrickLinkPriceAmount = Number(localStorage.getItem('subtractBrickLinkPriceAmount')) || 0;
    this.subtractBrickLinkPriceUnit = localStorage.getItem('subtractBrickLinkPriceUnit') || 'absolute';
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

  setSubtractBrickLinkPrice(value: boolean) {
    this.subtractBrickLinkPrice = value;
    localStorage.setItem('subtractBrickLinkPrice', String(value));
    this.settingsChangedSubject$.next(this.settingsChangedNumber++);
  }

  setSubtractBrickLinkPriceAmount(value: number) {
    this.subtractBrickLinkPriceAmount = value;
    localStorage.setItem('subtractBrickLinkPriceAmount', String(value));
    this.settingsChangedSubject$.next(this.settingsChangedNumber++);
  }

  setSubtractBrickLinkPriceUnit(value: string) {
    this.subtractBrickLinkPriceUnit = value;
    localStorage.setItem('subtractBrickLinkPriceUnit', String(value));
    this.settingsChangedSubject$.next(this.settingsChangedNumber++);
  }
}

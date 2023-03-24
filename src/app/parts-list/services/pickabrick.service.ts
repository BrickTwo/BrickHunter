import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocaleService } from 'src/app/core/services/locale.service';
import {
  BackgroundRequestAction,
  BackgroundRequestService,
  IBackgroundAddElementRequest,
  IBackgroundFindBricksRequest,
  IBackgroundGetTabIdRequest,
  IBackgroundOpenBrickABrickRequest,
  IBackgroundReadQauthRequest,
} from 'src/app/models/background-message';
import { IPart } from 'src/app/models/parts-list';
import { IAddElementItem } from 'src/app/models/pick-a-brick';
import { PartsListService } from './parts-list.service';

@Injectable()
export class PickABrickService {
  pabLoading = new Subject<boolean>();
  pabLoadError = '';
  transferStep = new Subject<number>();
  transferError = '';

  constructor(private readonly partsListService: PartsListService, private readonly localeService: LocaleService) {}

  getParts(uuid: string) {
    this.pabLoadError = '';
    this.pabLoading.next(true);

    let elementIds: number[] = [];
    const partsList = this.partsListService.getPartsList(uuid);
    partsList.parts.map(item => elementIds.push(...item.elementIds));

    const request: IBackgroundFindBricksRequest = {
      service: BackgroundRequestService.PickaBrick,
      action: BackgroundRequestAction.FindBricks,
      elementIds: elementIds,
      locale: this.localeService.languageCountryCode,
    };

    chrome.runtime
      .sendMessage(request)
      .then(results => {
        if (results.status) throw new Error(results.message);

        let parts: IPart[] = partsList.parts.map(part => {
          if (!part.elementIds || part.elementIds.length === 0) return { ...part, lego: null };
          const pab = results.find(result => part.elementIds?.find(e => e === Number(result.variant.id)));
          if (!pab) return { ...part, lego: null };

          part.lego = {
            elementId: Number(pab.variant.id),
            designNumber: Number(pab.variant.attributes.designNumber),
            price: {
              currencyCode: String(pab.variant.price.currencyCode),
              amount: Number(pab.variant.price.centAmount) / 100,
            },
            colourId: Number(pab.variant.attributes.colourId),
            deliveryChannel: String(pab.variant.attributes.deliveryChannel),
            inStock: Boolean(pab.inStock),
          };

          return part;
        });

        partsList.parts = parts;
        this.partsListService.updatePartsList(partsList);
        this.pabLoading.next(false);
      })
      .catch(e => {
        this.pabLoadError = 'something went wrong';
        this.pabLoading.next(false);
      });
  }

  transferParts(parts: IPart[], cartType: string) {
    this.transferError = '';
    this.transferStep.next(1);
    this.getTabId()
      .then(tabId => {
        this.transferStep.next(2);
        this.getQAuth(tabId)
          .then(authorization => {
            this.transferStep.next(4);
            this.addElementsToCart(authorization, parts, cartType)
              .then(response => {
                this.transferStep.next(0);
                this.openPickABrick(tabId);
              })
              .catch(e => {
                this.transferError = e;
                this.transferStep.next(0);
              });
          })
          .catch(e => {
            this.transferError = e;
            this.transferStep.next(0);
          });
      })
      .catch(e => {
        this.transferError = e;
        this.transferStep.next(0);
      });
  }

  getTabId() {
    const request: IBackgroundGetTabIdRequest = {
      service: BackgroundRequestService.PickaBrick,
      action: BackgroundRequestAction.GetLegoTabId,
    };

    return chrome.runtime
      .sendMessage(request)
      .then(response => {
        if (response.status) throw new Error(response.message);
        return response;
      })
      .catch(e => {
        throw new Error('No tab open with lego.com.');
      });
  }

  getQAuth(tabId: number) {
    const request: IBackgroundReadQauthRequest = {
      service: BackgroundRequestService.PickaBrick,
      action: BackgroundRequestAction.ReadLegoQAuth,
      tabId: tabId,
    };

    return chrome.runtime
      .sendMessage(request)
      .then(response => {
        if (response.status) throw new Error(response.message);
        return response;
      })
      .catch(e => {
        throw new Error("Couldn't read authentication");
      });
  }

  addElementsToCart(authorization: string, parts: IPart[], cartType: string) {
    const items = parts.map(part => {
      const item: IAddElementItem = {
        sku: part.lego.elementId.toString(),
        quantity: part.qty,
      };
      return item;
    });

    const request: IBackgroundAddElementRequest = {
      service: BackgroundRequestService.PickaBrick,
      action: BackgroundRequestAction.AddElementToCart,
      authorization: authorization,
      items: items.slice(0, 150),
      cartType: cartType,
      locale: this.localeService.languageCountryCode,
    };

    return chrome.runtime
      .sendMessage(request)
      .then(response => {
        if (response.status) throw new Error(response.message);
        return response;
      })
      .catch(e => {
        throw new Error("Couldn't add parts to shopping cart");
      });
  }

  openPickABrick(tabId: number) {
    const request: IBackgroundOpenBrickABrickRequest = {
      service: BackgroundRequestService.PickaBrick,
      action: BackgroundRequestAction.OpenPickABrick,
      tabId: tabId,
      affiliate: null,
      locale: this.localeService.languageCountryCode,
    };

    return chrome.runtime.sendMessage(request);
  }
}

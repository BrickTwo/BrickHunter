import { Injectable } from '@angular/core';
import { Subject, Subscriber } from 'rxjs';
import { LocaleService } from 'src/app/core/services/locale.service';
import {
  BackgroundRequestAction,
  BackgroundRequestService,
  IBackgroundAddElementRequest,
  IBackgroundFindBricksRequest,
  IBackgroundGetTabIdRequest,
  IBackgroundOpenBrickABrickRequest,
  IBackgroundReadCartRequest,
  IBackgroundReadCartResponse,
  IBackgroundReadQauthRequest,
  IBackgroundResponse,
  IReadCartItem,
} from 'src/app/models/background-message';
import { IPart } from 'src/app/models/parts-list';
import { IAddElementItem } from 'src/app/models/pick-a-brick';
import { TransferWarningComponent } from '../components/transfer-warning/transfer-warning.component';
import { PartsListService } from './parts-list.service';

@Injectable()
export class PickABrickService {
  pabLoading = new Subject<boolean>();
  pabLoadError = '';
  transferStep$: Subscriber<number>;
  transferWarningComponent: TransferWarningComponent;
  authorization: string;
  tabId: number;
  cartType: string;
  parts: IPart[];

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
            maxOrderQuantity:
              pab.variant.attributes.maxOrderQuantity > 0 ? pab.variant.attributes.maxOrderQuantity : 999,
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

  async transferParts(
    transferStep$: Subscriber<number>,
    parts: IPart[],
    cartType: string,
    transferWarningComponent: TransferWarningComponent
  ) {
    this.transferStep$ = transferStep$;
    this.transferWarningComponent = transferWarningComponent;
    this.cartType = cartType;
    this.parts = parts;

    this.startTransfer();
  }

  private async startTransfer() {
    // 1. get Tab Id
    this.transferStep$.next(1);
    await this.getTabId().catch(e => {
      this.transferStep$.error(e);
    });

    // 2. get QAuth
    this.transferStep$.next(2);
    await this.getQAuth(this.tabId).catch(e => {
      this.transferStep$.error(e);
    });

    // 3. Check current Cart
    this.transferStep$.next(3);
    if (
      !(await this.getReadCart(this.authorization, this.cartType)
        .then(cart => {
          console.log('cart', cart);
          if (!this.checkCart(cart, this.parts)) {
            return false;
          }
          return true;
        })
        .catch(e => {
          this.transferStep$.error(e);
        }))
    )
      return;

    // 4. Add elements to cart
    this.transferStep$.next(4);
    await this.addElementsToCart(this.authorization, this.parts, this.cartType).catch(e => {
      this.transferStep$.error(e);
    });

    // 5. open pick a brick page
    this.transferStep$.complete();
    this.openPickABrick(this.tabId);
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
        this.tabId = response;
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
        this.authorization = response;
      })
      .catch(e => {
        throw new Error("Couldn't read authentication");
      });
  }

  getReadCart(authorization: string, cartType: string) {
    const request: IBackgroundReadCartRequest = {
      service: BackgroundRequestService.PickaBrick,
      action: BackgroundRequestAction.ReadCart,
      authorization: authorization,
      locale: this.localeService.languageCountryCode,
      deliveryChannels: [cartType],
    };

    return chrome.runtime
      .sendMessage(request)
      .then((response: IBackgroundResponse) => {
        console.log(response);
        if (response.error) throw new Error(response.error.message);
        return response.success[0] as IBackgroundReadCartResponse;
      })
      .catch(e => {
        throw new Error("Couldn't read shopping cart");
      });
  }

  addElementsToCart(authorization: string, parts: IPart[], cartType: string) {
    const items = parts.map(part => {
      const item: IAddElementItem = {
        sku: part.lego.elementId.toString(),
        quantity: Number(part.qty),
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

  checkCart(cart: IBackgroundReadCartResponse, parts: IPart[]) {
    let partsWithWarning: { part: IPart; cart: IReadCartItem | undefined }[] = [];

    let newParts = parts.flatMap(part => {
      const inCart = cart?.lineItems?.find(li => Number(li.elementVariant.id) === part.lego.elementId);
      const qtyForCart = part.qty + inCart?.quantity;

      if (part.lego.maxOrderQuantity < qtyForCart) {
        partsWithWarning.push({ part: part, cart: inCart });
      }

      const maxPossibleQuantity = part.lego.maxOrderQuantity - inCart?.quantity;
      if (maxPossibleQuantity === 0) return [];
      if (part.qty > maxPossibleQuantity) part.qty = maxPossibleQuantity;

      return [part];
    });

    const differenceAmount = cart?.lineItems?.filter(
      item => !parts.some(p => p.lego.elementId === Number(item.elementVariant.id))
    ).length;

    if (parts.length + differenceAmount > 150) {
      for (let i = parts.length - 1; i >= 0; i--) {
        if (cart?.lineItems?.find(item => Number(item.elementVariant.id) === newParts[i].elementId)) continue;
        partsWithWarning.push({ part: newParts[i], cart: null });
        newParts.splice(i, 1);

        if (newParts.length - differenceAmount === 150) break;
      }
      this.parts = newParts;
    }

    if (partsWithWarning.length) {
      this.transferWarningComponent.open(partsWithWarning);
      return false;
    }

    return true;
  }

  cancelTransfer() {
    this.transferStep$.next(9);
    this.transferStep$.complete();
  }

  async continueTransfer() {
    this.startTransfer();
  }
}

import { Injectable } from '@angular/core';
import { Subject, Subscriber } from 'rxjs';
import { GlobalSettingsService } from 'src/app/core/services/global-settings.service';
import { LocaleService } from 'src/app/core/services/locale.service';
import {
  BackgroundRequestAction,
  BackgroundRequestService,
  BackgroundAddElementRequest,
  BackgroundChangeElementRequest,
  BackgroundFindBricksRequest,
  BackgroundGetTabIdRequest,
  BackgroundOpenBrickABrickRequest,
  BackgroundReadCartRequest,
  BackgroundReadCartResponse,
  BackgroundReadQauthRequest,
  BackgroundResponse,
  ReadCartItem,
} from 'src/app/models/background-message';
import { Part } from 'src/app/models/parts-list';
import { AddElementItem, ChangeElementItem, PaBCartType } from 'src/app/models/pick-a-brick';
import { TransferWarningComponent } from '../components/transfer-warning/transfer-warning.component';
import { PartsListService } from './parts-list.service';
import { VersionService } from 'src/app/core/services/version.service';
import { Affiliate } from 'src/app/models/global';

@Injectable()
export class PickABrickService {
  pabLoading = new Subject<boolean>();
  pabLoadError = '';
  transferStep$: Subscriber<number>;
  transferWarningComponent: TransferWarningComponent;
  authorization: string;
  tabId: number;
  cartType: PaBCartType;
  parts: Part[];
  cart: BackgroundReadCartResponse;
  affiliate: Affiliate;

  constructor(
    private readonly partsListService: PartsListService,
    private readonly localeService: LocaleService,
    private readonly gloablSettingsService: GlobalSettingsService,
    private readonly versionService: VersionService
  ) {}

  getParts(uuid: string) {
    if (this.versionService.devmode) return;
    this.pabLoadError = '';

    let elementIds: number[] = [];
    const partsList = this.partsListService.getPartsList(uuid);
    partsList?.parts?.map(item => elementIds.push(...item.elementIds));

    if (!elementIds.length) return;

    this.pabLoading.next(true);

    const request: BackgroundFindBricksRequest = {
      service: BackgroundRequestService.PickaBrick,
      action: BackgroundRequestAction.FindBricks,
      elementIds: elementIds,
      locale: this.localeService.languageCountryCode,
    };

    chrome.runtime
      .sendMessage(request)
      .then(results => {
        if (results.status) throw new Error(results.message);

        let parts: Part[] = partsList.parts.map(part => {
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
    parts: Part[],
    cartType: PaBCartType,
    transferWarningComponent: TransferWarningComponent,
    affiliate: Affiliate
  ) {
    this.transferStep$ = transferStep$;
    this.transferWarningComponent = transferWarningComponent;
    this.cartType = cartType;
    this.parts = [...parts];
    this.affiliate = affiliate;

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
          if (!this.checkCart(cart)) {
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
    await this.addElementsToCart().catch(e => {
      this.transferStep$.error(e);
    });

    // 5. Add elements to cart
    this.transferStep$.next(5);
    await this.changeElementsInCart().catch(e => {
      this.transferStep$.error(e);
    });

    // 6. open pick a brick page
    this.transferStep$.next(6);
    this.transferStep$.complete();
    this.openPickABrick(this.tabId);
  }

  getTabId() {
    const request: BackgroundGetTabIdRequest = {
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
    const request: BackgroundReadQauthRequest = {
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
        throw new Error("Couldn't read authentication. Please close all Tabs in your Browser with lego.com and try again.");
      });
  }

  getReadCart(authorization: string, cartType: string) {
    const request: BackgroundReadCartRequest = {
      service: BackgroundRequestService.PickaBrick,
      action: BackgroundRequestAction.ReadCart,
      authorization: authorization,
      locale: this.localeService.languageCountryCode,
      deliveryChannels: [cartType],
    };

    return chrome.runtime
      .sendMessage(request)
      .then((response: BackgroundResponse) => {
        if (response.error) throw new Error(response.error.message);
        this.cart = response.success[0] as BackgroundReadCartResponse;
        return response.success[0] as BackgroundReadCartResponse;
      })
      .catch(e => {
        throw new Error("Couldn't read shopping cart");
      });
  }

  async addElementsToCart() {
    const partsToAdd = this.parts.filter(
      part => !this.cart?.lineItems.some(item => part.lego.elementId === Number(item.elementVariant.id))
    );

    if (partsToAdd.length === 0) return;

    const items = partsToAdd.map(part => {
      let orderQuantity = Number(part.qty);
      if (this.gloablSettingsService.subtractHaveFromQuantity) orderQuantity -= part.have || 0;

      const item: AddElementItem = {
        sku: part.lego.elementId.toString(),
        quantity: orderQuantity,
      };
      return item;
    });

    const request: BackgroundAddElementRequest = {
      service: BackgroundRequestService.PickaBrick,
      action: BackgroundRequestAction.AddElementToCart,
      authorization: this.authorization,
      items: items.slice(0, this.gloablSettingsService.maxPaBLotPerOrder),
      cartType: this.cartType,
      locale: this.localeService.languageCountryCode,
    };

    return await chrome.runtime
      .sendMessage(request)
      .then(response => {
        if (response.status) throw new Error(response.message);
        return;
      })
      .catch(e => {
        throw new Error("Couldn't add parts to shopping cart");
      });
  }

  async changeElementsInCart() {
    const partsToChange = this.parts.filter(part =>
      this.cart?.lineItems.some(item => part.lego.elementId === Number(item.elementVariant.id))
    );

    if (partsToChange.length === 0) return;

    const items = partsToChange.map(part => {
      const itemInCart = this.cart?.lineItems.find(item => Number(item.elementVariant.id) === part.lego.elementId);

      let orderQuantity = Number(part.qty);
      if (this.gloablSettingsService.subtractHaveFromQuantity) orderQuantity -= part.have || 0;

      const item: ChangeElementItem = {
        lineItemId: itemInCart.id,
        quantity: itemInCart.quantity + orderQuantity,
      };
      return item;
    });

    const request: BackgroundChangeElementRequest = {
      service: BackgroundRequestService.PickaBrick,
      action: BackgroundRequestAction.ChangeElementInCart,
      authorization: this.authorization,
      items: items,
      cartType: this.cartType,
      locale: this.localeService.languageCountryCode,
    };

    return await chrome.runtime
      .sendMessage(request)
      .then(response => {
        if (response.status) throw new Error(response.message);
        return;
      })
      .catch(e => {
        throw new Error("Couldn't add parts to shopping cart");
      });
  }

  openPickABrick(tabId: number) {
    const request: BackgroundOpenBrickABrickRequest = {
      service: BackgroundRequestService.PickaBrick,
      action: BackgroundRequestAction.OpenPickABrick,
      tabId: tabId,
      affiliate: this.affiliate,
      locale: this.localeService.languageCountryCode,
    };

    return chrome.runtime.sendMessage(request);
  }

  private checkCart(cart: BackgroundReadCartResponse) {
    let partsWithWarning: { part: Part; cart: ReadCartItem | undefined }[] = [];

    let newParts = this.parts.flatMap(({ ...part }) => {
      const inCart = cart?.lineItems?.find(li => Number(li.elementVariant.id) === part.lego.elementId);

      const maxPossibleQuantity = part.lego.maxOrderQuantity - (inCart ? inCart.quantity : 0);
      if (maxPossibleQuantity === 0) {
        partsWithWarning.push({ part: { ...part }, cart: inCart });
        return [];
      }

      let orderQuantity = Number(part.qty);
      if (this.gloablSettingsService.subtractHaveFromQuantity) orderQuantity -= part.have || 0;

      if (orderQuantity > maxPossibleQuantity) {
        partsWithWarning.push({ part: { ...part }, cart: inCart });
        part.qty = maxPossibleQuantity;
      }

      return [part];
    });

    const differenceAmount = cart?.lineItems?.filter(
      item => !this.parts.some(p => p.lego.elementId === Number(item.elementVariant.id))
    ).length;

    let maxPaBLotPerOrderExceeded = false;

    if (this.parts.length + differenceAmount > this.gloablSettingsService.maxPaBLotPerOrder) {
      maxPaBLotPerOrderExceeded = true;
      for (let i = this.parts.length - 1; i >= 0; i--) {
        if (cart?.lineItems?.find(item => Number(item.elementVariant.id) === newParts[i].elementId)) continue;

        const partWithWarning = partsWithWarning.find(
          item => item.part.lego.elementId === this.parts[i].lego.elementId
        );
        if (partWithWarning) {
          partWithWarning.cart = null;
        } else {
          partsWithWarning.push({ part: newParts[i], cart: null });
        }

        newParts.splice(i, 1);

        if (newParts.length - differenceAmount === this.gloablSettingsService.maxPaBLotPerOrder) break;
      }
    }
    this.parts = newParts;

    if (partsWithWarning.length) {
      this.transferWarningComponent.open(partsWithWarning, maxPaBLotPerOrderExceeded);
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

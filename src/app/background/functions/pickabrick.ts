import { IBackgroundReadCartResponse, IBackgroundResponse } from 'src/app/models/background-message';
import { IAffiliate } from 'src/app/models/global';
import {
  IAddElement,
  IAddElementItem,
  IChangeElement,
  IChangeElementItem,
  PaBCartType,
} from 'src/app/models/pick-a-brick';

const timeout = setTimeout(function () {}, 5000);

export class PickABrick {
  static async finBricks(elementIds: number[], locale: string) {
    const amountPerIteration = 900;
    let iteration = 0;
    let parts = [];
    let page = 0;

    do {
      let items = elementIds.slice(iteration * amountPerIteration, (iteration + 1) * amountPerIteration);
      let response: any;
      do {
        page++;
        response = await this.findBricksRequest(items, locale, page);
        if (response.status) {
          return {
            status: response.status,
            message: 'error loading parts',
          };
        }

        parts.push(...response.results);
      } while (response.total > page * 500);
      page = 0;
      iteration++;
    } while (elementIds.length > iteration * amountPerIteration);

    return parts;
  }

  static async findBricksRequest(elementIds: number[], locale: string, page: number) {
    var PickABrickQuery = {
      operationName: 'PickABrickQuery',
      variables: {
        includeOutOfStock: true,
        page: page,
        perPage: 500,
        query: elementIds.join(' '),
      },
      query:
        'query PickABrickQuery($query: String, $page: Int, $perPage: Int, $sort: SortInput, $filters: [Filter!], $includeOutOfStock: Boolean) {\n  __typename\n  elements(query: $query, page: $page, perPage: $perPage, filters: $filters, sort: $sort, includeOutOfStock: $includeOutOfStock) {\n    count\n    results {\n      ...ElementLeafData\n      __typename\n    }\n    total\n    __typename\n  }\n}\n\nfragment ElementLeafData on Element {\n  id\n  name\n  inStock\n  primaryImage\n  ... on SingleVariantElement {\n    variant {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  ... on MultiVariantElement {\n    variants {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ElementLeafVariant on ElementVariant {\n  id\n  price {\n    currencyCode\n    centAmount\n    formattedAmount\n    __typename\n  }\n  attributes {\n    availabilityStatus\n    canAddToBag\n    colour\n	colourId\n    colourFamily\n    designNumber\n    mainGroup\n    materialGroup\n    materialType\n    maxOrderQuantity\n    showInListing\n    colourId\n    deliveryChannel\n    __typename\n  }\n  __typename\n}\n',
    };

    var url = 'https://www.lego.com/api/graphql/PickABrickQuery';

    var response = await fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-locale': locale, //de-CH
        'session-cookie-id': 'BrickHunterExtension',
      },
      body: JSON.stringify(PickABrickQuery),
    })
      .then(response => {
        clearTimeout(timeout);
        if (response.status < 200 || response.status >= 300) {
          return {
            status: response.status,
            message: response.json(),
          };
        }
        return response.json();
      })
      .catch(err => {
        return {
          status: response.error,
          message: 'somethign went wrong',
        };
      });

    if (response.status) return response;
    return response.data.elements;
  }

  static async addElementToCart(
    authorization: string,
    items: IAddElementItem[],
    cartType: PaBCartType,
    locale: string
  ) {
    var PickABrickQuery: IAddElement = {
      operationName: 'AddToElementCart',
      variables: {
        items: items,
        cartType: cartType,
      },
      query:
        'mutation AddToElementCart($items: [ElementInput!]!, $cartType: CartType) {\n  addToElementCart(input: {items: $items, cartType: $cartType}) {\n    ...BrickCartData\n  }\n}\n\nfragment BrickCartData on BrickCart {\n  id\n}',
    };

    var url = 'https://www.lego.com/api/graphql/AddToElementCart';

    var response = await fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-locale': locale,
        authorization: authorization,
      },
      body: JSON.stringify(PickABrickQuery),
    })
      .then(response => {
        clearTimeout(timeout);
        if (response.status < 200 || response.status >= 300)
          return {
            status: response.status,
            message: response.json(),
          };
        return response.json();
      })
      .catch(err => {
        throw new err(err);
      });

    return response;
  }

  static async changeElementInCart(
    authorization: string,
    items: IChangeElementItem[],
    cartType: PaBCartType,
    locale: string
  ) {
    var PickABrickQuery: IChangeElement = {
      operationName: 'ChangeElementLineItem',
      variables: {
        elements: items,
        cartType: cartType,
      },
      query:
        'mutation ChangeElementLineItem($cartType: CartType!, $elements: [ChangeElementQuantityLineItem!], $lineItemId: String, $quantity: Int) {\n  changeElementLineItemQuantity(\n    input: {cartType: $cartType, elements: $elements, lineItemId: $lineItemId, quantity: $quantity}\n  ) {\n    ...BrickCartData\n  }\n}\n\nfragment BrickCartData on BrickCart {\n  id\n}',
    };

    var url = 'https://www.lego.com/api/graphql/ChangeElementLineItem';

    var response = await fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-locale': locale,
        authorization: authorization,
      },
      body: JSON.stringify(PickABrickQuery),
    })
      .then(response => {
        clearTimeout(timeout);
        if (response.status < 200 || response.status >= 300)
          return {
            status: response.status,
            message: response.json(),
          };
        return response.json();
      })
      .catch(err => {
        throw new err(err);
      });

    return response;
  }

  static async readCart(
    authorization: string,
    locale: string,
    deliveryChannels: string[]
  ): Promise<IBackgroundResponse> {
    var PickABrickQuery = {
      operationName: 'ElementCartQuery',
      variables: {
        cartTypes: deliveryChannels,
        query: '',
      },
      query:
        'query ElementCartQuery($cartTypes: [CartType]) {\n  me {\n    ... on LegoUser {\n      elementCarts(types: $cartTypes) {\n        carts {\n          ...BrickCartData\n        }\n      }\n    }\n  }\n}\n\nfragment BrickCartData on BrickCart {\n  id\n  lineItems {\n    ...LineItemData\n  }\n}\n\nfragment LineItemData on PABCartLineItem {\n  id\n  quantity\n  elementVariant {\n    id\n    attributes {\n      designNumber\n      deliveryChannel\n      maxOrderQuantity\n    }\n  }\n}',
    };

    var url = 'https://www.lego.com/api/graphql/ElementCartQuery';

    var response: IBackgroundResponse = await fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-locale': locale,
        authorization: authorization,
      },
      body: JSON.stringify(PickABrickQuery),
    })
      .then(response => {
        clearTimeout(timeout);
        return response.json();
      })
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          return {
            error: {
              status: response.status,
              message: JSON.stringify(response),
            },
          };
        }

        return {
          success: response.data.me.elementCarts.carts as IBackgroundReadCartResponse[],
        };
      })
      .catch(error => {
        console.log(error);
        return {
          error: {
            status: 9999,
            message: JSON.stringify(error),
          },
        };
      });

    return response;
  }

  static async readQAuth(tabId: number) {
    let response = await (async () => {
      const response = await chrome.tabs.sendMessage(tabId, { contentScriptQuery: 'readCookieGQAuth' }).catch(error => {
        return { status: 1, message: error };
      });
      return response;
    })();
    return response;
  }

  static getLegoTab() {
    return chrome.tabs
      .query({
        url: '*://*.lego.com/*',
        status: 'complete',
      })
      .then(tabs => {
        if (!tabs.length) {
          return { status: 1, message: 'nope' };
        }

        return tabs[0].id;
      })
      .catch(error => {
        return { status: 1, message: error };
      });
  }

  static openPickABrick(tabId: number, affiliate: IAffiliate, locale: string) {
    var url = `https://www.lego.com/${locale}/page/static/pick-a-brick`;
    if (affiliate) {
      url =
        `https://track.webgains.com/click.html?wgcampaignid=${affiliate.wgcampaignid}&wgprogramid=${affiliate.wgprogramid}&clickref=${affiliate.clickref}&wgtarget=` +
        url;
    }

    chrome.tabs
      .update(tabId, {
        url: url,
        active: true,
      })
      .catch(error => console.log(error));

    return true;
  }
}

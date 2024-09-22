import { BackgroundReadCartResponse, BackgroundResponse } from 'src/app/models/background-message';
import { Affiliate } from 'src/app/models/global';
import { AddElement, AddElementItem, ChangeElement, ChangeElementItem, PaBCartType } from 'src/app/models/pick-a-brick';

const timeout = setTimeout(function () {}, 5000);

export class PickABrick {
  static async findBricks(elementIds: number[], locale: string) {
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
      } while (response.total > page * 400);
      page = 0;
      iteration++;
    } while (elementIds.length > iteration * amountPerIteration);

    return parts;
  }

  static async findBricksRequest(elementIds: number[], locale: string, page: number) {
    var PickABrickQuery = {
      operationName: 'PickABrickQuery',
      variables: {
        input: {
          includeOutOfStock: true,
          page: page,
          perPage: 400,
          query: elementIds.join(' '),
        },
      },
      query:
        'query PickABrickQuery($input: ElementQueryInput!) {\n  searchElements(input: $input) {\n    results {\n      ...ElementLeaf\n    }\n    total\n    count\n  }\n}\n\nfragment ElementLeaf on SearchResultElement {\n  id\n  designId\n  name\n  imageUrl\n  maxOrderQuantity\n  deliveryChannel\n  price {\n    currencyCode\n    centAmount\n    formattedAmount\n    formattedValue\n  }\n  facets {\n    category {\n      ...ElementFacetCategory\n    }\n    subcategory {\n      ...ElementFacetCategory\n    }\n    color {\n      ...ElementFacetCategory\n    }\n    colorFamily {\n      ...ElementFacetCategory\n    }\n    system\n  }\n  inStock\n}\n\nfragment ElementFacetCategory on ElementCategory {\n  name\n  key\n}\n',
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
    return response.data.searchElements;
  }

  static async addElementToCart(authorization: string, items: AddElementItem[], cartType: PaBCartType, locale: string) {
    var PickABrickQuery: AddElement = {
      operationName: 'ElementCartsAddToCart',
      variables: {
        items: items,
        cartType: cartType,
        returnCarts: [],
      },
      query:
        'mutation ElementCartsAddToCart($items: [ElementInput!]!, $cartType: CartType!, $returnCarts: [CartType!]!) {\n  elementCartsAddToCart(\n    input: {items: $items, cartType: $cartType, returnCarts: $returnCarts}\n  ) {\n    carts {\n      ...BrickCartData\n    }\n  }\n}\n\nfragment BrickCartData on BrickCart {\n  id\n}\n',
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
    items: ChangeElementItem[],
    cartType: PaBCartType,
    locale: string
  ) {
    var PickABrickQuery: ChangeElement = {
      operationName: 'ElementCartsChangeLineItemQuantity',
      variables: {
        elements: items,
        cartType: cartType,
        returnCarts: []
      },
      query:
        'mutation ElementCartsChangeLineItemQuantity($cartType: CartType!, $elements: [ElementLineItemInput!]!, $returnCarts: [CartType!]!) {\n  elementCartsChangeLineItemQuantity(\n    input: {cartType: $cartType, elements: $elements, returnCarts: $returnCarts}\n  ) {\n    carts {\n      ...BrickCartData\n    }\n  }\n}\n\nfragment BrickCartData on BrickCart {\n  id\n}\n',
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
  ): Promise<BackgroundResponse> {
    var PickABrickQuery = {
      operationName: 'ElementCartQuery',
      variables: {
        cartTypes: deliveryChannels,
        query: '',
      },
      query:
        'query ElementCartQuery($cartTypes: [CartType!]!) {\n  elementCarts(types: $cartTypes) {\n    carts {\n      ...BrickCartData\n    }\n  }\n}\n\nfragment BrickCartData on BrickCart {\n  brickLineItems {\n    ...BrickLineItemData\n  }\n}\n\nfragment BrickLineItemData on BrickCartLineItemElement {\n  id\n  lineItemId\n  designId\n  maxOrderQuantity\n  deliveryChannel\n  quantity\n}',
    };

    var url = 'https://www.lego.com/api/graphql/ElementCartQuery';

    var response: BackgroundResponse = await fetch(url, {
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
          success: response.data.elementCarts.carts as BackgroundReadCartResponse[],
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

  static openPickABrick(tabId: number, affiliate: Affiliate, locale: string) {
    var url = `https://www.lego.com/${locale}/page/static/pick-a-brick`;
    if (affiliate) {
      url = `https://click.linksynergy.com/deeplink?id=${affiliate.id}&mid=${affiliate.mid}&u1=${affiliate.clickref}&murl=${url}`;
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

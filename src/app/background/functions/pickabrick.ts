const timeout = setTimeout(function () { }, 5000);

export class PickABrick {
  static async finBrick(elementIds: number[], locale: string) {
    var PickABrickQuery = {
      operationName: "PickABrickQuery",
      variables: {
        includeOutOfStock: true,
        page: 1,
        perPage: 500,
        query: elementIds.join(' '),
      },
      query:
        "query PickABrickQuery($query: String, $page: Int, $perPage: Int, $sort: SortInput, $filters: [Filter!], $includeOutOfStock: Boolean) {\n  __typename\n  elements(query: $query, page: $page, perPage: $perPage, filters: $filters, sort: $sort, includeOutOfStock: $includeOutOfStock) {\n    count\n    results {\n      ...ElementLeafData\n      __typename\n    }\n    total\n    __typename\n  }\n}\n\nfragment ElementLeafData on Element {\n  id\n  name\n  inStock\n  primaryImage\n  ... on SingleVariantElement {\n    variant {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  ... on MultiVariantElement {\n    variants {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ElementLeafVariant on ElementVariant {\n  id\n  price {\n    currencyCode\n    centAmount\n    formattedAmount\n    __typename\n  }\n  attributes {\n    availabilityStatus\n    canAddToBag\n    colour\n	colourId\n    colourFamily\n    designNumber\n    mainGroup\n    materialGroup\n    materialType\n    maxOrderQuantity\n    showInListing\n    colourId\n    deliveryChannel\n    __typename\n  }\n  __typename\n}\n",
    };

    var url = "https://www.lego.com/api/graphql/PickABrickQuery";

    var response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "x-locale": locale, //de-CH
        "session-cookie-id": "BrickHunterExtension",
      },
      body: JSON.stringify(PickABrickQuery),
    })
      .then((response) => {
        clearTimeout(timeout);
        if (response.status < 200 || response.status >= 300)
          return {
            status: response.status,
            message: response.json(),
          };
        return response.json();
      })
      .catch((err) => {
        return {
          status: response.error,
          message: "",
        };
      });

    if (response.status) return response;
    return response.data.elements.results;
  }

  static async addElementToCart(authorization, items, cartType, locale: string) {
    var PickABrickQuery = {
      operationName: "AddToElementCart",
      variables: {
        items,
        cartType: cartType,
      },
      query:
        "mutation AddToElementCart($items: [ElementInput!]!, $cartType: CartType) {\n  addToElementCart(input: {items: $items, cartType: $cartType}) {\n    ...BrickCartData\n  }\n}\n\nfragment BrickCartData on BrickCart {\n  id\n}",
    };

    var url = "https://www.lego.com/api/graphql/AddToElementCart";

    var response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "x-locale": locale,
        authorization: authorization,
      },
      body: JSON.stringify(PickABrickQuery),
    })
      .then((response) => {
        clearTimeout(timeout);
        if (response.status < 200 || response.status >= 300)
          return {
            status: response.status,
            message: response.json(),
          };
        return response.json();
      })
      .catch((err) => {
        return null;
      });

    return response;
  }

  static async readCart(authorization, locale: string) {
    var PickABrickQuery = {
      operationName: "ElementCartQuery",
      variables: {
        cartTypes: ["pab", "bap"],
        query: "",
      },
      query:
        "query ElementCartQuery($cartTypes: [CartType]) {\n  me {\n    ... on LegoUser {\n      elementCarts(types: $cartTypes) {\n        carts {\n          ... on BrickCart {\n            ...BrickCartData\n            __typename\n          }\n          type\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment BrickCartData on BrickCart {\n  id\n  ... on BrickCart {\n    __typename\n  }\n  __typename\n}\n",
    };

    var url = "https://www.lego.com/api/graphql/ElementCartQuery";

    var response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "x-locale": locale,
        authorization: authorization,
      },
      body: JSON.stringify(PickABrickQuery),
    })
      .then((response) => {
        clearTimeout(timeout);
        if (response.status < 200 || response.status >= 300)
          return {
            status: response.status,
            message: response.json(),
          };
        return response.json();
      })
      .catch((error) => console.log(error));

    if (response.status) return response;
    return response.data.me.elementCarts.carts;
  }

  static async readQAuth() {
    var tabId = await PickABrick.getLegoTab();
    if (!tabId) return false;

    let response = await (async () => {
      const response = await chrome.tabs.sendMessage(tabId, { contentScriptQuery: "readCookieGQAuth" });
      return response;
    })();

    return response
  }

  static getLegoTab() {
    return chrome.tabs
      .query({
        url: "*://*.lego.com/*",
        status: "complete",
      }).then(tabs => {
        if (!tabs.length) {
          return false;
        }

        return tabs[0].id;
      })
      .catch((error) => console.log(error));
  }
}
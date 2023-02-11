var localCountry = "";
var localLanguage = "";
var localeCountryLanguage = "";
const timeout = setTimeout(function () {}, 5000);

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.indexOf("https://www.lego.com") >= 0) {
    if (changeInfo.status == "complete") {
      browser.tabs
        .sendMessage(tabId, {
          contentScriptQuery: "loaded",
        })
        .then(() => {})
        .catch((error) => {
          browser.tabs.executeScript({
            file: "js/content-script.js",
          });
        });
    }
  }

  if (
    tab.url.indexOf("https://www.lego.com/") >= 0 &&
    tab.url.indexOf("/my-account/orders/details/") >= 0
  ) {
    let showImages =
      (localStorage.getItem("showImagesInLegoOrder") || "true") === "true";

    if (showImages) {
      browser.tabs.sendMessage(tabId, {
        contentScriptQuery: "brickHunterLoadImages",
      });
    }
  }
});

browser.runtime.onMessage.addListener(async function (request) {
  prepareLocation();

  switch (request.service) {
    case "pickABrick":
      return await pickABrick(request);
    case "bricksAndPieces":
      return await bricksAndPieces(request);
    default:
      switch (request.action) {
        case "donate":
          browser.tabs
            .query({ currentWindow: true, active: true })
            .then(async (tabs) => {
              browser.tabs.update(tabs[0].id, {
                url: `https://www.paypal.com/donate?hosted_button_id=MPV9V9JUKRD6N`,
              });
            });
      }
  }
  return true;
});

function prepareLocation() {
  localeCountry = localStorage.getItem("country") || "DE";
  localeLanguage = localStorage.getItem("language") || "DE";
  localeCountryLanguage =
    localeLanguage.toLowerCase() + "-" + localeCountry.toUpperCase();
}

async function getLegoTab() {
  var tabs = await browser.tabs
    .query({
      url: "*://*.lego.com/*",
      status: "complete",
    })
    .catch((error) => console.log(error));

  if (!tabs.length) {
    return false;
  }

  return tabs[0].id;
}

function addContentScript(tabId) {
  browser.tabs.executeScript(tabId, {
    file: "js/content-script.js",
  });
}

async function pickABrick(request) {
  switch (request.action) {
    case "findBrick":
      return await findBrick(request.designId, request.sessionCookieId, request.source);
    case "readQAuth":
      return await readQAuth();
    case "readSessionCookieId":
      return await readSessionCookieId();
    case "readCart":
      return await readCart(request.authorization);
    case "clearCart":
      return await clearCart(request.authorization, request.cartType);
    case "addToCart":
      return await addToCart(
        request.authorization,
        request.PABCartId,
        request.partId,
        request.qty
      );
    case "addElementToCart":
      return await addElementToCart(
        request.authorization,
        request.items,
        request.cartType
      );
    case "open":
      return await open(request.affiliate);
  }

  pickABrick.findBrick = findBrick;
  pickABrick.readQAuth = readQAuth;
  pickABrick.readSessionCookieId = readSessionCookieId;
  pickABrick.readCart = readCart;
  pickABrick.clearCart = clearCart;
  pickABrick.addToCart = addToCart;
  pickABrick.addElementToCart = addElementToCart;
  pickABrick.open = open;

  async function findBrick(designId, sessionCookieId, source) {
    var PickABrickQuery = {
      operationName: "PickABrickQuery",
      variables: {
        page: 1,
        perPage: 500,
        query: encodeURIComponent(designId)
      },
      query:
        "query PickABrickQuery($query: String, $page: Int, $perPage: Int, $sort: SortInput, $filters: [Filter!]) {\n  __typename\n  elements(query: $query, page: $page, perPage: $perPage, filters: $filters, sort: $sort) {\n    count\n    results {\n      ...ElementLeafData\n      __typename\n    }\n    total\n    __typename\n  }\n}\n\nfragment ElementLeafData on Element {\n  id\n  name\n  primaryImage\n  ... on SingleVariantElement {\n    variant {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  ... on MultiVariantElement {\n    variants {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ElementLeafVariant on ElementVariant {\n  id\n  price {\n    currencyCode\n    centAmount\n    formattedAmount\n    __typename\n  }\n  attributes {\n    availabilityStatus\n    canAddToBag\n    colour\n	colourId\n    colourFamily\n    designNumber\n    mainGroup\n    materialGroup\n    materialType\n    maxOrderQuantity\n    showInListing\n    colourId\n    deliveryChannel\n    __typename\n  }\n  __typename\n}\n",
    };

    if (source == "lego") {
      PickABrickQuery.variables = {
        page: 1,
        perPage: 500,
        query: "",
        "filters.i0.key": "variants.attributes.designNumber",
        "filters.i0.values.i0": designId,
        filters: [{
            key: "variants.attributes.designNumber",
            values: [designId]
        }]
      }
    }

    var url = "https://www.lego.com/api/graphql/PickABrickQuery";

    var response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "x-locale": localeCountryLanguage,
        "session-cookie-id": sessionCookieId,
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

  async function readQAuth() {
    var tabId = await getLegoTab();
    if (!tabId) return false;

    return await browser.tabs
      .sendMessage(tabId, {
        contentScriptQuery: "readCookieGQAuth",
      })
      .then((authorization) => {
        return authorization;
      })
      .catch((error) => console.log(error));
  }

  async function readSessionCookieId() {
    var tabId = await getLegoTab();

    if (!tabId) return false;

    return await browser.tabs
      .sendMessage(tabId, {
        contentScriptQuery: "readCookieSessionCookieId",
      })
      .then((sessionId) => {
        return sessionId;
      })
      .catch((error) => console.log(error));
  }

  async function readCart(authorization) {
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
        "x-locale": localeCountryLanguage,
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

  async function clearCart(authorization, cartType) {
    // var PickABrickQuery = {
    //     operationName: 'RemoveAllPABLineItems',
    //     variables: {
    //         PABCartId: PABCartId,
    //     },
    //     query:
    //         'mutation RemoveAllPABLineItems($PABCartId: String!) {\n  removeAllPABLineItems(input: {PABCartId: $PABCartId}) {\n    id\n    taxedPrice {\n      totalGross {\n        formattedAmount\n        __typename\n      }\n      __typename\n    }\n    PABLineItems {\n      id\n      quantity\n      element {\n        id\n        __typename\n      }\n      totalPrice {\n        formattedAmount\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
    // };

    // var url = 'https://www.lego.com/api/graphql/RemoveAllPABLineItems';

    var PickABrickQuery = {
      operationName: "RemoveAllElementsFromCart",
      variables: {
        cartType: cartType,
      },
      query:
        "mutation RemoveAllElementsFromCart($cartType: CartType!) {\n  removeAllElementsFromCart(input: {cartType: $cartType}) {\n    ...BrickCartData\n  }\n}\n\nfragment BrickCartData on BrickCart {\n  id\n}",
    };

    var url = "https://www.lego.com/api/graphql/RemoveAllPABLineItems";

    var response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "x-locale": localeCountryLanguage,
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
        return {
          status: response.error,
          message: "",
        };
      });

    return response;
  }

  async function addToCart(authorization, PABCartId, partId, quantity) {
    var PickABrickQuery = {
      operationName: "AddToPABCart",
      variables: {
        sku: partId.toString(),
        quantity: parseInt(quantity),
        PABCartId: PABCartId,
      },
      query:
        "mutation AddToPABCart($sku: String!, $quantity: Int, $PABCartId: String!) {\n  addPABItemToCart(input: {sku: $sku, quantity: $quantity, PABCartId: $PABCartId}) {\n    id\n    taxedPrice {\n      totalGross {\n        formattedAmount\n        __typename\n      }\n      __typename\n    }\n    PABLineItems {\n      ...PABLineItemData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PABLineItemData on PABCartLineItem {\n  id\n  quantity\n  element {\n    id\n    name\n    primaryImage\n    __typename\n  }\n  price {\n    centAmount\n    currencyCode\n    __typename\n  }\n  elementVariant {\n    id\n    attributes {\n      designNumber\n      __typename\n    }\n    __typename\n  }\n  totalPrice {\n    formattedAmount\n    __typename\n  }\n  __typename\n}\n",
    };

    var url = "https://www.lego.com/api/graphql/AddToPABCart";

    var response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "x-locale": localeCountryLanguage,
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

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function addElementToCart(authorization, items, cartType) {
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

    await sleep(500);

    var response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "x-locale": localeCountryLanguage,
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

  async function open(affiliate) {
    var tabId = await getLegoTab();
    if (!tabId) return false;

    var url = `https://www.lego.com/${localeCountryLanguage}/page/static/pick-a-brick`;
    if (affiliate) {
      if (affiliate.linkType == "webgains") {
        url =
          `https://track.webgains.com/click.html?wgcampaignid=${affiliate.wgcampaignid}&wgprogramid=${affiliate.wgprogramid}&clickref=${affiliate.clickref}&wgtarget=` +
          url;
      }
    }

    browser.tabs
      .update(tabId, {
        url: url,
        active: true,
      })
      .catch((error) => console.log(error));

    return true;
  }
}

async function bricksAndPieces(request) {
  switch (request.action) {
    case "findBrick":
      return await findBrick(request.designId);
    case "findSet":
      return await findSet(request.setNumber);
    case "fillCart":
      if (!(await fillCart(request.order))) return false;
      return await open(request.affiliate);
    case "clearCart":
      return await clearCart();
  }

  bricksAndPieces.findBrick = findBrick;
  bricksAndPieces.findSet = findSet;
  bricksAndPieces.fillCart = fillCart;
  bricksAndPieces.clearCart = clearCart;
  bricksAndPieces.open = open;

  async function findBrick(designId) {
    var url = `https://bricksandpieces.services.lego.com/api/v1/bricks/items/${encodeURIComponent(
      designId
    )}?country=${localeCountry}&orderType=buy`;

    var response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "saVSCq0hpuxYV48mrXMGfdKnMY1oUs3s",
      },
    })
      .then((response) => {
        clearTimeout(timeout);

        if (response.status < 200 || response.status >= 300)
          return {
            status: response.status,
            message: response.json(),
          };

        if (response.status == 204)
          return {
            status: response.status,
            message: "",
          };

        return response.json();
      })
      .catch((err) => {
        return {
          status: response.error,
          message: "",
        };
      });

    return response;
  }

  async function findSet(setNumber) {
    var query = {
      from: 0,
      size: 10,
      sort: [
        {
          id: {
            order: "asc",
          },
        },
      ],
      query: {
        match: {
          product_number: {
            query: request.setNumber,
          },
        },
      },
    };

    var urlSearch = `https://services.slingshot.lego.com/api/v4/lego_historic_product_read/_search?useragent=brickhunter`;

    var responseSearch = await fetch(urlSearch, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "p0OKLXd8US1YsquudM1Ov9Ja7H91jhamak9EMrRB",
      },
      body: JSON.stringify(query),
    });

    if (responseSearch.status < 200 || responseSearch.status >= 300)
      return {
        status: responseSearch.status,
        message: responseSearch.json(),
      };

    var urlProduct = `https://bricksandpieces.cs.services.lego.com/api/v1/bricks/product/${encodeURIComponent(
      setNumber
    )}?country=${localeCountry}&orderType=missing`;

    var responseProduct = await fetch(urlProduct, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "saVSCq0hpuxYV48mrXMGfdKnMY1oUs3s",
      },
    });

    if (responseProduct.status < 200 || responseProduct.status >= 300)
      return {
        status: responseProduct.status,
        message: responseProduct.json(),
      };

    var returnValue = {};
    var sets = await responseSearch.json();
    var hits = sets.hits.hits;

    var set = hits.filter(
      (set) => set._source.product_number == request.setNumber
    )[0];

    if (!set) return false;

    var bricks = await responseProduct.json();
    returnValue.set = set._source;
    returnValue.bricks = bricks.bricks;

    return returnValue;
  }

  async function fillCart(order) {
    var tabId = await getLegoTab();
    if (!tabId) return false;

    await browser.tabs
      .sendMessage(tabId, {
        contentScriptQuery: "setItem",
        country: localeCountry.toUpperCase(),
        order: order,
      })
      .then((response) => {
        return response;
      })
      .catch((error) => console.log(error));

    return true;
  }

  async function clearCart() {
    var tabId = await getLegoTab();
    if (!tabId) return false;

    await browser.tabs
      .sendMessage(tabId, {
        contentScriptQuery: "removeItem",
        country: localeCountry.toUpperCase(),
      })
      .catch((error) => console.log(error));

    browser.tabs.update(tabId, {
      url: `https://www.lego.com/${localeCountryLanguage.toLowerCase()}/service/replacementparts/sale/location`,
      active: true,
    });

    return true;
  }

  async function open(affiliate) {
    var tabId = await getLegoTab();
    if (!tabId) return false;

    var target = `https://www.lego.com/${localeCountryLanguage.toLowerCase()}/service/replacementparts/sale/location`;
    if (affiliate) {
      if (affiliate.linkType == "webgains") {
        url = `https://track.webgains.com/click.html?wgcampaignid=${affiliate.wgcampaignid}&wgprogramid=${affiliate.wgprogramid}&clickref=${affiliate.clickref}&wgtarget=${target}`;
      }
    } else {
      url = target;
    }
    browser.tabs.update(tabId, {
      url: url,
      active: true,
    });
    return true;
  }
}

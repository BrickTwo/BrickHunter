browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.indexOf('https://www.lego.com') == 0) {
        browser.pageAction.show(tabId);
        //browser.tabs.executeScript({
        //  file: 'contentScript.js'
        //});
    } else {
        browser.pageAction.hide(tabId);
    }
});

browser.runtime.onMessage.addListener(function(
    request,
    sender,
    sendResponse,
    reject
) {
    var locale = localStorage.getItem('country') || 'DE';
    var locale4 = null;

    switch (locale) {
        case 'ch':
            locale4 = 'de-CH';
            break;
        case 'de':
            locale4 = 'de-DE';
            break;
        case 'at':
            locale4 = 'de-AT';
            break;
        default:
            locale4 = 'de-DE';
            break;
    }

    const timeout = setTimeout(function() {
        //didTimeOut = true;
        //reject(new Error('Request timed out'));
    }, 5000);

    if (request.contentScriptQuery == 'PickABrick') {
        var PickABrickQuery = {
            operationName: 'PickABrickQuery',
            variables: {
                page: 1,
                perPage: 20,
                query: encodeURIComponent(request.itemId),
            },
            query:
                'query PickABrickQuery($query: String, $page: Int, $perPage: Int, $filters: [Filter!]) {\n  elements(query: $query, page: $page, perPage: $perPage, filters: $filters) {\n    count\n    facets {\n      ...FacetData\n      __typename\n    }\n    results {\n      ...ElementLeafData\n      __typename\n    }\n    total\n    __typename\n  }\n  me {\n    ... on LegoUser {\n      ...UserData\n      pabCart {\n        PABLineItems {\n          ...PABLineItemData\n          __typename\n        }\n        taxedPrice {\n          totalGross {\n            currencyCode\n            formattedAmount\n            formattedValue\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment FacetData on Facet {\n  id\n  key\n  name\n  labels {\n    count\n    key\n    name\n    ... on FacetValue {\n      value\n      __typename\n    }\n    ... on FacetRange {\n      from\n      to\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ElementLeafData on Element {\n  id\n  name\n  primaryImageUrl\n  spinset {\n    frames {\n      url\n      __typename\n    }\n    __typename\n  }\n  ... on SingleVariantElement {\n    variant {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  ... on MultiVariantElement {\n    variants {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ElementLeafVariant on ElementVariant {\n  id\n  price {\n    currencyCode\n    centAmount\n    formattedAmount\n    __typename\n  }\n  attributes {\n    availabilityStatus\n    canAddToBag\n    colour\n    colourFamily\n    designNumber\n    mainGroup\n    materialGroup\n    materialType\n    maxOrderQuantity\n    showInListing\n    __typename\n  }\n  __typename\n}\n\nfragment UserData on LegoUser {\n  pabCart {\n    id\n    PABLineItems {\n      id\n      quantity\n      element {\n        id\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PABLineItemData on PABCartLineItem {\n  id\n  quantity\n  element {\n    id\n    name\n    primaryImageUrl\n    __typename\n  }\n  price {\n    centAmount\n    currencyCode\n    __typename\n  }\n  elementVariant {\n    id\n    attributes {\n      designNumber\n      __typename\n    }\n    __typename\n  }\n  totalPrice {\n    formattedAmount\n    __typename\n  }\n  __typename\n}\n',
        };

        var url = 'https://www.lego.com/api/graphql/PickABrickQuery';

        fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': locale4,
            },
            body: JSON.stringify(PickABrickQuery),
        })
            .then((response) => {
                clearTimeout(timeout);
                return response.json();
            })
            .catch((err) => {
                return sendResponse(null);
            })
            .then((data) => data.data.elements.results)
            .then((results) => sendResponse(results));
        return true; // Will respond asynchronously.
    } else if (request.contentScriptQuery == 'PickABrickLogin') {
        var PickABrickQuery = {
            operationName: 'Login',
            variables: {
                forceCtLogin: false,
            },
            query:
                'mutation Login($forceCtLogin: Boolean) {\n  login(forceCtLogin: $forceCtLogin)\n}\n',
        };

        var url = 'https://www.lego.com/api/graphql/Login';

        fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': locale4,
            },
            body: JSON.stringify(PickABrickQuery),
        })
            .then((response) => {
                clearTimeout(timeout);
                return response.json();
            })
            .catch((err) => {
                return sendResponse(null);
            })
            .then((data) => data.data)
            .then((results) => sendResponse(results));
        return true; // Will respond asynchronously.
    } else if (request.contentScriptQuery == 'readQAuth') {
        browser.tabs
            .query({ currentWindow: true, active: true })
            .then((logTabs) => {
                console.log('tabs', logTabs);
                browser.tabs
                    .sendMessage(logTabs[0].id, {
                        contentScriptQuery: 'readCookie',
                    })
                    .then((authorization) => {
                        console.log('Cookie qauth', authorization);
                        sendResponse(authorization);
                    })
                    .catch((error) => console.log(error));
            });
        return true;
    } else if (request.contentScriptQuery == 'PickABrickReadCart') {
        var PickABrickQuery = {
            operationName: 'PickABrickQuery',
            variables: {
                page: 1,
                perPage: 20,
                query: '',
            },
            query:
                'query PickABrickQuery($query: String, $page: Int, $perPage: Int, $filters: [Filter!]) {\n  elements(query: $query, page: $page, perPage: $perPage, filters: $filters) {\n    count\n    facets {\n      ...FacetData\n      __typename\n    }\n    results {\n      ...ElementLeafData\n      __typename\n    }\n    total\n    __typename\n  }\n  me {\n    ... on LegoUser {\n      ...UserData\n      pabCart {\n        PABLineItems {\n          ...PABLineItemData\n          __typename\n        }\n        taxedPrice {\n          totalGross {\n            currencyCode\n            formattedAmount\n            formattedValue\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment FacetData on Facet {\n  id\n  key\n  name\n  labels {\n    count\n    key\n    name\n    ... on FacetValue {\n      value\n      __typename\n    }\n    ... on FacetRange {\n      from\n      to\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ElementLeafData on Element {\n  id\n  name\n  primaryImage\n  spinsetMedia {\n    frames {\n      url\n      __typename\n    }\n    __typename\n  }\n  ... on SingleVariantElement {\n    variant {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  ... on MultiVariantElement {\n    variants {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ElementLeafVariant on ElementVariant {\n  id\n  price {\n    currencyCode\n    centAmount\n    formattedAmount\n    __typename\n  }\n  attributes {\n    availabilityStatus\n    canAddToBag\n    colour\n    colourFamily\n    designNumber\n    mainGroup\n    materialGroup\n    materialType\n    maxOrderQuantity\n    showInListing\n    __typename\n  }\n  __typename\n}\n\nfragment UserData on LegoUser {\n  pabCart {\n    id\n    PABLineItems {\n      id\n      quantity\n      element {\n        id\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PABLineItemData on PABCartLineItem {\n  id\n  quantity\n  element {\n    id\n    name\n    primaryImage\n    __typename\n  }\n  price {\n    centAmount\n    currencyCode\n    __typename\n  }\n  elementVariant {\n    id\n    attributes {\n      designNumber\n      __typename\n    }\n    __typename\n  }\n  totalPrice {\n    formattedAmount\n    __typename\n  }\n  __typename\n}\n',
        };

        var url = 'https://www.lego.com/api/graphql/PickABrickQuery';

        fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': locale4,
                authorization: request.authorization,
            },
            body: JSON.stringify(PickABrickQuery),
        })
            .then((response) => {
                clearTimeout(timeout);
                return response.json();
            })
            .catch((err) => {
                return sendResponse(null);
            })
            .then((data) => data.data.me.pabCart)
            .then((results) => sendResponse(results));
        return true; // Will respond asynchronously.
    } else if (request.contentScriptQuery == 'PickABrickClearCart') {
        var PickABrickQuery = {
            operationName: 'RemoveAllPABLineItems',
            variables: {
                PABCartId: request.PABCartId,
            },
            query:
                'mutation RemoveAllPABLineItems($PABCartId: String!) {\n  removeAllPABLineItems(input: {PABCartId: $PABCartId}) {\n    id\n    taxedPrice {\n      totalGross {\n        formattedAmount\n        __typename\n      }\n      __typename\n    }\n    PABLineItems {\n      id\n      quantity\n      element {\n        id\n        __typename\n      }\n      totalPrice {\n        formattedAmount\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
        };

        var url = 'https://www.lego.com/api/graphql/RemoveAllPABLineItems';

        fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': locale4,
                authorization: request.authorization,
            },
            body: JSON.stringify(PickABrickQuery),
        })
            .then((response) => {
                clearTimeout(timeout);
                return response.json();
            })
            .catch((err) => {
                return sendResponse(null);
            })
            .then((data) => data)
            .then((results) => sendResponse(results));
        return true; // Will respond asynchronously.
    } else if (request.contentScriptQuery == 'PickABrickAddToCart') {
        var PickABrickQuery = {
            operationName: 'AddToPABCart',
            variables: {
                sku: request.partId.toString(),
                quantity: parseInt(request.qty),
                PABCartId: request.PABCartId,
            },
            query:
                'mutation AddToPABCart($sku: String!, $quantity: Int, $PABCartId: String!) {\n  addPABItemToCart(input: {sku: $sku, quantity: $quantity, PABCartId: $PABCartId}) {\n    id\n    taxedPrice {\n      totalGross {\n        formattedAmount\n        __typename\n      }\n      __typename\n    }\n    PABLineItems {\n      ...PABLineItemData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PABLineItemData on PABCartLineItem {\n  id\n  quantity\n  element {\n    id\n    name\n    primaryImage\n    __typename\n  }\n  price {\n    centAmount\n    currencyCode\n    __typename\n  }\n  elementVariant {\n    id\n    attributes {\n      designNumber\n      __typename\n    }\n    __typename\n  }\n  totalPrice {\n    formattedAmount\n    __typename\n  }\n  __typename\n}\n',
        };

        console.log('query', PickABrickQuery);

        var url = 'https://www.lego.com/api/graphql/AddToPABCart';

        fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': locale4,
                //"x-lego-request-id": "2f2c7bbb-1da5-4699-acd5-75a0753b04c1-c",
                authorization: request.authorization,
            },
            body: JSON.stringify(PickABrickQuery),
        })
            .then((response) => {
                clearTimeout(timeout);
                return response.json();
            })
            .catch((err) => {
                return sendResponse(null);
            })
            .then((data) => data)
            .then((results) => sendResponse(results));
        return true; // Will respond asynchronously.
    } else if (request.contentScriptQuery == 'SteineUndTeile') {
        var url = `https://bricksandpieces.services.lego.com/api/v1/bricks/items/${encodeURIComponent(
            request.itemId
        )}?country=${locale}&orderType=buy`;

        fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'saVSCq0hpuxYV48mrXMGfdKnMY1oUs3s',
            },
        })
            .then((response) => {
                //console.log(response.json())
                clearTimeout(timeout);
                return response.json();
            })
            .catch((err) => {
                return sendResponse(null);
            })
            .then((results) => sendResponse(results));
        return true; // Will respond asynchronously.
    } else if (request.contentScriptQuery == 'bricksAndPiecesFillCart') {
        //console.log("sessionStorage.setItem('b_and_p_buy_" + locale.toUpperCase() + "', '" + JSON.stringify(request.order).replace(/'/g, "\\\'")+ "')")
        chrome.tabs.executeScript({
            code:
                "sessionStorage.setItem('b_and_p_buy_" +
                locale.toUpperCase() +
                "', '" +
                JSON.stringify(request.order).replace(/'/g, "\\'") +
                "')",
        });
        browser.tabs
            .query({ currentWindow: true, active: true })
            .then((tabs) => {
                var tab = tabs[0];
                browser.tabs.update(tab.id, {
                    url: `https://www.lego.com/${locale4}/service/replacementparts/sale`,
                });
            });
        sendResponse(true);
        return true;
    } else if (request.contentScriptQuery == 'bricksAndPiecesClearCart') {
        //console.log("sessionStorage.setItem('b_and_p_buy_" + locale.toUpperCase() + "', '" + JSON.stringify(request.order)+ "')")
        chrome.tabs.executeScript({
            code:
                "sessionStorage.removeItem('b_and_p_buy_" +
                locale.toUpperCase() +
                "')",
        });
        browser.tabs
            .query({ currentWindow: true, active: true })
            .then((tabs) => {
                var tab = tabs[0];
                browser.tabs.update(tab.id, {
                    url: `https://www.lego.com/${locale4}/service/replacementparts/sale`,
                });
            });
        sendResponse(true);
        return true;
    }
});

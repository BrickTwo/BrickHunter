var localCountry = '';
var localLanguage = '';
var localeCountryLanguage = '';
const timeout = setTimeout(function() {}, 5000);

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.indexOf('https://www.lego.com') == 0) {
        browser.tabs.executeScript({
            file: 'js/content-script.js',
        });
    }
});

browser.runtime.onMessage.addListener(async function(request) {
    prepareLocation();

    switch (request.service) {
        case 'pickABrick':
            return await pickABrick(request);
        case 'bricksAndPieces':
            return await bricksAndPieces(request);
        default:
            switch (request.action) {
                case 'donate':
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
    localeCountry = localStorage.getItem('country') || 'DE';
    localeLanguage = localStorage.getItem('language') || 'DE';
    localeCountryLanguage =
        localeLanguage.toLowerCase() + '-' + localeCountry.toUpperCase();
}

async function getLegoTab() {
    var tabs = await browser.tabs
        .query({
            url: '*://*.lego.com/*',
            status: 'complete',
        })
        .catch((error) => console.log(error));

    if (!tabs.length) {
        return false;
    }

    return tabs[0].id;
}

function addContentScript(tabId) {
    browser.tabs.executeScript(tabId, {
        file: 'js/content-script.js',
    });
}

async function pickABrick(request) {
    switch (request.action) {
        case 'findBrick':
            return await findBrick(request.designId);
        case 'readQAuth':
            return await readQAuth();
        case 'readCart':
            return await readCart(request.authorization);
        case 'clearCart':
            return await clearCart(request.authorization, request.PABCartId);
        case 'addToCart':
            return await addToCart(
                request.authorization,
                request.PABCartId,
                request.partId,
                request.qty
            );
        case 'open':
            return await open(request.affiliate);
    }

    pickABrick.findBrick = findBrick;
    pickABrick.readQAuth = readQAuth;
    pickABrick.readCart = readCart;
    pickABrick.clearCart = clearCart;
    pickABrick.addToCart = addToCart;
    pickABrick.open = open;

    async function findBrick(designId) {
        var PickABrickQuery = {
            operationName: 'PickABrickQuery',
            variables: {
                page: 1,
                perPage: 200,
                query: encodeURIComponent(designId),
            },
            query:
                'query PickABrickQuery($query: String, $page: Int, $perPage: Int, $filters: [Filter!]) {\n  elements(query: $query, page: $page, perPage: $perPage, filters: $filters) {\n    count\n    facets {\n      ...FacetData\n      __typename\n    }\n    results {\n      ...ElementLeafData\n      __typename\n    }\n    total\n    __typename\n  }\n  me {\n    ... on LegoUser {\n      ...UserData\n      pabCart {\n        PABLineItems {\n          ...PABLineItemData\n          __typename\n        }\n        taxedPrice {\n          totalGross {\n            currencyCode\n            formattedAmount\n            formattedValue\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment FacetData on Facet {\n  id\n  key\n  name\n  labels {\n    count\n    key\n    name\n    ... on FacetValue {\n      value\n      __typename\n    }\n    ... on FacetRange {\n      from\n      to\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ElementLeafData on Element {\n  id\n  name\n  primaryImageUrl\n  spinset {\n    frames {\n      url\n      __typename\n    }\n    __typename\n  }\n  ... on SingleVariantElement {\n    variant {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  ... on MultiVariantElement {\n    variants {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ElementLeafVariant on ElementVariant {\n  id\n  price {\n    currencyCode\n    centAmount\n    formattedAmount\n    __typename\n  }\n  attributes {\n    availabilityStatus\n    canAddToBag\n    colour\n    colourFamily\n    designNumber\n    mainGroup\n    materialGroup\n    materialType\n    maxOrderQuantity\n    showInListing\n    __typename\n  }\n  __typename\n}\n\nfragment UserData on LegoUser {\n  pabCart {\n    id\n    PABLineItems {\n      id\n      quantity\n      element {\n        id\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PABLineItemData on PABCartLineItem {\n  id\n  quantity\n  element {\n    id\n    name\n    primaryImageUrl\n    __typename\n  }\n  price {\n    centAmount\n    currencyCode\n    __typename\n  }\n  elementVariant {\n    id\n    attributes {\n      designNumber\n      __typename\n    }\n    __typename\n  }\n  totalPrice {\n    formattedAmount\n    __typename\n  }\n  __typename\n}\n',
        };

        var url = 'https://www.lego.com/api/graphql/PickABrickQuery';

        var response = await fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': localeCountryLanguage,
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
                    message: '',
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
                contentScriptQuery: 'readCookie',
            })
            .then((authorization) => {
                return authorization;
            })
            .catch((error) => console.log(error));
    }

    async function readCart(authorization) {
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

        var response = await fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': localeCountryLanguage,
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
        return response.data.me.pabCart;
    }

    async function clearCart(authorization, PABCartId) {
        var PickABrickQuery = {
            operationName: 'RemoveAllPABLineItems',
            variables: {
                PABCartId: PABCartId,
            },
            query:
                'mutation RemoveAllPABLineItems($PABCartId: String!) {\n  removeAllPABLineItems(input: {PABCartId: $PABCartId}) {\n    id\n    taxedPrice {\n      totalGross {\n        formattedAmount\n        __typename\n      }\n      __typename\n    }\n    PABLineItems {\n      id\n      quantity\n      element {\n        id\n        __typename\n      }\n      totalPrice {\n        formattedAmount\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
        };

        var url = 'https://www.lego.com/api/graphql/RemoveAllPABLineItems';

        var response = await fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': localeCountryLanguage,
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
                    message: '',
                };
            });

        return response;
    }

    async function addToCart(authorization, PABCartId, partId, quantity) {
        var PickABrickQuery = {
            operationName: 'AddToPABCart',
            variables: {
                sku: partId.toString(),
                quantity: parseInt(quantity),
                PABCartId: PABCartId,
            },
            query:
                'mutation AddToPABCart($sku: String!, $quantity: Int, $PABCartId: String!) {\n  addPABItemToCart(input: {sku: $sku, quantity: $quantity, PABCartId: $PABCartId}) {\n    id\n    taxedPrice {\n      totalGross {\n        formattedAmount\n        __typename\n      }\n      __typename\n    }\n    PABLineItems {\n      ...PABLineItemData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PABLineItemData on PABCartLineItem {\n  id\n  quantity\n  element {\n    id\n    name\n    primaryImage\n    __typename\n  }\n  price {\n    centAmount\n    currencyCode\n    __typename\n  }\n  elementVariant {\n    id\n    attributes {\n      designNumber\n      __typename\n    }\n    __typename\n  }\n  totalPrice {\n    formattedAmount\n    __typename\n  }\n  __typename\n}\n',
        };

        var url = 'https://www.lego.com/api/graphql/AddToPABCart';

        var response = await fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': localeCountryLanguage,
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
            if (affiliate.linkType == 'webgains') {
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
        case 'findBrick':
            return await findBrick(request.designId);
        case 'findSet':
            return await findSet(request.setNumber);
        case 'fillCart':
            if (!(await fillCart(request.order))) return false;
            return await open(request.affiliate);
        case 'clearCart':
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
                    message: '',
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
                        order: 'asc',
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
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'p0OKLXd8US1YsquudM1Ov9Ja7H91jhamak9EMrRB',
            },
            body: JSON.stringify(query),
        });

        if (responseSearch.status < 200 || responseSearch.status >= 300)
            return {
                status: responseSearch.status,
                message: responseSearch.json(),
            };

        var urlProduct = `https://bricksandpieces.services.lego.com/api/v1/bricks/product/${encodeURIComponent(
            setNumber
        )}?country=${localeCountry}&orderType=missing`;

        var responseProduct = await fetch(urlProduct, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'saVSCq0hpuxYV48mrXMGfdKnMY1oUs3s',
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
                contentScriptQuery: 'setItem',
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
                contentScriptQuery: 'removeItem',
                country: localeCountry.toUpperCase(),
            })
            .catch((error) => console.log(error));

        browser.tabs.update(tabId, {
            url: `https://www.lego.com/${localeCountryLanguage.toLowerCase()}/service/replacementparts/sale`,
            active: true,
        });

        return true;
    }

    async function open(affiliate) {
        var tabId = await getLegoTab();
        if (!tabId) return false;

        var url = `https://www.lego.com/${localeCountryLanguage.toLowerCase()}/service/replacementparts/sale`;
        if (affiliate) {
            if (affiliate.linkType == 'webgains') {
                url =
                    `https://track.webgains.com/click.html?wgcampaignid=${affiliate.wgcampaignid}&wgprogramid=${affiliate.wgprogramid}&clickref=${affiliate.clickref}&wgtarget=` +
                    url;
            }
        }
        browser.tabs.update(tabId, {
            url: url,
            active: true,
        });

        return true;
    }
}

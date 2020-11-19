browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.indexOf('https://www.lego.com') == 0) {
        browser.pageAction.show(tabId);
        browser.tabs.executeScript({
            file: 'js/content-script.js',
        });
    } else {
        browser.pageAction.hide(tabId);
    }
});

browser.runtime.onMessage.addListener(async function(
    request,
    sender,
    sendResponse,
    reject
) {
    /*console.log(
        'country',
        localStorage.getItem('country'),
        localStorage.getItem('language')
    );*/
    var localeCountry = localStorage.getItem('country') || 'DE';
    var localeLanguage = localStorage.getItem('language') || 'DE';
    var localeCountryLanguage =
        localeLanguage.toLowerCase() + '-' + localeCountry.toUpperCase();

    const timeout = setTimeout(function() {}, 5000);

    switch (request.contentScriptQuery) {
        case 'getPickABrick':
            var PickABrickQuery = {
                operationName: 'PickABrickQuery',
                variables: {
                    page: 1,
                    perPage: 200,
                    query: encodeURIComponent(request.itemId),
                },
                query:
                    'query PickABrickQuery($query: String, $page: Int, $perPage: Int, $filters: [Filter!]) {\n  elements(query: $query, page: $page, perPage: $perPage, filters: $filters) {\n    count\n    facets {\n      ...FacetData\n      __typename\n    }\n    results {\n      ...ElementLeafData\n      __typename\n    }\n    total\n    __typename\n  }\n  me {\n    ... on LegoUser {\n      ...UserData\n      pabCart {\n        PABLineItems {\n          ...PABLineItemData\n          __typename\n        }\n        taxedPrice {\n          totalGross {\n            currencyCode\n            formattedAmount\n            formattedValue\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment FacetData on Facet {\n  id\n  key\n  name\n  labels {\n    count\n    key\n    name\n    ... on FacetValue {\n      value\n      __typename\n    }\n    ... on FacetRange {\n      from\n      to\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ElementLeafData on Element {\n  id\n  name\n  primaryImageUrl\n  spinset {\n    frames {\n      url\n      __typename\n    }\n    __typename\n  }\n  ... on SingleVariantElement {\n    variant {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  ... on MultiVariantElement {\n    variants {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ElementLeafVariant on ElementVariant {\n  id\n  price {\n    currencyCode\n    centAmount\n    formattedAmount\n    __typename\n  }\n  attributes {\n    availabilityStatus\n    canAddToBag\n    colour\n    colourFamily\n    designNumber\n    mainGroup\n    materialGroup\n    materialType\n    maxOrderQuantity\n    showInListing\n    __typename\n  }\n  __typename\n}\n\nfragment UserData on LegoUser {\n  pabCart {\n    id\n    PABLineItems {\n      id\n      quantity\n      element {\n        id\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PABLineItemData on PABCartLineItem {\n  id\n  quantity\n  element {\n    id\n    name\n    primaryImageUrl\n    __typename\n  }\n  price {\n    centAmount\n    currencyCode\n    __typename\n  }\n  elementVariant {\n    id\n    attributes {\n      designNumber\n      __typename\n    }\n    __typename\n  }\n  totalPrice {\n    formattedAmount\n    __typename\n  }\n  __typename\n}\n',
            };

            var url = 'https://www.lego.com/api/graphql/PickABrickQuery';

            return await fetch(url, {
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
                    return response.json();
                })
                .catch((err) => {
                    return null;
                })
                .then((data) => {
                    return data.data.elements.results;
                })
                .then((results) => {
                    return results;
                });
        //return true; // Will respond asynchronously.
        case 'readQAuth':
            return await browser.tabs
                //.query({ currentWindow: true, active: true })
                .query({ url: '*://*.lego.com/*', status: 'complete' })
                .then(async (logTabs) => {
                    //console.log('tabs', logTabs);
                    if (!logTabs.length) {
                        return false;
                    }

                    return await browser.tabs
                        .sendMessage(logTabs[0].id, {
                            contentScriptQuery: 'readCookie',
                        })
                        .then((authorization) => {
                            //console.log('Cookie qauth', authorization);
                            return authorization;
                        })
                        .catch((error) => console.log(error));
                });
        case 'pickABrickReadCart':
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

            return await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'x-locale': localeCountryLanguage,
                    authorization: request.authorization,
                },
                body: JSON.stringify(PickABrickQuery),
            })
                .then((response) => {
                    clearTimeout(timeout);
                    return response.json();
                })
                .catch((err) => {
                    return null;
                })
                .then((data) => data.data.me.pabCart)
                .then((results) => {
                    return results;
                });
        case 'pickABrickClearCart':
            var PickABrickQuery = {
                operationName: 'RemoveAllPABLineItems',
                variables: {
                    PABCartId: request.PABCartId,
                },
                query:
                    'mutation RemoveAllPABLineItems($PABCartId: String!) {\n  removeAllPABLineItems(input: {PABCartId: $PABCartId}) {\n    id\n    taxedPrice {\n      totalGross {\n        formattedAmount\n        __typename\n      }\n      __typename\n    }\n    PABLineItems {\n      id\n      quantity\n      element {\n        id\n        __typename\n      }\n      totalPrice {\n        formattedAmount\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
            };

            var url = 'https://www.lego.com/api/graphql/RemoveAllPABLineItems';

            return await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'x-locale': localeCountryLanguage,
                    authorization: request.authorization,
                },
                body: JSON.stringify(PickABrickQuery),
            })
                .then((response) => {
                    clearTimeout(timeout);
                    return response.json();
                })
                .catch((err) => {
                    return null;
                })
                .then((data) => data)
                .then((results) => {
                    return results;
                });
        case 'pickABrickAddToCart':
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

            //console.log('query', PickABrickQuery);

            var url = 'https://www.lego.com/api/graphql/AddToPABCart';

            return await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'x-locale': localeCountryLanguage,
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
                    return null;
                })
                .then((data) => data)
                .then((results) => {
                    return results;
                });
        case 'openPickABrick':
            browser.tabs
                .query({ url: '*://*.lego.com/*', status: 'complete' })
                .then(async (tabs) => {
                    var tab = tabs[0];

                    var url = `https://www.lego.com/${localeCountryLanguage}/page/static/pick-a-brick`;
                    if (request.affiliate) {
                        if (request.affiliate.linkType == 'webgains') {
                            url =
                                `https://track.webgains.com/click.html?wgcampaignid=${request.affiliate.wgcampaignid}&wgprogramid=${request.affiliate.wgprogramid}&clickref=${request.affiliate.clickref}&wgtarget=` +
                                url;
                        }
                    }

                    browser.tabs.update(tab.id, {
                        url: url,
                    });
                });
            return true;
        case 'getBricksAndPieces':
            var url = `https://bricksandpieces.services.lego.com/api/v1/bricks/items/${encodeURIComponent(
                request.itemId
            )}?country=${localeCountry}&orderType=buy`;

            return await fetch(url, {
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
                    return null;
                })
                .then((results) => {
                    return results;
                });
        case 'bricksAndPiecesFillCart':
            //console.log("sessionStorage.setItem('b_and_p_buy_" + localeCountry.toUpperCase() + "', '" + JSON.stringify(request.order).replace(/'/g, "\\\'")+ "')")
            /*chrome.tabs.executeScript({
                code:
                    "sessionStorage.setItem('b_and_p_buy_" +
                    localeCountry.toUpperCase() +
                    "', '" +
                    JSON.stringify(request.order).replace(/'/g, "\\'") +
                    "')",
            });*/
            //console.log(browser.tabs);
            await browser.tabs
                //.query({ currentWindow: true, active: true })
                .query({ url: '*://*.lego.com/*', status: 'complete' })
                .then(async (tabs) => {
                    //console.log('tabs', tabs);
                    if (!tabs.length) {
                        return false;
                    }

                    await browser.tabs
                        .sendMessage(tabs[0].id, {
                            contentScriptQuery: 'setItem',
                            country: localeCountry.toUpperCase(),
                            order: request.order,
                        })
                        .then((response) => {
                            //console.log(response);
                            return response;
                        })
                        .catch((error) => console.log(error));

                    return tabs;
                })
                .then((tabs) => {
                    var tab = tabs[0];

                    var url = `https://www.lego.com/${localeCountryLanguage.toLowerCase()}/service/replacementparts/sale`;
                    if (request.affiliate) {
                        if (request.affiliate.linkType == 'webgains') {
                            url =
                                `https://track.webgains.com/click.html?wgcampaignid=${request.affiliate.wgcampaignid}&wgprogramid=${request.affiliate.wgprogramid}&clickref=${request.affiliate.clickref}&wgtarget=` +
                                url;
                        }
                    }
                    browser.tabs.update(tab.id, {
                        url: url,
                    });
                });
            return true;
        case 'bricksAndPiecesClearCart':
            //console.log("sessionStorage.setItem('b_and_p_buy_" + localeCountry.toUpperCase() + "', '" + JSON.stringify(request.order)+ "')")
            /*chrome.tabs.executeScript({
                code:
                    "sessionStorage.removeItem('b_and_p_buy_" +
                    localeCountry.toUpperCase() +
                    "')",
            });*/
            await browser.tabs
                //.query({ currentWindow: true, active: true })
                .query({ url: '*://*.lego.com/*', status: 'complete' })
                .then(async (tabs) => {
                    //console.log('tabs', tabs);
                    if (!tabs.length) {
                        return false;
                    }

                    await browser.tabs
                        .sendMessage(tabs[0].id, {
                            contentScriptQuery: 'removeItem',
                            country: localeCountry.toUpperCase(),
                        })
                        .catch((error) => console.log(error));

                    return tabs;
                })
                .then((tabs) => {
                    var tab = tabs[0];
                    browser.tabs.update(tab.id, {
                        url: `https://www.lego.com/${localeCountryLanguage.toLowerCase()}/service/replacementparts/sale`,
                    });
                });
            return true;
        case 'getLegoSet':
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

            var url = `https://services.slingshot.lego.com/api/v4/lego_historic_product_read/_search`;

            var response = await fetch(url, {
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

            var url2 = `https://bricksandpieces.services.lego.com/api/v1/bricks/product/${encodeURIComponent(
                request.setNumber
            )}?country=${localeCountry}&orderType=missing`;

            var response2 = await fetch(url2, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'saVSCq0hpuxYV48mrXMGfdKnMY1oUs3s',
                },
            });

            var returnValue = {};
            var sets = await response.json();
            var hits = sets.hits.hits;

            var set = hits.filter(
                (set) => set._source.product_number == request.setNumber
            )[0];

            if (!set) return false;

            var bricks = await response2.json();
            returnValue.set = set._source;
            returnValue.bricks = bricks.bricks;

            //sendResponse(response);
            return returnValue; // Will respond asynchronously.
        case 'openSite':
            //console.log('openSite');
            browser.tabs
                .query({ currentWindow: true })
                //.query({ url: '*://*.lego.com/*' })
                .then(async (tabs) => {
                    //console.log(tabs);
                    browser.tabs.update(tabs[0].id, {
                        url: `https://www.lego.com/${localeCountryLanguage.toLowerCase()}/service/replacementparts/sale`,
                    });
                });
        case 'donate':
            browser.tabs
                .query({ currentWindow: true, active: true })
                .then(async (tabs) => {
                    //console.log(tabs);
                    browser.tabs.update(tabs[0].id, {
                        url: `https://www.paypal.com/donate?hosted_button_id=MPV9V9JUKRD6N`,
                    });
                });
    }
    return true;
});

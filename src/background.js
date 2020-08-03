browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.indexOf('https://www.lego.com') == 0) {
    browser.pageAction.show(tabId);
  } else {
    browser.pageAction.hide(tabId);
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    
 });

browser.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var locale = localStorage.getItem("country") || "DE";
    var locale4 = null;

    switch (locale) {
      case "ch":
        locale4 = "de-CH";
        break;
      case "de":
        locale4 = "de-DE";
        break;
      case "at":
        locale4 = "de-AT";
        break;
      default:
        locale4 = "de-DE";
        break;
    }

    if (request.contentScriptQuery == "PickABrick") {
      var PickABrickQuery = {
        operationName: "PickABrickQuery",
        variables: {
            page: 1,
            perPage: 20,
            query: encodeURIComponent(request.itemId)
        },
        query: "query PickABrickQuery($query: String, $page: Int, $perPage: Int, $filters: [Filter!]) {\n  elements(query: $query, page: $page, perPage: $perPage, filters: $filters) {\n    count\n    facets {\n      ...FacetData\n      __typename\n    }\n    results {\n      ...ElementLeafData\n      __typename\n    }\n    total\n    __typename\n  }\n  me {\n    ... on LegoUser {\n      ...UserData\n      pabCart {\n        PABLineItems {\n          ...PABLineItemData\n          __typename\n        }\n        taxedPrice {\n          totalGross {\n            currencyCode\n            formattedAmount\n            formattedValue\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment FacetData on Facet {\n  id\n  key\n  name\n  labels {\n    count\n    key\n    name\n    ... on FacetValue {\n      value\n      __typename\n    }\n    ... on FacetRange {\n      from\n      to\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ElementLeafData on Element {\n  id\n  name\n  primaryImageUrl\n  spinset {\n    frames {\n      url\n      __typename\n    }\n    __typename\n  }\n  ... on SingleVariantElement {\n    variant {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  ... on MultiVariantElement {\n    variants {\n      ...ElementLeafVariant\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ElementLeafVariant on ElementVariant {\n  id\n  price {\n    currencyCode\n    centAmount\n    formattedAmount\n    __typename\n  }\n  attributes {\n    availabilityStatus\n    canAddToBag\n    colour\n    colourFamily\n    designNumber\n    mainGroup\n    materialGroup\n    materialType\n    maxOrderQuantity\n    showInListing\n    __typename\n  }\n  __typename\n}\n\nfragment UserData on LegoUser {\n  pabCart {\n    id\n    PABLineItems {\n      id\n      quantity\n      element {\n        id\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PABLineItemData on PABCartLineItem {\n  id\n  quantity\n  element {\n    id\n    name\n    primaryImageUrl\n    __typename\n  }\n  price {\n    centAmount\n    currencyCode\n    __typename\n  }\n  elementVariant {\n    id\n    attributes {\n      designNumber\n      __typename\n    }\n    __typename\n  }\n  totalPrice {\n    formattedAmount\n    __typename\n  }\n  __typename\n}\n"
      }

      var url = "https://www.lego.com/api/graphql/PickABrickQuery";

          fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json',
              "x-locale": locale4
            },
            body: JSON.stringify(PickABrickQuery)
        })
        .then(response => response.json())
        .then(data => data.data.elements.results)
        .then(results => sendResponse(results))
      return true;  // Will respond asynchronously.
    }
    else if (request.contentScriptQuery == "SteineUndTeile") {
      var url = `https://bricksandpieces.services.lego.com/api/v1/bricks/items/${encodeURIComponent(request.itemId)}?country=${locale}&orderType=buy`;

      fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'saVSCq0hpuxYV48mrXMGfdKnMY1oUs3s'
        },
      })
        .then(response => {
          //console.log(response.json())
          return response.json()
        })
        .then(results => sendResponse(results))
      return true;  // Will respond asynchronously.
    }
    else if (request.contentScriptQuery == "sapFillCart") {
      //console.log("sessionStorage.setItem('b_and_p_buy_" + locale.toUpperCase() + "', '" + JSON.stringify(request.order)+ "')")
      chrome.tabs.executeScript({
        code: "sessionStorage.setItem('b_and_p_buy_" + locale.toUpperCase() + "', '" + JSON.stringify(request.order)+ "')"
      });
      browser.tabs.query({'currentWindow': true, 'active': true})
      .then(tabs => {
          var tab = tabs[0]
          browser.tabs.update(tab.id, {url: `https://www.lego.com/${locale4}/service/replacementparts/sale`})
      })
    }
  }     
)

browser.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.contentScriptQuery == "brickHunterLoadImages") {
    if (
      location.href.indexOf("https://www.lego.com/") >= 0 &&
      location.href.indexOf("/my-account/orders/details/") >= 0
    ) {
      console.log(location.href);
      //setTimeout(brickHunterLoadImages, 500);
      setTimeout(showImages, 500);
    }
  }
});

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkImage(src, good, bad) {
  var img = new Image();
  img.onload = good;
  img.onerror = bad;
  img.src = src;
}

// function brickHunterLoadImages() {
//   var items = document.querySelectorAll('[data-test="product-item"');

//   if (items.length <= 0) {
//     setTimeout(brickHunterLoadImages, 1000);
//     return;
//   }
//   Array.from(items).forEach((item) => {
//     const sku = item
//       .querySelectorAll('[data-test="product-item-sku"]')[0]
//       ?.innerText?.split(":")[1];

//     if (sku) {
//       let urlLod5 = `https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${sku}.jpg`;

//       let addImage = function () {
//         let urlLod4 = `https://www.lego.com/cdn/product-assets/element.img.lod4photo.192x192/${sku}.jpg`;
//         let urlLod5 = `https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${sku}.jpg`;

//         item.querySelectorAll(
//           '[data-test="product-item-empty"]'
//         )[0].innerHTML = `<div style="background-image: url(${urlLod5}), url(${urlLod4}); width: 100%; background-repeat: no-repeat; background-size: contain; background-position: left center; height: 50px; margin-top: -15px"></div><div style="background-image: url(https://brickhunter.bricktwo.net/icon_16.png); height: 35px;background-size: 16px;margin-top: -50px;background-repeat: no-repeat;"></div>`;
//       };

//       let noImage = function () {
//         item.querySelectorAll('[data-test="product-item-empty"]')[0].innerHTML =
//           "";
//       };

//       checkImage(urlLod5, addImage(), function () {
//         noImage();
//       });
//     }
//   });
// }

function showImages() {
  var check = document.querySelectorAll('[data-test="product-item"');
  if (check.length <= 0) {
    setTimeout(brickHunterLoadImages, 1000);
    return;
  }

  var nextData = JSON.parse(
    document.getElementById("__NEXT_DATA__").textContent
  );

  if (nextData.query) {
    const xlocale = `${
      nextData.query.locale.split("-")[0]
    }-${nextData.query.locale.split("-")[1].toUpperCase()}`;

    fetch("https://www.lego.com/api/graphql/OrderDetailsV2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-locale": xlocale,
        authorization: getCookie("gqauth"),
      },
      body: JSON.stringify({
        operationName: "OrderDetailsV2",
        variables: { orderIdentifier: location.href.split("/").slice(-1)[0] },
        query:
          "query OrderDetailsV2($orderIdentifier: String!, $guest: Boolean, $useMockData: Boolean) {\n  orderDetailsV2(\n    orderIdentifier: $orderIdentifier\n    guest: $guest\n    useMockData: $useMockData\n  ) {\n    orderNumber\n    status\n    date\n    itemGroups {\n      status\n      type\n      subtotal\n      headerItem {\n        name\n        sku\n        status\n        linePrice\n        unitPrice\n        quantity\n        returnCode\n        returnableQty\n        sequence\n        productCode\n        __typename\n      }\n      items {\n        name\n        sku\n        status\n        linePrice\n        unitPrice\n        quantity\n        returnCode\n        returnableQty\n        sequence\n        productCode\n        __typename\n      }\n      __typename\n    }\n    billingAddress {\n      firstName\n      lastName\n      company\n      addressLine1\n      addressLine2\n      city\n      region\n      postalCode\n      country\n      __typename\n    }\n    shippingAddress {\n      firstName\n      lastName\n      company\n      addressLine1\n      addressLine2\n      city\n      region\n      postalCode\n      country\n      __typename\n    }\n    shippingMethod\n    tracking {\n      trackingNumber\n      url\n      __typename\n    }\n    currencyCode\n    totals {\n      subtotal\n      shipping\n      discount\n      vipRedeemed\n      finalTotal\n      __typename\n    }\n    tax {\n      portions {\n        key\n        amount\n        __typename\n      }\n      isNonInclusive\n      __typename\n    }\n    payments {\n      lastFourDigits\n      cardType\n      __typename\n    }\n    returnOrders\n    relatedOrders\n    returnCode\n    cancellable\n    __typename\n  }\n}",
      }),
    })
      .then((response) => response.text())
      .then((response) => {
        var data = JSON.parse(response);
        const productGroups = document.querySelectorAll(
          '[data-test="product-group-container"'
        );

        productGroups.forEach((productGroup, pgIndex) => {
          const items = productGroup.querySelectorAll(
            '[data-test="product-item"'
          );

          items.forEach((item, index) => {
            const sku =
              data.data.orderDetailsV2.itemGroups[pgIndex].items[index]?.sku;

            if (sku) {
              let urlLod5 = `https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${sku}.jpg`;

              let addImage = function () {
                let urlLod4 = `https://www.lego.com/cdn/product-assets/element.img.lod4photo.192x192/${sku}.jpg`;
                let urlLod5 = `https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${sku}.jpg`;

                item.querySelectorAll(
                  '[data-test="product-item-empty"]'
                )[0].innerHTML = `<div style="background-image: url(${urlLod5}), url(${urlLod4}); width: 100%; background-repeat: no-repeat; background-size: contain; background-position: left center; height: 50px; margin-top: -15px"></div><div style="background-image: url(https://brickhunter.bricktwo.net/icon_16.png); height: 35px;background-size: 16px;margin-top: -50px;background-repeat: no-repeat;"></div>`;
              };

              let noImage = function () {
                item.querySelectorAll(
                  '[data-test="product-item-empty"]'
                )[0].innerHTML = "";
              };

              checkImage(urlLod5, addImage(), function () {
                noImage();
              });
            }
          });
        });
      });
  }
}

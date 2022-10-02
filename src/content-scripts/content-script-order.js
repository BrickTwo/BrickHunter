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
    }-${nextData.query.locale.split("-")[0].toUpperCase()}`;

    fetch("https://www.lego.com/api/graphql/AccountOrderDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-locale": xlocale,
        authorization: getCookie("gqauth"),
      },
      body: JSON.stringify({
        operationName: "AccountOrderDetails",
        variables: { orderNumber: location.href.split("/").slice(-1)[0] },
        query:
          "query AccountOrderDetails($orderNumber: String!) {\n  orderDetails(orderNumber: $orderNumber) {\n    orderNumber\n    orderStatus\n    orderDate\n    orderCancellable\n    orderReturnCode\n    currencyCode\n    shippingMethod\n    shippingAddress {\n      addressLine1\n      addressLine2\n      city\n      company\n      country\n      firstName\n      lastName\n      postalCode\n      region\n      state\n      phone\n      externalId\n      __typename\n    }\n    billingAddress {\n      addressLine1\n      addressLine2\n      city\n      company\n      country\n      firstName\n      lastName\n      postalCode\n      region\n      state\n      phone\n      externalId\n      __typename\n    }\n    collectionPointAddress {\n      company\n      address {\n        houseNo\n        street\n        town\n        city\n        zipCode\n        country\n        __typename\n      }\n      __typename\n    }\n    payment {\n      cardType\n      lastFourDigits\n      __typename\n    }\n    orderTotals {\n      subtotal\n      tax {\n        name\n        amount\n        __typename\n      }\n      discount\n      vipRedeemed\n      delivery\n      total\n      __typename\n    }\n    productGroups {\n      status\n      shipBy\n      subTotal\n      totalQuantity\n      items {\n        quantity\n        linePrice\n        lineTotal\n        productCode\n        sku\n        status\n        name\n        slug\n        sequence\n        itemReturnCode\n        __typename\n      }\n      __typename\n    }\n    tracking {\n      trackingNumber\n      __typename\n    }\n    relatedOrders {\n      returns\n      __typename\n    }\n    __typename\n  }\n}\n",
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
              data.data.orderDetails.productGroups[pgIndex].items[index].sku;

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

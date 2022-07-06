chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.contentScriptQuery == "brickHunterLoadImages") {
    setTimeout(brickHunterLoadImages, 500);
  }
});

function checkImage(src, good, bad) {
  var img = new Image();
  img.onload = good;
  img.onerror = bad;
  img.src = src;
}

function brickHunterLoadImages() {
  var items = document.querySelectorAll('[data-test="product-item"');

  if (items.length <= 0) {
    setTimeout(brickHunterLoadImages, 1000);
    return;
  }
  Array.from(items).forEach((item) => {
    const sku = item.querySelectorAll('[data-test="product-item-sku"]')[0]?.innerText?.split(":")[1];

    if (sku) {
      let urlLod5 =
        `https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${sku}.jpg`;

      let addImage = function () {
        let urlLod4 =
        `https://www.lego.com/cdn/product-assets/element.img.lod4photo.192x192/${sku}.jpg`;
        let urlLod5 =
        `https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${sku}.jpg`;

        item.querySelectorAll(
          '[data-test="product-item-empty"]'
        )[0].innerHTML =
          `<div style="background-image: url(${urlLod5}), url(${ urlLod4}); width: 100%; background-repeat: no-repeat; background-size: contain; background-position: left center; height: 50px; margin-top: -15px"></div><div style="background-image: url(https://brickhunter.bricktwo.net/icon_16.png); height: 35px;background-size: 16px;margin-top: -50px;background-repeat: no-repeat;"></div>`;
      };

      let noImage = function () {
        // item.querySelectorAll(
        //   '[data-test="product-item-empty"]'
        // ).childNodes[0].innerHTML = "";
      };

      checkImage(urlLod5, addImage(), function () {
        noImage();
      });
    }
  });
}

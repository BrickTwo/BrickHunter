chrome.runtime.onMessage.addListener(async function(
    request,
    sender,
    sendResponse
) {
    if (request.contentScriptQuery == 'brickHunterLoadImages') {
        setTimeout(brickHunterLoadImages, 500);
    }
});

function brickHunterLoadImages() {
    var items = document.getElementsByClassName(
        'Tablestyles__TableRow-k7oh9o-1 eUClYI'
    );

    if (items.length <= 0) setTimeout(brickHunterLoadImages, 1000);

    var active = false;
    items.forEach((item) => {
        /*if (item.childNodes[0].innerText != '') {
            active = false;
        }*/

        let sku = item.childNodes[1].innerText;

        if (sku.startsWith("SKU:")) {
            let sku = item.childNodes[1].innerText;
            let skusubstr = sku.substr(5, sku.length);

            let urlLod4 =
                'https://www.lego.com/cdn/product-assets/element.img.lod4photo.192x192/' +
                skusubstr +
                '.jpg';
            let urlLod5 =
                'https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/' +
                skusubstr +
                '.jpg';

            item.childNodes[0].innerHTML =
                '<div style="background-image: url(' +
                urlLod5 +
                '), url(' +
                urlLod4 +
                "); width: 100%; background-repeat: no-repeat; background-size: contain; background-position: left center; height: 50px; margin-top: -15px\"></div><p style='font-size: 10px;margin-top: 0;margin-bottom: -15px;'>powered by BrickHunter</p>";
        }

        /*if (
            item.childNodes[0].innerText == '11996' ||
            item.childNodes[0].innerText == '11998'
        ) {
            active = true;
        }*/
    });
}

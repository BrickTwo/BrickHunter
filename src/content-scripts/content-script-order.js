window.onload = function() {
    setTimeout(function() {
        var items = document.getElementsByClassName(
            'Tablestyles__TableRow-k7oh9o-1 eUClYI'
        );

        var active = false;
        items.forEach((item) => {
            if (item.childNodes[0].innerText != '') {
                active = false;
            }

            if (active) {
                let sku = item.childNodes[1].innerText;
                let skusubstr = sku.substr(5, sku.length);
                console.log(sku, skusubstr);
                item.childNodes[0].innerHTML +=
                    '<div style="background-image: url(\'https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/' +
                    skusubstr +
                    ".jpg'), url('placeholder.jpg'); width: 100%; background-repeat: no-repeat; background-size: contain; background-position: center center; height: 50px\"></div>";
            }

            if (item.childNodes[0].innerText == '11996') {
                console.log('true');
                active = true;
            }
        });

        var items2 = document.getElementsByClassName(
            'Tablestyles__TableRow-k7oh9o-1 eUClYI'
        );
    }, 1000);
};

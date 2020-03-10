var WANTEDLIST = [];

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // use the 1st file from the list
    f = files[0];

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {
            var output = $.parseXML(e.target.result);
            $("#dialogWantedList").dialog("close");
            initDisplayList();
            readWantedList(output);
            drawTable();
            WANTEDLIST.sort(SortByBrickId);
        };
    })(f);
    
    // Read in the image file as a data URL.
    reader.readAsText(f);
}

function SortByBrickId(a, b) {
    var aBrickId = a.brickId.toLowerCase();
    var bBrickId = b.brickId.toLowerCase();
    return ((aBrickId < bBrickId) ? -1 : ((aBrickId > bBrickId) ? 1 : 0));
}

function readWantedList(wantedList) {
    $(wantedList).find('INVENTORY').find('ITEM').each(function (index) {
        var brickLinkColorCode = $(this).find('COLOR').text();
        var foundColor = $(COLOR).filter(function (index) {
            return COLOR[index].brickLinkId == brickLinkColorCode;
        })[0];

        var item = {
            brickId: $(this).find('ITEMID').text(),
            color: foundColor,
            maxPrice: $(this).find('MAXPRICE').text(),
            quantity: $(this).find('MINQTY').text(),
            pabPrice: "",
            sapPrice: ""
        }

        var lastChar = item.brickId.substr(-1, 1);
        if (lastChar >= "a" && lastChar <= "h") {
            item.designId = item.brickId.slice(0, -1);
        } else {
            item.designId = item.brickId;
        }

        WANTEDLIST.push(item);

        addBrickToDisplayList(
            item.brickId,
            item.designId,
            item.color?.brickLinkId,
            item.color?.brickLinkName,
            item.color?.legoName,
            item.color?.colorCode,
            item.quantity,
            item.maxPrice,
            0,
            0
        );

        return index < (maxItemsWantedList - 1);
    });
}
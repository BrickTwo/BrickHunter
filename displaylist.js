var DISPLAYLIST;
var TABLE;

function addBrickToDisplayList(brickId, designId, brickLinkColorId, brickLinkColorName, legoColorName, colorCode, quantity, maxPrice, pabPrice, sapPrice) {
    var item = [
        brickId,
        designId,
        `https://img.bricklink.com/ItemImage/PT/${brickLinkColorId}/${brickId}.t1.png`,
        brickLinkColorName,
        legoColorName,
        colorCode,
        quantity,
        maxPrice,
        pabPrice,
        sapPrice];
    DISPLAYLIST.push(item);
}

function updateBrickInDisplayList(index, brickId, designId, brickLinkColorId, brickLinkColorName, legoColorName, colorCode, quantity, maxPrice, pabPrice, sapPrice) {
    var item = [
        brickId,
        designId,
        `https://img.bricklink.com/ItemImage/PT/${brickLinkColorId}/${brickId}.t1.png`,
        brickLinkColorName,
        legoColorName,
        colorCode,
        quantity,
        maxPrice,
        pabPrice,
        sapPrice];
    DISPLAYLIST[index] = item;
}


function initDisplayList() {
    DISPLAYLIST = [["brickId", "designId", "image", "brickLinkColor", "legoColor", "colorCode", "quantity", "maxPrice", "pabprice", "sapPrice"]];
}

function drawTable() {
    KingTable.Schemas.DefaultByType.thumbnail = {
        sortable: false,    // disable sort by url
        allowSearch: false, // disable text search url
        html: function (item, value) {
            return "<img src='" + value + "' height='40' alt='" + value + "'>";
        }
    };

    TABLE = window.table = new KingTable({
        id: "colors-table",
        data: DISPLAYLIST, // array of items: this demo shows a Fixed table (see tables mode wiki page for more information)
        element: document.getElementById("main"),
        filtersViewExpandable: false,
        columns: {
            brickId: "BrickLink Id",
            designId: "Design Id",
            image: {
                name: "Image",
                type: "thumbnail"
            },
            brickLinkColor: {
                name: "BrickLink Color",
                html: function (item, value) {
                    return "<span class=\"kt-color\" style=\"background-color:" + item.colorCode + "\"></span><span class=\"kt-color-hex\">" + this.highlight(value) + "</span>";
                },
                type: "foo"
            },
            legoColor: {
                name: "LEGO Color",
                html: function (item, value) {
                    return "<span class=\"kt-color\" style=\"background-color:" + item.colorCode + "\"></span><span class=\"kt-color-hex\">" + this.highlight(value) + "</span>";
                },
                type: "foo",
                hidden: true
            },
            quantity: "Quantity",
            maxPrice: "Max Price",
            pabprice: "Pick a Brick Price",
            sapPrice: "Stones & Pieces Price",
            colorCode: {
                name: "Color Code",
                sortable: false,
                secret: true
            }
        }
    });
    TABLE.render();
    console.log(TABLE);
    $(".pagination-bar-refresh").remove();
    $(".anchor-timestamp-info").remove();
    //$(".pagination-bar-buttons").append('<span tabindex="0" id="loadData" class="pagination-button pagination-bar-getprice oi" data-glyph="data-transfer-dowload" title="LoadData">');
    $(".pagination-bar-buttons").append('<span tabindex="0" id="loadData" class="pagination-button pagination-bar-getprice oi" data-glyph="reload" title="LoadData">');
    //$(".pagination-bar-getprice").text('Load Price');

    document.getElementById('loadData').addEventListener('click', loadPrices);
}
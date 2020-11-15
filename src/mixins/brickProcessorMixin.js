export const brickProcessorMixin = {
    methods: {
        cleanItemId(itemId) {
            itemId = itemId.toString();
            var lastChar = itemId.substr(-1, 1);
            if (lastChar >= 'a' && lastChar <= 'h') {
                return itemId.slice(0, -1);
            } else {
                return itemId;
            }
        },
        findColor(brickLinkColorId, colorList) {
            var result = colorList.filter(
                (color) => color.brickLinkId == brickLinkColorId
            );
            return result[0];
        },
        findLegoColor(colorFamily, colorList) {
            var result = colorList.filter(
                (color) => color.bricksAndPiecesName == colorFamily
            );
            return result[0];
        },
        findBricksAndPiecesBrick(item, bricks) {
            //console.log(item.color.brickLinkName);
            //console.log('satFind', item, bricks);
            if (!bricks) return null;
            bricks = bricks.filter((brick) => !brick.isSoldOut);
            var result = bricks.filter(
                (brick) =>
                    brick.colorFamily == item.color.bricksAndPiecesName &&
                    !brick.isSoldOut
            );
            //console.log("result", result);

            if (this.isSpecialBrick(item)) {
                if (item.brickLink.mapPCCs) {
                    var colorCodesArray = item.brickLink.mapPCCs;
                    var colorCodes = colorCodesArray[
                        item.color.brickLinkId
                    ].split(',');

                    result = bricks.filter(function(brick) {
                        return this.indexOf(brick.itemNumber) < 0;
                    }, colorCodes);
                    //console.log("result 2", result);
                }
            }

            result.sort((a, b) => {
                if (a.price.amount > b.price.amount) {
                    return 1;
                } else {
                    return -1;
                }
            });

            //console.log("resultSorted", result);
            return result[0];
        },
        findPickABrickBrick(item, bricks) {
            //console.log('pickABrickFind', item, bricks);
            if (!bricks) return null;

            var result = bricks.filter(
                (brick) =>
                    brick.variant.attributes.colour == item.color.pickABrickName
            );

            if (this.isSpecialBrick(item)) {
                if (!result.length && item.brickLink.mapPCCs) {
                    var colorCodesArray = item.brickLink.mapPCCs;
                    var colorCodes = colorCodesArray[
                        item.color.brickLinkId
                    ].split(',');
                    //console.log("result", result);

                    result = bricks.filter(function(brick) {
                        return this.indexOf(brick.itemNumber) < 0;
                    }, colorCodes);
                    //console.log("result 2", result);
                }
            }

            return result[0];
        },
        isSpecialBrick(item) {
            if (
                isNaN(this.cleanItemId(item.itemid)) ||
                item.color.brickLinkId == 65 || // metallic gold
                item.color.brickLinkId == 67 || // metallic silver
                item.itemid == '90398' ||
                item.itemid == '67583' ||
                item.itemid == '27328' ||
                item.itemid == '21699' ||
                item.itemid == '38547'
            ) {
                return true;
            }
            return false;
        },
        async loadBricksAndPieces(item) {
            console.log('loadBricksAndPieces', item);
            if (!item.searchids) {
                item.bricksAndPieces = null;
                this.bricksAndPiecesBrickCounter++;
                this.calcLoad();
                return item;
            }

            var bricks = [];

            for (var j = 0; j < item.searchids.length; j++) {
                if (item.searchids[j]) {
                    var response = await browser.runtime.sendMessage({
                        contentScriptQuery: 'getBricksAndPieces',
                        itemId: item.searchids[j],
                    });
                    //console.log('response', item.searchids[j], response);
                    if (response?.bricks) {
                        bricks = bricks.concat(response.bricks);
                    }
                }
            }

            //console.log("getBricksAndPieces", item.itemid, bricks)
            var foundBrick = this.findBricksAndPiecesBrick(item, bricks);
            //console.log(foundBrick)
            if (foundBrick) {
                item.bricksAndPieces = foundBrick;
            } else {
                item.bricksAndPieces = null;
            }
            this.bricksAndPiecesBrickCounter++;
            this.calcLoad();

            
            this.sendPrices(this.prepareSendPrice(item, bricks));

            return item;
        },
        async loadPickABrick(item) {
            //console.log("PickABrick", item, item.searchids.join('-'))
            if (!item.searchids) {
                item.pickABrick = null;
                this.pickABrickBrickCounter++;
                this.calcLoad();
                return item;
            }

            var response = await browser.runtime.sendMessage({
                contentScriptQuery: 'getPickABrick',
                itemId: item.searchids.join('-'),
            });

            var foundBrick = this.findPickABrickBrick(item, response);
            if (foundBrick) {
                item.pickABrick = foundBrick;
            } else {
                item.pickABrick = null;
            }
            this.pickABrickBrickCounter++;
            this.calcLoad();

            return item;
        },
        prepareSendPrice(item, bricks) {
            //console.log(item);
            if (!bricks) return null;

            var returnValue = [];
            var country = localStorage.getItem('country') || null;

            bricks.forEach((value) => {
                var value = {
                    designId: value.designId,
                    itemNumber: value.itemNumber,
                    brickLinkId: item.itemid,
                    priceAmount: value.price.amount,
                    priceCurrency: value.price.currency,
                    maxAmount: value.maxAmount,
                    isAvailable: value.isAvailable,
                    isSoldOut: value.isSoldOut,
                    country: country,
                };

                returnValue.push(value);
            });

            //console.log('returnValue', returnValue);
            return returnValue;
        },
    },
};

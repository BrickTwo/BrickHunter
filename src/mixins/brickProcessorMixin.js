import { validate } from "vee-validate";

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
            console.log(result);
            if(!result.length){
                result = colorList.filter(
                    (color) => color.brickLinkId == 0
                );
                result[0].legoName = colorFamily;
                result[0].bricksAndPiecesName = colorFamily;
                result[0].pickABrickName = colorFamily;
            }
            return result[0];
        },
        findBricksAndPiecesBrick(item, bricks) {
            if (!bricks) return null;
            bricks = bricks.filter((brick) => !brick.isSoldOut);
            var result = bricks.filter(
                (brick) =>
                    brick.colorFamily == item.color.bricksAndPiecesName &&
                    !brick.isSoldOut
            );

            if (this.isSpecialBrick(item)) {
                if (item.brickLink.mapPCCs) {
                    var colorCodesArray = item.brickLink.mapPCCs;
                    var colorCodes = colorCodesArray[
                        item.color.brickLinkId
                    ].split(',');

                    result = bricks.filter(function(brick) {
                        return this.indexOf(brick.itemNumber) < 0;
                    }, colorCodes);
                }
            }

            result.sort((a, b) => {
                if (a.price.amount > b.price.amount) {
                    return 1;
                } else {
                    return -1;
                }
            });

            return result[0];
        },
        findPickABrickBrick(item, bricks) {
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

                    result = bricks.filter(function(brick) {
                        return this.indexOf(brick.itemNumber) < 0;
                    }, colorCodes);
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
                    if (response?.bricks) {
                        bricks = bricks.concat(response.bricks);
                    }
                }
            }

            var foundBrick = this.findBricksAndPiecesBrick(item, bricks);
            
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
            if (!bricks) return null;

            var returnValue = [];
            var country = this.$store.state.country;

            bricks.forEach((value) => {
                var value = {
                    designId: value.designId,
                    itemNumber: value.itemNumber,
                    priceAmount: value.price.amount,
                    priceCurrency: value.price.currency,
                    maxAmount: value.maxAmount,
                    isAvailable: value.isAvailable,
                    isSoldOut: value.isSoldOut,
                    isIPElement: value.isIPElement,
                    color: value.color,
                    colorFamily: value.colorFamily,
                    description: value.description,
                    imageUrl: value.imageUrl,
                    category: value.category,
                    materialType: value.materialType,
                    country: country,
                };

                returnValue.push(value);
            });

            return returnValue;
        },
    },
};

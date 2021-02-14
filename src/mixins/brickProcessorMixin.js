import apiBrickTwo from '@/utility/api/bricktwo.js';

export const brickProcessorMixin = {
    methods: {
        cleanDesignId(designId) {
            designId = designId.toString();
            var lastChar = designId.substr(-1, 1);
            if (lastChar >= 'a' && lastChar <= 'h') {
                return designId.slice(0, -1);
            } else {
                return designId;
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
                (color) =>
                    color.bricksAndPiecesName.toUpperCase() ==
                    colorFamily.toUpperCase()
            );

            if (result.length) {
                return result[0];
            }

            var color = {
                ...colorList.filter((color) => color.brickLinkId == 0)[0],
            };
            color.legoName = colorFamily;
            color.bricksAndPiecesName = colorFamily;
            color.pickABrickName = colorFamily;
            return color;
        },
        async findBricksAndPiecesBrick(item, bricks) {
            if (!bricks || !bricks.length) return null;
            bricks = bricks.filter(
                (brick) => !brick.isSoldOut && brick.isAvailable
            );

            if (item.source == 'lego' || item.source == 'singleParts') {
                var result = bricks.filter(
                    (brick) => brick.itemNumber == item.itemNumber
                );
                if (result[0]) return result[0];

                if (item.itemNumber) {
                    var resp = await apiBrickTwo.getBrickAsync(item.itemNumber, this.$store.state.country);

                    if (resp?.brick?.alternativeItemNumbers) {
                        var altItemNumbers = resp.brick.alternativeItemNumbers.split(
                            '|'
                        );

                        for (var i = 1; i < altItemNumbers.length - 1; i++) {
                            var result = bricks.filter(
                                (brick) => brick.itemNumber == altItemNumbers[i]
                            );

                            if (result[0]) return result[0];
                        }
                    }

                    return result[0];
                }
            }

            var result = bricks.filter(
                (brick) => brick.colorFamily == item.color.bricksAndPiecesName
            );

            if (this.isSpecialBrick(item) && item.source == 'brickLink') {
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
        async findPickABrickBrick(item, bricks) {
            if (!bricks || !bricks.length) return null;

            if (item.source == 'lego' || item.source == 'singleParts') {
                var result = bricks.filter(
                    (brick) => brick.variant.id == item.itemNumber
                );
                if (result[0]) return result[0];
                        
                if (item.itemNumber) {
                    var resp = await apiBrickTwo.getBrickAsync(item.itemNumber, this.$store.state.country);

                    if (resp?.brick?.alternativeItemNumbers) {
                        var altItemNumbers = resp.brick.alternativeItemNumbers.split(
                            '|'
                        );

                        for (var i = 1; i < altItemNumbers.length - 1; i++) {
                            var result = bricks.filter(
                                (brick) => brick.itemNumber == altItemNumbers[i]
                            );

                            if (result[0]) return result[0];
                        }
                    }

                    return result[0];
                }
            }

            var result = bricks.filter(
                (brick) =>
                    brick.variant.attributes.colour == item.color.pickABrickName
            );

            if (this.isSpecialBrick(item) && item.source == 'brickLink') {
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
                isNaN(this.cleanDesignId(item.designId)) ||
                item.color.brickLinkId == 65 || // metallic gold
                item.color.brickLinkId == 67 || // metallic silver
                item.designId == '90398' ||
                item.designId == '67583' ||
                item.designId == '27328' ||
                item.designId == '21699' ||
                item.designId == '38547'
            ) {
                return true;
            }
            return false;
        },
        async loadBricksAndPieces(item, single = false) {
            if (!item.searchids) {
                item.bricksAndPieces = null;
                if (!single) this.bricksAndPiecesBrickCounter++;
                if (!single) this.calcLoad();
                return item;
            }

            var bricks = [];

            for (var j = 0; j < item.searchids.length; j++) {
                if (item.searchids[j]) {
                    try {
                        var response = await browser.runtime.sendMessage({
                            service: 'bricksAndPieces',
                            action: 'findBrick',
                            designId: item.searchids[j],
                        });

                        if (response?.status) {
                            item.bricksAndPieces = { error: response.status };
                            if (!single) this.bricksAndPiecesBrickCounter++;
                            if (!single) this.calcLoad();
                            return item;
                        }
                        if (response?.bricks) {
                            bricks = bricks.concat(response.bricks);
                        }
                    } catch (error) {}
                }
            }

            var foundBrick = await this.findBricksAndPiecesBrick(item, bricks);

            if (foundBrick) {
                item.bricksAndPieces = foundBrick;
            } else {
                item.bricksAndPieces = null;
            }
            if (!single) this.bricksAndPiecesBrickCounter++;
            if (!single) this.calcLoad();

            apiBrickTwo.sendPrices(this.prepareSendPrice(bricks));

            return item;
        },
        async loadPickABrick(item, single = false) {
            if (!item.searchids) {
                item.pickABrick = null;
                if (!single) this.pickABrickBrickCounter++;
                if (!single) this.calcLoad();
                return item;
            }
            try {
                var response = await browser.runtime.sendMessage({
                    service: 'pickABrick',
                    action: 'findBrick',
                    designId: item.searchids.join('-'),
                });

                if (response?.status) {
                    item.pickABrick = { error: response.status };
                    if (!single) this.pickABrickBrickCounter++;
                    if (!single) this.calcLoad();
                    return item;
                }

                var foundBrick = await this.findPickABrickBrick(item, response);
                if (foundBrick) {
                    item.pickABrick = foundBrick;
                } else {
                    item.pickABrick = null;
                }
                if (!single) this.pickABrickBrickCounter++;
                if (!single) this.calcLoad();
            } catch (error) {}
            return item;
        },
        prepareSendPrice(bricks) {
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

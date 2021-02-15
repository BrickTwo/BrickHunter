import apiBrickTwo from '@/utility/api/bricktwo.js';
import brickBrickLink from '@/utility/brick/bricklink.js';

export default {
    async load(item, country) {
        if (!item.searchids) {
            item.bricksAndPieces = null;
            return item;
        }

        let bricks = [];

        for (let j = 0; j < item.searchids.length; j++) {
            if (item.searchids[j]) {
                try {
                    let response = await browser.runtime.sendMessage({
                        service: 'bricksAndPieces',
                        action: 'findBrick',
                        designId: item.searchids[j],
                    });

                    if (response?.status) {
                        item.bricksAndPieces = { error: response.status };
                        return item;
                    }
                    if (response?.bricks) {
                        bricks = bricks.concat(response.bricks);
                    }
                } catch (error) {}
            }
        }

        let foundBrick = await this.findBrick(item, bricks, country);

        if (foundBrick) {
            item.bricksAndPieces = foundBrick;
        } else {
            item.bricksAndPieces = null;
        }

        apiBrickTwo.sendPrices(apiBrickTwo.prepareSendPrice(bricks, country));

        return item;
    },
    async findBrick(item, bricks, country) {
        if (!bricks || !bricks.length) return null;
        bricks = bricks.filter(
            (brick) => !brick.isSoldOut && brick.isAvailable
        );

        if (item.source == 'lego' || item.source == 'singleParts') {
            let result = bricks.filter(
                (brick) => brick.itemNumber == item.itemNumber
            );
            if (result[0]) return result[0];

            if (item.itemNumber) {
                let resp = await apiBrickTwo.getBrickAsync(
                    item.itemNumber,
                    country
                );

                if (resp?.brick?.alternativeItemNumbers) {
                    let altItemNumbers = resp.brick.alternativeItemNumbers.split(
                        '|'
                    );

                    for (let i = 1; i < altItemNumbers.length - 1; i++) {
                        let result = bricks.filter(
                            (brick) => brick.itemNumber == altItemNumbers[i]
                        );

                        if (result[0]) return result[0];
                    }
                }

                return result[0];
            }
        }

        let result = bricks.filter(
            (brick) => brick.colorFamily == item.color.bricksAndPiecesName
        );

        if (brickBrickLink.isSpecialBrick(item) && item.source == 'brickLink') {
            if (item.brickLink.mapPCCs) {
                let colorCodesArray = item.brickLink.mapPCCs;
                let colorCodes = colorCodesArray[item.color.brickLinkId].split(
                    ','
                );

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
};

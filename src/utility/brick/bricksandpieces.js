import apiBrickTwo from '@/utility/api/bricktwo.js';
import brickBrickLink from '@/utility/brick/bricklink.js';

export default {
    async load(searchItem, items, country) {
        if (!searchItem.searchids) {
            items.map((i) => (i.bricksAndPieces = null));
            //item.bricksAndPieces = null;
            return;
        }

        let bricks = [];

        for (let j = 0; j < searchItem.searchids.length; j++) {
            if (searchItem.searchids[j]) {
                try {
                    let response = await browser.runtime.sendMessage({
                        service: 'bricksAndPieces',
                        action: 'findBrick',
                        designId: searchItem.searchids[j],
                    });

                    if (response?.status) {
                        if (response.status == 204) {
                            items.map(
                                (i) =>
                                    (i.bricksAndPieces = null)
                            );
                            return;
                        }

                        items.map(
                            (i) =>
                                (i.bricksAndPieces = { error: response.status })
                        );
                        //item.bricksAndPieces = { error: response.status };
                        return;
                    }
                    if (response?.bricks) {
                        bricks = bricks.concat(response.bricks);
                    }
                } catch (error) {}
            }
        }

        for (let i = 0; i < items.length; i++) {
            let foundBrick = await this.findBrick(items[i], bricks, country);

            if (foundBrick) {
                items[i].bricksAndPieces = foundBrick;
            } else {
                items[i].bricksAndPieces = null;
            }
        }

        apiBrickTwo.sendPrices(apiBrickTwo.prepareSendPrice(bricks, country));
        return;
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

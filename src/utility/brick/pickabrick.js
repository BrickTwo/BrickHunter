import apiBrickTwo from '@/utility/api/bricktwo.js';
import brickBrickLink from '@/utility/brick/bricklink.js';

export default {
    async load(searchItem, items, country) {
        if (!searchItem.searchids) {
            items.map((i) => (i.pickABrick = null));
            //item.pickABrick = null;
            return;
        }
        try {
            let response = await browser.runtime.sendMessage({
                service: 'pickABrick',
                action: 'findBrick',
                designId: searchItem.searchids.join('-'),
            });

            if (response?.status) {
                items.map((i) => (i.pickABrick = { error: response.status }));
                //item.pickABrick = { error: response.status };
                return;
            }

            for (let i = 0; i < items.length; i++) {
                let foundBrick = await this.findBrick(items[i], response, country);

                if (foundBrick) {
                    items[i].pickABrick = foundBrick;
                } else {
                    items[i].pickABrick = null;
                }
            }

        } catch (error) {}
        return;
    },
    async findBrick(item, bricks, country) {
        if (!bricks || !bricks.length) return null;

        if (item.source == 'lego' || item.source == 'singleParts') {
            let result = bricks.filter(
                (brick) => brick.variant.id == item.itemNumber
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
            (brick) =>
                brick.variant.attributes.colour == item.color.pickABrickName
        );

        if (brickBrickLink.isSpecialBrick(item) && item.source == 'brickLink') {
            if (!result.length && item.brickLink.mapPCCs) {
                let colorCodesArray = item.brickLink.mapPCCs;
                let colorCodes = colorCodesArray[item.color.brickLinkId].split(
                    ','
                );

                result = bricks.filter(function(brick) {
                    return this.indexOf(brick.itemNumber) < 0;
                }, colorCodes);
            }
        }

        return result[0];
    },
};

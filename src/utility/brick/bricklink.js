export default {
    cleanDesignId(designId) {
        designId = designId.toString();
        let lastChar = designId.substr(-1, 1);
        if (lastChar >= 'a' && lastChar <= 'h') {
            return designId.slice(0, -1);
        } else {
            return designId;
        }
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
    findAlternateItemNumbers(item) {
        return item.brickLink.strAltNo
            .split(',')
            .map(function(number) {
                if (!isNaN(number.trim())) return number.trim();
            })
            .filter((f) => f != null);
    },
    findColorCodes(item) {
        if (!item.brickLink.mapPCCs) return null;

        let colorCodesArray = item.brickLink.mapPCCs;

        if (!colorCodesArray[item.color.brickLinkId]) return null;
        let colorCodes = colorCodesArray[item.color.brickLinkId].split(',');
        return colorCodes;
    },
    returnModelsObject(html) {
        let startPos = html.data.indexOf('blapp.models.set(') + 18;
        let length = html.data.substr(startPos).indexOf(');');
        let models = html.data.substr(startPos, length);

        let model = JSON.parse(models).filter(
            (model) => model.name == 'itemInfo'
        )[0];
        let returnModel = {
            strAltNo: model.data?.dmItemDetail?.dmItem?.dmBasic?.strAltNo,
            mapPCCs: model.data?.dmItemDetail?.dmItem?.mapPCCs,
        };

        return returnModel;
    },
    async prepareSearchIds(item) {
        if (item.source != 'brickLink') return item;

        if (this.isSpecialBrick(item)) {
            let desingIds = await this.findColorCodes(item);
            item.searchids = desingIds;
        } else {
            item.searchids = [this.cleanDesignId(item.designId)];
            item.searchids = item.searchids.concat(
                await this.findAlternateItemNumbers(item)
            );
        }
        return item;
    },
};

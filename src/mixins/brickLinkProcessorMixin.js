export const brickLinkProcessorMixin = {
    methods: {
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

            var colorCodesArray = item.brickLink.mapPCCs;

            if (!colorCodesArray[item.color.brickLinkId]) return null;
            var colorCodes = colorCodesArray[item.color.brickLinkId].split(',');
            return colorCodes;
        },
        returnModelsObject(html) {
            var startPos = html.data.indexOf('blapp.models.set(') + 18;
            var length = html.data.substr(startPos).indexOf(');');
            var models = html.data.substr(startPos, length);
            
            var model = JSON.parse(models).filter(
                (model) => model.name == 'itemInfo'
            )[0];
            var returnModel = {
                strAltNo: model.data?.dmItemDetail?.dmItem?.dmBasic?.strAltNo,
                mapPCCs: model.data?.dmItemDetail?.dmItem?.mapPCCs,
            };

            return returnModel;
        },
        async prepareSearchIds(item) {
            if (item.source != 'brickLink') return item;

            if (this.isSpecialBrick(item)) {
                var desingIds = await this.findColorCodes(item);
                item.searchids = desingIds;
            } else {
                item.searchids = [this.cleanDesignId(item.designId)];
                item.searchids = item.searchids.concat(
                    await this.findAlternateItemNumbers(item)
                );
            }
            return item;
        },
    },
};

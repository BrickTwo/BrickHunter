export const brickLinkProcessorMixin = {
    methods: {
        findAlternateItemNumbers(item) {
            return item.brickLink.strAltNo.split(',').map(function(number) {
                return number.trim();
            });
        },
        findColorCodes(item) {
            //console.log("FindColorCodes", item)
            if(!item.brickLink.mapPCCs) return null;

            var colorCodesArray = item.brickLink.mapPCCs;
            //console.log(colorCodesArray, item.color.brickLinkId)
            var colorCodes = colorCodesArray[item.color.brickLinkId].split(',');
            //console.log("FindColorCodes", colorCodes)
            return colorCodes;
        },
        returnModelsObject(html) {
            var startPos = html.data.indexOf('blapp.models.set(') + 18;
            var length = html.data.substr(startPos).indexOf(');');
            var models = html.data.substr(startPos, length);
            //console.log(JSON.parse(models))
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
            if (this.isSpecialBrick(item)) {
                //console.log("special brick")
                var desingIds = await this.findColorCodes(item);
                item.searchids = desingIds;
            } else {
                //console.log("normal brick")
                item.searchids = [this.cleanItemId(item.itemid)];
                item.searchids = item.searchids.concat(
                    await this.findAlternateItemNumbers(item)
                );
            }
            //console.log("searchIds", item.searchids)
            return item;
        }
    },
};

export const brickLinkProcessorMixin = {
    methods: {
        FindAlternateItemNumbers(item) {
            return item.brickLink.strAltNo.split(',').map(function(number) {
                return number.trim();
            });
        },
        FindColorCodes(item) {
            //console.log("FindColorCodes", item)
            var colorCodesArray = item.brickLink.mapPCCs;
            //console.log(colorCodesArray, item.color.brickLinkId)
            var colorCodes = colorCodesArray[item.color.brickLinkId].split(',');
            //console.log("FindColorCodes", colorCodes)
            return colorCodes;
        },
        ReturnModelsObject(html) {
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
    },
};

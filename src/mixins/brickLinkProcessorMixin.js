export const brickLinkProcessorMixin = {
    methods: {
        FindAlternateItemNumbers(item) {
            //console.log("FindAlternateItemNumbers", item)
            /*var startPos = html.data.indexOf("strAltNo")+11;
        var length = html.data.substr(startPos).indexOf('"');
        var alternateNo = html.data.substr(startPos,length);
        return alternateNo.replace(/ /g, "").split(",");*/

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

            //console.log("printed", html);
            //var startPos = html.data.indexOf("mapPCCs")+16;
            //var length = html.data.substr(startPos).indexOf('"');
            //var alternateNo = html.data.substr(startPos,length);
            //console.log("alternateNo", alternateNo)
            //console.log("printed array", alternateNo.replace(/ /g, "").split(","));
            //return alternateNo.replace(/ /g, "").split(",");
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

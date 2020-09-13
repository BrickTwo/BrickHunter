export const brickLinkProcessorMixin = {
    methods: {
      FindAlternateItemNumbers(html) {
        var startPos = html.data.indexOf("strAltNo")+11;
        var length = html.data.substr(startPos).indexOf('"');
        var alternateNo = html.data.substr(startPos,length);
        return alternateNo.replace(/ /g, "").split(",");
      },
      FindDesignNumbers(html) {
        //console.log("printed", html);
        var startPos = html.data.indexOf("mapPCCs")+16;
        var length = html.data.substr(startPos).indexOf('"');
        var alternateNo = html.data.substr(startPos,length);
        //console.log("printed array", alternateNo.replace(/ /g, "").split(","));
        return alternateNo.replace(/ /g, "").split(",");
      },
      ReturnModelsObject(html) {
        var startPos = html.data.indexOf("blapp.models.set(")+18;
        var length = html.data.substr(startPos).indexOf(');');
        var models = html.data.substr(startPos,length);
        console.log(JSON.parse(models))
        return JSON.parse(models)
      }
    }
  };
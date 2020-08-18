export const brickProcessorMixin = {
    methods: {
      CleanItemId(itemId) {
        var lastChar = itemId.substr(-1, 1);
        if (lastChar >= "a" && lastChar <= "h") {
            return itemId.slice(0, -1);
        } else {
            return itemId;
        }
      },
      FindColor(brickLinkColorId, colorList) {
        var result = colorList.filter(color => color.brickLinkId == brickLinkColorId);
        return result[0];
      },
      FindBrick(item, bricks) {
        //console.log("satFind", item, bricks);
        var result = bricks.filter(brick => brick.colorFamily == item.color.piecesAndBricksName && !brick.isSoldOut);
        //console.log("result", result);
        result.sort((a,b) => {
          if(a.price.amount > b.price.amount){
            return 1;
          }else{
            return -1;
          }
        });
        return result[0]
      },
      FindBrickPab(item, response) {
        //console.log("pabFind", item, response);
        var result = response.filter(brick => brick.variant.attributes.colour == item.color.pickABrickName);
        //console.log("result", result);
        return result[0]
      }
    }
  };
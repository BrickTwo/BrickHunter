<template>
      <vuetable ref="vuetable"
        :api-mode="false"
        :data="bricklist"
        :fields="columns"
      >
        
      </vuetable>
</template>

<script>

import Vuetable from 'vuetable-2/src/components/Vuetable'
export default {
    props: {
      bricklist: {
        type: Array
      },
      limitMaxQty: {
        type: Number,
        default: 0
      }
    },
    data: () => ({ 
        //wantedList: [],
        columns: [
            {
                name: '__sequence',
                title: () => browser.i18n.getMessage('brickList_lineNumber'),
                callback: 'lineNumber'
            },
            {
                name: 'itemid',
                title: () => browser.i18n.getMessage('brickList_itemId')
            },
            {
                name: 'image',
                title: () => browser.i18n.getMessage('brickList_brickLinkImage'),
                callback: 'showImage'
            },
            {
                name: 'color.legoName',
                title: () => browser.i18n.getMessage('brickList_brickLinkColor')
            },
            {
                name: 'qty',
                title: () => browser.i18n.getMessage('brickList_quantity'),
                callback: 'showQty'
            },
            {
                name: 'pab',
                title: () => browser.i18n.getMessage('brickList_pickABrickPrice'),
                callback: 'pabPrice'
            },
            {
                name: 'sat',
                title: () => browser.i18n.getMessage('brickList_bricksAndPiecesPrice'),
                callback: 'satPrice'
            }
        ]
        }),
  components: {
    Vuetable
  },
  methods: {
    showImage(value) {
        return `<img src="${value}" height="40">`
    },
    pabPrice(value) {
        if(!value) return "";
        var returnValue = `${value.variant.price.currencyCode} ${value.variant.price.centAmount/100}<br><span style="color: grey; font-size: small;">[${value.variant.attributes.designNumber}]</span>`;
        return returnValue;
    },
    satPrice(value) {
        if(!value) return "";
        var returnValue = `${value.price.currency} ${value.price.amount}<br><span style="color: grey; font-size: small;">[${value.designId}]</span>`;
        return returnValue;
    },
    lineNumber(value) {
        //console.log(value)
        return value +1 
    },
    showQty(value) {
        //console.log(value)
        if(this.limitMaxQty > 0){
          if(value.order > this.limitMaxQty) return `<span id="maxqty" style="color: red">${this.limitMaxQty}</span><br><span style="color: grey; font-size: small;">[${value.order}]</span>`
          if(value.have > 0) return value.order
        }
        else{
          if(value.have > 0) return `<span id="maxqty">${value.min}</span><br><span style="color: grey; font-size: small;">(${value.have})</span>`
        }
        return value.min
    }
  }
}
</script>

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
        type: Boolean,
        default: false
      }
    },
    data: () => ({ 
        //wantedList: [],
        columns: [
            {
                name: '__sequence',
                title: "#",
                callback: 'lineNumber'
            },
            {
                name: 'itemid',
                title: "Id"
            },
            {
                name: 'image',
                title: "Bild",
                callback: 'showImage'
            },
            {
                name: 'color.legoName',
                title: "BrickLink Farbe"
            },
            {
                name: 'minqty',
                title: "Anzahl",
                callback: 'showQty'
            },
            {
                name: 'pab',
                title: "Pick a Brick",
                callback: 'pabPrice'
            },
            {
                name: 'sat',
                title: "Steine & Teile",
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
        if(this.limitMaxQty){
          if(value > 200) return `<span id="maxqty" style="color: red">200</span><br><span style="color: grey; font-size: small;">[${value}]</span>`
        }
        return value
    }
  }
}
</script>

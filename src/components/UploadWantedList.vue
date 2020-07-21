    <template>
  <div style="width: 770px">
    <span>
        <xml-reader @load="loadXml" style="width: 650px" v-if="isChrome"></xml-reader>
        <b-button variant="primary" v-if="!isChrome && !loadWantedList" @click="loadWantedList=true">WantedList</b-button>
        <xml-field @load="loadXml" @cancel="loadWantedList=false" style="width: 650px" v-if="loadWantedList"></xml-field>
    </span>
    <span style="margin-left: 10px; vertical-align: bottom;" v-if="priceLoaded"><div style="width: 200px;"></div></span>
    <span style="margin-left: 10px; vertical-align: bottom" v-if="!priceLoaded && !loadWantedList"><b-button variant="primary" @click="loadPrice">Lade Preis</b-button></span>
    <span style="margin-left: 10px; vertical-align: bottom;" v-if="!priceLoaded && !isChrome"><div style="width: 200px;"></div></span>
    <span v-if="!loadWantedList">
        <span style="font-weight: bolder;">Pick a Brick geladen:</span>
        <span> {{pabBrickCounter}}/{{totalBricks}}</span>
        <span style="font-weight: bolder; margin-left: 10px;">Steine und Teile geladen:</span>
        <span> {{satBrickCounter}}/{{totalBricks}}</span>
    </span>
    <vuetable ref="vuetable"
    :api-mode="false"
    :data="wantedList"
    :fields="columns"
     v-if="!loadWantedList"
  ></vuetable>
  </div>
</template>

<script>
import XmlReader from "./XmlReader";
import XmlField from "./XmlField";
import Vuetable from 'vuetable-2/src/components/Vuetable'
import { brickProcessorMixin } from "@/mixins/brickProcessorMixin";
import { brickColorMixin } from "@/mixins/brickColorMixin";
import { requestsMixin } from "@/mixins/requestsMixin";
import { brickLinkProcessorMixin } from "@/mixins/brickLinkProcessorMixin";

export default {
    name: 'UploadWantedList',
    data: () => ({ 
        isChrome: navigator.userAgent.indexOf("Chrome") != -1,
        loadWantedList: false,
        totalBricks: 0,
        pabBrickCounter: 0,
        satBrickCounter: 0,
        priceLoaded: true,
        wantedList: [],
        columns: [
            {
                name: '__sequence',
                title: "#"
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
                title: "Anzahl"
            },
            {
                name: 'pab',
                title: "Pick a Brick Preis",
                callback: 'pabPrice'
            },
            {
                name: 'sat',
                title: "Steine & Teile Preis",
                callback: 'satPrice'
            }
        ]
        }),
  components: {
    XmlReader,
    XmlField,
    Vuetable
  },
  mixins: [brickProcessorMixin, brickColorMixin, requestsMixin, brickLinkProcessorMixin],
  methods: {
    loadXml (wantedList) {
        //console.log(wantedList);
        this.loadWantedList = false;
        this.priceLoaded = false;
        this.totalBricks = 0;
        this.pabBrickCounter = 0;
        this.satBrickCounter = 0;

        wantedList.then(list => {
            list[0].map(item => {
                item.itemtype = item.itemtype[0];
                item.itemid = item.itemid[0];
                //console.log(this.ItemIdToDesignId(item.itemid));
                item.searchids = [this.CleanItemId(item.itemid)];
                item.designid = "";
                item.color = item.color[0];
                item.color = this.FindColor(item.color, this.COLOR);
                item.maxprice = item.maxprice[0];
                item.minqty = item.minqty[0];
                item.condition = item.condition[0];
                item.notify = item.notify[0];
                item.image = `https://img.bricklink.com/ItemImage/PT/${item.color.brickLinkId}/${item.itemid}.t1.png`;
                item.sat = null;
                item.pab = null;
            })
            this.wantedList = [...list[0]];
            this.totalBricks = this.wantedList.length;
            console.log(this.wantedList);
            return list;
        });
    },
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
    loadPrice() {
        this.priceLoaded = true;

        this.wantedList.map((item, i) => {
            this.delay(200 * this.wantedList.length - 200 * i).then(d => {
                this.getBricklink(item.itemid)
                .then(response => {
                    
                        var numbers = this.FindAlternateItemNumbers(response);
                        item.searchids = item.searchids.concat(numbers);
                        if (~item.itemid.indexOf("pb")) { // if printed brick
                            //console.log(item.searchids);
                            var desingIds= this.FindDesignNumbers(response);
                            item.searchids = desingIds;
                        }
                        //console.log("searchIds", item.searchids);
                    
                })
                .catch(error => {
                    //this.satBrickCounter++;
                    //this.pabBrickCounter++;
                })
                .then(value=>{
                    var bricks = [];

                    let requests = item.searchids.map(async id => {
                            if(id){
                                await browser.runtime.sendMessage({contentScriptQuery: "SteineUndTeile", itemId: id})
                                .then(response => {
                                    //console.log("SteineUndTeile", response);
                                    bricks = bricks.concat(response.bricks);
                                })
                                .catch(error => {
                                    //console.log("error", error);
                                });
                            }
                        });

                    Promise.all(requests)
                    .then(value => {
                        var foundBrick = this.FindBrick(item, bricks);
                        if(foundBrick) {
                            item.sat = foundBrick;
                        }
                    })
                    this.satBrickCounter++;
                })
                .then(value=>{
                    browser.runtime.sendMessage({contentScriptQuery: "PickABrick", itemId: item.searchids.join('-')})
                    .then(response => {
                        var foundBrick = this.FindBrickPab(item, response);
                        if(foundBrick) {
                            item.pab = foundBrick;
                        }
                    })
                    this.pabBrickCounter++;
                });
            });
        });
    },
    delay(t, data) {
        return new Promise(resolve => {
            setTimeout(resolve.bind(null, data), t);
        });
    }
  }
}
</script>

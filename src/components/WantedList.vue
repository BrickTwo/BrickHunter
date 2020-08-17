    <template>
  <div>
    <p>
        <xml-reader @load="loadXml" style="width: 500px" v-if="isChrome"></xml-reader>
        <b-button variant="primary" v-if="!isChrome && !loadWantedList" @click="loadWantedList=true">WantedList</b-button>
        <xml-field @load="loadXml" @cancel="loadWantedList=false" style="width: 650px" v-if="loadWantedList"></xml-field>
        <b-button variant="primary" @click="loadPrice" style="margin-left: 10px; vertical-align: bottom;" :disabled="!wantedList || wantedList.length == 0" v-if="!loadWantedList">Lade Preise</b-button>
        <b-button variant="danger" @click="clear" style="margin-left: 10px; vertical-align: bottom;" v-if="!loadWantedList">Leeren</b-button>
    </p>
    <!-- <span style="margin-left: 10px; vertical-align: bottom;" v-if="priceLoaded"><div style="width: 200px;"></div></span>-->
    <!-- <p style="margin-top: 10px" v-if="!loadWantedList">
        
    </p> -->
    <!--<span style="margin-left: 10px; vertical-align: bottom;" v-if="!priceLoaded && !isChrome"><div style="width: 200px;"></div></span>-->
    <span v-if="!loadWantedList">
        <b-progress :value="loadPercentage" :max="100" show-progress animated v-if="loadPercentage < 100" style="margin-top: 10px"></b-progress>
        <!--<span style="font-weight: bolder;">Pick a Brick geladen:</span>
        <span> {{pabBrickCounter}}/{{totalBricks}}</span>
        <span style="font-weight: bolder; margin-left: 10px;">Steine und Teile geladen:</span>
        <span> {{satBrickCounter}}/{{totalBricks}} : {{this.loadPercentage}}</span> -->
    </span>
    <brick-list v-if="!loadWantedList" :bricklist="wantedList"></brick-list>
  </div>
</template>

<script>
import XmlReader from "./XmlReader";
import XmlField from "./XmlField";
import BrickList from "./BrickList"
import { brickProcessorMixin } from "@/mixins/brickProcessorMixin";
import { brickColorMixin } from "@/mixins/brickColorMixin";
import { requestsMixin } from "@/mixins/requestsMixin";
import { brickLinkProcessorMixin } from "@/mixins/brickLinkProcessorMixin";

export default {
    data: () => ({ 
        isChrome: navigator.userAgent.indexOf("Chrome") != -1,
        loadWantedList: false,
        totalBricks: 0,
        pabBrickCounter: 0,
        satBrickCounter: 0,
        loadPercentage: 100,
        priceLoaded: true,
        wantedList: []
        }),
  components: {
    XmlReader,
    XmlField,
    BrickList
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
                if(item.color){
                    item.color = item.color[0];
                    item.color = this.FindColor(item.color, this.COLOR);
                } else {
                    item.color = this.FindColor(0, this.COLOR);
                }
                item.maxprice = item.maxprice[0];
                item.minqty = item.minqty[0];
                item.condition = item.condition[0];
                item.notify = item.notify[0];
                item.image = `https://img.bricklink.com/ItemImage/${item.itemtype}T/${item.color.brickLinkId}/${item.itemid}.t1.png`;
                item.sat = null;
                item.pab = null;
            })
            this.wantedList = [...list[0]];
            this.totalBricks = this.wantedList.length;
            this.$store.commit("setWantedList", this.wantedList);
            return list;
        });
    },
    clear() {
        //this.$refs.vuetable.resetData
        this.wantedList = []
        //this.wantedList = null
        this.$store.commit("setWantedList", this.wantedList);
    },
    loadPrice() {
        this.priceLoaded = true;
        this.pabBrickCounter = 0;
        this.satBrickCounter = 0;
        this.loadPercentage = 0;

        for(var i = 0; i < this.wantedList.length; i++ ){
            this.wantedList[i].sat = null
            this.wantedList[i].pab = null
        }

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
                                    //console.log("SteineUndTeile", id);
                                    //console.log(response)
                                    bricks = bricks.concat(response.bricks);
                                    
                                })
                                .catch(error => {
                                    //console.log("error", error);
                                });
                            }
                        });

                    Promise.all(requests)
                    .then(value => {
                        //console.log("SteineUndTeile", item.itemid, bricks);
                        var foundBrick = this.FindBrick(item, bricks);
                        if(foundBrick) {
                            item.sat = foundBrick;
                        }
                        this.satBrickCounter++;
                        this.calcLoad();
                    })
                    .catch(() => {
                        //console.log("SteineUndTeileerror", item.itemid);
                        this.satBrickCounter++;
                        this.calcLoad();
                    })
                    
                })
                .then(value=>{
                    browser.runtime.sendMessage({contentScriptQuery: "PickABrick", itemId: item.searchids.join('-')})
                    .then(response => {
                        //console.log("PickABrick", item.searchids.join('-'));
                        var foundBrick = this.FindBrickPab(item, response);
                        if(foundBrick) {
                            item.pab = foundBrick;
                        }
                        this.pabBrickCounter++;
                        this.calcLoad();
                    })
                    .catch(() => {
                        this.pabBrickCounter++;
                        this.calcLoad();
                    })
                });
            });
        });

        
    },
    delay(t, data) {
        return new Promise(resolve => {
            setTimeout(resolve.bind(null, data), t);
        })
    },
    calcLoad(){
        //console.log("pab: ", this.pabBrickCounter, " sap: ", this.satBrickCounter)
        var one = 100/this.totalBricks/2;
        
        this.loadPercentage = Math.round((one*this.pabBrickCounter) + (one*this.satBrickCounter))
        if(this.loadPercentage == 100) {
            this.$store.commit("setWantedList", this.wantedList);
        }
        //console.log(this.loadPercentage)
    }
  },
  beforeMount() {
    this.wantedList = JSON.parse(localStorage.getItem("wantedList") || null)
    this.totalBricks = 0
    if(this.wantedList) this.totalBricks = this.wantedList.length
  }
}
</script>

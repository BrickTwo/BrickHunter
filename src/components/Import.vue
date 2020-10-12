<template>
    <div>
        <b-nav tabs>
            <b-nav-item
                :active="page == 'brickLink'"
                @click="page = 'brickLink'"
                >{{ brickLink }}</b-nav-item
            >
            <b-nav-item
                :active="page == 'bricksAndPieces'"
                @click="page = 'bricksAndPieces'"
                >{{ bricksAndPieces }}</b-nav-item
            >
            <b-nav-item
                :active="page == 'pickABrick'"
                @click="page = 'pickABrick'"
                >{{ pickABrick }}</b-nav-item
            >
            
        </b-nav>
        <div v-if="page == 'brickLink'">
            <xml-reader
                id="uploadXml"
                @load="loadXml"
                style="width: 370px"
                v-if="isChrome"
            ></xml-reader>
            <b-button
                variant="primary"
                v-if="!isChrome && !loadWantedList"
                @click="loadWantedList = true"
                >{{ buttonWantedList }}</b-button
            >
            <xml-field
                @load="loadXml"
                @cancel="loadWantedList = false"
                style="width: 650px"
                v-if="loadWantedList"
            ></xml-field>
        </div>
    </div>
</template>

<script>
import XmlReader from './XmlReader';
import XmlField from './XmlField';
import BrickList from './BrickList';
import { brickProcessorMixin } from '@/mixins/brickProcessorMixin';
import { brickColorMixin } from '@/mixins/brickColorMixin';
import { requestsMixin } from '@/mixins/requestsMixin';
import { brickLinkProcessorMixin } from '@/mixins/brickLinkProcessorMixin';

export default {
    data: () => ({
        page: 'brickLink',
        isChrome: navigator.userAgent.indexOf('Chrome') != -1,
        loadWantedList: false,
        totalBricks: 0,
        pickABrickBrickCounter: 0,
        bricksAndPiecesBrickCounter: 0,
        loadPercentage: 100,
        priceLoaded: true,
        wantedList: [],
        cancelLoading: false,
    }),
    components: {
        XmlReader,
        XmlField,
        BrickList,
    },
    mixins: [
        brickProcessorMixin,
        brickColorMixin,
        requestsMixin,
        brickLinkProcessorMixin,
    ],
    methods: {
        loadXml(wantedList) {
            //console.log(wantedList)
            this.loadWantedList = false;
            this.priceLoaded = false;
            this.totalBricks = 0;
            this.pickABrickBrickCounter = 0;
            this.bricksAndPiecesBrickCounter = 0;

            wantedList.then((list) => {
                list[0].map((item) => {
                    item.itemtype = item.itemtype[0];
                    item.itemid = item.itemid[0];
                    //console.log(this.ItemIdToDesignId(item.itemid))
                    item.searchids = [this.cleanItemId(item.itemid)];
                    item.designid = '';
                    if (item.color) {
                        item.color = item.color[0];
                        item.color = this.findColor(item.color, this.COLOR);
                    } else {
                        item.color = this.findColor(0, this.COLOR);
                    }
                    if (item.maxprice) {
                        item.maxprice = item.maxprice[0];
                    } else {
                        item.maxprice = 0;
                    }
                    item.qty = {
                        min: 0,
                        have: 0,
                        balance: 0,
                        order: 0,
                    };
                    if (item.minqty) {
                        item.qty.min = item.minqty[0];
                    }
                    if (item.qtyfilled) {
                        item.qty.have = item.qtyfilled[0];
                    }
                    item.qty.balance = item.qty.min - item.qty.have;
                    if (item.qty.balance < 0) {
                        item.qty.balance = 0;
                    }
                    if (item.condition) {
                        item.condition = item.condition[0];
                    } else {
                        item.condition = null;
                    }
                    if (item.notify) {
                        item.notify = item.notify[0];
                    } else {
                        item.notify = null;
                    }
                    item.image = `https://img.bricklink.com/ItemImage/${item.itemtype}T/${item.color?.brickLinkId}/${item.itemid}.t1.png`;
                    item.bricksAndPieces = null;
                    item.pickABrick = null;
                    item.brickLink = null;
                });
                this.wantedList = [...list[0]];
                this.totalBricks = this.wantedList.length;
                this.$store.commit('setWantedList', this.wantedList);
                return list;
            });
        },
        async loadPrices() {
            this.priceLoaded = true;
            this.pickABrickBrickCounter = 0;
            this.bricksAndPiecesBrickCounter = 0;
            this.loadPercentage = 0;

            for (var i = 0; i < this.wantedList.length; i++) {
                this.wantedList[i].bricksAndPieces = null;
                this.wantedList[i].pickABrick = null;
                this.wantedList[i].brickLink = null;
            }

            for (var i = 0; i < this.wantedList.length; i++) {
                if (this.cancelLoading) {
                    this.cancelLoading = false;
                    return;
                }
                var item = this.wantedList[i];
                await this.sleep(200); //200ms timout to prevent to be blocked on the website
                this.loadPrice(item);

                //console.log(item);
            }

            //console.log(this.wantedList);
        },
        async loadPrice(item) {
            try {
                item.bricksAndPieces = { isLoading: true };
                var brickLinkHtml = await this.getBricklink(item.itemid);
                item.brickLink = await this.returnModelsObject(brickLinkHtml);
            } catch (err) {
                console.log("couldn't find brick on bricklink");
                this.pickABrickBrickCounter++;
                this.bricksAndPiecesBrickCounter++;
                this.calcLoad();
                item.bricksAndPieces = null;
            }

            if (this.cancelLoading) {
                this.cancelLoading = false;
                item.bricksAndPieces = null;
                return;
            }
            if (!item.brickLink) {
                item.bricksAndPieces = null;
                return;
            }

            item = await this.prepareSearchIds(item);
            if (this.cancelLoading) {
                this.cancelLoading = false;
                return;
            }
            item = await this.loadBricksAndPieces(item);
            item.pickABrick = { isLoading: true };
            item = await this.loadPickABrick(item);
        },
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        calcLoad() {
            //console.log("pickABrick: ", this.pickABrickBrickCounter, " bricksAndPieces: ", this.bricksAndPiecesBrickCounter)
            var one = 100 / this.totalBricks / 2;

            this.loadPercentage = Math.round(
                one * this.pickABrickBrickCounter +
                    one * this.bricksAndPiecesBrickCounter
            );
            if (this.loadPercentage >= 100) {
                //console.log("setWantedList", this.wantedList)
                this.$store.commit('setWantedList', this.wantedList);
            }
            //console.log(this.loadPercentage)
        },
        clear() {
            this.wantedList = [];
            this.$store.commit('setWantedList', this.wantedList);
            eventHub.$emit('clearWantedList', '');
        },
        print() {
            //console.log("print")
            this.$htmlToPaper('wantedList');
        },
        cancel() {
            this.cancelLoading = true;
            this.pickABrickBrickCounter = this.totalBricks;
            this.bricksAndPiecesBrickCounter = this.totalBricks;
            this.calcLoad();
        },
    },
    beforeMount() {
        this.wantedList = JSON.parse(
            localStorage.getItem('wantedList') || null
        );
        this.totalBricks = 0;
        if (this.wantedList) this.totalBricks = this.wantedList.length;
    },
    computed: {
        pickABrick() {
            return browser.i18n.getMessage('pickABrick');
        },
        bricksAndPieces() {
            return browser.i18n.getMessage('bricksAndPieces');
        },
        brickLink() {
            return browser.i18n.getMessage('brickLink');
        },
        buttonWantedList() {
            return browser.i18n.getMessage('wantedList_buttonWantedList');
        },
        buttonLoadPrices() {
            return browser.i18n.getMessage('wantedList_buttonLoadPrices');
        },
        buttonCancelLoading() {
            return browser.i18n.getMessage('wantedList_buttonCancelLoading');
        },
        buttonClear() {
            return browser.i18n.getMessage('wantedList_buttonClear');
        },
    },
};
</script>

<template>
    <div>
        <h2>
            {{ partList.name }}
            <b-button variant="primary">
                <b-icon icon="pencil" aria-hidden="true"></b-icon>
            </b-button>
        </h2>
        <span style=" float: right"
            ><span>Zuletzt aktualisiert: {{ partList.date | formatDate }}</span><br />
            <span style="display: inline-block;"
                ><b-form-checkbox
                    id="checkbox-1"
                    name="checkbox-1"
                    value="accepted"
                    unchecked-value="not_accepted"
                    >Warenkorb</b-form-checkbox
                ></span
            ></span
        >
        <p>
            <b-button
                variant="primary"
                @click="loadPrices"
                :disabled="
                    !wantedList ||
                        wantedList.length == 0 ||
                        loadPercentage < 100
                "
                style="margin-left: 10px; vertical-align: bottom;"
                v-if="!loadWantedList"
                >{{ buttonLoadPrices }}</b-button
            ><b-button
                variant="danger"
                @click="cancel"
                :disabled="loadPercentage >= 100"
                style="margin-left: 10px; vertical-align: bottom;"
                v-if="!loadWantedList"
                >{{ buttonCancelLoading }}</b-button
            >
            <b-button
                variant="danger"
                @click="deleteList"
                style="margin-left: 10px; vertical-align: bottom;"
                v-if="!loadWantedList"
                >Löschen</b-button
            >
            <b-button
                variant="primary"
                @click="print"
                style="margin-left: 10px; vertical-align: bottom;"
                :disabled="!wantedList || wantedList.length == 0"
                v-if="!loadWantedList"
            >
                <b-icon icon="printer" aria-hidden="true"></b-icon>
            </b-button>
        </p>
        <span v-if="!loadWantedList">
            <b-progress
                :value="loadPercentage"
                :max="100"
                show-progress
                animated
                v-if="loadPercentage < 100"
                style="margin-top: 10px"
            ></b-progress>
        </span>
        <div id="wantedList">
            <brick-list
                v-if="!loadWantedList"
                :bricklist="wantedList"
            ></brick-list>
        </div>
    </div>
</template>

<script>
import BrickList from './BrickList';
import { brickProcessorMixin } from '@/mixins/brickProcessorMixin';
import { brickColorMixin } from '@/mixins/brickColorMixin';
import { requestsMixin } from '@/mixins/requestsMixin';
import { brickLinkProcessorMixin } from '@/mixins/brickLinkProcessorMixin';

export default {
    data: () => ({
        isChrome: navigator.userAgent.indexOf('Chrome') != -1,
        loadWantedList: false,
        totalBricks: 0,
        pickABrickBrickCounter: 0,
        bricksAndPiecesBrickCounter: 0,
        loadPercentage: 100,
        priceLoaded: true,
        wantedList: [],
        cancelLoading: false,
        partList: null
    }),
    components: {
        BrickList,
    },
    mixins: [
        brickProcessorMixin,
        brickColorMixin,
        requestsMixin,
        brickLinkProcessorMixin,
    ],
    methods: {
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
                this.partList.date = new Date(Date.now());
                this.partList.positions = this.wantedList;
                this.$store.commit('setPartList', this.partList);
            }
            //console.log(this.loadPercentage)
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
        deleteList() {
            this.$store.commit('deletePartList', this.partList.id);
        }
    },
    beforeMount() {
        this.partList = this.$store.getters.getPartListsById(this.$route.params.id);
        this.wantedList = this.partList.positions;
        this.totalBricks = 0;
        if (this.wantedList) this.totalBricks = this.wantedList.length;
    },
    computed: {
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

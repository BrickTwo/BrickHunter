<template>
    <div>
        <b-container class="px-2" fluid="xl">
            <b-row>
                <b-col cols="7">
                    <b-container>
                        <b-row>
                            <b-col id="partListTitle">
                                <h2
                                    class="text-overflow-elipsis"
                                    id="partListH2"
                                >
                                    {{ partList.name }}
                                </h2>
                                <p class="h2 mb-2">
                                    <b-icon
                                        icon="pencil"
                                        aria-hidden="true"
                                        v-b-modal.modal-edit-name
                                        @click="editName = partList.name"
                                        style="margin-left: 10px; cursor: pointer"
                                        variant="primary"
                                    />
                                </p>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-button
                                    variant="primary"
                                    @click="loadPrices"
                                    :disabled="
                                        !wantedList ||
                                            wantedList.length == 0 ||
                                            loadPercentage < 100
                                    "
                                    v-if="!loadWantedList"
                                >
                                    {{ buttonLoadPrices }}
                                </b-button>
                                <b-button
                                    variant="danger"
                                    @click="cancel"
                                    :disabled="loadPercentage >= 100"
                                    style="margin-left: 10px;"
                                    v-if="!loadWantedList"
                                >
                                    {{ buttonCancelLoading }}
                                </b-button>
                                <b-button
                                    variant="danger"
                                    @click="deleteList"
                                    style="margin-left: 10px;"
                                    v-if="!loadWantedList"
                                >
                                    {{ buttonDelete }}
                                </b-button>
                                <b-button
                                    variant="primary"
                                    @click="print"
                                    style="margin-left: 10px;"
                                    :disabled="
                                        !wantedList || wantedList.length == 0
                                    "
                                    v-if="!loadWantedList"
                                >
                                    <b-icon icon="printer" aria-hidden="true" />
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-col>
                <b-col>
                    <p>{{ lastUpdated }}: {{ partList.date | formatDate }}</p>
                    <b-container class="bv-example-row">
                        <b-row>
                            <b-col>
                                <p>
                                    {{ pickABrick }}:
                                    {{ totalPickABrickPositions }}
                                </p>
                                <p>
                                    {{ bricksAndPieces }}:
                                    {{ totalBricksAndPiecesPositions }}
                                </p>
                                <p>{{ total }}: {{ totalPositions }}</p>
                            </b-col>
                            <b-col>
                                <p style="display: inline-block;">
                                    <b-form-checkbox
                                        v-model="partList.cart"
                                        id="checkbox-1"
                                        name="checkbox-1"
                                    >
                                        {{ shoppingCart }}
                                    </b-form-checkbox>
                                </p>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
        </b-container>

        <b-modal id="modal-edit-name" @ok="saveName" v-bind:title="wantedListName">
            <p class="my-4">
                <b-form-input v-model="editName"></b-form-input>
            </p>
        </b-modal>
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

<style scoped>
#partListTitle {
    display: inline-flex;
}
#partListH2 {
    max-width: calc(100% - 70px);
}
</style>

<script>
import BrickList from '../BrickList';
import { brickProcessorMixin } from '@/mixins/brickProcessorMixin';
import { brickColorMixin } from '@/mixins/brickColorMixin';
import { requestsMixin } from '@/mixins/requestsMixin';
import { brickLinkProcessorMixin } from '@/mixins/brickLinkProcessorMixin';

export default {
    data: () => ({
        isChrome: navigator.userAgent.indexOf('Chrome') != -1,
        loadWantedList: false,
        pickABrickBrickCounter: 0,
        bricksAndPiecesBrickCounter: 0,
        loadPercentage: 100,
        priceLoaded: true,
        wantedList: [],
        cancelLoading: false,
        partList: null,
        editName: null,
        totalPositions: 0,
        totalPickABrickPositions: 0,
        totalBricksAndPiecesPositions: 0,
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
            this.cancelLoading = false;

            for (var i = 0; i < this.wantedList.length; i++) {
                this.wantedList[i].bricksAndPieces = null;
                this.wantedList[i].pickABrick = null;
                this.wantedList[i].brickLink = null;
            }

            this.calcTotals();

            for (var i = 0; i < this.wantedList.length; i++) {
                if (this.cancelLoading) {
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
                //console.log("couldn't find brick on bricklink");
                this.pickABrickBrickCounter++;
                this.bricksAndPiecesBrickCounter++;
                this.calcLoad();
                item.bricksAndPieces = null;
            }

            if (this.cancelLoading) {
                item.bricksAndPieces = null;
                return;
            }
            if (!item.brickLink) {
                item.bricksAndPieces = null;
                return;
            }

            item = await this.prepareSearchIds(item);
            if (this.cancelLoading) {
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
            var one = 100 / this.totalPositions / 2;

            this.loadPercentage = Math.round(
                one * this.pickABrickBrickCounter +
                    one * this.bricksAndPiecesBrickCounter
            );
            if (this.loadPercentage >= 100) {
                //console.log("setWantedList", this.wantedList)
                this.partList.date = new Date(Date.now());
                this.partList.positions = this.wantedList;
                this.$store.commit('partList/setPartList', this.partList);
            }
            this.calcTotals();
            //console.log(this.loadPercentage)
        },
        print() {
            //console.log("print")
            this.$htmlToPaper('wantedList');
        },
        cancel() {
            this.cancelLoading = true;
            this.pickABrickBrickCounter = this.totalPositions;
            this.bricksAndPiecesBrickCounter = this.totalPositions;
            this.calcLoad();
        },
        deleteList() {
            this.$store.commit('partList/deletePartList', this.partList.id);
            this.$router.push('/partLists').catch(() => {});
        },
        saveName(bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault();

            if (!this.editName) {
                return;
            }

            this.partList.name = this.editName;
            //console.log(this.partList.name, this.editName);
            this.$store.commit('partList/setPartList', this.partList);

            this.$nextTick(() => {
                this.$bvModal.hide('modal-edit-name');
            });
        },
        calcTotals() {
            if (this.wantedList) {
                this.totalPositions = this.wantedList.length;
                this.totalPickABrickPositions = this.wantedList.filter(
                    (position) => position.pickABrick != null
                ).length;
                this.totalBricksAndPiecesPositions = this.wantedList.filter(
                    (position) => position.bricksAndPieces != null
                ).length;
            }
        },
    },
    watch: {
        'partList.cart': function(val, oldVal) {
            this.$store.commit('partList/setPartList', this.partList);
        },
    },
    beforeMount() {
        this.partList = this.$store.getters['partList/getPartListsById'](
            this.$route.params.id
        );
        this.wantedList = this.partList.positions;
        this.calcTotals();
    },
    computed: {
        pickABrick() {
            return browser.i18n.getMessage('pickABrick');
        },
        bricksAndPieces() {
            return browser.i18n.getMessage('bricksAndPieces');
        },
        total() {
            return browser.i18n.getMessage('shopping_total');
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
        buttonDelete() {
            return browser.i18n.getMessage('wantedList_buttonDelete');
        },
        lastUpdated() {
            return browser.i18n.getMessage('wantedList_lastUpdated');
        },
        shoppingCart() {
            return browser.i18n.getMessage('wantedList_shoppingCart');
        },
        wantedListName() {
            return browser.i18n.getMessage('wantedList_name');
        },        
    },
};
</script>

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
                            <b-col v-if="!selectedItems.length">
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
                                    @click="$bvModal.show('askDeletePartList')"
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
                            <b-col v-if="selectedItems.length">
                                <b-button
                                    variant="danger"
                                    @click="$bvModal.show('askDeletePositions')"
                                >
                                    {{ labelRemovePositions }}
                                </b-button>
                                <b-button
                                    variant="primary"
                                    style="margin-left: 10px;"
                                    @click="splitPartList()"
                                >
                                    {{ labelSplitPartList }}
                                </b-button>
                                <b-button
                                    variant="primary"
                                    style="margin-left: 10px;"
                                    @click="$bvModal.show('copyToPartList')"
                                >
                                    {{ labelCopyToPartList }}
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

        <b-modal
            id="modal-edit-name"
            @ok="saveName"
            v-bind:title="wantedListName"
        >
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
                :edit="true"
                :isBusy="!showSort"
                @itemDeleted="onItemDeleted"
                @reloadPickABrickPosition="onReloadPickABrickPosition"
                @reloadBricksAndPiecesPosition="onReloadBricksAndPiecesPosition"
                @selectionChanged="onSelectionChange"
            ></brick-list>
        </div>

        <div id="wantedListPrint" style="display: none">
            <brick-list
                v-if="!loadWantedList"
                :bricklist="wantedList"
                :edit="false"
            ></brick-list>
        </div>
        <b-modal
            id="askDeletePartList"
            :title="labelAskDeletePartListHeader"
            :header-bg-variant="headerBgVariant"
            :header-text-variant="headerTextVariant"
            centered
            @ok="deleteList()"
        >
            <p class="my-4">
                {{ labelAskDeletePartListBody }}
            </p>
            <template #modal-footer="{ cancel, ok }">
                <b-button @click="cancel()">
                    {{ labelAskNo }}
                </b-button>
                <!-- Button with custom close trigger value -->
                <b-button @click="ok()">
                    {{ labelAskYes }}
                </b-button>
            </template>
        </b-modal>
        <b-modal
            id="askDeletePositions"
            :title="labelAskDeletePositionHeader"
            :header-bg-variant="headerBgVariant"
            :header-text-variant="headerTextVariant"
            centered
            @ok="removePositions()"
        >
            <p class="my-4">
                {{ labelAskDeletePositionBody }}
            </p>
            <template #modal-footer="{ cancel, ok }">
                <b-button @click="cancel()">
                    {{ labelAskNo }}
                </b-button>
                <!-- Button with custom close trigger value -->
                <b-button @click="ok()">
                    {{ labelAskYes }}
                </b-button>
            </template>
        </b-modal>
        <b-modal
            id="copyToPartList"
            :title="labelCopyToPartListHeader"
            :header-bg-variant="headerBgVariant"
            :header-text-variant="headerTextVariant"
            centered
            @ok="copyToPartList()"
        >
            <p class="my-4">
                {{ labelCopyToPartListBody }}
            </p>
            <p class="my-4">
                <b-form-select
                    v-model="selectedPartList"
                    :options="copyToPartLists"
                />
            </p>
            <template #modal-footer="{ cancel, ok }">
                <b-button @click="cancel()">
                    {{ buttonCancelLoading }}
                </b-button>
                <!-- Button with custom close trigger value -->
                <b-button @click="ok()">
                    {{ labelCopyToPartList }}
                </b-button>
            </template>
        </b-modal>
    </div>
</template>

<style scoped>
#partListTitle {
    display: inline-flex;
}
#partListH2 {
    max-width: calc(100% - 70px);
}
.row {
    margin-left: 0;
}
.container {
    margin-left: 0;
    padding-left: 0;
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
        showSort: true,
        selectedItems: [],
        headerBgVariant: 'dark',
        headerTextVariant: 'light',
        selectedPartList: null,
        copyToPartLists: [],
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
                if (this.wantedList[i].source == 'brickLink') {
                    this.wantedList[i].brickLink.strAltNo = null;
                    this.wantedList[i].brickLink.mapPCCs = null;
                }
            }

            this.calcTotals();

            for (var i = 0; i < this.wantedList.length; i++) {
                if (this.cancelLoading) {
                    return;
                }
                var item = this.wantedList[i];
                await this.sleep(200); //200ms timout to prevent to be blocked on the website
                this.loadPrice(item);
            }
        },
        async loadPrice(item) {
            this.showSort = false;

            item.bricksAndPieces = { isLoading: true };
            if (item.source == 'brickLink') {
                var brickLinkHtml = await this.getBricklink(item.designId);
                if (brickLinkHtml.status < 200 || brickLinkHtml.status >= 300) {
                    this.pickABrickBrickCounter++;
                    this.bricksAndPiecesBrickCounter++;
                    this.calcLoad();
                    item.bricksAndPieces = { error: brickLinkHtml.status };
                    return;
                }
                var returnObject = await this.returnModelsObject(brickLinkHtml);
                item.brickLink.strAltNo = returnObject.strAltNo;
                item.brickLink.mapPCCs = returnObject.mapPCCs;
            }

            if (this.cancelLoading) {
                item.bricksAndPieces = null;
                return;
            }
            if (item.source == 'brickLink' && !item.brickLink) {
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
            var one = 100 / this.totalPositions / 2;

            this.loadPercentage = Math.round(
                one * this.pickABrickBrickCounter +
                    one * this.bricksAndPiecesBrickCounter
            );
            if (this.loadPercentage >= 100) {
                this.partList.date = new Date(Date.now());
                this.partList.positions = this.wantedList;
                this.$store.commit('partList/setPartList', this.partList);
                this.showSort = true;
            }
            this.calcTotals();
        },
        print() {
            this.$htmlToPaper('wantedListPrint');
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
        onItemDeleted(item) {
            var index = this.wantedList.findIndex((pos) => {
                return pos.rowNumber == item.rowNumber;
            });

            this.wantedList.splice(index, 1);
            this.totalPositions = this.wantedList.length;

            this.partList.positions = this.wantedList;
        },
        async onReloadPickABrickPosition(item) {
            item.pickABrick = { isLoading: true };
            if (item.source == 'brickLink') {
                var brickLinkHtml = await this.getBricklink(item.designId);
                if (brickLinkHtml.status < 200 || brickLinkHtml.status >= 300) {
                    item.pickABrick = { error: brickLinkHtml.status };
                    return;
                }
                var returnObject = await this.returnModelsObject(brickLinkHtml);
                item.brickLink.strAltNo = returnObject.strAltNo;
                item.brickLink.mapPCCs = returnObject.mapPCCs;
            }

            if (item.source == 'brickLink' && !item.brickLink) {
                item.bricksAndPieces = null;
                return;
            }

            item = await this.prepareSearchIds(item);
            item = await this.loadPickABrick(item, true);
        },
        async onReloadBricksAndPiecesPosition(item) {
            item.bricksAndPieces = { isLoading: true };
            if (item.source == 'brickLink') {
                var brickLinkHtml = await this.getBricklink(item.designId);
                if (brickLinkHtml.status < 200 || brickLinkHtml.status >= 300) {
                    item.bricksAndPieces = { error: brickLinkHtml.status };
                    return;
                }
                var returnObject = await this.returnModelsObject(brickLinkHtml);
                item.brickLink.strAltNo = returnObject.strAltNo;
                item.brickLink.mapPCCs = returnObject.mapPCCs;
            }

            if (item.source == 'brickLink' && !item.brickLink) {
                item.bricksAndPieces = null;
                return;
            }

            item = await this.prepareSearchIds(item);
            item = await this.loadBricksAndPieces(item, true);
        },
        removePositions() {
            this.selectedItems.map((item) => {
                    var index = this.wantedList.findIndex(f => {
                        return f.rowNumber == item.rowNumber
                    });
                    if (index>=0) {
                        this.wantedList.splice(index, 1);
                    }
                });
            this.totalPositions = this.wantedList.length;
        },
        onSelectionChange(selecteItems) {
            this.selectedItems = selecteItems;
        },
        splitPartList() {
            var newPartList = {
                id: this.generateUUID(),
                name: this.partList.name + ' 2',
                cart: this.partList.cart,
                date: this.partList.date,
                source: this.partList.source,
                positions: [...this.selectedItems],
            };

            this.$store.commit('partList/setPartList', newPartList);

            this.removePositions();
        },
        generateUUID() {
            // Public Domain/MIT
            var d = new Date().getTime();
            if (
                typeof performance !== 'undefined' &&
                typeof performance.now === 'function'
            ) {
                d += performance.now(); //use high-precision timer if available
            }
            var newGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                /[xy]/g,
                function(c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
                }
            );

            return newGuid;
        },
        copyToPartList() {
            var destinationPartList = this.$store.getters[
                'partList/getPartListsById'
            ](this.selectedPartList);
            this.selectedPartList = null;
            if (!destinationPartList) return;

            this.selectedItems.map((item) => {
                var foundItem = null;
                if (item.source == 'lego' && item.itemNumber) {
                    foundItem = destinationPartList.positions.find((f) => {
                        return f.itemNumber == item.itemNumber;
                    });
                    console.log(foundItem)
                } else if (item.source == 'brickLink') {
                    foundItem = destinationPartList.positions.find((f) => {
                        if (item.color.id == 1) {
                            return (
                                f.designId == item.designId &&
                                f.color.legoName == item.color.legoName
                            );
                        } else {
                            return (
                                f.designId == item.designId &&
                                f.color.brickLinkId == item.color.brickLinkId
                            );
                        }
                    });
                }
                if (foundItem) {
                    foundItem.qty = { ...foundItem.qty };
                    foundItem.qty.min = parseInt(foundItem.qty.min);
                    foundItem.qty.have = parseInt(foundItem.qty.have);
                    foundItem.qty.order = parseInt(foundItem.qty.order);
                    foundItem.qty.min += parseInt(item.qty.min);
                    foundItem.qty.have += parseInt(item.qty.have);
                    foundItem.qty.order += parseInt(item.qty.order);
                    foundItem.qty.balance +=
                        foundItem.qty.min - foundItem.qty.have;
                } else {
                    destinationPartList.positions.push(
                        JSON.parse(JSON.stringify(item))
                    ); // push a copy ot the item
                }
            });

            this.$store.commit('partList/setPartList', destinationPartList);
        },
    },
    watch: {
        partList: {
            handler(val, oldVal) {
                this.$store.commit('partList/setPartList', this.partList);
            },
            deep: true,
        },
    },
    beforeMount() {
        this.partList = this.$store.getters['partList/getPartListsById'](
            this.$route.params.id
        );
        this.wantedList = this.partList.positions;
        this.calcTotals();

        var partListBySource = this.$store.getters[
            'partList/getPartListsBySource'
        ](this.partList.source);

        this.copyToPartLists = partListBySource
            .filter((list) => {
                return list.id != this.partList.id;
            })
            .map((list) => {
                return { value: list.id, text: list.name };
            })
            .sort(function(a, b) {
                if (a.text.toUpperCase() > b.text.toUpperCase()) {
                    return 1;
                } else {
                    return -1;
                }
            });
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
        labelRemoveSelection() {
            return browser.i18n.getMessage('wantedList_removeSelection');
        },
        labelRemovePositions() {
            return browser.i18n.getMessage('wantedList_removePositions');
        },
        labelAskDeletePositionHeader() {
            return browser.i18n.getMessage(
                'wantedList_askDeletePositionHeader'
            );
        },
        labelAskDeletePositionBody() {
            return browser.i18n.getMessage('wantedList_askDeletePositionBody');
        },
        labelAskYes() {
            return browser.i18n.getMessage('wantedList_askYes');
        },
        labelAskNo() {
            return browser.i18n.getMessage('wantedList_askNo');
        },
        labelAskDeletePartListHeader() {
            return browser.i18n.getMessage(
                'wantedList_askDeletePartListHeader'
            );
        },
        labelAskDeletePartListBody() {
            return browser.i18n.getMessage('wantedList_askDeletePartListBody');
        },
        labelSplitPartList() {
            return browser.i18n.getMessage('wantedList_splitPartList');
        },
        labelCopyToPartList() {
            return browser.i18n.getMessage('wantedList_copy');
        },
        labelCopyToPartListHeader() {
            return browser.i18n.getMessage('wantedList_copyHeader');
        },
        labelCopyToPartListBody() {
            return browser.i18n.getMessage('wantedList_copyBody');
        },
    },
};
</script>

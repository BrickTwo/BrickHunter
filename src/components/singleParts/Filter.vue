<template>
    <b-container fluid="xl" class="bricksContainer">
        <b-row class="p-1">
            <b-col class="mr-1">
                <b-input-group variant="primary">
                    <b-input-group-prepend is-text>
                        <b-icon icon="search" />
                    </b-input-group-prepend>
                    <b-form-input
                        v-model="keyword"
                        @keyup.enter="loadBricks(true)"
                        type="search"
                        debounce="500"
                        :placeholder="labelFindPartsByKeyword"
                    >
                    </b-form-input>
                </b-input-group>
            </b-col>
            <b-col class="ml-1">
                <SortFilter
                    @selectSortBy="selectSortBy"
                    @selectSortDirection="selectSortDirection"
                />
            </b-col>
        </b-row>
        <b-row>
            <ColorPicker @selectColor="selectColor" :colorList="colorList" />
        </b-row>
        <b-row class="p-1">
            <b-col>
                <b-form-select
                    style="width:75px"
                    v-model="perPage"
                    :options="perPageOptions"
                />
            </b-col>
            <b-col class="center">
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    aria-controls="my-table"
                    last-number
                />
            </b-col>
            <b-col class="text-right">
                <b-button
                    class="button"
                    variant="primary"
                    @click="showAs = 'grid'"
                >
                    <b-icon icon="grid" aria-hidden="true" />
                </b-button>
                <b-button
                    class="button"
                    variant="primary"
                    @click="showAs = 'list'"
                >
                    <b-icon icon="list-stars" aria-hidden="true" />
                </b-button>
            </b-col>
        </b-row>
        <b-overlay
            id="overlay-background"
            :show="listUpdate"
            rounded="sm"
            style="margin: 0 -15px; padding: 0 15px;"
        >
            <b-row
                v-if="showAs == 'grid'"
                cols="12"
                style="min-height: 50px;"
                :key="componentKey"
            >
                <BrickGrid
                    v-for="brick in search.bricks"
                    :key="brick.itemNumber"
                    :brick="brick"
                    @addToPartList="addToPartList"
                    @setKeyword="setKeyword"
                    @setColor="setColor"
                    @setOrderQuantity="setOrderQuantity"
                />
            </b-row>
            <b-row v-if="showAs == 'list'" cols="12" :key="componentKey">
                <BrickList
                    v-for="brick in search.bricks"
                    :key="brick.itemNumber"
                    :brick="brick"
                    @addToPartList="addToPartList"
                    @setKeyword="setKeyword"
                    @setColor="setColor"
                    @setOrderQuantity="setOrderQuantity"
                />
            </b-row>
        </b-overlay>
        <b-row class="p-1">
            <b-col>
                <b-form-select
                    style="width:75px"
                    v-model="perPage"
                    :options="perPageOptions"
                />
            </b-col>
            <b-col class="center">
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    aria-controls="my-table"
                    last-number
                />
            </b-col>
            <b-col class="text-right">
                <b-button
                    class="button"
                    variant="primary"
                    @click="showAs = 'grid'"
                >
                    <b-icon icon="grid" aria-hidden="true" />
                </b-button>
                <b-button
                    class="button"
                    variant="primary"
                    @click="showAs = 'list'"
                >
                    <b-icon icon="list-stars" aria-hidden="true" />
                </b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { brickProcessorMixin } from '@/mixins/brickProcessorMixin';
import { brickColorMixin } from '@/mixins/brickColorMixin';
import BrickGrid from './BrickGrid';
import BrickList from './BrickList';
import ColorPicker from './filter/ColorPicker';
import SortFilter from './filter/Sort';
import { bus } from '@/components/BrickHunter';
import apiBrickTwo from '@/utility/api/bricktwo.js';

export default {
    props: {
        partListId: {
            type: String,
        },
        categoryId: {
            type: Number,
        },
    },
    data: () => ({
        perPage: 24,
        perPageOptions: [
            { value: 8, text: '8' },
            { value: 24, text: '24' },
            { value: 48, text: '48' },
            { value: 100, text: '100' },
        ],
        currentPage: 1,
        totalRows: 5000,
        group: false,
        keyword: null,
        selectedSort: 'DESCRIPTION',
        sortDirection: 'ASC',
        selectedColor: 'all',
        search: [],
        showAs: 'grid',
        listUpdate: true,
        componentKey: 0,
        colorList: [],
    }),
    components: {
        BrickGrid,
        BrickList,
        ColorPicker,
        SortFilter,
    },
    mixins: [brickProcessorMixin, brickColorMixin],
    methods: {
        setOrderQuantity(item) {
            var partList = this.loadPartList();

            var foundPart = partList.positions.find((pos) => {
                return pos.itemNumber == item.itemNumber;
            });

            if (foundPart) {
                foundPart.qty.min = item.order;
                foundPart.qty.order = item.order;

                if (item.order == 0) {
                    partList.positions = partList.positions.filter(
                        (pos) => pos.itemNumber != item.itemNumber
                    );
                }
                this.$store.commit('partList/setPartList', partList);
                return;
            }
        },
        addToPartList(item) {
            var partList = this.loadPartList();

            var foundPart = partList.positions.find(
                (pos) => pos.itemNumber == item.itemNumber
            );

            if (foundPart) {
                foundPart.qty.min = foundPart.qty.min + 1;
                foundPart.qty.order = foundPart.qty.min;
                this.$store.commit('partList/setPartList', partList);
                return;
            }

            if (this.$store.state.partList.totalPositions >= 2000) {
                this.$bvToast.toast(
                    this.labelErrorImportBrickLinkTextToManyPositions,
                    {
                        title: this.labelImportBrickLinkTitle,
                        autoHideDelay: 5000,
                        variant: 'danger',
                    }
                );
                return;
            }

            var part = {};
            part.source = 'lego';
            part.designId = item.designId;
            part.itemNumber = item.itemNumber;
            part.color = this.findLegoColor(item.colorFamily, this.COLOR);
            part.searchids = [item.designId];
            part.qty = {
                min: 1,
                have: 0,
                balance: 1,
                order: 1,
            };
            if (item.itemQuantity) {
                part.qty.min = item.itemQuantity;
            }
            if (item.itemQuantity) {
                part.qty.balance = item.itemQuantity;
            }
            part.image = {
                source: 'lego',
                rsc: item.imageUrl,
            };
            part.bricksAndPieces = null;
            part.pickABrick = null;
            part.brickLink = null;

            //partList.positions.push(part);
            //partList.date = new Date(0, 0, 0, 0, 0, 0, 0);
            this.$store.commit('partList/addToPartList', {
                id: this.partListId,
                part: part,
            });
        },
        loadPartList() {
            if (this.partListId) {
                return this.$store.getters['partList/getPartListsById'](
                    this.partListId
                );
            }

            var newPartList = {
                id: this.generateUUID(),
                name: this.labelSinglePartList,
                cart: true,
                date: new Date(0, 0, 0, 0, 0, 0, 0),
                source: 'singleParts',
                positions: [],
            };

            this.$store.commit('partList/setPartList', newPartList);

            bus.$emit('newSinglePartList', true);

            return newPartList;
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
        async loadBricks(resetPage) {
            this.$scrollTo('.bricksContainer', 100, {
                container: '.bricksContainer',
            });
            this.listUpdate = true;
            if (resetPage) {
                this.currentPage = 1;
            }

            /*this.$router
                .push(
                    `/import/singleParts/${this.categoryId}/${this.selectedSort}/${this.sortDirection}/${this.keyword}/${this.selectedColor}/${this.currentPage}`
                )
                .catch(() => {});*/

            this.search = await apiBrickTwo.getBricksAsync(
                this.currentPage,
                this.perPage,
                this.$store.state.country,
                this.categoryId,
                this.selectedColor,
                this.keyword,
                this.selectedSort,
                this.sortDirection
            );

            if (!this.search) {
                this.totalRows = 0;
                this.currentPage = 1;
                this.listUpdate = false;
                this.$store.commit('singleParts/setCategoriesFiltered', null);
                bus.$emit('CategoriesFiltered', null);
                return;
            }

            this.search.bricks.map((brick) => {
                brick.key = this.componentKey++;
            });

            this.$store.commit(
                'singleParts/setCategoriesFiltered',
                this.search.categories
            );
            bus.$emit('CategoriesFiltered', this.search.categories);

            this.colorList = this.search.colors;
            this.totalRows = this.search.page.total;

            this.selectPart();

            this.loadPrices();
            this.listUpdate = false;
        },
        selectPart() {
            var selectedPartList = this.loadPartList();
            if (selectedPartList) {
                if (!this.search || !this.search.bricks) return;
                this.search.bricks.map((brick) => {
                    var foundPos = selectedPartList.positions.find(
                        (pos) =>
                            pos.designId == brick.designId &&
                            pos.color.bricksAndPiecesName == brick.colorFamily
                    );
                    if (foundPos) {
                        brick.order = foundPos.qty.min;
                    } else {
                        brick.order = 0;
                    }
                });
            }

            this.componentKey++;
        },
        async loadPrices() {
            var designIds = [];

            this.search.bricks.forEach((brick) => {
                if (
                    !designIds.find((d) => d == brick.designId) &&
                    brick.update
                ) {
                    designIds.push(brick.designId);
                }
            });

            for (var i = 0; i < designIds.length; i++) {
                var designId = designIds[i];
                await this.sleep(200); //200ms timout to prevent to be blocked on the website

                var response = await browser.runtime.sendMessage({
                    service: 'bricksAndPieces',
                    action: 'findBrick',
                    designId: designId,
                });

                if (!response) {
                    var found = this.search.bricks.filter(
                        (b) => b.designId == designId
                    );

                    found.map((brick) => {
                        brick.update = false;
                    });
                } else {
                    response.bricks.map((brick) => {
                        var found = this.search.bricks.find(
                            (b) =>
                                b.itemNumber == brick.itemNumber ||
                                b.alternativeItemNumbers.includes(
                                    `|${brick.itemNumber}|`
                                )
                        );

                        if (found) {
                            //found.itemNumber = brick.itemNumber;
                            found.color = brick.color;
                            found.colorFamily = brick.colorFamily;
                            found.description = brick.description;
                            found.designId = brick.designId;
                            found.imageUrl = brick.imageUrl;
                            if (brick.isAvailable) {
                                found.isAvailable = 1;
                            } else {
                                found.isAvailable = 0;
                            }
                            if (brick.isSoldOut) {
                                found.isSoldOut = 1;
                            } else {
                                found.isSoldOut = 0;
                            }
                            found.priceAmount = brick.price.amount.toFixed(2);
                            found.priceCurrency = brick.price.currency;
                            found.maxAmount = brick.maxAmount;
                            found.update = false;
                            if (
                                found.maxAmount > 0 &&
                                found.isAvailable &&
                                !found.isSoldOut
                            ) {
                                found.lastSeen = new Date(
                                    Date.now()
                                ).toUTCString();
                            }
                            found.lastUpdateCountry = new Date(
                                Date.now()
                            ).toUTCString();
                        }
                    });

                    var found = this.search.bricks.filter(
                        (b) => b.designId == designId
                    );

                    found.map((brick) => {
                        brick.update = false;
                    });

                    apiBrickTwo.sendPrices(this.prepareSendPrice(response.bricks));
                }
            }
        },
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        selectSortBy(value) {
            this.selectedSort = value;
            this.loadBricks(true);
        },
        selectSortDirection() {
            if (this.sortDirection == 'ASC') {
                this.sortDirection = 'DESC';
            } else {
                this.sortDirection = 'ASC';
            }

            this.loadBricks(false);
        },
        selectColor(value) {
            this.selectedColor = value;
            this.loadBricks(true);
        },
        setKeyword(value) {
            this.selectedColor = 'all';
            this.keyword = value;
        },
        setColor(value) {
            this.keyword = '';
            this.selectedColor = value;
            this.loadBricks(true);
        },
    },
    watch: {
        categoryId: function() {
            this.loadBricks(true);
        },
        /*selectedColor: function() {
            this.loadBricks(true);
        },*/
        currentPage: function() {
            this.loadBricks(false);
        },
        perPage: function() {
            this.loadBricks(true);
        },
        keyword: function() {
            this.loadBricks(true);
        },
        partListId: function() {
            this.selectPart();
        },
    },
    mounted() {
        this.loadBricks(true);
    },
    computed: {
        labelFindPartsByKeyword() {
            return browser.i18n.getMessage('import_sp_findPartsByKeyword');
        },
        labelDescription() {
            return browser.i18n.getMessage('import_sp_description');
        },
        labelElement() {
            return browser.i18n.getMessage('import_sp_element');
        },
        labelDesignNumber() {
            return browser.i18n.getMessage('import_sp_designNumber');
        },
        labelPrice() {
            return browser.i18n.getMessage('import_sp_price');
        },
        labelMaxAmount() {
            return browser.i18n.getMessage('import_sp_maxAmount');
        },
        labelFirstAvailability() {
            return browser.i18n.getMessage('import_sp_firstAvailability');
        },
        labelSinglePartList() {
            return browser.i18n.getMessage('import_sp_singlePartList');
        },
        labelErrorImportBrickLinkTextToManyPositions() {
            return browser.i18n.getMessage(
                'import_errorImportBrickLinkTextToManyPositions'
            );
        },
    },
};
</script>

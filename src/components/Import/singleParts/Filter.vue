<template>
    <b-container fluid="xl">
        <b-row>
            <b-col cols="6"
                ><b-form-input
                    v-model="keyword"
                    @keyup.enter="loadBricks(true)"
                    placeholder="Find parts by keyword"
                ></b-form-input
            ></b-col>
            <b-col cols="1" class="text-right">
                <b-button class="button" variant="primary" @click="sort()">
                    <b-icon :icon="sortIcon" aria-hidden="true" />
                </b-button>
            </b-col>
            <b-col cols="5">
                <b-form-select v-model="selectedSort" :options="sortOptions" />
            </b-col>
        </b-row>
        <b-row>
            <b-col offset="7" cols="5"
                ><b-form-select
                    v-model="selectedColor"
                    :options="colorOptions"
                ></b-form-select
            ></b-col>
        </b-row>
        <b-row>
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
        <b-row v-if="showAs == 'grid'" cols="12">
            <BrickGrid
                v-for="brick in search.bricks"
                :key="brick.itemNumber"
                :brick="brick"
                @addToPartList="addToPartList"
            />
        </b-row>
        <b-row v-if="showAs == 'list'" cols="12">
            <BrickList
                v-for="brick in search.bricks"
                :key="brick.itemNumber"
                :brick="brick"
                @addToPartList="addToPartList"
            />
        </b-row>
        <b-row>
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
import { requestsMixin } from '@/mixins/requestsMixin';
import { brickProcessorMixin } from '@/mixins/brickProcessorMixin';
import { brickColorMixin } from '@/mixins/brickColorMixin';
import BrickGrid from './BrickGrid';
import BrickList from './BrickList';
import { bus } from '@/components/BrickHunter';

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
            { value: 24, text: '24' },
            { value: 48, text: '48' },
            { value: 100, text: '100' },
        ],
        currentPage: 1,
        totalRows: 5000,
        group: false,
        keyword: null,
        sortOptions: [
            { value: 'DESCRIPTION', text: 'Beschreibung' },
            { value: 'ITEMNUMBER', text: 'Element' },
            { value: 'DESIGNID', text: 'Designnummer' },
            { value: 'PRICEAMOUNT', text: 'Preis' },
            { value: 'MAXAMOUNT', text: 'Max Bestellmenge' },
            { value: 'FIRSTSEEN', text: 'Zuerst Verfügbar' },
            { value: 'LASTSEEN', text: 'Zuletzt Verfügbar' },
            { value: 'LASTUPDATECOUNTRY', text: 'Letzte Aktualisierung' },
        ],
        selectedSort: 'DESCRIPTION',
        sortDirection: 'ASC',
        sortIcon: 'sort-alpha-down',
        colorOptions: [{ value: 'all', text: 'Alle Farben' }],
        selectedColor: 'all',
        newOptions: [{ value: 'all', text: 'Neu hinzugekommen - ' }],
        selectedNew: 'all',
        search: [],
        showAs: 'grid',
    }),
    components: {
        BrickGrid,
        BrickList,
    },
    mixins: [requestsMixin, brickProcessorMixin, brickColorMixin],
    methods: {
        addToPartList(item) {
            var partList = this.loadPartList();

            var foundPart = partList.positions.find(
                (pos) => pos.itemid == item.itemNumber
            );
            if (foundPart) {
                foundPart.qty.min = foundPart.qty.min + 1;
                this.$store.commit('partList/setPartList', partList);
                return;
            }

            var part = {};
            part.source = 'lego';
            part.itemid = item.itemNumber;
            part.searchids = [part.itemid];
            part.color = this.findLegoColor(item.colorFamily, this.COLOR);
            part.qty = {
                min: 1,
                have: 0,
                balance: 0,
                order: 0,
            };
            if (item.itemQuantity) {
                part.qty.min = item.itemQuantity;
            }
            if (item.itemQuantity) {
                part.qty.balance = item.itemQuantity;
            }
            part.image = {
                source: 'lego',
                itemId: `${part.itemid}`,
            };
            part.bricksAndPieces = null;
            part.pickABrick = null;
            part.brickLink = null;

            partList.positions.push(part);
            partList.date = new Date(0, 0, 0, 0, 0, 0, 0);
            this.$store.commit('partList/setPartList', partList);
        },
        loadPartList() {
            if (this.partListId) {
                return this.$store.getters['partList/getPartListsById'](
                    this.partListId
                );
            }

            var newPartList = {
                id: this.generateUUID(),
                name: 'Einzelteilliste',
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
            if (resetPage) {
                this.currentPage = 1;
            }

            this.search = await this.getBricksAsync(
                this.currentPage,
                this.perPage,
                this.categoryId,
                this.selectedColor,
                this.keyword,
                this.selectedSort,
                this.sortDirection
            );

            this.totalRows = this.search.page.total;

            this.loadPrices();
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
                    contentScriptQuery: 'getBricksAndPieces',
                    itemId: designId,
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
                            (b) => b.itemNumber == brick.itemNumber
                        );

                        if (found) {
                            found.itemNumber = brick.itemNumber;
                            found.color = brick.color;
                            found.colorFamily = brick.colorFamily;
                            found.description = brick.description;
                            found.designId = brick.designId;
                            found.imageUrl = brick.imageUrl;
                            if (found.country == this.$store.state.country) {
                                found.priceAmount = brick.price.amount;
                                found.priceCurrency = brick.price.currency;
                            } else {
                                found.localPrice.priceAmount =
                                    brick.price.amount;
                                found.localPrice.priceCurrency =
                                    brick.price.currency;
                            }

                            found.maxAmount = brick.maxAmount;
                            found.update = false;
                        }
                    });

                    this.sendPrices(this.prepareSendPrice(response.bricks));
                }
            }
        },
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        async fillColors() {
            var colors = await this.getColorsAsync();

            colors.forEach((item) => {
                var color = {
                    value: item.id,
                    text: item.brickLinkName,
                };

                this.colorOptions.push(color);
            });
        },
        sort() {
            if (this.sortDirection == 'ASC') {
                this.sortDirection = 'DESC';
                this.sortIcon = 'sort-alpha-up';
            } else {
                this.sortDirection = 'ASC';
                this.sortIcon = 'sort-alpha-down';
            }

            this.loadBricks(false);
        },
    },
    watch: {
        categoryId: function() {
            this.loadBricks(true);
        },
        selectedColor: function() {
            this.loadBricks(true);
        },
        currentPage: function() {
            this.loadBricks(false);
        },
        perPage: function() {
            this.loadBricks(true);
        },
        selectedSort: function() {
            this.loadBricks(true);
        },
    },
    async beforeMount() {
        this.loadBricks(true);
        this.fillColors();

        if (this.$store.state.mode == 'standalone') {
            this.perPageOptions.unshift({ value: 8, text: '8' });
        }
    },
};
</script>

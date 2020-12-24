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
                <b-input-group>
                    <b-input-group-prepend is-text>
                        <b-icon :icon="sortIcon" @click="sort()" />
                    </b-input-group-prepend>
                    <b-form-select
                        v-model="selectedSort"
                        :options="sortOptions"
                    />
                </b-input-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <div class="w-100 h-100 p-1">
                    <b-button
                        id="dropdown-left"
                        class="w-100 h-100"
                        style="border: 0"
                        @click="selectColor('all')"
                        >{{ labelAllColor }}</b-button
                    >
                </div>
            </b-col>
            <b-col>
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    :text="labelTransColor"
                    variant="white"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorTrans"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col>
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="black"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorBlack"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col>
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="brown"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorBrown"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col>
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="red"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorRed"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col>
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="orange"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorOrange"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col>
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="yellow"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorYellow"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col>
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="green"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorGreen"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col>
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="blue"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorBlue"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col>
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="purple"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorPurple"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
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

<style lang="scss">
@import '../../../../node_modules/bootstrap/scss/bootstrap';
.btn-grey {
    background-color: $gray-300;
}
.btn-white {
    background-color: $light;
}
.btn-black {
    background-color: $dark;
}
.btn-brown {
    background-color: #7f1e06;
}
.btn-red {
    background-color: $red;
}
.btn-orange {
    background-color: $orange;
}
.btn-yellow {
    background-color: $yellow;
}
.btn-green {
    background-color: $green;
}
.btn-blue {
    background-color: $blue;
}
.btn-purple {
    background-color: $purple;
}
</style>

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
            {
                value: 'DESCRIPTION',
                text: browser.i18n.getMessage('import_sp_description'),
            },
            {
                value: 'ITEMNUMBER',
                text: browser.i18n.getMessage('import_sp_element'),
            },
            {
                value: 'DESIGNID',
                text: browser.i18n.getMessage('import_sp_designNumber'),
            },
            {
                value: 'PRICEAMOUNT',
                text: browser.i18n.getMessage('import_sp_price'),
            },
            {
                value: 'MAXAMOUNT',
                text: browser.i18n.getMessage('import_sp_maxAmount'),
            },
            {
                value: 'FIRSTSEEN',
                text: browser.i18n.getMessage('import_sp_firstAvailability'),
            },
            //{ value: 'LASTSEEN', text: 'Zuletzt Verfügbar' },
            //{ value: 'LASTUPDATECOUNTRY', text: 'Letzte Aktualisierung' },
        ],
        selectedSort: 'DESCRIPTION',
        sortDirection: 'ASC',
        sortIcon: 'sort-alpha-down',
        selectedColor: 'all',
        search: [],
        showAs: 'grid',
        colorTrans: [],
        colorBlack: [],
        colorBrown: [],
        colorRed: [],
        colorOrange: [],
        colorYellow: [],
        colorGreen: [],
        colorBlue: [],
        colorPurple: [],
        listUpdate: true,
        componentKey: 0,
    }),
    components: {
        BrickGrid,
        BrickList,
    },
    mixins: [requestsMixin, brickProcessorMixin, brickColorMixin],
    methods: {
        setOrderQuantity(item) {
            var partList = this.loadPartList();

            var foundPart = partList.positions.find(
                (pos) => pos.itemid == item.itemNumber
            );
            if (foundPart) {
                foundPart.qty.min = item.order;
                foundPart.qty.order = item.order;

                if (item.order == 0) {
                    partList.positions = partList.positions.filter(
                        (pos) => pos.itemid != item.itemNumber
                    );
                }
                this.$store.commit('partList/setPartList', partList);
                return;
            }
        },
        addToPartList(item) {
            var partList = this.loadPartList();

            var foundPart = partList.positions.find(
                (pos) => pos.itemid == item.itemNumber
            );
            if (foundPart) {
                foundPart.qty.min = foundPart.qty.min + 1;
                foundPart.qty.order = foundPart.qty.min;
                this.$store.commit('partList/setPartList', partList);
                return;
            }

            var part = {};
            part.source = 'lego';
            part.itemid = item.itemNumber;
            part.searchids = [item.designId];
            part.color = this.findLegoColor(item.colorFamily, this.COLOR);
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

            this.search = await this.getBricksAsync(
                this.currentPage,
                this.perPage,
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
                        (pos) => pos.itemid == brick.itemNumber
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

                    this.sendPrices(this.prepareSendPrice(response.bricks));
                }
            }
        },
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        async fillColors() {
            var colors = await this.getColorsAsync();

            this.colorTrans = colors.filter((color) =>
                color.group.find((group) => group === 'Trans')
            );
            this.colorBlack = colors.filter((color) =>
                color.group.find((group) => group === 'Black')
            );
            this.colorBrown = colors.filter((color) =>
                color.group.find((group) => group === 'Brown')
            );
            this.colorRed = colors.filter((color) =>
                color.group.find((group) => group === 'Red')
            );
            this.colorOrange = colors.filter((color) =>
                color.group.find((group) => group === 'Orange')
            );
            this.colorYellow = colors.filter((color) =>
                color.group.find((group) => group === 'Yellow')
            );
            this.colorGreen = colors.filter((color) =>
                color.group.find((group) => group === 'Green')
            );
            this.colorBlue = colors.filter((color) =>
                color.group.find((group) => group === 'Blue')
            );
            this.colorPurple = colors.filter((color) =>
                color.group.find((group) => group === 'Purple')
            );
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
        backgroundColorCode(value) {
            return `background-color: ${value}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`;
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
        selectedSort: function() {
            this.loadBricks(true);
        },
        keyword: function() {
            this.loadBricks(true);
        },
        partListId: function() {
            this.selectPart();
        },
    },
    beforeMount() {
        this.fillColors();

        if (this.$store.state.mode == 'standalone') {
            this.perPageOptions.unshift({ value: 8, text: '8' });
        }
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
        labelAllColor() {
            return browser.i18n.getMessage('import_sp_allColor');
        },
        labelTransColor() {
            return browser.i18n.getMessage('import_sp_transColor');
        },
        labelSinglePartList() {
            return browser.i18n.getMessage('import_sp_singlePartList');
        },
    },
};
</script>

<template>
    <b-modal
        :id="id"
        :title="brick.description"
        :header-bg-variant="headerBgVariant"
        :header-text-variant="headerTextVariant"
        centered
        hide-footer
        @ok="bricksAndPiecesFillCart()"
        @show="onShow()"
        @hidden="onHidden()"
    >
        <b-nav tabs>
            <b-nav-item :active="page == 'data'" @click="page = 'data'">
                {{ labelData }}
            </b-nav-item>
            <b-nav-item :active="page == 'chart'" @click="page = 'chart'">
                {{ labelChart }}
            </b-nav-item>
        </b-nav>
        <b-container v-if="page == 'data'">
            <b-row style="min-height: 192px;">
                <div :style="bgimage" />
            </b-row>
            <b-row class="p-1 mt-0 stripe">
                <b-col cols="4" class="p-0">{{ labelCategory }}:</b-col>
                <b-col cols="8" class="p-0 text-right">
                    {{ category.name }}
                </b-col>
            </b-row>
            <b-row class="p-1">
                <b-col cols="4" class="p-0">{{ labelElement }}:</b-col>
                <b-col cols="8" class="p-0 text-right">
                    {{ brick.itemNumber }}
                </b-col>
            </b-row>
            <b-row class="p-1 mt-0 stripe">
                <b-col cols="4" class="p-0">{{ labelDesignNumber }}:</b-col>
                <b-col cols="8" class="p-0 text-right">
                    {{ brick.designId }}
                </b-col>
            </b-row>
            <b-row class="p-1 mt-0">
                <b-col cols="4" class="p-0">{{ labelPrice }}:</b-col>
                <b-col cols="4" class="p-0 text-right">
                    {{ brick.priceAmount }} {{ brick.priceCurrency }}
                </b-col>
                <b-col
                    v-if="
                        brick.lastUpdateCountry &&
                            brick.lastUpdateCountry.substr(
                                brick.lastUpdateCountry.length - 1
                            ) == 'Z'
                    "
                    cols="4"
                    class="p-0 text-right"
                >
                    {{ new Date(brick.lastUpdateCountry) | formatDate }}
                </b-col>
                <b-col
                    v-else-if="brick.lastUpdateCountry"
                    cols="4"
                    class="p-0 text-right"
                >
                    {{ new Date(brick.lastUpdateCountry + 'Z') | formatDate }}
                </b-col>
                <b-col v-else cols="4" class="p-0 text-right">
                    -
                </b-col>
            </b-row>
            <b-row class="p-1 mt-0 stripe">
                <b-col cols="4" class="p-0">{{ labelColorBrickLink }}:</b-col>
                <b-col cols="8" class="p-0 text-right">
                    <span style="display: block" v-for="color in colors" :key="color.id">
                        <div :style="colorCode"></div>
                        <span>{{ color.brickLinkName }}</span>
                    </span>
                </b-col>
            </b-row>
            <b-row class="p-1 mt-0">
                <b-col cols="4" class="p-0">{{ labelColorLego }}:</b-col>
                <b-col cols="8" class="p-0 text-right">
                    <span style="display: block">
                        <div :style="colorCode"></div>
                        <span>{{ colors[0].legoName }}</span>
                    </span>
                </b-col>
            </b-row>
            <b-row class="p-1 mt-0 stripe" align-h="between">
                <b-col cols="5" class="p-0"> {{ labelMaxAmount }}: </b-col>
                <b-col cols="3" class="p-0 text-right" v-if="isAvailable">
                    {{ brick.maxAmount }}
                </b-col>
                <b-col cols="4" class="p-0 text-right" v-if="isAvailable">
                    {{ new Date(brick.updateDateBrick + 'Z') | formatDate }}
                </b-col>
                <b-col
                    cols="7"
                    class="text-right"
                    v-if="!isAvailable"
                    style="background-color: #dc3545; color: white; border-radius: 0.25rem; margin: 0 -5px; padding: 0 5px !important;"
                >
                    {{ labelNotInStock }}
                </b-col>
            </b-row>
            <b-row class="p-1 mt-0">
                <b-col cols="5" class="p-0"
                    >{{ labelFirstAvailability }}:</b-col
                >
                <b-col v-if="brick.firstSeen" cols="7" class="p-0 text-right">
                    {{ new Date(brick.firstSeen + 'Z') | formatDate }}
                </b-col>
                <b-col v-else cols="7" class="p-0 text-right">
                    -
                </b-col>
            </b-row>
            <b-row class="p-1 mt-0 stripe">
                <b-col cols="5" class="p-0">{{ labelLastAvailability }}:</b-col>
                <b-col
                    v-if="
                        brick.lastSeen &&
                            brick.lastSeen.substr(brick.lastSeen.length - 1) ==
                                'Z'
                    "
                    cols="7"
                    class="p-0 text-right"
                >
                    {{ new Date(brick.lastSeen) | formatDate }}
                </b-col>
                <b-col
                    v-else-if="brick.lastSeen"
                    cols="7"
                    class="p-0 text-right"
                >
                    {{ new Date(brick.lastSeen + 'Z') | formatDate }}
                </b-col>
                <b-col v-else cols="7" class="p-0 text-right">
                    -
                </b-col>
            </b-row>
            <b-row class="p-1 mt-0">
                <b-col cols="5" class="p-0">{{ labelCreateDateBrick }}:</b-col>
                <b-col cols="7" class="p-0 text-right">
                    {{ new Date(brick.createDateBrick + 'Z') | formatDate }}
                </b-col>
            </b-row>
        </b-container>
        <Chart
            v-if="page == 'chart'"
            :maxAmountDataset="maxAmountDataset"
            :priceDataset="priceDataset"
            :priceCurrency="brick.priceCurrency"
        />
    </b-modal>
</template>

<style lang="scss">
@import '../../../node_modules/bootstrap/scss/bootstrap';
.stripe {
    background-color: $gray-200;
}
</style>

<script>
import { brickColorMixin } from '@/mixins/brickColorMixin';
import BrickModal from './BrickModal';
import Chart from './Chart';
import apiBrickTwo from '@/utility/api/bricktwo.js';

export default {
    props: {
        brick: {
            type: Object,
        },
    },
    data: () => ({
        colors: null,
        headerBgVariant: 'dark',
        headerTextVariant: 'light',
        page: 'data',
        category: '',
        maxAmountDataset: null,
        priceDataset: null,
    }),
    components: {
        BrickModal,
        Chart,
    },
    mixins: [brickColorMixin],
    methods: {
        async loadBrick() {
            var response = await apiBrickTwo.getBrickAsync(
                this.brick.itemNumber,
                this.$store.state.country
            );

            if (response.maxAmount)
                this.prepareMaxAmountDataset(response.maxAmount);
            if (response.price) this.preparePriceDataset(response.price);
        },
        prepareMaxAmountDataset(maxAmounts) {
            this.maxAmountDataset = [];
            maxAmounts.map((item) => {
                this.maxAmountDataset.push({
                    x: new Date(item.dateFrom + 'Z'),
                    y: item.maxAmount,
                });

                if (item.dateFrom != item.dateTo) {
                    this.maxAmountDataset.push({
                        x: new Date(item.dateTo + 'Z'),
                        y: item.maxAmount,
                    });
                }
            });

            this.maxAmountDataset.sort((a, b) => {
                if (a.x > b.x) {
                    return 1;
                } else {
                    return -1;
                }
            });
        },
        preparePriceDataset(prices) {
            this.priceDataset = [];
            prices.map((item) => {
                this.priceDataset.push({
                    x: new Date(item.dateFrom + 'Z'),
                    y: item.priceAmount,
                });

                // only if last is not same
                if (item.dateFrom != item.dateTo) {
                    this.priceDataset.push({
                        x: new Date(item.dateTo + 'Z'),
                        y: item.priceAmount,
                    });
                }
            });

            this.priceDataset.sort((a, b) => {
                if (a.x > b.x) {
                    return 1;
                } else {
                    return -1;
                }
            });
        },
        onShow() {
            this.loadBrick();
            this.category = this.$store.getters['singleParts/getCategoryById'](
                this.brick.categoryId
            );
        },
        onHidden() {
            this.page = 'data';
        },
    },
    beforeMount() {
        this.colors = this.COLOR.filter(
            (c) =>
                c.bricksAndPiecesName.toUpperCase() ==
                this.brick.colorFamily.toUpperCase()
        ).sort((a, b) => {
            if (parseInt(a.brickLinkId) > parseInt(b.brickLinkId)) {
                return -1;
            } else {
                return 1;
            }
        });
        
        if (!this.colors.length) {
            this.colors[0] = this.COLOR.find((c) => c.brickLinkId == 0);
            this.colors[0].legoName = this.brick.colorFamily;
            this.colors[0].bricksAndPiecesName = this.brick.colorFamily;
            this.colors[0].pickABrickName = this.brick.colorFamily;
        }
    },
    computed: {
        id() {
            return `modal-${this.brick.itemNumber}`;
        },
        image() {
            //return `https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${this.brick.itemNumber}.jpg`;
            return this.brick.imageUrl;
        },
        bgimage() {
            return `background-image: url(${this.brick.imageUrl}), url('placeholder.jpg'); width: 100%; background-repeat: no-repeat; background-size: contain; background-position: center;`;
        },
        colorCode() {
            return `background-color: ${this.colors[0].colorCode}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`;
        },
        labelData() {
            return browser.i18n.getMessage('import_sp_data');
        },
        labelChart() {
            return browser.i18n.getMessage('import_sp_chart');
        },
        labelCategory() {
            return browser.i18n.getMessage('import_sp_category');
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
        labelColorBrickLink() {
            return browser.i18n.getMessage('import_sp_colorBrickLink');
        },
        labelColorLego() {
            return browser.i18n.getMessage('import_sp_colorLego');
        },
        labelMaxAmount() {
            return browser.i18n.getMessage('import_sp_maxAmount');
        },
        labelFirstAvailability() {
            return browser.i18n.getMessage('import_sp_firstAvailability');
        },
        labelLastAvailability() {
            return browser.i18n.getMessage('import_sp_lastAvailability');
        },
        labelCreateDateBrick() {
            return browser.i18n.getMessage('import_sp_indexing');
        },
        labelNotInStock() {
            return browser.i18n.getMessage('import_sp_notInStock');
        },
        labelDate() {
            return browser.i18n.getMessage('import_sp_date');
        },
        isAvailable() {
            if (!parseInt(this.brick.isAvailable)) return false;
            if (!!parseInt(this.brick.isSoldOut)) return false;
            if (this.brick.maxAmount <= 0) return false;
            if (this.brick.priceAmount <= 0) return false;
            return true;
        },
    },
};
</script>

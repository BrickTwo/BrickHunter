<template>
    <b-modal
        :id="id"
        :title="brick.description"
        :header-bg-variant="headerBgVariant"
        :header-text-variant="headerTextVariant"
        centered
        @ok="bricksAndPiecesFillCart()"
    >
        <b-nav tabs>
            <b-nav-item :active="page == 'data'" @click="page = 'data'">
                Daten
            </b-nav-item>
            <!--<b-nav-item
                :active="page == 'bricksAndPieces'"
                @click="page = 'bricksAndPieces'"
            >
                {{ labelBricksAndPieces }}
            </b-nav-item>
            <b-nav-item
                :active="page == 'pickABrick'"
                @click="page = 'pickABrick'"
            >
                {{ labelPickABrick }}
            </b-nav-item>-->
            <b-nav-item :active="page == 'chart'" @click="page = 'chart'">
                Chart
            </b-nav-item>
        </b-nav>
        <b-container @click="openBrick()" v-if="page == 'data'">
            <b-row>
                <img :src="image" width="120px" />
            </b-row>
            <b-row>Beschreibung {{ brick.description }}</b-row>
            <b-row>Element: {{ brick.itemNumber }}</b-row>
            <b-row>Designnummer: {{ brick.designId }}</b-row>
            <b-row>
                <b-col cols="1" class="p-0">
                    <img
                        :src="getFlagImgUrl(brick.country)"
                        width="20px"
                        height="15px"
                    />
                </b-col>
                <b-col cols="4">
                    {{ brick.priceAmount }} {{ brick.priceCurrency }}
                </b-col>
                <b-col cols="5" v-if="!brick.localPrice">
                    {{
                        new Date(brick.lastUpdateCountry + ' UTC') | formatDate
                    }}
                </b-col>
            </b-row>
            <b-row v-if="brick.localPrice">
                <b-col cols="1" class="p-0">
                    <img
                        :src="getFlagImgUrl($store.state.country)"
                        width="20px"
                        height="15px"
                    />
                </b-col>
                <b-col cols="4">
                    {{ brick.localPrice.priceAmount }}
                    {{ brick.localPrice.priceCurrency }}
                </b-col>
                <b-col cols="5">
                    {{
                        new Date(brick.lastUpdateCountry + ' UTC') | formatDate
                    }}
                </b-col>
            </b-row>
            <b-row>
                Farbe BrickLink:
                <span style="display: block"
                    ><div :style="colorCode"></div>
                    <span>{{ color.brickLinkName }}</span></span
                >
            </b-row>
            <b-row>
                Farbe LEGO:
                <span style="display: block"
                    ><div :style="colorCode"></div>
                    <span>{{ color.legoName }}</span></span
                >
            </b-row>
            <b-row>
                <b-col cols="5" class="p-0"
                    >Max Bestellmenge: {{ brick.maxAmount }}</b-col
                >
                <b-col cols="5">
                    {{ new Date(brick.updateDateBrick + ' UTC') | formatDate }}
                </b-col>
            </b-row>
            <b-row
                >Erstmalig Verfügbar:
                {{ new Date(brick.firstSeen + ' UTC') | formatDate }}</b-row
            >
            <b-row
                >Letztmalig Verfügbar:
                {{ new Date(brick.lastSeen + ' UTC') | formatDate }}</b-row
            >
            <b-row>Category: {{ brick.categoryId }}</b-row>
            <b-row v-if="brick.maxAmount <= 0">
                AUSVERKAUFT!
            </b-row>
        </b-container>
        <Chart
            v-if="chartLoaded && page == 'chart'"
            :chartdata="chartdata"
            :options="chartoptions"
        />
        <template #modal-footer="{ cancel, ok }">
            <b-button @click="cancel()">
                cancel
            </b-button>
            <!-- Button with custom close trigger value -->
            <b-button @click="ok()">
                ok
            </b-button>
        </template>
    </b-modal>
</template>

<script>
import { brickColorMixin } from '@/mixins/brickColorMixin';
import { requestsMixin } from '@/mixins/requestsMixin';
import BrickModal from './BrickModal';
import Chart from './Chart';

export default {
    props: {
        brick: {
            type: Object,
        },
    },
    data: () => ({
        color: null,
        headerBgVariant: 'dark',
        headerTextVariant: 'light',
        chartdata: [],
        chartoptions: {},
        chartLoaded: false,
        page: 'data',
    }),
    components: {
        BrickModal,
        Chart,
    },
    mixins: [brickColorMixin, requestsMixin],
    methods: {
        openBrick() {
            this.$bvModal.show('modal-open-lego-fill-cart');
        },
        bricksAndPiecesFillCart() {},
        cancel() {},
        ok() {},
        getFlagImgUrl(value) {
            return 'flags/' + value + '.png';
        },
        async loadBrick() {
            var response = await this.getBrickAsync(this.brick.itemNumber);

            var dataMaxAmount = [];
            response.maxAmount.map((item) => {
                dataMaxAmount.push({
                    x: new Date(item.dateFrom + 'Z'),
                    y: item.maxAmount,
                });

                dataMaxAmount.push({
                    x: new Date(item.dateTo + 'Z'),
                    y: item.maxAmount,
                });
            });

            dataMaxAmount.sort((a, b) => {
                if (a.x > b.x) {
                    return 1;
                } else {
                    return -1;
                }
            });

            var dataPrice = [];
            response.price.map((item) => {
                dataPrice.push({
                    x: new Date(item.dateFrom + 'Z'),
                    y: item.priceAmount,
                });

                // only if last is not same
                dataPrice.push({
                    x: new Date(item.dateTo + 'Z'),
                    y: item.priceAmount,
                });
            });

            dataPrice.sort((a, b) => {
                if (a.x > b.x) {
                    return 1;
                } else {
                    return -1;
                }
            });

            this.chartdata.datasets = [
                {
                    label: 'Max Amount',
                    borderColor: 'rgb(255, 0, 0)',
                    lineTension: 0,
                    fill: false,
                    data: dataMaxAmount,
                    yAxisID: 'yMaxAmount',
                },
                {
                    label: 'Price',
                    borderColor: 'rgb(0, 0, 255)',
                    lineTension: 0,
                    fill: false,
                    data: dataPrice,
                    yAxisID: 'yPrice',
                },
            ];

            this.chartoptions.response = true;
            this.chartoptions.maintainAspectRatio = false;
            /*this.chartoptions.title = {
                display: true,
                text: 'Chart.js Time Point Data',
            };*/
            this.chartoptions.animation = {
                duration: 0,
            }

            this.chartoptions.scales = {
                xAxes: [
                    {
                        type: 'time',
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Date',
                        },
                        ticks: {
                            major: {
                                enabled: true,
                            },
                            font: function(context) {
                                if (context.tick && context.tick.major) {
                                    return {
                                        style: 'bold',
                                        color: '#FF0000',
                                    };
                                }
                            },
                        },
                    },
                ],
                yAxes: [
                    {
                        id: 'yMaxAmount',
                        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: 'left',
                        scaleLabel: {
                            display: true,
                            labelString: 'Max Amount',
                        },
                        
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 200,
							// forces step size to be 5 units
							stepSize: 20
						}
                    },
                    {
                        id: 'yPrice',
                        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: 'right',

                        // grid line settings
                        gridLines: {
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Price CHF',
                        },
                        ticks: {
                            min: 0,
							// forces step size to be 5 units
							stepSize: 20
						}
                    },
                ],
            };

            this.chartLoaded = true;
        },
    },
    beforeMount() {
        this.color = this.COLOR.find(
            (c) => c.bricksAndPiecesName == this.brick.colorFamily
        );
        if (!this.color) {
            this.color = this.COLOR.find((c) => c.brickLinkId == 0);
            this.color.legoName = this.brick.colorFamily;
            this.color.bricksAndPiecesName = this.brick.colorFamily;
            this.color.pickABrickName = this.brick.colorFamily;
        }
    },
    mounted() {
        this.loadBrick();
    },
    computed: {
        id() {
            return `modal-${this.brick.itemNumber}`;
        },
        image() {
            //return `https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${this.brick.itemNumber}.jpg`;
            return this.brick.imageUrl;
        },
        colorCode() {
            return `background-color: ${this.color.colorCode}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`;
        },
    },
};
</script>

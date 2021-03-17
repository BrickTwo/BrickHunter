<template>
    <b-container>
        <b-row>
            <b-col>
                <b-form-select
                    v-model="selected"
                    :options="options"
                    @change="prepareChartOptions"
                />
            </b-col>
            <b-col class="text-center">
                <b-form-checkbox
                    v-model="showMaxAmount"
                    id="showMaxAmount"
                    name="showMaxAmount"
                    @change="prepareChartData"
                >
                    {{ labelMaxAmount }}
                </b-form-checkbox>
            </b-col>
            <b-col class="text-center">
                <b-form-checkbox
                    v-model="showPrice"
                    id="showPrice"
                    name="showPrice"
                    @change="prepareChartData"
                >
                    {{ labelPrice }}
                </b-form-checkbox>
            </b-col>
        </b-row>
        <b-row>
            <ChartCanvas
                style="width: 100%"
                :chartData="chartdata"
                :options="chartoptions"
            />
        </b-row>
    </b-container>
</template>

<script>
import ChartCanvas from './ChartCanvas';

export default {
    props: {
        maxAmountDataset: {
            type: Array,
        },
        priceDataset: {
            type: Array,
        },
        priceCurrency: {
            type: String,
        },
    },
    data: () => ({
        chartdata: [],
        chartoptions: {},
        dataMaxAmount: null,
        options: [
            { value: 1, text: browser.i18n.getMessage('import_sp_lastMonth') },
            { value: 3, text: browser.i18n.getMessage('import_sp_lastThreeMonths') },
            { value: 'all', text: browser.i18n.getMessage('import_sp_allTime') },
        ],
        selected: 1,
        showMaxAmount: true,
        showPrice: true,
    }),
    components: {
        ChartCanvas,
    },
    methods: {
        prepareChartData() {
            this.chartdata = {};
            this.chartdata.datasets = [
                {
                    label: this.labelMaxAmount,
                    borderColor: 'rgb(255, 0, 0)',
                    lineTension: 0,
                    fill: false,
                    data: this.maxAmountDataset,
                    yAxisID: 'yMaxAmount',
                },
                {
                    label: this.labelPrice,
                    borderColor: 'rgb(0, 0, 255)',
                    lineTension: 0,
                    fill: false,
                    data: this.priceDataset,
                    yAxisID: 'yPrice',
                },
            ];

            if(!this.showMaxAmount) this.chartdata.datasets[0].data = null;
            if(!this.showPrice) this.chartdata.datasets[1].data = null;
        },
        prepareChartOptions() {
            this.chartoptions.response = true;
            this.chartoptions.maintainAspectRatio = false;
            /*this.chartoptions.title = {
                display: true,
                text: 'Chart.js Time Point Data',
            };*/
            this.chartoptions.animation = {
                duration: 0,
            };

            let minDate = new Date().setMonth(
                new Date().getMonth() - this.selected
            );
            if (this.selected == 'all') {
                minDate = this.maxAmountDataset[0].x;
            }

            var maxAmountOnDisplay = this.maxAmountDataset.filter((ma) => {
                return new Date(ma.x) >= minDate;
            });

            let minValue = maxAmountOnDisplay.sort((a, b) => {
                if (parseInt(a.y) > parseInt(b.y)) {
                    return 1;
                } else {
                    return -1;
                }
            })[0].y;

            if(minValue > 0) minValue = 0;

            this.chartoptions.scales = {
                xAxes: [
                    {
                        type: 'time',
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: this.labelDate,
                        },
                        ticks: {
                            min: minDate,
                            max: this.maxAmountDataset[
                                this.maxAmountDataset.length - 1
                            ].x,
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
                            labelString: this.labelMaxAmount,
                        },

                        ticks: {
                            min: Math.floor(minValue / 10 / 2) * 2 * 10,
                            max: 220,
                            // forces step size to be 20 units
                            stepSize: 20,
                        },
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
                            labelString:
                                this.labelPrice + ' ' + this.priceCurrency,
                        },
                        /*ticks: {
                            suggestedMin: this.brick.priceAmount / 1.5,
                            suggestedMax: this.brick.priceAmount * 1.5,
                        },*/
                    },
                ],
            };

            this.chartoptions = JSON.parse(JSON.stringify(this.chartoptions));
        },
        loadBrick() {
            this.chartLoaded = true;
        },
    },
    beforeMount() {
        this.prepareChartData();
        this.prepareChartOptions();
    },
    computed: {
        labelMaxAmount() {
            return browser.i18n.getMessage('import_sp_maxAmount');
        },
        labelPrice() {
            return browser.i18n.getMessage('import_sp_price');
        },
    },
};
</script>

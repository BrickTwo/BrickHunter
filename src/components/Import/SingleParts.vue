<template>
    <b-container fluid="xl">
        <b-row>
            <b-col class="p-0" cols="3" sm="4" md="3">
                <Sidemenu
                    @partListSelected="onPartListSelected"
                    @categorySelected="onCategorySelected"
                    class="cat"
                />
            </b-col>
            <b-col class="p-0" cols="9" sm="8" md="9">
                <BrickFilter
                    :partListId="partListSeleted"
                    :categoryId="categorySelected"
                    class="cat"
                />
            </b-col>
        </b-row>
    </b-container>
</template>

<style scoped>
.cat {
    height: calc(100vh - 130px);
    min-height: 475px;
    overflow: scroll;
    overflow-x: hidden;
}
</style>

<script>
import Sidemenu from './singleParts/Sidemenu';
import BrickFilter from './singleParts/Filter';
import { requestsMixin } from '@/mixins/requestsMixin';
import Chart from './singleParts/Chart';

export default {
    data: () => ({
        partListSeleted: null,
        categorySelected: 9999999,
        chartdata: [],
        chartoptions: {},
        chartLoaded: false,
    }),
    components: {
        Sidemenu,
        BrickFilter,
        Chart,
    },
    mixins: [requestsMixin],
    methods: {
        onPartListSelected(id) {
            this.partListSeleted = id;
        },
        onCategorySelected(id) {
            this.categorySelected = parseInt(id);
        },
        async loadBrick() {
            var response = await this.getBrickAsync(6105963);

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
                    backgroundColor: 'rgb(255, 0, 0)',
                    borderColor: 'rgb(255, 0, 0)',
                    lineTension: 0,
                    fill: false,
                    data: dataMaxAmount,
                    yAxisID: 'y',
                },
                {
                    label: 'Price',
                    backgroundColor: 'rgb(0, 0, 255)',
                    borderColor: 'rgb(0, 0, 255)',
                    lineTension: 0,
                    fill: false,
                    data: dataPrice,
                    yAxisID: 'y1',
                },
            ];

            this.chartoptions.response = true;
            this.chartoptions.maintainAspectRatio = false;
            this.chartoptions.title = {
                display: true,
                text: 'Chart.js Time Point Data',
            };

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
                        id: 'y',
                        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: 'left',
                        scaleLabel: {
                            display: true,
                            labelString: 'Max Amount',
                        },
                    },
                    {
                        id: 'y1',
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
                    },
                ],
            };

            this.chartLoaded = true;
        },
    },
    computed: {},
};
</script>

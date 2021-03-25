<script>
import { Line } from 'vue-chartjs';

export default {
    extends: Line,
    props: {
        chartData: {
            type: Object,
        },
        options: {
            type: Object,
        },
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    },
    watch: {
        options: function(val, oldVal) {
            this.renderChart(this.chartData, this.options);
        },
        chartData: function(val, oldVal) {
            this.renderChart(this.chartData, this.options);
        },
        /*chartData: {
            handler(val, oldVal) {
                this.renderChart(this.chartData, this.options);
            },
            deep: true,
        },*/
    },
};
</script>

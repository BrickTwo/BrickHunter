<template>
    <b-container class="bv-example-row" fluid="xl">
        <b-row>
            <b-col>
                <b-button variant="primary" @click="onDownload">
                    {{ downloadButton }}
                </b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<style>
.row {
    margin-top: 5px;
}
.label {
    font-weight: bold;
}
</style>

<script>
export default {
    props: {
        partListId: {
            type: String,
        },
    },
    data() {
        return {
            partList: null,
        };
    },
    methods: {
        onDownload() {
            let content =
                'data:text/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(this.partList));

            const data =content;
            const link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute(
                'download',
                'BrickHunter_' + this.partList.name + '.json'
            );
            link.click();
        },
    },
    beforeMount() {
        this.partList = this.$store.getters['partList/getPartListsById'](
            this.partListId
        );
    },
    computed: {
        downloadButton() {
            return browser.i18n.getMessage('exportCsv_downloadButton');
        },
    },
};
</script>

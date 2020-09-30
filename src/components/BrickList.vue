<template>
    <vuetable
        ref="vuetable"
        :api-mode="false"
        :data="bricklist"
        :fields="columns"
    >
    </vuetable>
</template>

<script>
import Vuetable from 'vuetable-2/src/components/Vuetable';
export default {
    props: {
        bricklist: {
            type: Array,
        },
        limitMaxQty: {
            type: Number,
            default: 0,
        },
    },
    data: () => ({
        columns: [
            {
                name: '__sequence',
                title: () => browser.i18n.getMessage('brickList_lineNumber'),
                callback: 'lineNumber',
            },
            {
                name: 'itemid',
                title: () => browser.i18n.getMessage('brickList_itemId'),
            },
            {
                name: 'image',
                title: () =>
                    browser.i18n.getMessage('brickList_brickLinkImage'),
                callback: 'showImage',
            },
            {
                name: 'color.brickLinkName',
                title: () =>
                    browser.i18n.getMessage('brickList_brickLinkColor'),
            },
            {
                name: 'qty',
                title: () => browser.i18n.getMessage('brickList_quantity'),
                callback: 'showQty',
            },
            {
                name: 'pickABrick',
                title: () =>
                    browser.i18n.getMessage('brickList_pickABrickPrice'),
                callback: 'pickABrickPrice',
            },
            {
                name: 'bricksAndPieces',
                title: () =>
                    browser.i18n.getMessage('brickList_bricksAndPiecesPrice'),
                callback: 'bricksAndPiecesPrice',
            },
        ],
    }),
    components: {
        Vuetable,
    },
    methods: {
        showImage(value) {
            return `<img src="${value}" height="40">`;
        },
        pickABrickPrice(value) {
            if (!value) return '';
            if (value.isLoading) return this.spinner();

            var returnValue = `${value.variant.price.currencyCode} ${value
                .variant.price.centAmount /
                100}<br><span style="color: grey; font-size: small;">[${
                value.variant.attributes.designNumber
            }/${value.variant.id}]</span>`;
            return returnValue;
        },
        bricksAndPiecesPrice(value) {
            if (!value) return '';
            if (value.isLoading) return this.spinner();
            var returnValue = `${value.price.currency} ${value.price.amount}<br><span style="color: grey; font-size: small;">[${value.designId}/${value.itemNumber}]</span>`;
            return returnValue;
        },
        lineNumber(value) {
            //console.log(value)
            return value + 1;
        },
        showQty(value) {
            //console.log(value)
            if (this.limitMaxQty > 0) {
                if (value.order > this.limitMaxQty)
                    return `<span id="maxqty" style="color: red">${this.limitMaxQty}</span><br><span style="color: grey; font-size: small;">[${value.order}]</span>`;
                if (value.have > 0) return value.order;
            } else {
                if (value.have > 0)
                    return `<span id="maxqty">${value.min}</span><br><span style="color: grey; font-size: small;">(${value.have})</span>`;
            }
            return value.min;
        },
        spinner() {
            return '<svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" aria-label="arrow clockwise" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-arrow-clockwise b-icon bi b-icon-animation-spin" style="font-size: 150%;"><g><path fill-rule="evenodd" d="M3.17 6.706a5 5 0 0 1 7.103-3.16.5.5 0 1 0 .454-.892A6 6 0 1 0 13.455 5.5a.5.5 0 0 0-.91.417 5 5 0 1 1-9.375.789z"></path><path fill-rule="evenodd" d="M8.147.146a.5.5 0 0 1 .707 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 1 1-.707-.708L10.293 3 8.147.854a.5.5 0 0 1 0-.708z"></path></g></svg>';
        },
    },
};
</script>
